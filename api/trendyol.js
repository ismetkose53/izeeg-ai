// Vercel Serverless Function: Trendyol Partner API Proxy
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { sellerId, apiKey, apiSecret, action = 'orders', page = 0, size = 50 } = req.query;

  if (!sellerId || !apiKey || !apiSecret) {
    return res.status(400).json({
      success: false,
      message: 'Eksik kimlik bilgileri: sellerId, apiKey ve apiSecret zorunludur.'
    });
  }

  const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  const userAgent = `${sellerId} - SelfIntegration`;

  try {
    let targetUrl = '';
    if (action === 'products') {
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${sellerId}/products?page=${page}&size=${size}`;
    } else {
      // action === 'orders'
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${sellerId}/orders?page=${page}&size=${size}&orderByDirection=DESC`;
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'User-Agent': userAgent,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        status: response.status,
        message: data.message || data.error || 'Trendyol API bağlantı hatası.',
        raw: data
      });
    }

    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Sunucu bağlantı hatası: ' + (error.message || error)
    });
  }
}
