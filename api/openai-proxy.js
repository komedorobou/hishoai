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
    const { endpoint, ...requestData } = req.body;
    
    // APIキーの検証
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    // エンドポイントの決定
    let apiUrl;
    if (endpoint === 'responses') {
      apiUrl = 'https://api.openai.com/v1/beta/responses';
    } else {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

    // OpenAI APIへのリクエスト
    const openaiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        ...(endpoint === 'responses' && { 'OpenAI-Beta': 'responses=v1' })
      },
      body: JSON.stringify(requestData)
    });

    const responseData = await openaiResponse.json();

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