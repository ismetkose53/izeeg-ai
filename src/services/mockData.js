// Türkiye Çoklu Pazar Yeri, Depo ERP, E-Fatura & AI Çalışanı Veri Tanımları

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

// 2. Ürün Havuzu (Doğrulanmış Tekstil / Kadın Giyim Kataloğu)
export const INITIAL_PRODUCTS = [
  {
    id: 'YILDIZYMY1',
    barcode: '8683838112345',
    sku: 'YILDIZYMY1',
    name: 'Yıldız Taş Detaylı Yüksek Bel Palazzo Jean Pantolon',
    category: 'Kadın Giyim',
    subCategory: 'Jean & Pantolon',
    marketplace: 'Trendyol',
    stock: 85,
    criticalStock: 15,
    costPrice: 280.00,
    sellingPrice: 799.00,
    commissionRate: 21.5,
    vatRate: 10,
    desi: 2,
    cargoCost: 87.00,
    netProfit: 260.22,
    profitMargin: 32.6,
    status: 'profitable',
    monthlySalesCount: 145,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    warehouse: 'Ana Merkez Depo',
    shelfLocation: 'A-12-04'
  },
  {
    id: 'TSH25001-Y',
    barcode: '8683838112350',
    sku: 'TSH25001-Y',
    name: 'Yumey Modal V Yaka Pamuklu Kadın Tişört',
    category: 'Kadın Giyim',
    subCategory: 'Tişört & Bluz',
    marketplace: 'Trendyol',
    stock: 120,
    criticalStock: 25,
    costPrice: 95.00,
    sellingPrice: 349.00,
    commissionRate: 21.5,
    vatRate: 10,
    desi: 1,
    cargoCost: 87.00,
    netProfit: 91.96,
    profitMargin: 26.4,
    status: 'profitable',
    monthlySalesCount: 220,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    warehouse: 'Ana Merkez Depo',
    shelfLocation: 'B-04-02'
  },
  {
    id: 'ANT.ESOFMAN2',
    barcode: '8683838112347',
    sku: 'ANT.ESOFMAN2',
    name: 'Antrasit Yıkamalı Taş Detaylı Kadın Eşofman Takımı',
    category: 'Kadın Giyim',
    subCategory: 'Eşofman & Takım',
    marketplace: 'Trendyol',
    stock: 42,
    criticalStock: 10,
    costPrice: 390.00,
    sellingPrice: 1199.00,
    commissionRate: 21.5,
    vatRate: 10,
    desi: 2,
    cargoCost: 87.00,
    netProfit: 464.22,
    profitMargin: 38.7,
    status: 'profitable',
    monthlySalesCount: 88,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    warehouse: 'Ana Merkez Depo',
    shelfLocation: 'C-08-01'
  },
  {
    id: 'TKM25006-G',
    barcode: '8683838112351',
    sku: 'TKM25006-G',
    name: 'Yumey 2\'li Modal Tişört ve Bol Paça Pantolon Takım',
    category: 'Kadın Giyim',
    subCategory: 'İkili Takım',
    marketplace: 'Hepsiburada',
    stock: 60,
    criticalStock: 12,
    costPrice: 340.00,
    sellingPrice: 989.00,
    commissionRate: 20.0,
    vatRate: 10,
    desi: 2,
    cargoCost: 43.50,
    netProfit: 407.70,
    profitMargin: 41.2,
    status: 'profitable',
    monthlySalesCount: 65,
    image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&auto=format&fit=crop&q=80',
    warehouse: 'Ana Merkez Depo',
    shelfLocation: 'C-09-03'
  },
  {
    id: 'YMYYILDIZ1',
    barcode: '8683838112348',
    sku: 'YMYYILDIZ1',
    name: 'YMY Yıldız Desenli Vatkalı Tişört',
    category: 'Kadın Giyim',
    subCategory: 'Tişört',
    marketplace: 'Trendyol',
    stock: 75,
    criticalStock: 15,
    costPrice: 110.00,
    sellingPrice: 389.00,
    commissionRate: 21.5,
    vatRate: 10,
    desi: 1,
    cargoCost: 87.00,
    netProfit: 108.36,
    profitMargin: 27.9,
    status: 'profitable',
    monthlySalesCount: 110,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    warehouse: 'Ana Merkez Depo',
    shelfLocation: 'B-05-01'
  },
  {
    id: 'YMYKANGURU12',
    barcode: '8683838112349',
    sku: 'YMYKANGURU12',
    name: 'Kanguru Cepli Taş Aksesuarlı Sweatshirt Takım',
    category: 'Kadın Giyim',
    subCategory: 'Sweatshirt & Eşofman',
    marketplace: 'Amazon TR',
    stock: 35,
    criticalStock: 8,
    costPrice: 380.00,
    sellingPrice: 1149.00,
    commissionRate: 15.0,
    vatRate: 10,
    desi: 2,
    cargoCost: 40.00,
    netProfit: 556.65,
    profitMargin: 48.4,
    status: 'profitable',
    monthlySalesCount: 52,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    warehouse: 'Ana Merkez Depo',
    shelfLocation: 'C-10-02'
  },
  {
    id: 'YMYKAHVE2',
    barcode: '8683838112352',
    sku: 'YMYKAHVE2',
    name: 'Kahve Yıkamalı Taş Detaylı Kadın Eşofman Takımı',
    category: 'Kadın Giyim',
    subCategory: 'Eşofman Takımı',
    marketplace: 'Trendyol',
    stock: 28,
    criticalStock: 10,
    costPrice: 390.00,
    sellingPrice: 1199.00,
    commissionRate: 21.5,
    vatRate: 10,
    desi: 2,
    cargoCost: 87.00,
    netProfit: 464.22,
    profitMargin: 38.7,
    status: 'profitable',
    monthlySalesCount: 45,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    warehouse: 'Ana Merkez Depo',
    shelfLocation: 'C-08-02'
  },
  {
    id: 'YMYP3',
    barcode: '8683838112353',
    sku: 'YMYP3',
    name: 'YMY Dökümlü Kumaş Palazzo Pantolon',
    category: 'Kadın Giyim',
    subCategory: 'Pantolon',
    marketplace: 'Kendi Sitem (Shopify)',
    stock: 50,
    criticalStock: 10,
    costPrice: 220.00,
    sellingPrice: 699.00,
    commissionRate: 2.0, // Sanal POS
    vatRate: 10,
    desi: 2,
    cargoCost: 45.00,
    netProfit: 420.02,
    profitMargin: 60.1,
    status: 'profitable',
    monthlySalesCount: 70,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
    warehouse: 'Ana Merkez Depo',
    shelfLocation: 'A-14-01'
  }
];

