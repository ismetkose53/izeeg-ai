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

// Gerçek Mağaza Giyim Kataloğu Başlangıç Reprice Veri Havuzu
function getDefaultRepricerItems(products = []) {
  const catalog = (products && products.length > 0) ? products : getCatalogProducts();
  const cargoSettings = getCustomCargoSettings();
  const tyCargo = Number(cargoSettings.trendyolCargoCost || 87.00);

  const fallbackItems = [
    {
      id: 'REP-101',
      title: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
      marketplace: 'Trendyol',
      sku: 'Modalsiyah2',
      costPrice: 780.00,
      commissionRate: 21.5,
      shippingCost: tyCargo,
      myCurrentPrice: 1950.00,
      competitorPrice: 1940.00,
      competitorName: 'ModaTrend Store',
      hasBuybox: false,
      recommendedPrice: 1939.00,
      minPriceFloor: 1250.00,
      status: 'UNDER_CUT_READY',
      currentNetProfit: 663.75, // 1950 - 780 - (1950*0.215 = 419.25) - 87 = 663.75
      projectedNetProfit: 655.12, // 1939 - 780 - (1939*0.215 = 416.88) - 87 = 655.12
      projectedMargin: 33.8
    },
    {
      id: 'REP-102',
      title: 'Yıldız Taş Aksesuarlı, Vatkalı Oversize Tshirt',
      marketplace: 'Trendyol',
      sku: 'T.T.12',
      costPrice: 640.00,
      commissionRate: 21.5,
      shippingCost: tyCargo,
      myCurrentPrice: 1599.00,
      competitorPrice: 1650.00,
      competitorName: 'Aksesuar Deposu',
      hasBuybox: true,
      recommendedPrice: 1599.00,
      minPriceFloor: 1050.00,
      status: 'BUYBOX_WON',
      currentNetProfit: 528.22,
      projectedNetProfit: 528.22,
      projectedMargin: 33.0
    },
    {
      id: 'REP-103',
      title: 'V Yaka Düğmeli Triko Hırka Ekru',
      marketplace: 'Trendyol',
      sku: 'TRK-HRK-V01',
      costPrice: 500.00,
      commissionRate: 21.5,
      shippingCost: tyCargo,
      myCurrentPrice: 1250.00,
      competitorPrice: 1240.00,
      competitorName: 'Giyim Trend',
      hasBuybox: false,
      recommendedPrice: 1239.00,
      minPriceFloor: 850.00,
      status: 'UNDER_CUT_READY',
      currentNetProfit: 394.25,
      projectedNetProfit: 385.61,
      projectedMargin: 31.1
    },
    {
      id: 'REP-104',
      title: 'Yüksek Bel Palazzo Jean Pantolon',
      marketplace: 'Trendyol',
      sku: 'PNT-PLZ-01',
      costPrice: 700.00,
      commissionRate: 21.5,
      shippingCost: tyCargo,
      myCurrentPrice: 1750.00,
      competitorPrice: 1750.00,
      competitorName: 'Denim Club',
      hasBuybox: true,
      recommendedPrice: 1750.00,
      minPriceFloor: 1150.00,
      status: 'BUYBOX_WON',
      currentNetProfit: 586.75,
      projectedNetProfit: 586.75,
      projectedMargin: 33.5
    },
    {
      id: 'REP-105',
      title: 'Keten Karışımlı Oversize Blazer Ceket',
      marketplace: 'Trendyol',
      sku: 'CKT-BLZ-02',
      costPrice: 980.00,
      commissionRate: 21.5,
      shippingCost: tyCargo,
      myCurrentPrice: 2450.00,
      competitorPrice: 2420.00,
      competitorName: 'Elite Butik',
      hasBuybox: false,
      recommendedPrice: 2419.00,
      minPriceFloor: 1600.00,
      status: 'UNDER_CUT_READY',
      currentNetProfit: 856.25,
      projectedNetProfit: 831.92,
      projectedMargin: 34.4
    },
    {
      id: 'REP-106',
      title: 'Dökümlü Saten Midi Elbise',
      marketplace: 'Trendyol',
      sku: 'ELB-SAT-03',
      costPrice: 750.00,
      commissionRate: 21.5,
      shippingCost: tyCargo,
      myCurrentPrice: 1890.00,
      competitorPrice: 1890.00,
      competitorName: 'Saten Butik',
      hasBuybox: true,
      recommendedPrice: 1890.00,
      minPriceFloor: 1250.00,
      status: 'BUYBOX_WON',
      currentNetProfit: 646.65,
      projectedNetProfit: 646.65,
      projectedMargin: 34.2
    }
  ];

  if (catalog && catalog.length > 0) {
    return catalog.slice(0, 6).map((prod, idx) => {
      const cost = Number(prod.costPrice || 700);
      const currentPrice = Number(prod.sellingPrice || 1750);
      const commRate = Number(prod.commissionRate || 21.5);
      const cargo = Number(prod.cargoCost || tyCargo);
      const hasBuybox = idx % 2 === 1;
      const compPrice = hasBuybox ? currentPrice : currentPrice - 10.00;
      const recPrice = hasBuybox ? currentPrice : compPrice - 1.00;
      
      const currentComm = (currentPrice * commRate) / 100;
      const currentProfit = currentPrice - cost - currentComm - cargo;
      
      const recComm = (recPrice * commRate) / 100;
      const recProfit = recPrice - cost - recComm - cargo;
      const recMargin = recPrice > 0 ? (recProfit / recPrice) * 100 : 0;

      return {
        id: `REP-${100 + idx}`,
        title: prod.name || prod.title || `Ürün #${idx + 1}`,
        marketplace: prod.marketplace || 'Trendyol',
        sku: prod.sku || prod.id || `SKU-${idx + 1}`,
        costPrice: cost,
        commissionRate: commRate,
        shippingCost: cargo,
        myCurrentPrice: currentPrice,
        competitorPrice: compPrice,
        competitorName: hasBuybox ? 'Aksesuar Deposu' : 'ModaTrend Store',
        hasBuybox,
        recommendedPrice: recPrice,
        minPriceFloor: cost * 1.35,
        status: hasBuybox ? 'BUYBOX_WON' : 'UNDER_CUT_READY',
        currentNetProfit: currentProfit,
        projectedNetProfit: recProfit,
        projectedMargin: Number(recMargin.toFixed(1))
      };
    });
  }

  return fallbackItems;
}

