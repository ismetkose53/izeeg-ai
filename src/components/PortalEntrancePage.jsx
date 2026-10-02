import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  DollarSign, 
  Scale, 
  Zap, 
  Boxes, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Store, 
  Key, 
  Eye, 
  EyeOff, 
  ShoppingBag, 
  BarChart3, 
  RotateCcw, 
  Smartphone, 
  Layers, 
  ExternalLink,
  Flame,
  Check,
  Building2,
  Globe,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  Send,
  MessageSquare,
  Menu,
  X,
  Award,
  ChevronDown,
  FileText,
  Clock,
  ChevronRight,
  Code,
  Terminal,
  Cpu,
  Workflow,
  Truck,
  Percent,
  PackageCheck,
  ScanBarcode,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IzeegLogo } from './IzeegLogo';
import { loginUser, loginUserAsync, registerUserAsync } from '../services/authService';
import { OnboardingWizardModal } from './OnboardingWizardModal';
import { CommissionTariffsModal } from './CommissionTariffsModal';

export function PortalEntrancePage({ onLoginSuccess, onExploreDemo }) {
  // Aktif Auth Sekmesi: 'REGISTER' | 'LOGIN'
  const [activeAuthTab, setActiveAuthTab] = useState('REGISTER');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isTariffsOpen, setIsTariffsOpen] = useState(false);

  // İnteraktif Ürün Turu (EZV Modülleri Canlı Önizleme)
  const [activeShowcase, setActiveShowcase] = useState('dashboard'); // 'dashboard' | 'orders' | 'products' | 'cashflow' | 'operations' | 'buybox' | 'assistant' | 'commission' | 'fulfillment'

  // Kayıt Formu State'leri
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    storeName: '',
    password: '',
    selectedMarketplaces: ['Trendyol', 'Hepsiburada']
  });

  // Giriş Formu State'leri
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // S.S.S. Açık Olan Soru State'i
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // İnteraktif Kâr Simülatörü State'leri
  const [simSalePrice, setSimSalePrice] = useState(1200);
  const [simCostPrice, setSimCostPrice] = useState(450);
  const [simCommissionRate, setSimCommissionRate] = useState(18); // %
  const [simCargoCost, setSimCargoCost] = useState(65);
  const [simAdCost, setSimAdCost] = useState(40);

  // Simülatör Hesaplama
  const simCommissionAmount = (simSalePrice * simCommissionRate) / 100;
  const simTotalCost = simCostPrice + simCommissionAmount + simCargoCost + simAdCost;
  const simNetProfit = simSalePrice - simTotalCost;
  const simProfitMargin = simSalePrice > 0 ? ((simNetProfit / simSalePrice) * 100).toFixed(1) : 0;

  // Fiyatlandırma Yıllık / Aylık Seçimi
  const [pricingCycle, setPricingCycle] = useState('monthly');

  // Pazar Yeri Çoklu Seçim
  const toggleMarketplace = (mp) => {
    setFormData(prev => {
      const exists = prev.selectedMarketplaces.includes(mp);
      return {
        ...prev,
        selectedMarketplaces: exists 
          ? prev.selectedMarketplaces.filter(item => item !== mp)
          : [...prev.selectedMarketplaces, mp]
      };
    });
  };

  const scrollToSection = (sectionId) => {
    setMobileNavOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 1. Yeni Ücretsiz Kayıt / Onboarding Tetikleme (14 Günlük Deneme)
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!formData.fullName || !formData.email || !formData.phone || !formData.storeName || !formData.password) {
      setAuthError("Lütfen tüm zorunlu alanları eksiksiz doldurunuz.");
      return;
    }

    if (formData.password.length < 4) {
      setAuthError("Şifreniz en az 4 karakterden oluşmalıdır.");
      return;
    }

    setIsLoading(true);

    registerUserAsync({
      storeName: formData.storeName,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    }).then(res => {
      setIsLoading(false);
      if (res.success && res.user) {
        const user = {
          ...res.user,
          trialDaysLeft: 14,
          daysRemaining: 14,
          planName: '14 Günlük Ücretsiz Deneme'
        };
        confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        onLoginSuccess(user, `🎉 14 Günlük Ücretsiz Denemeniz Başlatıldı! Hoş geldiniz ${formData.fullName}.`);
      } else {
        setAuthError(res.message || "Kayıt işlemi gerçekleştirilemedi.");
      }
    }).catch(err => {
      setIsLoading(false);
      setAuthError(err.message || "Bağlantı hatası oluştu.");
    });
  };

  // 2. Güvenli Giriş Yap İşlemi
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!loginEmail || !loginPassword) {
      setAuthError("Lütfen e-posta adresinizi ve şifrenizi giriniz.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUserAsync(loginEmail, loginPassword);
      setIsLoading(false);
      if (res.success && res.user) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 } });
        onLoginSuccess(
          res.user, 
          res.user.role === 'admin' 
            ? "👑 Hoş geldiniz İsmet Bey! Kurucu Süper Admin Yetkisiyle Giriş Yapıldı." 
            : `Hoş geldiniz ${res.user.ownerName || res.user.storeName}!`,
          res.storeData
        );
      } else {
        setAuthError(res.message || "Giriş bilgileri doğrulanamadı. Lütfen e-posta ve şifrenizi kontrol ediniz.");
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError(err.message || "Sunucuya bağlanılamadı.");
    }
  };

  // SSS Verileri
  const faqs = [
    {
      q: "14 Günlük Deneme için kredi kartı girmem gerekiyor mu?",
      a: "Hayır, kesinlikle kredi kartı veya ödeme bilgisi istemiyoruz. Mağaza bilgilerinizi girerek saniyeler içinde 14 günlük tam yetkili deneme hesabınızı başlatabilirsiniz."
    },
    {
      q: "0 TL Varsayılmaz Gerçek Net Kâr Motoru nasıl çalışır?",
      a: "Diğer entegrasyonlar alış maliyeti girilmediğinde 0 TL kâr uydurur veya kargo kesintilerini hesaba katmaz. izeeg AI, pazar yeri komisyonlarını, kargo desi maliyetlerini ve ürün alış faturanızı kuruşu kuruşuna düşerek kasanıza kalan saf nakdi gösterir."
    },
    {
      q: "Kargo Desi Kaçaklarını ve haksız kesintileri nasıl geri alırım?",
      a: "izeeg AI, kargo firmalarının faturada yazdığı desi ile ürünlerinizin gerçek ölçülerini karşılaştırır. Fazla kesilen her kuruşu tespit eder ve kargo firmasına iletmeniz için resmi itiraz dilekçesini tek tıkla hazırlar."
    },
    {
      q: "AI Çalışanı kafasına göre fiyat veya stok değiştirir mi?",
      a: "Asla! Sistemimizde 'Action Approval Gate' güvenlik protokolü çalışır. Yapay zeka fırsatı yakalar, analizini yapar ve size sunar. Siz onay butonuna basmadan pazar yerlerine hiçbir müdahale yapılmaz."
    },
    {
      q: "Hangi pazar yerlerini ve e-ticaret altyapılarını destekliyorsunuz?",
      a: "Trendyol, Hepsiburada, Amazon TR, N11, Çiçeksepeti, Pazarama, Shopify, WooCommerce, Ticimax, Paraşüt, BizimHesap ve Sovos e-Fatura ile tam iki yönlü API entegrasyonuna sahibiz."
    },
    {
      q: "İstediğim zaman aboneliğimi iptal edebilir miyim?",
      a: "Evet, hiçbir taahhüt ve zorunlu sözleşme bulunmamaktadır. Dilediğiniz zaman tek tıkla aboneliğinizi sonlandırabilirsiniz."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-[#f27a1a] selection:text-white relative overflow-x-hidden">
      
      {/* 🌟 Neon Arka Plan Parıltıları */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 w-[650px] h-[650px] bg-gradient-to-br from-[#f27a1a]/25 via-pink-600/20 to-purple-800/20 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-blue-600/20 via-indigo-600/20 to-emerald-600/15 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-purple-700/20 to-pink-600/15 rounded-full blur-[130px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* ========================================================================= */}
        {/* 1. ÜST HEADER BAR */}
        {/* ========================================================================= */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/85 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Logo */}
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <IzeegLogo size="md" variant="full" theme="dark" showBadge={true} badgeText="AI" />
            </div>

            {/* Orta Menü */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-300">
              <button 
                onClick={() => scrollToSection('showcases')}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Canlı Vitrin & Özellikler
              </button>
              <button 
                onClick={() => scrollToSection('profit-engine')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Net Kâr Motoru
              </button>
              <button 
                onClick={() => setIsTariffsOpen(true)}
                className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Percent className="w-3.5 h-3.5 text-[#f27a1a]" />
                Komisyon Baremleri
              </button>
              <button 
                onClick={() => scrollToSection('ai-worker')}
                className="hover:text-[#f27a1a] transition-colors cursor-pointer"
              >
                AI Çalışanı
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="hover:text-purple-400 transition-colors cursor-pointer"
              >
                Fiyatlar
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="hover:text-amber-300 transition-colors cursor-pointer font-black text-amber-400/90"
              >
                Mimari & Ekip
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="hover:text-slate-200 transition-colors cursor-pointer"
              >
                S.S.S.
              </button>
            </nav>

            {/* Sağ Butonlar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setActiveAuthTab('LOGIN');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                Giriş Yap
              </button>

              <button
                onClick={onExploreDemo}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <span>⚡ Canlı Demo</span>
              </button>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-[#f27a1a] shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                14 Gün Ücretsiz
              </button>

              {/* Mobil Menü Butonu */}
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobil Menü */}
          {mobileNavOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2 text-xs font-bold pb-2 animate-fadeIn">
              <button onClick={() => scrollToSection('showcases')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200">
                ⚡ Canlı Vitrin & Özellikler
              </button>
              <button onClick={() => scrollToSection('profit-engine')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-emerald-300">
                📊 0 TL Varsayılmaz Net Kâr Motoru
              </button>
              <button onClick={() => { setMobileNavOpen(false); setIsTariffsOpen(true); }} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-orange-300">
                % Komisyon Baremleri Simülatörü
              </button>
              <button onClick={() => scrollToSection('ai-worker')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-purple-300">
                🧠 7/24 Otonom AI Asistanı
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-indigo-300">
                💎 Fiyatlandırma
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-amber-300 font-black">
                👑 Kurucu Mimar (İsmet Köse)
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-400">
                ❓ Sıkça Sorulan Sorular
              </button>
            </div>
          )}
        </header>

        {/* ========================================================================= */}
        {/* 2. HERO SECTION */}
        {/* ========================================================================= */}
        <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-14 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Sol Kolon */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-purple-500/15 to-indigo-500/15 border border-orange-500/30 text-[11px] font-black text-orange-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#f27a1a] animate-ping"></span>
                <span>TRENDYOL + HEPSİBURADA · PAZARYERİ ENTEGRASYONU</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.15]">
                Pazaryeri Satışlarınızı{' '}
                <span className="bg-gradient-to-r from-[#f27a1a] via-amber-400 to-indigo-400 text-transparent bg-clip-text">
                  Gerçek Net Kârla
                </span>{' '}
                Yönetin.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Trendyol ve Hepsiburada entegrasyonuyla sipariş, komisyon, hakediş, kargo cezaları ve operasyon verilerinizi tek akıllı panelde birleştirin.
              </p>

              {/* 3 Büyük Güvence */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-emerald-400 font-black text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Gerçek Net Kâr
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Tüm giderler düşülür</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-amber-400 font-black text-sm flex items-center gap-1.5">
                    <Scale className="w-4 h-4" /> Desi & Ceza Denetimi
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Haksız kesintiyi yakalar</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-indigo-400 font-black text-sm flex items-center gap-1.5">
                    <Brain className="w-4 h-4" /> 7/24 AI Asistanı
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Müşteri & Kâr Botu</span>
                </div>
              </div>

              {/* Aksiyon Butonları */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-xl shadow-indigo-600/30"
                >
                  <span>14 Gün Ücretsiz Başlayın ➔</span>
                </button>

                <button
                  onClick={onExploreDemo}
                  className="px-5 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600/80 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Demoyu Görüntüle</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 font-medium flex items-center justify-center lg:justify-start gap-1 pt-1">
                <Check className="w-4 h-4 text-emerald-400" /> Kredi kartı gerekmez • Kurulum desteği dahil
              </p>

            </div>

            {/* Sağ Kolon: Giriş & Kayıt Kutusu */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-indigo-500/50 via-purple-500/30 to-[#f27a1a]/30 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl">
                <div className="bg-[#0e1422]/95 rounded-[22px] p-6 sm:p-8 space-y-6">
                  
                  {/* Sekme Değiştirici */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-bold">
                    <button
                      onClick={() => {
                        setActiveAuthTab('REGISTER');
                        setAuthError(null);
                      }}
                      className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                        activeAuthTab === 'REGISTER'
                          ? 'bg-indigo-600 text-white shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 flex-shrink-0" />
                      <span>14 Gün Ücretsiz</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveAuthTab('LOGIN');
                        setAuthError(null);
                      }}
                      className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center ${
                        activeAuthTab === 'LOGIN'
                          ? 'bg-slate-800 text-white border border-slate-700 shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Key className="w-4 h-4 flex-shrink-0" />
                      <span>🔑 Giriş Yap</span>
                    </button>
                  </div>

                  {/* Hata Bildirimi */}
                  {authError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-fadeIn flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* SEKME 1: 14 GÜN ÜCRETSİZ KAYIT FORMU */}
                  {activeAuthTab === 'REGISTER' && (
                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                          14 Gün Boyunca Tüm Özellikler Dahil Deneyin
                        </span>
                        <h3 className="text-lg font-black text-white">Yeni Satıcı Hesabı Oluşturun</h3>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Adım adım kurulum sihirbazıyla hızlıca başlamak için butona tıklayabilir veya formu doldurabilirsiniz.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsOnboardingOpen(true)}
                        className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Hesap Kurulum Sihirbazını Başlat (4 Adım) ➔</span>
                      </button>

                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-bold">Veya Hızlı Kayıt Ol</span>
                        <div className="flex-grow border-t border-slate-800"></div>
                      </div>

                      <form onSubmit={handleRegisterSubmit} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="Ad Soyad *"
                            className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:border-indigo-500"
                          />
                          <input
                            type="text"
                            required
                            value={formData.storeName}
                            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                            placeholder="Mağaza Adı *"
                            className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:border-indigo-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="E-posta Adresi *"
                            className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:border-indigo-500"
                          />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Telefon *"
                            className="bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:border-indigo-500"
                          />
                        </div>

                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Şifre (en az 4 karakter) *"
                          className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-xs focus:border-indigo-500"
                        />

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          {isLoading ? 'Kaydediliyor...' : 'Hızlı Kaydı Tamamla'}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* SEKME 2: GİRİŞ YAP FORMU */}
                  {activeAuthTab === 'LOGIN' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Kayıtlı Satıcı & Yönetici Girişi
                        </span>
                        <h3 className="text-lg font-black text-white">izeeg AI Panelinize Giriş Yapın</h3>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Hesabınıza erişmek için kayıtlı e-posta adresinizi ve şifrenizi giriniz.
                        </p>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">E-Posta Adresiniz *</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="ahmet@magaza.com"
                            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                          />
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Şifre *</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                          />
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Key className="w-4 h-4 text-indigo-200" />
                            <span>Güvenli Giriş Yap ➔</span>
                          </>
                        )}
                      </button>

                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Hesabınız yok mu?</span>
                        <button
                          type="button"
                          onClick={() => setIsOnboardingOpen(true)}
                          className="text-indigo-400 font-bold hover:underline cursor-pointer"
                        >
                          14 Gün Ücretsiz Başla
                        </button>
                      </div>
                    </form>
                  )}

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. EZV TARZI CANLI İNTERAKTİF ÜRÜN VİTRİNİ & ÖZELLİKLER (#showcases) */}
        {/* ========================================================================= */}
        <section id="showcases" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
              ⚡ Canlı Ürün Modülleri & Etkileşimli Tur
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Her Süreç İçin Özel Olarak Geliştirildi
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Trendyol ve Hepsiburada'daki tüm sipariş, hakediş, komisyon, kargo ve iade operasyonunuzu tek bakışta keşfedin.
            </p>
          </div>

          {/* Modül Seçim Çubuğu */}
          <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
            {[
              { id: 'dashboard', label: '01 / Mağaza Kârlılığı', icon: BarChart3 },
              { id: 'orders', label: '02 / Sipariş Kârlılığı', icon: DollarSign },
              { id: 'products', label: '03 / Ürün Performansı', icon: Layers },
              { id: 'cashflow', label: '04 / Nakit Akışı Takvimi', icon: Calendar },
              { id: 'operations', label: '05 / Operasyon & Kargo', icon: Truck },
              { id: 'buybox', label: '06 / Buybox Rekabet', icon: Zap },
              { id: 'assistant', label: '07 / AI Müşteri Soruları', icon: MessageSquare },
              { id: 'commission', label: '08 / Komisyon Tarifeleri', icon: Percent },
              { id: 'fulfillment', label: '09 / Toplama & Barkod', icon: PackageCheck }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeShowcase === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveShowcase(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400' 
                      : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Canlı Vitrin Kartı */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl animate-fadeIn">
            
            {/* 01: MAĞAZA KÂRLILIĞI */}
            {activeShowcase === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-extrabold text-indigo-400 uppercase">01 / MAĞAZA KÂRLILIĞI</span>
                  <h3 className="text-2xl font-black text-white">Tüm mağazaların kârlılığını tek ekranda görün.</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Trendyol ve Hepsiburada mağazalarınızın ciro, net kâr, marj ve maliyetlerini aynı dönem üzerinden canlı grafiklerle karşılaştırın.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Toplu kârlılık görünümü</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Mağaza ve pazaryeri karşılaştırması</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Sipariş düzeyinde detay ve maliyet dağılımı</li>
                  </ul>
                  <button onClick={onExploreDemo} className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer">
                    Demoda İnceleyin <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
                    <strong className="text-indigo-400 font-black">IZEEG AI / MAĞAZA PERFORMANSI</strong>
                    <span className="text-slate-400">1–29 Ağustos • Tüm Mağazalar</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Ciro</span>
                      <strong className="text-sm font-black text-white">₺1.248.000</strong>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Net Kâr</span>
                      <strong className="text-sm font-black text-emerald-400">₺184.600</strong>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Net Marj</span>
                      <strong className="text-sm font-black text-indigo-400">%14,79</strong>
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Maliyet Dağılımı</span>
                      <span>₺1.063.400</span>
                    </div>
                    <div className="h-3 w-full bg-slate-900 rounded-full flex overflow-hidden">
                      <div style={{ width: '47%' }} className="bg-blue-500" title="Ürün Maliyeti (%47)"></div>
                      <div style={{ width: '23%' }} className="bg-amber-500" title="Komisyon (%23)"></div>
                      <div style={{ width: '14%' }} className="bg-purple-500" title="Kargo (%14)"></div>
                      <div style={{ width: '9%' }} className="bg-rose-500" title="Stopaj & Hizmet (%9)"></div>
                      <div style={{ width: '7%' }} className="bg-emerald-500" title="Net KDV (%7)"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 02: SİPARİŞ KÂRLILIĞI */}
            {activeShowcase === 'orders' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase">02 / SİPARİŞ KÂRLILIĞI</span>
                  <h3 className="text-2xl font-black text-white">Her siparişten gerçekten ne kaldığını görün.</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Ürün maliyeti, komisyon, kargo, hizmet bedeli, stopaj ve KDV sonrasında siparişin bıraktığı net kârı kuruşu kuruşuna inceleyin.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Ürün maliyeti otomatik düşülür</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Pazaryeri kesintileri kuruşu kuruşuna</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Net marj & gerçek nakit kazancı</li>
                  </ul>
                </div>

                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
                    <strong className="text-emerald-400 font-black">SİPARİŞ #1042 / KÂR ANALİZİ</strong>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">%20 Net Marj</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl">
                    <div>
                      <strong className="text-white text-xs block">Everyday Kupa Seti</strong>
                      <span className="text-[10px] text-slate-400">1 Adet • Trendyol</span>
                    </div>
                    <strong className="text-white font-mono text-sm">₺1.200</strong>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-rose-400">
                      <span>Ürün Maliyeti:</span>
                      <strong className="font-mono">−₺600,00</strong>
                    </div>
                    <div className="flex justify-between text-amber-400">
                      <span>Komisyon & Kesintiler (%20):</span>
                      <strong className="font-mono">−₺240,00</strong>
                    </div>
                    <div className="flex justify-between text-purple-400">
                      <span>Kargo Bedeli (Gidiş):</span>
                      <strong className="font-mono">−₺120,00</strong>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-2 text-sm">
                      <span>Kasanıza Kalan Net Kâr:</span>
                      <strong className="font-mono">+₺240,00</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 04: NAKİT AKIŞI TAKVİMİ */}
            {activeShowcase === 'cashflow' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-extrabold text-purple-400 uppercase">04 / NAKİT AKIŞI</span>
                  <h3 className="text-2xl font-black text-white">Hakedişlerin ne zaman geleceğini görün.</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Kesinleşmiş ödemeleri, beklenen hakedişleri ve kargodaki siparişlerin tahmini valör ödeme günlerini tek takvimde izleyin.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Kesinleşmiş hakedişler</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Beklenen valör takvimi</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Geciken ödeme alarmları</li>
                  </ul>
                </div>

                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
                    <strong className="text-purple-400 font-black">HAKEDİŞ & ÖDEME TAKVİMİ</strong>
                    <span className="text-slate-400">Ekim 2026</span>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Bu Hafta Beklenen Hakediş</span>
                      <strong className="text-xl font-black text-emerald-400">₺34.450</strong>
                      <span className="text-[10px] text-slate-500 block">99 Sipariş karşılığı</span>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold">18 Ekim Cuma</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 07: AI MÜŞTERİ İLETİŞİMİ */}
            {activeShowcase === 'assistant' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-extrabold text-blue-400 uppercase">07 / MÜŞTERİ İLETİŞİMİ</span>
                  <h3 className="text-2xl font-black text-white">Pazaryeri sorularına ürün bilgisiyle anında yanıt.</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Trendyol ve Hepsiburada müşteri soruları tek gelen kutusunda toplanır. izeeg AI ürün özelliklerinizi tarayarak yanıt taslağı hazırlar.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Tek gelen kutusu</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Ürün teknik bilgilerinden yanıt</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Kontrollü onay veya otomatik cevaplama</li>
                  </ul>
                </div>

                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-orange-400 font-bold">Müşteri Sorusu (Trendyol):</span>
                    <p className="text-slate-200">"Merhaba, bu kupanın hacmi kaç ml ve bulaşık makinesinde yıkanır mı?"</p>
                  </div>
                  <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>izeeg AI Yanıt Taslağı:</span>
                    </div>
                    <p className="text-indigo-200">
                      "Merhaba, ürünümüz 300 ml hacme sahip olup birinci sınıf seramikten üretilmiştir ve bulaşık makinesinde güvenle yıkanabilir. İlginiz için teşekkür ederiz!"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 08: KOMİSYON VE KAMPANYALAR */}
            {activeShowcase === 'commission' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs font-extrabold text-orange-400 uppercase">08 / KOMİSYON VE KAMPANYALAR</span>
                  <h3 className="text-2xl font-black text-white">Komisyon tekliflerini net kâra göre karşılaştırın.</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Trendyol komisyon indirimli baremleri ve Plus tekliflerini kalan saf kâra göre analiz edin. Hangi fiyatın kazandırdığını önceden görün.
                  </p>
                  <button 
                    onClick={() => setIsTariffsOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#f27a1a] hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Percent className="w-4 h-4" />
                    Komisyon Simülatörünü Aç
                  </button>
                </div>

                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                    <strong className="text-orange-400 font-bold">Trendyol Express Barem Analizi</strong>
                    <span className="text-slate-400 text-[10px]">4 Fiyat Baremi</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400">1. Barem (₺832+)</span>
                      <strong className="text-white block">%19 Komisyon</strong>
                      <span className="text-slate-400 text-[10px]">Net Kâr: ₺160</span>
                    </div>
                    <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-700">
                      <span className="text-[10px] text-indigo-300">2. Barem (₺753–₺832)</span>
                      <strong className="text-indigo-200 block">%16 Komisyon</strong>
                      <span className="text-emerald-400 text-[10px] font-bold">Net Kâr: ₺210 (Önerilen)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Diğer modüller için genel vitrin */}
            {!['dashboard', 'orders', 'cashflow', 'assistant', 'commission'].includes(activeShowcase) && (
              <div className="text-center py-8 space-y-3">
                <strong className="text-lg font-black text-white block">
                  {activeShowcase === 'products' ? 'Ürün & Varyant Kârlılık Performansı' :
                   activeShowcase === 'operations' ? 'Kargo, Desi ve Teslimat Süreleri' :
                   activeShowcase === 'buybox' ? 'Buybox Rekabet ve Alt Fiyat Koruması' :
                   'Toplama, Etiketleme & Mobil Barkod Doğrulama'}
                </strong>
                <p className="text-xs text-slate-400 max-w-lg mx-auto">
                  Tüm bu gelişmiş operasyon araçları 14 günlük ücretsiz denemenizde anında kullanıma hazırdır.
                </p>
                <button
                  onClick={onExploreDemo}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
                >
                  Canlı Demoda Deneyimle
                </button>
              </div>
            )}

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. NET KÂR MOTORU VE CANLI SİMÜLATÖR (#profit-engine) */}
        {/* ========================================================================= */}
        <section id="profit-engine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-black text-emerald-400">
                <DollarSign className="w-4 h-4" /> 0 TL Varsayılmaz Gerçek Net Kâr Motoru
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                "Ciro Yapıyorum Ama Kasa Neden Boş?" Sorununa Son.
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Geleneksel yazılımlar sadece satış tutarını toplar, alış maliyetini sıfır veya tahmini sayar. izeeg AI ise ürün alış faturasını, pazar yeri komisyonunu, kargo desi cezasını ve iade maliyetini tek tek düşerek <strong className="text-emerald-400">kasanıza kalan gerçek nakdi</strong> gösterir.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white">Canlı Net Kâr Simülatörü</h3>
                    <span className="text-[11px] text-slate-400">Değerleri değiştirerek net kârınızı test edin</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Canlı Hesaplayıcı
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-300 mb-1">
                      <span>Ürün Satış Fiyatı:</span>
                      <span className="text-white font-mono font-black">{simSalePrice.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <input 
                      type="range" 
                      min="100" 
                      max="5000" 
                      step="50"
                      value={simSalePrice} 
                      onChange={(e) => setSimSalePrice(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-300 mb-1">
                      <span>Alış Maliyeti (KDV Dahil):</span>
                      <span className="text-white font-mono font-black">{simCostPrice.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="3000" 
                      step="25"
                      value={simCostPrice} 
                      onChange={(e) => setSimCostPrice(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between font-bold text-slate-300 mb-1">
                        <span>Komisyon:</span>
                        <span className="text-amber-400 font-mono font-black">%{simCommissionRate} ({simCommissionAmount.toFixed(0)} ₺)</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="30" 
                        step="1"
                        value={simCommissionRate} 
                        onChange={(e) => setSimCommissionRate(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-slate-300 mb-1">
                        <span>Kargo Maliyeti:</span>
                        <span className="text-amber-400 font-mono font-black">{simCargoCost} ₺</span>
                      </div>
                      <input 
                        type="range" 
                        min="20" 
                        max="250" 
                        step="5"
                        value={simCargoCost} 
                        onChange={(e) => setSimCargoCost(Number(e.target.value))}
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-800/50 to-slate-900 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">Cebinize Kalan Saf Net Kâr:</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                        +{simNetProfit > 0 ? simNetProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '0,00'} ₺
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-400 block uppercase">Net Kâr Marjı:</span>
                      <span className={`text-xl font-black font-mono ${Number(simProfitMargin) > 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        %{simProfitMargin}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. SIKÇA SORULAN SORULAR (#faq) */}
        {/* ========================================================================= */}
        <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
              ❓ Aklınıza Takılanlar
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Sıkça Sorulan Sorular
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-white">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. ALT CTA & FOOTER */}
        {/* ========================================================================= */}
        <section className="border-t border-slate-800/90 bg-gradient-to-b from-[#090d18] to-[#04060b] py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Pazaryeri Satışlarınızı Bugün Gerçek Kârla Yönetin.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              14 günlük ücretsiz denemenizi başlatın, kargo faturalarınızdaki hataları ve gerçek kârınızı dakikalar içinde görün.
            </p>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              14 Gün Ücretsiz Başla (Kredi Kartı Gerekmez) ➔
            </button>
          </div>
        </section>

        <footer className="border-t border-slate-800/90 bg-[#04060b] py-10 px-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <IzeegLogo size="xs" variant="icon" />
                <span className="text-slate-200 font-black text-sm">IZEEG AI</span>
                <span className="text-slate-400">• © 2026 Tüm Hakları Saklıdır.</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pazaryeri Kâr Analizi, Desi & İade Yönetim İşletim Sistemi.
              </p>
            </div>
            <div className="text-center md:text-right space-y-1">
              <span className="text-[11px] text-slate-400 block">Kurucu & Sistem Mimarı: İsmet Köse</span>
              <a href="mailto:ismetnote2@gmail.com" className="text-xs font-bold text-indigo-400 hover:underline">
                ismetnote2@gmail.com
              </a>
            </div>
          </div>
        </footer>

      </div>

      {/* 14 Günlük Hesap Kurulum Sihirbazı Modalı */}
      <OnboardingWizardModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompleteSetup={(user) => {
          onLoginSuccess(user, `🎉 14 Günlük Ücretsiz Denemeniz Başlatıldı! Hoş geldiniz ${user.ownerName}.`);
        }}
      />

      {/* Komisyon Baremleri Simülatörü Modalı */}
      <CommissionTariffsModal
        isOpen={isTariffsOpen}
        onClose={() => setIsTariffsOpen(false)}
      />

    </div>
  );
}

export default PortalEntrancePage;
