import React from 'react';
import { 
  Bell, 
  MessageSquare, 
  GraduationCap, 
  User, 
  Sparkles, 
  Layers, 
  ShoppingBag, 
  BarChart3, 
  Scale, 
  Store, 
  Smartphone, 
  Clock, 
  CheckCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export function TrendyolHeader({
  activeTab,
  setActiveTab,
  selectedMarketplace,
  setSelectedMarketplace,
  onOpenAIModal,
  onOpenSubModal,
  trialDaysLeft = 5,
  liveOrdersCount = 7
}) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      
      {/* 1. Üst Koyu Bar (Trendyol Pazaryeri Stili) */}
      <div className="bg-[#182230] text-slate-200 px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Sol: Logo ve Ana Menü Öğeleri */}
          <div className="flex items-center gap-6 overflow-x-auto">
            <div 
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => setActiveTab('orders')}
            >
              <span className="text-xl font-extrabold text-white tracking-tight">
                trendyol<span className="text-[#f27a1a] text-xs uppercase font-bold ml-1.5 px-1.5 py-0.5 bg-[#f27a1a]/20 rounded border border-[#f27a1a]/30">PRO AI</span>
              </span>
            </div>

            {/* Menü Başlıkları */}
            <nav className="hidden xl:flex items-center gap-5 text-[11px] font-bold tracking-wider text-slate-300">
              <button 
                onClick={() => setActiveTab('pro-table')}
                className={`hover:text-white uppercase transition-colors ${activeTab === 'pro-table' ? 'text-[#f27a1a]' : ''}`}
              >
                ÜRÜN & MALİYET
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`hover:text-white uppercase transition-colors flex items-center gap-1.5 ${activeTab === 'orders' ? 'text-[#f27a1a]' : ''}`}
              >
                <span>SİPARİŞ & KARGO</span>
                <span className="bg-[#f27a1a] text-white text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                  {liveOrdersCount}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('reports')}
                className={`hover:text-white uppercase transition-colors ${activeTab === 'reports' ? 'text-[#f27a1a]' : ''}`}
              >
                RAPORLAR
              </button>
              <button 
                onClick={() => setActiveTab('cargo-audit')}
                className={`hover:text-white uppercase transition-colors ${activeTab === 'cargo-audit' ? 'text-[#f27a1a]' : ''}`}
              >
                FİNANS & DESİ
              </button>
              <button 
                onClick={() => setActiveTab('integrations')}
                className={`hover:text-white uppercase transition-colors ${activeTab === 'integrations' ? 'text-[#f27a1a]' : ''}`}
              >
                PAZARYERİ & EKLENTİLER
              </button>
              <button 
                onClick={() => setActiveTab('whatsapp')}
                className={`hover:text-white uppercase transition-colors text-emerald-400 flex items-center gap-1 ${activeTab === 'whatsapp' ? 'text-emerald-300 font-black' : ''}`}
              >
                <span>WHATSAPP BOTU</span>
              </button>
            </nav>
          </div>

          {/* Sağ: İkonlar ve Mağaza Bilgisi */}
          <div className="flex items-center gap-4 text-slate-300 flex-shrink-0">
            
            {/* Pazar Yeri Filtresi */}
            <div className="relative">
              <select
                value={selectedMarketplace}
                onChange={(e) => setSelectedMarketplace(e.target.value)}
                className="bg-[#243242] border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:border-[#f27a1a] cursor-pointer appearance-none pr-7"
              >
                <option value="ALL">🌐 Tüm Pazaryerleri (Canlı)</option>
                <option value="Trendyol">🟠 Sadece Trendyol</option>
                <option value="Hepsiburada">🟠 Sadece Hepsiburada</option>
                <option value="Amazon TR">🟡 Sadece Amazon TR</option>
                <option value="N11">🔴 Sadece N11</option>
                <option value="Kendi Sitem (Shopify)">🟢 Sadece Kendi Sitem</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 7 Gün Deneme */}
            <button
              onClick={onOpenSubModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold hover:bg-amber-500/30 transition-all"
            >
              <Clock className="w-3 h-3" />
              <span>{trialDaysLeft} Gün Deneme</span>
            </button>

            {/* AI Danışman Butonu */}
            <button
              onClick={onOpenAIModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-[#f27a1a] to-pink-600 text-white text-xs font-extrabold shadow hover:opacity-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Asistan</span>
            </button>

            {/* Bildirim Çanı */}
            <div className="relative cursor-pointer hover:text-white" onClick={() => setActiveTab('cargo-audit')}>
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#f27a1a] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                3
              </span>
            </div>

            {/* Profil */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-bold text-white leading-tight">İsmet Bey</div>
                <div className="text-[10px] text-slate-400 leading-tight">Örnek Mağaza</div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. Alt Sekmeler Barı (Ekranlar Arası Hızlı Geçiş) */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto">
          
          <div className="flex items-center gap-1.5">
            
            {/* Sekme 1: TEK EKRANDAN CANLI SİPARİŞ MERKEZİ (EN ÖNEMLİSİ) */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-[#f27a1a] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Canlı Sipariş Takip Merkezi (Tüm Kanallar)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeTab === 'orders' ? 'bg-white text-[#f27a1a]' : 'bg-[#f27a1a]/10 text-[#f27a1a]'
              }`}>
                {liveOrdersCount}
              </span>
            </button>

            {/* Sekme 2: Trendyol PRO Panel & Maliyetler (Görsel 1 Stili) */}
            <button
              onClick={() => setActiveTab('pro-table')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'pro-table'
                  ? 'bg-[#f27a1a] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ana Tablo & Maliyetler (PRO Panel)</span>
            </button>

            {/* Sekme 3: Satış & Operasyon Raporları (Görsel 2 & 3 Stili) */}
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'reports'
                  ? 'bg-[#f27a1a] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Satış & Operasyon Raporları</span>
            </button>

            {/* Sekme 4: Kargo Desi & Kâr Simülatörü */}
            <button
              onClick={() => setActiveTab('cargo-audit')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'cargo-audit'
                  ? 'bg-[#f27a1a] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Kargo Desi İtirazı & Simülatör</span>
            </button>

            {/* Sekme 5: Pazaryeri Entegrasyonları */}
            <button
              onClick={() => setActiveTab('integrations')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'integrations'
                  ? 'bg-[#f27a1a] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Pazar Yeri & Eklentiler</span>
            </button>

            {/* Sekme 6: WhatsApp Bildirimleri */}
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Bülteni</span>
            </button>

          </div>

          <div className="text-xs text-slate-500 hidden lg:block whitespace-nowrap">
            Mağaza: <strong className="text-slate-800">Örnek Mağaza</strong>
          </div>

        </div>
      </div>

    </header>
  );
}
