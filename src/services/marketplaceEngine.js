// E-Ticaret Kâr, Kaçak ve Muhasebe Motoru (100% Deterministik Hesaplamalar)
import { resolveItemCommissionRate } from './marketplaceSyncService';

/**
 * Tek bir ürün için kâr, komisyon ve net marjı hesaplar
 */
export function calculateUnitProfit({
  costPrice = 0,
  sellingPrice = 0,
  commissionRate = 18,
  cargoFee = 38.50,
  vatRate = 20, // KDV %20
  adCostPerUnit = 0
}) {
  const selling = Number(sellingPrice) || 0;
  const cost = Number(costPrice) || 0;
  const commission = (selling * (Number(commissionRate) || 0)) / 100;
  const cargo = Number(cargoFee) || 0;
  const ad = Number(adCostPerUnit) || 0;

  // KDV dahil fiyattan KDV payı
  const vatAmount = selling - (selling / (1 + vatRate / 100));
  
  // Net Ele Geçen (Pazar yeri komisyon ve kargo kestikten sonra yatan)
  const netMarketplacePayout = selling - commission - cargo;
  
  // Gerçek Net Kâr (Tüm maliyetler düşüldükten sonra cebine kalan)
  const netProfit = netMarketplacePayout - cost - ad;
  const profitMarginPercent = selling > 0 ? (netProfit / selling) * 100 : 0;
  const roiPercent = cost > 0 ? (netProfit / cost) * 100 : 0;

  return {
    sellingPrice: selling,
    costPrice: cost,
    commissionAmount: Number(commission.toFixed(2)),
    cargoFee: Number(cargo.toFixed(2)),
    vatAmount: Number(vatAmount.toFixed(2)),
    adCostPerUnit: Number(ad.toFixed(2)),
    netMarketplacePayout: Number(netMarketplacePayout.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    profitMarginPercent: Number(profitMarginPercent.toFixed(1)),
    roiPercent: Number(roiPercent.toFixed(1)),
    isLoss: netProfit < 0
  };
}

/**
 * Bir sipariş paketi ve içerisindeki her bir ürün için kesin cebine kalan net kârı hesaplar.
 * products kataloğundan veya sipariş kaleminden maliyeti otomatik eşler.
 */
export function calculateOrderProfit(order, products = []) {
  if (!order) return null;

  const items = (order.items && order.items.length > 0) ? order.items : [
    {
      id: 'ITEM-1',
      title: order.productName || 'Ürün',
      sku: order.sku || 'SKU-001',
      barcode: order.barcode || '8680001928',
      unitPrice: order.grossPrice || 0,
      costPrice: order.costPrice,
      quantity: order.quantity || 1,
      commission: order.commission,
      netProfit: order.netProfit,
      profitMargin: order.profitMargin,
      image: order.image
    }
  ];

  let totalSelling = 0;
  let totalCost = 0;
  let totalCommission = 0;
  let hasMissingCost = false;
  const totalItemCount = items.reduce((sum, it) => sum + Number(it.quantity || 1), 0);

  const cargoSettings = typeof localStorage !== 'undefined' ? (() => {
    try {
      const saved = localStorage.getItem('izeeg_custom_cargo_settings');
      return saved ? JSON.parse(saved) : { trendyolCargoCost: 87.00, hepsiburadaCargoCost: 43.50 };
    } catch { return { trendyolCargoCost: 87.00, hepsiburadaCargoCost: 43.50 }; }
  })() : { trendyolCargoCost: 87.00, hepsiburadaCargoCost: 43.50 };

  const defaultCargo = order.marketplace === 'Trendyol' 
    ? (cargoSettings.trendyolCargoCost || 87.00) 
    : (cargoSettings.hepsiburadaCargoCost || 43.50);

  const cargoFee = Number(order.cargoCost !== undefined ? order.cargoCost : (order.cargoFee !== undefined ? order.cargoFee : defaultCargo));

  const calculatedItems = items.map((it) => {
    const qty = it.quantity || 1;
    const unitSelling = Number(it.unitPrice || 0);
    
    // Ürün kataloğundan (Barkod veya SKU ile) eşleşen ürünü bul
    const matchedProd = products.find(p => 
      (it.barcode && p.barcode === it.barcode) ||
      (it.sku && (p.sku === it.sku || p.id === it.sku)) ||
      (it.title && p.name && p.name.toLowerCase() === it.title.toLowerCase())
    );

    // 1. Maliyet Bulma (Kalem -> Ürün Kataloğu Hafızası)
    let unitCost = 0;
    let isCostEntered = false;

    if (it.costPrice !== undefined && it.costPrice !== null && it.costPrice !== '') {
      unitCost = Number(it.costPrice);
      isCostEntered = true;
    } else if (matchedProd && matchedProd.costPrice !== undefined && matchedProd.costPrice !== null) {
      unitCost = Number(matchedProd.costPrice);
      isCostEntered = true;
    } else {
      unitCost = 0;
      isCostEntered = false;
      hasMissingCost = true;
    }

    // 2. Komisyon Oranı (Pazar yeri API, Ürün Özel Oranı veya Akıllı Kategori Matrisi)
    const commRate = resolveItemCommissionRate({
      marketplace: order.marketplace || 'Trendyol',
      productName: it.title || order.productName || '',
      rawCommissionRate: it.commissionRate || (it.commission ? (Number(it.commission) / (unitSelling * qty)) * 100 : null),
      catalogProduct: matchedProd
    });

    const unitComm = it.commission ? (Number(it.commission) / qty) : ((unitSelling * commRate) / 100);
    
    // 3. Kargo maliyetinin ürün başına düşen payı
    const unitCargoShare = totalItemCount > 0 ? (cargoFee / totalItemCount) : 0;
    
    // 4. Ürün bazlı cebine giren net kâr (Birim Satış - Birim Maliyet - Komisyon - Kargo Payı)
    const unitNetProfit = unitSelling - unitCost - unitComm - unitCargoShare;
    const unitMargin = unitSelling > 0 ? (unitNetProfit / unitSelling) * 100 : 0;

    totalSelling += (unitSelling * qty);
    totalCost += (unitCost * qty);
    totalCommission += (unitComm * qty);

    return {
      ...it,
      unitPrice: unitSelling,
      costPrice: unitCost,
      isCostEntered,
      commissionAmount: Number(unitComm.toFixed(2)),
      commissionRate: commRate,
      cargoShare: Number(unitCargoShare.toFixed(2)),
      unitNetProfit: Number(unitNetProfit.toFixed(2)),
      totalNetProfit: Number((unitNetProfit * qty).toFixed(2)),
      profitMarginPercent: Number(unitMargin.toFixed(1)),
      isLoss: unitNetProfit < 0
    };
  });

  const grossPrice = order.grossPrice ? Number(order.grossPrice) : totalSelling;
  const netCommission = order.commission ? Number(order.commission) : totalCommission;
  const netPayout = grossPrice - netCommission - cargoFee;
  const totalNetProfit = netPayout - totalCost;
  const profitMarginPercent = grossPrice > 0 ? (totalNetProfit / grossPrice) * 100 : 0;

  return {
    grossPrice: Number(grossPrice.toFixed(2)),
    totalCostPrice: Number(totalCost.toFixed(2)),
    totalCommission: Number(netCommission.toFixed(2)),
    cargoFee: Number(cargoFee.toFixed(2)),
    netPayout: Number(netPayout.toFixed(2)),
    netProfit: Number(totalNetProfit.toFixed(2)),
    profitMarginPercent: Number(profitMarginPercent.toFixed(1)),
    isLoss: totalNetProfit < 0,
    hasMissingCost,
    items: calculatedItems
  };
}

/**
 * Mağaza genel metriklerini hesaplar
 */
export function calculateStoreMetrics(products = [], cargoLeaks = []) {
  let totalRevenue = 0;
  let totalCost = 0;
  let totalCommission = 0;
  let totalCargo = 0;
  let totalAdSpend = 0;
  let totalSalesCount = 0;
  let totalRefunds = 0;

  products.forEach(p => {
    const units = p.monthlySalesCount || 0;
    const revenue = units * p.sellingPrice;
    const cost = units * p.costPrice;
    const commission = (revenue * p.commissionRate) / 100;
    const cargo = units * p.cargoCost;
    
    totalRevenue += revenue;
    totalCost += cost;
    totalCommission += commission;
    totalCargo += cargo;
    totalAdSpend += (p.adSpend || 0);
    totalSalesCount += units;
    totalRefunds += (p.refundCount || 0);
  });

  const totalDeductions = totalCost + totalCommission + totalCargo + totalAdSpend;
  const netProfit = totalRevenue - totalDeductions;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const refundRate = totalSalesCount > 0 ? (totalRefunds / totalSalesCount) * 100 : 0;

  // Toplam kurtarılabilir kargo kaçağı
  const totalRecoverableCargo = cargoLeaks
    .filter(l => l.status === 'ActionRequired')
    .reduce((sum, l) => sum + l.leakAmount, 0);

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    netMargin: Number(netMargin.toFixed(1)),
    totalCommission: Number(totalCommission.toFixed(2)),
    totalCargo: Number(totalCargo.toFixed(2)),
    totalAdSpend: Number(totalAdSpend.toFixed(2)),
    totalSalesCount,
    totalRefunds,
    refundRate: Number(refundRate.toFixed(1)),
    totalRecoverableCargo: Number(totalRecoverableCargo.toFixed(2))
  };
}

