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

// 1. Ürün ve Sipariş Havuzları (Temiz Başlangıç - 0 Kayıt)
export const DEMO_PRODUCTS = [];
export const INITIAL_PRODUCTS = [];

export const DEMO_ORDERS = [];
export const UNIFIED_LIVE_ORDERS = [];

// 2. AI E-Ticaret Çalışanı Karar Vakaları (Canlı verilerden dinamik üretilir)
export const AI_EMPLOYEE_CASES = [];

// 3. DEPO & ERP STOK YÖNETİMİ VERİLERİ
export const WAREHOUSES_LIST = [
  { id: 'WH-01', name: 'Ana Merkez Depo', capacity: '%0 Dolu', totalSkus: 0, status: 'ACTIVE' },
  { id: 'WH-02', name: 'Yedek Sevkiyat Deposu', capacity: '%0 Dolu', totalSkus: 0, status: 'ACTIVE' },
  { id: 'WH-03', name: 'İade & Hasar Masası', capacity: '%0 Dolu', totalSkus: 0, status: 'ACTIVE' }
];

export const DEMO_XML_FEEDS = [];
export const XML_SUPPLIER_FEEDS = [];

export const DEMO_STOCK_MOVEMENTS = [];
export const STOCK_MOVEMENTS = [];

// 4. E-FATURA & FATURA MERKEZİ SAĞLAYICILARI
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

export const DEMO_EINVOICE_PROVIDERS = [...EINVOICE_PROVIDERS];

// 5. PRO MALİYET ALT SEKME TARİFELERİ (Resmi Baremler)
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

export const AD_PERFORMANCE_DATA = [];

export const PRODUCT_MAPPINGS_DATA = [];

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

export const DEMO_CARGO_AUDIT_LEAKS = [];
export const MOCK_CARGO_AUDIT_LEAKS = [];

export const MOCK_CHART_TIMELINE = [];

// Trendyol Raporlar Sayfası Saatlik Ciro Karşılaştırması (Canlı Siparişlerden Hesaplanır)
export const TRENDYOL_HOURLY_PERFORMANCE = [];

// Trendyol Promosyon Matrisi
export const TRENDYOL_PROMOTION_MATRIX = {
  dateRange: 'Canlı Satış Dönemi',
  lastUpdated: 'Canlı İzlemede',
  columns: []
};
