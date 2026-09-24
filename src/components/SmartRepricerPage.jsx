import React, { useState } from 'react';
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

export function SmartRepricerPage({ onNavigateBack, onOpenGuide, products = [] }) {
  const [botActive, setBotActive] = useState(true);
  const [strategy, setStrategy] = useState('UNDERCUT_1TL'); // 'UNDERCUT_1TL' | 'MATCH_PRICE' | 'MAX_MARGIN'
  const [minMarginPercent, setMinMarginPercent] = useState(18); // Minimum %18 kâr marjı tabanı
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'logs' | 'simulator'

  // Simülatör Test Alanı State
  const [simProductIndex, setSimProductIndex] = useState(0);
  const [simCompetitorPrice, setSimCompetitorPrice] = useState('329.90');
  const [simResult, setSimResult] = useState(null);

  // Örnek Canlı Buybox & Rakip Fiyat Takip Listesi
  const [repricerItems, setRepricerItems] = useState([
    {
      id: 'REP-101',
      title: 'Oversize Keten Gömlek - Bej / L',
      marketplace: 'Trendyol',
      sku: 'TY-GMLK-01',
      costPrice: 110.00,
      commissionRate: 21,
      shippingCost: 38.50,
      myCurrentPrice: 349.00,
      competitorPrice: 339.90,
      competitorName: 'ModaTrend Store',
      hasBuybox: false,
      recommendedPrice: 338.90,
      minPriceFloor: 210.00, // Zarar koruma alt limiti
      status: 'UNDER_CUT_READY',
      currentNetProfit: 127.21,
      projectedNetProfit: 119.23,
      projectedMargin: 35.2
    },
    {
      id: 'REP-102',
      title: 'Deri Cüzdan & Kartlık - Siyah',
      marketplace: 'Trendyol',
      sku: 'TY-CZDN-BLK',
      costPrice: 65.00,
      commissionRate: 18,
      shippingCost: 38.50,
      myCurrentPrice: 229.00,
      competitorPrice: 235.00,
      competitorName: 'Aksesuar Deposu',
      hasBuybox: true,
      recommendedPrice: 229.00,
      minPriceFloor: 135.00,
      status: 'BUYBOX_WON',
      currentNetProfit: 84.28,
      projectedNetProfit: 84.28,
      projectedMargin: 36.8
    },
    {
      id: 'REP-103',
      title: 'Kablosuz TWS Bluetooth Kulaklık v5.3',
      marketplace: 'Hepsiburada',
      sku: 'HB-TWS-53',
      costPrice: 240.00,
      commissionRate: 15,
      shippingCost: 44.00,
      myCurrentPrice: 589.00,
      competitorPrice: 549.00,
      competitorName: 'Teknoloji Market',
      hasBuybox: false,
      recommendedPrice: 548.00,
      minPriceFloor: 380.00,
      status: 'UNDER_CUT_READY',
      currentNetProfit: 216.65,
      projectedNetProfit: 181.80,
      projectedMargin: 33.1
    },
    {
      id: 'REP-104',
      title: 'Hakiki Deri Erkek Bot - Taba 42',
      marketplace: 'Amazon TR',
      sku: 'AMZ-BOT-42',
      costPrice: 420.00,
      commissionRate: 14,
      shippingCost: 52.00,
      myCurrentPrice: 890.00,
      competitorPrice: 890.00,
      competitorName: 'Prime Ayakkabı',
      hasBuybox: true,
      recommendedPrice: 890.00,
      minPriceFloor: 610.00,
      status: 'BUYBOX_WON',
      currentNetProfit: 293.40,
      projectedNetProfit: 293.40,
      projectedMargin: 32.9
    }
  ]);

  // Canlı Log Kayıtları
  const [logs, setLogs] = useState([
    {
      id: 'LOG-501',
      time: '6 dk önce',
      type: 'REPRICE_SUCCESS',
      product: 'Oversize Keten Gömlek - Bej / L',
      oldPrice: '359.00 ₺',
      newPrice: '349.00 ₺',
      marketplace: 'Trendyol',
      reason: 'Rakip "ModaTrend" fiyatı 350 ₺ yaptı. 1 TL altı ile Buybox korundu.',
      profitGuard: '✅ Kâr Marjı: %36.2 (Güvenli)'
    },
    {
      id: 'LOG-502',
      time: '24 dk önce',
      type: 'FLOOR_PROTECTION',
      product: 'Deri Cüzdan & Kartlık - Siyah',
      oldPrice: '229.00 ₺',
      newPrice: '229.00 ₺ (Değişmedi)',
      marketplace: 'Trendyol',
      reason: 'Rakip zararına 120 ₺ yaptı. Asgari Kâr Marjı Tabanı (%18) devreye girdi, fiyat düşürülmedi!',
      profitGuard: '🛡️ Zarar Engellendi: +45.00 ₺ Kurtarıldı'
    },
    {
      id: 'LOG-503',
      time: '1 saat önce',
      type: 'BUYBOX_WON',
      product: 'Hakiki Deri Erkek Bot - Taba 42',
      oldPrice: '899.00 ₺',
      newPrice: '890.00 ₺',
      marketplace: 'Amazon TR',
      reason: 'Amazon FBA Buybox kutusu %100 oranla mağazamıza geçti.',
      profitGuard: '👑 Buybox Sahibi: Sizsiniz'
    }
  ]);

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
      reason: `Akıllı Repricer fiyatı ${item.recommendedPrice.toFixed(2)} ₺ olarak güncelledi ve Buybox'ı kazandı!`,
      profitGuard: `✅ Net Kâr: ${item.projectedNetProfit.toFixed(2)} ₺ (%${item.projectedMargin})`
    };

    setLogs([newLog, ...logs]);
    confetti({ particleCount: 70, spread: 60 });
  };

  // Simülatör Hesaplaması
  const handleRunSimulation = (e) => {
    e.preventDefault();
    const item = repricerItems[simProductIndex];
    const compPrice = parseFloat(simCompetitorPrice) || 0;

    let targetPrice = compPrice - 1.00;
    if (strategy === 'MATCH_PRICE') targetPrice = compPrice;
    
    // Zarar koruma marjı tabanı hesaplama
    const commission = (targetPrice * item.commissionRate) / 100;
    const stopaj = (targetPrice * 0.01);
    const totalCost = item.costPrice + item.shippingCost + commission + stopaj;
    const netProfit = targetPrice - totalCost;
    const margin = (netProfit / targetPrice) * 100;

    const isSafe = margin >= minMarginPercent && targetPrice >= item.minPriceFloor;

    setSimResult({
      targetPrice,
      netProfit,
      margin: margin.toFixed(1),
      isSafe,
      diff: (item.myCurrentPrice - targetPrice).toFixed(2),
      message: isSafe 
        ? `✅ Buybox Kazanılır! Fiyat ${targetPrice.toFixed(2)} ₺ yapılırsa %${margin.toFixed(1)} kâr ile ${netProfit.toFixed(2)} ₺ cebinize kalır.`
        : `⚠️ Zarar Koruması Uyarısı! Fiyat ${targetPrice.toFixed(2)} ₺ olursa marjınız %${margin.toFixed(1)} seviyesine düşer. Minimum %${minMarginPercent} tabanının altına inilmez!`
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      
      {/* 1. Üst Başlık & Bot Durumu */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {onNavigateBack && (
              <button 
                onClick={onNavigateBack}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#f27a1a] text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Akıllı Algoritma v2.4
                </span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Zarar Koruma Kalkanı
                </span>
                {onOpenGuide && (
                  <PageGuideButton 
                    onClick={onOpenGuide} 
                    label="💡 Nasıl Kullanılır?" 
                    className="bg-white/10 hover:bg-white/20 text-amber-300 border-white/20 py-1 px-3" 
                  />
                )}
              </div>
              <h1 className="text-xl lg:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <Bot className="w-6 h-6 text-[#f27a1a]" />
                Otomatik Buybox & Fiyat Savaşçısı (Smart Repricer)
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl">
            Rakiplerinizi 7/24 saniyelik takip edin. Kâr marjınızı koruyarak Buybox'ı 1 TL alt kırpma ile kazanın, zararına satışları otomatik engelleyin.
          </p>
        </div>

        {/* Bot Açık/Kapalı Düğmesi */}
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 relative z-10">
          <div className="text-right">
            <span className="text-[10px] text-slate-300 font-medium block">7/24 Reprice Botu</span>
            <strong className={`text-xs font-black ${botActive ? 'text-emerald-400' : 'text-slate-400'}`}>
              {botActive ? '● AKTİF & CANLI TAKİP' : '○ DURDURULDU'}
            </strong>
          </div>
          <button
            onClick={() => setBotActive(!botActive)}
            className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
              botActive ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
              botActive ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Dekoratif Işık Efekti */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#f27a1a]/20 rounded-full blur-3xl"></div>
      </div>

      {/* 2. Hızlı İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-1">
            <span>Buybox Sahibi Olduğunuz</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {repricerItems.filter(i => i.hasBuybox).length} / {repricerItems.length} Ürün
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">
            +%50 Buybox Başarı Oranı
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
            <span>Bu Ay Kurtarılan Kâr</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-600">
            +4.380 ₺
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Boşuna fiyat kırmaktan kurtarıldı
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
                          className="px-3 py-1.5 rounded-xl bg-[#f27a1a] hover:bg-[#e06909] text-white font-black text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1 ml-auto"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Fiyatı Güncelle</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 2: FİYAT VE MARJ SİMÜLATÖRÜ */}
      {activeTab === 'simulator' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-3xl mx-auto space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#f27a1a]" />
              Canlı Fiyat Kırma & Buybox Simülasyonu
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pazar yerinde bir rakip fiyat kırdığında algoritmanın nasıl tepki vereceğini ve cebinize ne kadar kalacağını test edin.
            </p>
          </div>

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
          </div>
        </div>
      )}

    </div>
  );
}

export default SmartRepricerPage;