/**
 * Kargo İtiraz Dilekçesi Metni Üretici (Trendyol & Hepsiburada Destek Talebi İçin)
 */
export function generateDisputeLetter(cargoLeak, sellerName = 'E-Ticaret Mağazası') {
  return `T.C. ${cargoLeak.marketplace.toUpperCase()} PAZAR YERİ VE KARGO OPERASYONLARI DİREKTÖRLÜĞÜ'NE

Konu: Hatalı Desi / Fazla Kargo Ücreti Kesintisi İadesi Talebi
Tarih: ${new Date().toLocaleDateString('tr-TR')}

Sayın Yetkili,

Mağazamız adına ${cargoLeak.marketplace} platformunda kayıtlı bulunan "${cargoLeak.productName}" ürünümüzün sistemde onaylı ve fiziki koli desisi ${cargoLeak.registeredDesi} DESİ'dir.

Buna karşın, ${cargoLeak.invoiceDate} tarihli ${cargoLeak.orderNumber} numaralı siparişin kargo faturası incelendiğinde, taşıyıcı kargo firması (${cargoLeak.carrier}) tarafından ürünümüz haksız ve hatalı olarak ${cargoLeak.billedDesi} DESİ üzerinden faturalandırılmıştır.

İtiraz Detayları:
• Sipariş No: ${cargoLeak.orderNumber}
• Pazar Yeri: ${cargoLeak.marketplace}
• Taşıyıcı Kargo: ${cargoLeak.carrier}
• Kayıtlı Ürün Desisi: ${cargoLeak.registeredDesi} Desi (Beklenen Tutar: ${cargoLeak.expectedFee.toFixed(2)} TL)
• Faturada Kesilen Desi: ${cargoLeak.billedDesi} Desi (Kesilen Tutar: ${cargoLeak.billedFee.toFixed(2)} TL)
• Haksız Kesinti Farkı: ${cargoLeak.leakAmount.toFixed(2)} TL + KDV

Kargo desi ölçümünün yeniden incelenerek, mağazamız carisine haksız olarak yansıtılan ${cargoLeak.leakAmount.toFixed(2)} TL tutarındaki fazla kargo bedelinin ivedilikle carimize iadesini arz ve talep ederiz.

Saygılarımızla,
${sellerName}
E-Ticaret Yönetimi`;
}
