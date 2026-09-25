// AI E-Ticaret Danışmanı & AI Çalışanı 4-Sorulu Karar Motoru
// Kural: "Ne Oldu?", "Neden Oldu?", "Finansal Etkisi Ne?", "Ne Yapılabilir?"

import { AI_EMPLOYEE_CASES } from './mockData';

/**
 * 09:00 Sabah Yönetici Brifingini Üretir
 */
export function generateMorningBrief(metrics, products, leaks) {
  const losingProducts = products.filter(p => p.status === 'losing');
  const lowStockProducts = products.filter(p => p.stock < 15);
  const pendingCargoLeak = leaks.filter(l => l.status === 'ActionRequired');

  return {
    time: 'Bugün 09:00',
    title: 'Günlük E-Ticaret Yönetici Raporu',
    headline: `Dün 38.900 TL ciro yaptın, net kârın: 8.150 TL (%20.9 Net Marj).`,
    summary: `Genel satış ivmen güçlü seyrediyor fakat cüzdanında 3 kritik kaçak noktası tespit edildi.`,
    priorities: [
      {
        type: 'danger',
        title: `Aşırı Reklam & İade Kaçağı: ${losingProducts[0]?.name || 'Dökümlü Saten Midi Elbise'}`,
        description: `Bu üründe reklam harcaman 3.400 TL'ye ulaştı ve iade oranı %18. Net kârı eksiye çekiyor.`,
        action: `Reklam bütçesini %35 kıs ve beden tablosu uyarısı ekle.`
      },
      {
        type: 'warning',
        title: `Kargo Desi Fazla Kesintisi: ${pendingCargoLeak.length} Siparişte Hata`,
        description: `Kargo firmaları 1-2 desi yerine 4-5 desi fatura kesmiş. Toplam ${metrics.totalRecoverableCargo || 124} TL fazladan para alındı.`,
        action: `Kargo Denetçisi sekmesinden tek tıkla itiraz dilekçesi oluştur.`
      },
      {
        type: 'info',
        title: `Kritik Stok Uyarısı: ${lowStockProducts[0]?.name || 'Keten Blazer Ceket'}`,
        description: `Kalan stok: ${lowStockProducts[0]?.stock || 0} adet. Bu satış hızıyla liste 2 günde tükenebilir.`,
        action: `Tedarikçiye acil sipariş geçerek Buybox kaybını önle.`
      }
    ]
  };
}

/**
 * AI Çalışanı 4-Sorulu Analiz Vakalarını Getirir
 */
export function getAIEmployeeInsights() {
  return AI_EMPLOYEE_CASES;
}

/**
 * Satıcının Türkçe sorularına 4-Sorulu yapılandırılmış yapay zeka yanıtları üretir
 */
