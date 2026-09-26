// AI E-Ticaret Danışmanı & AI Çalışanı 4-Sorulu Karar Motoru
// Kural: "Ne Oldu?", "Neden Oldu?", "Finansal Etkisi Ne?", "Ne Yapılabilir?"

import { AI_EMPLOYEE_CASES } from './mockData';

/**
 * 09:00 Sabah Yönetici Brifingini Üretir
 */
export function generateMorningBrief(metrics = {}, products = [], leaks = []) {
  if (!products || products.length === 0) {
    return {
      time: 'Canlı İzleme Aktif',
      title: 'Günlük E-Ticaret Yönetici Raporu',
      headline: 'Sistem hazır ve canlı pazar yeri / ürün verisi izleniyor.',
      summary: 'Henüz mağaza veya pazar yeri sipariş verisi bağlanmadı. Entegrasyon sağlandığında anlık analizler burada listelenecektir.',
      priorities: [
        {
          type: 'info',
          title: 'Pazar Yeri API / Entegrasyon Durumu',
          description: 'Trendyol, Hepsiburada veya XML/Excel kataloğunuzu ekleyerek anlık kârlılık analizini başlatabilirsiniz.',
          action: 'Pazar Yeri Ayarları veya Ürün Yükleme sekmesini ziyaret edin.'
        }
      ]
    };
  }

  const losingProducts = products.filter(p => p.status === 'losing');
  const lowStockProducts = products.filter(p => Number(p.stock) < 15);
  const pendingCargoLeak = (leaks || []).filter(l => l.status === 'ActionRequired');

  const rev = Number(metrics.totalRevenue || 0);
  const profit = Number(metrics.netProfit || 0);
  const margin = Number(metrics.netMargin || 0);

  const priorities = [];

  if (losingProducts.length > 0) {
    const p = losingProducts[0];
    priorities.push({
      type: 'danger',
      title: `Aşırı Reklam / İade Uyarısı: ${p.name || p.title || 'Ürün'}`,
      description: `Bu üründe kârlılık eksiye düşmüştür veya iade oranı yüksektir.`,
      action: `Reklam bütçesini kontrol edin ve beden tablosu uyarısı ekleyin.`
    });
  }

  if (pendingCargoLeak.length > 0) {
    priorities.push({
      type: 'warning',
      title: `Kargo Desi Fazla Kesintisi: ${pendingCargoLeak.length} Siparişte Hata`,
      description: `Kargo firmaları belirlenen desi yerine yüksek desi fatura kesmiş. Toplam ${metrics.totalRecoverableCargo || 0} TL fazladan kesinti tespit edildi.`,
      action: `Kargo Denetçisi sekmesinden tek tıkla itiraz dilekçesi oluşturun.`
    });
  }

  if (lowStockProducts.length > 0) {
    const p = lowStockProducts[0];
    priorities.push({
      type: 'info',
      title: `Kritik Stok Uyarısı: ${p.name || p.title || 'Ürün'}`,
      description: `Kalan stok: ${p.stock} adet. Bu satış hızıyla stok tükenebilir.`,
      action: `Tedarikçiye sipariş geçerek Buybox kaybını önleyin.`
    });
  }

  if (priorities.length === 0) {
    priorities.push({
      type: 'info',
      title: 'Tüm Operasyon Sağlıklı',
      description: 'Herhangi bir kargo kaçağı veya zarar yazan ürün tespit edilmedi.',
      action: 'Canlı izleme devam ediyor.'
    });
  }

  return {
    time: 'Bugün 09:00',
    title: 'Günlük E-Ticaret Yönetici Raporu',
    headline: `Toplam ciro: ${rev.toLocaleString('tr-TR')} TL, Net Kâr: ${profit.toLocaleString('tr-TR')} TL (%${margin} Net Marj).`,
    summary: losingProducts.length > 0 || pendingCargoLeak.length > 0 
      ? `Genel satış ivmesi takip ediliyor; ${losingProducts.length + pendingCargoLeak.length} adet optimizasyon noktası mevcut.`
      : `Genel satış ve kârlılık dengesi stabil seyrediyor.`,
    priorities
  };
}

/**
 * AI Çalışanı 4-Sorulu Analiz Vakalarını Getirir
 */
export function getAIEmployeeInsights(products = [], orders = [], cargoLeaks = []) {
  if (Array.isArray(AI_EMPLOYEE_CASES) && AI_EMPLOYEE_CASES.length > 0) {
    return AI_EMPLOYEE_CASES;
  }

  const cases = [];

  // Losing products case
  const losing = (products || []).filter(p => p.status === 'losing');
  if (losing.length > 0) {
    const p = losing[0];
    cases.push({
      id: `AI-CASE-${p.id || '01'}`,
      severity: 'CRITICAL',
      badgeText: 'Zarar Eden Ürün / Kâr Kaçağı',
      title: `${p.name || p.title} Ürününde Gizli Zarar Tespiti`,
      q1_whatHappened: `Bu üründe satış fiyatı maliyet, komisyon ve kargo giderlerini karşılamıyor.`,
      q2_whyHappened: `Yüksek komisyon veya ek operasyon giderleri kâr marjını eksiye çekmektedir.`,
      q3_financialImpact: `Ürün başına net kâr eksiye düşmüştür.`,
      q4_whatCanBeDone: `Fiyatı optimize edin veya reklam bütçesini gözden geçirin.`,
      actionLabel: 'Fiyatı Güncelle',
      actionTab: 'pro-table'
    });
  }

  // Cargo leaks case
  const pendingLeaks = (cargoLeaks || []).filter(l => l.status === 'ActionRequired');
  if (pendingLeaks.length > 0) {
    cases.push({
      id: 'AI-CASE-CARGO-01',
      severity: 'WARNING',
      badgeText: 'Kargo Desi Uyuşmazlığı',
      title: `${pendingLeaks.length} Siparişte Haksız Desi Kesintisi`,
      q1_whatHappened: `Kargo şirketi paketleri sisteme kayıtlı desiden daha yüksek faturalandırdı.`,
      q2_whyHappened: `Otomatik desi okuma hataları ve şube tartım uyuşmazlıkları.`,
      q3_financialImpact: `Fazladan haksız kargo kesintisi oluştu.`,
      q4_whatCanBeDone: `Otomatik dilekçe ile pazaryerine toplu itiraz iletin.`,
      actionLabel: 'Dilekçe Oluştur',
      actionTab: 'cargo-audit'
    });
  }

  return cases;
}

