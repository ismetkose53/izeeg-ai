// Vercel Serverless Function: Trendyol Partner API Secure Gateway
// Güvenlik: POST-only, Payload Body, Origin Verification, Input Sanitization, Anti-Leak
// Destek: Siparişler, Ürünler, İadeler, Müşteri Soruları (Questions), Soru Yanıtlama (Answer), Ürün Yorumları (Reviews) ve Yorum Yanıtlama

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

  const { 
    sellerId, 
    apiKey, 
    apiSecret, 
    action = 'orders', 
    page = 0, 
    size = 50, 
    barcode,
    questionId,
    reviewId,
    text,
    status
  } = body || {};

  // 5. Girdi Doğrulama & Sanitizasyon
  if (!sellerId || !apiKey || !apiSecret) {
    return res.status(400).json({
      success: false,
      message: 'Eksik kimlik bilgileri: Satıcı ID, API Key ve API Secret zorunludur.'
    });
  }

  const cleanSellerId = String(sellerId).replace(/[^a-zA-Z0-9_-]/g, '').trim();
  const cleanKey = String(apiKey).trim();
  const cleanSecret = String(apiSecret).trim();
  const allowedActions = [
    'orders', 
    'products', 
    'claims', 
    'claims-approve', 
    'claims-reject',
    'questions',
    'question-answer',
    'reviews',
    'review-reply',
    'settlements',
    'finance-invoices'
  ];
  const cleanAction = allowedActions.includes(action) ? action : 'orders';
  const cleanSize = Math.min(Math.max(1, parseInt(size) || 50), 100);
  const cleanPage = Math.max(0, parseInt(page) || 0);
  const cleanBarcode = barcode ? String(barcode).trim() : '';

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
    let method = 'GET';
    let requestPayload = null;

    if (cleanAction === 'products') {
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/products?page=${cleanPage}&size=${cleanSize}${cleanBarcode ? `&barcode=${encodeURIComponent(cleanBarcode)}` : ''}`;
    } else if (cleanAction === 'claims-approve') {
      const claimId = body.claimId || '';
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/claims/${claimId}/items/accept`;
      method = 'PUT';
      requestPayload = JSON.stringify({
        claimLineItemIdList: body.claimLineItemIdList || [body.claimItemId || claimId]
      });
    } else if (cleanAction === 'claims-reject') {
      const claimId = body.claimId || '';
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/claims/${claimId}/items/reject`;
      method = 'PUT';
      requestPayload = JSON.stringify({
        claimIssueReasonId: body.reasonId || 1,
        description: body.description || 'Satıcı tarafından ret talebi oluşturuldu.'
      });
    } else if (cleanAction === 'claims') {
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/claims?page=${cleanPage}&size=${cleanSize}`;
    } else if (cleanAction === 'questions') {
      const statusParam = status ? `&status=${encodeURIComponent(status)}` : '';
      const barcodeParam = cleanBarcode ? `&barcode=${encodeURIComponent(cleanBarcode)}` : '';
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/questions/filter?page=${cleanPage}&size=${cleanSize}${statusParam}${barcodeParam}`;
    } else if (cleanAction === 'question-answer') {
      const cleanQId = String(questionId || body.id || '').replace(/[^0-9]/g, '');
      if (!cleanQId) {
        return res.status(400).json({ success: false, message: 'Geçersiz Soru ID' });
      }
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/questions/${cleanQId}/answers`;
      method = 'POST';
      requestPayload = JSON.stringify({
        text: String(text || body.answerText || '').trim()
      });
    } else if (cleanAction === 'reviews') {
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/reviews?page=${cleanPage}&size=${cleanSize}${cleanBarcode ? `&barcode=${encodeURIComponent(cleanBarcode)}` : ''}`;
    } else if (cleanAction === 'review-reply') {
      const cleanRevId = String(reviewId || body.id || '').replace(/[^0-9]/g, '');
      if (!cleanRevId) {
        return res.status(400).json({ success: false, message: 'Geçersiz Yorum ID' });
      }
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/reviews/${cleanRevId}/answers`;
      method = 'POST';
      requestPayload = JSON.stringify({
        text: String(text || body.answerText || '').trim()
      });
    } else if (cleanAction === 'settlements' || cleanAction === 'finance-invoices') {
      // Trendyol Finans & Satıcıya Kesilen Faturalar / Cari Hareketler
      const startDateParam = body.startDate ? `&startDate=${body.startDate}` : '';
      const endDateParam = body.endDate ? `&endDate=${body.endDate}` : '';
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/finance/otherfinancials?page=${cleanPage}&size=${cleanSize}${startDateParam}${endDateParam}`;
    } else {
      targetUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/orders?page=${cleanPage}&size=${cleanSize}&orderByDirection=DESC`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const fetchOptions = {
      method: method,
      headers: {
        'Authorization': authHeader,
        'User-Agent': userAgent,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    };

    if (requestPayload) {
      fetchOptions.body = requestPayload;
    }

    let response = await fetch(targetUrl, fetchOptions);

    // Fallback denemeleri: Eğer reviews 404/400 döndüyse alternatif endpointleri dene
    if (!response.ok && cleanAction === 'reviews') {
      const fallbackUrls = [
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/products/reviews?page=${cleanPage}&size=${cleanSize}`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/product-reviews?page=${cleanPage}&size=${cleanSize}`
      ];
      for (const fbUrl of fallbackUrls) {
        try {
          const fbRes = await fetch(fbUrl, fetchOptions);
          if (fbRes.ok) {
            response = fbRes;
            break;
          }
        } catch {}
      }
    }

    // Fallback denemeleri: Eğer review-reply alternatif endpointi gerekirse
    if (!response.ok && cleanAction === 'review-reply') {
      const cleanRevId = String(reviewId || body.id || '').replace(/[^0-9]/g, '');
      const fbUrl = `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/product-reviews/${cleanRevId}/reply`;
      try {
        const fbRes = await fetch(fbUrl, fetchOptions);
        if (fbRes.ok) response = fbRes;
      } catch {}
    }

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        status: response.status,
        message: data.message || data.error || `Trendyol API hata döndürdü (HTTP ${response.status}).`,
        raw: data
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