export function askAIAssistant(question, storeContext) {
  const q = question.toLowerCase();

  if (q.includes('neden düştü') || q.includes('kârım düştü') || q.includes('zarar') || q.includes('kaçak')) {
    return {
      text: `🔍 **Ne Oldu?**
Son 7 günde net kâr marjınız %27.4'ten %20.9'a geriledi (Haftalık kayıp: ~2.450 TL).

🧠 **Neden Oldu?**
1. **Dökümlü Saten Midi Elbise** ürününün reklam bütçesi 3.400 TL'ye çıkarken ROAS 1.6'ya düştü. Üstelik müşteriler "Kalıp dar" diye %18 iade açtı.
2. Trendyol Express 3 siparişte 1-2 desi yerine 4-5 desi fatura tahsil etti.

💸 **Finansal Etkisi Ne?**
Reklam ve iade çarkı yüzünden bu üründen net **-1.059,10 TL zarar** ettiniz.

⚡ **Ne Yapılabilir?**
AI Çalışanı onayınızla reklam bütçesini %35 kısabilir ve pazar yeri kargo itiraz dilekçesini otomatik iletebilir.`,
      suggestedAction: 'Aksiyonları İncele & Onayla',
      actionTab: 'ai-worker'
    };
  }

  if (q.includes('en karlı') || q.includes('en çok kazandıran') || q.includes('şampiyon')) {
    return {
      text: `🔍 **Ne Oldu?**
En yüksek net nakit üreten şampiyon ürününüz: **Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım**.

🧠 **Neden Oldu?**
• Satış Fiyatı: 1.950,00 TL (Alış: 780,00 TL, Kargo: 87,00 TL)
• Ürün Başı Net Kâr: 663,75 TL (%34.0 Net Marj)
• İade Oranı: Yalnızca %2.8 (Sektör ortalaması %18)
• Buybox Rekabeti: %100 sizde.

💸 **Finansal Etkisi Ne?**
Bu ay tek başına kasanıza **92.925 TL net nakit kâr** sağladı.

⚡ **Ne Yapılabilir?**
Fiyatı 2.090,00 TL (+140 TL) yaparak aylık net kârınızı +14.200 TL artırabilirsiniz.`,
      suggestedAction: 'Fiyatı Güncelle',
      actionTab: 'pro-table'
    };
  }

  if (q.includes('reklam') || q.includes('roas') || q.includes('ad')) {
    return {
      text: `🔍 **Ne Oldu?**
Toplam reklam harcamanız 8.950 TL, toplam reklam kaynaklı ciro 51.534 TL (Ortalama ROAS: 5.75).

🧠 **Neden Oldu?**
Modal Takım (ROAS: 18.75) ve Yıldız Taş Tişört (ROAS: 9.54) çok iyi çalışırken, Saten Elbise (ROAS: 1.64) reklam bütçesini yakıyor.

💸 **Finansal Etkisi Ne?**
Saten elbisedeki aşırı reklam harcaması cebinizden 1.059 TL net zarar çıkardı.

⚡ **Ne Yapılabilir?**
'Reklam & ROAS' sekmesinden ilgili kampanyayı tek tıkla durdurabilir veya %35 bütçe kısma onayını verebilirsiniz.`,
      suggestedAction: 'Reklam Panelini Aç',
      actionTab: 'ads'
    };
  }

  if (q.includes('iade') || q.includes('geri gelen')) {
    return {
      text: `🔍 **Ne Oldu?**
Bu hafta toplam 14 adet iade talebi geldi (Toplam çift kargo ve paketleme ziyanı: 1.480 TL).

🧠 **Neden Oldu?**
İadelerin %62'si "Beden/Kalıp dar geldi" gerekçesiyle oluştu.

💸 **Finansal Etkisi Ne?**
Her iade edilen üründe ortalama 100,82 TL çift kargo + ambalaj zararı oluşuyor.

⚡ **Ne Yapılabilir?**
Ürün beden tablolarını güncelleyerek bu iadeleri %40 oranında engelleyebilirsiniz.`,
      suggestedAction: 'İade Panelini İncele',
      actionTab: 'returns'
    };
  }

  return {
    text: `🔍 **Ne Oldu?**
Mağazanızın tüm kanallardaki anlık finansal ve operasyonel durumu tarandı.

🧠 **Neden Oldu?**
Toplam ciro **${storeContext?.totalRevenue?.toLocaleString('tr-TR')} ₺**, net kârınız **${storeContext?.netProfit?.toLocaleString('tr-TR')} ₺** (%${storeContext?.netMargin}). 

💸 **Finansal Etkisi Ne?**
3 adet aktif kaçak noktası tespit edildi (Kargo desi uyuşmazlığı + aşırı reklam harcaması).

⚡ **Ne Yapılabilir?**
AI E-Ticaret Çalışanı sekmesinden 4-sorulu aksiyon planlarını inceleyip tek tıkla onaylayabilirsiniz.`,
    suggestedAction: 'AI Çalışanı Paneline Git',
    actionTab: 'ai-worker'
  };
}
