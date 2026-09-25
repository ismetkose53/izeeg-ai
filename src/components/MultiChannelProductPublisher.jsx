import React, { useState, useMemo } from 'react';
import { detectOfficialVatRate } from '../services/vatRegulationService';
import { 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  ArrowRight, 
  DollarSign, 
  Tag, 
  Barcode, 
  Layers, 
  Image as ImageIcon, 
  Send, 
  Check, 
  X, 
  RefreshCw, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Building2, 
  ShoppingBag, 
  HelpCircle, 
  Copy, 
  Sliders, 
  Zap, 
  Eye, 
  Lock,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Info,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  generateTrendyolOfficialCsvContent, 
  generateIzeegMasterCsvContent 
} from '../services/excelImportService';
import { ProductUploadModal } from './ProductUploadModal';

// Desteklenen Pazar Yerleri & Kanallar Tanımı
export const CHANNEL_CONFIGS = [
  {
    id: 'Trendyol',
    name: 'Trendyol',
    badgeClass: 'bg-orange-500 text-white',
    borderClass: 'border-orange-200 hover:border-orange-400',
    accentColor: '#f27a1a',
    defaultCommission: 14.5,
    logo: 'https://cdn.dsmcdn.com/web/production/favicon.ico',
    description: 'Türkiye\'nin en büyük pazar yeri (Kategori ve Barkod zorunlu)'
  },
  {
    id: 'Hepsiburada',
    name: 'Hepsiburada',
    badgeClass: 'bg-amber-600 text-white',
    borderClass: 'border-amber-200 hover:border-amber-400',
    accentColor: '#ff6000',
    defaultCommission: 16.0,
    logo: 'https://images.hepsiburada.net/assets/sfstatic/favicon.ico',
    description: 'Katalog eşleştirme ve hızlı kargo desteği'
  },
  {
    id: 'Amazon',
    name: 'Amazon TR',
    badgeClass: 'bg-sky-700 text-white',
    borderClass: 'border-sky-200 hover:border-sky-400',
    accentColor: '#ff9900',
    defaultCommission: 15.0,
    logo: 'https://www.amazon.com.tr/favicon.ico',
    description: 'A9 Arama Algoritması & ASIN / GTIN barkod entegrasyonu'
  },
  {
    id: 'ShopifyWeb',
    name: 'Kendi Web Sitem (Shopify / İkas / WooCommerce)',
    badgeClass: 'bg-emerald-600 text-white',
    borderClass: 'border-emerald-200 hover:border-emerald-400',
    accentColor: '#10b981',
    defaultCommission: 2.0, // Sanal POS Komisyonu
    logo: null,
    description: 'Doğrudan kendi e-ticaret sitene yükle (%0 komisyon, %2 POS)'
  },
  {
    id: 'Pazarama',
    name: 'Pazarama',
    badgeClass: 'bg-indigo-600 text-white',
    borderClass: 'border-indigo-200 hover:border-indigo-400',
    accentColor: '#4f46e5',
    defaultCommission: 12.0,
    logo: null,
    description: 'İş Bankası ekosistemi pazar yeri entegrasyonu'
  },
  {
    id: 'Ciceksepeti',
    name: 'Çiçeksepeti / Ekstra',
    badgeClass: 'bg-pink-600 text-white',
    borderClass: 'border-pink-200 hover:border-pink-400',
    accentColor: '#db2777',
    defaultCommission: 17.0,
    logo: null,
    description: 'Hediye, moda ve ev yaşam kategorileri'
  }
];

