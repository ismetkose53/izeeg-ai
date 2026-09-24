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
  Crown, 
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
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IzeegLogo } from './IzeegLogo';
import { loginUser } from '../services/authService';

export function PortalEntrancePage({ onLoginSuccess, onExploreDemo }) {
  // Aktif Sekme: 'REGISTER' (Ücretsiz Kayıt) | 'LOGIN' (Giriş Yap) | 'ADMIN' (Kurucu Admin)
  const [activeAuthTab, setActiveAuthTab] = useState('REGISTER');

  // Form State'leri
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    storeName: '',
    password: '',
    selectedMarketplaces: ['Trendyol', 'Hepsiburada']
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

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

  // 1. Yeni Ücretsiz Kayıt İşlemi
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser = {
        id: `USR-${Date.now().toString().slice(-5)}`,
        storeName: formData.storeName || 'Yeni Mağazam',
        ownerName: formData.fullName || 'Değerli Satıcımız',
        email: formData.email || 'satici@izeeg.com',
        phone: formData.phone || '0555 000 00 00',
        role: 'merchant',
        plan: 'TRIAL',
        planName: '7 Günlük Ücretsiz Deneme',
        trialDaysLeft: 7,
        daysRemaining: 7,
        isLoggedIn: true,
        activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
      };

      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      onLoginSuccess(newUser, "🎉 7 Günlük Ücretsiz Denemeniz Başlatıldı! Panelinize hoş geldiniz.");
    }, 800);
  };

  // 2. Normal Giriş Yap İşlemi
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = loginUser(loginEmail, loginPassword);
      if (res.success) {
        confetti({ particleCount: 80, spread: 70 });
        onLoginSuccess(res.user, `Hoş geldiniz ${res.user.ownerName}!`);
      } else {
        setAuthError("Giriş bilgileri doğrulanamadı.");
      }
    }, 700);
  };

  // 3. 👑 Kurucu & Süper Admin Girişi (İsmet Bey 1-Tık)
  const handleFounderAdminLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = loginUser('ismetnote2@gmail.com', 'krobaba53');
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 } });
      onLoginSuccess(res.user, "👑 Hoş geldiniz İsmet Bey! Kurucu & Süper Admin Yetkisiyle Giriş Yapıldı.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans selection:bg-[#f27a1a] selection:text-white relative overflow-x-hidden">
      
      {/* 🌟 21st.dev Tarzı Neon Arka Plan Parıltıları & Izgara Efekti */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Glow Spheres */}
        <div className="absolute -top-32 left-1/4 w-[650px] h-[650px] bg-gradient-to-br from-[#f27a1a]/25 via-pink-600/20 to-purple-800/20 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-gradient-to-bl from-blue-600/20 via-indigo-600/20 to-emerald-600/15 rounded-full blur-[130px]"></div>
        <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-purple-700/20 to-pink-600/15 rounded-full blur-[130px]"></div>
        
        {/* Subtle Futuristic Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* ========================================================================= */}
        {/* 1. ÜST HEADER BAR (Sade, Modern & Cam Efektli) */}
        {/* ========================================================================= */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070b14]/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <IzeegLogo size="md" variant="full" theme="dark" showBadge={true} badgeText="AI" />
            </div>

            {/* Orta Menü (Desktop) */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
              <a href="#features" className="hover:text-white transition-colors">Özellikler</a>
              <a href="#profit-engine" className="hover:text-white transition-colors">Net Kâr Motoru</a>
              <a href="#ai-worker" className="hover:text-white transition-colors">AI Çalışanı</a>
              <a href="#pricing" className="hover:text-white transition-colors">Fiyatlandırma</a>
            </nav>

            {/* Sağ Butonlar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setActiveAuthTab('LOGIN')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
              >
                Giriş Yap
              </button>

              <button
                onClick={onExploreDemo}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <span>🚀 Canlı Demo</span>
              </button>

              <button
                onClick={() => {
                  setActiveAuthTab('REGISTER');
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#f27a1a] via-orange-500 to-pink-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                7 Gün Ücretsiz Dene
              </button>
            </div>

          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. HERO SECTION & MERKEZİ GİRİŞ / KAYIT CPANEL PANELİ */}
        {/* ========================================================================= */}
        <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Sol Kolon: Büyüleyici Başlık ve Canlı İstatistikler */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              
              {/* Glowing Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-purple-500/15 to-pink-500/15 border border-orange-500/30 text-[11px] font-black text-orange-300 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#f27a1a] animate-ping"></span>
                <span>✨ 2026 Nesil Çok Kanallı E-Ticaret İşletim Sistemi</span>
              </div>

              {/* Ana Başlık (21st.dev Headline Style) */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.15]">
                Ciroya Değil, Cebinize Kalan{' '}
                <span className="bg-gradient-to-r from-[#f27a1a] via-amber-400 to-pink-500 text-transparent bg-clip-text">
                  Gerçek Net Kâra
                </span>{' '}
                Odaklanın.
              </h1>

              {/* Alt Açıklama */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Trendyol, Hepsiburada, Amazon ve kendi web sitenizi tek otonom merkezden yönetin. Kargo desi kaçaklarını yakalayın, Buybox kazanın ve 7/24 çalışan yapay zekânızla operasyonunuzu otomatikleştirin.
              </p>

              {/* 3 Büyük Güvence / Özellik */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-emerald-400 font-black text-base flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> 0 TL Varsayılmaz
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Asla sahte kâr uydurmaz</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-amber-400 font-black text-base flex items-center gap-1.5">
                    <Scale className="w-4 h-4" /> Desi Kaçak Avcısı
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Paranızı dilekçeyle geri alır</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                  <div className="text-purple-400 font-black text-base flex items-center gap-1.5">
                    <Brain className="w-4 h-4" /> 7/24 AI Çalışanı
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Onayınızla kâr kaçaklarını durdurur</span>
                </div>
              </div>

              {/* Hızlı Demo Modu Butonu */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onExploreDemo}
                  className="px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-600/80 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105 cursor-pointer shadow-lg"
                >
                  <span>⚡ Şifresiz Canlı Simülasyonu İncele</span>
                  <ArrowRight className="w-4 h-4 text-orange-400" />
                </button>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" /> Kredi Kartı Gerekmez • 7 Gün Ücretsiz
                </span>
              </div>

            </div>

            {/* Sağ Kolon: 21st.dev Tarzı Işıltılı Glassmorphism Giriş / Kayıt CPANEL Kutusu */}
            <div className="lg:col-span-6">
              <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-b from-[#f27a1a]/50 via-purple-500/30 to-blue-500/20 shadow-2xl shadow-orange-500/10 backdrop-blur-2xl">
                <div className="bg-[#0e1422]/95 rounded-[22px] p-6 sm:p-8 space-y-6">
                  
                  {/* Sekme Değiştirici Bar (Kayıt Ol / Giriş Yap / Kurucu Admin) */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-bold">
                    <button
                      onClick={() => {
                        setActiveAuthTab('REGISTER');
                        setAuthError(null);
                      }}
                      className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer text-center truncate ${
                        activeAuthTab === 'REGISTER'
                          ? 'bg-gradient-to-r from-[#f27a1a] to-pink-600 text-white shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Ücretsiz Kayıt</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveAuthTab('LOGIN');
                        setAuthError(null);
                      }}
                      className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer text-center truncate ${
                        activeAuthTab === 'LOGIN'
                          ? 'bg-slate-800 text-white border border-slate-700 shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">Giriş Yap</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveAuthTab('ADMIN');
                        setAuthError(null);
                      }}
                      className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer text-center truncate ${
                        activeAuthTab === 'ADMIN'
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black shadow-md'
                          : 'text-amber-400/80 hover:text-amber-300'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">👑 Kurucu Admin</span>
                    </button>
                  </div>

                  {/* Hata Bildirimi */}
                  {authError && (
                    <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-fadeIn">
                      ⚠️ {authError}
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* SEKME 1: ÜCRETSİZ KAYIT FORMU */}
                  {/* ======================================================== */}
                  {activeAuthTab === 'REGISTER' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          7 Gün Boyunca Tüm Pazar Yerleri Dahil Ücretsiz Deneyin
                        </span>
                        <h3 className="text-lg font-black text-white">Satıcı Hesabı Oluşturun</h3>
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
                              placeholder="Örn: İsmet Köse"
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
                              placeholder="Örn: Yumey Concept"
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
                        Kayıt olarak Kullanım Şartları ve Gizlilik Politikası'nı kabul etmiş sayılırsınız.
                      </p>
                    </form>
                  )}

                  {/* ======================================================== */}
                  {/* SEKME 2: GİRİŞ YAP FORMU */}
                  {/* ======================================================== */}
                  {activeAuthTab === 'LOGIN' && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Mevcut Mağaza Yöneticisi Girişi
                        </span>
                        <h3 className="text-lg font-black text-white">izeeg AI Panelinize Giriş Yapın</h3>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Kayıtlı E-Posta Adresi *</label>
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

                      {/* Buton */}
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
                            <span>Mağaza Paneline Giriş Yap ➔</span>
                          </>
                        )}
                      </button>

                      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Hesabınız yok mu?</span>
                        <button
                          type="button"
                          onClick={() => setActiveAuthTab('REGISTER')}
                          className="text-[#f27a1a] font-bold hover:underline"
                        >
                          7 Gün Ücretsiz Kayıt Ol
                        </button>
                      </div>
                    </form>
                  )}

                  {/* ======================================================== */}
                  {/* SEKME 3: 👑 KURUCU & SÜPER ADMIN PORTALI (İSMET BEY) */}
                  {/* ======================================================== */}
                  {activeAuthTab === 'ADMIN' && (
                    <div className="space-y-4 text-xs">
                      <div>
                        <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider block mb-1">
                          👑 Kurucu & Süper Yönetici Modu
                        </span>
                        <h3 className="text-lg font-black text-white">izeeg AI Kurucu Yönetim Girişi</h3>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Platform sahibi İsmet Bey için tüm pazar yeri limitlerini kaldıran, müşteri ve finans yönetimini açan süper admin anahtarı.
                        </p>
                      </div>

                      {/* Kurucu Kimlik Kartı */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-yellow-600/10 to-transparent border border-amber-500/40 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-lg shadow">
                            👑
                          </div>
                          <div>
                            <span className="text-xs font-black text-white block">İsmet Köse (Kurucu Admin)</span>
                            <span className="text-[11px] text-amber-300 font-mono">ismetnote2@gmail.com</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-300 pt-2 border-t border-amber-500/20 flex items-center justify-between font-medium">
                          <span>Yetki Derecesi:</span>
                          <span className="text-amber-400 font-bold bg-amber-500/20 px-2 py-0.5 rounded">Süper Admin & Full ERP</span>
                        </div>
                      </div>

                      {/* 1-Tık Kurucu Girişi Butonu */}
                      <button
                        type="button"
                        onClick={handleFounderAdminLogin}
                        disabled={isLoading}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Crown className="w-4 h-4" />
                            <span>1-Tıkla Kurucu Admin Olarak Aç ➔</span>
                          </>
                        )}
                      </button>

                      <p className="text-center text-[10px] text-slate-500">
                        Güvenli 256-Bit SSL Kurucu Oturumu ile yetkilendirilir.
                      </p>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. 21ST.DEV TARZI NEON ÖZELLİK KARTLARI (SHOWCASE SECTION) */}
        {/* ========================================================================= */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800/80">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-black text-[#f27a1a] uppercase tracking-wider bg-[#f27a1a]/10 px-3 py-1 rounded-full border border-[#f27a1a]/20">
              ⚡ Hepsi Bir Arada E-Ticaret Ekosistemi
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
              Neden Binlerce Satıcı izeeg AI Kullanıyor?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Klasik entegrasyonlar sadece sipariş çeker. izeeg AI ise kâr kaçaklarını durdurur, kargo cezalarını yakalar ve 7/24 dükkanınızı büyütür.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Kart 1: 0 TL Varsayılmaz Gerçek Net Kâr */}
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
              <h3 className="text-base font-black text-white">7/24 Otonom AI Çalışanı v2.1</h3>
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
        {/* 4. FOOTER */}
        {/* ========================================================================= */}
        <footer className="mt-auto border-t border-slate-800/90 bg-[#05080f] py-8 px-4 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <IzeegLogo size="xs" variant="icon" />
              <span className="text-slate-300 font-bold">izeeg AI Platform</span>
              <span>• © 2026 Tüm Hakları Saklıdır.</span>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <button onClick={() => setActiveAuthTab('ADMIN')} className="hover:text-amber-300 text-amber-400/90 font-bold">
                👑 Kurucu Girişi
              </button>
              <button onClick={onExploreDemo} className="hover:text-white">
                Canlı Demo
              </button>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
