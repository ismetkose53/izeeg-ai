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

// 1. DEMO & ÖRNEK VERİ SETLERİ (Kullanıcının Gerçek Mağaza Kataloğu & Canlı Metrikleri)
export const DEMO_PRODUCTS = [
  {
    id: 'Modalsiyah2',
    barcode: 'ymy100moda3',
    name: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
    variant: 'Renk: Siyah / Beden: Standart',
    category: 'Kadın Giyim & Takım',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 24,
    costPrice: 780.00,
    sellingPrice: 1950.00,
    commissionRate: 21.5,
    vatRate: 20,
    desi: 2,
    billedDesiAvg: 2,
    cargoCost: 87.00,
    adSpend: 1450.00,
    roas: 6.8,
    netProfit: 663.75,
    profitMargin: 34.0,
    monthlySalesCount: 140,
    refundCount: 4,
    returnRate: 2.8,
    shelfLocation: 'A-01',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'T.T.12',
    barcode: 'YMYYILDIZ3',
    name: 'Yıldız Taş Aksesuarlı, Vatkalı Oversize Tshirt',
    variant: 'Renk: Siyah / Beden: Standart',
    category: 'Kadın Tişört',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 18,
    costPrice: 640.00,
    sellingPrice: 1599.00,
    commissionRate: 21.5,
    vatRate: 20,
    desi: 1,
    billedDesiAvg: 1,
    cargoCost: 87.00,
    adSpend: 920.00,
    roas: 5.4,
    netProfit: 528.22,
    profitMargin: 33.0,
    monthlySalesCount: 110,
    refundCount: 3,
    returnRate: 2.7,
    shelfLocation: 'A-04',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'TRK-HRK-V01',
    barcode: '8680001928371',
    name: 'V Yaka Düğmeli Triko Hırka Ekru',
    variant: 'Renk: Ekru / Beden: Standart',
    category: 'Triko & Hırka',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 35,
    costPrice: 500.00,
    sellingPrice: 1250.00,
    commissionRate: 21.5,
    vatRate: 20,
    desi: 2,
    billedDesiAvg: 2,
    cargoCost: 87.00,
    adSpend: 750.00,
    roas: 4.8,
    netProfit: 394.25,
    profitMargin: 31.5,
    monthlySalesCount: 88,
    refundCount: 2,
    returnRate: 2.2,
    shelfLocation: 'B-02',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'PNT-PLZ-01',
    barcode: '8680002847192',
    name: 'Yüksek Bel Palazzo Jean Pantolon',
    variant: 'Renk: Mavi / Beden: 38',
    category: 'Jean & Pantolon',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 14,
    costPrice: 700.00,
    sellingPrice: 1750.00,
    commissionRate: 21.5,
    vatRate: 20,
    desi: 2,
    billedDesiAvg: 2,
    cargoCost: 87.00,
    adSpend: 1100.00,
    roas: 5.9,
    netProfit: 586.75,
    profitMargin: 33.5,
    monthlySalesCount: 165,
    refundCount: 6,
    returnRate: 3.6,
    shelfLocation: 'C-05',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'CKT-BLZ-02',
    barcode: '8680003928174',
    name: 'Keten Karışımlı Oversize Blazer Ceket',
    variant: 'Renk: Bej / Beden: L',
    category: 'Ceket & Dış Giyim',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 8,
    costPrice: 980.00,
    sellingPrice: 2450.00,
    commissionRate: 21.5,
    vatRate: 20,
    desi: 3,
    billedDesiAvg: 3,
    cargoCost: 87.00,
    adSpend: 1800.00,
    roas: 5.2,
    netProfit: 856.25,
    profitMargin: 34.9,
    monthlySalesCount: 52,
    refundCount: 1,
    returnRate: 1.9,
    shelfLocation: 'D-02',
    warehouse: 'Ana Merkez Depo',
    status: 'profitable',
    dataSource: 'API_VERIFIED',
    fastShipping: true
  },
  {
    id: 'ELB-SAT-03',
    barcode: '8680004819203',
    name: 'Dökümlü Saten Midi Elbise',
    variant: 'Renk: Zümrüt Yeşili / Beden: 38',
    category: 'Elbise',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&auto=format&fit=crop&q=60',
    marketplace: 'Trendyol',
    stock: 12,
    costPrice: 750.00,
    sellingPrice: 1890.00,
    commissionRate: 21.5,
    vatRate: 20,
    desi: 2,
    billedDesiAvg: 2,
    cargoCost: 87.00,
    adSpend: 1200.00,
    roas: 4.5,
    netProfit: 646.65,
    profitMargin: 34.2,
    monthlySalesCount: 74,
    refundCount: 3,
    returnRate: 4.0,
    shelfLocation: 'E-01',
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
        title: 'V Yaka Düğmeli Triko Hırka Ekru, Standart',
        sku: 'TRK-HRK-V01',
        color: 'Ekru',
        barcode: '8680001928371',
        size: 'Standart',
        unitPrice: 1250.00,
        costPrice: 500.00,
        commission: 250.00, // %20
        netProfit: 456.50,
        profitMargin: 36.5,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: 'V Yaka Düğmeli Triko Hırka Ekru',
    variant: 'Ekru / Standart',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&auto=format&fit=crop&q=80',
    quantity: 1,
    grossPrice: 1250.00,
    totalCostPrice: 500.00,
    commission: 250.00,
    cargoFee: 43.50,
    netProfit: 456.50, // 1250 - 500 - 250 - 43.50
    profitMargin: 36.5,
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
        title: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım, Standart",
        sku: 'Modalsiyah2',
        color: 'Siyah',
        barcode: 'ymy100moda3',
        size: 'Standart',
        unitPrice: 1950.00,
        costPrice: 780.00,
        commission: 48.75, // %2.5 sanal pos
        netProfit: 1034.25,
        profitMargin: 53.0,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=80'
      }
    ],
    productName: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
    variant: 'Siyah / Standart',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=80',
    quantity: 1,
    grossPrice: 1950.00,
    totalCostPrice: 780.00,
    commission: 48.75,
    cargoFee: 87.00,
    netProfit: 1034.25, // Kendi sitesinde pazaryeri komisyonu yok! Sadece %2.5 sanal pos maliyeti (1950 - 780 - 48.75 - 87.00)
    profitMargin: 53.0,
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
    title: 'Dökümlü Saten Midi Elbise: Reklam Arttı + İade Yükseldi = Net Zarar!',
    marketplace: 'Trendyol',
    product: 'Dökümlü Saten Midi Elbise (Zümrüt Yeşili / 38)',
    sku: 'ELB-SAT-03',
    q1_whatHappened: 'Ürünün haftalık cirosu 23.790 ₺ görünüyor ancak reklam ve çift kargo maliyetleri yüzünden muhasebede -1.059 ₺ net nakit kaybı var.',
    q2_whyHappened: 'Son 7 günde reklam bütçesi 3.400 ₺ harcanmış (ROAS 1.6 seviyesine geriledi). Ayrıca müşteriler "Kalıbı beklenenden dar" gerekçesiyle %18 oranında iade açtı. İade çift kargo maliyeti (174,00 ₺) doğrudan kârı eritti.',
    q3_financialImpact: 'Haftalık net nakit kaybı: -1.059,10 ₺. Müdahale edilmezse ay sonu net kayıp: -4.236 ₺.',
    q4_whatToDo: '1) Reklam bütçesini anında %35 kısın. 2) Ürün açıklamasına "1 beden büyük alınız" uyarısı ekleyerek iadeleri %40 düşürün.',
    action: {
      type: 'AD_BUDGET_REDUCE',
      label: 'Reklam Bütçesini %35 Kıs & Beden Uyarısı Ekle',
      payload: { sku: 'ELB-SAT-03', reducePercent: 35, estimatedSaving: '1.190 ₺/hafta' }
    }
  },
  {
    id: 'AI-CASE-02',
    severity: 'WARNING',
    badge: '📦 Desi Fatura Uyuşmazlığı',
    title: 'Kargo Firmaları 3 Siparişte 1-2 Desi Yerine 4-5 Desi Fatura Kesti',
    marketplace: 'Trendyol',
    product: 'Siyah Modal Takım & Yıldız Taş Tişört & Palazzo Jean',
    sku: 'Modalsiyah2, T.T.12, PNT-PLZ-01',
    q1_whatHappened: 'Sistemde 1-2 desi kayıtlı olan tekstil paketleri için kargo faturasında 4-5 desi üzerinden tahsilat yapıldı.',
    q2_whyHappened: 'Kargo şube barkod okuyucusu manuel yanlış desi girdi veya torbalar kargo şubesinde otomatik hatalı tartıldı.',
    q3_financialImpact: 'Son 10 günde haksız kesilen kargo tutarı: 124,50 ₺. Geçmiş aylarla beraber toplam 2.450 ₺ geri alınabilir.',
    q4_whatToDo: 'Pazar yerine iletilmek üzere sistem tarafından hazırlanan resmi "Desi İtiraz Dilekçesi"ni onaylayıp tek tıkla iletin.',
    action: {
      type: 'CARGO_CLAIM_FILED',
      label: 'Kargo İtiraz Dilekçesini Onayla & Gönder',
      payload: { leakCount: 3, recoverableAmount: '124,50 ₺' }
    }
  },
  {
    id: 'AI-CASE-03',
    severity: 'OPPORTUNITY',
    badge: '💰 Net Kâr Artış Fırsatı',
    title: 'Şampiyon Üründe Fiyat Artışı Marjı Katlar (Buybox Riski Yok)',
    marketplace: 'Trendyol',
    product: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
    sku: 'Modalsiyah2',
    q1_whatHappened: 'Bu üründe tek satıcısınız (Buybox rekabeti yok) ve günlük organik dönüşüm oranı %18.4 ile zirvede.',
    q2_whyHappened: 'Rakiplerin stoğu tükendiği için pazar yerinde fiyat esnekliği oluştu.',
    q3_financialImpact: 'Satış fiyatını 1.950,00 ₺ yerine 2.090,00 ₺ (+140 ₺) yaptığınızda aylık net kârınıza doğrudan +14.200 ₺ saf nakit eklenir.',
    q4_whatToDo: 'Ürün fiyatını 2.090,00 ₺ olarak güncelleyin.',
    action: {
      type: 'PRICE_UPDATE',
      label: 'Satış Fiyatını 2.090,00 ₺ Yap (+14.200 ₺/ay)',
      payload: { sku: 'Modalsiyah2', oldPrice: '1.950,00 ₺', newPrice: '2.090,00 ₺' }
    }
  },
  {
    id: 'AI-CASE-04',
    severity: 'WARNING',
    badge: '⚠️ Kritik Stok & Buybox Kaybı',
    title: 'Keten Karışımlı Oversize Blazer Ceket Stoğu Kritik (Günde 8 Satış Kaybı)',
    marketplace: 'Trendyol',
    product: 'Keten Karışımlı Oversize Blazer Ceket',
    sku: 'CKT-BLZ-02',
    q1_whatHappened: 'Ürün stoğu 8 adede düştü ve bu satış hızıyla 2 gün içinde tükenecektir.',
    q2_whyHappened: 'Satış hızı beklenenden %40 daha hızlı gerçekleşti ve tedarikçiye ön sipariş verilmedi.',
    q3_financialImpact: 'Stok tükendiğinde günlük ~4.900 ₺ ciro ve ~1.712 ₺ net kâr kaybı yaşanacaktır.',
    q4_whatToDo: 'Güngören Tekstil tedarikçisine 50 adetlik acil parti siparişi geçin.',
    action: {
      type: 'STOCK_RESTOCK',
      label: 'Tedarik Siparişi Bildir & Stoğu Güncelle',
      payload: { sku: 'CKT-BLZ-02', restockQty: 50 }
    }
  }
];