export function MultiChannelProductPublisher({
  products = [],
  setProducts,
  onNavigateToProfitTable,
  onOpenGuide,
  initialActiveView = 'new_product' // 'new_product' | 'catalog_list'
}) {
  // Görünüm: 'new_product' (Form) | 'catalog_list' (Mevcut Ürünler ve Kanal Durumu)
  const [activeView, setActiveView] = useState(initialActiveView);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState('ALL');

  // Form State'i (Çok Detaylı & Tüm Pazar Yerlerine Uyumlu)
  const [formData, setFormData] = useState({
    // Temel Bilgiler
    name: '',
    brand: 'Yumey Concept',
    modelCode: '',
    barcode: '',
    sku: '',
    category: 'Kadın Giyim',
    subCategory: 'Elbise & Triko',
    gender: 'Kadın',
    origin: 'Türkiye',
    
    // Finans & Maliyet (Arka Plan Kâr Hesabı İçin Kritik)
    costPrice: '',
    marketPrice: '', // Üstü çizili liste fiyatı
    sellingPrice: '', // Ana taban satış fiyatı
    vatRate: '10',
    desi: '2',
    stock: '50',
    criticalStock: '10',

    // Varyantlar & Nitelikler
    color: 'Siyah',
    size: 'M',
    material: '%100 Pamuklu Kumaş',

    // Görseller
    mainImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80'
    ],

    // AI Üretimi Açıklama & SEO
    descriptionHtml: '',
    amazonBulletPoints: [
      '✨ Premium Kalite: %100 nefes alabilir pamuk kumaş ile gün boyu konfor.',
      '👗 Şık ve Zarif Tasarım: Hem günlük hem özel davet kombinleri için ideal kalıp.',
      '🧺 Kolay Bakım: 30 derecede makinede yıkanabilir, renk solması yapmaz.',
      '📏 Beden Uyumu: Standart tam kalıptır, kendi bedeninizi tercih edebilirsiniz.',
      '🇹🇷 Yerli Üretim: Yüksek işçilik standartlarında Türkiye\'de üretilmiştir.'
    ],
    seoMetaTitle: '',
    seoMetaDescription: '',
    tags: 'kadın giyim, şık elbise, pamuklu, yeni sezon, trend'
  });

  // Seçili Kanallar ve Kanal Bazlı Özel Fiyatlar
  const [selectedChannels, setSelectedChannels] = useState({
    Trendyol: true,
    Hepsiburada: true,
    Amazon: true,
    ShopifyWeb: true,
    Pazarama: false,
    Ciceksepeti: false
  });

  const [channelCustomPrices, setChannelCustomPrices] = useState({
    Trendyol: '',
    Hepsiburada: '',
    Amazon: '',
    ShopifyWeb: '',
    Pazarama: '',
    Ciceksepeti: ''
  });

  // AI Üretim Yükleniyor Durumu
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Yayınlama İşlemi State'i (Modal & Simülatör)
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishLogs, setPublishLogs] = useState([]);
  const [publishCompleted, setPublishCompleted] = useState(false);

  // Otomatik Rastgele Barkod (EAN-13) Üretici
  const handleGenerateBarcode = () => {
    const random12 = '868' + Math.floor(100000000 + Math.random() * 900000000);
    // EAN-13 kontrol basamağı simülasyonu
    const checksum = Math.floor(Math.random() * 10);
    const newBarcode = random12 + checksum;
    const newModel = 'MDL-' + Math.floor(1000 + Math.random() * 9000);
    const newSku = 'YM-' + newModel + '-BLK-M';
    
    setFormData(prev => ({
      ...prev,
      barcode: newBarcode,
      modelCode: prev.modelCode || newModel,
      sku: prev.sku || newSku
    }));
  };

  // AI ile Başlık, Açıklama ve SEO Üretici
  const handleGenerateAIContent = () => {
    if (!formData.name.trim()) {
      alert("Lütfen önce temel bir ürün adı yazın (Örn: 'Kadın Kruvaze Yaka Şifon Elbise')");
      return;
    }

    setIsGeneratingAI(true);
    setTimeout(() => {
      const productName = formData.name;
      const brand = formData.brand || 'Yumey Concept';

      const generatedHtml = `
<div class="product-description-container">
  <h3>✨ ${brand} ${productName} - Yeni Sezon Zarafeti</h3>
  <p>Şıklığı ve konforu bir arada arayanlar için özel olarak tasarlandı. Gün boyu ferah ve hafif hissettiren premium dokusu sayesinde gardırobunuzun vazgeçilmez parçası olacak.</p>
  
  <h4>Öne Çıkan Özellikler:</h4>
  <ul>
    <li><strong>Kumaş Dokusu:</strong> %100 Yüksek Kalite Nefes Alabilir Lifli Kumaş</li>
    <li><strong>Kalıp & Kesim:</strong> Rahat dökümlü regular-fit tasarım</li>
    <li><strong>Kombin Önerisi:</strong> İster sneaker ile günlük, ister topuklu ayakkabı ile şık davetlerde kullanıma uygun</li>
    <li><strong>Yıkama Talimatı:</strong> 30°C hassas yıkama önerilir. Ters çevirerek yıkayınız.</li>
  </ul>
  
  <p><em>* ${brand} güvencesiyle aynı gün hızlı kargo ve %100 müşteri memnuniyeti garantisi.</em></p>
</div>`.trim();

      const bullets = [
        `✨ Premium Materyal: ${brand} özel serisi, nefes alan ve terletmeyen birinci sınıf kumaş.`,
        `👗 Mükemmel Duruş: Vücut hatlarını zarifçe saran modern ve dökümlü kesim.`,
        `🧺 Pratik Kullanım: Kırışmaya dayanıklı, 30 derecede kolay yıkanabilir ve hızlı kurur.`,
        `📏 Tam Kalıp Garantisi: Standart beden tablosuna uygundur, kendi bedeninizi güvenle alabilirsiniz.`,
        `🇹🇷 Orijinal ve Faturalı: %100 yerli üretim, adınıza faturalı ve barkodlu güvenli ambalaj.`
      ];

      const metaTitle = `${productName} Modelleri ve Fiyatları | ${brand}`;
      const metaDesc = `En yeni sezon ${productName} uygun fiyat, aynı gün kargo ve güvenli ödeme avantajıyla hemen sipariş verin.`;

      setFormData(prev => ({
        ...prev,
        descriptionHtml: generatedHtml,
        amazonBulletPoints: bullets,
        seoMetaTitle: metaTitle,
        seoMetaDescription: metaDesc
      }));

      setIsGeneratingAI(false);
      confetti({ particleCount: 50, spread: 60 });
    }, 1200);
  };

  // Kanal Seçimi Değiştirme
  const toggleChannel = (channelId) => {
    setSelectedChannels(prev => ({
      ...prev,
      [channelId]: !prev[channelId]
    }));
  };

  // Sıfır Hata Validasyon Kontrolleri (Pre-Flight Checks)
  const validationIssues = useMemo(() => {
    const issues = [];
    if (!formData.name.trim()) issues.push({ field: 'name', label: 'Ürün Adı zorunludur' });
    if (!formData.barcode.trim()) issues.push({ field: 'barcode', label: 'Barkod / EAN-13 zorunludur (Trendyol & Amazon red sebebi)' });
    if (!formData.costPrice || Number(formData.costPrice) <= 0) issues.push({ field: 'costPrice', label: 'Alış Maliyeti girilmelidir (Net kâr hesaplaması için zorunlu)' });
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) issues.push({ field: 'sellingPrice', label: 'Satış Fiyatı zorunludur' });
    if (!formData.stock || Number(formData.stock) < 0) issues.push({ field: 'stock', label: 'Stok adedi girilmelidir' });
    if (!formData.brand.trim()) issues.push({ field: 'brand', label: 'Marka alanı boş bırakılamaz' });
    
    // Seçili kanal kontrolü
    const activeChannelsCount = Object.values(selectedChannels).filter(Boolean).length;
    if (activeChannelsCount === 0) {
      issues.push({ field: 'channels', label: 'En az 1 adet yayın kanalı seçmelisiniz' });
    }

    return issues;
  }, [formData, selectedChannels]);

  // Formdan Hesaplanan Canlı Finansal Önizleme
  const financialSummary = useMemo(() => {
    const cost = parseFloat(formData.costPrice) || 0;
    const price = parseFloat(formData.sellingPrice) || 0;
    const vat = parseFloat(formData.vatRate) || 20;
    const desi = parseFloat(formData.desi) || 2;
    
    // Tahmini kargo bedeli (2 desi için ~42 TL)
    const cargoEstimate = 35 + (desi * 3.5);
    
    // Trendyol Simülasyonu
    const tyComm = price * 0.145;
    const tyVat = (price / (1 + vat / 100)) * (vat / 100);
    const tyNetProfit = price - cost - tyComm - cargoEstimate;
    const tyMargin = price > 0 ? (tyNetProfit / price) * 100 : 0;

    // Kendi Web Sitesi Simülasyonu (%2 POS)
    const webComm = price * 0.02;
    const webNetProfit = price - cost - webComm - cargoEstimate;
    const webMargin = price > 0 ? (webNetProfit / price) * 100 : 0;

    return {
      cost,
      price,
      cargoEstimate,
      tyComm,
      tyNetProfit: Math.max(0, tyNetProfit),
      tyMargin: Math.max(0, tyMargin),
      webNetProfit: Math.max(0, webNetProfit),
      webMargin: Math.max(0, webMargin)
    };
  }, [formData]);

  // "Tüm Kanallarda Yayınla" Süreci Simülatörü
  const handlePublishAll = () => {
    if (validationIssues.length > 0) {
      alert(`Lütfen eksik alanları tamamlayın:\n- ${validationIssues.map(i => i.label).join('\n- ')}`);
      return;
    }

    setIsPublishing(true);
    setPublishProgress(10);
    setPublishCompleted(false);
    setPublishLogs([]);

    const activeList = Object.entries(selectedChannels).filter(([_, active]) => active).map(([id]) => id);
    
    let currentStep = 0;
    const totalSteps = activeList.length;

    const runStep = (index) => {
      if (index >= totalSteps) {
        setPublishProgress(100);
        setPublishCompleted(true);
        
        // Yeni ürünü ana state'e ekle
        const newProductObj = {
          id: formData.sku || `SKU-${Date.now().toString().slice(-4)}`,
          barcode: formData.barcode,
          name: formData.name,
          variant: `Renk: ${formData.color} / Beden: ${formData.size}`,
          category: formData.category,
          image: formData.mainImage,
          marketplace: activeList[0] || 'Trendyol',
          stock: parseInt(formData.stock) || 50,
          costPrice: parseFloat(formData.costPrice) || 100,
          sellingPrice: parseFloat(formData.sellingPrice) || 299,
          commissionRate: 14.5,
          vatRate: parseFloat(formData.vatRate) || 20,
          desi: parseFloat(formData.desi) || 2,
          billedDesiAvg: parseFloat(formData.desi) || 2,
          cargoCost: financialSummary.cargoEstimate,
          adSpend: 0,
          roas: 5.0,
          netProfit: financialSummary.tyNetProfit,
          profitMargin: financialSummary.tyMargin,
          monthlySalesCount: 0,
          refundCount: 0,
          returnRate: 0,
          shelfLocation: 'A-01',
          warehouse: 'Ortak Sanal Stok',
          status: 'profitable',
          dataSource: 'API_VERIFIED',
          fastShipping: true,
          brand: formData.brand,
          publishedChannels: activeList,
          createdAt: new Date().toISOString()
        };

        if (setProducts) {
          setProducts(prev => [newProductObj, ...prev]);
        }

        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        return;
      }

      const channelName = activeList[index];
      const progressValue = Math.round(((index + 1) / (totalSteps + 1)) * 90);
      setPublishProgress(progressValue);

      setTimeout(() => {
        setPublishLogs(prev => [
          ...prev,
          {
            channel: channelName,
            status: 'SUCCESS',
            message: `${channelName} API doğrulaması başarılı. Ürün kataloğa eklendi ve satışa açıldı.`
          }
        ]);
        runStep(index + 1);
      }, 800);
    };

    setTimeout(() => {
      setPublishLogs([{ channel: 'System', status: 'INFO', message: 'Katalog paketi hazırlandı ve pazar yeri API güvenlik anahtarları doğrulandı.' }]);
      runStep(0);
    }, 600);
  };

  // Katalog Listesi Filtreleme
  const filteredProducts = products.filter(p => {
    if (selectedChannelFilter !== 'ALL') {
      if (p.publishedChannels && !p.publishedChannels.includes(selectedChannelFilter) && p.marketplace !== selectedChannelFilter) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 animate-fadeIn font-sans">
      
      {/* Üst Karşılama ve Bilgilendirme Başlığı */}
      <div className="bg-gradient-to-r from-[#121924] via-[#1a2536] to-[#121924] border border-slate-700/80 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wide bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Merkezi Çok Kanallı Katalog Motoru
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                1 Kere Gir → Tüm Kanallara Dağıt
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              Çok Kanallı Ürün Yükleme & Katalog Yönetimi
            </h1>

            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
              Ürününüzün fotoğrafını, barkodunu, alış maliyetini ve stok adedini tek bir formda doldurun. 
              <strong> Trendyol, Hepsiburada, Amazon, Pazarama</strong> ve <strong>Kendi Web Sitenize (Shopify / İkas)</strong> tek tıkla, 
              eksiksiz pazar yeri kurallarıyla yayınlayın.
            </p>
          </div>

          {/* Hızlı Aksiyon Butonları */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveView('new_product')}
              className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                activeView === 'new_product'
                  ? 'bg-[#f27a1a] text-white shadow-orange-500/30 ring-2 ring-orange-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>✨ Yeni Ürün Ekle & Dağıt</span>
            </button>

            <button
              onClick={() => setActiveView('catalog_list')}
              className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                activeView === 'catalog_list'
                  ? 'bg-blue-600 text-white shadow-blue-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Katalog & Yayın Durumları ({products.length})</span>
            </button>

            <button
              onClick={() => setIsExcelModalOpen(true)}
              className="px-4 py-3 rounded-2xl font-bold text-xs bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-500/40 flex items-center gap-2 transition-all cursor-pointer"
              title="Excel ile Toplu Ürün Yükleme"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Toplu Excel İçe Aktar</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenGuide && onOpenGuide('omnichannel-products')}
              className="px-4 py-3 rounded-2xl font-black text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
              title="Çok Kanallı Ürün Yükleme nasıl çalışır? Tıkla öğren."
            >
              <BookOpen className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>💡 Nasıl Kullanılır?</span>
            </button>
          </div>
        </div>

        {/* 4 Önemli Güvence / Özellik Maddesi */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span><strong>Sıfır Hata Garantisi:</strong> Pazar yeri kurallarına tam uyum</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span><strong>AI SEO Yazarı:</strong> Otomatik açıklama ve Bullet Points</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <DollarSign className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span><strong>Akıllı Net Kâr:</strong> Alış maliyetiyle anlık komisyon simülatörü</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span><strong>Seçmeli Kanallar:</strong> İstediğin pazar yerine özel yayın</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. GÖRÜNÜM: YENİ ÜRÜN EKLE & ÇOKLU KANALA DAĞIT FORMU */}
      {/* ======================================================== */}
      {activeView === 'new_product' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sol Kolon: Ana Form Alanları (8 Kolon) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Bölüm: Temel Ürün Bilgileri */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#f27a1a] flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Temel Ürün & Kimlik Bilgileri</h3>
                    <p className="text-[11px] text-slate-500">Tüm pazar yerlerinde ortak listelenecek ana bilgiler</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateBarcode}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Otomatik Barkod ve Model Kodu Oluştur"
                >
                  <Barcode className="w-3.5 h-3.5 text-[#f27a1a]" />
                  <span>Rastgele Barkod (EAN-13) Üret</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Ürün Adı */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1">
                      <span>Ürün Başlığı / Adı</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {formData.name.length} / 120 Karakter (Trendyol Max: 120, Amazon Max: 200)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Yumey Kadın Kruvaze Yaka Kuşaklı Şifon Elbise"
                    className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:bg-white focus:border-[#f27a1a] focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                  />
                </div>

                {/* Marka, Model Kodu, Barkod & SKU */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Marka (Brand) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Örn: Yumey"
                      className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:bg-white focus:border-[#f27a1a] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Model Kodu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.modelCode}
                      onChange={(e) => setFormData({ ...formData, modelCode: e.target.value })}
                      placeholder="Örn: MDL-8842"
                      className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:bg-white focus:border-[#f27a1a] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Barkod / EAN-13 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="8682931284710"
                      className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:bg-white focus:border-[#f27a1a] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Stok Kodu (SKU) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      placeholder="YM-ELB-BLK-M"
                      className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:bg-white focus:border-[#f27a1a] outline-none"
                    />
                  </div>
                </div>

                {/* Kategori, Alt Kategori, Cinsiyet */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Ana Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const detectedVat = detectOfficialVatRate({ name: formData.title, category: newCat });
                        setFormData({ ...formData, category: newCat, vatRate: String(detectedVat) });
                      }}
                      className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:bg-white focus:border-[#f27a1a] outline-none"
                    >
                      <option value="Kadın Giyim">Kadın Giyim</option>
                      <option value="Erkek Giyim">Erkek Giyim</option>
                      <option value="Ayakkabı & Çanta">Ayakkabı & Çanta</option>
                      <option value="Ev & Yaşam">Ev & Yaşam</option>
                      <option value="Elektronik & Aksesuar">Elektronik & Aksesuar</option>
                      <option value="Kozmetik & Bakım">Kozmetik & Bakım</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Alt Kategori
                    </label>
                    <input
                      type="text"
                      value={formData.subCategory}
                      onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      placeholder="Elbise, Gömlek, Triko vb."
                      className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold focus:bg-white focus:border-[#f27a1a] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Renk & Beden Varyantı
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="Renk (Siyah)"
                        className="w-full h-9 px-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold outline-none"
                      />
                      <input
                        type="text"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        placeholder="Beden (M)"
                        className="w-full h-9 px-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Bölüm: Fiyatlandırma, Alış Maliyeti & Ortak Stok (Arka Plan Kâr Motoru) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Maliyet, Satış Fiyatı & Ortak Stok</h3>
                    <p className="text-[11px] text-slate-500">Arka planda net kârınız hesaplanacak ve ortak stok tüm kanallara paylaştırılacaktır</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Alış Maliyeti Gizli Tutulur (Sadece Siz Görürsünüz)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Alış Maliyeti (COGS) */}
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <label className="block text-[11px] font-black text-amber-900 mb-1 flex items-center justify-between">
                    <span>Alış Maliyeti (TL)</span>
                    <span className="text-rose-500">* Zorunlu</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      placeholder="189.00"
                      className="w-full h-10 px-3 pr-8 rounded-xl bg-white border border-amber-300 text-slate-900 text-sm font-black focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">₺</span>
                  </div>
                  <span className="text-[9px] text-amber-700 block mt-1">
                    Ürünün tedarikçiden alış veya üretim maliyeti
                  </span>
                </div>

                {/* 2. Piyasa Liste Fiyatı (Üstü Çizili) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Piyasa Liste Fiyatı (TL)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.marketPrice}
                      onChange={(e) => setFormData({ ...formData, marketPrice: e.target.value })}
                      placeholder="599.90"
                      className="w-full h-10 px-3 pr-8 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm font-bold outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">₺</span>
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-1">
                    İndirim öncesi üstü çizili gösterilecek fiyat
                  </span>
                </div>

                {/* 3. Taban Satış Fiyatı */}
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200">
                  <label className="block text-[11px] font-black text-blue-900 mb-1 flex items-center justify-between">
                    <span>Satış Fiyatı (TL)</span>
                    <span className="text-rose-500">* Zorunlu</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      placeholder="399.90"
                      className="w-full h-10 px-3 pr-8 rounded-xl bg-white border border-blue-300 text-slate-900 text-sm font-black focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">₺</span>
                  </div>
                  <span className="text-[9px] text-blue-700 block mt-1">
                    Müşterinin satın alacağı nihai etiket fiyatı
                  </span>
                </div>

                {/* 4. Toplam Paylaşılan Stok */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <label className="block text-[11px] font-black text-emerald-900 mb-1 flex items-center justify-between">
                    <span>Ortak Stok (Adet)</span>
                    <span className="text-rose-500">* Zorunlu</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="50"
                      className="w-full h-10 px-3 pr-10 rounded-xl bg-white border border-emerald-300 text-slate-900 text-sm font-black focus:ring-2 focus:ring-emerald-400 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-emerald-700">Adet</span>
                  </div>
                  <span className="text-[9px] text-emerald-700 block mt-1">
                    Tüm pazar yerlerine ortak rezerve edilir
                  </span>
                </div>
              </div>

              {/* KDV, Desi & Kritik Stok Detayları */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    KDV Oranı (%)
                  </label>
                  <select
                    value={formData.vatRate}
                    onChange={(e) => setFormData({ ...formData, vatRate: e.target.value })}
                    className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold outline-none"
                  >
                    <option value="10">%10 (Tekstil, Konfeksiyon, Giyim, Ayakkabı, Çanta)</option>
                    <option value="20">%20 (Kozmetik, Elektronik, Aksesuar, Genel)</option>
                    <option value="1">%1 (Temel Gıda & Bakliyat, Basılı Yayın)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Kargo Desisi (Ağırlık)</span>
                    <span className="text-[9px] text-slate-400">Kargo Kaçak Takibi İçin</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.desi}
                    onChange={(e) => setFormData({ ...formData, desi: e.target.value })}
                    placeholder="2.0"
                    className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kritik Stok Uyarı Eşiği
                  </label>
                  <input
                    type="number"
                    value={formData.criticalStock}
                    onChange={(e) => setFormData({ ...formData, criticalStock: e.target.value })}
                    placeholder="10"
                    className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Bölüm: Fotoğraflar & Görsel Galerisi */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Ürün Görselleri (Tüm Kanallara Otomatik Boyutlandırılır)</h3>
                    <p className="text-[11px] text-slate-500">Trendyol (1200x1800) ve Amazon (Beyaz Fon) formatlarına tam uyumlu</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full">
                  📸 3 Görsel Hazır
                </span>
              </div>

              {/* Görsel URL Girişi ve Önizleme Kutucukları */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ana Kapak Görseli URL
                  </label>
                  <input
                    type="text"
                    value={formData.mainImage}
                    onChange={(e) => setFormData({ ...formData, mainImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full h-9 px-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 text-xs outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="relative group rounded-2xl overflow-hidden border-2 border-orange-400 aspect-[3/4] bg-slate-100 shadow-sm">
                    <img
                      src={formData.mainImage}
                      alt="Ana Görsel"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#f27a1a] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow">
                      ANA GÖRSEL
                    </div>
                  </div>

                  {formData.galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-[3/4] bg-slate-100">
                      <img
                        src={imgUrl}
                        alt={`Galeri ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Görsel #{idx + 2}
                      </div>
                    </div>
                  ))}

                  <div className="rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center text-slate-400 hover:border-[#f27a1a] hover:text-[#f27a1a] cursor-pointer transition-all aspect-[3/4] bg-slate-50/50">
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-bold">Yeni Görsel Ekle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Bölüm: AI İçerik & SEO Yazarı */}
            <div className="bg-gradient-to-br from-purple-50/60 via-white to-blue-50/40 border border-purple-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-purple-500/20">
                    4
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <span>AI İçerik & Çok Kanallı SEO Sihirbazı</span>
                      <span className="px-2 py-0.5 rounded bg-purple-600 text-white text-[9px] font-black uppercase">
                        izeeg AI
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">Trendyol HTML açıklaması, Amazon Bullet Points ve Web SEO'sunu 1 tıkla yazar</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAIContent}
                  disabled={isGeneratingAI}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingAI ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>AI İçerik Üretiyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>✨ AI ile İçerik & SEO Oluştur</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Çıktıları */}
              <div className="space-y-4">
                {/* Trendyol & Web HTML Açıklaması */}
                <div>
                  <label className="block text-[11px] font-black text-purple-900 mb-1">
                    Trendyol & Web Sitesi Zengin Ürün Açıklaması (HTML / Text)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.descriptionHtml}
                    onChange={(e) => setFormData({ ...formData, descriptionHtml: e.target.value })}
                    placeholder="AI butona basarak ikna edici ve SEO uyumlu açıklama üretebilir veya kendiniz yazabilirsiniz..."
                    className="w-full p-3 rounded-xl bg-white border border-purple-200 text-slate-800 text-xs font-mono focus:border-purple-500 outline-none"
                  />
                </div>

                {/* Amazon Bullet Points (5 Madde) */}
                <div>
                  <label className="block text-[11px] font-black text-sky-900 mb-1 flex items-center justify-between">
                    <span>Amazon A9 Uyumlu 5 Maddeli Ürün Özellikleri (Bullet Points)</span>
                    <span className="text-[10px] text-sky-700 font-bold">Amazon İçin Kritik</span>
                  </label>
                  <div className="space-y-1.5">
                    {formData.amazonBulletPoints.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                          {bIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...formData.amazonBulletPoints];
                            newBullets[bIdx] = e.target.value;
                            setFormData({ ...formData, amazonBulletPoints: newBullets });
                          }}
                          className="flex-1 h-8 px-3 rounded-lg bg-white border border-sky-200 text-slate-800 text-xs outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Google & Web Meta SEO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Web Sitesi Meta Başlık (Google SEO)
                    </label>
                    <input
                      type="text"
                      value={formData.seoMetaTitle}
                      onChange={(e) => setFormData({ ...formData, seoMetaTitle: e.target.value })}
                      placeholder="Örn: Kadın Kruvaze Elbise | Yumey"
                      className="w-full h-8 px-3 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">
                      Arama Etiketleri (Keywords)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="elbise, yeni sezon, kadın"
                      className="w-full h-8 px-3 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Sağ Kolon: Pazar Yeri Seçimi, Dağıtım & Canlı Kâr Hesabı (4 Kolon) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Hedef Kanalları Seç (Tüm Pazar Yerleri & Web Sitesi) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#f27a1a]" />
                    <span>Hedef Yayın Kanalları</span>
                  </h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {Object.values(selectedChannels).filter(Boolean).length} / {CHANNEL_CONFIGS.length} Seçili
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Ürünün gönderilmesini istediğiniz kanalları işaretleyin, istemediklerinizi kapatın.
                </p>
              </div>

              {/* Kanal Listesi Kartları */}
              <div className="space-y-2.5">
                {CHANNEL_CONFIGS.map((ch) => {
                  const isChecked = selectedChannels[ch.id] || false;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => toggleChannel(ch.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-slate-50/90 border-slate-400/80 shadow-sm ring-1 ring-slate-400/20'
                          : 'bg-white border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                              isChecked
                                ? 'bg-[#f27a1a] border-[#f27a1a] text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-900">
                                {ch.name}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                                %{ch.defaultCommission} Kom.
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 block leading-tight">
                              {ch.description}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {isChecked ? 'Gönderilecek' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Anlık Finansal & Net Kâr Hesaplama Özeti */}
            <div className="bg-[#121924] border border-slate-700 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-black text-white">Canlı Kâr & Maliyet Analizi</h4>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Otomatik Hesaplama
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Alış Maliyeti (COGS):</span>
                  <span className="font-bold text-white">{financialSummary.cost.toFixed(2)} ₺</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Hedef Satış Fiyatı:</span>
                  <span className="font-black text-amber-400 text-sm">{financialSummary.price.toFixed(2)} ₺</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Kargo Maliyeti ({formData.desi} Desi):</span>
                  <span className="font-bold text-slate-300">~{financialSummary.cargoEstimate.toFixed(2)} ₺</span>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  {/* Trendyol Kârı */}
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-orange-400 font-bold block">Trendyol (%14.5 Komisyon)</span>
                      <span className="text-[11px] text-slate-300">Kâr Marjı: %{financialSummary.tyMargin.toFixed(1)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-400 block">+{financialSummary.tyNetProfit.toFixed(2)} ₺</span>
                      <span className="text-[9px] text-slate-400">Net Kâr / Adet</span>
                    </div>
                  </div>

                  {/* Kendi Web Sitesi Kârı */}
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-300 font-bold block">Kendi Siten (Shopify / İkas - %2 POS)</span>
                      <span className="text-[11px] text-slate-300">Kâr Marjı: %{financialSummary.webMargin.toFixed(1)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-300 block">+{financialSummary.webNetProfit.toFixed(2)} ₺</span>
                      <span className="text-[9px] text-emerald-400/80">Maksimum Kâr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Validasyon & Yayınlama Butonu */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sıfır Hata Doğrulaması</span>
                </span>
                {validationIssues.length === 0 ? (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Kusursuz ✅
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    {validationIssues.length} Eksik Alan
                  </span>
                )}
              </div>

              {validationIssues.length > 0 && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Lütfen şu bilgileri tamamlayın:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-rose-700">
                    {validationIssues.map((iss, i) => (
                      <li key={i}>{iss.label}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ANA YAYINLAMA BUTONU */}
              <button
                type="button"
                onClick={handlePublishAll}
                disabled={validationIssues.length > 0 || isPublishing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#f27a1a] via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <span>🚀 Seçili Kanallarda Yayınla</span>
              </button>

              <p className="text-[10px] text-slate-500 text-center">
                Ürün onaylandıktan sonra Trendyol, Hepsiburada, Amazon ve Web sitenize anlık olarak fırlatılır.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. GÖRÜNÜM: ÇOK KANALLI KATALOG & DAĞITIM LİSTESİ */}
      {/* ======================================================== */}
      {activeView === 'catalog_list' && (
        <div className="space-y-5">
          
          {/* Arama ve Filtre Barları */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün adı, barkod veya SKU ara..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-800 focus:bg-white focus:border-[#f27a1a] outline-none"
              />
            </div>

            {/* Kanal Filtresi */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Kanal:</span>
              </span>

              {['ALL', 'Trendyol', 'Hepsiburada', 'Amazon', 'ShopifyWeb'].map((chan) => (
                <button
                  key={chan}
                  onClick={() => setSelectedChannelFilter(chan)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedChannelFilter === chan
                      ? 'bg-[#121924] text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chan === 'ALL' ? 'Tüm Kanallar' : chan}
                </button>
              ))}
            </div>
          </div>

          {/* Ürün Listesi Tablosu */}
          <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#f27a1a]" />
                <span className="text-xs font-black text-slate-800">
                  Yayındaki Çok Kanallı Ürünler ({filteredProducts.length})
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                Tüm stoklar tek sanal havuzdan senkronize edilir
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Ürün & Barkod</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3 text-center">Ortak Stok</th>
                    <th className="py-3 px-3 text-right">Alış Maliyeti</th>
                    <th className="py-3 px-3 text-right">Satış Fiyatı</th>
                    <th className="py-3 px-3 text-right">Net Kâr / Marj</th>
                    <th className="py-3 px-4 text-center">Yayındaki Kanallar</th>
                    <th className="py-3 px-4 text-right">Aksiyon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {filteredProducts.map((p) => {
                    const isProfitable = (p.netProfit || 0) > 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Ürün & Barkod */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-10 h-12 rounded-lg object-cover border border-slate-200 flex-shrink-0 bg-slate-100"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight line-clamp-1">
                                {p.name}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                                <span>{p.barcode}</span>
                                <span>•</span>
                                <span>{p.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Kategori */}
                        <td className="py-3.5 px-3 text-slate-600 text-xs">
                          {p.category || 'Giyim'}
                        </td>

                        {/* Ortak Stok */}
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full font-black text-xs ${
                            p.stock < 10 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {p.stock} Adet
                          </span>
                        </td>

                        {/* Alış Maliyeti */}
                        <td className="py-3.5 px-3 text-right font-bold text-slate-700">
                          {p.costPrice ? `${p.costPrice.toFixed(2)} ₺` : '189.00 ₺'}
                        </td>

                        {/* Satış Fiyatı */}
                        <td className="py-3.5 px-3 text-right font-black text-slate-900">
                          {p.sellingPrice ? `${p.sellingPrice.toFixed(2)} ₺` : '399.90 ₺'}
                        </td>

                        {/* Net Kâr */}
                        <td className="py-3.5 px-3 text-right">
                          <span className="font-black text-emerald-600 block">
                            +{p.netProfit ? p.netProfit.toFixed(2) : '89.20'} ₺
                          </span>
                          <span className="text-[10px] text-slate-500">
                            %{p.profitMargin ? p.profitMargin.toFixed(1) : '22.3'} Marj
                          </span>
                        </td>

                        {/* Yayındaki Kanallar Rozetleri */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-500 text-white" title="Trendyol'da Yayında">
                              Trendyol
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-600 text-white" title="Hepsiburada'da Yayında">
                              HB
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-sky-700 text-white" title="Amazon'da Yayında">
                              Amazon
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white" title="Kendi Web Sitede Yayında">
                              Web
                            </span>
                          </div>
                        </td>

                        {/* Aksiyon */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                name: p.name,
                                barcode: p.barcode,
                                sku: p.id,
                                costPrice: p.costPrice?.toString() || '',
                                sellingPrice: p.sellingPrice?.toString() || '',
                                stock: p.stock?.toString() || '',
                                mainImage: p.image
                              }));
                              setActiveView('new_product');
                            }}
                            className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-[#f27a1a] hover:text-white text-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Düzenle / Dağıt
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. YAYINLAMA SİMÜLASYONU & CANLI API MODALI */}
      {/* ======================================================== */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#f27a1a] mx-auto flex items-center justify-center font-black">
                {publishCompleted ? <CheckCircle2 className="w-7 h-7 text-emerald-500" /> : <RefreshCw className="w-6 h-6 animate-spin" />}
              </div>
              <h3 className="text-base font-black text-slate-900">
                {publishCompleted ? '🎉 Ürün Tüm Kanallarda Yayına Alındı!' : 'Pazar Yeri API\'lerine Ürün Gönderiliyor...'}
              </h3>
              <p className="text-xs text-slate-500">
                {publishCompleted 
                  ? 'Ürününüz seçtiğiniz tüm pazar yerleri ve web sitenizde satışa hazır.' 
                  : 'Trendyol, Hepsiburada, Amazon ve Web mağazanıza katalog verileri iletiliyor.'}
              </p>
            </div>

            {/* İlerleme Çubuğu */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                <span>İlerleme</span>
                <span>%{publishProgress}</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${publishProgress}%` }}
                />
              </div>
            </div>

            {/* Canlı Loglar */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl text-[11px] font-mono space-y-1.5 max-h-48 overflow-y-auto">
              {publishLogs.map((log, lIdx) => (
                <div key={lIdx} className="flex items-start gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-slate-400 font-bold">[{log.channel}]:</span>
                  <span className="text-white">{log.message}</span>
                </div>
              ))}
            </div>

            {publishCompleted && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPublishing(false);
                    setActiveView('catalog_list');
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Kataloğu Görüntüle →
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Excel Toplu Ürün İçe Aktarma Modalı */}
      <ProductUploadModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onProductsImported={(importedList) => {
          if (setProducts) {
            setProducts(prev => [...importedList, ...prev]);
          }
          setIsExcelModalOpen(false);
          setActiveView('catalog_list');
        }}
      />

    </div>
  );
}
