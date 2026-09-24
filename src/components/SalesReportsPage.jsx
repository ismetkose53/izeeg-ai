import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  FileSpreadsheet,
  GraduationCap,
  ArrowLeft,
  Flame,
  Eye,
  ShoppingBag,
  TrendingUp,
  Percent,
  Sparkles,
  ChevronRight,
  Radio,
  PackageCheck,
  AlertTriangle,
  RotateCcw,
  Truck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TRENDYOL_HOURLY_PERFORMANCE } from '../services/mockData';
import confetti from 'canvas-confetti';

export function SalesReportsPage({ products = [], onNavigateBack }) {
  const [reportSubTab, setReportSubTab] = useState('sales'); // 'sales' | 'cancel' | 'refund' | 'distribution' | 'performance'
  const [filterType, setFilterType] = useState('product'); // 'product' | 'brand' | 'category'
  const [startDate, setStartDate] = useState('2026-09-15');
  const [endDate, setEndDate] = useState('2026-09-23');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [showDetailedFilter, setShowDetailedFilter] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Filtrelenmiş Ürün Listesi
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = p.name?.toLowerCase().includes(q);
        const inBarcode = p.barcode?.toLowerCase().includes(q);
        const inSku = p.id?.toLowerCase().includes(q);
        if (!inName && !inBarcode && !inSku) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Toplam Metrik Hesaplamaları
  const totalSalesUnits = filteredProducts.reduce((sum, p) => sum + (p.monthlySalesCount || 0), 0);
  const totalNetRevenue = filteredProducts.reduce((sum, p) => sum + (p.sellingPrice * (p.monthlySalesCount || 0)), 0);
  const avgSellingPrice = totalSalesUnits > 0 ? (totalNetRevenue / totalSalesUnits) : 0;
  const totalCommission = filteredProducts.reduce((sum, p) => sum + ((p.sellingPrice * (p.monthlySalesCount || 0) * (p.commissionRate || 14)) / 100), 0);
  const avgCommissionRate = filteredProducts.length > 0 
    ? (filteredProducts.reduce((sum, p) => sum + (p.commissionRate || 14), 0) / filteredProducts.length) 
    : 14;

  const handleExportExcel = () => {
    const csvContent = 
      "UrunAdi;Barkod;Pazaryeri;SatisAdedi;BrutCiroTL;KomisyonTL;KargoTL;IadeAdedi;NetKarTL;KarMarji\n" +
      filteredProducts.map(p => 
        `"${p.name}";"${p.barcode}";"${p.marketplace}";"${p.monthlySalesCount || 0}";"${(p.sellingPrice * (p.monthlySalesCount || 0)).toFixed(2)}";"${((p.sellingPrice * (p.monthlySalesCount || 0) * p.commissionRate) / 100).toFixed(2)}";"${p.cargoCost || 42.91}";"${p.refundCount || 0}";"${p.netProfit || 0}";"%${p.profitMargin || 0}"`
      ).join("\n");

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `izeeg_satis_operasyon_raporu_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("📊 Satış ve operasyon raporu Excel formatında indirildi.");
    confetti({ particleCount: 60, spread: 60 });
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-16 font-sans text-slate-900">
      
      {/* Toast Bildirimi */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-2xl border border-slate-700 animate-fadeIn flex items-center gap-2">
          <span>✨</span> {toastMsg}
        </div>
      )}

      {/* 1. ÜST BAŞLIK, ANONS VE KILAVUZ BARI (Görsel 1 ile Birebir) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          {onNavigateBack && (
            <button 
              onClick={onNavigateBack}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Satış & Operasyon Raporları
          </h1>
        </div>

        {/* Orta Anons Mesajı */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200">
          <Flame className="w-4 h-4 text-[#f27a1a] fill-[#f27a1a]" />
          <span>Temel Metriklerim ile en önemli verilerinizi geçmişe dönük analiz edin!</span>
        </div>

        {/* Sağ Kılavuz & Yardım */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <button 
            onClick={() => showToast("Raporlar kılavuzu açıldı.")}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
          >
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Raporlar Nasıl Kullanılır?</span>
          </button>

          <button 
            onClick={() => showToast("Canlı destek ve yardım merkezi bağlandı.")}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Yardım</span>
          </button>
        </div>
      </div>

      {/* 2. GENEL PERFORMANSIM & SAATLİK CİRO KARŞILAŞTIRMASI (Görsel 1 ile Birebir) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Kart 1: Genel Performansım (Saatlik Ciro Çizgi Grafiği + 4 Metrik) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Genel Performansım</h2>
              <span className="text-[11px] text-slate-400">Son Güncelleme: 23/09/2026 - 08:39:20</span>
            </div>

            <button 
              onClick={() => showToast("Canlı performans verileri yenilendi.")}
              className="text-xs font-bold text-[#f27a1a] hover:underline flex items-center gap-1"
            >
              <Radio className="w-3.5 h-3.5 text-[#f27a1a] animate-pulse" />
              <span>Canlı Performansım &gt;</span>
            </button>
          </div>

          {/* Üst Ciro Karşılaştırması */}
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Bugünkü Net Cirom:</span>
              <div className="text-lg font-black text-slate-900">
                18.950 ₺ <span className="text-emerald-600 font-bold text-xs">(+ %14.2)</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-slate-500 font-medium block">Dünkü Net Cirom: <strong>24.044 ₺</strong></span>
              <div className="flex items-center gap-3 justify-end text-[11px] font-bold text-slate-600 mt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f27a1a]"></span> Bugün
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Dün
                </span>
              </div>
            </div>
          </div>

          {/* Grafik ve Yan Metrikler Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Sol: 24 Saatlik Karşılaştırma Grafiği */}
            <div className="md:col-span-8 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TRENDYOL_HOURLY_PERFORMANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(val) => `${val / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                    formatter={(val) => [`${val} ₺`, '']}
                  />
                  <Line type="monotone" dataKey="dun" stroke="#94a3b8" strokeWidth={2} dot={false} name="Dün" />
                  <Line type="monotone" dataKey="bugun" stroke="#f27a1a" strokeWidth={2.5} dot={{ r: 3, fill: '#f27a1a' }} name="Bugün" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sağ: 4 Temel Metrik Kartı */}
            <div className="md:col-span-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-slate-500 font-bold text-[10px]">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Görüntülenme</span>
                </div>
                <div className="text-base font-black text-slate-900 mt-1">1.559</div>
                <div className="text-[10px] text-emerald-600 font-bold">+%8.4</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-slate-500 font-bold text-[10px]">
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sipariş Adedi</span>
                </div>
                <div className="text-base font-black text-slate-900 mt-1">{totalSalesUnits}</div>
                <div className="text-[10px] text-emerald-600 font-bold">+%12</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-slate-500 font-bold text-[10px]">
                  <PackageCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Net Satış</span>
                </div>
                <div className="text-base font-black text-slate-900 mt-1">{totalSalesUnits}</div>
                <div className="text-[10px] text-emerald-600 font-bold">+%12</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1 text-slate-500 font-bold text-[10px]">
                  <Percent className="w-3.5 h-3.5 text-slate-400" />
                  <span>Dönüşüm Oranı</span>
                </div>
                <div className="text-base font-black text-slate-900 mt-1">% 4.8</div>
                <div className="text-[10px] text-emerald-600 font-bold">+%0.6</div>
              </div>
            </div>

          </div>

        </div>

        {/* Kart 2: Promosyon & İndirim Sepet Büyütme Kartı */}
        <div className="lg:col-span-4 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent rounded-xl border border-amber-300 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-amber-400 text-slate-900 rounded-xl flex items-center justify-center font-black text-xl mb-2 shadow">
              %
            </div>
            <h3 className="text-base font-black text-slate-900">
              İndirimlerle Dikkat Çek. Sepetini Büyüt!
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Kampanya ve kupon tanımlayarak siparişe dönüşüm oranınızı %20'ye, sepet başına ürün adedini 3 kata kadar artırın.
            </p>

            <div className="space-y-1.5 text-xs text-slate-800 font-semibold mt-3">
              <div className="flex items-center gap-1.5 text-orange-700">
                <span>✓</span> <strong>Kupon Getirisi (ROAS):</strong> 71.67x
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <span>✓</span> <strong>Kampanya Cirosu:</strong> 57.337 ₺
              </div>
            </div>
          </div>

          <button 
            onClick={() => showToast("İndirim ve Kupon Oluşturma Sihirbazı açıldı.")}
            className="w-full py-2.5 rounded-xl bg-[#f27a1a] hover:bg-[#d9670f] text-white font-extrabold text-xs shadow-md transition-all mt-4"
          >
            İndirim & Kupon Oluştur
          </button>
        </div>

      </div>

      {/* 3. RAPOR SEKME SEÇİCİ BARI & GELİŞMİŞ FİLTRELEME ALANI (Görsel 2 & 3 ile Birebir) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        
        {/* Alt Sekmeler */}
        <div className="flex items-center gap-6 pb-3 border-b border-slate-200 text-xs font-bold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setReportSubTab('sales')}
            className={`uppercase pb-2 border-b-2 transition-colors whitespace-nowrap ${
              reportSubTab === 'sales' ? 'text-[#f27a1a] border-[#f27a1a]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            SATIŞ RAPORLARI
          </button>
          <button
            onClick={() => setReportSubTab('cancel')}
            className={`uppercase pb-2 border-b-2 transition-colors whitespace-nowrap ${
              reportSubTab === 'cancel' ? 'text-[#f27a1a] border-[#f27a1a]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            İPTAL RAPORLARI
          </button>
          <button
            onClick={() => setReportSubTab('refund')}
            className={`uppercase pb-2 border-b-2 transition-colors whitespace-nowrap ${
              reportSubTab === 'refund' ? 'text-[#f27a1a] border-[#f27a1a]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            İADE RAPORLARI
          </button>
          <button
            onClick={() => setReportSubTab('distribution')}
            className={`uppercase pb-2 border-b-2 transition-colors whitespace-nowrap ${
              reportSubTab === 'distribution' ? 'text-[#f27a1a] border-[#f27a1a]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            SİPARİŞ DAĞILIM RAPORU
          </button>
          <button
            onClick={() => setReportSubTab('performance')}
            className={`uppercase pb-2 border-b-2 transition-colors whitespace-nowrap ${
              reportSubTab === 'performance' ? 'text-[#f27a1a] border-[#f27a1a]' : 'border-transparent hover:text-slate-900'
            }`}
          >
            OPERASYON PERFORMANS METRİKLERİ
          </button>
        </div>

        {/* Filtre Tipi Seçimi & Arama Kutuları */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-1">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">Raporu Filtrele:</span>
            <button
              onClick={() => setFilterType('product')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                filterType === 'product' ? 'bg-[#f27a1a] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Ürün Bazlı
            </button>
            <button
              onClick={() => setFilterType('brand')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                filterType === 'brand' ? 'bg-[#f27a1a] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Marka Bazlı
            </button>
            <button
              onClick={() => setFilterType('category')}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                filterType === 'category' ? 'bg-[#f27a1a] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Kategori Bazlı
            </button>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün adı, barkod veya model ara..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="ALL">Tüm Kategoriler</option>
              <option value="Ayakkabı">Ayakkabı</option>
              <option value="Spor Giyim">Spor Giyim</option>
              <option value="Spor & Outdoor">Spor & Outdoor</option>
              <option value="Giyim">Giyim</option>
              <option value="Dış Giyim">Dış Giyim</option>
            </select>

            <button
              onClick={handleExportExcel}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm flex-shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>

        </div>

        {/* 4. SEÇİLEN SEKMENİN DİNAMİK RAPOR TABLOSU */}
        <div className="overflow-x-auto pt-2">
          
          {/* A) SATIŞ RAPORLARI TABLOSU */}
          {reportSubTab === 'sales' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-bold bg-slate-50 text-[11px]">
                  <th className="py-3 px-3">Ürün Bilgileri</th>
                  <th className="py-3 px-3 text-right">Net Satış Adedi ⬍</th>
                  <th className="py-3 px-3 text-right">Net Ciro ⓘ</th>
                  <th className="py-3 px-3 text-right">Toplam Komisyon ⓘ</th>
                  <th className="py-3 px-3 text-right">Ort. Komisyon Tutarı</th>
                  <th className="py-3 px-3 text-right">Komisyon Oranı</th>
                  <th className="py-3 px-3 text-right">Satış Fiyatı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(p => {
                  const totalRev = p.sellingPrice * (p.monthlySalesCount || 0);
                  const totalCom = (totalRev * p.commissionRate) / 100;
                  const avgCom = (p.sellingPrice * p.commissionRate) / 100;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{p.barcode} • {p.variant}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{p.monthlySalesCount || 0} Adet</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{totalRev.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</td>
                      <td className="py-3 px-3 text-right text-slate-700">{totalCom.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</td>
                      <td className="py-3 px-3 text-right text-slate-700">{avgCom.toFixed(2)} ₺</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-700">% {p.commissionRate.toFixed(1)}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">{p.sellingPrice.toFixed(2)} ₺</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* B) İPTAL RAPORLARI TABLOSU */}
          {reportSubTab === 'cancel' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-bold bg-slate-50 text-[11px]">
                  <th className="py-3 px-3">Ürün</th>
                  <th className="py-3 px-3 text-right">İptal Adedi</th>
                  <th className="py-3 px-3 text-right">İptal Edilen Ciro</th>
                  <th className="py-3 px-3 text-right">İptal Oranı</th>
                  <th className="py-3 px-4">Başlıca İptal Nedeni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{p.name} ({p.variant})</td>
                    <td className="py-3 px-3 text-right font-bold text-rose-600">{Math.floor((p.refundCount || 4) / 2)} Adet</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">{(p.sellingPrice * Math.floor((p.refundCount || 4) / 2)).toFixed(2)} ₺</td>
                    <td className="py-3 px-3 text-right font-semibold text-rose-600">% 1.2</td>
                    <td className="py-3 px-4 text-slate-600">Müşteri teslimat öncesi vazgeçti</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* C) İADE RAPORLARI TABLOSU */}
          {reportSubTab === 'refund' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-700 font-bold bg-slate-50 text-[11px]">
                  <th className="py-3 px-3">Ürün</th>
                  <th className="py-3 px-3 text-right">İade Adedi</th>
                  <th className="py-3 px-3 text-right">İade Oranı</th>
                  <th className="py-3 px-3 text-right">Çift Kargo Maliyet Kaybı</th>
                  <th className="py-3 px-4">En Çok Bildirilen İade Sebebi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{p.name} ({p.variant})</td>
                    <td className="py-3 px-3 text-right font-bold text-rose-600">{p.refundCount || 0} Adet</td>
                    <td className="py-3 px-3 text-right font-bold text-rose-600">% {p.returnRate || 3.5}</td>
                    <td className="py-3 px-3 text-right font-black text-rose-700">{((p.refundCount || 0) * 85.82).toFixed(2)} ₺</td>
                    <td className="py-3 px-4 text-slate-600">Beden / Kalıp uymadı ("1 Beden Büyük Alınmalı")</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* D) SİPARİŞ DAĞILIM RAPORU */}
          {reportSubTab === 'distribution' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div className="text-xs font-bold text-orange-700 uppercase">Trendyol</div>
                <div className="text-xl font-black text-slate-900 mt-1">% 62.4</div>
                <div className="text-xs text-slate-600 mt-0.5">Payı: 2.598.000 ₺ ciro</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-xs font-bold text-amber-700 uppercase">Hepsiburada</div>
                <div className="text-xl font-black text-slate-900 mt-1">% 21.8</div>
                <div className="text-xs text-slate-600 mt-0.5">Payı: 907.900 ₺ ciro</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-xs font-bold text-blue-700 uppercase">Amazon TR</div>
                <div className="text-xl font-black text-slate-900 mt-1">% 11.2</div>
                <div className="text-xs text-slate-600 mt-0.5">Payı: 466.400 ₺ ciro</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-xs font-bold text-emerald-700 uppercase">Kendi Sitem (Shopify)</div>
                <div className="text-xl font-black text-slate-900 mt-1">% 4.6</div>
                <div className="text-xs text-slate-600 mt-0.5">Payı: 191.500 ₺ ciro</div>
              </div>
            </div>
          )}

          {/* E) OPERASYON PERFORMANS METRİKLERİ */}
          {reportSubTab === 'performance' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold">Ortalama Kargoya Verme Süresi</div>
                <div className="text-xl font-black text-emerald-600 mt-1">14.2 Saat</div>
                <div className="text-[11px] text-slate-500">Hedef: &lt; 24 saat (Başarılı)</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold">Müşteri Memnuniyet & Mağaza Puanı</div>
                <div className="text-xl font-black text-amber-500 mt-1">9.8 / 10 ⭐</div>
                <div className="text-[11px] text-slate-500">Kusursuz Hizmet Rozeti</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500 font-bold">Kargo Desi Uyuşmazlık Oranı</div>
                <div className="text-xl font-black text-blue-600 mt-1">% 2.1</div>
                <div className="text-[11px] text-slate-500">3 Fatura İtiraz Edildi</div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