export const DEMO_PRODUCTS = [...INITIAL_PRODUCTS];

// 3. Gerçekçi Sipariş Havuzu
export const DEMO_ORDERS = [
  {
    id: 'TY-948201948',
    orderNumber: '948201948',
    packageNo: 'PKG-774819',
    deliveryNo: 'DLV-883921',
    marketplace: 'Trendyol',
    customerName: 'Melisa Kara',
    customerPhone: '0532 *** ** 12',
    shippingAddress: 'Caferağa Mah. Moda Cad. No:44 D:5 Kadıköy / İSTANBUL',
    city: 'İstanbul',
    district: 'Kadıköy',
    orderDate: 'Bugün, 14:25',
    createdAt: new Date().toISOString(),
    status: 'PREPARING',
    statusLabel: 'Hazırlanıyor / Kargoya Verilecek',
    supplyStatus: 'ON_TIME',
    remainingHours: 18,
    cargoProvider: 'Trendyol Express',
    trackingNumber: '7330291849102',
    grossPrice: 799.00,
    costPrice: 280.00,
    commission: 171.78,
    commissionRate: 21.5,
    cargoCost: 87.00,
    cargoFee: 87.00,
    netPayout: 540.22,
    netProfit: 260.22,
    profitMargin: 32.6,
    isLoss: false,
    invoiceStatus: 'PENDING',
    productName: 'Yıldız Taş Detaylı Yüksek Bel Palazzo Jean Pantolon',
    sku: 'YILDIZYMY1',
    barcode: '8683838112345',
    variant: 'Beden: 38 | Renk: Açık Mavi Jean',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ITM-01',
        title: 'Yıldız Taş Detaylı Yüksek Bel Palazzo Jean Pantolon',
        sku: 'YILDIZYMY1',
        barcode: '8683838112345',
        variant: '38 Beden',
        quantity: 1,
        unitPrice: 799.00,
        costPrice: 280.00,
        commission: 171.78,
        commissionRate: 21.5,
        cargoShare: 87.00,
        vatRate: 10,
        netProfit: 260.22,
        profitMarginPercent: 32.6,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'TY-948201949',
    orderNumber: '948201949',
    packageNo: 'PKG-774820',
    deliveryNo: 'DLV-883922',
    marketplace: 'Trendyol',
    customerName: 'Zeynep Aydın',
    customerPhone: '0544 *** ** 88',
    shippingAddress: 'Çayyolu Mah. Park Cad. No:18 Çankaya / ANKARA',
    city: 'Ankara',
    district: 'Çankaya',
    orderDate: 'Bugün, 11:10',
    createdAt: new Date().toISOString(),
    status: 'PREPARING',
    statusLabel: 'Hazırlanıyor / Paketlendi',
    supplyStatus: 'ON_TIME',
    remainingHours: 15,
    cargoProvider: 'Trendyol Express',
    trackingNumber: '7330291849103',
    grossPrice: 1199.00,
    costPrice: 390.00,
    commission: 257.78,
    commissionRate: 21.5,
    cargoCost: 87.00,
    cargoFee: 87.00,
    netPayout: 854.22,
    netProfit: 464.22,
    profitMargin: 38.7,
    isLoss: false,
    invoiceStatus: 'ISSUED',
    invoiceNumber: 'IZG202600849201',
    ettnUuid: 'c7e3f890-8492-45e6-b890-849201949001',
    invoiceDate: 'Bugün, 11:30',
    productName: 'Antrasit Yıkamalı Taş Detaylı Kadın Eşofman Takımı',
    sku: 'ANT.ESOFMAN2',
    barcode: '8683838112347',
    variant: 'Beden: M | Renk: Yıkamalı Antrasit',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ITM-02',
        title: 'Antrasit Yıkamalı Taş Detaylı Kadın Eşofman Takımı',
        sku: 'ANT.ESOFMAN2',
        barcode: '8683838112347',
        variant: 'M Beden',
        quantity: 1,
        unitPrice: 1199.00,
        costPrice: 390.00,
        commission: 257.78,
        commissionRate: 21.5,
        cargoShare: 87.00,
        vatRate: 10,
        netProfit: 464.22,
        profitMarginPercent: 38.7,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'HB-849201882',
    orderNumber: '849201882',
    packageNo: 'HB-PKG-9921',
    deliveryNo: 'HB-DLV-1102',
    marketplace: 'Hepsiburada',
    customerName: 'Büşra Tekin',
    customerPhone: '0555 *** ** 44',
    shippingAddress: 'Mavişehir Mah. 2040 Sok. No:12 Karşıyaka / İZMİR',
    city: 'İzmir',
    district: 'Karşıyaka',
    orderDate: 'Bugün, 09:40',
    createdAt: new Date().toISOString(),
    status: 'NEW',
    statusLabel: 'Yeni Sipariş / Onay Bekliyor',
    supplyStatus: 'ON_TIME',
    remainingHours: 22,
    cargoProvider: 'HepsiJET',
    trackingNumber: 'HJ992018492',
    grossPrice: 989.00,
    costPrice: 340.00,
    commission: 197.80,
    commissionRate: 20.0,
    cargoCost: 43.50,
    cargoFee: 43.50,
    netPayout: 747.70,
    netProfit: 407.70,
    profitMargin: 41.2,
    isLoss: false,
    invoiceStatus: 'PENDING',
    productName: 'Yumey 2\'li Modal Tişört ve Bol Paça Pantolon Takım',
    sku: 'TKM25006-G',
    barcode: '8683838112351',
    variant: 'Beden: S | Renk: Gri Melanj',
    image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ITM-03',
        title: 'Yumey 2\'li Modal Tişört ve Bol Paça Pantolon Takım',
        sku: 'TKM25006-G',
        barcode: '8683838112351',
        variant: 'S Beden',
        quantity: 1,
        unitPrice: 989.00,
        costPrice: 340.00,
        commission: 197.80,
        commissionRate: 20.0,
        cargoShare: 43.50,
        vatRate: 10,
        netProfit: 407.70,
        profitMarginPercent: 41.2,
        image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'TY-948201950',
    orderNumber: '948201950',
    packageNo: 'PKG-774821',
    deliveryNo: 'DLV-883923',
    marketplace: 'Trendyol',
    customerName: 'Elif Demir',
    customerPhone: '0533 *** ** 77',
    shippingAddress: 'Fener Mah. Lara Cad. No:88 Muratpaşa / ANTALYA',
    city: 'Antalya',
    district: 'Muratpaşa',
    orderDate: 'Dün, 16:20',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'SHIPPED',
    statusLabel: 'Kargoya Verildi / Dağıtımda',
    supplyStatus: 'ON_TIME',
    remainingHours: 0,
    cargoProvider: 'Trendyol Express',
    trackingNumber: '7330291849104',
    grossPrice: 349.00,
    costPrice: 95.00,
    commission: 75.04,
    commissionRate: 21.5,
    cargoCost: 87.00,
    cargoFee: 87.00,
    netPayout: 186.96,
    netProfit: 91.96,
    profitMargin: 26.4,
    isLoss: false,
    invoiceStatus: 'ISSUED',
    invoiceNumber: 'IZG202600849199',
    ettnUuid: 'c7e3f890-8492-45e6-b890-849201950002',
    invoiceDate: 'Dün, 17:00',
    productName: 'Yumey Modal V Yaka Pamuklu Kadın Tişört',
    sku: 'TSH25001-Y',
    barcode: '8683838112350',
    variant: 'Beden: M | Renk: Ekru Beyaz',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ITM-04',
        title: 'Yumey Modal V Yaka Pamuklu Kadın Tişört',
        sku: 'TSH25001-Y',
        barcode: '8683838112350',
        variant: 'M Beden',
        quantity: 1,
        unitPrice: 349.00,
        costPrice: 95.00,
        commission: 75.04,
        commissionRate: 21.5,
        cargoShare: 87.00,
        vatRate: 10,
        netProfit: 91.96,
        profitMarginPercent: 26.4,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'AMZ-408-9921849',
    orderNumber: '408-9921849-1102938',
    packageNo: 'AMZ-PKG-01',
    deliveryNo: 'AMZ-DLV-01',
    marketplace: 'Amazon TR',
    customerName: 'Merve Yılmaz',
    customerPhone: '0505 *** ** 99',
    shippingAddress: 'Görükle Mah. Üniversite Cad. No:20 Nilüfer / BURSA',
    city: 'Bursa',
    district: 'Nilüfer',
    orderDate: 'Dün, 13:15',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'DELIVERED',
    statusLabel: 'Müşteriye Teslim Edildi',
    supplyStatus: 'ON_TIME',
    remainingHours: 0,
    cargoProvider: 'Kolay Gelsin',
    trackingNumber: 'KG992810482',
    grossPrice: 1149.00,
    costPrice: 380.00,
    commission: 172.35,
    commissionRate: 15.0,
    cargoCost: 40.00,
    cargoFee: 40.00,
    netPayout: 936.65,
    netProfit: 556.65,
    profitMargin: 48.4,
    isLoss: false,
    invoiceStatus: 'ISSUED',
    invoiceNumber: 'IZG202600849180',
    ettnUuid: 'c7e3f890-8492-45e6-b890-408992184903',
    invoiceDate: 'Dün, 14:00',
    productName: 'Kanguru Cepli Taş Aksesuarlı Sweatshirt Takım',
    sku: 'YMYKANGURU12',
    barcode: '8683838112349',
    variant: 'Beden: L | Renk: Siyah',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ITM-05',
        title: 'Kanguru Cepli Taş Aksesuarlı Sweatshirt Takım',
        sku: 'YMYKANGURU12',
        barcode: '8683838112349',
        variant: 'L Beden',
        quantity: 1,
        unitPrice: 1149.00,
        costPrice: 380.00,
        commission: 172.35,
        commissionRate: 15.0,
        cargoShare: 40.00,
        vatRate: 10,
        netProfit: 556.65,
        profitMarginPercent: 48.4,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'TY-948201951',
    orderNumber: '948201951',
    packageNo: 'PKG-774822',
    deliveryNo: 'DLV-883924',
    marketplace: 'Trendyol',
    customerName: 'Selin Kaya',
    customerPhone: '0530 *** ** 66',
    shippingAddress: 'Alsancak Mah. Kıbrıs Şehitleri Cad. No:102 Konak / İZMİR',
    city: 'İzmir',
    district: 'Konak',
    orderDate: '2 gün önce',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'RETURNED',
    statusLabel: 'İade Talebi / İncelemede',
    supplyStatus: 'ON_TIME',
    remainingHours: 0,
    cargoProvider: 'Trendyol Express',
    trackingNumber: '7330291849105',
    grossPrice: 799.00,
    costPrice: 280.00,
    commission: 171.78,
    commissionRate: 21.5,
    cargoCost: 87.00,
    cargoFee: 87.00,
    netPayout: 540.22,
    netProfit: -189.00,
    profitMargin: -23.6,
    isLoss: true,
    invoiceStatus: 'ISSUED',
    invoiceNumber: 'IZG202600849150',
    ettnUuid: 'c7e3f890-8492-45e6-b890-948201951004',
    productName: 'Yıldız Taş Detaylı Yüksek Bel Palazzo Jean Pantolon',
    sku: 'YILDIZYMY1',
    barcode: '8683838112345',
    variant: 'Beden: 36 | Renk: Açık Mavi Jean',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ITM-06',
        title: 'Yıldız Taş Detaylı Yüksek Bel Palazzo Jean Pantolon',
        sku: 'YILDIZYMY1',
        barcode: '8683838112345',
        variant: '36 Beden',
        quantity: 1,
        unitPrice: 799.00,
        costPrice: 280.00,
        commission: 171.78,
        commissionRate: 21.5,
        cargoShare: 87.00,
        vatRate: 10,
        netProfit: -189.00,
        profitMarginPercent: -23.6,
        isLoss: true,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'SHOPIFY-1048',
    orderNumber: '#1048',
    packageNo: 'SHP-PKG-48',
    deliveryNo: 'SHP-DLV-48',
    marketplace: 'Kendi Sitem (Shopify)',
    customerName: 'Ayşe Çelik',
    customerPhone: '0542 *** ** 33',
    shippingAddress: 'Acıbadem Mah. Çeçen Sok. No:5 Üsküdar / İSTANBUL',
    city: 'İstanbul',
    district: 'Üsküdar',
    orderDate: 'Bugün, 15:40',
    createdAt: new Date().toISOString(),
    status: 'PREPARING',
    statusLabel: 'Hazırlanıyor / Iyzico Ödendi',
    supplyStatus: 'ON_TIME',
    remainingHours: 24,
    cargoProvider: 'Yurtiçi Kargo',
    trackingNumber: 'YK882910482',
    grossPrice: 699.00,
    costPrice: 220.00,
    commission: 13.98,
    commissionRate: 2.0,
    cargoCost: 45.00,
    cargoFee: 45.00,
    netPayout: 640.02,
    netProfit: 420.02,
    profitMargin: 60.1,
    isLoss: false,
    invoiceStatus: 'PENDING',
    productName: 'YMY Dökümlü Kumaş Palazzo Pantolon',
    sku: 'YMYP3',
    barcode: '8683838112353',
    variant: 'Beden: 40 | Renk: Siyah',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ITM-07',
        title: 'YMY Dökümlü Kumaş Palazzo Pantolon',
        sku: 'YMYP3',
        barcode: '8683838112353',
        variant: '40 Beden',
        quantity: 1,
        unitPrice: 699.00,
        costPrice: 220.00,
        commission: 13.98,
        commissionRate: 2.0,
        cargoShare: 45.00,
        vatRate: 10,
        netProfit: 420.02,
        profitMarginPercent: 60.1,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'TY-948201952',
    orderNumber: '948201952',
    packageNo: 'PKG-774823',
    deliveryNo: 'DLV-883925',
    marketplace: 'Trendyol',
    customerName: 'Esra Korkmaz',
    customerPhone: '0536 *** ** 55',
    shippingAddress: 'Batıkent Mah. Cengiz Aytmatov Cad. No:33 Yenimahalle / ANKARA',
    city: 'Ankara',
    district: 'Yenimahalle',
    orderDate: 'Bugün, 08:30',
    createdAt: new Date().toISOString(),
    status: 'NEW',
    statusLabel: 'Yeni Sipariş',
    supplyStatus: 'ON_TIME',
    remainingHours: 20,
    cargoProvider: 'Trendyol Express',
    trackingNumber: '7330291849106',
    grossPrice: 389.00,
    costPrice: 110.00,
    commission: 83.64,
    commissionRate: 21.5,
    cargoCost: 87.00,
    cargoFee: 87.00,
    netPayout: 218.36,
    netProfit: 108.36,
    profitMargin: 27.9,
    isLoss: false,
    invoiceStatus: 'PENDING',
    productName: 'YMY Yıldız Desenli Vatkalı Tişört',
    sku: 'YMYYILDIZ1',
    barcode: '8683838112348',
    variant: 'Beden: S | Renk: Beyaz',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'ITM-08',
        title: 'YMY Yıldız Desenli Vatkalı Tişört',
        sku: 'YMYYILDIZ1',
        barcode: '8683838112348',
        variant: 'S Beden',
        quantity: 1,
        unitPrice: 389.00,
        costPrice: 110.00,
        commission: 83.64,
        commissionRate: 21.5,
        cargoShare: 87.00,
        vatRate: 10,
        netProfit: 108.36,
        profitMarginPercent: 27.9,
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80'
      }
    ]
  }
];

