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
  Database
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
  const [activeCaseFilter, setActiveCaseFilter] = useState('ALL'); // ALL | CRITICAL | WARNING | OPPORTUNITY
  const auditLogs = getAuditLogs();

  const rawCases = useMemo(() => {
    return getAIEmployeeInsights(products, orders, cargoLeaks);
  }, [products, orders, cargoLeaks]);

  const filteredCases = rawCases.filter(c => {
    if (activeCaseFilter === 'ALL') return true;
    return c.severity === activeCaseFilter;
  });

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
                <span>AI E-Ticaret Çalışanı v2.1</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                <span>Canlı Veri Analizi Devrede</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <Database className="w-3 h-3 flex-shrink-0" />
                <span>Doğrulanmış Gerçek API</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white break-words">
              “İşletmemde ne oluyor, neden oluyor ve ne yapmalıyım?”
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              AI Çalışanınız tüm pazar yerlerini (Trendyol, Hepsiburada, Amazon) saniye saniye tarar. Rakamları uydurmaz, her anomalinin kök nedenini bulur ve sizin onayınızla kâr kaçaklarını durdurur.
            </p>
          </div>

          {/* Hızlı AI Asistan Soru Çubuğu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-row items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {onOpenGuide && (
              <PageGuideButton 
                onClick={onOpenGuide} 
                label="💡 Nasıl Çalışır?" 
                className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/20 text-amber-300 border-white/25 py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl text-xs font-bold" 
              />
            )}

            <button
              onClick={() => onOpenAIChatModal('Bugün işletmemde ne oldu ve hangi acil aksiyonları almalıyım?')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#f27a1a] to-pink-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200 flex-shrink-0" />
              <span>AI Çalışanına Soru Sor</span>
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

      {/* 2. GERÇEK VERİYE DAYALI NET KÂR MODÜLÜ */}
      <RealNetProfitModule
        products={products}
        orders={orders}
        onNavigateToReturns={() => onNavigateTab('returns')}
        onNavigateToAds={() => onNavigateTab('ads')}
        onNavigateToProTable={() => onNavigateTab('pro-table')}
        onNavigateToInvoices={() => onNavigateTab('invoices')}
      />

      {/* 3. 4-SORULU AI ÇALIŞAN KARAR KARTLARI */}
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

      {/* 4. Güvenlik Denetim Kayıtları (Audit Logs Tablosu) */}
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

    </div>
  );
}
