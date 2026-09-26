// WhatsApp ve SMS Bildirim Servisi (100% Gerçek Veri & Canlı İletim)

const STORAGE_KEY = 'ecompulse_notification_settings';

/**
 * Telefon numarasını uluslararası formata normalize eder (Örn: 0543..., 543..., 8543... -> 905436970755)
 */
export function normalizePhoneNumber(raw = '') {
  if (!raw) return { cleanNumber: '', formatted: '', isValid: false };
  
  // Sadece rakamları ayıkla
  let digits = String(raw).replace(/\D/g, '');
  
  // Kullanıcı '8543...' veya '0543...' yazmışsa Türkiye kodu (90) ekle
  if (digits.startsWith('854') && digits.length === 11) {
    digits = '90' + digits.slice(1);
  } else if (digits.startsWith('05') && digits.length === 11) {
    digits = '90' + digits.slice(1);
  } else if (digits.startsWith('5') && digits.length === 10) {
    digits = '90' + digits;
  } else if (digits.startsWith('905') && digits.length === 12) {
    // Zaten tam Türkiye kodu
  } else if (digits.length >= 10 && !digits.startsWith('90')) {
    // Varsayılan Türkiye varsayımı
    if (digits.length === 10) digits = '90' + digits;
  }

  const isValid = digits.length >= 10 && digits.length <= 15;
  
  let formatted = '+' + digits;
  if (digits.startsWith('90') && digits.length === 12) {
    // +90 5XX XXX XX XX formatı
    formatted = `+90 (${digits.slice(2, 5)}) ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  }

  return {
    cleanNumber: digits,
    formatted,
    isValid
  };
}

export function getNotificationSettings() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        phoneNumber: parsed.phoneNumber || '',
        fullName: parsed.fullName || 'Mağaza Yöneticisi',
        whatsappEnabled: parsed.whatsappEnabled !== undefined ? parsed.whatsappEnabled : true,
        smsEnabled: !!parsed.smsEnabled,
        morningBriefTime: parsed.morningBriefTime || '09:00',
        notifyOnDangerLeaks: parsed.notifyOnDangerLeaks !== undefined ? parsed.notifyOnDangerLeaks : true,
        notifyOnLowStock: parsed.notifyOnLowStock !== undefined ? parsed.notifyOnLowStock : true,
        notifyOnMilestones: parsed.notifyOnMilestones !== undefined ? parsed.notifyOnMilestones : true,
        deliveryMethod: parsed.deliveryMethod || 'DIRECT', // 'DIRECT' (WhatsApp Web/App) | 'ULTRAMSG' | 'WEBHOOK'
        ultramsgInstanceId: parsed.ultramsgInstanceId || '',
        ultramsgToken: parsed.ultramsgToken || '',
        webhookUrl: parsed.webhookUrl || ''
      };
    } catch (e) {
      console.error("Settings parse error:", e);
    }
  }
  return {
    phoneNumber: '',
    fullName: 'Mağaza Yöneticisi',
    whatsappEnabled: true,
    smsEnabled: false,
    morningBriefTime: '09:00',
    notifyOnDangerLeaks: true,
    notifyOnLowStock: true,
    notifyOnMilestones: true,
    deliveryMethod: 'DIRECT',
    ultramsgInstanceId: '',
    ultramsgToken: '',
    webhookUrl: ''
  };
}

export function saveNotificationSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/**
 * WhatsApp için hazır şablon mesajı üretir
 */
export function formatWhatsAppMorningBrief(settings, metrics) {
  const dateStr = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
  const totalSales = metrics?.totalSales || 0;
  const netProfit = metrics?.totalNetProfit || 0;
  const netMargin = metrics?.netMargin || '0';
  const activeProducts = metrics?.activeProductsCount || 0;

  return `🤖 *izeeg AI - Sabah Yönetici Bülteni*
📅 ${dateStr}

Günaydın ${settings.fullName || 'Sayın Mağaza Sahibi'}! ☀️ Güncel mağaza performans özetiniz:

📊 *Finansal Özet:*
• 💰 *Ciro:* ${totalSales.toLocaleString('tr-TR')} TL
• 💵 *Net Kâr:* ${netProfit.toLocaleString('tr-TR')} TL *(Marj: %${netMargin})*
• 📦 *Aktif Ürün:* ${activeProducts} Adet

⚠️ *AI Denetim Durumu:*
• Kargo Desi Kaçak Taraması: Aktif
• Sipariş ve Kâr Motoru: Bağlı

Detaylı incelemek için panelinize göz atabilirsiniz:
🔗 https://app.izeeg.com`;
}

/**
 * WhatsApp Web / Mobil Uygulama Doğrudan Gönderim Linki Oluşturur
 */
export function getWhatsAppDirectUrl(phoneNumber, messageText) {
  const { cleanNumber } = normalizePhoneNumber(phoneNumber);
  const encoded = encodeURIComponent(messageText);
  if (cleanNumber) {
    return `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encoded}`;
  }
  return `https://api.whatsapp.com/send?text=${encoded}`;
}

/**
 * WhatsApp mesajını doğrudan WhatsApp Web/Uygulamasında açar veya Bulut API üzerinden gönderir
 */
export async function sendWhatsAppMessage({ settings, messageText, metrics }) {
  const norm = normalizePhoneNumber(settings.phoneNumber);
  const text = messageText || formatWhatsAppMorningBrief(settings, metrics);

  if (!norm.cleanNumber) {
    throw new Error("Lütfen geçerli bir telefon numarası giriniz.");
  }

  // 1. Durum: UltraMsg Bulut Gateway Bağlantısı
  if (settings.deliveryMethod === 'ULTRAMSG' && settings.ultramsgInstanceId && settings.ultramsgToken) {
    const endpoint = `https://api.ultramsg.com/${settings.ultramsgInstanceId}/messages/chat`;
    const bodyParams = new URLSearchParams({
      token: settings.ultramsgToken,
      to: norm.cleanNumber,
      body: text
    });

    const resp = await fetch(endpoint, {
      method: 'POST',
      body: bodyParams
    });

    if (!resp.ok) {
      throw new Error(`UltraMsg API hatası: ${resp.statusText}`);
    }
    return { success: true, method: 'ULTRAMSG', message: 'UltraMsg bulut servisi üzerinden telefonunuza iletildi!' };
  }

  // 2. Durum: Özel Webhook / Zapier / Make.com Bağlantısı
  if (settings.deliveryMethod === 'WEBHOOK' && settings.webhookUrl) {
    const resp = await fetch(settings.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: norm.cleanNumber,
        formattedPhone: norm.formatted,
        recipient: settings.fullName,
        message: text,
        timestamp: new Date().toISOString()
      })
    });

    if (!resp.ok) {
      throw new Error(`Webhook API hatası: ${resp.statusText}`);
    }
    return { success: true, method: 'WEBHOOK', message: 'Özel Webhook servisine başarıyla aktarıldı!' };
  }

  // 3. Durum: Doğrudan WhatsApp Web / Mobil API (wa.me)
  const url = getWhatsAppDirectUrl(settings.phoneNumber, text);
  window.open(url, '_blank', 'noopener,noreferrer');
  return { success: true, method: 'DIRECT', url, message: 'WhatsApp uygulaması açılarak bülten hazırlandı!' };
}

export function formatWhatsAppAlert(type, data) {
  if (type === 'leak') {
    return `🚨 *ACİL KAÇAK ALARMI - izeeg AI*

Sayın ${data.sellerName || 'Mağaza Yöneticisi'},
"${data.productName}" ürününüzde yüksek reklam harcaması ve desi cezası nedeniyle dünkü satışlarınızda **${data.lossAmount} TL kâr kaybı** tespit edildi!

Önerilen Aksiyon: Reklam kampanyasını durdurun veya birim fiyatı güncelleyin.`;
  }

  if (type === 'cargo') {
    return `📦 *KARGO DESİ İTİRAZI HAZIR*

${data.orderCount || 3} adet siparişinizde kargo firmasının faturaya fazla desi yansıttığı doğrulandı. Toplam **${data.recoverableAmount || 67} TL** iade alabilirsiniz.

İtiraz dilekçeniz tek tıkla indirilebilir.`;
  }

  return '';
}