export const UNIFIED_LIVE_ORDERS = [...DEMO_ORDERS];

// 4. Kargo Desi Kaçakları Havuzu
export const DEMO_CARGO_AUDIT_LEAKS = [
  {
    id: 'CRG-AUDIT-101',
    orderNumber: '948201948',
    marketplace: 'Trendyol',
    carrier: 'Trendyol Express',
    productName: 'Yıldız Taş Detaylı Yüksek Bel Palazzo Jean Pantolon',
    invoiceDate: '24.09.2026',
    registeredDesi: 2,
    billedDesi: 4,
    leakAmount: 18.00,
    status: 'ActionRequired', // 'ActionRequired' | 'DISPUTED' | 'RECOVERED'
    differenceReason: 'Paket boyutu 2 desi olmasına rağmen şubede 4 desi girilmiş.'
  },
  {
    id: 'CRG-AUDIT-102',
    orderNumber: '849201882',
    marketplace: 'Hepsiburada',
    carrier: 'HepsiJET',
    productName: 'Yumey 2\'li Modal Tişört ve Bol Paça Pantolon Takım',
    invoiceDate: '22.09.2026',
    registeredDesi: 2,
    billedDesi: 3.5,
    leakAmount: 14.50,
    status: 'ActionRequired',
    differenceReason: 'Konveyör kantarında hatalı lazer ölçümü.'
  },
  {
    id: 'CRG-AUDIT-103',
    orderNumber: '948201950',
    marketplace: 'Trendyol',
    carrier: 'Trendyol Express',
    productName: 'Yumey Modal V Yaka Pamuklu Kadın Tişört',
    invoiceDate: '20.09.2026',
    registeredDesi: 1,
    billedDesi: 3,
    leakAmount: 22.00,
    status: 'DISPUTED',
    differenceReason: 'Tek parça tişört kargo poşetinde 1 desi yerine 3 desi fatura edilmiş.'
  }
];

