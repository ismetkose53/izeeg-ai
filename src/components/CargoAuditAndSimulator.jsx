import React, { useState } from 'react';
import { 
  Scale, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Sliders, 
  Calculator,
  ShieldAlert,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { calculateUnitProfit, generateDisputeLetter } from '../services/marketplaceEngine';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export function CargoAuditAndSimulator({ cargoLeaks, setCargoLeaks, products }) {
  // Simülatör State'i
  const [selectedProductSku, setSelectedProductSku] = useState(products[0]?.id || 'custom');
  const [costPrice, setCostPrice] = useState(189.00);
  const [sellingPrice, setSellingPrice] = useState(399.90);
  const [commissionRate, setCommissionRate] = useState(14.5);
  const [cargoFee, setCargoFee] = useState(42.91);
  const [vatRate, setVatRate] = useState(20);
  const [adCostPerUnit, setAdCostPerUnit] = useState(15);
  const [monthlyUnits, setMonthlyUnits] = useState(300);

  // Kargo İtiraz State'i
  const [selectedLeak, setSelectedLeak] = useState(cargoLeaks[0] || null);
  const [copied, setCopied] = useState(false);

  // Ürün seçildiğinde değerleri otomatik doldur
  const handleProductSelect = (sku) => {
    setSelectedProductSku(sku);
    const prod = products.find(p => p.id === sku);
    if (prod) {
      setCostPrice(prod.costPrice);
      setSellingPrice(prod.sellingPrice);
      setCommissionRate(prod.commissionRate);
      setCargoFee(prod.cargoCost);
      setAdCostPerUnit(Math.round((prod.adSpend || 0) / (prod.monthlySalesCount || 1)));
      setMonthlyUnits(prod.monthlySalesCount || 100);
    }
  };

  // Anlık Hesaplama
  const unitCalc = calculateUnitProfit({
    costPrice,
    sellingPrice,
    commissionRate,
    cargoFee,
    vatRate,
    adCostPerUnit
  });

  const monthlyNetProfit = unitCalc.netProfit * monthlyUnits;
  const monthlyRevenue = sellingPrice * monthlyUnits;

  // Fiyat +50 TL olursa senaryosu
  const scenarioCalc = calculateUnitProfit({
    costPrice,
    sellingPrice: sellingPrice + 50,
    commissionRate,
    cargoFee,
    vatRate,
    adCostPerUnit
  });
  const scenarioExtraMonthly = (scenarioCalc.netProfit - unitCalc.netProfit) * monthlyUnits;

  // PDF İtiraz Dilekçesi İndir
  const handleDownloadPDF = (leak) => {
    if (!leak) return;
    const doc = new jsPDF();
    const letterText = generateDisputeLetter(leak, 'E-Ticaret Mağaza Yönetimi');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("RESMI KARGO DESI VE KESINTI ITIRAZ DILEKCESI", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const lines = doc.splitTextToSize(letterText, 180);
    doc.text(lines, 14, 32);
    
    doc.save(`Kargo_Desi_Itiraz_${leak.orderNumber}.pdf`);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const handleCopyText = (leak) => {
    if (!leak) return;
    const letterText = generateDisputeLetter(leak, 'E-Ticaret Mağaza Yönetimi');
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMarkResolved = (leakId) => {
    setCargoLeaks(prev => prev.map(l => l.id === leakId ? { ...l, status: 'Refunded' } : l));
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. BÖLÜM: CANLI FİYAT & KÂR SİMÜLATÖRÜ */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 lg:p-6 shadow-sm">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-[#f27a1a] uppercase tracking-wider bg-[#f27a1a]/10 px-2.5 py-0.5 rounded-full border border-[#f27a1a]/20">
              Canlı Muhasebe Motoru
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#f27a1a]" />
              "Fiyatı Değiştirsem Cebime Kaç TL Kalır?" Kâr Simülatörü
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Ürün alış maliyeti, komisyon ve kargo ücretlerine göre net kazancınızı anlık hesaplayın.
            </p>
          </div>

          {/* Hızlı Ürün Seçimi */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <span className="text-xs font-bold text-slate-700">Ürün Seç:</span>
            <select
              value={selectedProductSku}
              onChange={(e) => handleProductSelect(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#f27a1a] flex-1 lg:w-72 shadow-sm"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sellingPrice} ₺)</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Sol Kolon: Simülatör Girdi Sürgüleri (7 Kolon) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Satış Fiyatı Sürgüsü */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-black text-slate-900">Satış Fiyatı (Müşterinin Ödediği)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-28 bg-white border-2 border-[#f27a1a] rounded-lg px-2.5 py-1 text-right text-sm font-black text-slate-900 focus:outline-none"
                  />
                  <span className="text-xs font-black text-slate-700">₺</span>
                </div>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="5"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="w-full accent-[#f27a1a] cursor-pointer"
              />
            </div>

            {/* Maliyet & Komisyon Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Alış Maliyeti */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Alış Maliyeti (COGS)</label>
                  <span className="text-xs font-black text-slate-900">{costPrice} ₺</span>
                </div>
                <input
                  type="number"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                />
              </div>

              {/* Komisyon Oranı */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Komisyon Oranı</label>
                  <span className="text-xs font-black text-[#f27a1a]">%{commissionRate}</span>
                </div>
                <input
                  type="number"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                />
              </div>

              {/* Kargo Ücreti */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Kargo Ücreti (Desi)</label>
                  <span className="text-xs font-black text-blue-700">{cargoFee} ₺</span>
                </div>
                <input
                  type="number"
                  value={cargoFee}
                  onChange={(e) => setCargoFee(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                />
              </div>

              {/* Reklam Payı / Adet */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Reklam Payı (Adet Başı)</label>
                  <span className="text-xs font-black text-purple-700">{adCostPerUnit} ₺</span>
                </div>
                <input
                  type="number"
                  value={adCostPerUnit}
                  onChange={(e) => setAdCostPerUnit(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                />
              </div>

            </div>

            {/* Aylık Tahmini Satış Adedi */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-slate-900">Aylık Tahmini Satış Hacmi</div>
                <div className="text-[11px] text-slate-500">Toplam aylık kârı görmek için adet belirleyin</div>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(Number(e.target.value))}
                  className="w-24 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-right text-xs font-black text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                />
                <span className="text-xs font-bold text-slate-700">Adet</span>
              </div>
            </div>

          </div>

          {/* Sağ Kolon: Canlı Finansal Çıktı & Kâr Kartı (5 Kolon) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Büyük Kâr Çıktı Kutusu */}
            <div className={`p-5 rounded-2xl border-2 transition-all ${
              unitCalc.isLoss 
                ? 'bg-rose-50 border-rose-400'
                : 'bg-emerald-50/60 border-emerald-400'
            }`}>
              <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                {unitCalc.isLoss ? '🚨 ZARARINA SATIŞ ALARMI' : '✨ NET CEBİNE KALAN (ADET BAŞI)'}
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl lg:text-4xl font-black ${
                  unitCalc.isLoss ? 'text-rose-700' : 'text-emerald-700'
                }`}>
                  {unitCalc.netProfit.toFixed(2)} <span className="text-xl">₺</span>
                </span>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                  unitCalc.isLoss ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'
                }`}>
                  %{unitCalc.profitMarginPercent} Marj
                </span>
              </div>

              {/* Kesinti Dağılımı */}
              <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Pazar Yeri Komisyonu:</span>
                  <span className="text-[#f27a1a]">-{unitCalc.commissionAmount} ₺</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Kargo Kesintisi:</span>
                  <span className="text-blue-700">-{unitCalc.cargoFee} ₺</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>KDV Dahil Payı:</span>
                  <span className="text-slate-500">~{unitCalc.vatAmount} ₺</span>
                </div>
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Ürün Alış Maliyeti:</span>
                  <span className="text-slate-700">-{unitCalc.costPrice} ₺</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 pt-3 border-t border-slate-300 text-sm">
                  <span>Aylık Toplam Net Kazanç ({monthlyUnits} ad.):</span>
                  <span className="text-emerald-700">{monthlyNetProfit.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>
            </div>

            {/* Fiyat Artışı İpucu */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <div className="flex items-center gap-2 text-xs font-black text-purple-900 mb-1">
                <Sparkles className="w-4 h-4 text-[#f27a1a]" />
                AI Fiyat Optimizasyon Tavsiyesi
              </div>
              <p className="text-xs text-purple-950 leading-relaxed font-medium">
                Bu ürünü <strong className="text-purple-900 font-bold">{(sellingPrice + 50).toFixed(2)} ₺</strong> yaparsanız, komisyon ve KDV düşüldükten sonra aylık kasanıza fazladan <strong className="text-emerald-700 font-black">+{scenarioExtraMonthly.toLocaleString('tr-TR')} ₺</strong> net nakit kalır!
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 2. BÖLÜM: KARGO DESİ DENETÇİSİ & İTİRAZ SİHİRBAZI */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 lg:p-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#f27a1a] uppercase tracking-wider bg-[#f27a1a]/10 px-2.5 py-0.5 rounded-full border border-[#f27a1a]/20">
                Kaçak Avcısı
              </span>
              <span className="text-xs text-rose-600 font-bold">
                Toplam {cargoLeaks.filter(l => l.status === 'ActionRequired').length} Faturada Fazla Kesinti
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#f27a1a]" />
              Kargo Desi Denetçisi ve Tek Tıkla İtiraz Dilekçesi
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Kargo firmasının faturada fazla kestiği desi ücretlerini tespit edip pazar yerine resmi itiraz yapın.
            </p>
          </div>

          <div className="text-right bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
            <span className="text-[11px] text-rose-700 font-bold block">Kurtarılabilir Toplam Tutar:</span>
            <span className="text-xl font-black text-rose-700">
              {cargoLeaks.filter(l => l.status === 'ActionRequired').reduce((s, l) => s + l.leakAmount, 0).toFixed(2)} ₺
            </span>
          </div>
        </div>

        {/* Kaçak Listesi ve Dilekçe Önizleme */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Sol Kolon: Faturada Hata Yakalanan Siparişler (6 Kolon) */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-black text-slate-800 block mb-2">Hatalı Kesinti Yapılan Siparişler:</span>
            
            {cargoLeaks.map(leak => (
              <div
                key={leak.id}
                onClick={() => setSelectedLeak(leak)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedLeak?.id === leak.id
                    ? 'bg-amber-50/70 border-[#f27a1a] shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                      <span>{leak.orderNumber}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#f27a1a] text-white">
                        {leak.marketplace}
                      </span>
                    </div>
                    <div className="text-xs text-slate-800 mt-1 font-bold">{leak.productName}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-rose-600 block">+{leak.leakAmount.toFixed(2)} ₺ Kaçak</span>
                    <span className="text-[11px] text-slate-500 font-medium">{leak.carrier}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    Kayıtlı: <strong className="text-slate-900">{leak.registeredDesi} Desi</strong> → Faturada: <strong className="text-rose-600">{leak.billedDesi} Desi</strong>
                  </div>
                  {leak.status === 'Refunded' ? (
                    <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> İade Alındı
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#f27a1a] flex items-center gap-1">
                      İtiraz Et ↳
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sağ Kolon: Pazar Yerine Gönderilecek Hazır Dilekçe (6 Kolon) */}
          <div className="lg:col-span-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 p-4 flex flex-col justify-between shadow-md">
            {selectedLeak ? (
              <>
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#f27a1a]" />
                      <span className="text-xs font-black text-white">Hazır İtiraz Dilekçesi ({selectedLeak.orderNumber})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyText(selectedLeak)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold transition-all border border-slate-700"
                        title="Metni Kopyala"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Kopyalandı!' : 'Metni Kopyala'}
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(selectedLeak)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f27a1a] hover:bg-[#d9680e] text-white text-[11px] font-black shadow transition-all"
                      >
                        <Download className="w-3 h-3" />
                        PDF İndir
                      </button>
                    </div>
                  </div>

                  {/* Dilekçe Metin Alanı */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                    {generateDisputeLetter(selectedLeak, 'İsmet Bey / E-Ticaret Yönetimi')}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Pazar yerinden para yattı mı?</span>
                  <button
                    onClick={() => handleMarkResolved(selectedLeak.id)}
                    disabled={selectedLeak.status === 'Refunded'}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedLeak.status === 'Refunded'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                    }`}
                  >
                    {selectedLeak.status === 'Refunded' ? '✓ İade Alındı Olarak İşaretlendi' : 'Parayı Geri Aldım (Çözüldü)'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-xs text-slate-500 font-medium">
                Sol taraftan bir sipariş seçiniz.
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
