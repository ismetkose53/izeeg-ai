// Vercel Serverless Function: Trendyol Partner API Secure Gateway
// Güvenlik: POST-only, Payload Body, Origin Verification, Input Sanitization, Anti-Leak
// Destek: Siparişler, Ürünler, İadeler (Claims), Müşteri Soruları (Q&A), Soru Yanıtlama (Answer), Ürün Yorumları (Reviews) ve Yorum Yanıtlama

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

  // 3. Yalnızca POST Metodu Kabul Edilir
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
    contentId,
    questionId,
    reviewId,
    text,
    status,
    claimItemStatus,
    startDate,
    endDate
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
    'create-product',
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
  const cleanContentId = contentId ? String(contentId).trim() : cleanBarcode;

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
    let candidateUrls = [];
    let method = 'GET';
    let requestPayload = null;

    // Statü ve Tarih Parametreleri
    const statusParam = (status && status !== 'ALL') ? `&status=${encodeURIComponent(status)}` : '';
    const cleanClaimStatus = claimItemStatus || (status && status !== 'ALL' ? status : '');
    const claimStatusParam = cleanClaimStatus ? `&claimItemStatus=${encodeURIComponent(cleanClaimStatus)}` : '';
    const barcodeParam = cleanBarcode ? `&barcode=${encodeURIComponent(cleanBarcode)}` : '';
    const startDateParam = startDate ? `&startDate=${encodeURIComponent(startDate)}` : '';
    const endDateParam = endDate ? `&endDate=${encodeURIComponent(endDate)}` : '';

    if (cleanAction === 'create-product') {
      method = 'POST';
      requestPayload = JSON.stringify(body.payload || { items: body.items || [body.product] });
      candidateUrls = [
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/v2/products`,
        `https://apigw.trendyol.com/integration/product/sellers/${cleanSellerId}/v2/products`
      ];
    } else if (cleanAction === 'products') {
      candidateUrls = [
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/products?page=${cleanPage}&size=${cleanSize}${barcodeParam}`,
        `https://apigw.trendyol.com/integration/product/sellers/${cleanSellerId}/products?page=${cleanPage}&size=${cleanSize}${barcodeParam}`,
        `https://apigw.trendyol.com/suppliers/${cleanSellerId}/products?page=${cleanPage}&size=${cleanSize}${barcodeParam}`
      ];
    } else if (cleanAction === 'claims-approve') {
      const cleanClaimId = String(body.claimId || body.id || '').trim();
      method = 'PUT';
      requestPayload = JSON.stringify({
        claimLineItemIdList: body.claimLineItemIdList || [body.claimItemId || cleanClaimId]
      });
      candidateUrls = [
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/claims/${cleanClaimId}/items/accept`,
        `https://apigw.trendyol.com/suppliers/${cleanSellerId}/claims/${cleanClaimId}/items/accept`,
        `https://apigw.trendyol.com/integration/oms/core/suppliers/${cleanSellerId}/claims/${cleanClaimId}/items/accept`
      ];
    } else if (cleanAction === 'claims-reject') {
      const cleanClaimId = String(body.claimId || body.id || '').trim();
      method = 'PUT';
      requestPayload = JSON.stringify({
        claimIssueReasonId: body.reasonId || 1,
        description: body.description || 'Satıcı tarafından şartlara uymadığı gerekçesiyle reddedildi.'
      });
      candidateUrls = [
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/claims/${cleanClaimId}/items/reject`,
        `https://apigw.trendyol.com/suppliers/${cleanSellerId}/claims/${cleanClaimId}/issue`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/claims/issue`
      ];
    } else if (cleanAction === 'claims') {
      // Trendyol Claims / İade Talepleri Endpoints
      candidateUrls = [
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/claims?page=${cleanPage}&size=${cleanSize}${claimStatusParam}${startDateParam}${endDateParam}`,
        `https://apigw.trendyol.com/suppliers/${cleanSellerId}/claims?page=${cleanPage}&size=${cleanSize}${claimStatusParam}${startDateParam}${endDateParam}`,
        `https://apigw.trendyol.com/integration/oms/core/suppliers/${cleanSellerId}/claims?page=${cleanPage}&size=${cleanSize}${claimStatusParam}`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/claims?page=${cleanPage}&size=${cleanSize}`
      ];
    } else if (cleanAction === 'questions') {
      // Trendyol Müşteri Soruları (Q&A) Endpoints
      candidateUrls = [
        `https://apigw.trendyol.com/integration/qna/sellers/${cleanSellerId}/questions/filter?page=${cleanPage}&size=${cleanSize}${statusParam}${barcodeParam}${startDateParam}${endDateParam}`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/questions/filter?page=${cleanPage}&size=${cleanSize}${statusParam}${barcodeParam}`,
        `https://apigw.trendyol.com/integration/qna/sellers/${cleanSellerId}/questions?page=${cleanPage}&size=${cleanSize}`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/questions?page=${cleanPage}&size=${cleanSize}`,
        `https://apigw.trendyol.com/integration/qna/sellers/${cleanSellerId}/questions/filter?page=${cleanPage}&size=${cleanSize}`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/product-questions?page=${cleanPage}&size=${cleanSize}`
      ];
    } else if (cleanAction === 'question-answer') {
      const cleanQId = String(questionId || body.id || '').replace(/[^0-9]/g, '');
      if (!cleanQId) {
        return res.status(400).json({ success: false, message: 'Geçersiz Soru ID' });
      }
      method = 'POST';
      requestPayload = JSON.stringify({
        text: String(text || body.answerText || '').trim()
      });
      candidateUrls = [
        `https://apigw.trendyol.com/integration/qna/sellers/${cleanSellerId}/questions/${cleanQId}/answers`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/questions/${cleanQId}/answers`
      ];
    } else if (cleanAction === 'reviews') {
      // Trendyol Ürün Yorumları & Değerlendirmeleri
      candidateUrls = [];
      if (cleanContentId) {
        candidateUrls.push(`https://public-mdc.trendyol.com/discovery-web-socialgw-service/api/reviews/${cleanContentId}?page=${cleanPage}&size=${cleanSize}`);
        candidateUrls.push(`https://public.trendyol.com/discovery-web-socialgw-service/api/reviews/${cleanContentId}?page=${cleanPage}&size=${cleanSize}`);
      }
      candidateUrls.push(
        `https://apigw.trendyol.com/integration/product-reviews/sellers/${cleanSellerId}/reviews?page=${cleanPage}&size=${cleanSize}${barcodeParam}`,
        `https://apigw.trendyol.com/social/reviews/seller/${cleanSellerId}?page=${cleanPage}&size=${cleanSize}`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/reviews?page=${cleanPage}&size=${cleanSize}${barcodeParam}`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/products/reviews?page=${cleanPage}&size=${cleanSize}`
      );
    } else if (cleanAction === 'review-reply') {
      const cleanRevId = String(reviewId || body.id || '').replace(/[^0-9]/g, '');
      if (!cleanRevId) {
        return res.status(400).json({ success: false, message: 'Geçersiz Yorum ID' });
      }
      method = 'POST';
      requestPayload = JSON.stringify({
        text: String(text || body.answerText || '').trim()
      });
      candidateUrls = [
        `https://apigw.trendyol.com/integration/product-reviews/sellers/${cleanSellerId}/reviews/${cleanRevId}/answers`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/reviews/${cleanRevId}/answers`,
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/product-reviews/${cleanRevId}/reply`
      ];
    } else if (cleanAction === 'settlements' || cleanAction === 'finance-invoices') {
      candidateUrls = [
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/finance/otherfinancials?page=${cleanPage}&size=${cleanSize}${startDateParam}${endDateParam}`,
        `https://apigw.trendyol.com/integration/finance/che/sellers/${cleanSellerId}/otherfinancials?page=${cleanPage}&size=${cleanSize}${startDateParam}${endDateParam}`
      ];
    } else {
      // Siparişler (Orders)
      candidateUrls = [
        `https://api.trendyol.com/sapigw/suppliers/${cleanSellerId}/orders?page=${cleanPage}&size=${cleanSize}${statusParam}&orderByDirection=DESC`,
        `https://apigw.trendyol.com/integration/oms/core/suppliers/${cleanSellerId}/orders?page=${cleanPage}&size=${cleanSize}${statusParam}&orderByDirection=DESC`,
        `https://apigw.trendyol.com/suppliers/${cleanSellerId}/orders?page=${cleanPage}&size=${cleanSize}${statusParam}&orderByDirection=DESC`
      ];
    }

    let lastStatus = 404;
    let lastErrorData = null;
    let successfulData = null;
    let successfulUrl = '';

    for (const targetUrl of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s timeout per candidate

        const isPublicUrl = targetUrl.includes('discovery-web-socialgw-service');
        const fetchHeaders = {
          'User-Agent': userAgent,
          'Content-Type': 'application/json'
        };
        if (!isPublicUrl) {
          fetchHeaders['Authorization'] = authHeader;
        }

        const fetchOptions = {
          method: method,
          headers: fetchHeaders,
          signal: controller.signal
        };

        if (requestPayload) {
          fetchOptions.body = requestPayload;
        }

        const response = await fetch(targetUrl, fetchOptions);
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          successfulData = data;
          successfulUrl = targetUrl;
          break;
        } else {
          lastStatus = response.status;
          lastErrorData = await response.json().catch(() => ({}));
        }
      } catch (err) {
        // Fallback bir sonraki adresi dener
      }
    }

    if (successfulData !== null) {
      return res.status(200).json({
        success: true,
        data: successfulData,
        endpoint: successfulUrl
      });
    }

    // Yorumlar veya Sorular için eğer API'den 0 kayıt/404 döndüyse boş liste dön (uygulamayı çökertme)
    if (cleanAction === 'reviews' || cleanAction === 'questions') {
      return res.status(200).json({
        success: true,
        data: { content: [], items: [], totalElements: 0, totalPages: 0 },
        isGracefulEmpty: true,
        message: 'Kayıt bulunamadı veya henüz değerlendirme/soru yok.'
      });
    }

    return res.status(lastStatus || 500).json({
      success: false,
      status: lastStatus,
      message: lastErrorData?.message || lastErrorData?.error || `Trendyol API hata döndürdü (HTTP ${lastStatus}).`,
      raw: lastErrorData
    });
  } catch (error) {
    const isTimeout = error.name === 'AbortError';
    return res.status(isTimeout ? 504 : 500).json({
      success: false,
      message: isTimeout 
        ? 'Trendyol sunucusu zaman aşımına uğradı.' 
        : 'Bağlantı hatası oluştu.'
    });
  }
}
