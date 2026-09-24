import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  User, 
  Sparkles, 
  ShoppingBag, 
  BarChart3, 
  Scale, 
  Store, 
  Smartphone, 
  Clock, 
  ChevronDown, 
  Layers, 
  RotateCcw, 
  Megaphone, 
  Link2, 
  Brain, 
  ShieldCheck, 
  Building2, 
  FileText, 
  DollarSign, 
  Menu, 
  X,
  PackageCheck,
  TrendingUp,
  Key,
  Bot,
  MessageSquare,
  Boxes,
  Zap,
  Globe
} from 'lucide-react';
import { IzeegLogo } from './IzeegLogo';

export function AppHeader({
  activeTab,
  setActiveTab,
  selectedMarketplace,
  setSelectedMarketplace,
  onOpenAIModal,
  onOpenSubModal,
  onOpenAuthModal,
  onOpenNotifications,
  onOpenPitchDeck,
  currentUser = { role: 'merchant', storeName: 'yumey', ownerName: 'İsmet Bey', trialDaysLeft: 5 },
  trialDaysLeft = 5,
  liveOrdersCount = 6,
  unreadNotificationsCount = 3,
  pendingActionsCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'operation' | 'warehouse' | 'finance' | 'integrations' | null
  const headerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const isOperationActive = ['invoices', 'cargo-audit', 'returns', 'customer-questions'].includes(activeTab);
  const isOmnichannelActive = ['omnichannel-products', 'product-mapping', 'supplier-reorder', 'warehouse'].includes(activeTab);
  const isFinanceActive = ['pro-table', 'repricer', 'reports', 'ads'].includes(activeTab);
  const isIntegrationsActive = ['integrations', 'whatsapp'].includes(activeTab);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-[#121924] text-slate-200 border-b border-slate-700/80 shadow-xl w-full font-sans select-none">
      
      {/* Ana Header Bar - Dengeli, Kusursuz Hizalı ve Taşmasız */}
      <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-5 flex items-center justify-between gap-2 h-16">
        
        {/* Sol: Orijinal izeeg AI Logosu */}
        <div 
          className="flex items-center cursor-pointer flex-shrink-0 hover:opacity-95 transition-opacity pr-1"
          onClick={() => handleSelectTab('ai-worker')}
          title="izeeg AI - Ana Sayfa"
        >
          <IzeegLogo size="sm" variant="full" theme="dark" showBadge={true} badgeText="AI" />
        </div>

        {/* Orta: Tam Ortalanmış 7 Ana Sekme */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 text-xs font-bold text-slate-300 flex-1 mx-1">
          
          {/* 1. AI ÇALIŞANI */}
          <button
            onClick={() => handleSelectTab('ai-worker')}
            className={`h-9 px-2.5 xl:px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap text-xs font-bold cursor-pointer ${
              activeTab === 'ai-worker'
                ? 'bg-[#f27a1a] text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Brain className={`w-4 h-4 ${activeTab === 'ai-worker' ? 'text-white' : 'text-orange-400'}`} />
            <span>AI Çalışanı</span>
          </button>

          {/* 2. GERÇEK NET KÂR */}
          <button
            onClick={() => handleSelectTab('net-profit')}
            className={`h-9 px-2.5 xl:px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap text-xs font-bold cursor-pointer ${
              activeTab === 'net-profit'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className={`w-4 h-4 ${activeTab === 'net-profit' ? 'text-white' : 'text-emerald-400'}`} />
            <span>Net Kâr</span>
          </button>

          {/* 3. SİPARİŞLER */}
          <button
            onClick={() => handleSelectTab('orders')}
            className={`h-9 px-3 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap text-xs font-bold cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-blue-400'}`} />
            <span>Siparişler</span>
            <span className="bg-[#f27a1a] text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {liveOrdersCount}
            </span>
          </button>

          {/* 4. ÇOK KANALLI ÜRÜN & DAĞITIM DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('omnichannel')}
              className={`h-9 px-2.5 xl:px-3 rounded-xl flex items-center gap-1.5 transition-all text-xs font-bold whitespace-nowrap cursor-pointer ${
                isOmnichannelActive
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className={`w-4 h-4 ${isOmnichannelActive ? 'text-white' : 'text-orange-400'}`} />
              <span>Ürün & Dağıtım</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${openDropdown === 'omnichannel' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'omnichannel' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#16202c] border border-slate-700 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 animate-scaleUp text-xs font-bold">
                <button
                  onClick={() => handleSelectTab('omnichannel-products')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'omnichannel-products' ? 'bg-[#f27a1a] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="block font-black">Tek Tıkla Ürün Yükle & Dağıt</span>
                    <span className="text-[10px] text-orange-200 font-medium">Trendyol, HB, Amazon, Web Siten</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab('supplier-reorder')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'supplier-reorder' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Boxes className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="block">Stok Tahmini & Sipariş Fişi (PO)</span>
                    <span className="text-[10px] text-emerald-300 font-medium">WhatsApp Tedarikçi Fişi</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab('product-mapping')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'product-mapping' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Link2 className="w-4 h-4 text-[#f27a1a] flex-shrink-0" />
                  <div className="flex-1">
                    <span className="block">Ürün & SKU Eşleştirme</span>
                    <span className="text-[10px] text-slate-400 font-medium">Çoklu Barkod Bağlama</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 5. OPERASYON DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('operation')}
              className={`h-9 px-2.5 xl:px-3 rounded-xl flex items-center gap-1.5 transition-all text-xs font-bold whitespace-nowrap cursor-pointer ${
                isOperationActive
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className={`w-4 h-4 ${isOperationActive ? 'text-white' : 'text-amber-400'}`} />
              <span>Operasyon</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${openDropdown === 'operation' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'operation' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#16202c] border border-slate-700 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 animate-scaleUp text-xs font-bold">
                <button
                  onClick={() => handleSelectTab('invoices')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'invoices' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>E-Fatura & Yazdırma</span>
                </button>

                <button
                  onClick={() => handleSelectTab('cargo-audit')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'cargo-audit' ? 'bg-[#f27a1a] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>Kargo Kaçağı & Desi İtiraz</span>
                </button>

                <button
                  onClick={() => handleSelectTab('returns')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'returns' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span>İade & Değişim Yönetimi</span>
                </button>

                <button
                  onClick={() => handleSelectTab('customer-questions')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'customer-questions' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <div className="flex-1">
                    <span className="block">Müşteri Soruları & Yorum AI</span>
                    <span className="text-[10px] text-purple-300 font-medium">1-Tık Otomatik Yanıt</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 6. FİNANS & FİYAT DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('finance')}
              className={`h-9 px-2.5 xl:px-3 rounded-xl flex items-center gap-1.5 transition-all text-xs font-bold whitespace-nowrap cursor-pointer ${
                isFinanceActive
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${isFinanceActive ? 'text-white' : 'text-teal-400'}`} />
              <span>Finans & Fiyat</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${openDropdown === 'finance' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'finance' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-[#16202c] border border-slate-700 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 animate-scaleUp text-xs font-bold">
                <button
                  onClick={() => handleSelectTab('repricer')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'repricer' ? 'bg-[#f27a1a] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <div className="flex-1">
                    <span className="block">Otomatik Buybox & Repricer</span>
                    <span className="text-[10px] text-amber-300 font-medium">Zarar Korumalı Fiyat Savaşçısı</span>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectTab('pro-table')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'pro-table' ? 'bg-[#f27a1a] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-orange-400" />
                  <span>Kâr & Maliyet Simülatörü</span>
                </button>

                <button
                  onClick={() => handleSelectTab('reports')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'reports' ? 'bg-[#f27a1a] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span>Satış & Operasyon Raporları</span>
                </button>

                <button
                  onClick={() => handleSelectTab('ads')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'ads' ? 'bg-[#f27a1a] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-purple-400" />
                  <span>Reklam Performansı & ROAS</span>
                </button>
              </div>
            )}
          </div>

          {/* 7. ENTEGRASYONLAR DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('integrations')}
              className={`h-9 px-2.5 xl:px-3 rounded-xl flex items-center gap-1.5 transition-all text-xs font-bold whitespace-nowrap cursor-pointer ${
                isIntegrationsActive
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Store className={`w-4 h-4 ${isIntegrationsActive ? 'text-white' : 'text-pink-400'}`} />
              <span>Entegrasyonlar</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${openDropdown === 'integrations' ? 'rotate-180' : ''}`} />
            </button>

            {openDropdown === 'integrations' && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-[#16202c] border border-slate-700 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 animate-scaleUp text-xs font-bold">
                <button
                  onClick={() => handleSelectTab('integrations')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'integrations' ? 'bg-[#f27a1a] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Store className="w-4 h-4 text-orange-400" />
                  <span>Pazaryeri API Bağlantıları</span>
                </button>

                <button
                  onClick={() => handleSelectTab('whatsapp')}
                  className={`w-full p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Yönetici Botu</span>
                </button>
              </div>
            )}
          </div>

        </nav>

        {/* Sağ Taraf: Kompakt & Asla Taşmayan Kontrol Paneli */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* Canlı Bildirim Zili */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-xl bg-[#1c2736] hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 transition-all cursor-pointer shadow-sm flex-shrink-0"
            title="Canlı Bildirim Merkezi (Yeni Sipariş & Kâr Alarmları)"
          >
            <Bell className="w-4 h-4 text-amber-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#f27a1a] text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-md shadow-orange-500/50">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Pazar Yeri Seçici (Kompakt) */}
          <div className="relative hidden md:block">
            <select
              value={selectedMarketplace}
              onChange={(e) => setSelectedMarketplace(e.target.value)}
              className="h-9 bg-[#1c2736] border border-slate-600 rounded-xl px-2.5 text-xs font-bold text-white focus:outline-none focus:border-[#f27a1a] cursor-pointer appearance-none pr-7 shadow-sm max-w-[135px]"
            >
              <option value="ALL">🌐 Tüm Kanallar</option>
              <option value="Trendyol">🟠 Trendyol</option>
              <option value="Hepsiburada">🟠 Hepsiburada</option>
              <option value="Amazon TR">🟡 Amazon</option>
              <option value="Kendi Sitem (Shopify)">🟢 Web Sitem</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* AI Asistan Butonu */}
          <button
            onClick={onOpenAIModal}
            className="h-9 w-9 sm:w-auto flex items-center justify-center gap-1.5 px-0 sm:px-3 rounded-xl bg-gradient-to-r from-[#f27a1a] to-pink-600 text-white text-xs font-black shadow-md shadow-orange-500/20 hover:opacity-95 transition-all cursor-pointer flex-shrink-0"
            title="AI Danışman"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">AI Danışman</span>
          </button>

          {/* Profil & Hesap Dropdown Menüsü (Masaüstü/Tablet İçin - Mobilde Menü İçinde) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => toggleDropdown('user_menu')}
              className="h-9 flex items-center gap-2 pl-2 pr-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] font-black ${
                currentUser.role === 'admin' 
                  ? 'bg-amber-500 text-slate-900 shadow' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow'
              }`}>
                {currentUser.role === 'admin' ? '👑' : 'M'}
              </div>
              <div className="text-left hidden xl:block">
                <span className="text-xs font-bold text-white block truncate max-w-[90px] leading-tight">
                  {currentUser.storeName || 'yumey'}
                </span>
              </div>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${openDropdown === 'user_menu' ? 'rotate-180' : ''}`} />
            </button>

            {/* Profil Açılır Menüsü */}
            {openDropdown === 'user_menu' && (
              <div className="absolute top-full right-0 mt-2 w-60 bg-[#16202c] border border-slate-700 rounded-2xl shadow-2xl p-2 space-y-1 z-50 animate-scaleUp text-xs font-bold">
                
                {/* Kullanıcı Kartı */}
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 mb-2">
                  <div className="text-xs font-black text-white flex items-center justify-between">
                    <span>{currentUser.storeName || 'yumey concept'}</span>
                    <span className="text-[10px] text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                      {currentUser.role === 'admin' ? '👑 Kurucu Admin' : 'Satıcı Hesabı'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{currentUser.ownerName || 'İsmet Bey'}</span>
                </div>

                {/* Kurucu Yönetim Butonu */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleSelectTab('admin-panel')}
                    className="w-full p-2 rounded-xl flex items-center gap-2 text-left bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>👑 Süper Admin Paneli</span>
                  </button>
                )}

                {/* Tanıtım & Pitch Deck */}
                <button
                  onClick={() => handleSelectTab('pitch-deck')}
                  className={`w-full p-2 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                    activeTab === 'pitch-deck' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Tanıtım & Pitch Deck Sayfası</span>
                </button>

                {/* 5 Gün Deneme / Abonelik */}
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    onOpenSubModal();
                  }}
                  className="w-full p-2 rounded-xl flex items-center justify-between text-left text-amber-300 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Abonelik Durumu</span>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                    {trialDaysLeft} Gün Kaldı
                  </span>
                </button>

                {/* Giriş / Çıkış / Hesap Ayarları */}
                <button
                  onClick={() => {
                    setOpenDropdown(null);
                    onOpenAuthModal();
                  }}
                  className="w-full p-2 rounded-xl flex items-center gap-2 text-left text-slate-300 hover:bg-slate-800 hover:text-white border-t border-slate-700/80 pt-2 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Hesap & Mağaza Ayarları</span>
                </button>

              </div>
            )}
          </div>

          {/* Mobil Menü Butonu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobil Açılır Menü */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#151e2a] border-t border-slate-700 p-4 space-y-2 animate-fadeIn max-h-[80vh] overflow-y-auto text-xs font-bold">
          
          {/* Mobil Kullanıcı & Mağaza Kartı */}
          <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black ${
                currentUser.role === 'admin' ? 'bg-amber-500 text-slate-900 shadow' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow'
              }`}>
                {currentUser.role === 'admin' ? '👑' : 'M'}
              </div>
              <div>
                <span className="text-xs font-black text-white block">{currentUser.storeName || 'yumey concept'}</span>
                <span className="text-[10px] text-slate-400 font-medium">{currentUser.ownerName || 'İsmet Bey'}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold transition-all"
            >
              Ayarlar
            </button>
          </div>

          <button
            onClick={() => handleSelectTab('ai-worker')}
            className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between ${
              activeTab === 'ai-worker' ? 'bg-[#f27a1a] text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2"><Brain className="w-4 h-4 text-orange-400" /><span>AI Çalışanı</span></div>
          </button>

          <button
            onClick={() => handleSelectTab('net-profit')}
            className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between ${
              activeTab === 'net-profit' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-400" /><span>Net Kâr</span></div>
          </button>

          <button
            onClick={() => handleSelectTab('orders')}
            className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between ${
              activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-blue-400" /><span>Siparişler</span></div>
            <span className="bg-[#f27a1a] px-1.5 py-0.2 rounded-full text-[10px]">{liveOrdersCount}</span>
          </button>

          <div className="pt-2 border-t border-slate-700 space-y-1">
            <button onClick={() => handleSelectTab('pitch-deck')} className="w-full px-3 py-2 text-purple-300 hover:bg-slate-800 rounded-lg flex items-center gap-2 font-bold bg-purple-900/30 border border-purple-700/50">
              <Sparkles className="w-4 h-4 text-purple-400" /> 📊 Tanıtım & Pitch Deck
            </button>
            <button onClick={() => handleSelectTab('omnichannel-products')} className="w-full px-3 py-2 text-orange-400 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" /> 🚀 Çok Kanallı Ürün Yükle & Dağıt
            </button>
            <button onClick={() => handleSelectTab('repricer')} className="w-full px-3 py-2 text-amber-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> ⚡ Otomatik Buybox Repricer
            </button>
            <button onClick={() => handleSelectTab('supplier-reorder')} className="w-full px-3 py-2 text-emerald-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-400" /> 📦 Stok Tahmini & Tedarik PO Fişi
            </button>
            <button onClick={() => handleSelectTab('invoices')} className="w-full px-3 py-2 text-emerald-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" /> 📄 E-Fatura & Barkod Yazdırma
            </button>
            <button onClick={() => handleSelectTab('cargo-audit')} className="w-full px-3 py-2 text-amber-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" /> ⚖️ Kargo Kaçağı & Desi İtiraz
            </button>
            <button onClick={() => handleSelectTab('returns')} className="w-full px-3 py-2 text-rose-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-400" /> 🔄 İade & Çift Kargo Motoru
            </button>
            <button onClick={() => handleSelectTab('customer-questions')} className="w-full px-3 py-2 text-purple-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" /> 💬 Müşteri Soruları GPT-4o
            </button>
            <button onClick={() => handleSelectTab('product-mapping')} className="w-full px-3 py-2 text-indigo-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <Link2 className="w-4 h-4 text-indigo-400" /> 🔗 Ürün & SKU Eşleştirme
            </button>
            <button onClick={() => handleSelectTab('pro-table')} className="w-full px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" /> 🧮 Kâr & Fiyat Simülatörü
            </button>
            <button onClick={() => handleSelectTab('reports')} className="w-full px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" /> 📈 Satış & Operasyon Raporları
            </button>
            <button onClick={() => handleSelectTab('integrations')} className="w-full px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <Store className="w-4 h-4 text-pink-400" /> 🔌 Pazaryeri API Entegrasyonları
            </button>
            <button onClick={() => handleSelectTab('whatsapp')} className="w-full px-3 py-2 text-emerald-300 hover:bg-slate-800 rounded-lg flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" /> 📱 WhatsApp Yönetici Bülteni
            </button>
          </div>
        </div>
      )}

    </header>
  );
}

export default AppHeader;
