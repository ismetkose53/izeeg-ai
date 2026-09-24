import React, { useState } from 'react';
import { 
  Upload, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  X, 
  Plus, 
  Layers, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Tag, 
  Percent, 
  Calculator, 
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  generateTrendyolOfficialCsvContent, 
  generateIzeegMasterCsvContent, 
  parseUploadedProductFile 
} from '../services/excelImportService';

export function ProductUploadModal({ 
  isOpen, 
  onClose, 
  onProductsImported 
}) {
  // Sekme: 'EXCEL_IMPORT' | 'MANUAL_ADD'
  const [activeMode, setActiveMode] = useState('EXCEL_IMPORT');
  
  // Yükleme & Parse State'leri
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [importResult, setImportResult] = useState(null); // { formatType, totalCount, products, hasMissingCost }
  const [isProcessing, setIsProcessing] = useState(false);

  // Toplu Maliyet Çarpanı Oranı
  const [bulkCostRatio, setBulkCostRatio] = useState(40); // %40 maliyet varsayılanı
  const [bulkSupplierName, setBulkSupplierName] = useState('Merter Toptan Tekstil');

  // Manuel Tekli Ürün Form State'i
  const [manualForm, setManualForm] = useState({
    name: '',
    barcode: '',
    sku: '',
    supplier: '',
    costPrice: '',
    sellingPrice: '',
    stock: '',
    color: '',
    size: '',
    category: 'Kadın Giyim',
    vatRate: '10',
    desi: '2',
    commissionRate: '14',
    shelfLocation: 'A-01',
    marketplace: 'Trendyol',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200'
  });

  if (!isOpen) return null;

  // Şablon İndirme İşlemleri
  const handleDownloadCsv = (type) => {
    let content = '';
    let filename = '';

    if (type === 'TRENDYOL') {
      content = generateTrendyolOfficialCsvContent();
      filename = `Trendyol_Resmi_Urun_Listesi_Sablonu_${Date.now()}.csv`;
    } else {
      content = generateIzeegMasterCsvContent();
      filename = `izeeg_AI_Tam_Donanimli_Urun_Maliyet_Sablonu_${Date.now()}.csv`;
    }

    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    confetti({ particleCount: 50, spread: 60 });
  };

  // Dosya Yükleme ve Parse
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    setIsProcessing(true);
    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result = parseUploadedProductFile(content);
        setImportResult(result);
      }
      setIsProcessing(false);
      confetti({ particleCount: 70, spread: 70 });
    };
    reader.readAsText(file, 'utf-8');
  };

  // Toplu Maliyet Uygula (Trendyol Çıktısı İçin)
  const handleApplyBulkCost = () => {
    if (!importResult || !importResult.products) return;

    const ratio = Number(bulkCostRatio) / 100;
    const updated = importResult.products.map(p => {
      const cost = Number((p.sellingPrice * ratio).toFixed(2));
      const comm = (p.sellingPrice * (p.commissionRate || 14)) / 100;
      const cargo = (p.desi || 2) <= 2 ? 42.91 : 58.00;
      const netProfit = Number((p.sellingPrice - cost - comm - cargo).toFixed(2));
      const profitMargin = p.sellingPrice > 0 ? Number(((netProfit / p.sellingPrice) * 100).toFixed(1)) : 0;

      return {
        ...p,
        costPrice: cost,
        supplier: bulkSupplierName || p.supplier,
        netProfit,
        profitMargin,
        isCostMissing: false
      };
    });

    setImportResult({
      ...importResult,
      products: updated,
      hasMissingCost: false
    });

    confetti({ particleCount: 60, spread: 60 });
  };

  // Satır Bazlı Maliyet veya Tedarikçi Güncelleme
  const handleRowChange = (index, field, value) => {
    if (!importResult || !importResult.products) return;

    const updated = [...importResult.products];
    const current = { ...updated[index], [field]: value };

    if (field === 'costPrice' || field === 'sellingPrice') {
      const cost = Number(field === 'costPrice' ? value : current.costPrice) || 0;
      const selling = Number(field === 'sellingPrice' ? value : current.sellingPrice) || 0;
      const comm = (selling * (current.commissionRate || 14)) / 100;
      const cargo = (current.desi || 2) <= 2 ? 42.91 : 58.00;
      current.netProfit = Number((selling - cost - comm - cargo).toFixed(2));
      current.profitMargin = selling > 0 ? Number(((current.netProfit / selling) * 100).toFixed(1)) : 0;
      current.isCostMissing = false;
    }

    updated[index] = current;
    setImportResult({ ...importResult, products: updated });
  };

  // İçe Aktarmayı Tamamla ve Sisteme Kaydet
  const handleFinalSave = () => {
    if (!importResult || !importResult.products || importResult.products.length === 0) return;

    if (onProductsImported) {
      onProductsImported(importResult.products);
    }
    onClose();
    confetti({ particleCount: 120, spread: 90 });
  };

  // Manuel Tek Ürün Kaydetme
  const handleSaveManualProduct = (e) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.sellingPrice) return;

    const selling = Number(manualForm.sellingPrice) || 0;
    const cost = Number(manualForm.costPrice) || (selling * 0.4);
    const commRate = Number(manualForm.commissionRate) || 14;
    const comm = (selling * commRate) / 100;
    const desi = Number(manualForm.desi) || 2;
    const cargo = desi <= 2 ? 42.91 : desi <= 5 ? 58.00 : 75.00;
    const netProfit = Number((selling - cost - comm - cargo).toFixed(2));
    const profitMargin = selling > 0 ? Number(((netProfit / selling) * 100).toFixed(1)) : 0;

    const newProduct = {
      id: manualForm.sku || `SKU-${Date.now().toString().slice(-4)}`,
      barcode: manualForm.barcode || `868000${Date.now().toString().slice(-4)}`,
      name: manualForm.name,
      supplier: manualForm.supplier || 'Doğrudan İmalat',
      costPrice: cost,
      sellingPrice: selling,
      stock: parseInt(manualForm.stock, 10) || 10,
      color: manualForm.color || 'Standart',
      variant: manualForm.size || 'Standart',
      size: manualForm.size || 'Standart',
      category: manualForm.category,
      vatRate: parseInt(manualForm.vatRate, 10) || 10,
      desi,
      commissionRate: commRate,
      shelfLocation: manualForm.shelfLocation || 'A-01',
      warehouse: 'Ana Merkez Depo',
      marketplace: manualForm.marketplace || 'Trendyol',
      image: manualForm.image,
      netProfit,
      profitMargin,
      isCostMissing: false
    };

    if (onProductsImported) {
      onProductsImported([newProduct]);
    }
    onClose();
    confetti({ particleCount: 100, spread: 80 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp text-slate-900 font-sans">
        
        {/* Modal Üst Başlık */}
        <div className="p-5 lg:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f27a1a] text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded border border-orange-200">
                  Donanımlı Ürün & Maliyet Motoru
                </span>
                <span className="text-xs text-slate-500 font-bold">• izeeg AI</span>
              </div>
              <h2 className="text-lg lg:text-xl font-black text-slate-900 mt-0.5">
                Ürün, Varyant, Tedarikçi & Alış Maliyeti Yükleme Merkezi
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sekme Seçici: Excel Yükleme / Manuel Tekli Ekleme */}
        <div className="px-6 pt-3 bg-white border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveMode('EXCEL_IMPORT')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeMode === 'EXCEL_IMPORT'
                ? 'border-[#f27a1a] text-[#f27a1a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel / CSV Toplu İçe Aktarma & Trendyol Entegratörü</span>
          </button>

          <button
            onClick={() => setActiveMode('MANUAL_ADD')}
            className={`py-3 border-b-2 transition-all flex items-center gap-2 ${
              activeMode === 'MANUAL_ADD'
                ? 'border-[#f27a1a] text-[#f27a1a]'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Tekli Yeni Ürün & Maliyet Formu</span>
          </button>
        </div>

        {/* Modal Gövdesi */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {activeMode === 'EXCEL_IMPORT' ? (
            <div className="space-y-6">
              
              {/* 1. Resmi Şablon İndirme Alanı (Trendyol vs izeeg Master) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Şablon A: Trendyol Resmi Formatı */}
                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xs text-orange-950">
                      <span>🟠</span>
                      <span>Trendyol Resmi Ürün Formatı (.csv)</span>
                    </div>
                    <span className="text-[10px] font-bold bg-orange-200/70 text-orange-900 px-1.5 py-0.5 rounded">
                      Resmi Çıktı
                    </span>
                  </div>
                  <p className="text-[11px] text-orange-900/80 leading-relaxed">
                    Trendyol Satıcı Paneli'nden dışa aktardığınız Excel çıktısı ile %100 birebir uyumludur. Barkod, Model Kodu, Satış Fiyatı, KDV, Desi, Renk, Beden içerir.
                  </p>
                  <button
                    onClick={() => handleDownloadCsv('TRENDYOL')}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-orange-300 hover:bg-orange-100/80 text-orange-900 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-[#f27a1a]" />
                    <span>Trendyol Resmi Şablonunu İndir</span>
                  </button>
                </div>

                {/* Şablon B: izeeg AI Tam Donanımlı Master Format */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xs text-emerald-950">
                      <span>💎</span>
                      <span>izeeg AI Kapsamlı Ürün & Maliyet Şablonu</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-900 px-1.5 py-0.5 rounded">
                      Tavsiye Edilen
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                    Tedarikçi (Alınan Yer), Alış Fiyatı (Maliyet TL), Satış Fiyatı, Kargo Desisi, Komisyon ve Raf No dahil tam donanımlı şablondur.
                  </p>
                  <button
                    onClick={() => handleDownloadCsv('IZEEG_MASTER')}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>izeeg Tam Donanımlı Şablonu İndir</span>
                  </button>
                </div>

              </div>

              {/* 2. Sürükle Bırak / Dosya Seçme Alanı */}
              <div 
                className={`border-2 border-dashed rounded-3xl p-6 text-center space-y-2 transition-all relative cursor-pointer ${
                  dragActive ? 'border-[#f27a1a] bg-orange-50/50' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processFile(file);
                }}
              >
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv, text/csv, text/plain"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#f27a1a] flex items-center justify-center mx-auto shadow-sm">
                  <Upload className="w-6 h-6" />
                </div>
                
                <div className="text-xs font-bold text-slate-800">
                  Trendyol Excel Çıktısını veya izeeg CSV Dosyanızı Buraya Sürükleyin ya da <span className="text-[#f27a1a] underline font-extrabold">Dosya Seçin</span>
                </div>
                
                <span className="text-[11px] text-slate-400 block">
                  Sistem Trendyol sütunlarını otomatik algılar ve eksik maliyetleri tamamlamanız için akıllı sihirbazı açar.
                </span>
              </div>

              {/* 3. İçe Aktarma Sonucu & Akıllı Maliyet Sihirbazı */}
              {importResult && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Başarı & Format Bilgisi Banner'ı */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-[#f27a1a] flex-shrink-0" />
                      <div>
                        <strong className="text-sm font-bold block">
                          {importResult.formatType === 'TRENDYOL_OFFICIAL' 
                            ? '🎉 Resmi Trendyol Ürün Listesi Algılandı!' 
                            : '💎 izeeg AI Tam Donanımlı Şablonu Algılandı!'}
                        </strong>
                        <span className="text-[11px] text-slate-300">
                          {importResult.totalCount} adet ürün başarıyla okundu. Dosya: <strong className="text-white font-mono">{uploadedFileName}</strong>
                        </span>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-[#f27a1a] text-white font-black text-[11px]">
                      {importResult.totalCount} Ürün Hazır
                    </span>
                  </div>

                  {/* Trendyol Formatı İçin: Akıllı Maliyet & Tedarikçi Tanımlama Kutusu */}
                  {importResult.formatType === 'TRENDYOL_OFFICIAL' && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-xs font-bold block text-amber-950">
                            💡 Trendyol Çıktısında Alış Maliyeti ve Tedarikçi Yer Almaz (Doğal Durum)
                          </strong>
                          <p className="text-[11px] text-amber-900 leading-relaxed mt-0.5">
                            Trendyol satıcı panelinde sadece satış fiyatınız bulunur. Net kârınızın eksiksiz hesaplanabilmesi için aşağıdaki toplu kuralı uygulayabilir veya tablodan tek tek düzenleyebilirsiniz:
                          </p>
                        </div>
                      </div>

                      {/* Toplu Maliyet Uygulama Kontrolleri */}
                      <div className="bg-white p-3 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Maliyet Oranı (Satış Fiyatının %'si)</label>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-slate-700">%</span>
                            <input 
                              type="number"
                              value={bulkCostRatio}
                              onChange={(e) => setBulkCostRatio(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                              placeholder="Örn: 40"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Toptancı / Alınan Yer</label>
                          <input 
                            type="text"
                            value={bulkSupplierName}
                            onChange={(e) => setBulkSupplierName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                            placeholder="Örn: Merter Toptan Tekstil"
                          />
                        </div>

                        <div className="pt-4">
                          <button
                            onClick={handleApplyBulkCost}
                            className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                          >
                            <Calculator className="w-3.5 h-3.5" />
                            <span>Tüm Ürünlere Uygula</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Canlı Düzenlenebilir Ürün & Maliyet Tablosu */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-slate-100 p-3 font-bold text-xs text-slate-800 flex items-center justify-between border-b border-slate-200">
                      <span>İçe Aktarılacak Ürünler & Anlık Net Kâr Önizlemesi</span>
                      <span className="text-[11px] text-slate-500">✍️ Tablodaki alış fiyatlarını ve tedarikçileri doğrudan değiştirebilirsiniz.</span>
                    </div>

                    <div className="max-h-72 overflow-y-auto overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                            <th className="py-2.5 px-3">Barkod / SKU</th>
                            <th className="py-2.5 px-3">Ürün Adı & Varyant</th>
                            <th className="py-2.5 px-3">Tedarikçi (Alınan Yer)</th>
                            <th className="py-2.5 px-3 text-right">Satış Fiyatı</th>
                            <th className="py-2.5 px-3 text-right">Alış Maliyeti ✍️</th>
                            <th className="py-2.5 px-3 text-right bg-emerald-50 text-emerald-900">Net Kâr (Cebine Kalan)</th>
                            <th className="py-2.5 px-2 text-center">Stok</th>
                            <th className="py-2.5 px-2 text-center">Desi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {importResult.products.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80">
                              <td className="py-2 px-3 font-mono text-[11px] text-slate-700">
                                {p.barcode}
                                <div className="text-[10px] text-slate-400">{p.id}</div>
                              </td>

                              <td className="py-2 px-3 font-medium text-slate-900 max-w-[200px] truncate" title={p.name}>
                                {p.name}
                                <div className="text-[10px] text-slate-500">
                                  {p.color && `Renk: ${p.color}`} {p.size && `• Beden: ${p.size}`}
                                </div>
                              </td>

                              <td className="py-2 px-3">
                                <input
                                  type="text"
                                  value={p.supplier || ''}
                                  onChange={(e) => handleRowChange(idx, 'supplier', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                                  placeholder="Tedarikçi Adı"
                                />
                              </td>

                              <td className="py-2 px-3 text-right font-bold text-slate-900">
                                ₺{Number(p.sellingPrice || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                              </td>

                              <td className="py-2 px-3 text-right">
                                <input
                                  type="number"
                                  value={p.costPrice || ''}
                                  onChange={(e) => handleRowChange(idx, 'costPrice', e.target.value)}
                                  className="w-24 bg-white border border-slate-300 rounded px-2 py-1 text-right font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                                  placeholder="0.00"
                                />
                              </td>

                              <td className="py-2 px-3 text-right font-black bg-emerald-50/60">
                                <span className={p.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                                  +₺{Number(p.netProfit || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </span>
                                <div className="text-[10px] text-slate-500 font-semibold">
                                  %{p.profitMargin || 0} Marj
                                </div>
                              </td>

                              <td className="py-2 px-2 text-center font-bold text-slate-800">
                                {p.stock}
                              </td>

                              <td className="py-2 px-2 text-center font-mono text-slate-600">
                                {p.desi}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Onayla ve Sisteme Aktar Butonu */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                    >
                      Vazgeç
                    </button>

                    <button
                      onClick={handleFinalSave}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tüm Ürünleri ve Maliyetleri Sisteme Kaydet ({importResult.totalCount} Ürün)</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          ) : (
            
            /* MANUEL TEK ÜRÜN & MALİYET EKLEME FORMU */
            <form onSubmit={handleSaveManualProduct} className="space-y-4">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#f27a1a]" />
                  <span>Temel Ürün & Model Bilgileri</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Ürün Adı *</label>
                    <input 
                      type="text"
                      required
                      value={manualForm.name}
                      onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                      placeholder="Örn: Antrasit Yıkamalı Taş Detaylı Kadın Eşofman Takımı"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Barkod *</label>
                    <input 
                      type="text"
                      required
                      value={manualForm.barcode}
                      onChange={(e) => setManualForm({ ...manualForm, barcode: e.target.value })}
                      placeholder="8680001928471"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Model / Stok Kodu (SKU)</label>
                    <input 
                      type="text"
                      value={manualForm.sku}
                      onChange={(e) => setManualForm({ ...manualForm, sku: e.target.value })}
                      placeholder="ESOFMAN-ANT-01"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Renk</label>
                    <input 
                      type="text"
                      value={manualForm.color}
                      onChange={(e) => setManualForm({ ...manualForm, color: e.target.value })}
                      placeholder="Antrasit Yıkamalı"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Beden / Varyant</label>
                    <input 
                      type="text"
                      value={manualForm.size}
                      onChange={(e) => setManualForm({ ...manualForm, size: e.target.value })}
                      placeholder="M / 38"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#f27a1a]"
                    />
                  </div>
                </div>
              </div>

              {/* Tedarikçi & Maliyet & Satış Fiyatı */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80">
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Tedarikçi (Alınan Yer) & Maliyet / Satış Fiyatı</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Ürünün Alındığı Yer / Tedarikçi *</label>
                    <input 
                      type="text"
                      required
                      value={manualForm.supplier}
                      onChange={(e) => setManualForm({ ...manualForm, supplier: e.target.value })}
                      placeholder="Örn: Merter Toptan Tekstil / Güngören İmalat"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-rose-700 block mb-1">Alış Fiyatı (Maliyet TL) *</label>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      value={manualForm.costPrice}
                      onChange={(e) => setManualForm({ ...manualForm, costPrice: e.target.value })}
                      placeholder="1100.00"
                      className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-emerald-800 block mb-1">Satış Fiyatı (KDV Dahil TL) *</label>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      value={manualForm.sellingPrice}
                      onChange={(e) => setManualForm({ ...manualForm, sellingPrice: e.target.value })}
                      placeholder="2750.00"
                      className="w-full bg-white border border-emerald-400 rounded-xl px-3 py-2 text-xs text-slate-900 font-black focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Komisyon, Kargo Desisi, KDV, Depo */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Stok Adedi</label>
                    <input 
                      type="number"
                      value={manualForm.stock}
                      onChange={(e) => setManualForm({ ...manualForm, stock: e.target.value })}
                      placeholder="50"
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Kargo Desisi</label>
                    <input 
                      type="number"
                      value={manualForm.desi}
                      onChange={(e) => setManualForm({ ...manualForm, desi: e.target.value })}
                      placeholder="2"
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Pazaryeri Komisyon %</label>
                    <input 
                      type="number"
                      value={manualForm.commissionRate}
                      onChange={(e) => setManualForm({ ...manualForm, commissionRate: e.target.value })}
                      placeholder="14"
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">KDV Oranı %</label>
                    <select
                      value={manualForm.vatRate}
                      onChange={(e) => setManualForm({ ...manualForm, vatRate: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="1">%1 KDV</option>
                      <option value="10">%10 KDV (Tekstil/Giyim)</option>
                      <option value="20">%20 KDV (Standart)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Depo & Raf Kodu</label>
                    <input 
                      type="text"
                      value={manualForm.shelfLocation}
                      onChange={(e) => setManualForm({ ...manualForm, shelfLocation: e.target.value })}
                      placeholder="A-12"
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
                >
                  Vazgeç
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#f27a1a] hover:bg-[#d9670f] text-white font-black text-xs shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ürünü ve Net Kârını Sisteme Kaydet</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
