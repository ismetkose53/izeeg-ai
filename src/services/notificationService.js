// WhatsApp ve SMS Bildirim Servisi

const STORAGE_KEY = 'ecompulse_notification_settings';

export function getNotificationSettings() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
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
    notifyOnMilestones: true
  };
}

export function saveNotificationSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

/**
 * WhatsApp için hazır şablon mesajı üretir
 */
export function formatWhatsAppMorningBrief(settings, metrics) {
  return `🤖 *izeeg AI - Sabah Yönetici Bülteni*
📅 ${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}

Günaydın ${settings.fullName || 'Sayın Mağaza Sahibi'}! ☀️ Güncel mağaza performans özetiniz:

📊 *Finansal Özet:*
• 💰 *Ciro:* ${(metrics?.totalSales || 0).toLocaleString('tr-TR')} TL
• 💵 *Net Kâr:* ${(metrics?.totalNetProfit || 0).toLocaleString('tr-TR')} TL *(Marj: %${metrics?.netMargin || '0'})*
• 📦 *Aktif Ürün:* ${metrics?.activeProductsCount || 0} Adet

⚠️ *AI Denetim Durumu:*
• Kargo Desi Kaçak Taraması: Aktif
• Sipariş ve Kâr Motoru: Bağlı

Detaylı incelemek için panelinize göz atabilirsiniz:
🔗 https://app.izeeg.com`;
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
