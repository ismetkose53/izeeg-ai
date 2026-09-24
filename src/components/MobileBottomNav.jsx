import React, { useState } from 'react';
import { 
  Brain, 
  ShoppingBag, 
  PlusCircle, 
  DollarSign, 
  Layers, 
  X, 
  Zap, 
  Boxes, 
  Scale, 
  FileText, 
  RotateCcw, 
  MessageSquare, 
  Globe, 
  Sparkles, 
  Store, 
  Smartphone, 
  BarChart3, 
  Key, 
  Menu,
  ChevronRight,
  PhoneCall,
  Lock,
  LogOut
} from 'lucide-react';

export function MobileBottomNav({ 
  activeTab, 
  setActiveTab, 
  liveOrdersCount = 8,
  currentUser = { role: 'merchant', storeName: 'yumey' },
  onOpenContactModal,
  onOpenSubModal,
  onLogout,
  onOpenPortal
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelect = (tabId) => {
    setActiveTab(tabId);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* 1. SABİT MOBİL ALT MENÜ BARI (NATIVE APP DENEYİMİ) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111827]/95 backdrop-blur-xl border-t border-slate-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] select-none safe-area-pb">
        <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around text-[10px] font-bold">
          
          {/* AI ÇALIŞANI (ANA SAYFA) */}
          <button
            onClick={() => handleSelect('ai-worker')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'ai-worker'
                ? 'text-[#f27a1a] scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className={`w-5 h-5 ${activeTab === 'ai-worker' ? 'text-[#f27a1a]' : 'text-slate-400'}`} />
            <span>AI İşçi</span>
          </button>

          {/* SİPARİŞLER (CANLI BADGE İLE) */}
          <button
            onClick={() => handleSelect('orders')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'orders'
                ? 'text-blue-400 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <ShoppingBag className={`w-5 h-5 ${activeTab === 'orders' ? 'text-blue-400' : 'text-slate-400'}`} />
              {liveOrdersCount > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 rounded-full bg-[#f27a1a] text-white text-[9px] font-black min-w-[14px] text-center">
                  {liveOrdersCount}
                </span>
              )}
            </div>
            <span>Siparişler</span>
          </button>

          {/* ORTA: ÇOK KANALLI ÜRÜN YÜKLE (ÖNE ÇIKAN AKSIYON BUTONU) */}
          <button
            onClick={() => handleSelect('omnichannel-products')}
            className="flex flex-col items-center -mt-4 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${
              activeTab === 'omnichannel-products'
                ? 'bg-gradient-to-tr from-[#f27a1a] via-orange-500 to-amber-400 ring-4 ring-orange-500/20 shadow-orange-500/40'
                : 'bg-gradient-to-tr from-[#f27a1a] to-orange-600 shadow-orange-600/30'
            }`}>
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className={`text-[10px] font-black mt-0.5 ${
              activeTab === 'omnichannel-products' ? 'text-[#f27a1a]' : 'text-slate-300'
            }`}>
              Ürün Ekle
            </span>
          </button>

          {/* GERÇEK NET KÂR */}
          <button
            onClick={() => handleSelect('net-profit')}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'net-profit'
                ? 'text-emerald-400 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className={`w-5 h-5 ${activeTab === 'net-profit' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Net Kâr</span>
          </button>

          {/* TÜM MENÜ & MODÜLLER (DRAWER) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
              drawerOpen
                ? 'text-purple-400 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span>Tüm Menü</span>
          </button>

        </div>
      </nav>

      {/* 2. MOBİL TÜM MODÜLLER ÇEKMECESİ (SLIDE-UP DRAWER) */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn select-none">
          <div 
            className="flex-1" 
            onClick={() => setDrawerOpen(false)}
          />

          <div className="bg-[#121924] border-t border-slate-800 rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl animate-scaleUp overflow-hidden">
            
            {/* Çekmece Başlığı */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#16202c]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#f27a1a] text-white flex items-center justify-center font-black text-xs">
                  iz
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">izeeg AI Tüm Modüller</h3>
                  <span className="text-[10px] text-slate-400">{currentUser.storeName || 'yumey concept'}</span>
                </div>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modül Listesi (Scrollable) */}
            <div className="p-4 overflow-y-auto space-y-2 text-xs font-bold divide-y divide-slate-800/60 flex-1">
              
              {/* Grup 1: Ana & Pazarlama */}
              <div className="space-y-1 pb-2">
                <button
                  onClick={() => handleSelect('pitch-deck')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'pitch-deck' ? 'bg-purple-600 text-white' : 'bg-purple-950/30 text-purple-300 border border-purple-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>📊 Ürün Sunumu & Pitch Deck</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </div>

              {/* Grup 2: Operasyon & Otomasyon */}
              <div className="space-y-1 py-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block px-1 mb-1">
                  Operasyon & Kargo
                </span>

                <button
                  onClick={() => handleSelect('repricer')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'repricer' ? 'bg-[#f27a1a] text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>⚡ Otomatik Buybox Repricer</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => handleSelect('supplier-reorder')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'supplier-reorder' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Boxes className="w-4 h-4 text-emerald-400" />
                    <span>📦 Stok Tahmini & PO Fişi</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => handleSelect('cargo-audit')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'cargo-audit' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>⚖️ Kargo Kaçağı & Desi İtiraz</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => handleSelect('invoices')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'invoices' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>📄 E-Fatura & Barkod Merkezi</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => handleSelect('returns')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'returns' ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <RotateCcw className="w-4 h-4 text-rose-400" />
                    <span>🔄 İade & Çift Kargo Motoru</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => handleSelect('customer-questions')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'customer-questions' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>💬 Müşteri Soruları AI</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              </div>

              {/* Grup 3: Finans & Bağlantılar */}
              <div className="space-y-1 py-2">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block px-1 mb-1">
                  Finans & Entegrasyon
                </span>

                <button
                  onClick={() => handleSelect('pro-table')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'pro-table' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-orange-400" />
                    <span>🧮 Pro Kâr & Fiyat Simülatörü</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => handleSelect('integrations')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'integrations' ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Store className="w-4 h-4 text-pink-400" />
                    <span>🔗 Pazaryeri API Entegrasyonları</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <button
                  onClick={() => handleSelect('whatsapp')}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all ${
                    activeTab === 'whatsapp' ? 'bg-emerald-700 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>📱 WhatsApp Yönetici Bülteni</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleSelect('admin-panel')}
                    className="w-full p-2.5 rounded-xl flex items-center justify-between text-left bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  >
                    <div className="flex items-center gap-2.5">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>👑 Süper Admin Paneli</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                )}
              </div>

            </div>

            {/* Çekmece Altı Destek, Giriş Paneli & Çıkış */}
            <div className="p-4 bg-[#16202c] border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenContactModal) onOpenContactModal();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Canlı Destek</span>
                </button>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenSubModal) onOpenSubModal();
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#f27a1a] hover:bg-orange-600 text-white text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>7 Gün Deneme</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenPortal) onOpenPortal();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Giriş Paneli</span>
                </button>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-black flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default MobileBottomNav;