export const MOCK_CARGO_AUDIT_LEAKS = [...DEMO_CARGO_AUDIT_LEAKS];

// 5. Reklam Performansı Havuzu (ROAS Analizörü)
export const AD_PERFORMANCE_DATA = [
  {
    id: 'AD-01',
    campaignName: 'Trendyol Kadın Jean & Pantolon Sponsorlu Ürünler',
    channel: 'Trendyol Sponsorlu',
    totalSpend: 1450.00,
    generatedRevenue: 8950.00,
    roas: 6.17,
    ordersCount: 11,
    cpc: 1.85,
    netProfitAfterAd: 1850.40,
    status: 'ACTIVE'
  },
  {
    id: 'AD-02',
    campaignName: 'Hepsiburada HepsiAd İkili Takımlar Öne Çıkarma',
    channel: 'Hepsiburada',
    totalSpend: 820.00,
    generatedRevenue: 4945.00,
    roas: 6.03,
    ordersCount: 5,
    cpc: 2.10,
    netProfitAfterAd: 1218.50,
    status: 'ACTIVE'
  },
  {
    id: 'AD-03',
    campaignName: 'Meta Ads (Instagram) - Palazzo Pantolon Video Reklamı',
    channel: 'Meta Ads',
    totalSpend: 650.00,
    generatedRevenue: 4194.00,
    roas: 6.45,
    ordersCount: 6,
    cpc: 0.95,
    netProfitAfterAd: 1870.12,
    status: 'ACTIVE'
  }
];