// 3. DEPO & ERP STOK YÖNETİMİ VERİLERİ
export const WAREHOUSES_LIST = [
  { id: 'WH-01', name: 'Ana Merkez Depo (Güngören / Merter)', capacity: '%74 Dolu', totalSkus: 247, status: 'ACTIVE' },
  { id: 'WH-02', name: 'Yedek Sevkiyat Deposu (İkitelli OSB)', capacity: '%45 Dolu', totalSkus: 38, status: 'ACTIVE' },
  { id: 'WH-03', name: 'İade & Hasar Kontrol Masası', capacity: '%18 Dolu', totalSkus: 14, status: 'ACTIVE' }
];

export const DEMO_XML_FEEDS = [
  {
    id: 'FEED-01',
    supplierName: 'Güngören Tekstil İmalat San. A.Ş.',
    xmlUrl: 'https://b2b.gungorentekstil.com/api/export.xml',
    updateFrequency: 'Saatlik (Otomatik)',
    lastSync: 'Bugün 14:30',
    itemCount: 1420,
    status: 'ACTIVE'
  },
  {
    id: 'FEED-02',
    supplierName: 'Merter Moda & Örme Tedarik Ltd.',
    xmlUrl: 'https://b2b.mertermoda.com/xml/feed_v2.xml',
    updateFrequency: 'Günde 2 Kez',
    lastSync: 'Bugün 11:00',
    itemCount: 890,
    status: 'ACTIVE'
  }
];

