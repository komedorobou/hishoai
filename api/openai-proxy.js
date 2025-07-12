// ===================================================================
// HishoAI Enhanced - OpenAI API Proxy (動作確認済み完全版)
// Vercel Serverless Function for OpenAI API Proxy
// ファイル位置: /api/openai-proxy.js
// ===================================================================

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
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'このエンドポイントはPOSTメソッドのみサポートしています' 
    });
  }

  try {
    // リクエストボディから必要な情報を取得（Deep Research完全対応）
    const { 
      endpoint = 'chat', 
      model, 
      messages, 
      temperature, 
      max_tokens,
      // Deep Research API専用パラメータ
      input,
      reasoning,
      tools,
      background = false,
      // 音声・画像処理用パラメータ
      file,
      prompt,
      response_format,
      language
    } = req.body;
    
    // APIキーの検証
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return res.status(401).json({ 
        error: 'Authorization header required',
        message: 'APIキーが設定されていません。左メニューの「API設定」から設定してください。'
      });
    }

    // APIキーの基本形式チェック
    const apiKey = authHeader.replace('Bearer ', '');
    if (!apiKey || apiKey.length < 20) {
      console.error('Invalid API key format');
      return res.status(401).json({ 
        error: 'Invalid API key format',
        message: '無効なAPIキー形式です。正しいOpenAI APIキーを設定してください。'
      });
    }

    // endpoint に応じて URL を切り替え（全API対応）
    let apiUrl;
    switch (endpoint) {
      case 'responses':
        apiUrl = 'https://api.openai.com/v1/responses';
        break;
      case 'chat':
        apiUrl = 'https://api.openai.com/v1/chat/completions';
        break;
      case 'transcriptions':
        apiUrl = 'https://api.openai.com/v1/audio/transcriptions';
        break;
      case 'translations':
        apiUrl = 'https://api.openai.com/v1/audio/translations';
        break;
      case 'images':
        apiUrl = 'https://api.openai.com/v1/images/generations';
        break;
      default:
        apiUrl = 'https://api.openai.com/v1/chat/completions';
    }
    
    // ヘッダーの設定（エンドポイント別最適化）
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    // Deep Research用の特別ヘッダー
    if (endpoint === 'responses') {
      headers['OpenAI-Beta'] = 'assist';
    }

    // リクエストボディの構築（endpointに応じて完全切り替え）
    let requestBody;
    
    if (endpoint === 'responses') {
      // ===== Deep Research API用のボディ構造 =====
      requestBody = {
        model: model || 'o3-deep-research-2025-06-26'
      };
      
      // input設定（messagesからの変換対応）
      if (input) {
        requestBody.input = input;
      } else if (messages) {
        // 従来のmessages形式をinput形式に変換
        requestBody.input = messages.map(msg => ({
          role: msg.role === 'system' ? 'developer' : msg.role,
          content: Array.isArray(msg.content) ? msg.content : [
            { type: 'input_text', text: msg.content }
          ]
        }));
      } else {
        return res.status(400).json({ 
          error: 'Missing input or messages for Deep Research API',
          message: 'Deep Research APIには input または messages が必要です'
        });
      }
      
      // temperature設定
      if (temperature !== undefined) {
        requestBody.temperature = temperature;
      } else {
        requestBody.temperature = 0.2; // Deep Research用デフォルト
      }
      
      // reasoning設定（Deep Research特有）
      if (reasoning) {
        requestBody.reasoning = reasoning;
      } else {
        requestBody.reasoning = { summary: "auto" };
      }
      
      // tools設定（Deep Research特有）
      if (tools && Array.isArray(tools)) {
        requestBody.tools = tools;
      } else {
        requestBody.tools = [{ type: "web_search_preview" }];
      }
      
      // background実行設定（タイムアウト回避）
      if (background) {
        requestBody.background = true;
      }
      
    } else if (endpoint === 'transcriptions' || endpoint === 'translations') {
      // ===== 音声API用（簡略版 - FormDataは複雑なため基本対応のみ） =====
      requestBody = {
        model: model || 'whisper-1',
        file: file,
        prompt: prompt,
        response_format: response_format || 'json',
        temperature: temperature || 0,
        language: language
      };
      
    } else if (endpoint === 'images') {
      // ===== 画像生成API用 =====
      requestBody = {
        model: model || 'dall-e-3',
        prompt: prompt || '',
        n: 1,
        size: '1024x1024'
      };
      
    } else {
      // ===== 従来のChat Completions API用のボディ構造 =====
      requestBody = {
        model: model || 'gpt-4o',
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
      model: requestBody.model || model,
      messageCount: endpoint === 'responses' ? 
        (requestBody.input ? requestBody.input.length : 0) : 
        (messages ? messages.length : 0),
      hasTools: endpoint === 'responses' && requestBody.tools,
      backgroundMode: endpoint === 'responses' && requestBody.background
    });

    // タイムアウト設定（エンドポイント別）
    let timeoutMs;
    switch (endpoint) {
      case 'responses':
        timeoutMs = 300000; // Deep Research: 5分（Vercel制限内）
        break;
      case 'transcriptions':
      case 'translations':
        timeoutMs = 120000; // 音声処理: 2分
        break;
      default:
        timeoutMs = 30000; // その他: 30秒
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // OpenAI APIへのリクエスト
      const fetchOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      };

      const openaiResponse = await fetch(apiUrl, fetchOptions);

      clearTimeout(timeoutId);

      console.log('OpenAI response status:', openaiResponse.status);

      // レスポンステキストを取得
      const responseText = await openaiResponse.text();

      // 空のレスポンスチェック
      if (!responseText) {
        console.error('Empty response from OpenAI');
        return res.status(502).json({ 
          error: 'Empty response from OpenAI API',
          message: 'OpenAI APIから空のレスポンスが返されました'
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
          message: 'OpenAI APIから無効なレスポンスが返されました',
          details: responseText.substring(0, 500)
        });
      }

      // エンドポイント別エラーハンドリング
      if (!openaiResponse.ok) {
        console.error(`${endpoint} API error:`, responseData);
        
        // 共通エラーの詳細化
        let errorMessage = responseData.error?.message || 'Unknown API error';
        let userMessage = errorMessage;
        
        switch (openaiResponse.status) {
          case 400:
            userMessage = `リクエストエラー: ${errorMessage}`;
            if (endpoint === 'responses') {
              userMessage += '\nDeep Research APIのパラメータを確認してください';
            }
            break;
            
          case 401:
            userMessage = 'APIキーが無効です。正しいAPIキーを設定してください';
            break;
            
          case 403:
            userMessage = 'このAPIへのアクセスが拒否されました。APIキーの権限を確認してください';
            break;
            
          case 429:
            userMessage = 'API利用制限に達しました。しばらく時間をおいて再試行してください';
            if (endpoint === 'responses') {
              userMessage += '\nDeep Research APIは使用量制限が厳しく設定されています';
            }
            break;
            
          case 500:
          case 502:
          case 503:
            userMessage = 'OpenAI APIでサーバーエラーが発生しました。しばらく時間をおいて再試行してください';
            break;
            
          default:
            userMessage = `API エラー (${openaiResponse.status}): ${errorMessage}`;
        }
        
        return res.status(openaiResponse.status).json({ 
          error: responseData.error?.type || 'api_error',
          message: userMessage,
          originalError: errorMessage,
          endpoint: endpoint
        });
      }

      // 成功レスポンスの処理
      console.log(`✅ ${endpoint} API request successful`);
      
      // Deep Research APIの特別な処理
      if (endpoint === 'responses') {
        // 使用量情報の追加
        if (responseData.usage) {
          console.log('Deep Research usage:', responseData.usage);
        }
        
        // 結果の検証
        if (!responseData.output && !responseData.choices) {
          console.warn('Deep Research response missing expected output');
        }
      }

      // OpenAI APIのレスポンスをそのまま返す
      return res.status(200).json(responseData);

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Request timeout');
        let timeoutMessage = 'リクエストがタイムアウトしました';
        
        switch (endpoint) {
          case 'responses':
            timeoutMessage = 'Deep Research処理がタイムアウトしました（5分制限）。より簡潔なテーマで再試行してください';
            break;
          case 'transcriptions':
          case 'translations':
            timeoutMessage = '音声処理がタイムアウトしました（2分制限）。より短い音声ファイルで再試行してください';
            break;
          default:
            timeoutMessage = 'リクエストがタイムアウトしました（30秒制限）';
        }
        
        return res.status(408).json({ 
          error: 'Request timeout',
          message: timeoutMessage,
          endpoint: endpoint
        });
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('Proxy error:', error);
    console.error('Error stack:', error.stack);
    
    // より詳細なエラーレスポンス
    const errorResponse = {
      error: 'Internal server error',
      message: error.message || 'Unknown error occurred',
      endpoint: req.body.endpoint || 'unknown'
    };
    
    // ネットワークエラーの特別処理
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorResponse.message = 'OpenAI APIへの接続に失敗しました';
      errorResponse.details = 'ネットワーク接続を確認してください';
    }
    
    // リクエストサイズエラー
    if (error.code === 'EMSGSIZE' || error.message.includes('too large')) {
      errorResponse.message = 'リクエストサイズが大きすぎます';
      errorResponse.details = 'ファイルサイズまたはテキスト長を減らして再試行してください';
    }
    
    return res.status(500).json(errorResponse);
  }
}
