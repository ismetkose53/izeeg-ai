// Vercel Serverless Function: Trendyol Partner API Secure Gateway
// Güvenlik: POST-only, Payload Body, Origin Verification, Input Sanitization, Anti-Leak

export default async function handler(req, res) {
  // 1. Güvenlik Başlıkları
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  // 2. CORS Koruması: Sadece Yetkili Origin veya Same-Origin Kabul Et
  const origin = req.headers.origin || '';
  const isAllowedOrigin = 
    !origin || 
    origin.includes('localhost') || 
    origin.includes('127.0.0.1') || 
    origin.includes('.vercel.app') || 
    origin.includes('izeeg.com');

  if (isAllowedOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Yalnızca POST Metodu Kabul Edilir (GET ile URL üzerinden API Key ifşası engellenir)
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Güvenlik Protokolü: Yalnızca şifrelenmiş POST istekleri kabul edilir.'
    });
  }

  // 4. Payload ve Gövde Ayrıştırma
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, message: 'Geçersiz JSON verisi.' });
    }
  }

  const { sellerId, apiKey, apiSecret, action = 'orders', page = 0, size = 50 } = body || {};

  // 5. Girdi Doğrulama & Sanitizasyon (SSRF / SQLi / Header Injection Koruması)
  if (!sellerId || !apiKey || !apiSecret) {
    return res.status(400).json({
      success: false,
      message: 'Eksik kimlik bilgileri: Satıcı ID, API Key ve API Secret zorunludur.'
    });
  }

  const cleanSellerId = String(sellerId).replace(/[^a-zA-Z0-9_-]/g, '').trim();
  const cleanKey = String(apiKey).trim();
  const cleanSecret = String(apiSecret).trim();
  const cleanAction = action === 'products' ? 'products' : 'orders';
  const cleanSize = Math.min(Math.max(1, parseInt(size) || 50), 100);
  const cleanPage = Math.max(0, parseInt(page) || 0);

  if (!cleanSellerId || cleanKey.length < 5 || cleanSecret.length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Geçersiz API kimlik bilgileri formatı.'
    });
  }

  // 6. Basic Auth ve Header Oluşturma
  const authHeader = 'Basic ' + Buffer.from(`${cleanKey}:${cleanSecret}`).toString('base64');
  const userAgent = `${cleanSellerId} - SelfIntegration`;

  try {
    let targetUrl = '';
    if (cleanAction === 'products') {
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/products?page=${cleanPage}&size=${cleanSize}`;
    } else {
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/orders?page=${cleanPage}&size=${cleanSize}&orderByDirection=DESC`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'User-Agent': userAgent,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        status: response.status,
        message: data.message || data.error || `Trendyol API hata döndürdü (HTTP ${response.status}).`
      });
    }

    return res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    return res.status(isTimeout ? 504 : 500).json({
      success: false,
      message: isTimeout 
        ? 'Trendyol sunucusu zaman aşımına uğradı (12sn).' 
        : 'Bağlantı hatası oluştu.'
    });
  }
}