// 6. Müşteri Soruları ve Yorumları
export const DEFAULT_CUSTOMER_QUESTIONS = [
  {
    id: 'Q-101',
    marketplace: 'Trendyol',
    customerName: 'Ayşenur B.',
    productTitle: 'Yıldız Taş Detaylı Yüksek Bel Palazzo Jean Pantolon',
    productSku: 'YILDIZYMY1',
    barcode: '8683838112345',
    questionText: 'Merhabalar, boyum 1.68 kilom 58. Hangi beden tercih etmeliyim? Kalıbı nasıl?',
    questionDate: 'Bugün, 12:40',
    status: 'WAITING_ANSWER',
    aiSuggestedAnswer: 'Merhabalar Ayşenur Hanım, ürünümüz tam kalıptır. 1.68 boy ve 58 kilo ölçüleriniz için 36-38 beden arasında 38 bedeni tercih etmenizi tavsiye ederiz. Yüksek beli ve dökümlü palazzo paçasıyla üzerinizde çok şık duracaktır. Keyifli alışverişler dileriz! ✨',
    sellerAnswer: null
  },
  {
    id: 'Q-102',
    marketplace: 'Trendyol',
    customerName: 'Fatma K.',
    productTitle: 'Yumey Modal V Yaka Pamuklu Kadın Tişört',
    productSku: 'TSH25001-Y',
    barcode: '8683838112350',
    questionText: 'Kumaşı iç gösterir mi? Yıkamada çekme yapar mı acaba?',
    questionDate: 'Bugün, 10:15',
    status: 'WAITING_ANSWER',
    aiSuggestedAnswer: 'Merhaba Fatma Hanım, tişörtümüz %100 birinci sınıf pamuklu modal kumaştan üretilmiştir, kesinlikle iç göstermez. 30 derecede hassas yıkama yapıldığında çekme ve solma yapmaz. Gönül rahatlığıyla tercih edebilirsiniz. 🌸',
    sellerAnswer: null
  },
  {
    id: 'Q-103',
    marketplace: 'Hepsiburada',
    customerName: 'Gözde S.',
    productTitle: 'Antrasit Yıkamalı Taş Detaylı Kadın Eşofman Takımı',
    productSku: 'ANT.ESOFMAN2',
    barcode: '8683838112347',
    questionText: 'Taşları yıkamada düşer mi, özel yıkama gerekir mi?',
    questionDate: 'Dün, 17:30',
    status: 'ANSWERED',
    aiSuggestedAnswer: 'Merhaba Gözde Hanım, taş detaylarımız yüksek sıcaklık pres yöntemiyle sabitlenmiştir. Ürünü ters çevirerek 30 derecede yıkadığınız sürece taşlarda dökülme yaşanmaz. İlginiz için teşekkür ederiz.',
    sellerAnswer: 'Merhaba Gözde Hanım, taş detaylarımız yüksek ısı presleme ile sabitlenmiştir. Ters çevirip 30 derecede yıkadığınızda hiçbir sorun yaşamazsınız. Sevgiler!'
  }
];

