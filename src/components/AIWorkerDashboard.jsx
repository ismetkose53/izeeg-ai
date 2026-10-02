import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Brain, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  History, 
  FileText, 
  HelpCircle, 
  Zap,
  DollarSign,
  Activity,
  Layers,
  Database,
  MessageSquare,
  Search,
  Send,
  Boxes,
  Scale,
  Percent,
  Megaphone,
  CheckCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { DATA_STATUS_BADGES } from '../services/mockData';
import { getAIEmployeeInsights } from '../services/aiAdvisorService';
import { getAuditLogs } from '../services/safetyAuditService';
import { RealNetProfitModule } from './RealNetProfitModule';
import { PageGuideButton } from './PageHelpGuideModal';

export function AIWorkerDashboard({ 
  products = [],
  orders = [],
  cargoLeaks = [],
  isDemoMode = false,
  onOpenGuide,
  onTriggerActionApproval, 
  onOpenAIChatModal, 
  onNavigateTab 
}) {
  const [activeSubTab, setActiveSubTab] = useState('all'); // 'all' | 'autopilot' | 'netprofit' | 'advisor' | 'audit'
  const [activeCaseFilter, setActiveCaseFilter] = useState('ALL'); // ALL | CRITICAL | WARNING | OPPORTUNITY
  const [customQuestion, setCustomQuestion] = useState('');
  const auditLogs = getAuditLogs();

  const rawCases = useMemo(() => {
    return getAIEmployeeInsights(products, orders, cargoLeaks);
  }, [products, orders, cargoLeaks]);

  const filteredCases = rawCases.filter(c => {
    if (activeCaseFilter === 'ALL') return true;
    return c.severity === activeCaseFilter;
  });

  const handleAskAI = (promptText) => {
    const textToSend = promptText || customQuestion;
    if (!textToSend.trim()) return;
    if (onOpenAIChatModal) {
      onOpenAIChatModal(textToSend.trim());
    }
    setCustomQuestion('');
  };

  const quickAdvisorPrompts = [
    {
      icon: DollarSign,
      color: 'emerald',
      title: 'Net Kâr & Kaçak Tespiti',
      prompt: 'Bugün mağazamda kâr kaçağı var mı? Hangi siparişlerde komisyon veya kargo kesintisi kârımı sıfırladı?'
    },
    {
      icon: MessageSquare,
      color: 'purple',
      title: 'Müşteri Soruları & Yorumlar',
      prompt: 'Pazar yerlerindeki bekleyen müşteri sorularını ve olumsuz yorumları analiz et, 1-tıkla en doğru yanıtları hazırla.'
    },
    {
      icon: Scale,
      color: 'amber',
      title: 'Kargo Desi İtirazları',
      prompt: 'Trendyol ve Hepsiburada kargo faturalarımda desi kaçağı veya fazla kesinti var mı? İtiraz dilekçesi oluştur.'
    },
    {
      icon: Zap,
      color: 'orange',
      title: 'Buybox & Fiyat Savaşçısı',
      prompt: 'Hangi ürünlerimde rakipler fiyat kırdı? Zarar etmeden Buybox kazanabileceğim minimum fiyat nedir?'
    },
    {
      icon: Boxes,
      color: 'blue',
      title: 'Stok & Tedarikçi Fişi (PO)',
      prompt: 'Önümüzdeki 7 günde stoğu bitecek ürünleri listele ve tedarikçime WhatsApptan atabileceğim sipariş fişi hazırla.'
    },
    {
      icon: Percent,
      color: 'rose',
      title: 'Komisyon & Barem Analizi',
      prompt: 'Hangi ürünlerimin fiyatı Trendyol Express komisyon veya kargo baremi sınırında kaldı? Fiyatı 5 TL artırarak kârımı nasıl yükseltirim?'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12 w-full max-w-full">
      
      {/* 1. Üst Başlık & AI Çalışanı Durum Kartı */}
      <div className="bg-gradient-to-r from-[#151e2a] via-[#1a2636] to-[#251b2e] rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white border border-slate-700 shadow-xl relative overflow-hidden">
        {/* Arka plan ışık efekti */}
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-[#f27a1a]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-2xl min-w-0 w-full">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black bg-gradient-to-r from-[#f27a1a] to-pink-600 text-white shadow-sm">
                <Brain className="w-3.5 h-3.5 flex-shrink-0" />
                <span>AI E-Ticaret Çalışanı & Danışmanı v2.2</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                <span>Canlı 7/24 İzleme Devrede</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Database className="w-3 h-3 flex-shrink-0" />
                <span>Pazaryeri API Doğrulaması</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white break-words">
              “İşletmemde ne oluyor, neden oluyor ve ne yapmalıyım?”
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              AI Çalışanınız ve Stratejik AI Danışmanınız; Trendyol, Hepsiburada ve Amazon'u saniye saniye denetler. Rakam uydurmaz, kâr kaçaklarını bulur ve onayınızla anında müdahale eder.
            </p>
          </div>

          {/* Hızlı AI Asistan Soru Çubuğu & Danışman Butonu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {onOpenGuide && (
              <PageGuideButton 
                onClick={onOpenGuide} 
                label="💡 Nasıl Çalışır?" 
                className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/20 text-amber-300 border-white/25 py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl text-xs font-bold" 
              />
            )}

            <button
              onClick={() => handleAskAI('Bugün işletmemde ne oldu, en kritik kâr kaçakları neler ve hangi acil aksiyonları almalıyım?')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#f27a1a] to-pink-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200 flex-shrink-0" />
              <span>💬 AI Danışmana Soru Sor</span>
            </button>

            <button
              onClick={() => onNavigateTab('integrations')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>API Durumu</span>
            </button>
          </div>
        </div>

        {/* Gerçek Veri Prensibi Bildirimi */}
        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span><strong>Gerçek Veri Prensibi:</strong> Sistem hiçbir rakamı uydurmaz. Veri yoksa 'Veri Yok', hata varsa 'Senkronizasyon Yapılamadı' denir.</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold flex-shrink-0">
            <Zap className="w-3.5 h-3.5" />
            <span>{rawCases.length > 0 ? `Onay Bekleyen ${rawCases.length} Kritik AI Aksiyonu` : 'Sistem İzlemede (0 Kritik Kaçak)'}</span>
          </div>
        </div>
      </div>

      {/* 2. İÇ ALT SEKME (SUB-TABS) NAVİGASYONU */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 p-1.5 rounded-2xl text-xs font-bold w-full">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'all' 
              ? 'bg-[#151e2a] text-white shadow-md' 
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Brain className="w-4 h-4 text-orange-400" />
          <span>Tüm AI Çalışanı Görünümü</span>
        </button>

        <button
          onClick={() => setActiveSubTab('netprofit')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'netprofit' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>💰 Gerçek Net Kâr Analizi</span>
        </button>

        <button
          onClick={() => setActiveSubTab('advisor')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'advisor' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>💬 AI Danışman Masası</span>
        </button>

        <button
          onClick={() => setActiveSubTab('autopilot')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'autopilot' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>⚡ AI Karar & Aksiyonlar ({rawCases.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'audit' 
              ? 'bg-slate-800 text-white shadow-md' 
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <History className="w-4 h-4 text-cyan-400" />
          <span>🛡️ Denetim Kayıtları ({auditLogs.length})</span>
        </button>
      </div>

      {/* 3. AI DANIŞMAN MASASI (INTERACTIVE ADVISOR HUB) */}
      {(activeSubTab === 'all' || activeSubTab === 'advisor') && (
        <div className="bg-gradient-to-br from-[#16202c] via-[#1a2636] to-[#1e1e38] border border-slate-700 rounded-3xl p-5 sm:p-7 text-white shadow-xl space-y-5">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f27a1a] to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>AI E-Ticaret Danışmanı</span>
                  <span className="text-[10px] bg-purple-500/30 text-purple-300 border border-purple-400/40 px-2 py-0.5 rounded-full font-bold">
                    GPT-4o Stratejist
                  </span>
                </h2>
                <p className="text-xs text-slate-300">
                  Mağazanızın gerçek pazar yeri verilerine dayalı stratejik sorular sorun veya hazır analiz çiplerine tıklayın.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleAskAI('İşletmem için haftalık büyüme ve kâr artırma yol haritası çıkar.')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow cursor-pointer self-start md:self-auto"
            >
              🚀 Haftalık Strateji Raporu İste
            </button>
          </div>

          {/* Soru Sorma Giriş Alanı */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAI();
            }}
            className="relative flex items-center"
          >
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Örn: Bugün hangi ürünlerimde desi kaçağı veya komisyon zararı var? Ne yapmalıyım?"
              className="w-full bg-[#0f172a]/90 border border-slate-600 focus:border-[#f27a1a] rounded-2xl py-3.5 pl-12 pr-28 text-xs font-medium text-white placeholder:text-slate-400 outline-none transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!customQuestion.trim()}
              className={`absolute right-2 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                customQuestion.trim()
                  ? 'bg-gradient-to-r from-[#f27a1a] to-pink-600 text-white hover:opacity-95 shadow-md cursor-pointer'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Sor</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Hazır AI Danışman İstemi Çipleri */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              💡 Hızlı Danışman Analizleri (1 Tıkla Başlat):
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {quickAdvisorPrompts.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskAI(item.prompt)}
                    className="p-3 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-left transition-all group cursor-pointer flex items-start gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-xl bg-slate-700/80 group-hover:bg-[#f27a1a] text-amber-300 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.prompt}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 4. GERÇEK VERİYE DAYALI NET KÂR MODÜLÜ */}
      {(activeSubTab === 'all' || activeSubTab === 'netprofit') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Gerçek Net Kâr Analizi & Finansal Röntgen</span>
            </h2>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Detaylı Raporları Aç</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <RealNetProfitModule
            products={products}
            orders={orders}
            onOpenGuide={onOpenGuide}
            onNavigateToReturns={() => onNavigateTab('returns')}
            onNavigateToAds={() => onNavigateTab('ads')}
            onNavigateToProTable={() => onNavigateTab('pro-table')}
            onNavigateToInvoices={() => onNavigateTab('invoices')}
          />
        </div>
      )}

      {/* 5. 4-SORULU AI ÇALIŞAN KARAR KARTLARI (OTOPİLOT) */}
      {(activeSubTab === 'all' || activeSubTab === 'autopilot') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#f27a1a]" />
                AI Çalışanı 4-Sorulu Karar & Aksiyon Merkezi
              </h2>
              <p className="text-xs text-slate-500">
                Her analiz 4 temel soruya net yanıt verir: Ne oldu? Neden oldu? Finansal etkisi ne? Ne yapılabilir?
              </p>
            </div>

            {/* Filtre Butonları */}
            <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
              <button
                onClick={() => setActiveCaseFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                  activeCaseFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tümü ({rawCases.length})
              </button>
              <button
                onClick={() => setActiveCaseFilter('CRITICAL')}
                className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                  activeCaseFilter === 'CRITICAL' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Kritik
              </button>
              <button
                onClick={() => setActiveCaseFilter('WARNING')}
                className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                  activeCaseFilter === 'WARNING' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Uyarılar
              </button>
              <button
                onClick={() => setActiveCaseFilter('OPPORTUNITY')}
                className={`px-3 py-1.5 rounded-lg transition-all text-center ${
                  activeCaseFilter === 'OPPORTUNITY' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Fırsatlar
              </button>
            </div>
          </div>

          {/* 4 Soru Kartları Listesi */}
          {rawCases.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-slate-900">
                  🟢 AI E-Ticaret Çalışanı Canlı İzlemede (0 Kritik Kaçak)
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mağazanız canlı satış moduna alınmıştır. Trendyol, Hepsiburada veya Amazon'dan sipariş ve ürün verileriniz akmaya başladığında; komisyon uyuşmazlığı, haksız desi kesintisi ve fiyat optimizasyonları saniye saniye burada listelenecektir.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => onNavigateTab('integrations')}
                    className="px-4 py-2 rounded-xl bg-[#151e2a] hover:bg-slate-900 text-white font-bold text-xs shadow transition-all cursor-pointer"
                  >
                    🔗 API Bağlantılarını Gör
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-5">
              {filteredCases.map(item => (
                <div 
                  key={item.id} 
                  className={`bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm transition-all hover:shadow-md ${
                    item.severity === 'CRITICAL' 
                      ? 'border-rose-300 ring-1 ring-rose-200' 
                      : item.severity === 'WARNING'
                      ? 'border-amber-300'
                      : 'border-blue-300'
                  }`}
                >
                  
                  {/* Kart Üst Başlık & Etiketler */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                        item.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : item.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {item.badgeText || item.badge || 'AI Tespiti'}
                      </span>

                      <span className="text-xs font-bold text-slate-500">
                        {item.marketplace || 'Çok Kanallı'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.id}
                    </div>
                  </div>

                  {/* Ana Vaka Başlığı */}
                  <h3 className="text-base font-black text-slate-900 mt-3 mb-4">
                    {item.title}
                  </h3>

                  {/* 4 Soru Grid'i */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* 1. Ne Oldu? */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 mb-2 uppercase tracking-wide">
                          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] font-bold">1</span>
                          Ne Oldu?
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {item.q1_whatHappened}
                        </p>
                      </div>
                      <div className="mt-3 text-[10px] text-slate-400 font-semibold">
                        Durum Tespiti
                      </div>
                    </div>

                    {/* 2. Neden Oldu? */}
                    <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 mb-2 uppercase tracking-wide">
                          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[11px] font-bold">2</span>
                          Neden Oldu?
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                          {item.q2_whyHappened}
                        </p>
                      </div>
                      <div className="mt-3 text-[10px] text-amber-700 font-semibold">
                        Kök Neden Korelasyonu
                      </div>
                    </div>

                    {/* 3. Finansal Etkisi Ne? */}
                    <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-200/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-rose-900 mb-2 uppercase tracking-wide">
                          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-900 flex items-center justify-center text-[11px] font-bold">3</span>
                          Finansal Etkisi Ne?
                        </div>
                        <p className="text-xs text-rose-900 leading-relaxed font-bold">
                          {item.q3_financialImpact}
                        </p>
                      </div>
                      <div className="mt-3 text-[10px] text-rose-700 font-semibold">
                        Net Nakit Kaybı / Fırsat
                      </div>
                    </div>

                    {/* 4. Ne Yapılabilir? + Onay Butonu */}
                    <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 mb-2 uppercase tracking-wide">
                          <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-[11px] font-bold">4</span>
                          Ne Yapılabilir?
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-medium mb-3">
                          {item.q4_whatCanBeDone || item.q4_whatToDo}
                        </p>
                      </div>

                      {/* Güvenlik Kapısı Aksiyon Butonu */}
                      <button
                        onClick={() => {
                          if (item.actionTab && onNavigateTab) {
                            onNavigateTab(item.actionTab);
                          } else if (onTriggerActionApproval) {
                            onTriggerActionApproval(item);
                          }
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-[#f27a1a] text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5 group cursor-pointer"
                      >
                        <span>{item.actionLabel || item.action?.label || 'Aksiyonu İncele'}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Güvenlik Denetim Kayıtları (Audit Logs Tablosu) */}
      {(activeSubTab === 'all' || activeSubTab === 'audit') && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Güvenlik & Onay Geçmişi (Audit Logs)
                </h3>
                <p className="text-xs text-slate-500">
                  AI Çalışanı tarafından önerilen ve sizin tarafınızdan onaylanarak hayata geçirilen tüm işlemlerin resmi kayıtları.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Kayıt Sayısı: {auditLogs.length}
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-3 px-3">Tarih & Saat</th>
                  <th className="py-3 px-3">İşlem & Açıklama</th>
                  <th className="py-3 px-3">Hedef Ürün / Kanal</th>
                  <th className="py-3 px-3">Eski Değer ➔ Yeni Değer</th>
                  <th className="py-3 px-3">Finansal Etki</th>
                  <th className="py-3 px-3 text-center">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3">
                      <strong className="text-slate-900 block font-bold">{log.actionTitle}</strong>
                      <span className="text-[10px] text-slate-400">{log.source}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      <div>{log.target}</div>
                      <span className="text-[10px] text-slate-400">{log.marketplace}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-800">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-rose-600 line-through">{log.oldValue}</span>
                        <span>➔</span>
                        <span className="text-emerald-700 font-bold">{log.newValue}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      {log.estimatedImpact}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Uygulandı
                      </span>
                    </td>
                  </tr>
                ))}

                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      Henüz onaylanmış aksiyon veya denetim kaydı bulunmuyor.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default AIWorkerDashboard;
