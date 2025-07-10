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
      console.error('Missing or invalid authorization header');
      return res.status(401).json({ error: 'Authorization header required' });
    }

    // APIキーの基本形式チェック
    const apiKey = authHeader.replace('Bearer ', '');
    if (!apiKey.startsWith('sk-')) {
      console.error('Invalid API key format');
      return res.status(401).json({ error: 'Invalid API key format' });
    }

    // エンドポイントの決定
    let apiUrl;
    if (endpoint === 'responses') {
      apiUrl = 'https://api.openai.com/v1/beta/responses';
    } else {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
    }

    console.log('Sending request to:', apiUrl);
    console.log('Request data:', JSON.stringify(requestData, null, 2));

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

    console.log('OpenAI response status:', openaiResponse.status);
    console.log('OpenAI response headers:', Object.fromEntries(openaiResponse.headers.entries()));

    // レスポンステキストを取得
    const responseText = await openaiResponse.text();
    console.log('OpenAI response text:', responseText);

    // JSONパースを試行
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text was:', responseText);
      return res.status(500).json({ 
        error: 'Invalid JSON response from OpenAI',
        details: responseText.substring(0, 200) + '...'
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
