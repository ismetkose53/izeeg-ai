// Vercel Serverless Function: Hepsiburada Merchant API Proxy
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

  const { merchantId, secretKey, action = 'orders', offset = 0, limit = 50 } = req.query;

  if (!merchantId || !secretKey) {
    return res.status(400).json({
      success: false,
      message: 'Eksik kimlik bilgileri: merchantId ve secretKey zorunludur.'
    });
  }

  const authHeader = 'Basic ' + Buffer.from(`${merchantId}:${secretKey}`).toString('base64');
  const userAgent = `${merchantId}_izeeg`;

  try {
    let targetUrl = '';
    if (action === 'products') {
      targetUrl = `https://mpop.hepsiburada.com/product/api/products/all?merchantId=${merchantId}&offset=${offset}&limit=${limit}`;
    } else {
      // action === 'orders'
      targetUrl = `https://mpop.hepsiburada.com/orders/merchantid/${merchantId}?offset=${offset}&limit=${limit}`;
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
        message: data.message || data.error || 'Hepsiburada API bağlantı hatası.',
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
