import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign, 
  ShoppingBag, 
  Truck, 
  Percent, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  Send, 
  CheckCircle, 
  AlertOctagon,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import confetti from 'canvas-confetti';

export function Dashboard({ 
  metrics, 
  products, 
  orders, 
  timelineData, 
  cargoLeaks,
  morningBrief, 
  onNavigateTab, 
  onOpenAIWithPrompt,
  onSendWhatsAppTest 
}) {
  const [briefRead, setBriefRead] = useState(false);
  const [fixedAlerts, setFixedAlerts] = useState({});

  const handleFixAlert = (id, e) => {
    e.stopPropagation();
    setFixedAlerts(prev => ({ ...prev, [id]: true }));
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const losingProducts = products.filter(p => p.status === 'losing');

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. Sabah 09:00 AI Yönetici Brifingi Kartı */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-950/80 via-dark-card to-dark-surface border border-brand-500/30 p-5 lg:p-6 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 to-amber-400 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  {morningBrief.time} AI YÖNETİCİ BRİFİNGİ
                </span>
                <span className="text-xs text-slate-400">Canlı Analiz Motoru</span>
              </div>
              <h2 className="text-lg lg:text-xl font-extrabold text-white mt-0.5">
                {morningBrief.headline}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch lg:self-auto">
            <button
              onClick={onSendWhatsAppTest}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all group"
            >
              <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              WhatsApp'a Gönder
            </button>
            <button
              onClick={() => onOpenAIWithPrompt("Bu sabahki brifingi detaylandır ve bana bugün için 3 somut e-ticaret görevi ver.")}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Detaylı Analiz İste
            </button>
          </div>
        </div>

        {/* Brifing 3 Öncelikli Madde */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4">
          {morningBrief.priorities.map((item, idx) => (
            <div 
              key={idx}
              className={`p-3.5 rounded-xl border transition-all ${
                item.type === 'danger' 
                  ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60'
                  : item.type === 'warning'
                  ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
                  : 'bg-indigo-950/20 border-indigo-500/30 hover:border-indigo-500/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase ${
                  item.type === 'danger'
                    ? 'bg-rose-500/20 text-rose-300'
                    : item.type === 'warning'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {item.type === 'danger' ? '🔴 Acil Kaçak' : item.type === 'warning' ? '⚠️ Kargo Uyarısı' : '💡 Fırsat'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white mb-1 line-clamp-1">{item.title}</h4>
              <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">{item.description}</p>
              <p className="text-[11px] font-semibold text-brand-300 flex items-center gap-1">
                <span>↳</span> {item.action}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* 2. Beş Ana Metrik Kartı (Trendyol & Hepsiburada Stili) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Kart 1: Gerçek Net Kâr (EN KRİTİK KART) */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-dark-card relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Gerçek Net Kâr (Cebine Kalan)</span>
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-emerald-400 tracking-tight">
              {metrics.netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-lg">TL</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="flex items-center text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3" /> %{metrics.netMargin}
            </span>
            <span className="text-slate-400 text-[11px]">Net Kâr Marjı</span>
          </div>
        </div>

        {/* Kart 2: Toplam Ciro */}
        <div className="glass-card glass-card-hover rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Toplam Brüt Ciro</span>
            <span className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {metrics.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-base text-slate-400">TL</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span className="text-white font-bold">{metrics.totalSalesCount} Adet</span> Sipariş Teslim Edildi
          </div>
        </div>

        {/* Kart 3: Pazar Yeri Komisyon Kesintisi */}
        <div className="glass-card glass-card-hover rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Komisyon Kesintisi</span>
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Percent className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-amber-300 tracking-tight">
            {metrics.totalCommission.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-base text-slate-400">TL</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>Ort. Komisyon: </span>
            <span className="text-amber-400 font-semibold">%18.8</span>
          </div>
        </div>

        {/* Kart 4: Kargo Harcamaları */}
        <div className="glass-card glass-card-hover rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>Kargo Masrafları</span>
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Truck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-blue-300 tracking-tight">
            {metrics.totalCargo.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-base text-slate-400">TL</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
            <span>İade Oranı: </span>
            <span className={`font-semibold ${metrics.refundRate > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
              %{metrics.refundRate}
            </span>
          </div>
        </div>

        {/* Kart 5: Para Kaçağı & Kurtarılabilir Tutar */}
        <div className="glass-card glass-card-hover rounded-2xl p-4 border-rose-500/40 bg-gradient-to-b from-rose-950/20 to-dark-card cursor-pointer" onClick={() => onNavigateTab('cargo-audit')}>
          <div className="flex items-center justify-between text-rose-300 text-xs font-medium mb-2">
            <span className="flex items-center gap-1 font-bold">
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
              Kurtarılabilir Kaçak
            </span>
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl lg:text-3xl font-extrabold text-rose-400 tracking-tight">
            {metrics.totalRecoverableCargo.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-base">TL</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-rose-300/90 font-medium">
            <span>Kargo Desi Farkı</span>
            <span className="text-brand-400 underline text-[11px] flex items-center">İtiraz Et ↳</span>
          </div>
        </div>

      </div>

      {/* 3. İki Kolonlu Görsel Alan: Grafik & Kaçak Dedektörü */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sol Kolon (2/3 Genişlik): Canlı Ciro & Kâr Trendi */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" />
                Haftalık Ciro ve Net Kâr Trendi
              </h3>
              <p className="text-xs text-slate-400">Ciro artarken net kâr marjının nasıl değiştiğini izleyin</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-brand-400 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span> Ciro (TL)
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Net Kâr (TL)
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="ciroGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="karGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', fontSize: '12px' }} 
                  formatter={(value) => [`${value.toLocaleString('tr-TR')} TL`]}
                />
                <Area type="monotone" dataKey="ciro" name="Ciro" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#ciroGradient)" />
                <Area type="monotone" dataKey="netKar" name="Net Kâr" stroke="#34d399" strokeWidth={2.5} fillOpacity={1} fill="url(#karGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sağ Kolon (1/3 Genişlik): Canlı Kaçak Avcısı (Leak Detector) */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between border-rose-500/20">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                Canlı Kaçak Avcısı
              </h3>
              <span className="text-[11px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full animate-pulse">
                {losingProducts.length + cargoLeaks.filter(l => l.status === 'ActionRequired').length} Kaçak
              </span>
            </div>
            
            <div className="space-y-3">
              {/* Kaçak 1: Yüksek Reklam & İade Zararı */}
              <div className="p-3 rounded-xl bg-dark-surface/90 border border-rose-500/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-white">Kablosuz Kulaklık (SKU-002)</div>
                  <span className="text-[10px] font-extrabold text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded">ZARAR YAZIYOR</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  11.500 TL reklam + %19.5 iade oranı kârı sildi süpürdü.
                </p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-rose-400 font-bold">-2.180 TL/Aylık</span>
                  <button 
                    onClick={(e) => handleFixAlert('leak1', e)}
                    disabled={fixedAlerts['leak1']}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                      fixedAlerts['leak1']
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                  >
                    {fixedAlerts['leak1'] ? '✓ Reklam Kısıldı' : 'Reklamı %30 Kıs'}
                  </button>
                </div>
              </div>

              {/* Kaçak 2: Bel Minderi Kargo Desi Hataları */}
              <div className="p-3 rounded-xl bg-dark-surface/90 border border-amber-500/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-bold text-white">Bel Minderi (SKU-006)</div>
                  <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded">DESİ CEZASI</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  2 desi ürün 5 desi faturalandırılmış. Toplam 27 TL fazla kesinti.
                </p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[11px] text-amber-400 font-bold">+27 TL İade Al</span>
                  <button 
                    onClick={() => onNavigateTab('cargo-audit')}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 transition-all"
                  >
                    Dilekçeyi Gör ↳
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-center">
            <button 
              onClick={() => onOpenAIWithPrompt("Bana mağazamdaki tüm kaçakları ve bunları durdurmak için 1 haftalık eylem planını çıkar.")}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center justify-center gap-1 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tüm Kaçakları AI ile Analiz Et
            </button>
          </div>
        </div>

      </div>

      {/* 4. Ürün Bazlı Kârlılık ve Kaçak Tablosu */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-400" />
              Ürün Bazlı Net Kârlılık ve Komisyon Tablosu
            </h3>
            <p className="text-xs text-slate-400">Hangi ürün cebinize para bırakıyor, hangisi gizli zarar ettiriyor?</p>
          </div>
          <button 
            onClick={() => onNavigateTab('cargo-audit')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-600/20 text-brand-300 border border-brand-500/30 hover:bg-brand-600/30 transition-all"
          >
            + Kâr Simülatöründe Fiyat Dene
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="py-3 px-3">Ürün Adı & SKU</th>
                <th className="py-3 px-3">Pazar Yeri</th>
                <th className="py-3 px-3 text-right">Alış</th>
                <th className="py-3 px-3 text-right">Satış</th>
                <th className="py-3 px-3 text-right">Komisyon</th>
                <th className="py-3 px-3 text-right">Kargo</th>
                <th className="py-3 px-3 text-right">Satış / İade</th>
                <th className="py-3 px-3 text-right">Net Kâr / Adet</th>
                <th className="py-3 px-3 text-center">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map(p => {
                const commissionTL = (p.sellingPrice * p.commissionRate) / 100;
                const netUnitProfit = p.sellingPrice - commissionTL - p.cargoCost - p.costPrice;
                const margin = (netUnitProfit / p.sellingPrice) * 100;
                
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white text-xs">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.id} • Stok: {p.stock} adet</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        p.marketplace === 'Trendyol' 
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {p.marketplace}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-medium text-slate-300">
                      {p.costPrice.toFixed(2)} TL
                    </td>
                    <td className="py-3.5 px-3 text-right font-bold text-white">
                      {p.sellingPrice.toFixed(2)} TL
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      <div>{commissionTL.toFixed(2)} TL</div>
                      <div className="text-[10px] text-slate-500">%{p.commissionRate}</div>
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      <div className={p.billedDesiAvg > p.registeredDesi ? 'text-amber-400 font-bold' : ''}>
                        {p.cargoCost.toFixed(2)} TL
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {p.billedDesiAvg > p.registeredDesi ? `⚠️ ${p.billedDesiAvg} Desi` : `${p.registeredDesi} Desi`}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="font-bold text-white">{p.monthlySalesCount} adet</div>
                      <div className={`text-[10px] ${p.refundRate > 10 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                        {p.refundCount} İade (%{p.refundRate})
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className={`font-extrabold text-xs ${netUnitProfit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {netUnitProfit.toFixed(2)} TL
                      </div>
                      <div className={`text-[10px] ${margin > 15 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        %{margin.toFixed(1)} Marj
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {p.status === 'profitable' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" /> Şampiyon
                        </span>
                      ) : p.status === 'warning' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" /> Stok Az
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                          <AlertOctagon className="w-3 h-3" /> Kaçak Var
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
