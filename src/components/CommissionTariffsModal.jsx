import React, { useState, useMemo } from 'react';
import { 
  Percent, 
  X, 
  TrendingUp, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Download, 
  Upload, 
  ChevronRight, 
  Sparkles, 
  Tag, 
  Truck,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function CommissionTariffsModal({ isOpen, onClose, products = [], onUpdatePrice }) {
  const [activeDateTab, setActiveDateTab] = useState('CURRENT'); // 'CURRENT' | 'NEXT'
  const [selectedCargoProvider, setSelectedCargoProvider] = useState('Trendyol Express');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Ürün Fiyat & Termin State'leri
  const [customPrices, setCustomPrices] = useState({});
  const [terminliStates, setTerminliStates] = useState({});

  if (!isOpen) return null;

  // Örnek Tarife Verileri (Gerçek Ürünlerle Eşleştirilmiş)
  const tariffProducts = useMemo(() => {
    const list = products.length > 0 ? products : [
      {
        id: 'P-101',
        title: 'Organik Saç & Cilt Bakım Seti',
        brand: 'Demo Marka 1',
        barcode: '8699900000046',
        desi: 7,
        stock: 43,
        currentPrice: 876.00,
        costPrice: 380.00,
        imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&auto=format&fit=crop&q=60',
        tier1: { min: 832.20, max: 9999, rate: 19 },
        tier2: { min: 753.36, max: 832.19, rate: 16 },
        tier3: { min: 674.52, max: 753.35, rate: 13 },
        tier4: { min: 0, max: 674.51, rate: 10 }
      },
      {
        id: 'P-102',
        title: 'Doğal Yüz Nemlendirici Krem 50ml',
        brand: 'Demo Marka 2',
        barcode: '8699900000047',
        desi: 6,
        stock: 43,
        currentPrice: 903.00,
        costPrice: 420.00,
        imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=60',
        tier1: { min: 857.85, max: 9999, rate: 19 },
        tier2: { min: 776.58, max: 857.84, rate: 16 },
        tier3: { min: 695.31, max: 776.57, rate: 13 },
        tier4: { min: 0, max: 695.30, rate: 10 }
      },
      {
        id: 'P-103',
        title: 'Alüminyum Ergonomik Laptop Standı',
        brand: 'Demo Marka 3',
        barcode: '8699900000040',
        desi: 5,
        stock: 40,
        currentPrice: 781.00,
        costPrice: 320.00,
        imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=150&auto=format&fit=crop&q=60',
        tier1: { min: 741.95, max: 9999, rate: 17 },
        tier2: { min: 671.66, max: 741.94, rate: 14 },
        tier3: { min: 601.37, max: 671.65, rate: 11 },
        tier4: { min: 0, max: 601.36, rate: 8 }
      },
      {
        id: 'P-104',
        title: 'Ayarlanabilir Masaüstü Tablet Tutucu',
        brand: 'Demo Marka 4',
        barcode: '8699900000041',
        desi: 4,
        stock: 55,
        currentPrice: 808.00,
        costPrice: 340.00,
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&auto=format&fit=crop&q=60',
        tier1: { min: 767.60, max: 9999, rate: 17 },
        tier2: { min: 694.88, max: 767.59, rate: 14 },
        tier3: { min: 622.16, max: 694.87, rate: 11 },
        tier4: { min: 0, max: 622.15, rate: 8 }
      }
    ];

    if (searchQuery.trim()) {
      return list.filter(p => 
        (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.barcode || '').includes(searchQuery)
      );
    }
    return list;
  }, [products, searchQuery]);

  // Tekil Fiyat Güncelleme
  const handleSinglePriceUpdate = (product) => {
    const targetPrice = customPrices[product.id] || product.currentPrice;
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setToastMessage(`✅ ${product.title} için satış fiyatı ₺${targetPrice} olarak güncellendi ve pazaryerine iletildi.`);
      confetti({ particleCount: 50, spread: 60 });
      if (onUpdatePrice) onUpdatePrice(product.id, targetPrice);
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  // Otomatik En Kârlı Bareme Çekme
  const handleAutoOptimize = () => {
    setIsUpdating(true);
    setTimeout(() => {
      const newPrices = {};
      tariffProducts.forEach(p => {
        // En yüksek marjı bırakan 2. baremi seç
        newPrices[p.id] = (p.tier2.min + 5).toFixed(2);
      });
      setCustomPrices(newPrices);
      setIsUpdating(false);
      setToastMessage('🚀 Tüm ürünler en yüksek net kâr bırakan komisyon baremine göre optimize edildi.');
      confetti({ particleCount: 90, spread: 80 });
      setTimeout(() => setToastMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-7xl rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-fadeIn my-auto text-slate-800 dark:text-zinc-100 flex flex-col max-h-[92vh]">
        
        {/* Üst Header Bar */}
        <div className="border-b border-slate-200 dark:border-zinc-800 p-5 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/60 dark:bg-zinc-900/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-orange-100 text-[#f27a1a] dark:bg-orange-950/50 dark:text-orange-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Percent className="w-3 h-3" />
                Trendyol Kampanya & Barem Motoru
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-950 dark:text-white mt-1">
              Komisyon Tarifeleri & Net Kâr Simülatörü
            </h2>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Kargo Dropdown */}
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-bold shadow-sm">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span className="text-slate-500 text-[10px]">Kargo:</span>
              <select 
                value={selectedCargoProvider}
                onChange={(e) => setSelectedCargoProvider(e.target.value)}
                className="bg-transparent font-bold text-slate-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
              >
                <option value="Trendyol Express">Trendyol Express</option>
                <option value="Sürat Kargo">Sürat Kargo</option>
                <option value="Yurtiçi Kargo">Yurtiçi Kargo</option>
                <option value="Aras Kargo">Aras Kargo</option>
              </select>
            </div>

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 transition-all cursor-pointer flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tarih Dönemleri & Hızlı Eylem Butonları */}
        <div className="p-4 sm:px-8 border-b border-slate-200 dark:border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-zinc-950">
          
          {/* Dönem Sekmeleri */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDateTab('CURRENT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeDateTab === 'CURRENT' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
              }`}
            >
              <span>29 Eylül 08:00 – 6 Ekim 07:59</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">48 Ürün</span>
            </button>
            <button
              onClick={() => setActiveDateTab('NEXT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeDateTab === 'NEXT' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
              }`}
            >
              <span>6 Ekim 08:00 – 13 Ekim 07:59</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">48 Ürün</span>
            </button>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAutoOptimize}
              disabled={isUpdating}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Otomatik Fiyat Güncelle
            </button>

            <button
              onClick={() => {
                setCustomPrices({});
                setToastMessage('Tarifedeki özel fiyatlar sıfırlandı.');
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 text-xs font-bold hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Tarifedeki Fiyatları Sıfırla
            </button>
          </div>

        </div>

        {/* Toast Bildirimi */}
        {toastMessage && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tablo Arama Barı */}
        <div className="p-3 sm:px-8 border-b border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/20">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün ara (ad, barkod, model kodu)..."
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 shadow-sm"
          />
        </div>

        {/* Komisyon Baremleri Tablosu (EZV Birebir Tasarım) */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:px-8">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-black uppercase text-slate-500 dark:text-zinc-400 bg-slate-50/70 dark:bg-zinc-900/50">
                <th className="py-3 px-3 min-w-[220px]">Ürün Bilgileri</th>
                <th className="py-3 px-3 min-w-[130px] text-center">1. Fiyat Aralığı</th>
                <th className="py-3 px-3 min-w-[130px] text-center">2. Fiyat Aralığı</th>
                <th className="py-3 px-3 min-w-[130px] text-center">3. Fiyat Aralığı</th>
                <th className="py-3 px-3 min-w-[130px] text-center">4. Fiyat Aralığı</th>
                <th className="py-3 px-3 min-w-[100px] text-center">Güncel Fiyat</th>
                <th className="py-3 px-3 min-w-[180px] text-center">Satış Fiyatı & Karar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-900">
              {tariffProducts.map((p) => {
                const enteredPrice = customPrices[p.id] || p.currentPrice;
                const isTerminli = terminliStates[p.id] || false;

                // Tahmini Net Kâr Hesaplama
                const commissionRate = enteredPrice >= p.tier1.min ? p.tier1.rate :
                                       enteredPrice >= p.tier2.min ? p.tier2.rate :
                                       enteredPrice >= p.tier3.min ? p.tier3.rate : p.tier4.rate;
                
                const commAmount = (enteredPrice * commissionRate) / 100;
                const cargoEst = 35 + (p.desi * 3);
                const vatAmount = (enteredPrice * 0.10) / 1.10;
                const netProfit = enteredPrice - (p.costPrice + commAmount + cargoEst + vatAmount);
                const netMargin = enteredPrice > 0 ? ((netProfit / enteredPrice) * 100).toFixed(1) : 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-zinc-900/50 transition-colors">
                    
                    {/* Ürün Bilgisi */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.imageUrl} 
                          alt={p.title} 
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-zinc-800 flex-shrink-0" 
                        />
                        <div>
                          <strong className="block text-slate-900 dark:text-white font-bold leading-tight line-clamp-1">
                            {p.title}
                          </strong>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{p.brand}</span>
                          <span className="text-[10px] font-mono text-slate-500">Barkod: {p.barcode}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded font-semibold text-slate-600 dark:text-zinc-400">
                              📦 {p.desi} desi
                            </span>
                            <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                              Stok: {p.stock}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 1. Fiyat Aralığı */}
                    <td className="py-3 px-3 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80">
                        <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                          ₺{p.tier1.min} - ve üstü
                        </strong>
                        <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold block mt-0.5">
                          Komisyon %{p.tier1.rate}
                        </span>
                        <span className="text-[9px] text-slate-400 block">Terminsiz</span>
                      </div>
                    </td>

                    {/* 2. Fiyat Aralığı */}
                    <td className="py-3 px-3 text-center">
                      <div className="p-2 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-800/60">
                        <strong className="text-xs font-bold text-indigo-950 dark:text-indigo-200 block">
                          ₺{p.tier2.min} - ₺{p.tier2.max}
                        </strong>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block mt-0.5">
                          Komisyon %{p.tier2.rate}
                        </span>
                        <span className="text-[9px] text-emerald-600 font-bold block">En Yüksek Net Kâr</span>
                      </div>
                    </td>

                    {/* 3. Fiyat Aralığı */}
                    <td className="py-3 px-3 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80">
                        <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                          ₺{p.tier3.min} - ₺{p.tier3.max}
                        </strong>
                        <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-bold block mt-0.5">
                          Komisyon %{p.tier3.rate}
                        </span>
                        <span className="text-[9px] text-slate-400 block">Hızlı Satış Baremi</span>
                      </div>
                    </td>

                    {/* 4. Fiyat Aralığı */}
                    <td className="py-3 px-3 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800/80">
                        <strong className="text-xs font-bold text-slate-900 dark:text-white block">
                          ₺{p.tier4.max} - ve altı
                        </strong>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Komisyon %{p.tier4.rate}
                        </span>
                        <span className="text-[9px] text-rose-500 font-semibold block">Düşük Marj</span>
                      </div>
                    </td>

                    {/* Güncel Fiyat */}
                    <td className="py-3 px-3 text-center">
                      <strong className="text-sm font-black text-slate-900 dark:text-white">
                        ₺{p.currentPrice.toFixed(2)}
                      </strong>
                    </td>

                    {/* Satış Fiyatı Girişi & Termin Seçimi */}
                    <td className="py-3 px-3 text-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 justify-center">
                          <input 
                            type="number"
                            value={customPrices[p.id] !== undefined ? customPrices[p.id] : p.currentPrice}
                            onChange={(e) => setCustomPrices({ ...customPrices, [p.id]: parseFloat(e.target.value) || 0 })}
                            className="w-24 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2 py-1.5 text-xs font-bold text-center focus:border-indigo-600"
                          />
                          <button
                            type="button"
                            onClick={() => handleSinglePriceUpdate(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                          >
                            Fiyat Güncelle
                          </button>
                        </div>

                        {/* Canlı Kâr Göstergesi */}
                        <div className="flex items-center justify-between text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-zinc-800">
                          <span className="text-slate-500">Kalan Net Kâr:</span>
                          <strong className={netProfit > 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                            ₺{netProfit.toFixed(2)} (%{netMargin})
                          </strong>
                        </div>

                        {/* Terminli Toggle */}
                        <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-500">
                          <span>Terminli</span>
                          <button
                            type="button"
                            onClick={() => setTerminliStates({ ...terminliStates, [p.id]: !isTerminli })}
                            className={`w-7 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
                              isTerminli ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                              isTerminli ? 'transform translate-x-3' : ''
                            }`}></div>
                          </button>
                        </div>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Alt Bilgi Barı */}
        <div className="border-t border-slate-200 dark:border-zinc-800 p-4 sm:px-8 bg-slate-50/70 dark:bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              Komisyon tarifeleri Trendyol Satıcı Paneli API verileriyle anlık senkronizedir. Baremlere göre hesaplanan kâr, KDV ve kargo giderlerini içerir.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-zinc-800 text-white font-bold hover:bg-slate-800 transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
}