export const DEFAULT_CUSTOMER_REVIEWS = [
  {
    id: 'REV-201',
    marketplace: 'Trendyol',
    customerName: 'Derya A.',
    productTitle: 'Yıldız Taş Detaylı Yüksek Bel Palazzo Jean Pantolon',
    rating: 5,
    reviewText: 'Kumaşına ve duruşuna bayıldım! Taşları çok kaliteli pırıl pırıl parlıyor. Kendi bedeninizi alabilirsiniz, kargo da ertesi gün geldi.',
    reviewDate: 'Bugün, 09:20',
    status: 'WAITING_REPLY',
    aiSuggestedAnswer: 'Derya Hanım harika geri bildiriminiz için çok teşekkür ederiz! Ürünümüzün sizi mutlu etmesi bizim için en büyük gurur. Güzel günlerde ışıl ışıl kullanmanızı dileriz! 💖'
  },
  {
    id: 'REV-202',
    marketplace: 'Trendyol',
    customerName: 'Gülşah M.',
    productTitle: 'Yumey 2\'li Modal Tişört ve Bol Paça Pantolon Takım',
    rating: 5,
    reviewText: 'Dokusu yumuşacık, tam bir kurtarıcı takım. Üzerimden çıkarmak istemiyorum, farklı rengini de sipariş vereceğim.',
    reviewDate: 'Dün, 14:10',
    status: 'REPLIED',
    sellerAnswer: 'Gülşah Hanım güzel yorumunuz için çok teşekkür ederiz, memnuniyetiniz bizim için çok değerli. Yeni koleksiyonlarımızda da sizi aramızda görmekten mutluluk duyarız! ✨'
  }
];

