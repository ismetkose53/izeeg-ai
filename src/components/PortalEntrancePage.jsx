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
  Workflow
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IzeegLogo } from './IzeegLogo';
import { loginUser } from '../services/authService';

export function PortalEntrancePage({ onLoginSuccess, onExploreDemo }) {
  // Aktif Auth Sekmesi: 'REGISTER' (Ücretsiz Kayıt) | 'LOGIN' (Giriş Yap)
  const [activeAuthTab, setActiveAuthTab] = useState('REGISTER');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Kayıt Formu State'leri
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    storeName: '',
    password: '',
    selectedMarketplaces: ['Trendyol', 'Hepsiburada']
  });

  // Giriş Formu State'leri (Güvenli, Şifreli & Deşifresiz)
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
  const [pricingCycle, setPricingCycle] = useState('monthly'); // 'monthly' | 'yearly'

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

  // Yumuşak Kaydırma Fonksiyonu
  const scrollToSection = (sectionId) => {
    setMobileNavOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 1. Yeni Ücretsiz Kayıt İşlemi (7 Günlük Deneme)
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

    setTimeout(() => {
      setIsLoading(false);
      const newUser = {
        id: `USR-${Date.now().toString().slice(-5)}`,
        storeName: formData.storeName,
        ownerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: 'merchant',
        plan: 'TRIAL',
        planName: '7 Günlük Ücretsiz Deneme',
        trialDaysLeft: 7,
        daysRemaining: 7,
        isLoggedIn: true,
        activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
      };

      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
      onLoginSuccess(newUser, `🎉 7 Günlük Ücretsiz Denemeniz Başlatıldı! Panelinize hoş geldiniz ${formData.fullName}.`);
    }, 800);
  };

  // 2. Güvenli Giriş Yap İşlemi (Satıcı & Kurucu Admin Doğrulama)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError(null);

    if (!loginEmail || !loginPassword) {
      setAuthError("Lütfen e-posta adresinizi ve şifrenizi giriniz.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = loginUser(loginEmail, loginPassword);
      if (res.success) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.4 } });
        onLoginSuccess(res.user, res.user.role === 'admin' 
          ? "👑 Hoş geldiniz İsmet Bey! Kurucu Süper Admin Yetkisiyle Giriş Yapıldı." 
          : `Hoş geldiniz ${res.user.ownerName || res.user.storeName}!`
        );
      } else {
        setAuthError(res.message || "Giriş bilgileri doğrulanamadı. Lütfen e-posta ve şifrenizi kontrol ediniz.");
      }
    }, 700);
  };

  // SSS Verileri
  const faqs = [
    {
      q: "7 Günlük Deneme için kredi kartı girmem gerekiyor mu?",
      a: "Hayır, kesinlikle kredi kartı veya ödeme bilgisi istemiyoruz. Adınızı ve mağaza bilgilerinizi girerek saniyeler içinde 7 günlük tam yetkili deneme hesabınızı başlatabilirsiniz."
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
      a: "Trendyol, Hepsiburada, Amazon TR, N11, Çiçeksepeti, Shopify, WooCommerce, Ticimax, Paraşüt, BizimHesap ve Sovos e-Fatura ile tam iki yönlü API entegrasyonuna sahibiz."
    },
    {
      q: "İstediğim zaman aboneliğimi iptal edebilir miyim?",
      a: "Evet, hiçbir taahhüt ve zorunlu sözleşme bulunmamaktadır. Dilediğiniz zaman tek tıkla aboneliğinizi sonlandırabilirsiniz."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-[#f27a1a] selection:text-white relative overflow-x-hidden">
      
      {/* 🌟 21st.dev Tarzı Neon Arka Plan Parıltıları & Izgara Efekti */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 w-[650px] h-[650px] bg-gradient-to-br from-[#f27a1a]/25 via-pink-600/20 to-purple-800/20 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-blue-600/20 via-indigo-600/20 to-emerald-600/15 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-purple-700/20 to-pink-600/15 rounded-full blur-[130px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* ========================================================================= */}
        {/* 1. ÜST HEADER BAR (Cam Efektli & Aktif Gezinti Linkleri) */}
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

            {/* Orta Menü (Desktop Linkler) */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-300">
              <button 
                onClick={() => scrollToSection('features')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Özellikler
              </button>
              <button 
                onClick={() => scrollToSection('profit-engine')}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Net Kâr Motoru
              </button>
              <button 
                onClick={() => scrollToSection('ai-worker')}
                className="hover:text-[#f27a1a] transition-colors cursor-pointer"
              >
                AI Çalışanı
              </button>
              <button 
                onClick={() => scrollToSection('cargo-repricer')}
                className="hover:text-amber-400 transition-colors cursor-pointer"
              >
                Kargo & Repricer
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Nasıl Çalışır?
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="hover:text-purple-400 transition-colors cursor-pointer"
              >
                Fiyatlandırma
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="hover:text-amber-300 transition-colors cursor-pointer font-black text-amber-400/90"
              >
                Hakkında & Mimari
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
                onClick={() => {
                  setActiveAuthTab('REGISTER');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#f27a1a] via-orange-500 to-pink-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                7 Gün Ücretsiz Başla
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

          {/* Mobil Açılır Gezinti Çubuğu */}
          {mobileNavOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2 text-xs font-bold pb-2 animate-fadeIn">
              <button onClick={() => scrollToSection('features')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-200">
                ⚡ Özellikler & Ekosistem
              </button>
              <button onClick={() => scrollToSection('profit-engine')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-emerald-300">
                📊 0 TL Varsayılmaz Net Kâr Motoru
              </button>
              <button onClick={() => scrollToSection('ai-worker')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-orange-300">
                🧠 7/24 Otonom AI Asistanı
              </button>
              <button onClick={() => scrollToSection('cargo-repricer')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-amber-300">
                ⚖️ Kargo Avcısı & Smart Repricer
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-cyan-300">
                🚀 3 Adımda Nasıl Çalışır?
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-purple-300">
                💎 Şeffaf Fiyatlandırma
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-amber-300 font-black">
                👑 Hakkında & Yapımcı (İsmet Köse)
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-400">
                ❓ Sıkça Sorulan Sorular
              </button>
            </div>
          )}
        </header>

        {/* ========================================================================= */}
        {/* 2. HERO SECTION & MERKEZİ GİRİŞ / KAYIT CPANEL PANELİ */}
        {/* ========================================================================= */}
        <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-14 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Sol Kolon: Büyüleyici Başlık ve Canlı İstatistikler */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* Glowing Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-purple-500/15 to-pink-500/15 border border-orange-500/30 text-[11px] font-black text-orange-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#f27a1a] animate-ping"></span>
                <span>✨ 2026 Nesil Çok Kanallı E-Ticaret İşletim Sistemi</span>
              </div>

              {/* Ana Başlık */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.15]">
                Ciroya Değil, Cebinize Kalan{' '}
                <span className="bg-gradient-to-r from-[#f27a1a] via-amber-400 to-pink-500 text-transparent bg-clip-text">
                  Gerçek Net Kâra
                </span>{' '}
                Odaklanın.
              </h1>

              {/* Alt Açıklama */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Trendyol, Hepsiburada, Amazon ve web sitenizi tek otonom merkezden yönetin. Kargo desi kaçaklarını yakalayın, Buybox kazanın ve 7/24 çalışan yapay zekânızla operasyonunuzu otomatikleştirin.
              </p>

              {/* 3 Büyük Güvence / Özellik */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-emerald-400 font-black text-sm flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> 0 TL Varsayılmaz
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Asla sahte kâr uydurmaz</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-amber-400 font-black text-sm flex items-center gap-1.5">
                    <Scale className="w-4 h-4" /> Desi Kaçak Avcısı
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Paranızı dilekçeyle geri alır</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-purple-400 font-black text-sm flex items-center gap-1.5">
                    <Brain className="w-4 h-4" /> 7/24 AI Asistanı
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Onayınızla kârı korur</span>
                </div>
              </div>

              {/* Hızlı Demo Modu Butonu */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onExploreDemo}
                  className="px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600/80 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-lg"
                >
                  <span>⚡ Şifresiz Canlı Simülasyonu İncele</span>
                  <ArrowRight className="w-4 h-4 text-orange-400" />
                </button>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Kredi Kartı Gerekmez • 7 Gün Ücretsiz
                </span>
              </div>

            </div>

            {/* Sağ Kolon: Güvenli, Şifreli & 2 Sekmeli Glassmorphism Giriş / Kayıt CPANEL Kutusu */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-[#f27a1a]/50 via-purple-500/30 to-blue-500/20 shadow-2xl shadow-orange-500/10 backdrop-blur-2xl">
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
                          ? 'bg-gradient-to-r from-[#f27a1a] to-pink-600 text-white shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 flex-shrink-0" />
                      <span>✨ 7 Gün Ücretsiz Başla</span>
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

                  {/* SEKME 1: ÜCRETSİZ KAYIT FORMU */}
                  {activeAuthTab === 'REGISTER' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          7 Gün Boyunca Tüm Pazar Yerleri Dahil Ücretsiz Deneyin
                        </span>
                        <h3 className="text-lg font-black text-white">Yeni Satıcı Hesabı Oluşturun</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Adınız & Soyadınız *</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="Örn: Ahmet Yılmaz"
                              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#f27a1a] text-xs"
                            />
                            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Mağaza / Firma Adınız *</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={formData.storeName}
                              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                              placeholder="Örn: Butik Store"
                              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#f27a1a] text-xs"
                            />
                            <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">E-Posta Adresiniz *</label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="ornek@magaza.com"
                              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#f27a1a] text-xs"
                            />
                            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Cep Telefonu *</label>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="0543 000 00 00"
                              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#f27a1a] text-xs"
                            />
                            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Hesap Şifreniz *</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#f27a1a] text-xs"
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

                      {/* Satış Yapılan Kanallar Çoklu Seçim */}
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">
                          Satış Yaptığınız Kanalları Seçin:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-bold">
                          {['Trendyol', 'Hepsiburada', 'Amazon TR', 'Kendi Sitem'].map(mp => {
                            const isSelected = formData.selectedMarketplaces.includes(mp);
                            return (
                              <button
                                key={mp}
                                type="button"
                                onClick={() => toggleMarketplace(mp)}
                                className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-orange-500/20 border-orange-500/60 text-orange-200' 
                                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <span>{mp}</span>
                                {isSelected && <Check className="w-3 h-3 text-[#f27a1a]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Buton */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#f27a1a] via-orange-500 to-pink-600 text-white font-black text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-2"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-200" />
                            <span>7 Gün Ücretsiz Başla (Kredi Kartı İstemez) ➔</span>
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] text-slate-500 pt-1">
                        Kayıt olarak izeeg AI Kullanım Şartları ve Gizlilik İlkelerini kabul etmiş sayılırsınız.
                      </p>
                    </form>
                  )}

                  {/* SEKME 2: GÜVENLİ GİRİŞ YAP FORMU */}
                  {activeAuthTab === 'LOGIN' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Kayıtlı Mağaza Yöneticisi & Admin Girişi
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
                            placeholder="ornek@magaza.com"
                            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#f27a1a] text-xs"
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
                            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-10 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#f27a1a] text-xs"
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

                      {/* Giriş Butonu */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-2"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Key className="w-4 h-4 text-blue-200" />
                            <span>Güvenli Giriş Yap ➔</span>
                          </>
                        )}
                      </button>

                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Henüz hesabınız yok mu?</span>
                        <button
                          type="button"
                          onClick={() => setActiveAuthTab('REGISTER')}
                          className="text-[#f27a1a] font-bold hover:underline cursor-pointer"
                        >
                          7 Gün Ücretsiz Kayıt Ol
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
        {/* 3. ÖZELLİKLER & 6'LI NEON SHOWCASE BÖLÜMÜ (#features) */}
        {/* ========================================================================= */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-black text-[#f27a1a] uppercase tracking-wider bg-[#f27a1a]/10 px-3.5 py-1.5 rounded-full border border-[#f27a1a]/20">
              ⚡ Hepsi Bir Arada E-Ticaret Ekosistemi
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Neden Binlerce Satıcı izeeg AI Kullanıyor?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Klasik entegrasyonlar sadece sipariş çeker. izeeg AI ise kâr kaçaklarını durdurur, kargo cezalarını yakalar ve 7/24 dükkanınızı büyütür.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Kart 1: 0 TL Varsayılmaz Net Kâr */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-emerald-500/50 transition-all group backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">0 TL Varsayılmaz Net Kâr Motoru</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Alış maliyeti, pazar yeri komisyonları, desi cezaları, iade zararları ve reklam harcamaları düşülerek kasanıza kalan saf nakit kuruşu kuruşuna hesaplanır.
              </p>
            </div>

            {/* Kart 2: AI E-Ticaret Çalışanı */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-[#f27a1a]/50 transition-all group backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-[#f27a1a] flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">7/24 Otonom AI Asistanı v2.1</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                4 temel soruyla işletmenizi saniye saniye tarar: Ne oldu? Neden oldu? Finansal etkisi ne? Güvenlik onayınızla kâr kaçaklarını durdurur.
              </p>
            </div>

            {/* Kart 3: Kargo Kaçak Avcısı */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-amber-500/50 transition-all group backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Kargo Desi Avcısı & İtiraz Sihirbazı</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kargo faturalarındaki haksız desi şişirmelerini ve çift kargo iadelerini yakalar; kargo firmasına iletmeniz için resmi dilekçeyi tek tıkla hazırlar.
              </p>
            </div>

            {/* Kart 4: Çok Kanallı Ürün Yükleme */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-purple-500/50 transition-all group backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Çok Kanallı Ürün Yükle & Dağıt</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tek bir formdan ürün bilgilerini ve alış maliyetini girin; Trendyol, Hepsiburada, Amazon ve Web sitenize kurallara uygun olarak aynı anda dağıtın.
              </p>
            </div>

            {/* Kart 5: Smart Repricer */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-cyan-500/50 transition-all group backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Otomatik Buybox & Fiyat Savaşçısı</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rakiplerinizi 7/24 takip eder. Belirlediğiniz asgari kâr marjının altına inmeden 1 TL alt kırparak Buybox'ı garantiler; zararına satışı engeller.
              </p>
            </div>

            {/* Kart 6: WhatsApp Yönetici Bülteni */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-emerald-500/50 transition-all group backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">WhatsApp 09:00 Sabah Bülteni</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Her sabah saat 09:00'da dünkü net kârınızı, kritik stok alarmlarını ve bekleyen sipariş durumunu cebinize WhatsApp mesajı olarak raporlar.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. NET KÂR MOTORU VE CANLI İNTERAKTİF SİMÜLATÖR BÖLÜMÜ (#profit-engine) */}
        {/* ========================================================================= */}
        <section id="profit-engine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Sol: Açıklama ve Kıyaslama */}
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

              {/* Kıyaslama Kutusu */}
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-1 text-xs">
                  <div className="font-black text-rose-400 flex items-center gap-2">
                    <span>❌ Klasik Entegratörler:</span>
                  </div>
                  <p className="text-slate-300">
                    Alış fiyatı girilmezse 0 TL kâr uydurur. Kargo desi farklarını hesaba katmaz, ay sonunda sürpriz zararlarla karşılaşırsınız.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 space-y-1 text-xs">
                  <div className="font-black text-emerald-400 flex items-center gap-2">
                    <span>✅ izeeg AI 0 TL Varsaymaz:</span>
                  </div>
                  <p className="text-slate-300">
                    Alış fiyatı eksikse uyarır ve asla sahte kâr uydurmaz. Her kuruş nakit netleştirilir.
                  </p>
                </div>
              </div>
            </div>

            {/* Sağ: Canlı İnteraktif Kâr Hesaplama Kartı */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-black text-white">Canlı Net Kâr Simülatörü</h3>
                    <span className="text-[11px] text-slate-400">Değerleri değiştirerek net kârınızı canlı test edin</span>
                  </div>
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    Canlı Hesaplayıcı
                  </span>
                </div>

                {/* Input Sliderlar */}
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
                      className="w-full accent-[#f27a1a] cursor-pointer"
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
                      className="w-full accent-[#f27a1a] cursor-pointer"
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

                {/* Net Sonuç Kutusu */}
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
                  <div className="text-[11px] text-slate-400 border-t border-slate-700/80 pt-2 flex items-center justify-between">
                    <span>Toplam Maliyet Yükü: {simTotalCost.toFixed(0)} ₺</span>
                    <span className="text-emerald-300 font-bold">Kuruşu kuruşuna doğrulanmış</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. 7/24 OTONOM AI ÇALIŞANI BÖLÜMÜ (#ai-worker) */}
        {/* ========================================================================= */}
        <section id="ai-worker" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-black text-purple-400 uppercase tracking-wider bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">
              🧠 7/24 Otonom E-Ticaret Asistanı v2.1
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Siz Uyurken Bile Mağazanızı Koruyan Yapay Zeka
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              izeeg AI sadece istatistik göstermez. 4 temel soru modeliyle problemleri tespit eder, finansal etkisini hesaplar ve tek onayınızla pazar yerinde aksiyon alır.
            </p>
          </div>

          {/* 4 Adımlı Otonom Döngü Kartları */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 relative overflow-hidden group">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="text-sm font-black text-white">1. Ne Oldu? (Canlı Tespit)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Trendyol'da 'Kedi Taş Aksesuarlı Tişört' ilanında Buybox kaybedildi. Rakip satıcı 249 TL'ye indi."
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 relative overflow-hidden group">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="text-sm font-black text-white">2. Neden Oldu? (Kök Analiz)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Rakip 10 TL fiyat kırdı. Sizin alış maliyetiniz 90 TL ve %18 kâr marjınız hala fiyat kırmaya müsait."
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 relative overflow-hidden group">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center">
                03
              </div>
              <h3 className="text-sm font-black text-white">3. Finansal Etki Ne?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Fiyat 245 TL'ye indirilirse günlük tahmini 45 adet satış ve +4.250 TL net nakit kâr korunacak."
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/60 border border-emerald-500/40 space-y-2 relative overflow-hidden group bg-emerald-950/10">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">
                04
              </div>
              <h3 className="text-sm font-black text-white">4. Güvenlik Onayı & Çözüm</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                "Sizden tek tık onay ister. Onay verdiğiniz an API üzerinden fiyatı günceller ve Buybox'ı geri alır."
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. KARGO DESİ AVCISI & BUYBOX REPRICER DETAY SUNUMU (#cargo-repricer) */}
        {/* ========================================================================= */}
        <section id="cargo-repricer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              ⚖️ Kargo Kaçağı & Akıllı Repricer Motoru
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Kargo Cezalarına ve Buybox Kayıplarına Kesin Çözüm
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Her ay binlerce liranız kargo faturalarındaki hatalı desiler yüzünden buharlaşmasın.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Sol: Kargo Desi Avcısı & Resmi Dilekçe */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-amber-500/30 space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black">
                  <Scale className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Otomatik İtiraz Dilekçesi
                </span>
              </div>

              <h3 className="text-xl font-black text-white">Kargo Desi Şişirmelerine Son</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kargo firmaları 1 desi olan tişört paketini faturada 3 desi olarak yazıp fazla para keser. izeeg AI bu uyuşmazlığı milisaniyeler içinde yakalar, kaç TL fazla kesildiğini hesaplar ve kargo firmasına iletmeniz için resmi iade dilekçesini PDF formatında hazırlar.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Örnek Yakalanan Desi Hatası:</span>
                  <span className="text-rose-400 font-bold">1 Desi yerine 3.5 Desi</span>
                </div>
                <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-1.5">
                  <span>Haksız Kesilen Tutar:</span>
                  <span className="text-emerald-400 font-black">+1.420,00 ₺ Geri Kazanıldı</span>
                </div>
              </div>
            </div>

            {/* Sağ: Otomatik Buybox Repricer */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-cyan-500/30 space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center font-black">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  Zarar Korumalı Fiyat Savaşçısı
                </span>
              </div>

              <h3 className="text-xl font-black text-white">7/24 Otomatik Buybox Kazanımı</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trendyol ve Amazon'da rakipleriniz fiyat düşürdüğünde satışlarınız durmasın. Belirlediğiniz minimum kâr marjının altına inmeden 1 TL alt kırparak Buybox'ı garantiler. Zararına satış yapmanızı kesinlikle engeller.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Minimum Kâr Marjı Kilidi:</span>
                  <span className="text-emerald-400 font-bold">%15 Kâr Koruması Aktif</span>
                </div>
                <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-1.5">
                  <span>Buybox Tepki Süresi:</span>
                  <span className="text-cyan-400 font-black">Anlık 60 Saniye Tarama</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. 3 KOLAY ADIMDA NASIL ÇALIŞIR? (#how-it-works) */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20">
              🚀 Basit, Hızlı ve Güvenli Kurulum
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              3 Dakikada E-Ticaretinizi Otopilota Alın
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Uzun eğitimler, karmaşık kurulumlar yok. Hesabınızı oluşturun ve hemen kazanmaya başlayın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Adım 1 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f27a1a] to-pink-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
                1
              </div>
              <h3 className="text-lg font-black text-white">Ücretsiz Hesabınızı Başlatın</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kredi kartı girmeden 7 günlük deneme hesabı açın. Trendyol, Hepsiburada veya web sitenizin API bilgilerini 2 dakikada bağlayın.
              </p>
            </div>

            {/* Adım 2 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                2
              </div>
              <h3 className="text-lg font-black text-white">Otonom Kâr Taraması</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yapay zeka tüm siparişlerinizi, kargo kesintilerinizi ve pazar yeri komisyonlarını saniyeler içinde tarar ve cebinize kalan net nakdi listeler.
              </p>
            </div>

            {/* Adım 3 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-emerald-500/40 bg-emerald-950/10 space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                3
              </div>
              <h3 className="text-lg font-black text-white">Kârınızı Artırın & Büyüyün</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kargo cezalarınızı geri alın, Buybox kazanın ve her sabah saat 09:00'da dünkü net kâr raporunuzu WhatsApp'tan keyifle okuyun.
              </p>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. GÜNCEL ŞEFFAF FİYATLANDIRMA BÖLÜMÜ (#pricing) */}
        {/* ========================================================================= */}
        <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
              💎 Şeffaf & Adil Fiyatlandırma
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              İşletmenizi Büyütecek Doğru Paketi Seçin
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Gizli ücret yok, taahhüt yok. 7 gün boyunca tüm özellikleri ücretsiz deneyin, memnun kalırsanız devam edin.
            </p>

            {/* Aylık / Yıllık Seçici */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 mt-4 text-xs font-bold">
              <button
                onClick={() => setPricingCycle('monthly')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  pricingCycle === 'monthly' ? 'bg-[#f27a1a] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Aylık Ödeme
              </button>
              <button
                onClick={() => setPricingCycle('yearly')}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  pricingCycle === 'yearly' ? 'bg-[#f27a1a] text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Yıllık Peşin (2 Ay Hediye)</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full">%15 İndirim</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Paket 1: 7 Gün Ücretsiz Deneme */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-black text-orange-400 uppercase tracking-wider">Hemen Başlayın</span>
                <h3 className="text-xl font-black text-white">7 Gün Ücretsiz Deneme</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-mono">0 ₺</span>
                  <span className="text-xs text-slate-400">/ 7 gün boyunca</span>
                </div>
                <p className="text-xs text-slate-400">
                  Kredi kartı girmeden platformun tüm gücünü ve algoritmalarını test edin.
                </p>

                <div className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Tüm Pazar Yeri Entegrasyonları</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>0 TL Varsayılmaz Net Kâr Motoru</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Kargo Desi Kaçak Tespiti</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>7/24 AI Asistanı ve Danışman</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveAuthTab('REGISTER');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
              >
                7 Gün Ücretsiz Başla
              </button>
            </div>

            {/* Paket 2: Standart Pro Satıcı Paketi (979 TL / Ay - EN POPÜLER) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-[#121927] to-[#0d1422] border-2 border-[#f27a1a] flex flex-col justify-between space-y-6 relative shadow-2xl shadow-orange-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#f27a1a] to-pink-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                🔥 En Çok Tercih Edilen
              </div>

              <div className="space-y-4">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Büyüyen Mağazalar İçin</span>
                <h3 className="text-xl font-black text-white">Standart Pro Paket</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-mono">
                    {pricingCycle === 'monthly' ? '979 ₺' : '829 ₺'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {pricingCycle === 'monthly' ? '/ ay' : '/ ay (Yıllık 9.950 ₺)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Otomasyon, kargo itirazları ve Buybox kazanımı ile satışlarınızı katlayın.
                </p>

                <div className="space-y-2 pt-2 text-xs text-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#f27a1a] flex-shrink-0" />
                    <span>5 Pazar Yeri & Web Sitesi API Bağlantısı</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#f27a1a] flex-shrink-0" />
                    <span>Otomatik Buybox Smart Repricer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#f27a1a] flex-shrink-0" />
                    <span>Kargo İtiraz Dilekçesi Sihirbazı</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#f27a1a] flex-shrink-0" />
                    <span>WhatsApp 09:00 Sabah Yönetici Bülteni</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#f27a1a] flex-shrink-0" />
                    <span>E-Fatura & Toplu Kargo Barkodu Yazdırma</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>FAST / Havale İle Ekstra %15 İndirim</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveAuthTab('REGISTER');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#f27a1a] via-orange-500 to-pink-600 text-white font-black text-xs shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] transition-all cursor-pointer"
              >
                Pro Paketi 7 Gün Ücretsiz Dene ➔
              </button>
            </div>

            {/* Paket 3: Enterprise & VIP Kurumsal (2.450 TL / Ay) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-black text-purple-400 uppercase tracking-wider">Büyük Operasyonlar İçin</span>
                <h3 className="text-xl font-black text-white">Enterprise VIP</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-mono">
                    {pricingCycle === 'monthly' ? '2.450 ₺' : '1.990 ₺'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {pricingCycle === 'monthly' ? '/ ay' : '/ ay (Yıllık 23.880 ₺)'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Çoklu şirket, sınırsız pazar yeri ve özel muhasebe ERP entegrasyonu.
                </p>

                <div className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Sınırsız Mağaza & Pazar Yeri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Çoklu Depo & Tedarik PO Yönetimi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>Özel ERP / Muhasebe Entegrasyon Köprüsü</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>7/24 Öncelikli VIP Telefon & WhatsApp Desteği</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveAuthTab('REGISTER');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all cursor-pointer"
              >
                7 Gün Ücretsiz Başla
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. HAKKIMIZDA & KURUCU MİMAR (İSMET KÖSE) & ÖZEL YAZILIM ÇÖZÜMLERİ (#about) */}
        {/* ========================================================================= */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-800/80 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Sol: Kurucu Kimliği & Vizyon Metni */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-black text-amber-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>YAPIMCI & BAŞ YAZILIM MİMARI</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                Geleceğin E-Ticaret ve Yapay Zeka Sistemlerini İnşa Ediyoruz.
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>izeeg AI</strong>; Türkiye’de ve küresel pazarda binlerce e-ticaret satıcısının yaşadığı gizli kâr kayıplarını, hatalı kargo desi kesintilerini ve çok kanallı operasyonel karmaşayı ortadan kaldırmak üzere <strong className="text-white">İsmet Köse</strong> liderliğinde geliştirilmiş yeni nesil bir otonom ekosistemdir.
                </p>
                <p>
                  Yapay zeka uzmanı, SaaS sistem mimarı ve kıdemli yazılım mühendisi <strong>İsmet Köse</strong>; modern makine öğrenmesi modelleri, otonom AI ajanları (Autonomous Agents) ve yüksek hacimli finansal veri işleme algoritmalarını harmanlayarak Türk e-ticaret satıcılarının kasalarını 7/24 koruyan bu yerli ve milli işletim sistemini sıfırdan tasarlamıştır.
                </p>
              </div>

              {/* Kurucu Rozet Kartı */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-pink-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
                  İK
                </div>
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>İsmet Köse</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                      Founder & Lead Architect
                    </span>
                  </h4>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Yapay Zeka & SaaS Çözümleri Baş Mimarı
                  </span>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                    <span>📍 İstanbul / TR</span>
                    <span>•</span>
                    <a href="mailto:ismetnote2@gmail.com" className="text-orange-400 hover:underline">ismetnote2@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sağ: Özel Yazılım & SaaS Geliştirme Hizmetleri Vitrini */}
            <div className="lg:col-span-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111726] to-[#0b101c] border border-slate-700/90 shadow-2xl relative overflow-hidden space-y-6">
                
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#f27a1a] uppercase tracking-wider">
                    <Code className="w-4 h-4" />
                    <span>ÖZEL YAZILIM & KURUMSAL ÇÖZÜMLER</span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    İşletmenize Özel Yapay Zeka & SaaS Projesi Mi Lazım?
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Şirketinizin ihtiyaçlarına tam uyumlu özel yazılım sistemlerini, yapay zeka entegrasyonlarını ve büyük ölçekli SaaS platformlarını uçtan uca geliştiriyoruz.
                  </p>
                </div>

                {/* 4 Özel Hizmet Maddesi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <span>Özel AI Ajanları & LLM</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      GPT-4o, Claude ve lokal LLM destekli otonom şirket asistanları ve müşteri botları.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-blue-400" />
                      <span>Kurumsal SaaS & Web</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      Modern React, Next.js, Node.js ve cloud tabanlı yüksek performanslı web uygulamaları.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Workflow className="w-4 h-4 text-emerald-400" />
                      <span>Özel ERP & Entegrasyon</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      Muhasebe, depo, kargo ve pazar yerleri arasında sıfır gecikmeli iki yönlü API köprüleri.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <span>Algoritmik Finans & Bot</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block leading-tight">
                      Otomatik fiyatlandırma botları, anomali tespiti ve kestirimci veri modelleme.
                    </span>
                  </div>

                </div>

                {/* Doğrudan İletişim & Teklif Butonları */}
                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href="https://wa.me/905436970755?text=Merhaba%20%C4%B0smet%20Bey%2C%20%C3%B6zel%20yaz%C4%B1l%C4%B1m%20%2F%20yapay%20zeka%20projemiz%20i%C3%A7in%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyoruz."
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer text-center"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>WhatsApp ile Görüşün</span>
                  </a>

                  <a
                    href="mailto:ismetnote2@gmail.com?subject=%C3%96zel%20Yaz%C4%B1l%C4%B1m%20ve%20Yapay%20Zeka%20Proje%20Talebi"
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
                  >
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>E-Posta ile Teklif Alın</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. SIKÇA SORULAN SORULAR (S.S.S.) BÖLÜMÜ (#faq) */}
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
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-orange-400' : ''}`} />
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
        {/* 11. ALT ÇAĞRI (CTA) */}
        {/* ========================================================================= */}
        <section className="border-t border-slate-800/90 bg-gradient-to-b from-[#090d18] to-[#04060b] py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              E-Ticarette Kâr Kaçaklarına Bugün Dur Deyin.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              7 günlük ücretsiz denemenizi başlatın, kargo faturalarınızdaki hataları ve gerçek kârınızı dakikalar içinde görün.
            </p>
            <button
              onClick={() => {
                setActiveAuthTab('REGISTER');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#f27a1a] via-orange-500 to-pink-600 text-white font-black text-sm shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              7 Gün Ücretsiz Başla (Kredi Kartı Gerekmez) ➔
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. KURUMSAL FOOTER (İSMET KÖSE İMZASI VE TELİF HAKLARI) */}
        {/* ========================================================================= */}
        <footer className="border-t border-slate-800/90 bg-[#04060b] py-10 px-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Sol: Marka Logosu & Telif & İsmet Köse İmzası */}
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <IzeegLogo size="xs" variant="icon" />
                <span className="text-slate-200 font-black text-sm">izeeg AI</span>
                <span className="text-slate-400">• © 2026 Tüm Hakları Saklıdır.</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Türkiye'nin Kâr & Kayıp Korumalı Otonom E-Ticaret İşletim Sistemi.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-medium">
                <span>👑 Yapımcı & Baş Yazılım Mimarı:</span>
                <strong className="text-white font-bold">İsmet Köse</strong>
              </div>
            </div>

            {/* Orta: Hızlı Menü Bağlantıları */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-slate-400 font-medium">
              <button 
                onClick={() => scrollToSection('features')}
                className="hover:text-white transition-colors"
              >
                Özellikler
              </button>
              <button 
                onClick={() => scrollToSection('profit-engine')}
                className="hover:text-emerald-400 transition-colors"
              >
                Net Kâr
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="hover:text-purple-400 transition-colors"
              >
                Fiyatlandırma
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="hover:text-amber-300 text-amber-400/90 font-bold transition-colors"
              >
                Hakkında & İletişim
              </button>
              <button 
                onClick={() => {
                  setActiveAuthTab('LOGIN');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-white transition-colors"
              >
                Giriş Yap
              </button>
            </div>

            {/* Sağ: İletişim & Özel Geliştirme Notu */}
            <div className="text-center md:text-right space-y-1">
              <span className="text-[11px] text-slate-400 block">Özel Yazılım & AI Çözümleri İçin:</span>
              <a 
                href="mailto:ismetnote2@gmail.com" 
                className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors font-mono"
              >
                ismetnote2@gmail.com
              </a>
            </div>

          </div>
        </footer>

      </div>

    </div>
  );
}

export default PortalEntrancePage;
