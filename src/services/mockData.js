// Genişletilmiş ve Gerçekçi Türkiye Çoklu Pazar Yeri, Depo ERP, E-Fatura & AI Çalışanı Veri Havuzu

// 1. Gerçek Veri Kaynakları & Doğrulama Durumları
export const DATA_STATUS_BADGES = {
  API_VERIFIED: {
    label: 'Doğrulanmış API Verisi',
    badgeClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
    dotClass: 'bg-emerald-500',
    description: 'Trendyol, Hepsiburada veya Amazon resmi API entegrasyonuyla anlık çekildi.'
  },
  ESTIMATED: {
    label: 'Tahmini Hesaplama',
    badgeClass: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
    dotClass: 'bg-amber-500',
    description: 'Kesin fatura henüz kesilmediği için komisyon ve kargo algoritmalarıyla hesaplanmıştır.'
  },
  NO_DATA: {
    label: 'Veri Yok',
    badgeClass: 'bg-slate-500/10 text-slate-600 border-slate-300',
    dotClass: 'bg-slate-400',
    description: 'Pazar yeri API tarafından bu dönem için veri iletilmedi.'
  },
  SYNC_FAILED: {
    label: 'Senkronizasyon Yapılamadı',
    badgeClass: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
    dotClass: 'bg-rose-500',
    description: 'API Anahtarı süresi dolmuş veya pazar yeri sunucusu yanıt vermiyor.'
  }
};

// 1. DEMO & ÖRNEK VERİ SETLERİ (Sunum & Test Modu İçin)
export const DEMO_PRODUCTS = [
  {
    id: 'SKU-001',
    barcode: '8682931284710',
    name: 'Kadın Spor Ayakkabı',
    variant: 'Renk: Beyaz / Beden: 38',
    category: 'Ayakkabı',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 42,
    costPrice: 189.00,
    sellingPrice: 399.90,
    commissionRate: 14.5,
    vatRate: 20,
    desi: 3,
    billedDesiAvg: 3,
    cargoCost: 42.91,
    adSpend: 1450.00,
    roas: 4.8,
    netProfit: 89.24,
    profitMargin: 22.3,
    monthlySalesCount: 320,
    refundCount: 14,
    returnRate: 4.3,
    shelfLocation: 'A-12',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'SKU-002',
    barcode: '8682931284727',
    name: 'Kadın Spor Ayakkabı',
    variant: 'Renk: Siyah / Beden: 37',
    category: 'Ayakkabı',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 18,
    costPrice: 189.00,
    sellingPrice: 399.90,
    commissionRate: 14.5,
    vatRate: 20,
    desi: 3,
    billedDesiAvg: 3,
    cargoCost: 42.91,
    adSpend: 820.00,
    roas: 4.2,
    netProfit: 89.24,
    profitMargin: 22.3,
    monthlySalesCount: 195,
    refundCount: 8,
    returnRate: 4.1,
    shelfLocation: 'A-14',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'SKU-003',
    barcode: '7638900482153',
    name: 'Erkek Koşu Şortu',
    variant: 'Renk: Lacivert / Beden: M',
    category: 'Spor Giyim',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 5,
    costPrice: 154.00,
    sellingPrice: 279.90,
    commissionRate: 18.0,
    vatRate: 20,
    desi: 2,
    billedDesiAvg: 5,
    cargoCost: 65.83,
    adSpend: 3400.00,
    roas: 1.6,
    netProfit: -12.46,
    profitMargin: -4.4,
    monthlySalesCount: 85,
    refundCount: 19,
    returnRate: 22.3,
    shelfLocation: 'B-03',
    warehouse: 'Ana Merkez Depo',
    status: 'losing',
    dataSource: 'API_VERIFIED',
    fastShipping: false
  },
  {
    id: 'SKU-004',
    barcode: '8690128374652',
    name: 'Yoga Matı Kalın 10mm',
    variant: 'Renk: Mor',
    category: 'Spor & Outdoor',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Hepsiburada',
    stock: 91,
    costPrice: 97.00,
    sellingPrice: 249.90,
    commissionRate: 16.0,
    vatRate: 10,
    desi: 8,
    billedDesiAvg: 8,
    cargoCost: 42.91,
    adSpend: 1100.00,
    roas: 5.4,
    netProfit: 67.31,
    profitMargin: 26.9,
    monthlySalesCount: 240,
    refundCount: 6,
    returnRate: 2.5,
    shelfLocation: 'C-08',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'SKU-005',
    barcode: '5903247812935',
    name: 'Fitness Direnç Bandı Seti',
    variant: 'Set: 5li / Ağırlık: Mixed',
    category: 'Spor & Outdoor',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Hepsiburada',
    stock: 0,
    costPrice: 62.00,
    sellingPrice: 149.90,
    commissionRate: 19.5,
    vatRate: 20,
    desi: 1,
    billedDesiAvg: 1,
    cargoCost: 34.16,
    adSpend: 950.00,
    roas: 3.1,
    netProfit: 14.72,
    profitMargin: 9.8,
    monthlySalesCount: 410,
    refundCount: 11,
    returnRate: 2.6,
    shelfLocation: 'D-01',
    warehouse: 'Ana Merkez Depo',
    status: 'break-even',
    dataSource: 'API_VERIFIED',
    fastShipping: false
  },
  {
    id: 'SKU-006',
    barcode: '8681952438201',
    name: 'Erkek Tayt Sıkıştırma',
    variant: 'Renk: Siyah / Beden: L',
    category: 'Spor Giyim',
    image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Amazon TR',
    stock: 33,
    costPrice: 118.00,
    sellingPrice: 329.90,
    commissionRate: 15.0,
    vatRate: 20,
    desi: 2,
    billedDesiAvg: 2,
    cargoCost: 65.83,
    adSpend: 1600.00,
    roas: 3.9,
    netProfit: 102.18,
    profitMargin: 30.9,
    monthlySalesCount: 175,
    refundCount: 4,
    returnRate: 2.2,
    shelfLocation: 'B-09',
    warehouse: 'FBA Lojistik Deposu',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'SKU-007',
    barcode: '8681952438999',
    name: 'Pembe Sweatshirt Kapüşonlu',
    variant: 'Beden: S',
    category: 'Giyim',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 64,
    costPrice: 85.00,
    sellingPrice: 199.99,
    commissionRate: 14.0,
    vatRate: 20,
    desi: 2,
    billedDesiAvg: 2,
    cargoCost: 38.50,
    adSpend: 620.00,
    roas: 4.5,
    netProfit: 48.49,
    profitMargin: 24.2,
    monthlySalesCount: 211,
    refundCount: 9,
    returnRate: 4.2,
    shelfLocation: 'E-02',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'SKU-008',
    barcode: '8681952438111',
    name: 'Siyah Şişme Mont Su Geçirmez',
    variant: 'Beden: L',
    category: 'Dış Giyim',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 22,
    costPrice: 420.00,
    sellingPrice: 899.90,
    commissionRate: 14.0,
    vatRate: 20,
    desi: 5,
    billedDesiAvg: 5,
    cargoCost: 58.00,
    adSpend: 2800.00,
    roas: 6.2,
    netProfit: 295.91,
    profitMargin: 32.8,
    monthlySalesCount: 94,
    refundCount: 12,
    returnRate: 12.7,
    shelfLocation: 'F-05',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  }
];

