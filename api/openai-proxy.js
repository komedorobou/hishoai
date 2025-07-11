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
    const { model, messages, temperature, max_tokens } = req.body;
    
    // APIキーの検証
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return res.status(401).json({ error: 'Authorization header required' });
    }

    // APIキーの基本形式チェック
    const apiKey = authHeader.replace('Bearer ', '');
    if (!apiKey.startsWith('sk-')) {
      console.error('Invalid API key format');
      return res.status(401).json({ error: 'Invalid API key format' });
    }

    // 常に標準のChat Completionsエンドポイントを使用
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    };

    // リクエストボディの構築
    const requestBody = {
      model: model || 'gpt-4',
      messages: messages,
      temperature: temperature || 0.7
    };

    // max_tokensが指定されている場合のみ追加
    if (max_tokens) {
      requestBody.max_tokens = max_tokens;
    }

    console.log('API URL:', apiUrl);
    console.log('Request model:', requestBody.model);
    console.log('Message count:', messages ? messages.length : 0);

    // OpenAI APIへのリクエスト
    const openaiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    console.log('OpenAI response status:', openaiResponse.status);

    // レスポンステキストを取得
    const responseText = await openaiResponse.text();

    // JSONパースを試行
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text was:', responseText);
      return res.status(500).json({ 
        error: 'Invalid JSON response from OpenAI',
        details: responseText.substring(0, 500)
      });
    }

    // OpenAI APIのレスポンスをそのまま返す
    res.status(openaiResponse.status).json(responseData);

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
}
