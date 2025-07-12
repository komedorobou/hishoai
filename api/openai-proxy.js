// Vercel Serverless Function for OpenAI API Proxy
// ファイル位置: /api/openai-proxy.js

export default async function handler(req, res) {
  // CORS設定
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, OpenAI-Beta');

  // OPTIONSリクエストへの対応
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // リクエストボディから必要な情報を取得
    const { 
      endpoint = 'chat', 
      model, 
      messages, 
      temperature, 
      max_tokens,
      // o3系モデル用の追加パラメータ
      input,
      reasoning,
      tools,
      background,
      store,
      text
    } = req.body;
    
    // APIキーの検証
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return res.status(401).json({ error: 'Authorization header required' });
    }

    // APIキーの基本形式チェック
    const apiKey = authHeader.replace('Bearer ', '');
    if (!apiKey || apiKey.length < 20) {
      console.error('Invalid API key format');
      return res.status(401).json({ error: 'Invalid API key format' });
    }

    // o3系モデルの判定（より正確な判定）
    const isO3Model = /^(o3|o3-deep-research|o4-mini-deep-research)/.test(model);
    
    // endpoint に応じて URL を切り替え
    const apiUrl = 
      endpoint === 'responses' || isO3Model
        ? 'https://api.openai.com/v1/responses'
        : 'https://api.openai.com/v1/chat/completions';
    
    // ヘッダーの設定
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'OpenAI-Beta': 'assist'
    };

    let requestBody;

    // o3系モデルまたはresponsesエンドポイントの場合
    if (endpoint === 'responses' || isO3Model) {
      // o3系モデル用のリクエストボディ構築
      requestBody = {
        model: model || 'o3'
      };

      // inputフィールドの構築（messagesから変換）
      if (messages && messages.length > 0) {
        requestBody.input = messages.map(msg => ({
          role: msg.role,
          content: [
            { 
              type: 'input_text', 
              text: msg.content 
            }
          ]
        }));
      } else if (input) {
        // 直接inputが指定されている場合
        requestBody.input = input;
      }

      // オプションパラメータの追加
      if (reasoning) requestBody.reasoning = reasoning;
      if (tools) requestBody.tools = tools;
      if (background !== undefined) requestBody.background = background;
      if (store !== undefined) requestBody.store = store;
      if (text !== undefined) requestBody.text = text;

    } else {
      // 通常のChat Completions API用のリクエストボディ
      requestBody = {
        model: model || 'gpt-4',
        messages: messages || [],
        temperature: temperature !== undefined ? temperature : 0.7
      };

      // max_tokensが指定されている場合のみ追加
      if (max_tokens && max_tokens > 0) {
        requestBody.max_tokens = max_tokens;
      }
    }

    console.log('Proxying request to OpenAI:', {
      url: apiUrl,
      endpoint: endpoint,
      model: requestBody.model,
      isO3Model: isO3Model,
      messageCount: messages ? messages.length : 0,
      hasInput: !!requestBody.input
    });

    // OpenAI APIへのリクエスト
    const openaiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    console.log('OpenAI response status:', openaiResponse.status);

    // レスポンステキストを取得
    const responseText = await openaiResponse.text();

    // 空のレスポンスチェック
    if (!responseText) {
      console.error('Empty response from OpenAI');
      return res.status(502).json({ 
        error: 'Empty response from OpenAI API'
      });
    }

    // JSONパースを試行
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText.substring(0, 200));
      return res.status(502).json({ 
        error: 'Invalid JSON response from OpenAI',
        details: responseText.substring(0, 500)
      });
    }

    // エラーレスポンスの詳細ログ
    if (!openaiResponse.ok) {
      console.error('OpenAI API error:', {
        status: openaiResponse.status,
        error: responseData
      });
    }

    // o3系モデルのレスポンス形式を正規化（必要に応じて）
    if ((isO3Model || endpoint === 'responses') && responseData.output) {
      // outputフィールドから最後のアシスタントメッセージを抽出
      const outputs = responseData.output;
      if (Array.isArray(outputs) && outputs.length > 0) {
        const lastOutput = outputs[outputs.length - 1];
        if (lastOutput && lastOutput.content && Array.isArray(lastOutput.content)) {
          // content配列からテキストを抽出
          const textContent = lastOutput.content.find(c => c.type === 'text' || c.text);
          if (textContent && textContent.text) {
            responseData.output_text = textContent.text;
          }
        }
      }
    }

    // OpenAI APIのレスポンスをそのまま返す
    return res.status(openaiResponse.status).json(responseData);

  } catch (error) {
    console.error('Proxy error:', error);
    console.error('Error stack:', error.stack);
    
    // エラーレスポンス
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message || 'Unknown error occurred'
    });
  }
}