// Canlı Satış Modu Başlangıç Ürün Listesi (0 Kayıt - Temiz Başlangıç)
export const INITIAL_PRODUCTS = [];

// Demo Sipariş Havuzu (Çoklu Pazar Yeri & Ürün Bazlı Gerçek Kâr Hesaplaması)
export const DEMO_ORDERS = [
  // 1. TRENDYOL - 3 Parçalı Çoklu Sipariş Paketi
  {
    id: '#11633598022',
    orderNumber: '11633598022',
    packageNo: '4182778690',
    deliveryNo: '10888698922',
    remainingTime: '1 gün 13 saat 22 dakika',
    remainingTimeUrgent: false,
    marketplace: 'Trendyol',
    channelColor: '#f27a1a',
    orderDate: '22.09.2026 22:05',
    timeAgo: '12 dk önce',
    customerName: 'Esengül Bozaslan',
    isPlus: true,
    customerCity: 'İstanbul / Beşiktaş',
    customerAddress: 'Levent Mah. Çilekli Cad. No:14 D:6 Beşiktaş / İstanbul',
    taxNumber: '18290481920',
    taxOffice: 'Beşiktaş V.D.',
    items: [
      {
        id: 'ITEM-01',
        quantity: 1,
        title: 'Antrasit Yıkamalı Taş Detaylı Kadın Eşofman Takımı Antrasitesofman1, M',
        sku: 'Antrasitesofman1',
        color: 'Antrasit Yıkamalı',
        barcode: 'ANT.ESOFMAN2',
        size: 'M',
        unitPrice: 2750.00,
        costPrice: 1100.00,
        commission: 385.00, // %14
        netProfit: 1240.00,
        profitMargin: 45.1,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=80'
      },
      {
        id: 'ITEM-02',
        quantity: 1,
        title: 'Kedi Taş Aksesuarlı Vatkalı tshirt T.T.1106, S/M',
        sku: 'T.T.1106',
        color: 'Siyah',
        barcode: 'kedisiyahtas3',
        size: 'S/M',
        unitPrice: 1519.05,
        costPrice: 580.00,
        commission: 212.67, // %14
        netProfit: 710.00,
        profitMargin: 46.7,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=120&auto=format&fit=crop&q=80'
      },
      {
        id: 'ITEM-03',
        quantity: 1,
        title: 'Kedi Taş Aksesuarlı Vatkalı tshirt T.T.1106, S/M',
        sku: 'T.T.1106',
        color: 'Beyaz',
        barcode: 'kedisiyahtas2',
        size: 'S/M',
        unitPrice: 1519.05,
        costPrice: 580.00,
        commission: 212.67, // %14
        netProfit: 710.00,
        profitMargin: 46.7,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: 'Antrasit Eşofman Takımı + 2x Kedi Taş Vatkalı Tişört',
    variant: '3 Parça Kombin Paket',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=80',
    quantity: 3,
    grossPrice: 5788.10,
    totalCostPrice: 2260.00,
    commission: 810.34,
    cargoFee: 58.00,
    netProfit: 2659.76, // 5788.10 - 2260.00 - 810.34 - 58.00
    profitMargin: 46.0,
    carrier: 'Trendyol Express',
    carrierLogo: 'https://cdn.dsmcdn.com/seller-center/shipping-companies/trendyol_express.png',
    trackingNumber: '7330037383986536',
    status: 'NEW',
    statusLabel: 'Yeni',
    statusBadge: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    invoiceStatus: 'PENDING',
    invoiceNumber: null,
    supplyStatus: 'Zamanında',
    country: 'TR',
    dataSource: 'API_VERIFIED'
  },

  // 2. HEPSİBURADA SİPARİŞİ
  {
    id: '#HB-88391024',
    orderNumber: '88391024',
    packageNo: 'HB-PKG-772910',
    deliveryNo: 'HB-DEL-991028',
    remainingTime: '21 saat 10 dakika',
    remainingTimeUrgent: true,
    marketplace: 'Hepsiburada',
    channelColor: '#ff6000',
    orderDate: '22.09.2026 21:40',
    timeAgo: '45 dk önce',
    customerName: 'Cemre Yalçın',
    isPlus: false,
    customerCity: 'Ankara / Çankaya',
    customerAddress: 'Tunalı Hilmi Cad. No:45 D:12 Çankaya / Ankara',
    taxNumber: '11111111111',
    taxOffice: 'Çankaya V.D.',
    items: [
      {
        id: 'ITEM-HB-01',
        quantity: 1,
        title: 'Yoga Matı Kalın 10mm Kaydırmaz Mor',
        sku: 'YOGA-MAT-MOR',
        color: 'Mor',
        barcode: '8690128374652',
        size: '10mm',
        unitPrice: 349.90,
        costPrice: 110.00,
        commission: 55.98, // %16
        netProfit: 141.01,
        profitMargin: 40.3,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: 'Yoga Matı Kalın 10mm Kaydırmaz Mor',
    variant: 'Mor / 10mm',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=120&auto=format&fit=crop&q=80',
    quantity: 1,
    grossPrice: 349.90,
    totalCostPrice: 110.00,
    commission: 55.98,
    cargoFee: 42.91,
    netProfit: 141.01, // 349.90 - 110 - 55.98 - 42.91
    profitMargin: 40.3,
    carrier: 'HepsiJET',
    carrierLogo: 'https://images.hepsiburada.net/assets/sfstatic/Content/images/hepsijet-logo.png',
    trackingNumber: 'HJ-7729104812',
    status: 'NEW',
    statusLabel: 'Yeni',
    statusBadge: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    invoiceStatus: 'PENDING',
    invoiceNumber: null,
    supplyStatus: 'Kritik Tedarik Süresi',
    country: 'TR',
    dataSource: 'API_VERIFIED'
  },

  // 3. AMAZON TR SİPARİŞİ
  {
    id: '#AMZ-4029184',
    orderNumber: '4029184',
    packageNo: 'AMZ-402-9184',
    deliveryNo: 'AMZ-DEL-10492',
    remainingTime: '2 gün 08 saat',
    remainingTimeUrgent: false,
    marketplace: 'Amazon TR',
    channelColor: '#ff9900',
    orderDate: '22.09.2026 20:15',
    timeAgo: '2 saat önce',
    customerName: 'Mehmet Demir',
    isPlus: true,
    customerCity: 'İzmir / Bornova',
    customerAddress: 'Ege Üniversitesi Kampüs Yanı No:18 Bornova / İzmir',
    taxNumber: '29810294811',
    taxOffice: 'Bornova V.D.',
    items: [
      {
        id: 'ITEM-AMZ-01',
        quantity: 2,
        title: 'Erkek Tayt Sıkıştırma Profesyonel Koşu, L',
        sku: 'SKU-006',
        color: 'Siyah',
        barcode: '8681952438201',
        size: 'L',
        unitPrice: 429.90,
        costPrice: 145.00,
        commission: 64.48, // %15
        netProfit: 187.50,
        profitMargin: 43.6,
        image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: 'Erkek Tayt Sıkıştırma Profesyonel Koşu',
    variant: 'Siyah / L (2 Adet)',
    image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=120&auto=format&fit=crop&q=80',
    quantity: 2,
    grossPrice: 859.80,
    totalCostPrice: 290.00,
    commission: 128.97,
    cargoFee: 65.83,
    netProfit: 375.00, // 859.80 - 290 - 128.97 - 65.83
    profitMargin: 43.6,
    carrier: 'Kolay Gelsin (Amazon)',
    carrierLogo: 'https://kolaygelsin.com/assets/img/logo.svg',
    trackingNumber: 'KG-8839102419',
    status: 'NEW',
    statusLabel: 'Yeni',
    statusBadge: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    invoiceStatus: 'PENDING',
    invoiceNumber: null,
    supplyStatus: 'Zamanında',
    country: 'TR',
    dataSource: 'API_VERIFIED'
  },

  // 4. N11 SİPARİŞİ
  {
    id: '#N11-5509214',
    orderNumber: '5509214',
    packageNo: 'N11-PKG-99201',
    deliveryNo: 'N11-DEL-88192',
    remainingTime: '1 gün 05 saat',
    remainingTimeUrgent: false,
    marketplace: 'N11',
    channelColor: '#e31e24',
    orderDate: '22.09.2026 19:30',
    timeAgo: '3 saat önce',
    customerName: 'Burak Şahin',
    isPlus: false,
    customerCity: 'Antalya / Muratpaşa',
    customerAddress: 'Fener Mah. Lara Cad. No:99 Muratpaşa / Antalya',
    taxNumber: '48192049182',
    taxOffice: 'Muratpaşa V.D.',
    items: [
      {
        id: 'ITEM-N11-01',
        quantity: 1,
        title: 'Siyah Şişme Mont Su ve Rüzgar Geçirmez Kapüşonlu, L',
        sku: 'SKU-008',
        color: 'Siyah',
        barcode: '8681952438111',
        size: 'L',
        unitPrice: 1299.90,
        costPrice: 520.00,
        commission: 181.98, // %14
        netProfit: 539.92,
        profitMargin: 41.5,
        image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: 'Siyah Şişme Mont Su Geçirmez',
    variant: 'Siyah / L',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=120&auto=format&fit=crop&q=80',
    quantity: 1,
    grossPrice: 1299.90,
    totalCostPrice: 520.00,
    commission: 181.98,
    cargoFee: 58.00,
    netProfit: 539.92, // 1299.90 - 520 - 181.98 - 58.00
    profitMargin: 41.5,
    carrier: 'Aras Kargo',
    carrierLogo: 'https://www.araskargo.com.tr/assets/img/logo.svg',
    trackingNumber: 'ARAS-774910249',
    status: 'NEW',
    statusLabel: 'Yeni',
    statusBadge: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    invoiceStatus: 'PENDING',
    invoiceNumber: null,
    supplyStatus: 'Zamanında',
    country: 'TR',
    dataSource: 'API_VERIFIED'
  },

  // 5. KENDİ SİTEM (SHOPIFY) SİPARİŞİ
  {
    id: '#SH-1094',
    orderNumber: 'SH-1094',
    packageNo: 'SH-PKG-1094',
    deliveryNo: 'SH-DEL-1094',
    remainingTime: '1 gün 18 saat',
    remainingTimeUrgent: false,
    marketplace: 'Kendi Sitem (Shopify)',
    channelColor: '#10b981',
    orderDate: '22.09.2026 18:20',
    timeAgo: '4 saat önce',
    customerName: 'Selin Yıldız',
    isPlus: false,
    customerCity: 'Eskişehir / Tepebaşı',
    customerAddress: 'Eski Bağlar Mah. Üniversite Cad. No:19 Tepebaşı / Eskişehir',
    taxNumber: '11111111111',
    taxOffice: 'Eskişehir V.D.',
    items: [
      {
        id: 'ITEM-SH-01',
        quantity: 1,
        title: 'Kadın Spor Ayakkabı Hafif Taban Beyaz, 38',
        sku: 'SKU-001',
        color: 'Beyaz',
        barcode: '8682931284710',
        size: '38',
        unitPrice: 599.90,
        costPrice: 210.00,
        commission: 14.99, // %2.5 sanal pos
        netProfit: 332.00,
        profitMargin: 55.3,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: 'Kadın Spor Ayakkabı Hafif Taban Beyaz',
    variant: 'Beyaz / 38',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&auto=format&fit=crop&q=80',
    quantity: 1,
    grossPrice: 599.90,
    totalCostPrice: 210.00,
    commission: 14.99,
    cargoFee: 42.91,
    netProfit: 332.00, // Kendi sitesinde pazaryeri komisyonu yok! Sadece %2.5 sanal pos maliyeti
    profitMargin: 55.3,
    carrier: 'Yurtiçi Kargo',
    carrierLogo: 'https://www.yurticikargo.com/assets/img/logo.svg',
    trackingNumber: 'YK-6601928419',
    status: 'NEW',
    statusLabel: 'Yeni',
    statusBadge: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    invoiceStatus: 'PENDING',
    invoiceNumber: null,
    supplyStatus: 'Zamanında',
    country: 'TR',
    dataSource: 'API_VERIFIED'
  },

  // 6. TRENDYOL - Jean Pantolon Siparişi
  {
    id: '#11633586254',
    orderNumber: '11633586254',
    packageNo: '4182768448',
    deliveryNo: '10888686139',
    remainingTime: '1 gün 13 saat 17 dakika',
    remainingTimeUrgent: false,
    marketplace: 'Trendyol',
    channelColor: '#f27a1a',
    orderDate: '22.09.2026 22:01',
    timeAgo: '16 dk önce',
    customerName: 'Şule ARIKAN',
    isPlus: true,
    customerCity: 'Ankara / Çankaya',
    customerAddress: 'Gaziosmanpaşa Mah. Arjantin Cad. No:8 D:4 Çankaya / Ankara',
    taxNumber: '11111111111',
    taxOffice: 'Çankaya V.D.',
    items: [
      {
        id: 'ITEM-04',
        quantity: 1,
        title: 'Ymy Drop Taş Aksesuarlı Palozzo Jean ymy-drop-jeans1, 46',
        sku: 'merchantSku',
        color: 'Mavi',
        barcode: 'ymydrop2',
        size: '46',
        unitPrice: 1588.80,
        costPrice: 650.00,
        commission: 238.32, // %15
        netProfit: 657.57,
        profitMargin: 41.4,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: 'Ymy Drop Taş Aksesuarlı Palozzo Jean',
    variant: 'Mavi / 46',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=120&auto=format&fit=crop&q=80',
    quantity: 1,
    grossPrice: 1588.80,
    totalCostPrice: 650.00,
    commission: 238.32,
    cargoFee: 42.91,
    netProfit: 657.57, // 1588.80 - 650.00 - 238.32 - 42.91
    profitMargin: 41.4,
    carrier: 'Trendyol Express',
    carrierLogo: 'https://cdn.dsmcdn.com/seller-center/shipping-companies/trendyol_express.png',
    trackingNumber: '7330037383868610',
    status: 'NEW',
    statusLabel: 'Yeni',
    statusBadge: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    invoiceStatus: 'PENDING',
    invoiceNumber: null,
    supplyStatus: 'Zamanında',
    country: 'TR',
    dataSource: 'API_VERIFIED'
  },

  // 7. TRENDYOL - Basic V Yaka Tişört (2 Adet Paket)
  {
    id: '#11633541092',
    orderNumber: '11633541092',
    packageNo: '4182741928',
    deliveryNo: '10888629811',
    remainingTime: '23 saat 45 dakika',
    remainingTimeUrgent: true,
    marketplace: 'Trendyol',
    channelColor: '#f27a1a',
    orderDate: '22.09.2026 21:15',
    timeAgo: '1 saat önce',
    customerName: 'Derya Özkan',
    isPlus: false,
    customerCity: 'İzmir / Karşıyaka',
    customerAddress: 'Bostanlı Mah. Cemal Gürsel Cad. No:114 D:8 Karşıyaka / İzmir',
    taxNumber: '11111111111',
    taxOffice: 'Karşıyaka V.D.',
    items: [
      {
        id: 'ITEM-05',
        quantity: 2,
        title: 'Kadın Basic V Yaka Pamuklu Premium Tshirt, S',
        sku: 'V-TSHIRT-01',
        color: 'Ekru',
        barcode: 'EKRU_VTSHIRT1',
        size: 'S',
        unitPrice: 489.90,
        costPrice: 190.00,
        commission: 68.59, // %14
        netProfit: 210.00,
        profitMargin: 42.9,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: 'Kadın Basic V Yaka Pamuklu Premium Tshirt (2 Adet)',
    variant: 'Ekru / S',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=120&auto=format&fit=crop&q=80',
    quantity: 2,
    grossPrice: 979.80,
    totalCostPrice: 380.00,
    commission: 137.17,
    cargoFee: 42.91,
    netProfit: 419.72, // 979.80 - 380 - 137.17 - 42.91
    profitMargin: 42.8,
    carrier: 'Trendyol Express',
    carrierLogo: 'https://cdn.dsmcdn.com/seller-center/shipping-companies/trendyol_express.png',
    trackingNumber: '7330037181128941',
    status: 'NEW',
    statusLabel: 'Yeni',
    statusBadge: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    invoiceStatus: 'PENDING',
    invoiceNumber: null,
    supplyStatus: 'Kritik Tedarik Süresi',
    country: 'TR',
    dataSource: 'API_VERIFIED'
  },

  // 8. TRENDYOL - Oversize Kaşe Kaban
  {
    id: '#11633499201',
    orderNumber: '11633499201',
    packageNo: '4182701025',
    deliveryNo: '10888599182',
    remainingTime: '2 gün 04 saat',
    remainingTimeUrgent: false,
    marketplace: 'Trendyol',
    channelColor: '#f27a1a',
    orderDate: '22.09.2026 19:40',
    timeAgo: '2 saat önce',
    customerName: 'Melike Erdem',
    isPlus: false,
    customerCity: 'Bursa / Nilüfer',
    customerAddress: 'Ataevler Mah. Nenehatun Cad. No:22 D:5 Nilüfer / Bursa',
    taxNumber: '11111111111',
    taxOffice: 'Nilüfer V.D.',
    items: [
      {
        id: 'ITEM-06',
        quantity: 1,
        title: 'Oversize Kaşe Kruvaze Kaban Bej, L',
        sku: 'KASE-KABAN-BEJ',
        color: 'Bej',
        barcode: 'KBAN_BEJ_001',
        size: 'L',
        unitPrice: 3490.00,
        costPrice: 1450.00,
        commission: 488.60, // %14
        netProfit: 1476.40,
        profitMargin: 42.3,
        image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: 'Oversize Kaşe Kruvaze Kaban Bej',
    variant: 'Bej / L',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=120&auto=format&fit=crop&q=80',
    quantity: 1,
    grossPrice: 3490.00,
    totalCostPrice: 1450.00,
    commission: 488.60,
    cargoFee: 75.00,
    netProfit: 1476.40, // 3490.00 - 1450 - 488.60 - 75.00
    profitMargin: 42.3,
    carrier: 'Trendyol Express',
    carrierLogo: 'https://cdn.dsmcdn.com/seller-center/shipping-companies/trendyol_express.png',
    trackingNumber: '7330057182991847',
    status: 'NEW',
    statusLabel: 'Yeni',
    statusBadge: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
    invoiceStatus: 'PENDING',
    invoiceNumber: null,
    supplyStatus: 'Zamanında',
    country: 'TR',
    dataSource: 'API_VERIFIED'
  }
];

// Canlı Sipariş Listesi (0 Kayıt - Temiz Başlangıç)
export const UNIFIED_LIVE_ORDERS = [];

// 2. AI E-Ticaret Çalışanı 4-Sorulu Karar Vakaları
export const AI_EMPLOYEE_CASES = [
  {
    id: 'AI-CASE-01',
    severity: 'CRITICAL',
    badge: '🚨 Kritik Kâr Kaçağı',
    title: 'Erkek Koşu Şortu: Reklam Arttı + İade Yükseldi = Net Zarar!',
    marketplace: 'Trendyol',
    product: 'Erkek Koşu Şortu (Lacivert / M)',
    sku: 'SKU-003',
    q1_whatHappened: 'Ürünün haftalık cirosu 23.790 ₺ görünüyor ancak gerçek muhasebe hesabında -1.059 ₺ net nakit kaybı var.',
    q2_whyHappened: 'Son 7 günde reklam bütçesi 3.400 ₺ harcanmış (ROAS 1.6 seviyesine geriledi). Ayrıca müşteriler "Kalıbı beklenenden çok dar" gerekçesiyle %22.3 oranında iade açtı. İade çift kargo maliyeti (85,82 ₺) doğrudan cebinizden çıktı.',
    q3_financialImpact: 'Haftalık net nakit kaybı: -1.059,10 ₺. Müdahale edilmezse ay sonu net kayıp: -4.236 ₺.',
    q4_whatToDo: '1) Reklam bütçesini anında %35 kısın. 2) Ürün açıklamasına "1 beden büyük alınız" uyarısı ekleyerek iadeleri %40 düşürün.',
    action: {
      type: 'AD_BUDGET_REDUCE',
      label: 'Reklam Bütçesini %35 Kıs & Beden Uyarısı Ekle',
      payload: { sku: 'SKU-003', reducePercent: 35, estimatedSaving: '1.190 ₺/hafta' }
    }
  },
  {
    id: 'AI-CASE-02',
    severity: 'WARNING',
    badge: '📦 Desi Fatura Uyuşmazlığı',
    title: 'Kargo Firmaları 3 Siparişte 2 Desi Yerine 5 Desi Fatura Kesti',
    marketplace: 'Trendyol & Hepsiburada',
    product: 'Spor Ayakkabı & Koşu Şortu & Direnç Bandı',
    sku: 'SKU-001, SKU-003, SKU-005',
    q1_whatHappened: 'Sistemde 1-2 desi kayıtlı olan paketler için kargo faturasında 3-5 desi üzerinden tahsilat yapıldı.',
    q2_whyHappened: 'Kargo şube barkod okuyucusu manuel yanlış desi girdi veya koli ebatları kargo şubesinde otomatik 5 desi tartıldı.',
    q3_financialImpact: 'Son 10 günde haksız kesilen kargo tutarı: 67,68 ₺. Geçmiş aylarla beraber toplam 2.450 ₺ geri alınabilir.',
    q4_whatToDo: 'Pazar yerine iletilmek üzere sistem tarafından hazırlanan resmi "Desi İtiraz Dilekçesi"ni onaylayıp tek tıkla iletin.',
    action: {
      type: 'CARGO_CLAIM_FILED',
      label: 'Kargo İtiraz Dilekçesini Onayla & Gönder',
      payload: { leakCount: 3, recoverableAmount: '67,68 ₺' }
    }
  },
  {
    id: 'AI-CASE-03',
    severity: 'OPPORTUNITY',
    badge: '💰 Net Kâr Artış Fırsatı',
    title: 'Şampiyon Üründe Fiyat Artışı Marjı Katlar (Buybox Riski Yok)',
    marketplace: 'Trendyol',
    product: 'Kadın Spor Ayakkabı (Beyaz / 38)',
    sku: 'SKU-001',
    q1_whatHappened: 'Bu üründe tek satıcısınız (Buybox rekabeti yok) ve günlük organik dönüşüm oranı %18.4 ile zirvede.',
    q2_whyHappened: 'Rakiplerin stoğu tükendiği için pazar yerinde fiyat esnekliği oluştu.',
    q3_financialImpact: 'Satış fiyatını 399,90 ₺ yerine 439,90 ₺ (+40 ₺) yaptığınızda aylık net kârınıza doğrudan +10.240 ₺ saf nakit eklenir.',
    q4_whatToDo: 'Ürün fiyatını 439,90 ₺ olarak güncelleyin.',
    action: {
      type: 'PRICE_UPDATE',
      label: 'Satış Fiyatını 439,90 ₺ Yap (+10.240 ₺/ay)',
      payload: { sku: 'SKU-001', oldPrice: '399,90 ₺', newPrice: '439,90 ₺' }
    }
  },
  {
    id: 'AI-CASE-04',
    severity: 'WARNING',
    badge: '⚠️ Kritik Stok & Buybox Kaybı',
    title: 'Fitness Direnç Bandı Seti Stoğu Sıfırlandı (Günde 13 Satış Kaybı)',
    marketplace: 'Hepsiburada',
    product: 'Fitness Direnç Bandı Seti',
    sku: 'SKU-005',
    q1_whatHappened: 'Ürün stoğu dün 22:00 itibarıyla 0 oldu ve pazar yerinde liste pasife düştü.',
    q2_whyHappened: 'Satış hızı beklenenden %40 daha hızlı gerçekleşti ve tedarikçiye ön sipariş verilmedi.',
    q3_financialImpact: 'Her kapalı kalan gün için ~1.948 ₺ ciro ve ~191 ₺ net kâr kaybı yaşanıyor.',
    q4_whatToDo: 'Tedarikçiye 100 adetlik acil parti siparişi geçin ve mağaza içi stok alarmını 15 adede yükseltin.',
    action: {
      type: 'STOCK_RESTOCK',
      label: 'Tedarik Siparişi Bildir & Stoğu Güncelle',
      payload: { sku: 'SKU-005', restockQty: 100 }
    }
  }
];

// 3. DEPO & ERP STOK YÖNETİMİ VERİLERİ
export const WAREHOUSES_LIST = [
  { id: 'WH-01', name: 'Ana Merkez Depo (İstanbul / İkitelli)', capacity: '%74 Dolu', totalSkus: 247, status: 'ACTIVE' },
  { id: 'WH-02', name: 'Amazon FBA Lojistik Deposu (Gebze)', capacity: '%45 Dolu', totalSkus: 38, status: 'ACTIVE' },
  { id: 'WH-03', name: 'İade & Hasar Kontrol Deposu', capacity: '%18 Dolu', totalSkus: 14, status: 'ACTIVE' }
];

export const DEMO_XML_FEEDS = [
  {
    id: 'FEED-01',
    supplierName: 'Spor Dünyası Toptan A.Ş.',
    xmlUrl: 'https://xml.spordunyasi.com/feed/v2/products.xml',
    updateFrequency: 'Saatlik (Otomatik)',
    lastSync: 'Bugün 14:30',
    itemCount: 1420,
    status: 'ACTIVE'
  },
  {
    id: 'FEED-02',
    supplierName: 'Trend Tekstil Tedarik Ltd.',
    xmlUrl: 'https://b2b.trendtekstil.com/api/export.xml',
    updateFrequency: 'Günde 2 Kez',
    lastSync: 'Bugün 11:00',
    itemCount: 890,
    status: 'ACTIVE'
  }
];

export const XML_SUPPLIER_FEEDS = [];

export const DEMO_STOCK_MOVEMENTS = [
  { id: 'MOV-101', date: '21.09.2026 14:48', type: 'OUT', quantity: 1, sku: 'SKU-001', productName: 'Kadın Spor Ayakkabı', reason: 'Trendyol Sipariş Satışı (TY-9492101)', user: 'Sistem API' },
  { id: 'MOV-102', date: '21.09.2026 12:00', type: 'IN', quantity: 50, sku: 'SKU-004', productName: 'Yoga Matı 10mm', reason: 'Tedarikçi Girişi (İrsaliye #88192)', user: 'Depo Sorumlusu' },
  { id: 'MOV-103', date: '20.09.2026 16:05', type: 'IN_RETURN', quantity: 1, sku: 'SKU-003', productName: 'Erkek Koşu Şortu', reason: 'Müşteri İadesi Depoya Alındı (TY-9488102)', user: 'İade Kabul Masası' }
];

export const STOCK_MOVEMENTS = [];

// 4. E-FATURA & FATURA MERKEZİ SAĞLAYICILARI
export const DEMO_EINVOICE_PROVIDERS = [
  { id: 'parasut', name: 'Paraşüt E-Fatura', logo: '🧾', price: 'Standart Pakete Dahil (Ücretsiz)', connected: true, balance: '1.420 Kontör' },
  { id: 'bizimhesap', name: 'BizimHesap', logo: '💼', price: 'Standart Pakete Dahil (Ücretsiz)', connected: true, balance: '850 Kontör' },
  { id: 'kolaybi', name: 'KolayBi E-Dönüşüm', logo: '⚡', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'trendyol_efatura', name: 'Trendyol E-Faturam', logo: '🟠', price: 'Standart Pakete Dahil (Ücretsiz)', connected: true, balance: 'Sınırsız Entegre' },
  { id: 'sovos', name: 'Sovos / Foriba', logo: '🏢', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'qnb', name: 'QNB e-Finans', logo: '🏛️', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'logo', name: 'Logo İşbaşı / ERP', logo: '📊', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'edm', name: 'EDM Bilişim E-Dönüşüm', logo: '📁', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' }
];

export const EINVOICE_PROVIDERS = [
  { id: 'parasut', name: 'Paraşüt E-Fatura', logo: '🧾', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'bizimhesap', name: 'BizimHesap', logo: '💼', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'kolaybi', name: 'KolayBi E-Dönüşüm', logo: '⚡', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'trendyol_efatura', name: 'Trendyol E-Faturam', logo: '🟠', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'sovos', name: 'Sovos / Foriba', logo: '🏢', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'qnb', name: 'QNB e-Finans', logo: '🏛️', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'logo', name: 'Logo İşbaşı / ERP', logo: '📊', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'edm', name: 'EDM Bilişim E-Dönüşüm', logo: '📁', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' }
];

// 5. PRO MALİYET ALT SEKME TARİFELERİ
export const CARGO_DESI_PRICING_TIERS = [
  { desiRange: '1 - 2 Desi', trendyolExpress: 38.50, hepsiJet: 36.90, arasKargo: 44.50, yurticiKargo: 49.00 },
  { desiRange: '3 - 5 Desi', trendyolExpress: 42.91, hepsiJet: 41.50, arasKargo: 52.00, yurticiKargo: 58.00 },
  { desiRange: '6 - 10 Desi', trendyolExpress: 58.00, hepsiJet: 56.00, arasKargo: 69.50, yurticiKargo: 76.00 },
  { desiRange: '11 - 15 Desi', trendyolExpress: 74.50, hepsiJet: 72.00, arasKargo: 88.00, yurticiKargo: 98.00 },
  { desiRange: '16 - 30 Desi', trendyolExpress: 110.00, hepsiJet: 105.00, arasKargo: 135.00, yurticiKargo: 148.00 }
];

export const CATEGORY_COMMISSION_TIERS = [
  { category: 'Ayakkabı & Çanta', trendyol: '%14.5', hepsiburada: '%15.0', amazon: '%12.0', n11: '%15.0' },
  { category: 'Kadın & Erkek Giyim', trendyol: '%14.0', hepsiburada: '%14.5', amazon: '%13.0', n11: '%14.0' },
  { category: 'Spor & Outdoor', trendyol: '%16.0', hepsiburada: '%16.0', amazon: '%15.0', n11: '%16.5' },
  { category: 'Kozmetik & Kişisel Bakım', trendyol: '%13.0', hepsiburada: '%13.5', amazon: '%11.0', n11: '%14.0' },
  { category: 'Elektronik & Aksesuar', trendyol: '%8.5 - %12', hepsiburada: '%9.0 - %12.5', amazon: '%7.0 - %10', n11: '%9.0' }
];

export const PLUS_TARIFF_TIERS = [
  { program: 'Trendyol Plus / Pass Satıcı Programı', benefit: 'Komisyonda %2 indirim + Ücretsiz Kargo desteği', condition: 'Kargoya verme süresi < 24 saat & İptal oranı < %1' },
  { program: 'Hepsiburada Premium Satıcı', benefit: 'Buybox önceliği + %1.5 ek komisyon indirimi', condition: 'Müşteri memnuniyet puanı > 9.4' },
  { program: 'Amazon Prime (FBA)', benefit: 'Prime rozeti ile %300 daha yüksek satış hızı', condition: 'Stokların Amazon deposuna gönderimi' }
];

export const HAKEDIS_DATA = [
  { id: 'HAK-01', platform: 'Trendyol', period: '15-21 Eylül 2026', grossAmount: 184500.00, commissionDeduction: 26752.50, cargoDeduction: 14280.00, netPayout: 143467.50, dueDate: '28.09.2026', status: 'Vadesi Bekleniyor' },
  { id: 'HAK-02', platform: 'Hepsiburada', period: '10-17 Eylül 2026', grossAmount: 94200.00, commissionDeduction: 14130.00, cargoDeduction: 8120.00, netPayout: 71950.00, dueDate: '24.09.2026', status: 'Onaylandı / Ödeme Emrinde' }
];

export const RETURNS_MANAGEMENT_DATA = [
  {
    id: 'RET-88102',
    orderId: 'TY-9488102',
    marketplace: 'Trendyol',
    customerName: 'Murat Çelik',
    productName: 'Erkek Koşu Şortu (Lacivert / M)',
    sku: 'SKU-003',
    returnDate: '20.09.2026',
    reasonCategory: 'Beden / Kalıp Uymadı',
    reasonDetail: 'Kalıbı çok dar, M beden S gibi oldu.',
    productPrice: 279.90,
    outboundCargoFee: 42.91,
    returnCargoFee: 42.91,
    repackagingCost: 15.00,
    totalLossFromReturn: 100.82,
    status: 'IN_TRANSIT',
    aiActionRecommendation: 'Ürün açıklamasına "Dar Kalıp - 1 Beden Büyük Önerilir" ibaresi eklendiğinde bu iadeler %40 önlenir.'
  },
  {
    id: 'RET-88103',
    orderId: 'TY-9480112',
    marketplace: 'Trendyol',
    customerName: 'Aylin Korkmaz',
    productName: 'Siyah Şişme Mont Su Geçirmez',
    sku: 'SKU-008',
    returnDate: '19.09.2026',
    reasonCategory: 'Cayma / Beğenilmedi',
    reasonDetail: 'Fotoğraftaki renginden daha mat geldi.',
    productPrice: 899.90,
    outboundCargoFee: 58.00,
    returnCargoFee: 58.00,
    repackagingCost: 20.00,
    totalLossFromReturn: 136.00,
    status: 'ACCEPTED',
    aiActionRecommendation: 'Stüdyo çekimi gün ışığı fotoğrafı ekleyin.'
  },
  {
    id: 'RET-88104',
    orderId: 'HB-7721094',
    marketplace: 'Hepsiburada',
    customerName: 'Can Özkan',
    productName: 'Kadın Spor Ayakkabı (Beyaz / 38)',
    sku: 'SKU-001',
    returnDate: '18.09.2026',
    reasonCategory: 'Kargo Hasarı',
    reasonDetail: 'Ayakkabı kutusu ezilmiş ve yırtılmıştı.',
    productPrice: 399.90,
    outboundCargoFee: 42.91,
    returnCargoFee: 42.91,
    repackagingCost: 25.00,
    totalLossFromReturn: 110.82,
    status: 'ACCEPTED',
    aiActionRecommendation: 'HepsiJET kargo şubesi için tutanak talebi açıldı (Tazmin talep edilebilir).'
  }
];

export const AD_PERFORMANCE_DATA = [
  {
    id: 'CAMP-01',
    channel: 'Trendyol Sponsorlu Ürünler',
    campaignName: 'Spor Ayakkabı Dönüşüm Odaklı',
    productName: 'Kadın Spor Ayakkabı (Beyaz / 38)',
    sku: 'SKU-001',
    budgetDaily: 250.00,
    totalSpend: 1450.00,
    clicks: 1240,
    cpc: 1.17,
    generatedOrders: 68,
    generatedRevenue: 27193.20,
    roas: 18.75,
    netProfitAfterAd: 4618.32,
    efficiencyStatus: 'EXCELLENT',
    aiNote: 'Yüksek kârlı kampanya. Günlük bütçe %20 artırılabilir.'
  },
  {
    id: 'CAMP-02',
    channel: 'Trendyol Sponsorlu Ürünler',
    campaignName: 'Erkek Şort Otomatik Reklam',
    productName: 'Erkek Koşu Şortu (Lacivert / M)',
    sku: 'SKU-003',
    budgetDaily: 485.00,
    totalSpend: 3400.00,
    clicks: 1850,
    cpc: 1.84,
    generatedOrders: 20,
    generatedRevenue: 5598.00,
    roas: 1.64,
    netProfitAfterAd: -1059.10,
    efficiencyStatus: 'DANGER_LOSS',
    aiNote: '⚠️ GİZLİ KÂR KAÇAĞI: Reklam harcaması ürün kârını sıfırlayıp 1.059 TL zarara sokuyor. Acilen bütçe kısılmalı.'
  },
  {
    id: 'CAMP-03',
    channel: 'Hepsiburada HepsiAd',
    campaignName: 'Yoga & Pilates Öne Çıkanlar',
    productName: 'Yoga Matı Kalın 10mm',
    sku: 'SKU-004',
    budgetDaily: 150.00,
    totalSpend: 1100.00,
    clicks: 730,
    cpc: 1.50,
    generatedOrders: 42,
    generatedRevenue: 10495.80,
    roas: 9.54,
    netProfitAfterAd: 1727.02,
    efficiencyStatus: 'EXCELLENT',
    aiNote: 'Performans stabil. Organik sıralamayı da yukarı çekiyor.'
  },
  {
    id: 'CAMP-04',
    channel: 'Amazon Sponsored Products',
    campaignName: 'Erkek Spor Giyim Otomatik',
    productName: 'Erkek Tayt Sıkıştırma',
    sku: 'SKU-006',
    budgetDaily: 220.00,
    totalSpend: 1600.00,
    clicks: 640,
    cpc: 2.50,
    generatedOrders: 25,
    generatedRevenue: 8247.50,
    roas: 5.15,
    netProfitAfterAd: 954.50,
    efficiencyStatus: 'OPTIMAL',
    aiNote: 'Tıklama başı maliyet yüksek ama kâr marjı kurtarıyor.'
  }
];

export const PRODUCT_MAPPINGS_DATA = [
  {
    masterId: 'MASTER-PROD-01',
    masterName: 'Kadın Spor Ayakkabı Beyaz',
    barcode: '8682931284710',
    totalStockUnified: 42,
    channels: [
      { marketplace: 'Trendyol', channelSku: 'TY-AYK-001-38', price: 399.90, stock: 42, status: 'SYNCED' },
      { marketplace: 'Hepsiburada', channelSku: 'HB-AYK-WHT-38', price: 409.90, stock: 42, status: 'SYNCED' },
      { marketplace: 'Amazon TR', channelSku: 'B09WXYZ38', price: 419.00, stock: 42, status: 'SYNCED' },
      { marketplace: 'Shopify', channelSku: 'SH-SHOES-38', price: 399.90, stock: 42, status: 'SYNCED' }
    ],
    matchConfidence: 100,
    needsUserReview: false
  },
  {
    masterId: 'MASTER-PROD-02',
    masterName: 'Erkek Koşu Şortu Lacivert M',
    barcode: '7638900482153',
    totalStockUnified: 5,
    channels: [
      { marketplace: 'Trendyol', channelSku: 'TY-SORT-LAC-M', price: 279.90, stock: 5, status: 'SYNCED' },
      { marketplace: 'Hepsiburada', channelSku: 'HB-SORT-M', price: 289.90, stock: 5, status: 'SYNCED' },
      { marketplace: 'Amazon TR', channelSku: 'B08LMN772', price: 299.00, stock: 5, status: 'PENDING_MATCH' }
    ],
    matchConfidence: 85,
    needsUserReview: true,
    reviewNote: 'Amazon TR üzerindeki "Erkek Koşu Şortu Spor M" ürünü aynı barkoda sahip. Eşleştirmeyi onaylayınız.'
  },
  {
    masterId: 'MASTER-PROD-03',
    masterName: 'Yoga Matı Kalın 10mm Mor',
    barcode: '8690128374652',
    totalStockUnified: 91,
    channels: [
      { marketplace: 'Hepsiburada', channelSku: 'HB-YOGA-10MM', price: 249.90, stock: 91, status: 'SYNCED' },
      { marketplace: 'Trendyol', channelSku: 'TY-MAT-PURPLE', price: 249.90, stock: 91, status: 'SYNCED' }
    ],
    matchConfidence: 100,
    needsUserReview: false
  }
];

export const MARKETPLACE_ONBOARDING_GUIDES = {
  Trendyol: {
    name: 'Trendyol Satıcı Paneli',
    logo: '🟠',
    credentialFields: [
      { key: 'sellerId', label: 'Satıcı ID (Cari ID)', placeholder: 'Örn: 104829', whereToFind: 'Trendyol Satıcı Paneli > Sağ Üst Profil İsminizin Yanındaki 6 Haneli Numara' },
      { key: 'apiKey', label: 'API Key', placeholder: 'Örn: qYx81920...', whereToFind: 'Hesap Bilgilerim > Entegrasyon Bilgileri > API Key' },
      { key: 'apiSecret', label: 'API Secret Key', placeholder: '••••••••••••••••', whereToFind: 'Hesap Bilgilerim > Entegrasyon Bilgileri > API Secret' }
    ],
    steps: [
      '1. Trendyol Satıcı Panelinize (partner.trendyol.com) giriş yapın.',
      '2. Sağ üstte yer alan profil simgenize tıklayıp "Hesap Bilgilerim" sayfasına gidin.',
      '3. Sol menüden "Entegrasyon Bilgileri" sekmesini açın.',
      '4. "API Key" ve "API Secret" alanlarını kopyalayıp aşağıdaki kutucuklara yapıştırın.',
      '5. "Bağlantıyı Test Et" butonuna basarak ilk veri senkronizasyonunu başlatın.'
    ],
    testEndpointStatus: 'OK',
    estimatedSyncTime: 'Yaklaşık 15 saniye'
  },
  Hepsiburada: {
    name: 'Hepsiburada Satıcı Paneli (Merchant)',
    logo: '🟠',
    credentialFields: [
      { key: 'merchantId', label: 'Merchant ID', placeholder: 'Örn: 9283-hb-281', whereToFind: 'Hepsiburada Merchant Portal > Mağaza Profilim' },
      { key: 'apiKey', label: 'Entegratör API Key', placeholder: '••••••••••••••••', whereToFind: 'Ayarlar > API Entegrasyon > Yetki Anahtarı' }
    ],
    steps: [
      '1. Hepsiburada Satıcı Panelinize (merchant.hepsiburada.com) giriş yapın.',
      '2. Ayarlar menüsünden "API Entegrasyon" sekmesini seçin.',
      '3. Yeni API Kullanıcısı oluşturun veya mevcut Merchant ID ve Anahtarınızı kopyalayın.',
      '4. Bilgileri forma girip "Bağlantıyı Test Et" butonuna tıklayın.'
    ],
    testEndpointStatus: 'OK',
    estimatedSyncTime: 'Yaklaşık 20 saniye'
  },
  Amazon: {
    name: 'Amazon TR (Seller Central)',
    logo: '🟡',
    credentialFields: [
      { key: 'sellerId', label: 'Merchant Token / Seller ID', placeholder: 'Örn: A28190XTY12', whereToFind: 'Seller Central > Settings > Account Info > Merchant Token' },
      { key: 'spApiToken', label: 'SP-API LWA Refresh Token', placeholder: '••••••••••••••••', whereToFind: 'Developer Console > Apps & Services' }
    ],
    steps: [
      '1. Amazon Seller Central (sellercentral.amazon.com.tr) hesabınıza girin.',
      '2. Sağ üstteki "Ayarlar" > "Hesap Bilgileri" > "Satıcı Kimliği / Merchant Token"ı kopyalayın.',
      '3. SP-API yetkilendirme linkimiz üzerinden mağazanızı tek tıkla onaylayın.',
      '4. Otomatik sipariş ve stok senkronizasyonu başlasın.'
    ],
    testEndpointStatus: 'OK',
    estimatedSyncTime: 'Yaklaşık 30 saniye'
  }
};

// Canlı Kargo Kaçakları Listesi (0 Kayıt - Temiz Başlangıç)
export const DEMO_CARGO_AUDIT_LEAKS = [
  {
    id: 'CRG-AUDIT-101',
    orderNumber: 'TY-9480851',
    marketplace: 'Trendyol',
    productName: 'Kadın Spor Ayakkabı',
    carrier: 'Trendyol Express',
    invoiceDate: '18.09.2026',
    registeredDesi: 3,
    billedDesi: 5,
    expectedFee: 42.91,
    billedFee: 65.83,
    leakAmount: 22.92,
    status: 'ActionRequired',
    dataSource: 'API_VERIFIED'
  },
  {
    id: 'CRG-AUDIT-102',
    orderNumber: 'TY-9479901',
    marketplace: 'Trendyol',
    productName: 'Erkek Koşu Şortu',
    carrier: 'Aras Kargo',
    invoiceDate: '15.09.2026',
    registeredDesi: 2,
    billedDesi: 5,
    expectedFee: 42.91,
    billedFee: 65.83,
    leakAmount: 22.92,
    status: 'ActionRequired',
    dataSource: 'API_VERIFIED'
  },
  {
    id: 'CRG-AUDIT-103',
    orderNumber: 'HB-7690122',
    marketplace: 'Hepsiburada',
    productName: 'Fitness Direnç Bandı Seti',
    carrier: 'HepsiJET',
    invoiceDate: '12.09.2026',
    registeredDesi: 1,
    billedDesi: 3,
    expectedFee: 34.16,
    billedFee: 44.00,
    leakAmount: 9.84,
    status: 'ActionRequired',
    dataSource: 'API_VERIFIED'
  }
];

export const MOCK_CARGO_AUDIT_LEAKS = [];

export const MOCK_CHART_TIMELINE = [
  { day: '15 Eyl', ciro: 18450, netKar: 4890, komisyon: 2600, kargo: 1850 },
  { day: '16 Eyl', ciro: 22100, netKar: 5720, komisyon: 3100, kargo: 2200 },
  { day: '17 Eyl', ciro: 19800, netKar: 4940, komisyon: 2800, kargo: 1990 },
  { day: '18 Eyl', ciro: 27600, netKar: 7100, komisyon: 3900, kargo: 2600 },
  { day: '19 Eyl', ciro: 34200, netKar: 8850, komisyon: 4800, kargo: 3400 },
  { day: '20 Eyl', ciro: 41800, netKar: 10200, komisyon: 5900, kargo: 4100 },
  { day: '21 Eyl (Bugün)', ciro: 38900, netKar: 9150, komisyon: 5400, kargo: 3800 },
];

// Trendyol Raporlar Sayfası Saatlik Ciro Karşılaştırması (Bugün vs Dün)
export const TRENDYOL_HOURLY_PERFORMANCE = [
  { hour: '00:00', bugun: 0, dun: 1200 },
  { hour: '03:00', bugun: 0, dun: 1800 },
  { hour: '06:00', bugun: 0, dun: 3400 },
  { hour: '09:00', bugun: 450, dun: 8200 },
  { hour: '12:00', bugun: 1250, dun: 14600 },
  { hour: '15:00', bugun: 3100, dun: 18900 },
  { hour: '18:00', bugun: 5800, dun: 22400 },
  { hour: '21:00', bugun: 14200, dun: 23800 },
  { hour: '23:00', bugun: 18950, dun: 24044 },
];

// Trendyol Promosyon, Fiyatlandırma ve Reklam Özet Matrisi (Görsel 1 ile Birebir)
export const TRENDYOL_PROMOTION_MATRIX = {
  dateRange: '25/08/2026 - 23/09/2026',
  lastUpdated: '23/09/2026 00:00',
  columns: [
    {
      id: 'campaign',
      name: 'Kampanya',
      badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      grossRevenue: '8.750 ₺',
      totalRatio: '8.750 ₺ / 1.004.682 ₺',
      ratioPercent: '%0.9',
      spentBudget: '875 ₺',
      returnOnSpend: '10.00',
      grossSalesUnits: '5 / 543 (%0.9)',
      definedCount: '1',
      activeCount: '5'
    },
    {
      id: 'coupon',
      name: 'Kupon',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      grossRevenue: '57.337 ₺',
      totalRatio: '57.337 ₺ / 1.004.682 ₺',
      ratioPercent: '%5.7',
      spentBudget: '800 ₺',
      returnOnSpend: '71.67',
      grossSalesUnits: '31 / 543 (%5.7)',
      definedCount: '2',
      activeCount: '15.5'
    },
    {
      id: 'discount',
      name: 'İndirim',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      isBanner: true,
      bannerTitle: 'İndirimlerle Dikkat Çek. Sepetini Büyüt!',
      bullet1: 'Siparişe dönüşüm oranında %20\'ye varan artış',
      bullet2: 'Sipariş başına ürün adedinde 3 kata varan artış',
      buttonText: 'İndirim Oluştur'
    },
    {
      id: 'ads',
      name: 'Reklam',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      grossRevenue: '49.443 ₺',
      totalRatio: '49.443 ₺ / 1.004.682 ₺',
      ratioPercent: '%4.9',
      spentBudget: '9.880 ₺',
      returnOnSpend: '5.00',
      grossSalesUnits: '25 / 543 (%4.6)',
      definedCount: '3',
      activeCount: '8.3'
    },
    {
      id: 'flash',
      name: 'Flaş Ürünler',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      grossRevenue: '0 ₺',
      totalRatio: '0 ₺ / 1.004.682 ₺',
      ratioPercent: '%0',
      spentBudget: '0 ₺',
      returnOnSpend: '0',
      grossSalesUnits: '0 / 543 (%0)',
      definedCount: '5',
      activeCount: '0'
    }
  ]
};


