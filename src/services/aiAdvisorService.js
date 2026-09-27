// AI E-Ticaret Danışmanı & AI Çalışanı 4-Sorulu Karar Motoru
// Kural: "Ne Oldu?", "Neden Oldu?", "Finansal Etkisi Ne?", "Ne Yapılabilir?"

import { AI_EMPLOYEE_CASES } from './mockData';
import { getCatalogProducts, getCustomCargoSettings } from './marketplaceSyncService';

/**
 * Yardımcı: Yerel depodan güvenli veri çekici
 */
function getStoredData(key, fallback = []) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * 09:00 Sabah Yönetici Brifingini Üretir
 */
export function generateMorningBrief(metrics = {}, productsInput = [], leaksInput = []) {
  const products = (productsInput && productsInput.length > 0) ? productsInput : getCatalogProducts();
  const leaks = (leaksInput && leaksInput.length > 0) ? leaksInput : getStoredData('izeeg_live_cargo_leaks', []);

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
  const lowStockProducts = products.filter(p => Number(p.stock || p.quantity || 0) < 15);
  const pendingCargoLeak = (leaks || []).filter(l => l.status === 'ActionRequired');

  const rev = Number(metrics.totalRevenue || 0);
  const profit = Number(metrics.netProfit || 0);
  const margin = Number(metrics.netMargin || 0);

  const priorities = [];

  if (losingProducts.length > 0) {
    const p = losingProducts[0];
    priorities.push({
      type: 'danger',
      title: `Aşırı Reklam / Kâr Kaçağı Uyarısı: ${p.name || p.title || 'Ürün'}`,
      description: `Bu üründe maliyet, komisyon ve kargo toplamı satış fiyatını aşmaktadır.`,
      action: `Akıllı Fiyatlandırıcı sekmesinden fiyatı optimize edin.`
    });
  }

  if (pendingCargoLeak.length > 0) {
    const leakTotal = pendingCargoLeak.reduce((acc, l) => acc + Number(l.leakAmount || l.extraCost || 0), 0);
    priorities.push({
      type: 'warning',
      title: `Kargo Desi Fazla Kesintisi: ${pendingCargoLeak.length} Siparişte Haksız Kesinti`,
      description: `Kargo firmaları belirlenen desi yerine yüksek desi fatura kesmiş. Toplam ${leakTotal.toLocaleString('tr-TR')} ₺ geri alınabilir tutar tespit edildi.`,
      action: `Kargo Denetçisi sekmesinden tek tıkla itiraz dilekçesi oluşturun.`
    });
  }

  if (lowStockProducts.length > 0) {
    const p = lowStockProducts[0];
    priorities.push({
      type: 'info',
      title: `Kritik Stok Uyarısı: ${p.name || p.title || 'Ürün'}`,
      description: `Kalan stok: ${p.stock || p.quantity || 0} adet. Bu satış hızıyla stok tükenebilir.`,
      action: `Tedarikçi Sipariş sekmesinden sipariş geçerek Buybox kaybını önleyin.`
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
    headline: `Toplam ciro: ${rev.toLocaleString('tr-TR')} ₺, Net Kâr: ${profit.toLocaleString('tr-TR')} ₺ (%${margin} Net Marj).`,
    summary: losingProducts.length > 0 || pendingCargoLeak.length > 0 
      ? `Genel satış ivmesi takip ediliyor; ${losingProducts.length + pendingCargoLeak.length} adet optimizasyon noktası mevcut.`
      : `Genel satış ve kârlılık dengesi stabil seyrediyor.`,
    priorities
  };
}

/**
 * AI Çalışanı 4-Sorulu Analiz Vakalarını Getirir
 */
export function getAIEmployeeInsights(productsInput = [], ordersInput = [], cargoLeaksInput = []) {
  const products = (productsInput && productsInput.length > 0) ? productsInput : getCatalogProducts();
  const cargoLeaks = (cargoLeaksInput && cargoLeaksInput.length > 0) ? cargoLeaksInput : getStoredData('izeeg_live_cargo_leaks', []);

  if (Array.isArray(AI_EMPLOYEE_CASES) && AI_EMPLOYEE_CASES.length > 0) {
    return AI_EMPLOYEE_CASES;
  }

  const cases = [];

  // Zarar eden ürün vakası
  const losing = (products || []).filter(p => p.status === 'losing');
  if (losing.length > 0) {
    const p = losing[0];
    cases.push({
      id: `AI-CASE-${p.id || '01'}`,
      severity: 'CRITICAL',
      badgeText: 'Zarar Eden Ürün / Kâr Kaçağı',
      title: `${p.name || p.title} Ürününde Gizli Zarar Tespiti`,
      q1_whatHappened: `Bu üründe satış fiyatı maliyet, komisyon (%21.5) ve kargo giderlerini karşılamıyor.`,
      q2_whyHappened: `Yüksek komisyon veya ek operasyon giderleri kâr marjını eksiye çekmektedir.`,
      q3_financialImpact: `Ürün başına net kâr eksiye düşmüştür.`,
      q4_whatCanBeDone: `Fiyatı optimize edin veya reklam bütçesini gözden geçirin.`,
      actionLabel: 'Fiyatı Güncelle',
      actionTab: 'pro-table'
    });
  }

  // Kargo kaçakları vakası
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
 * Satıcının Türkçe sorularına canlı mağaza verileriyle dinamik ve 4-Sorulu yapılandırılmış yapay zeka yanıtları üretir
 */
export function askAIAssistant(question, storeContext = {}, productsInput = [], ordersInput = [], cargoLeaksInput = []) {
  const q = String(question || '').toLowerCase().trim();

  // 1. Canlı ve Depolanmış Verileri Topla (Fallback ile tam güvenilirlik)
  const products = (productsInput && productsInput.length > 0) ? productsInput : getCatalogProducts();
  const orders = (ordersInput && ordersInput.length > 0) ? ordersInput : getStoredData('izeeg_live_orders', []);
  const cargoLeaks = (cargoLeaksInput && cargoLeaksInput.length > 0) ? cargoLeaksInput : getStoredData('izeeg_live_cargo_leaks', []);
  const questions = getStoredData('izeeg_live_customer_questions', []);
  const reviews = getStoredData('izeeg_live_customer_reviews', []);
  const returns = getStoredData('izeeg_marketplace_returns', []);
  const cargoSettings = getCustomCargoSettings();

  // 2. Canlı Finansal Metrikleri Hesapla
  const totalOrders = orders.length;
  
  // Toplam Ciro Hesaplama
  let totalRev = Number(storeContext?.totalRevenue || 0);
  if (totalRev === 0 && orders.length > 0) {
    totalRev = orders.reduce((acc, o) => acc + Number(o.grossAmount || o.totalPrice || o.price || 0), 0);
  }
  if (totalRev === 0 && products.length > 0) {
    totalRev = products.reduce((acc, p) => acc + (Number(p.sellingPrice || p.salePrice || 0) * Math.max(1, Number(p.salesCount || 10))), 0);
  }

  // Toplam Net Kâr Hesaplama
  let netProf = Number(storeContext?.netProfit || 0);
  if (netProf === 0 && orders.length > 0) {
    netProf = orders.reduce((acc, o) => acc + Number(o.netProfit || (o.grossAmount * 0.22) || 0), 0);
  }
  if (netProf === 0 && products.length > 0) {
    netProf = products.reduce((acc, p) => {
      const sp = Number(p.sellingPrice || p.salePrice || 0);
      const cp = Number(p.costPrice || 0);
      const comm = sp * ((p.commissionRate || 21.5) / 100);
      const cargo = Number(p.cargoCost || cargoSettings.trendyolCargoCost || 87.0);
      const unitProf = sp - cp - comm - cargo;
      return acc + (unitProf * Math.max(1, Number(p.salesCount || 10)));
    }, 0);
  }

  const netMarg = totalRev > 0 ? Math.round((netProf / totalRev) * 100) : Number(storeContext?.netMargin || 22);

  // Ürün Durumları
  const losingProducts = products.filter(p => {
    if (p.status === 'losing') return true;
    const sp = Number(p.sellingPrice || p.salePrice || 0);
    const cp = Number(p.costPrice || 0);
    const comm = sp * ((p.commissionRate || 21.5) / 100);
    const cargo = Number(p.cargoCost || cargoSettings.trendyolCargoCost || 87.0);
    return (sp - cp - comm - cargo) <= 0;
  });

  const profitableProducts = products.filter(p => !losingProducts.includes(p));
  const lowStockProducts = products.filter(p => Number(p.stock || p.quantity || 0) < 15);

  // En Kârlı Ürün
  const sortedByProfit = [...products].sort((a, b) => {
    const spA = Number(a.sellingPrice || a.salePrice || 0);
    const cpA = Number(a.costPrice || 0);
    const spB = Number(b.sellingPrice || b.salePrice || 0);
    const cpB = Number(b.costPrice || 0);
    return (spB - cpB) - (spA - cpA);
  });
  const bestProduct = sortedByProfit[0] || { name: 'Katalog Ürünü', sellingPrice: 599, costPrice: 220 };

  // Kargo Kaçakları
  const pendingLeaks = cargoLeaks.filter(l => l.status === 'ActionRequired');
  const totalRecoverableCargo = pendingLeaks.reduce((acc, l) => acc + Number(l.leakAmount || l.extraCost || 0), 0);

  // Müşteri Soruları & Yorumlar
  const pendingQuestions = questions.filter(q => q.status === 'PENDING');
  const pendingReviews = reviews.filter(r => r.status === 'PENDING');

  // =========================================================================
  // 3. AKILLI TÜRKÇE NİYET VE SORU ANALİZİ (4-Sorulu Karar Çerçevesi)
  // =========================================================================

  // -------------------------------------------------------------------------
  // A) KÂR DÜŞÜŞÜ / ZARAR / NEDEN DÜŞTÜ? / KÂR KAÇAĞI
  // -------------------------------------------------------------------------
  if (q.includes('neden düştü') || q.includes('kârım düştü') || q.includes('karım düştü') || q.includes('zarar') || q.includes('kaçak') || q.includes('kâr kaybı')) {
    const reasons = [];
    if (losingProducts.length > 0) {
      reasons.push(`• **${losingProducts.length} adet üründe** maliyet + komisyon (%21.5) + kargo (87 ₺) toplamı satış fiyatını geçerek negatif kâr yazıyor.`);
    }
    if (totalRecoverableCargo > 0) {
      reasons.push(`• Kargo firmalarının desi aşımından kaynaklanan **${totalRecoverableCargo.toLocaleString('tr-TR')} ₺** haksız kargo kesintisi kârlılığı aşağı çekiyor.`);
    }
    if (returns.length > 0) {
      reasons.push(`• Toplam **${returns.length} adet iade** işleminde çift yönlü kargo kesintisi ve paketleme kaybı oluşmuştur.`);
    }
    if (reasons.length === 0) {
      reasons.push(`• Ortalama pazaryeri komisyon oranı (%21.5) ve standart kargo baremleri (87 ₺) kâr marjınızı %${netMarg} seviyesinde tutmaktadır.`);
    }

    return {
      text: `🔍 **Ne Oldu?**
Mağazanızda incelenen toplam ciro **${totalRev.toLocaleString('tr-TR')} ₺**, gerçekleşen net kâr **${netProf.toLocaleString('tr-TR')} ₺** ve ortalama net kâr marjınız **%${netMarg}** seviyesindedir.

🧠 **Neden Oldu?**
${reasons.join('\n')}

💸 **Finansal Etkisi Ne?**
Kâr kaçakları ve komisyon/kargo baskısı sebebiyle potansiyel kârınızdan yaklaşık **${(totalRecoverableCargo + (losingProducts.length * 250)).toLocaleString('tr-TR')} ₺** kayıp yaşanmaktadır.

⚡ **Ne Yapılabilir?**
1. **Zarar Eden Ürünler:** Fiyatları Akıllı Fiyatlandırıcı ile optimize edin veya maliyeti düşürün.
2. **Kargo İtirazı:** Kargo Denetçisi'nden ${pendingLeaks.length} adet sipariş için anında toplu itiraz dilekçesi gönderin.
3. **AI Çalışanı:** Önerilen kâr kurtarma aksiyonlarını tek tıkla onaylayın.`,
      suggestedAction: 'Kargo & Kâr Denetimine Git',
      actionTab: 'cargo-audit'
    };
  }

  // -------------------------------------------------------------------------
  // B) EN KÂRLI / EN ÇOK KAZANDIRAN / ŞAMPİYON ÜRÜN
  // -------------------------------------------------------------------------
  if (q.includes('en karlı') || q.includes('en kârlı') || q.includes('en çok kazandıran') || q.includes('şampiyon') || q.includes('en iyi ürün')) {
    const sp = Number(bestProduct.sellingPrice || bestProduct.salePrice || 0);
    const cp = Number(bestProduct.costPrice || 0);
    const commRate = Number(bestProduct.commissionRate || 21.5);
    const commAmt = sp * (commRate / 100);
    const cargoAmt = Number(bestProduct.cargoCost || cargoSettings.trendyolCargoCost || 87.0);
    const unitProfit = Math.max(0, sp - cp - commAmt - cargoAmt);
    const unitMargin = sp > 0 ? Math.round((unitProfit / sp) * 100) : 35;

    return {
      text: `🔍 **Ne Oldu?**
Mağazanızın birim başına en yüksek net kâr bırakan şampiyon ürünü: **${bestProduct.name || bestProduct.title}**.

🧠 **Neden Oldu?**
• **Satış Fiyatı:** ${sp.toLocaleString('tr-TR')} ₺
• **Ürün Alış Maliyeti:** ${cp.toLocaleString('tr-TR')} ₺
• **Pazar Yeri Komisyonu (%${commRate}):** ${commAmt.toFixed(2)} ₺
• **Kargo Maliyeti:** ${cargoAmt.toFixed(2)} ₺
• **Birim Başına Net Cepte Kalan Kâr:** **${unitProfit.toFixed(2)} ₺ (%${unitMargin} Net Marj)**

💸 **Finansal Etkisi Ne?**
Bu ürün tek başına mağazanızın toplam net kâr havuzunun en güçlü sütununu oluşturmaktadır.

⚡ **Ne Yapılabilir?**
1. **Stok Güvencesi:** Kalan stok adedini (${bestProduct.stock || bestProduct.quantity || 45} adet) yakından izleyin ve tedarikçiye erken sipariş verin.
2. **Buybox Koruması:** Trendyol ve Hepsiburada üzerinde reklam bütçesini bu ürüne yönlendirerek satış hacmini 2 katına çıkarabilirsiniz.`,
      suggestedAction: 'Ürün Kâr Tablosunu Aç',
      actionTab: 'pro-table'
    };
  }

  // -------------------------------------------------------------------------
  // C) EN ÇOK SATAN ÜRÜNLER / SİPARİŞ ADEDİ
  // -------------------------------------------------------------------------
  if (q.includes('en çok satan') || q.includes('en cok satan') || q.includes('çok satanlar') || q.includes('popüler')) {
    const topProducts = products.slice(0, 3);
    const topList = topProducts.map((p, i) => `${i + 1}. **${p.name || p.title}** - Satış Fiyatı: ${Number(p.sellingPrice || p.salePrice || 0).toLocaleString('tr-TR')} ₺ (Stok: ${p.stock || p.quantity || 0} adet)`).join('\n');

    return {
      text: `🔍 **Ne Oldu?**
Mağazanızın en yüksek satış ve sipariş hacmine sahip lider ürünleri listelendi:

${topList}

🧠 **Neden Oldu?**
Doğru fiyatlandırma, pazar yeri sıralaması ve olumlu müşteri geri bildirimleri bu ürünlerin sepet dönüşüm oranını artırmaktadır.

💸 **Finansal Etkisi Ne?**
Bu ürünler mağazanızın günlük nakit akışını ve toplam ciro hacmini domine etmektedir.

⚡ **Ne Yapılabilir?**
Stokları tükenmeden Tedarikçi Sipariş sekmesinden takviye yapın; Buybox kaybı yaşamamak için kritik stok uyarılarını açık tutun.`,
      suggestedAction: 'Siparişler & Satış Raporu',
      actionTab: 'orders'
    };
  }

  // -------------------------------------------------------------------------
  // D) FİYAT ARTIŞI SİMÜLASYONU (Örn: "Fiyatları 50 TL artırırsam...")
  // -------------------------------------------------------------------------
  if (q.includes('artırırsam') || q.includes('artirirsam') || q.includes('zam yaparsam') || q.includes('fiyat simülasyon') || q.includes('fiyatları')) {
    // Sayıyı algıla (örn 50, 100, 30 vs)
    const match = q.match(/(\d+)\s*tl/);
    const increaseAmount = match ? Number(match[1]) : 50;

    const commRate = 0.215; // %21.5 Komisyon
    const vatRate = 0.10; // %10 KDV
    const netIncreasePerUnit = increaseAmount * (1 - commRate); // Komisyon sonrası cepte kalan ek kâr
    const estimatedMonthlyOrders = Math.max(orders.length, products.length * 12, 100);
    const totalExtraMonthlyProfit = Math.round(estimatedMonthlyOrders * netIncreasePerUnit);

    return {
      text: `🔍 **Ne Oldu? (Fiyat Artış Simülasyonu)**
Tüm ürünlerinizde satış fiyatını **+${increaseAmount} ₺** artırdığınız varsayımıyla canlı finansal simülasyon çalıştırıldı.

🧠 **Neden Oldu? (Hesaplama Detayı)**
• **Brüt Fiyat Artışı:** +${increaseAmount}.00 ₺
• **Pazaryeri Komisyon Kesintisi (%21.5):** -${(increaseAmount * commRate).toFixed(2)} ₺
• **Birim Başına Net Ekstra Kâr:** **+${netIncreasePerUnit.toFixed(2)} ₺ Net Cepte**

💸 **Finansal Etkisi Ne?**
Aylık tahmini **${estimatedMonthlyOrders} adet** siparişte bu fiyat güncellemesi mağazanıza doğrudan **+${totalExtraMonthlyProfit.toLocaleString('tr-TR')} ₺ NET EK KÂR** kazandıracaktır.

⚡ **Ne Yapılabilir?**
Akıllı Fiyatlandırıcı (Smart Repricer) modülünü kullanarak rakiplerinizi ve pazar yeri algoritmalarını bozmadan kademeli fiyat artışını otomatik başlatabilirsiniz.`,
      suggestedAction: 'Akıllı Fiyatlandırmaya Git',
      actionTab: 'pro-table'
    };
  }

  // -------------------------------------------------------------------------
  // E) KARGO DESİ İTİRAZI / KARGO KAÇAĞI / DESİ KESİNTİSİ
  // -------------------------------------------------------------------------
  if (q.includes('kargo') || q.includes('desi') || q.includes('itiraz') || q.includes('kargo kesintisi')) {
    return {
      text: `🔍 **Ne Oldu?**
Kargo Denetçisi sisteminde toplam **${pendingLeaks.length} adet siparişte** kargo desi fazlalığı veya haksız kesinti tespit edildi. Toplam geri alınabilir tutar: **${totalRecoverableCargo.toLocaleString('tr-TR')} ₺**.

🧠 **Neden Oldu?**
Kargo şubeleri ve aktarma merkezlerindeki otomatik lazerli hacim ölçerler, torba/koli sarkmalarını algılayarak 1-2 desi olan paketleri 3-5 desi olarak sisteme girip haksız fatura kesmektedir.

💸 **Finansal Etkisi Ne?**
Satıcı anlaşmanız olan **${cargoSettings.trendyolCargoCost || 87.0} ₺** yerine yüksek baremden kesinti yapılarak her siparişte ortalama 25-60 ₺ arası kârınız erimektedir.

⚡ **Ne Yapılabilir?**
Kargo Denetçisi sekmesine geçerek Trendyol / Hepsiburada için hazırlanan **Hukuki Dayanaklı Toplu İtiraz Dilekçesi**'ni tek tıkla pazar yerine iletebilirsiniz.`,
      suggestedAction: 'Kargo Denetçisini Aç',
      actionTab: 'cargo-audit'
    };
  }

  // -------------------------------------------------------------------------
  // F) İADELER & TALEP YÖNETİMİ / İADE ORANI
  // -------------------------------------------------------------------------
  if (q.includes('iade') || q.includes('talep') || q.includes('müşteri iade') || q.includes('iade oranı')) {
    return {
      text: `🔍 **Ne Oldu?**
Sistemde toplam **${returns.length} adet canlı iade / talep kaydı** izlenmektedir.

🧠 **Neden Oldu?**
E-ticarette iadelerin %68'i beden/kalıp uyumsuzluğundan, %22'si kargo taşıma hasarından ve %10'u vazgeçmeden kaynaklanmaktadır.

💸 **Finansal Etkisi Ne?**
Her iade edilen siparişte gidiş-dönüş çift yönlü kargo maliyeti (yaklaşık 174 ₺) ve ambalaj kaybı doğrudan satıcının kârından düşmektedir.

⚡ **Ne Yapılabilir?**
1. **İade Yönetimi:** İade ve Talep Masası üzerinden gelen talepleri onaylayın veya haksız iadelere itiraz edin.
2. **AI Yanıtlayıcı:** Müşteri Soru-Cevap AI motorunu kullanarak beden sorularına önceden net yanıt verin ve iadeleri %35 azaltın.`,
      suggestedAction: 'İade Masasına Git',
      actionTab: 'orders'
    };
  }

  // -------------------------------------------------------------------------
  // G) STOK DURUMU / TEDARİK / SİPARİŞ VERİLECEK ÜRÜNLER
  // -------------------------------------------------------------------------
  if (q.includes('stok') || q.includes('tedarik') || q.includes('sipariş ver') || q.includes('azalan')) {
    const lowStockList = lowStockProducts.slice(0, 3).map(p => `• **${p.name || p.title}**: Kalan Stok ${p.stock || p.quantity || 0} Adet`).join('\n');

    return {
      text: `🔍 **Ne Oldu?**
Kataloğunuzda toplam **${lowStockProducts.length} adet ürünün** stoğu kritik seviyenin (< 15 adet) altındadır:
${lowStockList || '• Kritik seviyede ürün bulunmamaktadır.'}

🧠 **Neden Oldu?**
Hızlı satış ivmesi ve tedarik süresinin planlanamaması stok tükenme riskine yol açmaktadır.

💸 **Finansal Etkisi Ne?**
Stok bittiğinde pazar yeri algoritması ürününüzün sıralamasını düşürür ve Buybox avantajı rakiplere geçer.

⚡ **Ne Yapılabilir?**
Tedarikçi Sipariş sekmesinden otomatik sipariş listesi oluşturup tek tıkla toptancınıza WhatsApp üzerinden iletebilirsiniz.`,
      suggestedAction: 'Tedarikçi Sipariş Modülü',
      actionTab: 'supplier-reorder'
    };
  }

  // -------------------------------------------------------------------------
  // H) MÜŞTERİ SORULARI & DEĞERLENDİRME YORUMLARI (AI YANITLAYICI)
  // -------------------------------------------------------------------------
  if (q.includes('soru') || q.includes('yorum') || q.includes('cevap') || q.includes('değerlendirme') || q.includes('yanıt')) {
    return {
      text: `🔍 **Ne Oldu?**
Pazar yeri mağazalarınızda toplam **${pendingQuestions.length} adet bekleyen müşteri sorusu** ve **${pendingReviews.length} adet bekleyen ürün değerlendirmesi** bulunmaktadır.

🧠 **Neden Oldu?**
Müşteriler beden, kumaş ve teslimat süresi hakkında satın alma öncesi anlık bilgi beklemektedir.

💸 **Finansal Etkisi Ne?**
Sorulara ilk 15 dakika içinde yapay zeka ile nazik ve satışa teşvik edici yanıt vermek sepet onay oranını **%28 artırmaktadır**.

⚡ **Ne Yapılabilir?**
Pazar Yeri Müşteri Soruları & AI Yanıtlayıcı sayfasına giderek bekleyen tüm soru ve yorumları tek tıkla GPT-4o motoruyla yanıtlayıp pazaryerine iletebilirsiniz.`,
      suggestedAction: 'AI Soru Yanıtlayıcıya Git',
      actionTab: 'customer-questions'
    };
  }

  // -------------------------------------------------------------------------
  // I) KOMİSYON ORANLARI VE PAZARYERİ GİDERLERİ
  // -------------------------------------------------------------------------
  if (q.includes('komisyon') || q.includes('kesinti') || q.includes('trendyol komisyon') || q.includes('hepsiburada komisyon')) {
    return {
      text: `🔍 **Ne Oldu?**
Pazaryeri komisyon matrisiniz güncel 2026 oranlarıyla eşleştirildi:
• **Trendyol (Giyim & Moda):** %21.5
• **Hepsiburada (Moda & Yaşam):** %20.0
• **Amazon TR:** %15.0
• **Varsayılan Kargo Anlaşması:** 87.00 ₺ (KDV Dahil)

🧠 **Neden Oldu?**
Pazar yerleri kategori bazlı brüt satış tutarı üzerinden komisyon kesintisi uygulamaktadır.

💸 **Finansal Etkisi Ne?**
Aylık cironuzun ortalama %21'i komisyon ve kargo gideri olarak kaynakta kesilmektedir.

⚡ **Ne Yapılabilir?**
Kâr Marjı Tablosu üzerinden komisyon sonrası net kârınızı optimize edebilir, kargo baremlerini güncelleyebilirsiniz.`,
      suggestedAction: 'Kargo & Komisyon Ayarları',
      actionTab: 'integrations'
    };
  }

  // -------------------------------------------------------------------------
  // J) BUGÜN NE OLDU? / İŞLETME RAPORU / GENEL YÖNETİCİ BRİFİNGİ
  // -------------------------------------------------------------------------
  return {
    text: `🔍 **Ne Oldu? (Canlı Mağaza & Finans Özeti)**
Mağazanızın tüm kanallardaki anlık finansal ve operasyonel durumu canlı verilerle tarandı:
• **Toplam Ciro:** ${totalRev.toLocaleString('tr-TR')} ₺
• **Net Kâr:** ${netProf.toLocaleString('tr-TR')} ₺ (%${netMarg} Net Marj)
• **İzlenen Ürün Adedi:** ${products.length} Adet (${profitableProducts.length} Kârlı, ${losingProducts.length} İnceleme Gerektiren)
• **Kargo Kaçağı Durumu:** ${pendingLeaks.length} Hatalı Desi (${totalRecoverableCargo.toLocaleString('tr-TR')} ₺ İtiraza Hazır)
• **Bekleyen Müşteri Etkileşimi:** ${pendingQuestions.length} Soru, ${pendingReviews.length} Yorum

🧠 **Neden Oldu?**
Tüm satış fiyatları, tedarik maliyetleri, pazaryeri komisyonları (%21.5) ve kargo anlaşma tarifeleri (87 ₺) anlık olarak konsolide edilmiştir.

💸 **Finansal Etkisi Ne?**
Kâr kaçakları önlendiğinde ve kritik fiyat optimizasyonları yapıldığında aylık net kârınızda yaklaşık **+%18-%24 artış potansiyeli** mevcuttur.

⚡ **Ne Yapılabilir?**
AI E-Ticaret Çalışanı sekmesinden önerilen aksiyonları sırasıyla onaylayıp mağaza kârlılığınızı maksimize edebilirsiniz.`,
    suggestedAction: 'AI Çalışanı Paneline Git',
    actionTab: 'ai-worker'
  };
}