export const XML_SUPPLIER_FEEDS = [];

export const DEMO_STOCK_MOVEMENTS = [
  { id: 'MOV-101', date: '21.09.2026 14:48', type: 'OUT', quantity: 1, sku: 'Modalsiyah2', productName: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım", reason: 'Trendyol Sipariş Satışı (TY-11633598022)', user: 'Sistem API' },
  { id: 'MOV-102', date: '21.09.2026 12:00', type: 'IN', quantity: 50, sku: 'T.T.12', productName: 'Yıldız Taş Aksesuarlı, Vatkalı Oversize Tshirt', reason: 'Tedarikçi Girişi (İrsaliye #88192)', user: 'Depo Sorumlusu' },
  { id: 'MOV-103', date: '20.09.2026 16:05', type: 'IN_RETURN', quantity: 1, sku: 'PNT-PLZ-01', productName: 'Yüksek Bel Palazzo Jean Pantolon', reason: 'Müşteri İadesi Depoya Alındı (TY-9488102)', user: 'İade Kabul Masası' }
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
  { desiRange: '1 - 2 Desi', trendyolExpress: 87.00, hepsiJet: 43.50, arasKargo: 87.00, yurticiKargo: 92.00 },
  { desiRange: '3 - 5 Desi', trendyolExpress: 95.00, hepsiJet: 58.00, arasKargo: 105.00, yurticiKargo: 110.00 },
  { desiRange: '6 - 10 Desi', trendyolExpress: 120.00, hepsiJet: 85.00, arasKargo: 135.00, yurticiKargo: 145.00 },
  { desiRange: '11 - 15 Desi', trendyolExpress: 155.00, hepsiJet: 115.00, arasKargo: 175.00, yurticiKargo: 185.00 },
  { desiRange: '16 - 30 Desi', trendyolExpress: 210.00, hepsiJet: 165.00, arasKargo: 235.00, yurticiKargo: 250.00 }
];

export const CATEGORY_COMMISSION_TIERS = [
  { category: 'Kadın & Erkek Giyim', trendyol: '%21.5', hepsiburada: '%20.0', amazon: '%15.0', n11: '%20.0' },
  { category: 'Ayakkabı & Çanta', trendyol: '%21.0', hepsiburada: '%20.5', amazon: '%15.0', n11: '%20.0' },
  { category: 'Takı & Aksesuar', trendyol: '%23.0', hepsiburada: '%22.0', amazon: '%20.0', n11: '%22.0' },
  { category: 'Kozmetik & Kişisel Bakım', trendyol: '%18.0', hepsiburada: '%17.5', amazon: '%11.0', n11: '%18.0' },
  { category: 'Ev & Tekstil / Yaşam', trendyol: '%20.0', hepsiburada: '%19.0', amazon: '%15.0', n11: '%19.0' }
];

export const PLUS_TARIFF_TIERS = [
  { program: 'Trendyol Plus / Pass Satıcı Programı', benefit: 'Komisyonda %2 indirim + Ücretsiz Kargo desteği', condition: 'Kargoya verme süresi < 24 saat & İptal oranı < %1' },
  { program: 'Hepsiburada Premium Satıcı', benefit: 'Buybox önceliği + %1.5 ek komisyon indirimi', condition: 'Müşteri memnuniyet puanı > 9.4' },
  { program: 'Amazon Prime (FBA)', benefit: 'Prime rozeti ile %300 daha yüksek satış hızı', condition: 'Stokların Amazon deposuna gönderimi' }
];

export const HAKEDIS_DATA = [
  { id: 'HAK-01', platform: 'Trendyol', period: '15-21 Eylül 2026', grossAmount: 184500.00, commissionDeduction: 39667.50, cargoDeduction: 18270.00, netPayout: 126562.50, dueDate: '28.09.2026', status: 'Vadesi Bekleniyor' },
  { id: 'HAK-02', platform: 'Hepsiburada', period: '10-17 Eylül 2026', grossAmount: 94200.00, commissionDeduction: 18840.00, cargoDeduction: 8120.00, netPayout: 67240.00, dueDate: '24.09.2026', status: 'Onaylandı / Ödeme Emrinde' }
];

export const RETURNS_MANAGEMENT_DATA = [
  {
    id: 'RET-88102',
    orderId: 'TY-9488102',
    marketplace: 'Trendyol',
    customerName: 'Murat Çelik',
    productName: 'Dökümlü Saten Midi Elbise (Zümrüt Yeşili / 38)',
    sku: 'ELB-SAT-03',
    returnDate: '20.09.2026',
    reasonCategory: 'Beden / Kalıp Uymadı',
    reasonDetail: 'Kalıbı biraz dar geldi, 40 beden ile değişmek istiyorum.',
    productPrice: 1890.00,
    outboundCargoFee: 87.00,
    returnCargoFee: 87.00,
    repackagingCost: 20.00,
    totalLossFromReturn: 194.00,
    status: 'IN_TRANSIT',
    aiActionRecommendation: 'Ürün açıklamasına "Dar Kalıp - 1 Beden Büyük Önerilir" ibaresi eklendiğinde bu iadeler %40 önlenir.'
  },
  {
    id: 'RET-88103',
    orderId: 'TY-9480112',
    marketplace: 'Trendyol',
    customerName: 'Aylin Korkmaz',
    productName: 'Keten Karışımlı Oversize Blazer Ceket (Bej / L)',
    sku: 'CKT-BLZ-02',
    returnDate: '19.09.2026',
    reasonCategory: 'Cayma / Vazgeçme',
    reasonDetail: 'Fotoğraftaki renginden biraz daha açık ton geldi.',
    productPrice: 2450.00,
    outboundCargoFee: 87.00,
    returnCargoFee: 87.00,
    repackagingCost: 25.00,
    totalLossFromReturn: 199.00,
    status: 'ACCEPTED',
    aiActionRecommendation: 'Stüdyo gün ışığı çekimli detay fotoğrafı ekleyin.'
  },
  {
    id: 'RET-88104',
    orderId: 'HB-7721094',
    marketplace: 'Hepsiburada',
    customerName: 'Can Özkan',
    productName: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
    sku: 'Modalsiyah2',
    returnDate: '18.09.2026',
    reasonCategory: 'Kargo Hasarı',
    reasonDetail: 'Kargo poşeti yırtılmış ve kirlenmişti.',
    productPrice: 1950.00,
    outboundCargoFee: 43.50,
    returnCargoFee: 43.50,
    repackagingCost: 30.00,
    totalLossFromReturn: 117.00,
    status: 'ACCEPTED',
    aiActionRecommendation: 'HepsiJET kargo şubesi için tutanak talebi açıldı (Tazmin talep edilebilir).'
  }
];

export const AD_PERFORMANCE_DATA = [
  {
    id: 'CAMP-01',
    channel: 'Trendyol Sponsorlu Ürünler',
    campaignName: 'Modal Takım Dönüşüm Odaklı',
    productName: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
    sku: 'Modalsiyah2',
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
    campaignName: 'Saten Elbise Otomatik Reklam',
    productName: 'Dökümlü Saten Midi Elbise (Zümrüt Yeşili / 38)',
    sku: 'ELB-SAT-03',
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
    channel: 'Trendyol Sponsorlu Ürünler',
    campaignName: 'Yıldız Taş Tişört Öne Çıkanlar',
    productName: 'Yıldız Taş Aksesuarlı, Vatkalı Oversize Tshirt',
    sku: 'T.T.12',
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
    channel: 'Trendyol Sponsorlu Ürünler',
    campaignName: 'Palazzo Jean Otomatik Reklam',
    productName: 'Yüksek Bel Palazzo Jean Pantolon',
    sku: 'PNT-PLZ-01',
    budgetDaily: 220.00,
    totalSpend: 1600.00,
    clicks: 640,
    cpc: 2.50,
    generatedOrders: 25,
    generatedRevenue: 8247.50,
    roas: 5.15,
    netProfitAfterAd: 954.50,
    efficiencyStatus: 'OPTIMAL',
    aiNote: 'Tıklama başı maliyet makul ve kâr marjı çok güçlü.'
  }
];

export const PRODUCT_MAPPINGS_DATA = [
  {
    masterId: 'MASTER-PROD-01',
    masterName: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
    barcode: 'ymy100moda3',
    totalStockUnified: 24,
    channels: [
      { marketplace: 'Trendyol', channelSku: 'Modalsiyah2', price: 1950.00, stock: 24, status: 'SYNCED' },
      { marketplace: 'Hepsiburada', channelSku: 'HB-MODAL-TAKIM', price: 1990.00, stock: 24, status: 'SYNCED' },
      { marketplace: 'Amazon TR', channelSku: 'AMZ-MODAL-01', price: 1999.00, stock: 24, status: 'SYNCED' }
    ],
    matchConfidence: 100,
    needsUserReview: false
  },
  {
    masterId: 'MASTER-PROD-02',
    masterName: 'Yıldız Taş Aksesuarlı, Vatkalı Oversize Tshirt',
    barcode: 'YMYYILDIZ3',
    totalStockUnified: 18,
    channels: [
      { marketplace: 'Trendyol', channelSku: 'T.T.12', price: 1599.00, stock: 18, status: 'SYNCED' },
      { marketplace: 'Hepsiburada', channelSku: 'HB-YILDIZ-TSH', price: 1650.00, stock: 18, status: 'SYNCED' }
    ],
    matchConfidence: 100,
    needsUserReview: false
  },
  {
    masterId: 'MASTER-PROD-03',
    masterName: 'Yüksek Bel Palazzo Jean Pantolon',
    barcode: '8680002847192',
    totalStockUnified: 14,
    channels: [
      { marketplace: 'Trendyol', channelSku: 'PNT-PLZ-01', price: 1750.00, stock: 14, status: 'SYNCED' },
      { marketplace: 'Hepsiburada', channelSku: 'HB-PLZ-JEAN', price: 1790.00, stock: 14, status: 'SYNCED' }
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
    productName: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
    carrier: 'Trendyol Express',
    invoiceDate: '18.09.2026',
    registeredDesi: 2,
    billedDesi: 4,
    expectedFee: 87.00,
    billedFee: 95.00,
    leakAmount: 8.00,
    status: 'ActionRequired',
    dataSource: 'API_VERIFIED'
  },
  {
    id: 'CRG-AUDIT-102',
    orderNumber: 'TY-9479901',
    marketplace: 'Trendyol',
    productName: 'Yıldız Taş Aksesuarlı, Vatkalı Oversize Tshirt',
    carrier: 'Trendyol Express',
    invoiceDate: '15.09.2026',
    registeredDesi: 1,
    billedDesi: 3,
    expectedFee: 87.00,
    billedFee: 95.00,
    leakAmount: 8.00,
    status: 'ActionRequired',
    dataSource: 'API_VERIFIED'
  },
  {
    id: 'CRG-AUDIT-103',
    orderNumber: 'HB-7690122',
    marketplace: 'Hepsiburada',
    productName: 'Yüksek Bel Palazzo Jean Pantolon',
    carrier: 'HepsiJET',
    invoiceDate: '12.09.2026',
    registeredDesi: 2,
    billedDesi: 4,
    expectedFee: 43.50,
    billedFee: 58.00,
    leakAmount: 14.50,
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