/**
 * Satıcının Türkçe sorularına 4-Sorulu yapılandırılmış yapay zeka yanıtları üretir
 */
export function askAIAssistant(question, storeContext, products = [], orders = [], cargoLeaks = []) {
  const q = question.toLowerCase();
  const totalRev = Number(storeContext?.totalRevenue || 0);
  const netProf = Number(storeContext?.netProfit || 0);
  const netMarg = Number(storeContext?.netMargin || 0);

  if (!products || products.length === 0) {
    return {
      text: `🔍 **Canlı Durum Raporu**
Henüz sisteme bağlı ürün veya sipariş verisi bulunmamaktadır.

💡 **Ne Yapılabilir?**
Trendyol / Hepsiburada API anahtarlarınızı girerek veya Ürün Yükleme sekmesinden Excel / XML yükleyerek mağazanızı anlık yapay zeka izlemesine alabilirsiniz.`,
      suggestedAction: 'API Entegrasyonuna Git',
      actionTab: 'integrations'
    };
  }

  if (q.includes('neden düştü') || q.includes('kârım düştü') || q.includes('zarar') || q.includes('kaçak')) {
    const losing = products.filter(p => p.status === 'losing');
    return {
      text: `🔍 **Ne Oldu?**
Mağazanızda toplam ciro ${totalRev.toLocaleString('tr-TR')} ₺, net kâr ise ${netProf.toLocaleString('tr-TR')} ₺ (%${netMarg} Net Marj).

🧠 **Neden Oldu?**
${losing.length > 0 ? `${losing.length} adet üründe giderler kârı baskılıyor.` : 'Kargo kesintileri ve komisyon oranları izlenmektedir.'}

💸 **Finansal Etkisi Ne?**
Net kâr marjınız güncel satış fiyatları ve kargo tarifeleri üzerinden hesaplanmıştır.

⚡ **Ne Yapılabilir?**
AI E-Ticaret Çalışanı sekmesinden önerilen fiyat ve bütçe aksiyonlarını inceleyip uygulayabilirsiniz.`,
      suggestedAction: 'Aksiyonları İncele',
      actionTab: 'ai-worker'
    };
  }

  if (q.includes('en karlı') || q.includes('en çok kazandıran') || q.includes('şampiyon')) {
    const sorted = [...products].sort((a, b) => {
      const pA = (Number(a.sellingPrice || a.salePrice || 0) - Number(a.costPrice || 0));
      const pB = (Number(b.sellingPrice || b.salePrice || 0) - Number(b.costPrice || 0));
      return pB - pA;
    });
    const best = sorted[0] || { name: 'Kayıtlı Ürün', sellingPrice: 0 };

    return {
      text: `🔍 **Ne Oldu?**
En yüksek birim kâr marjına sahip ürününüz: **${best.name || best.title}**.

🧠 **Neden Oldu?**
Satış Fiyatı: ${Number(best.sellingPrice || best.salePrice || 0).toLocaleString('tr-TR')} TL, Alış Maliyeti: ${Number(best.costPrice || 0).toLocaleString('tr-TR')} TL.

💸 **Finansal Etkisi Ne?**
Bu ürün mağazanızın kârlılık omurgasını oluşturmaktadır.

⚡ **Ne Yapılabilir?**
Stok durumunu yakından takip ederek Buybox ve reklam sıralamasını koruyabilirsiniz.`,
      suggestedAction: 'Ürün Kâr Tablosu',
      actionTab: 'pro-table'
    };
  }

  return {
    text: `🔍 **Ne Oldu?**
Mağazanızın tüm kanallardaki anlık finansal ve operasyonel durumu canlı verilerle tarandı.

🧠 **Neden Oldu?**
Toplam ciro **${totalRev.toLocaleString('tr-TR')} ₺**, net kâr **${netProf.toLocaleString('tr-TR')} ₺** (%${netMarg} Net Marj). Toplam ${products.length} adet aktif ürün izleniyor.

💸 **Finansal Etkisi Ne?**
Tüm komisyon, KDV ve kargo kesintileri net kâra yansıtılmıştır.

⚡ **Ne Yapılabilir?**
AI E-Ticaret Çalışanı sekmesinden aksiyon planlarını inceleyebilirsiniz.`,
    suggestedAction: 'AI Çalışanı Paneline Git',
    actionTab: 'ai-worker'
  };
}
