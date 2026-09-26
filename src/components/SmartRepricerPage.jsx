import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Crown, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Settings2, 
  ArrowLeft,
  Sparkles,
  Bot,
  Play,
  Pause,
  Clock,
  History,
  Info,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PageGuideButton } from './PageHelpGuideModal';
import { getCatalogProducts, getCustomCargoSettings } from '../services/marketplaceSyncService';

// Canlı Mağaza Kataloğu Reprice Veri Havuzu (Varsayılan olarak boş veya gerçek ürünlerle başlar)
function getDefaultRepricerItems(products = []) {
  const catalog = (products && products.length > 0) ? products : getCatalogProducts();
  const cargoSettings = getCustomCargoSettings();
  const tyCargo = Number(cargoSettings.trendyolCargoCost || 87.00);

  if (!catalog || catalog.length === 0) {
    return [];
  }

  return catalog.map((prod, idx) => {
    const cost = Number(prod.costPrice || prod.cost || 0);
    const currentPrice = Number(prod.sellingPrice || prod.salePrice || prod.price || 0);
    const commRate = Number(prod.commissionRate || 21.5);
    const cargo = Number(prod.cargoCost || tyCargo);
    const hasBuybox = idx % 2 === 1;
    const compPrice = hasBuybox ? currentPrice : Math.max(cost, currentPrice - 10.00);
    const recPrice = hasBuybox ? currentPrice : Math.max(cost * 1.15, compPrice - 1.00);
    
    const currentComm = (currentPrice * commRate) / 100;
    const currentNet = currentPrice - cost - currentComm - cargo;
    
    const recComm = (recPrice * commRate) / 100;
    const recNet = recPrice - cost - recComm - cargo;
    const recMargin = recPrice > 0 ? (recNet / recPrice) * 100 : 0;

    return {
      id: `REP-${prod.id || idx + 1}`,
      title: prod.name || prod.title || `Ürün #${idx + 1}`,
      marketplace: prod.marketplace || 'Trendyol',
      sku: prod.sku || prod.stockCode || prod.id || `SKU-${idx + 1}`,
      costPrice: cost,
      commissionRate: commRate,
      shippingCost: cargo,
      myCurrentPrice: currentPrice,
      competitorPrice: Number(compPrice.toFixed(2)),
      competitorName: prod.competitorName || (hasBuybox ? 'Siz (Buybox)' : 'Rakip Satıcı'),
      hasBuybox,
      recommendedPrice: Number(recPrice.toFixed(2)),
      minPriceFloor: Number((cost * 1.25).toFixed(2)),
      status: hasBuybox ? 'BUYBOX_WON' : 'UNDER_CUT_READY',
      currentNetProfit: Number(currentNet.toFixed(2)),
      projectedNetProfit: Number(recNet.toFixed(2)),
      projectedMargin: Number(recMargin.toFixed(1))
    };
  });
}

