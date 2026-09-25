import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Search, 
  Check, 
  Sparkles, 
  Zap, 
  AlertTriangle,
  ArrowUpDown,
  Send,
  Save,
  HelpCircle,
  Calculator,
  Percent,
  Truck,
  TrendingUp,
  DollarSign,
  Layers,
  Award,
  Flame,
  Calendar,
  Info,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CARGO_DESI_PRICING_TIERS, 
  CATEGORY_COMMISSION_TIERS, 
  PLUS_TARIFF_TIERS, 
  HAKEDIS_DATA 
} from '../services/mockData';
import { PageGuideButton } from './PageHelpGuideModal';

export function ProProfitTable({ products, onNavigateToOrders, onOpenGuide }) {
  // Sub-tabs: 'main' | 'simulator' | 'cargo' | 'plus' | 'commission' | 'profitable' | 'flash' | 'hakedis' | 'kilavuz'
  const [activeSubTab, setActiveSubTab] = useState('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [exportNetProfit, setExportNetProfit] = useState(false);
  const [missingDataOnly, setMissingDataOnly] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Kâr Simülatörü State'i (Buraya taşındı!)
  const [simSelectedProduct, setSimSelectedProduct] = useState(products[0]?.id || 'SKU-001');
  const currentProduct = products.find(p => p.id === simSelectedProduct) || products[0];

  const [simSellingPrice, setSimSellingPrice] = useState(currentProduct?.sellingPrice || 399.90);
  const [simCostPrice, setSimCostPrice] = useState(currentProduct?.costPrice || 189.00);
  const [simCommissionRate, setSimCommissionRate] = useState(currentProduct?.commissionRate || 14.5);
  const [simCargoCost, setSimCargoCost] = useState(currentProduct?.cargoCost || 42.91);
  const [simAdShare, setSimAdShare] = useState(15.00);
  const [simSalesVolume, setSimSalesVolume] = useState(300);

  // Simülatör Hesaplama
  const simCommission = (simSellingPrice * simCommissionRate) / 100;
  const simVat = (simSellingPrice * 20) / 120; // %20 KDV
  const simNetProfitUnit = simSellingPrice - simCostPrice - simCommission - simCargoCost - simAdShare;
  const simProfitMargin = simSellingPrice > 0 ? ((simNetProfitUnit / simSellingPrice) * 100).toFixed(1) : 0;
  const simMonthlyNetTotal = simNetProfitUnit * simSalesVolume;

  const handleProductSelectForSim = (prodId) => {
    setSimSelectedProduct(prodId);
    const p = products.find(x => x.id === prodId);
    if (p) {
      setSimSellingPrice(p.sellingPrice);
      setSimCostPrice(p.costPrice);
      setSimCommissionRate(p.commissionRate);
      setSimCargoCost(p.cargoCost);
    }
  };

  // Filtreleme
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (activeSubTab === 'profitable' && p.profitMargin < 20) return false;
      if (activeSubTab === 'flash' && p.monthlySalesCount < 150) return false;
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (missingDataOnly && p.costPrice > 0) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.barcode.toLowerCase().includes(q) ||
          p.variant.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, activeSubTab, selectedCategory, missingDataOnly, searchQuery]);

  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
    confetti({ particleCount: 75, spread: 65 });
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    showToast("💾 Ürün maliyet ve fiyat değişiklikleri yerel veritabanına kaydedildi!");
  };

  const handleSendToTrendyol = () => {
    showToast("🚀 Fiyat ve maliyet güncellemeleri tüm pazar yerlerine (Trendyol, Hepsiburada, Amazon) başarıyla aktarıldı!");
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      
      {/* 1. Ana Panel Kartı */}
      <div className="ty-panel-card p-5 lg:p-6">
        
        {/* Üst Başlık & Mağaza Adı */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f27a1a] to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              %
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Pro Maliyet & Net Kârlılık Motoru
                <span className="text-xs bg-[#f27a1a] text-white font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                  PRO v2.1
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Birim maliyet, komisyon, kargo, KDV ve reklam payını hesaplayarak saf kârınızı belirleyin.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenGuide && (
              <PageGuideButton 
                onClick={onOpenGuide} 
                label="💡 Nasıl Kullanılır?" 
              />
            )}
            <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-medium">
              Aktif Mağaza: <strong className="text-slate-900">E-Ticaret Satıcı Paneli</strong>
            </div>
          </div>
        </div>

        {/* 2. TAM ÇALIŞAN İKİNCİL MENÜ SEKME ÇUBUĞU (Görsel 2'de işaretlenen alan) */}
        <div className="flex items-center gap-1.5 pt-4 pb-3 border-b border-slate-200 text-xs font-bold overflow-x-auto no-scrollbar">
          
          <button 
            onClick={() => setActiveSubTab('main')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'main' ? 'bg-[#f27a1a] text-white shadow-sm font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ana Tablo & Maliyetler</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('simulator')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'simulator' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm font-black' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Kâr & Fiyat Simülatörü</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('cargo')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'cargo' ? 'bg-[#f27a1a] text-white shadow-sm font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Kargo/Desi Tarifeleri</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('commission')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'commission' ? 'bg-[#f27a1a] text-white shadow-sm font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Komisyon Tarifeleri</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('plus')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'plus' ? 'bg-[#f27a1a] text-white shadow-sm font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Plus / Premium Tarifeleri</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('profitable')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'profitable' ? 'bg-[#f27a1a] text-white shadow-sm font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Avantajlı Şampiyonlar</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('flash')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'flash' ? 'bg-[#f27a1a] text-white shadow-sm font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>Flaş Ürünler</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('hakedis')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'hakedis' ? 'bg-[#f27a1a] text-white shadow-sm font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Hakediş & Cari</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('kilavuz')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'kilavuz' ? 'bg-[#f27a1a] text-white shadow-sm font-black' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kılavuz</span>
          </button>

        </div>

        {/* 3. İLGİLİ ALT SEKME İÇERİĞİ */}

        {/* SEKME 1: KÂR & FİYAT SİMÜLATÖRÜ */}
        {activeSubTab === 'simulator' && (
          <div className="space-y-5 pt-4 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    “Fiyatı Değiştirirsem Cebime Kaç TL Kalır?” Canlı Kâr Simülatörü
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fiyatı kaydırın, komisyon, desi ve reklam maliyetine göre net kâr marjınızı anında görün.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Ürün Seç:</span>
                  <select
                    value={simSelectedProduct}
                    onChange={(e) => handleProductSelectForSim(e.target.value)}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#f27a1a]"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sellingPrice} ₺)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Simülatör Girişleri & Sonuç Paneli Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-center">
                
                {/* Sol Taraf: Slider & Form Alanları */}
                <div className="lg:col-span-7 space-y-4">
                  
                  {/* Fiyat Slider */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-800 uppercase tracking-wide">
                        Yeni Satış Fiyatı (Müşterinin Ödediği)
                      </label>
                      <span className="text-base font-black text-[#f27a1a] bg-orange-50 px-3 py-0.5 rounded-lg border border-orange-200">
                        {simSellingPrice.toFixed(2)} ₺
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={1500}
                      step={5}
                      value={simSellingPrice}
                      onChange={(e) => setSimSellingPrice(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#f27a1a]"
                    />
                  </div>

                  {/* 4'lü Parametre Kutuları */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">Alış Maliyeti (COGS)</span>
                      <input
                        type="number"
                        value={simCostPrice}
                        onChange={(e) => setSimCostPrice(parseFloat(e.target.value) || 0)}
                        className="w-full font-black text-xs text-slate-900 mt-1 focus:outline-none"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">Komisyon Oranı (%)</span>
                      <input
                        type="number"
                        value={simCommissionRate}
                        onChange={(e) => setSimCommissionRate(parseFloat(e.target.value) || 0)}
                        className="w-full font-black text-xs text-slate-900 mt-1 focus:outline-none"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">Kargo Ücreti (₺)</span>
                      <input
                        type="number"
                        value={simCargoCost}
                        onChange={(e) => setSimCargoCost(parseFloat(e.target.value) || 0)}
                        className="w-full font-black text-xs text-slate-900 mt-1 focus:outline-none"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">Reklam Payı (Adet Başı)</span>
                      <input
                        type="number"
                        value={simAdShare}
                        onChange={(e) => setSimAdShare(parseFloat(e.target.value) || 0)}
                        className="w-full font-black text-xs text-slate-900 mt-1 focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                {/* Sağ Taraf: Canlı Kasa Sonucu Kartı */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#1e2a38] text-white rounded-3xl p-5 space-y-4 shadow-xl border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Birim Net Kâr (Adet Başı)</span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      simNetProfitUnit > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      %{simProfitMargin} Marj
                    </span>
                  </div>

                  <div className="text-3xl font-black text-emerald-400">
                    {simNetProfitUnit.toFixed(2)} ₺
                  </div>

                  {/* Kalem Kalem Kesintiler */}
                  <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-700/80">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Pazar Yeri Komisyonu:</span>
                      <span className="text-rose-400 font-bold">-{simCommission.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kargo Kesintisi:</span>
                      <span className="text-rose-400 font-bold">-{simCargoCost.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tahmini KDV Payı:</span>
                      <span className="text-rose-400 font-bold">-{simVat.toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ürün Alış Maliyeti:</span>
                      <span className="text-rose-400 font-bold">-{simCostPrice.toFixed(2)} ₺</span>
                    </div>
                  </div>

                  {/* Aylık Toplam Net */}
                  <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Aylık Tahmini ({simSalesVolume} Satışta):</span>
                      <strong className="text-base font-black text-white">
                        {simMonthlyNetTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </strong>
                    </div>

                    <button 
                      onClick={() => showToast(`✅ ${currentProduct?.name || 'Ürün'} için yeni satış fiyatı (${simSellingPrice} ₺) pazar yerine başarıyla uygulandı!`)}
                      className="px-4 py-2 rounded-xl bg-[#f27a1a] hover:bg-orange-600 text-white font-black text-xs shadow transition-all"
                    >
                      Fiyatı Uygula
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* SEKME 2: KARGO & DESİ FİYAT TARİFELERİ */}
        {activeSubTab === 'cargo' && (
          <div className="space-y-4 pt-4 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h3 className="text-sm font-black text-slate-900 mb-1">Pazaryerleri Güncel Kargo & Desi Fiyat Tarifeleri (2026)</h3>
              <p className="text-xs text-slate-500 mb-3">Pazar yerlerinin taşıyıcı firmalarla olan anlaşmalı KDV dahil birim taşıma baremleri.</p>

              <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="py-2.5 px-3">Desi Aralığı</th>
                    <th className="py-2.5 px-3 text-right">Trendyol Express</th>
                    <th className="py-2.5 px-3 text-right">HepsiJET</th>
                    <th className="py-2.5 px-3 text-right">Aras Kargo</th>
                    <th className="py-2.5 px-3 text-right">Yurtiçi Kargo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CARGO_DESI_PRICING_TIERS.map((tier, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{tier.desiRange}</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">{tier.trendyolExpress.toFixed(2)} ₺</td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">{tier.hepsiJet.toFixed(2)} ₺</td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-700">{tier.arasKargo.toFixed(2)} ₺</td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-700">{tier.yurticiKargo.toFixed(2)} ₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 3: KOMİSYON TARİFELERİ */}
        {activeSubTab === 'commission' && (
          <div className="space-y-4 pt-4 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h3 className="text-sm font-black text-slate-900 mb-1">Kategori Bazlı Pazar Yeri Komisyon Oranları</h3>
              <p className="text-xs text-slate-500 mb-3">Tüm pazar yerlerinin kategorilere göre uyguladığı resmi komisyon kesintileri.</p>

              <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="py-2.5 px-3">Kategori Adı</th>
                    <th className="py-2.5 px-3 text-center">Trendyol</th>
                    <th className="py-2.5 px-3 text-center">Hepsiburada</th>
                    <th className="py-2.5 px-3 text-center">Amazon TR</th>
                    <th className="py-2.5 px-3 text-center">N11</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CATEGORY_COMMISSION_TIERS.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{c.category}</td>
                      <td className="py-2.5 px-3 text-center font-black text-[#f27a1a]">{c.trendyol}</td>
                      <td className="py-2.5 px-3 text-center font-black text-[#ff6000]">{c.hepsiburada}</td>
                      <td className="py-2.5 px-3 text-center font-black text-[#ff9900]">{c.amazon}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">{c.n11}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 4: PLUS / PREMIUM PROGRAMLARI */}
        {activeSubTab === 'plus' && (
          <div className="space-y-4 pt-4 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLUS_TARIFF_TIERS.map((plus, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border-2 border-amber-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-black text-sm">⭐</span>
                    <h4 className="text-sm font-black text-slate-900">{plus.program}</h4>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 font-bold">
                    🎁 Avantaj: {plus.benefit}
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Katılım Şartı:</strong> {plus.condition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEKME 5: HAKEDİŞ & CARİ EKSTRE */}
        {activeSubTab === 'hakedis' && (
          <div className="space-y-4 pt-4 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h3 className="text-sm font-black text-slate-900 mb-1">Pazar Yeri Vadesi Gelen Hakediş Ödemeleri</h3>
              <p className="text-xs text-slate-500 mb-3">Banka hesabınıza aktarılması planlanan net tahsilat tutarları.</p>

              <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="py-2.5 px-3">Pazar Yeri</th>
                    <th className="py-2.5 px-3">Dönem</th>
                    <th className="py-2.5 px-3 text-right">Brüt Tutar</th>
                    <th className="py-2.5 px-3 text-right">Komisyon Kesintisi</th>
                    <th className="py-2.5 px-3 text-right">Kargo Kesintisi</th>
                    <th className="py-2.5 px-3 text-right font-black text-emerald-400">Net Hakediş</th>
                    <th className="py-2.5 px-3 text-center">Ödeme Vadesi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {HAKEDIS_DATA.map((h, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-800">{h.platform}</td>
                      <td className="py-3 px-3 text-slate-600">{h.period}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{h.grossAmount.toLocaleString('tr-TR')} ₺</td>
                      <td className="py-3 px-3 text-right text-rose-600">-{h.commissionDeduction.toLocaleString('tr-TR')} ₺</td>
                      <td className="py-3 px-3 text-right text-rose-600">-{h.cargoDeduction.toLocaleString('tr-TR')} ₺</td>
                      <td className="py-3 px-3 text-right font-black text-emerald-700 text-sm">+{h.netPayout.toLocaleString('tr-TR')} ₺</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">{h.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEKME 6: KILAVUZ & İPUÇLARI */}
        {activeSubTab === 'kilavuz' && (
          <div className="space-y-4 pt-4 animate-fadeIn">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h3 className="text-base font-black text-slate-900">E-Ticarette Net Kârı Katlama Kılavuzu</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 block font-bold text-sm">1. Küçük Fiyat Artışlarının Gücü</strong>
                  <p>Maliyeti 189 TL olan 399 TL'lik ürünü 439 TL (+40 TL) yaptığınızda komisyon ve KDV çıksa dahi net kârınız birim başına +25 TL artar.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 block font-bold text-sm">2. Desi Kaçaklarını Durdurun</strong>
                  <p>Kargo firmaları 2 desi ürüne 5 desi fatura kestiğinde ürün kârınızın yarısı yok olur. Kargo Denetçisi sekmesini düzenli kontrol edin.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANA TABLO (VARSAYILAN VEYA FİLTRELİ) */}
        {(activeSubTab === 'main' || activeSubTab === 'profitable' || activeSubTab === 'flash') && (
          <div className="space-y-4 pt-2">
            
            {/* 8 Durum Rozet Kartı */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 my-3">
              <div className="ty-pill-stat border-slate-300">
                <span className="text-[11px] font-bold text-slate-600">📦 Toplam Ürün</span>
                <span className="text-lg font-black text-slate-900 mt-0.5">{products.length}</span>
              </div>

              <div className="ty-pill-stat border-emerald-300 bg-emerald-50/50">
                <span className="text-[11px] font-bold text-emerald-700">🟢 Aktif</span>
                <span className="text-lg font-black text-emerald-700 mt-0.5">{products.filter(p => p.stock > 0).length}</span>
              </div>

              <div className="ty-pill-stat border-emerald-400 bg-emerald-100/40">
                <span className="text-[11px] font-bold text-emerald-800">✅ Kârlı</span>
                <span className="text-lg font-black text-emerald-800 mt-0.5">{products.filter(p => p.status === 'profitable').length}</span>
              </div>

              <div className="ty-pill-stat border-rose-300 bg-rose-50/60">
                <span className="text-[11px] font-bold text-rose-700">❌ Zararlı</span>
                <span className="text-lg font-black text-rose-700 mt-0.5">{products.filter(p => p.status === 'losing').length}</span>
              </div>

              <div className="ty-pill-stat border-slate-300 bg-slate-100/60">
                <span className="text-[11px] font-bold text-slate-700">➖ Başa Baş</span>
                <span className="text-lg font-black text-slate-800 mt-0.5">{products.filter(p => p.status === 'break-even').length}</span>
              </div>

              <div className="ty-pill-stat border-blue-300 bg-blue-50/60">
                <span className="text-[11px] font-bold text-blue-700">📊 Ort. Marj</span>
                <span className="text-lg font-black text-blue-700 mt-0.5">%22.4</span>
              </div>

              <div className="ty-pill-stat border-amber-300 bg-amber-50/60">
                <span className="text-[11px] font-bold text-amber-700">⚠️ Desi Kaçağı</span>
                <span className="text-lg font-black text-amber-700 mt-0.5">3</span>
              </div>

              <div className="ty-pill-stat border-rose-300 bg-rose-50/40">
                <span className="text-[11px] font-bold text-rose-700">📦 Düşük Stok</span>
                <span className="text-lg font-black text-rose-700 mt-0.5">{products.filter(p => p.stock < 10).length}</span>
              </div>
            </div>

            {/* Arama, Kategori ve Aksiyon Çubuğu */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 my-3">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Barkod, Stok Kodu, Ürün Adı Ara..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-500 font-medium focus:outline-none focus:border-[#f27a1a] focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#f27a1a] w-full sm:w-auto"
              >
                <option value="ALL">Tüm Kategoriler ▼</option>
                <option value="Ayakkabı">Ayakkabı</option>
                <option value="Spor Giyim">Spor Giyim</option>
                <option value="Spor & Outdoor">Spor & Outdoor</option>
                <option value="Dış Giyim">Dış Giyim</option>
              </select>

              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Kaydedildi!' : 'Değişiklikleri Kaydet'}</span>
              </button>

              <button
                onClick={handleSendToTrendyol}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#151e2a] hover:bg-slate-900 text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <span>🚀</span>
                <span>Pazaryerlerine Gönder</span>
              </button>
            </div>

            {/* Veri Tablosu */}
            <div className="border border-slate-300 rounded-2xl overflow-hidden mt-3 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="ty-table-header border-b border-slate-800">
                      <th className="py-3 px-3">Barkod & SKU</th>
                      <th className="py-3 px-3">Ürün Adı & Varyant</th>
                      <th className="py-3 px-3 text-center">Stok</th>
                      <th className="py-3 px-3 text-right">Alış (₺)</th>
                      <th className="py-3 px-3 text-right">Satış (₺)</th>
                      <th className="py-3 px-3 text-center">Kms%</th>
                      <th className="py-3 px-3 text-center">KDV%</th>
                      <th className="py-3 px-3 text-center">Desi</th>
                      <th className="py-3 px-3 text-right">Kargo</th>
                      <th className="py-3 px-3 text-right bg-emerald-950/40 text-emerald-300 font-black">Net Kâr</th>
                      <th className="py-3 px-3 text-right bg-blue-950/40 text-blue-300 font-black">Kâr Marjı</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-14 text-center text-slate-500 bg-slate-50/70">
                          <div className="max-w-sm mx-auto space-y-2">
                            <div className="font-black text-sm text-slate-900">🟢 Ürün Listesi Boş (Canlı Satış Modu)</div>
                            <p className="text-xs text-slate-500">Ürün eklemek için Excel yükleyebilir veya 'Çok Kanallı Ürün Yükleme' modülünü kullanabilirsiniz.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600 font-medium">
                            {p.barcode}
                            <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="font-extrabold text-slate-900 text-xs">{p.name}</div>
                            <div className="text-[11px] text-slate-500">{p.variant} • <span className="text-[#f27a1a] font-bold">{p.marketplace}</span></div>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className={`font-black text-xs ${
                              p.stock === 0 ? 'text-rose-600' : p.stock < 10 ? 'text-rose-500 font-bold' : 'text-emerald-700'
                            }`}>
                              {p.stock}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right text-slate-800 font-bold">
                            {p.costPrice?.toFixed(2) || '0.00'} ₺
                          </td>

                          <td className="py-3 px-3 text-right font-black text-slate-900">
                            {p.sellingPrice?.toFixed(2) || '0.00'} ₺
                          </td>

                          <td className="py-3 px-3 text-center text-slate-800 font-bold">
                            %{p.commissionRate || 15}
                          </td>

                          <td className="py-3 px-3 text-center text-slate-700 font-medium">
                            %{p.vatRate || 20}
                          </td>

                          <td className="py-3 px-3 text-center text-slate-900 font-black">
                            {p.desi || 1}
                          </td>

                          <td className="py-3 px-3 text-right text-slate-800 font-semibold">
                            {p.cargoCost?.toFixed(2) || '42.91'} ₺
                          </td>

                          <td className={`py-3 px-3 text-right font-black text-xs ${
                            (p.netProfit || 0) > 0 ? 'text-emerald-700 bg-emerald-50/60' : 'text-rose-700 bg-rose-50/80'
                          }`}>
                            {(p.netProfit || 0) > 0 ? `+${p.netProfit.toFixed(2)} ₺` : `${(p.netProfit || 0).toFixed(2)} ₺`}
                          </td>

                          <td className={`py-3 px-3 text-right font-black text-xs ${
                            (p.profitMargin || 0) > 0 ? 'text-emerald-700 bg-emerald-50/60' : 'text-rose-700 bg-rose-50/80'
                          }`}>
                            %{p.profitMargin || 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