// 7. DEPO & ERP VERİLERİ
export const WAREHOUSES_LIST = [
  { id: 'WH-01', name: 'Ana Merkez Depo (İzmir / Konak)', capacity: '%68 Dolu', totalSkus: 8, status: 'ACTIVE' },
  { id: 'WH-02', name: 'Yedek Sevkiyat Deposu (İstanbul)', capacity: '%34 Dolu', totalSkus: 4, status: 'ACTIVE' },
  { id: 'WH-03', name: 'İade & Hasar Masası', capacity: '%12 Dolu', totalSkus: 2, status: 'ACTIVE' }
];

export const XML_SUPPLIER_FEEDS = [
  {
    id: 'FEED-01',
    supplierName: 'Yumey Tekstil Ana Üretici XML',
    xmlUrl: 'https://api.yumeyconcept.com/feeds/products.xml',
    updateFrequency: 'Saatlik (Otomatik)',
    lastSync: 'Az önce',
    itemCount: 8,
    status: 'ACTIVE'
  }
];

export const DEMO_XML_FEEDS = [...XML_SUPPLIER_FEEDS];

export const DEMO_STOCK_MOVEMENTS = [
  {
    id: 'MOV-1001',
    date: 'Bugün, 14:25',
    productName: 'Yıldız Taş Detaylı Palazzo Jean Pantolon',
    type: 'OUT',
    typeLabel: 'Pazaryeri Satış Çıkışı',
    quantity: '-1 Adet',
    warehouse: 'Ana Merkez Depo',
    reason: 'Trendyol Sipariş #948201948',
    user: 'Otomatik API Sistemi'
  },
  {
    id: 'MOV-1002',
    date: 'Bugün, 11:10',
    productName: 'Antrasit Yıkamalı Kadın Eşofman Takımı',
    type: 'OUT',
    typeLabel: 'Pazaryeri Satış Çıkışı',
    quantity: '-1 Adet',
    warehouse: 'Ana Merkez Depo',
    reason: 'Trendyol Sipariş #948201949',
    user: 'Otomatik API Sistemi'
  }
];

export const STOCK_MOVEMENTS = [...DEMO_STOCK_MOVEMENTS];

