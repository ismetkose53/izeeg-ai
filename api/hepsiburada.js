// Vercel Serverless Function: Hepsiburada Merchant API Secure Gateway
// Destek: Canlı (Prod) ve Test (SIT) Ortamları, Developer User-Agent (yumey_dev), Siparişler, Ürünler, İadeler, Müşteri Soruları ve Yorumlar

export default async function handler(req, res) {
  // 1. Güvenlik Başlıkları
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  // 2. CORS Koruması
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

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Güvenlik Protokolü: Yalnızca şifrelenmiş POST istekleri kabul edilir.'
    });
  }

  // 3. Payload Ayrıştırma
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, message: 'Geçersiz JSON verisi.' });
    }
  }

  const { 
    merchantId, 
    secretKey, 
    userAgent: customUserAgent, 
    action = 'orders', 
    offset = 0, 
    limit = 50,
    questionId,
    reviewId,
    text
  } = body || {};

  if (!merchantId || !secretKey) {
    return res.status(400).json({
      success: false,
      message: 'Eksik kimlik bilgileri: Merchant ID ve Secret Key zorunludur.'
    });
  }

  const cleanMerchantId = String(merchantId).trim();
  const cleanSecret = String(secretKey).trim();
  const cleanAction = action;
  const cleanLimit = Math.min(Math.max(1, parseInt(limit) || 50), 100);
  const cleanOffset = Math.max(0, parseInt(offset) || 0);

  // User-Agent: Hepsiburada'nın kayıtlı Developer Username'i (varsayılan: yumey_dev)
  const userAgent = (customUserAgent && String(customUserAgent).trim()) || 'yumey_dev';

  // 4. Basic Auth
  const authHeader = 'Basic ' + Buffer.from(`${cleanMerchantId}:${cleanSecret}`).toString('base64');

  // 5. Hepsiburada Olası API Uç Noktaları
  let candidateUrls = [];
  let method = 'GET';
  let requestPayload = null;

  if (cleanAction === 'products') {
    candidateUrls = [
      `https://listing-external.hepsiburada.com/listings/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://listing-external-sit.hepsiburada.com/listings/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://mpop.hepsiburada.com/product/api/products/all?merchantId=${cleanMerchantId}&offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://mpop-sit.hepsiburada.com/product/api/products/all?merchantId=${cleanMerchantId}&offset=${cleanOffset}&limit=${cleanLimit}`
    ];
  } else if (cleanAction === 'returns' || cleanAction === 'claims') {
    candidateUrls = [
      `https://oms-external.hepsiburada.com/returns/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://oms-external-sit.hepsiburada.com/returns/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://claim-external.hepsiburada.com/claims/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://claim-external-sit.hepsiburada.com/claims/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://mpop.hepsiburada.com/returns/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`
    ];
  } else if (cleanAction === 'questions') {
    candidateUrls = [
      `https://mpop.hepsiburada.com/qa/api/questions/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://qa-external.hepsiburada.com/questions/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://mpop-sit.hepsiburada.com/qa/api/questions/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`
    ];
  } else if (cleanAction === 'question-answer') {
    method = 'POST';
    const cleanQId = String(questionId || body.id || '').trim();
    requestPayload = JSON.stringify({ text: String(text || body.answerText || '').trim() });
    candidateUrls = [
      `https://mpop.hepsiburada.com/qa/api/questions/${cleanQId}/answers`,
      `https://qa-external.hepsiburada.com/questions/${cleanQId}/answers`
    ];
  } else if (cleanAction === 'reviews') {
    candidateUrls = [
      `https://mpop.hepsiburada.com/reviews/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://listing-external.hepsiburada.com/reviews/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`
    ];
  } else if (cleanAction === 'review-reply') {
    method = 'POST';
    const cleanRevId = String(reviewId || body.id || '').trim();
    requestPayload = JSON.stringify({ text: String(text || body.answerText || '').trim() });
    candidateUrls = [
      `https://mpop.hepsiburada.com/reviews/${cleanRevId}/reply`,
      `https://listing-external.hepsiburada.com/reviews/${cleanRevId}/reply`
    ];
  } else if (cleanAction === 'settlements' || cleanAction === 'finance-invoices') {
    candidateUrls = [
      `https://finance-external.hepsiburada.com/reconciliation/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://mpop.hepsiburada.com/finance/api/invoices?merchantId=${cleanMerchantId}`,
      `https://finance-external-sit.hepsiburada.com/reconciliation/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`
    ];
  } else {
    // Sipariş & Paket Uç Noktaları
    candidateUrls = [
      `https://oms-external.hepsiburada.com/packages/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://oms-external-sit.hepsiburada.com/packages/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://oms-external.hepsiburada.com/orders/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://oms-external-sit.hepsiburada.com/orders/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`,
      `https://mpop.hepsiburada.com/orders/merchantid/${cleanMerchantId}?offset=${cleanOffset}&limit=${cleanLimit}`
    ];
  }

  let lastStatus = 403;
  let lastErrorData = null;

  for (const targetUrl of candidateUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const fetchOptions = {
        method: method,
        headers: {
          'Authorization': authHeader,
          'User-Agent': userAgent,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      };

      if (requestPayload) {
        fetchOptions.body = requestPayload;
      }

      const response = await fetch(targetUrl, fetchOptions);

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        return res.status(200).json({
          success: true,
          data: data,
          endpoint: targetUrl,
          userAgentUsed: userAgent
        });
      } else {
        lastStatus = response.status;
        lastErrorData = await response.json().catch(() => ({}));
      }
    } catch (e) {
      console.warn(`Hepsiburada fetch fallback for ${targetUrl}:`, e.message || e);
    }
  }

  // 403 Hatası Teşhisi ve Kullanıcıya Çözüm Rehberi
  if (lastStatus === 401 || lastStatus === 403) {
    return res.status(403).json({
      success: false,
      status: 403,
      message: `Hepsiburada API Yetkilendirme Hatası (HTTP 403): User-Agent '${userAgent}' veya Secret Key doğrulanamadı. Lütfen Hepsiburada Satıcı Paneli > Entegrasyon > API Entegratör kısmında User-Agent adınızın '${userAgent}' olarak kayıtlı olduğunu kontrol ediniz.`,
      details: lastErrorData
    });
  }

  return res.status(lastStatus || 500).json({
    success: false,
    status: lastStatus,
    message: lastErrorData?.message || `Hepsiburada API sunucusu hata döndürdü (HTTP ${lastStatus}).`,
    raw: lastErrorData
  });
}
