import React from 'react';
import { 
  Sparkles, 
  Store, 
  MessageSquareText, 
  Clock, 
  ShieldAlert, 
  Zap, 
  Layers, 
  Scale, 
  BellRing,
  CheckCircle2
} from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  selectedMarketplace, 
  setSelectedMarketplace, 
  onOpenAIModal, 
  onOpenSubModal,
  trialDaysLeft = 5,
  totalSavedMoney = 2450,
  unreadAlertsCount = 2
}) {
  return (
    <header className="sticky top-0 z-40 glass-header px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo ve Marka */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-pink-500 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                  Ecom<span className="text-brand-400">Pulse</span> <span className="text-xs bg-brand-500/20 text-brand-300 font-semibold px-2 py-0.5 rounded-full border border-brand-500/30">AI COPILOT</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Akıllı E-Ticaret Kâr & Kaçak Dedektörü</p>
            </div>
          </div>

          {/* Mobil İçin Hızlı AI Butonu */}
          <button 
            onClick={onOpenAIModal}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Sor
          </button>
        </div>

        {/* Ana Navigasyon Sekmeleri */}
        <nav className="flex items-center gap-1 bg-dark-card/90 p-1 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            Genel Panel
          </button>

          <button
            onClick={() => setActiveTab('cargo-audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap relative ${
              activeTab === 'cargo-audit'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Scale className="w-4 h-4" />
            Kargo & Kâr Simülatörü
            {unreadAlertsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'integrations'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Store className="w-4 h-4" />
            Pazar Yeri & Eklentiler
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-emerald-400 hover:bg-white/5'
            }`}
          >
            <BellRing className="w-4 h-4 text-emerald-400" />
            WhatsApp Bülteni
          </button>
        </nav>

        {/* Sağ Taraf: Pazar Yeri Filtresi + 7 Gün Deneme + AI Asistan Butonu */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Pazar Yeri Seçici */}
          <div className="relative">
            <select
              value={selectedMarketplace}
              onChange={(e) => setSelectedMarketplace(e.target.value)}
              className="bg-dark-card border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer appearance-none pr-8"
            >
              <option value="ALL">🌐 Tüm Mağazalar (Trendyol + HB)</option>
              <option value="Trendyol">🟠 Trendyol Mağazası</option>
              <option value="Hepsiburada">🟠 Hepsiburada Mağazası</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</span>
          </div>

          {/* 7 Günlük Deneme Rozeti */}
          <button
            onClick={onOpenSubModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-400 transition-all group"
            title="Abonelik ve Deneme Durumu"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
            <span><strong className="text-white">{trialDaysLeft} Gün</strong> Deneme</span>
          </button>

          {/* AI Çalışanı Butonu */}
          <button
            onClick={onOpenAIModal}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
            AI Danışmanına Sor
          </button>

        </div>

      </div>
    </header>
  );
}