// 8. E-FATURA SAĞLAYICILARI
export const EINVOICE_PROVIDERS = [
  { id: 'parasut', name: 'Paraşüt E-Fatura', logo: '🧾', price: 'Standart Pakete Dahil (Ücretsiz)', connected: true, balance: '1.420 Kontör' },
  { id: 'bizimhesap', name: 'BizimHesap', logo: '💼', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'kolaybi', name: 'KolayBi E-Dönüşüm', logo: '⚡', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'trendyol_efatura', name: 'Trendyol E-Faturam', logo: '🟠', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'sovos', name: 'Sovos / Foriba', logo: '🏢', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'qnb', name: 'QNB e-Finans', logo: '🏛️', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'logo', name: 'Logo İşbaşı / ERP', logo: '📊', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' },
  { id: 'edm', name: 'EDM Bilişim E-Dönüşüm', logo: '📁', price: 'Standart Pakete Dahil (Ücretsiz)', connected: false, balance: '-' }
];

export const DEMO_EINVOICE_PROVIDERS = [...EINVOICE_PROVIDERS];

// 9. PRO MALİYET TARİFELERİ
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

export const HAKEDIS_DATA = [];
export const RETURNS_MANAGEMENT_DATA = [];
export const PRODUCT_MAPPINGS_DATA = [];
export const AI_EMPLOYEE_CASES = [];

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
      '4. "API Key" ve "API Secret" alanlarını kopyalayıp ilgili kutucuklara yapıştırın.',
      '5. "Canlı Verileri Çek" butonuna basarak anlık sipariş ve kargo akışını başlatın.'
    ],
    testEndpointStatus: 'OK',
    estimatedSyncTime: 'Yaklaşık 5 saniye'
  },
  Hepsiburada: {
    name: 'Hepsiburada Satıcı Paneli (Merchant)',
    logo: '🟠',
    credentialFields: [
      { key: 'merchantId', label: 'Merchant ID', placeholder: 'Örn: 0dca66ad-84ac-482a-9b74-b78540c99e12', whereToFind: 'Hepsiburada Merchant Portal > Mağaza Profilim' },
      { key: 'secretKey', label: 'Entegratör Secret Key', placeholder: '••••••••••••••••', whereToFind: 'Ayarlar > API Entegrasyon > Yetki Anahtarı' },
      { key: 'userAgent', label: 'Developer User-Agent', placeholder: 'yumey_dev', whereToFind: 'Entegrasyon developer kullanıcı adı (Varsayılan: yumey_dev)' }
    ],
    steps: [
      '1. Hepsiburada Satıcı Panelinize (merchant.hepsiburada.com) giriş yapın.',
      '2. Ayarlar menüsünden "API Entegrasyon" sekmesini seçin.',
      '3. Entegratör Developer Adınızı (yumey_dev) ve Secret Key anahtarınızı kopyalayın.',
      '4. Bilgileri forma girip "Canlı Verileri Çek" butonuna tıklayın.'
    ],
    testEndpointStatus: 'OK',
    estimatedSyncTime: 'Yaklaşık 5 saniye'
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
    estimatedSyncTime: 'Yaklaşık 10 saniye'
  }
};

export const MOCK_CHART_TIMELINE = [
  { day: 'Pzt', ciro: 4250, netKar: 1680, siparis: 6 },
  { day: 'Sal', ciro: 5890, netKar: 2340, siparis: 8 },
  { day: 'Çar', ciro: 7120, netKar: 2950, siparis: 10 },
  { day: 'Per', ciro: 6450, netKar: 2610, siparis: 9 },
  { day: 'Cum', ciro: 8900, netKar: 3720, siparis: 13 },
  { day: 'Cmt', ciro: 11200, netKar: 4890, siparis: 16 },
  { day: 'Paz', ciro: 13450, netKar: 5920, siparis: 19 }
];

export const TRENDYOL_HOURLY_PERFORMANCE = [
  { hour: '00:00', todayRevenue: 0, yesterdayRevenue: 350 },
  { hour: '04:00', todayRevenue: 0, yesterdayRevenue: 0 },
  { hour: '08:00', todayRevenue: 389, yesterdayRevenue: 799 },
  { hour: '10:00', todayRevenue: 1378, yesterdayRevenue: 1148 },
  { hour: '12:00', todayRevenue: 2577, yesterdayRevenue: 2347 },
  { hour: '14:00', todayRevenue: 3776, yesterdayRevenue: 3146 },
  { hour: '16:00', todayRevenue: 4575, yesterdayRevenue: 3845 },
  { hour: '18:00', todayRevenue: 5374, yesterdayRevenue: 4644 },
  { hour: '20:00', todayRevenue: 6173, yesterdayRevenue: 5443 },
  { hour: '22:00', todayRevenue: 6972, yesterdayRevenue: 6242 }
];

export const TRENDYOL_PROMOTION_MATRIX = {
  dateRange: 'Canlı Satış Dönemi',
  lastUpdated: 'Canlı İzlemede',
  columns: []
};