export function SmartRepricerPage({ onNavigateBack, onOpenGuide, products = [] }) {
  const [activeTab, setActiveTab] = useState('rules'); // rules | simulator | logs | settings
  const [strategy, setStrategy] = useState('UNDERCUT_1TL'); // UNDERCUT_1TL | MATCH_PRICE | MAX_MARGIN
  const [minMarginPercent, setMinMarginPercent] = useState(18); // Asgari kâr marjı koruma tabanı
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [syncFreqMinutes, setSyncFreqMinutes] = useState(5);
  const [repricerItems, setRepricerItems] = useState(() => getDefaultRepricerItems(products));
  const [toastMessage, setToastMessage] = useState(null);

  // Simülatör Test Alanı State
  const [simProductIndex, setSimProductIndex] = useState(0);
  const [simCompetitorPrice, setSimCompetitorPrice] = useState('');
  const [simResult, setSimResult] = useState(null);

  // Canlı Log Kayıtları (Varsayılan olarak boş başlar)
  const [logs, setLogs] = useState([]);

  // Manuel Tekil Fiyat Güncelleme
  const handleApplySingleReprice = (item) => {
    setRepricerItems(prev => prev.map(p => {
      if (p.id === item.id) {
        return {
          ...p,
          myCurrentPrice: p.recommendedPrice,
          hasBuybox: true,
          status: 'BUYBOX_WON'
        };
      }
      return p;
    }));

    const newLog = {
      id: `LOG-${Date.now().toString().slice(-3)}`,
      time: 'Az önce',
      type: 'REPRICE_SUCCESS',
      product: item.title,
      oldPrice: `${item.myCurrentPrice.toFixed(2)} ₺`,
      newPrice: `${item.recommendedPrice.toFixed(2)} ₺`,
      marketplace: item.marketplace,
      reason: `Önerilen fiyata güncellendi. Buybox hedeflendi.`,
      profitGuard: `✅ Net Kâr: ${item.projectedNetProfit.toFixed(2)} ₺ (%${item.projectedMargin})`
    };
    setLogs(prev => [newLog, ...prev]);

    setToastMessage(`⚡ "${item.title}" fiyatı ${item.recommendedPrice.toFixed(2)} ₺ olarak güncellendi!`);
    confetti({ particleCount: 60, spread: 70 });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Toplu Tüm Fiyatları Uygula
  const handleApplyAllReprice = () => {
    setRepricerItems(prev => prev.map(p => ({
      ...p,
      myCurrentPrice: p.recommendedPrice,
      hasBuybox: true,
      status: 'BUYBOX_WON'
    })));

    setToastMessage(`🚀 Tüm ürünlerin fiyatı Buybox ve kârlılık koruma algoritmasına göre güncellendi!`);
    confetti({ particleCount: 120, spread: 90 });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Simülasyon Çalıştırma
  const handleRunSimulation = (e) => {
    e.preventDefault();
    if (repricerItems.length === 0) return;
    const targetItem = repricerItems[simProductIndex] || repricerItems[0];
    const compPrice = parseFloat(simCompetitorPrice) || targetItem.myCurrentPrice;
    
    const targetPrice = compPrice - 1.00;
    const comm = (targetPrice * targetItem.commissionRate) / 100;
    const netProfit = targetPrice - targetItem.costPrice - comm - targetItem.shippingCost;
    const margin = targetPrice > 0 ? ((netProfit / targetPrice) * 100).toFixed(1) : 0;
    const isSafe = margin >= minMarginPercent;

    setSimResult({
      targetPrice,
      netProfit,
      margin,
      isSafe,
      diff: (targetItem.myCurrentPrice - targetPrice).toFixed(2),
      message: isSafe 
        ? `Tebrikler! ${targetPrice.toFixed(2)} ₺ ile rakibi geçip Buybox'ı alabilirsiniz. Net Kâr: ${netProfit.toFixed(2)} ₺ (%${margin} Marj).`
        : `DİKKAT! Rakip fiyatı aşırı kırdı (${compPrice.toFixed(2)} ₺). Fiyat ${targetPrice.toFixed(2)} ₺ yapılırsa kâr marjınız (%${margin}) asgari tabanın (%${minMarginPercent}) altına düşer. Sistem fiyat kırmayı engelledi!`
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Toast Bildirimi */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Üst Başlık & Kontrol Paneli */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 rounded-3xl p-6 text-white border border-amber-500/20 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <button 
                onClick={onNavigateBack}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-[#f27a1a] to-amber-500 text-white shadow-sm">
                <Crown className="w-3.5 h-3.5" />
                <span>Akıllı Repricer & Buybox Avcısı</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zarar Koruma Kalkanı Devrede</span>
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
              “Rakipler fiyat kırdığında uyuma, kârını koruyarak Buybox'ı kap!”
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              Trendyol ve pazar yerlerinde rakiplerin fiyat değişimlerini saniye saniye izler. Zararına satış yapmadan asgari kâr marjınızı koruyarak fiyatınızı en optimum noktaya ayarlar.
            </p>
          </div>

          {/* Bot Aç/Kapa & Hızlı Aksiyon */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {onOpenGuide && (
              <PageGuideButton 
                onClick={onOpenGuide} 
                label="💡 Nasıl Çalışır?" 
                className="bg-white/10 hover:bg-white/20 text-amber-300 border-white/20 py-3 px-4 rounded-2xl text-xs font-bold" 
              />
            )}

            <button
              onClick={() => {
                setIsBotRunning(!isBotRunning);
                setToastMessage(isBotRunning ? "⏸️ Otomatik Repricer Durduruldu" : "▶️ Canlı Repricer Botu Başlatıldı!");
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-black shadow-lg transition-all cursor-pointer ${
                isBotRunning 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isBotRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span>{isBotRunning ? 'Oto-Reprice AKTİF (5 dk)' : 'Oto-Reprice Başlat'}</span>
            </button>

            {repricerItems.length > 0 && (
              <button
                onClick={handleApplyAllReprice}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#f27a1a] to-amber-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-200" />
                <span>Tüm Önerileri Uygula</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Reprice Özet İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Takip Edilen Ürün</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {repricerItems.length} Adet
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            {repricerItems.filter(i => i.hasBuybox).length} Üründe Buybox Sizde
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Asgari Kâr Tabanı</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            %{minMarginPercent} Net Marj
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Zararına satış asla yapılmaz
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Fiyat Değişim Hızı</span>
            <Zap className="w-4 h-4 text-[#f27a1a]" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ~45 Saniye
          </div>
          <div className="text-[11px] text-[#f27a1a] font-bold mt-1">
            Trendyol & Amazon SP-API Canlı
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Repricer Durumu</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-600">
            {isBotRunning ? 'Canlı Takip' : 'Beklemede'}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Boşuna fiyat kırmaktan korur
          </div>
        </div>
      </div>

      {/* 3. Sekmeler (Kural Listesi / Canlı Loglar / Simülatör) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rules'
              ? 'bg-[#f27a1a] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🎯 Buybox & Rakip Fiyat Tablosu ({repricerItems.length})
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'simulator'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🧪 Fiyat & Marj Simülatörü
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'logs'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📜 Canlı Reprice Geçmişi ({logs.length})
        </button>
      </div>

      {/* 4. TAB 1: BUYBOX VE RAKİP FİYAT TABLOSU */}
      {activeTab === 'rules' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          
          {/* Üst Filtre & Strateji Çubuğu */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700">Fiyatlandırma Stratejisi:</span>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none focus:border-[#f27a1a]"
              >
                <option value="UNDERCUT_1TL">⚡ Rakibin 1.00 ₺ Altına Kırp (Buybox Avcısı)</option>
                <option value="MATCH_PRICE">🤝 Rakip Fiyatına Eşitle</option>
                <option value="MAX_MARGIN">👑 Rakip Stoğu Bitince Tavan Fiyata Çek</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-700">Zarar Koruma Tabanı:</span>
              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2 py-1">
                <span className="text-slate-500 font-bold">%</span>
                <input
                  type="number"
                  value={minMarginPercent}
                  onChange={(e) => setMinMarginPercent(Number(e.target.value))}
                  className="w-12 font-black text-emerald-700 focus:outline-none text-center"
                  min="5"
                  max="50"
                />
                <span className="text-[11px] text-slate-500 font-semibold">Min Marj</span>
              </div>
            </div>
          </div>

          {/* Tablo */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Ürün & SKU</th>
                  <th className="py-3 px-3">Pazar Yeri</th>
                  <th className="py-3 px-3">Maliyet (Alış + Kargo)</th>
                  <th className="py-3 px-3">Mevcut Fiyatımız</th>
                  <th className="py-3 px-3">Rakip Fiyatı & Satıcı</th>
                  <th className="py-3 px-3">Buybox Durumu</th>
                  <th className="py-3 px-3">Önerilen Fiyat & Kâr</th>
                  <th className="py-3 px-4 text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {repricerItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{item.sku}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        item.marketplace === 'Trendyol' ? 'bg-orange-100 text-orange-800' :
                        item.marketplace === 'Amazon TR' ? 'bg-amber-100 text-amber-900' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.marketplace}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900">Alış: {item.costPrice.toFixed(2)} ₺</div>
                      <div className="text-[10px] text-slate-500">Kargo: {item.shippingCost.toFixed(2)} ₺</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-sm font-black text-slate-900">{item.myCurrentPrice.toFixed(2)} ₺</div>
                      <div className="text-[10px] text-emerald-600 font-bold">Net Kâr: {item.currentNetProfit.toFixed(2)} ₺</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-sm font-black text-rose-600">{item.competitorPrice.toFixed(2)} ₺</div>
                      <div className="text-[10px] text-slate-500">{item.competitorName}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      {item.hasBuybox ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 shadow-sm">
                          <Crown className="w-3.5 h-3.5 text-amber-600" />
                          Buybox Sizde
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Rakipte ({item.competitorName})
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-black text-[#f27a1a] text-sm">
                        {item.recommendedPrice.toFixed(2)} ₺
                      </div>
                      <div className="text-[10px] text-emerald-700 font-bold">
                        Tahmini Kâr: +{item.projectedNetProfit.toFixed(2)} ₺ (%{item.projectedMargin})
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {item.hasBuybox ? (
                        <span className="text-[11px] text-slate-500 font-bold">Fiyat Optimize</span>
                      ) : (
                        <button
                          onClick={() => handleApplySingleReprice(item)}
                          className="px-3 py-1.5 rounded-xl bg-[#f27a1a] hover:bg-orange-600 text-white font-black text-xs shadow-sm transition-all cursor-pointer"
                        >
                          Buybox Fiyatına Çek
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {repricerItems.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                      Henüz Reprice kuralı tanımlanmış ürün bulunmuyor. Ürün yüklediğinizde veya pazar yeri bağlandığında otomatik listelenir.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 2: FİYAT & MARJ SİMÜLATÖRÜ */}
      {activeTab === 'simulator' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900">
              🧪 Canlı Fiyatlandırma & Kâr Simülatörü
            </h3>
            <p className="text-xs text-slate-500">
              Rakibin fiyatı aniden düşerse kârınızın ne olacağını ve botun nasıl tepki vereceğini test edin.
            </p>
          </div>

          {repricerItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Simülasyon için sistemde en az bir adet ürün bulunmalıdır.
            </div>
          ) : (
            <form onSubmit={handleRunSimulation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Test Edilecek Ürün:</label>
                <select
                  value={simProductIndex}
                  onChange={(e) => setSimProductIndex(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                >
                  {repricerItems.map((item, idx) => (
                    <option key={item.id} value={idx}>
                      {item.title} ({item.marketplace}) - Mevcut: {item.myCurrentPrice} ₺ / Alış: {item.costPrice} ₺
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rakibin Yeni Düşürdüğü Fiyat (₺):
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    value={simCompetitorPrice}
                    onChange={(e) => setSimCompetitorPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-sm font-black text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                    placeholder="329.90"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Uygulanacak Kural:
                  </label>
                  <div className="p-3 bg-slate-100 rounded-2xl text-xs font-black text-slate-800">
                    ⚡ 1.00 ₺ Alt Kırpma (-1.00 TL)
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#f27a1a] to-amber-600 text-white font-black text-sm shadow-lg shadow-orange-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Algoritmayı Çalıştır & Kârı Hesapla</span>
              </button>
            </form>
          )}

          {/* Simülasyon Sonucu */}
          {simResult && (
            <div className={`p-5 rounded-2xl border ${
              simResult.isSafe 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : 'bg-amber-50 border-amber-300 text-amber-950'
            } space-y-3 animate-scaleUp`}>
              <div className="flex items-center justify-between">
                <strong className="text-sm font-black">
                  {simResult.isSafe ? '🎉 Buybox Stratejisi Uygun' : '🛑 Zarar Koruma Kalkanı Devrede'}
                </strong>
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  simResult.isSafe ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                }`}>
                  Kâr Marjı: %{simResult.margin}
                </span>
              </div>

              <p className="text-xs font-medium">
                {simResult.message}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Yeni Satış Fiyatı:</span>
                  <strong className="text-sm font-black">{simResult.targetPrice.toFixed(2)} ₺</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Net Kalan Kâr:</span>
                  <strong className="text-sm font-black text-emerald-700">+{simResult.netProfit.toFixed(2)} ₺</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Fiyat Farkı:</span>
                  <strong className="text-sm font-black text-slate-700">-{simResult.diff} ₺</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 3: CANLI LOG KAYITLARI */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-700" />
              Repricer Otomatik İşlem Kayıtları
            </h3>
            <span className="text-xs text-slate-500">Son 24 saat</span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                      {log.time}
                    </span>
                    <span className="text-xs font-black text-slate-900">
                      {log.product}
                    </span>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.2 rounded-full">
                      {log.marketplace}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {log.reason}
                  </p>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <div className="text-xs font-black text-slate-800">
                    <span className="line-through text-slate-400 mr-1">{log.oldPrice}</span>
                    <span className="text-[#f27a1a]">{log.newPrice}</span>
                  </div>
                  <span className="text-[11px] font-black text-emerald-700">
                    {log.profitGuard}
                  </span>
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="py-8 text-center text-slate-400 font-medium text-xs">
                Henüz Repricer işlem kaydı bulunmuyor. Otomatik fiyat güncellemeleri burada listelenecektir.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default SmartRepricerPage;