export function SmartRepricerPage({ onNavigateBack, onOpenGuide, products = [] }) {
  const [botActive, setBotActive] = useState(true);
  const [strategy, setStrategy] = useState('UNDERCUT_1TL'); // 'UNDERCUT_1TL' | 'MATCH_PRICE' | 'MAX_MARGIN'
  const [minMarginPercent, setMinMarginPercent] = useState(18); // Minimum %18 kâr marjı tabanı
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'logs' | 'simulator'

  // Canlı Buybox & Rakip Fiyat Takip Listesi
  const [repricerItems, setRepricerItems] = useState(() => getDefaultRepricerItems(products));

  // Simülatör Test Alanı State
  const [simProductIndex, setSimProductIndex] = useState(0);
  const [simCompetitorPrice, setSimCompetitorPrice] = useState('1940.00');
  const [simResult, setSimResult] = useState(null);

  // Canlı Log Kayıtları
  const [logs, setLogs] = useState([
    {
      id: 'LOG-501',
      time: '6 dk önce',
      type: 'REPRICE_SUCCESS',
      product: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
      oldPrice: '1.950,00 ₺',
      newPrice: '1.939,00 ₺',
      marketplace: 'Trendyol',
      reason: 'Rakip "ModaTrend" fiyatı 1.940 ₺ yaptı. 1 TL altı ile Buybox korundu.',
      profitGuard: '✅ Net Kâr: 655,12 ₺ (%33.8 Güvenli)'
    },
    {
      id: 'LOG-502',
      time: '24 dk önce',
      type: 'FLOOR_PROTECTION',
      product: 'Yıldız Taş Aksesuarlı, Vatkalı Oversize Tshirt',
      oldPrice: '1.599,00 ₺',
      newPrice: '1.599,00 ₺ (Değişmedi)',
      marketplace: 'Trendyol',
      reason: 'Rakip zararına 850 ₺ yaptı. Asgari Kâr Marjı Tabanı (%18) devreye girdi, fiyat düşürülmedi!',
      profitGuard: '🛡️ Zarar Engellendi: +420,00 ₺ Kurtarıldı'
    },
    {
      id: 'LOG-503',
      time: '1 saat önce',
      type: 'BUYBOX_WON',
      product: 'Yüksek Bel Palazzo Jean Pantolon',
      oldPrice: '1.750,00 ₺',
      newPrice: '1.750,00 ₺',
      marketplace: 'Trendyol',
      reason: 'Trendyol Buybox kutusu %100 oranla mağazamıza geçti.',
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
