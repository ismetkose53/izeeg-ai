import React, { useState } from 'react';
import { 
  Building2, 
  Upload, 
  Download, 
  FileSpreadsheet, 
  RefreshCw, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Boxes, 
  Sparkles, 
  ArrowLeft, 
  Globe, 
  History, 
  Tag, 
  Layers, 
  Barcode,
  Truck,
  Calculator,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  WAREHOUSES_LIST, 
  XML_SUPPLIER_FEEDS, 
  DEMO_STOCK_MOVEMENTS, 
  DEMO_PRODUCTS
} from '../services/mockData';
import { getCatalogProducts } from '../services/marketplaceSyncService';
import { 
  generateTrendyolOfficialCsvContent, 
  generateIzeegMasterCsvContent, 
  parseUploadedProductFile 
} from '../services/excelImportService';
import { ProductUploadModal } from './ProductUploadModal';

export function WarehouseInventoryPage({ 
  onNavigateBack,
  products: parentProducts,
  setProducts: setParentProducts
}) {
  const [subTab, setSubTab] = useState('inventory'); // inventory | xml_feeds | excel_import | movements | warehouses
  const [localProducts, setLocalProducts] = useState(() => {
    const cat = getCatalogProducts();
    return (cat && cat.length > 0) ? cat : DEMO_PRODUCTS;
  });
  const products = (parentProducts && parentProducts.length > 0) ? parentProducts : localProducts;
  const setProducts = setParentProducts || setLocalProducts;

  const [xmlFeeds, setXmlFeeds] = useState(XML_SUPPLIER_FEEDS);
  const [movements, setMovements] = useState(DEMO_STOCK_MOVEMENTS);
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Yeni XML Linki Ekleme State'i
  const [newXmlUrl, setNewXmlUrl] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [isAddingXml, setIsAddingXml] = useState(false);
  const [syncingXmlId, setSyncingXmlId] = useState(null);

  // Excel Yükleme State'i
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Filtreli Ürünler
  const filteredProducts = products.filter(p => {
    if (selectedWarehouse !== 'ALL' && p.warehouse !== selectedWarehouse) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.shelfLocation?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const [syncBannerMessage, setSyncBannerMessage] = useState(null);

  const handleSyncXml = (feedId) => {
    setSyncingXmlId(feedId);
    setTimeout(() => {
      setSyncingXmlId(null);
      setSyncBannerMessage("✅ Tedarikçi XML linkinden 1.420 ürünün güncel stok ve maliyetleri başarıyla çekildi ve depoya aktarıldı!");
      setTimeout(() => setSyncBannerMessage(null), 5000);
      confetti({ particleCount: 70, spread: 60 });
    }, 1200);
  };

  const handleAddXmlFeed = (e) => {
    e.preventDefault();
    if (!newXmlUrl || !newSupplierName) return;

    const newFeed = {
      id: `FEED-${Date.now().toString().slice(-3)}`,
      supplierName: newSupplierName,
      xmlUrl: newXmlUrl,
      updateFrequency: 'Saatlik (Otomatik)',
      lastSync: 'Şimdi',
      itemCount: 450,
      status: 'ACTIVE'
    };

    setXmlFeeds([newFeed, ...xmlFeeds]);
    setNewXmlUrl('');
    setNewSupplierName('');
    setIsAddingXml(false);
    confetti({ particleCount: 80, spread: 70 });
  };

  const handleProductsImported = (importedProducts) => {
    if (!importedProducts || importedProducts.length === 0) return;

    setProducts(prev => [...importedProducts, ...prev]);

    const totalQty = importedProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
    setMovements(prev => [
      {
        id: `MOV-${Date.now().toString().slice(-4)}`,
        date: 'Az önce',
        productName: `Toplu Ürün / Excel İçe Aktarımı (${importedProducts.length} Farklı Ürün)`,
        type: 'IN',
        typeLabel: 'Toplu Stok Girişi',
        quantity: `+${totalQty} Adet`,
        warehouse: 'Ana Merkez Depo',
        reason: 'Excel / CSV & Trendyol Entegrasyon Girişi',
        user: 'Mağaza Yöneticisi (Excel)'
      },
      ...prev
    ]);

    setSyncBannerMessage(`🎉 ${importedProducts.length} adet yeni ürün, varyant ve alış maliyeti depoya ve sisteme başarıyla aktarıldı!`);
    setTimeout(() => setSyncBannerMessage(null), 6000);
    confetti({ particleCount: 100, spread: 80 });
  };

  const handleDownloadTemplate = (type = 'TRENDYOL') => {
    let csvContent = '';
    let filename = '';

    if (type === 'TRENDYOL') {
      csvContent = generateTrendyolOfficialCsvContent();
      filename = `Trendyol_Resmi_Urun_Listesi_${Date.now()}.csv`;
    } else {
      csvContent = generateIzeegMasterCsvContent();
      filename = `izeeg_AI_Donanimli_Urun_Maliyet_Sablonu_${Date.now()}.csv`;
    }

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    confetti({ particleCount: 60, spread: 60 });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    setUploadSuccess(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (text && typeof text === 'string') {
        const parseRes = parseUploadedProductFile(text);
        if (parseRes.success && parseRes.products.length > 0) {
          handleProductsImported(parseRes.products);
        }
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const totalStockCount = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. Üst Başlık */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onNavigateBack && (
            <button 
              onClick={onNavigateBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Merkezi ERP & Depo Stok Motoru
              </span>
              <span className="text-xs text-slate-500 font-medium">Trendyol & Excel Senkronizasyonu</span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
              Depo, Raf Adresleri & ERP Stok Yönetimi
            </h1>
          </div>
        </div>

        {/* Hızlı Aksiyon Butonları */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f27a1a] hover:bg-[#d9670f] text-white text-xs font-black shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ürün / Excel Yükle (Trendyol & izeeg)</span>
          </button>

          <button
            onClick={() => setSubTab('excel_import')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel Şablonları</span>
          </button>

          <button
            onClick={() => setSubTab('xml_feeds')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition-all"
          >
            <Globe className="w-4 h-4" />
            <span>+ XML Tedarikçi Ekle</span>
          </button>
        </div>
      </div>

      {/* 2. Depo ERP KPI Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Toplam Stok Adedi</span>
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">3 Depo</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalStockCount} Adet
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Toplam 247 farklı varyant üründe
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Bağlı XML Tedarikçileri</span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Aktif</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {xmlFeeds.length} Tedarikçi
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            2.310 ürün otomatik senkronize
          </div>
        </div>

        <div className="bg-white border border-rose-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700">Tükenen Stok (0 Adet)</span>
            <span className="text-xs font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">Kritik</span>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {outOfStockCount} Ürün
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Pazar yerinde liste pasife düştü
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Ana Merkez Depo Doluluk</span>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">%74</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            İkitelli Depo
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Koridor A-F arası raf adresli
          </div>
        </div>

      </div>

      {/* 3. Alt Sekmeler Barı */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSubTab('inventory')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'inventory' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Depo Stok & Raf Listesi</span>
        </button>

        <button
          onClick={() => setSubTab('xml_feeds')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'xml_feeds' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>XML Tedarikçi Bağlantıları ({xmlFeeds.length})</span>
        </button>

        <button
          onClick={() => setSubTab('excel_import')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'excel_import' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Excel / CSV Toplu Stok Yükle</span>
        </button>

        <button
          onClick={() => setSubTab('movements')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            subTab === 'movements' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Stok Hareket Günlüğü (Giriş/Çıkış)</span>
        </button>
      </div>

      {/* 4. SEKME İÇERİKLERİ */}

      {/* SEKME 1: DEPO STOK & RAF LİSTESİ */}
      {subTab === 'inventory' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-sm space-y-4 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="relative flex-1 w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SKU, Barkod, Ürün Adı veya Raf No (Örn: A-12) Ara..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">🏢 Tüm Depolar</option>
                <option value="Ana Merkez Depo">Ana Merkez Depo (İkitelli)</option>
                <option value="FBA Lojistik Deposu">FBA Lojistik Deposu (Gebze)</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-slate-200">
                <Boxes className="w-14 h-14 text-indigo-300 mx-auto mb-3" />
                <h4 className="text-sm font-black text-slate-800">
                  {products.length === 0 ? 'Depoda Henüz Ürün Kaydı Bulunmuyor' : 'Arama Kriterine Uygun Ürün Bulunamadı'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  {products.length === 0
                    ? "Excel / CSV şablonunu indirip doldurarak ürünlerinizi tek tıkla depoya yükleyebilir veya toptancı XML linkinizi ekleyerek anında içeri aktarabilirsiniz."
                    : "Aradığınız kriterlere uygun ürün bulunamadı. Aramayı temizleyebilirsiniz."}
                </p>
                {products.length === 0 && (
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handleDownloadTemplate}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Excel Şablonunu İndir</span>
                    </button>
                    <button
                      onClick={() => setSubTab('excel_import')}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow transition-all flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Excel Dosyası Yükle</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-3">Barkod & SKU</th>
                    <th className="py-3 px-3">Ürün & Varyant</th>
                    <th className="py-3 px-3">Depo & Raf / Koridor Adresi</th>
                    <th className="py-3 px-3 text-center">Fiziksel Stok</th>
                    <th className="py-3 px-3 text-right">Alış Maliyeti</th>
                    <th className="py-3 px-3 text-right">Toplam Stok Değeri</th>
                    <th className="py-3 px-3 text-center">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map(p => {
                    const stockValue = p.stock * p.costPrice;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono">
                          <strong className="text-slate-900 block">{p.barcode}</strong>
                          <span className="text-[10px] text-slate-400">{p.id}</span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                          <div className="text-[11px] text-slate-500">{p.variant}</div>
                        </td>

                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-800">{p.warehouse || 'Ana Merkez Depo'}</div>
                          <span className="inline-block mt-0.5 bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded text-[10px] border border-indigo-200 font-mono">
                            📍 Raf: {p.shelfLocation || 'A-01'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className={`text-sm font-black ${
                            p.stock === 0 ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded' : p.stock < 10 ? 'text-amber-600' : 'text-slate-900'
                          }`}>
                            {p.stock} Adet
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right font-medium text-slate-700">
                          {p.costPrice.toFixed(2)} ₺
                        </td>

                        <td className="py-3 px-3 text-right font-black text-slate-900">
                          {stockValue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.stock === 0
                              ? 'bg-rose-100 text-rose-800'
                              : p.stock < 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.stock === 0 ? 'Tükendi' : p.stock < 10 ? 'Kritik Stok' : 'Yeterli'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

        </div>
      )}

      {/* SEKME 2: XML TEDARİKÇİ ENTEGRASYONU */}
      {subTab === 'xml_feeds' && (
        <div className="space-y-4 animate-fadeIn">
          
          {/* XML Ekleme Formu */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-1">Tedarikçi XML Linki ile Otomatik Stok Çekme</h3>
            <p className="text-xs text-slate-500 mb-4">
              Toptancınızın veya bayisi olduğunuz markanın ürün XML linkini ekleyin; sistem ürünleri ve stokları otomatik içeri aktarsın.
            </p>

            <form onSubmit={handleAddXmlFeed} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Tedarikçi / Firma Adı</label>
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder="Örn: Ayakkabı Dünyası B2B"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="sm:col-span-6">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">XML Ürün & Stok URL'si</label>
                <input
                  type="url"
                  value={newXmlUrl}
                  onChange={(e) => setNewXmlUrl(e.target.value)}
                  placeholder="https://tedarikci.com/export/products.xml"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>XML'i Bağla</span>
                </button>
              </div>
            </form>
          </div>

          {/* Bağlı XML Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {xmlFeeds.map(feed => (
              <div key={feed.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{feed.supplierName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono block truncate max-w-xs">{feed.xmlUrl}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Aktif
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Çekilen Ürün:</span>
                    <strong className="text-slate-900">{feed.itemCount} Ürün</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Son Senkronizasyon:</span>
                    <strong className="text-slate-900">{feed.lastSync}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] text-slate-500">{feed.updateFrequency}</span>
                  <button
                    onClick={() => handleSyncXml(feed.id)}
                    disabled={syncingXmlId === feed.id}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingXmlId === feed.id ? 'animate-spin' : ''}`} />
                    <span>{syncingXmlId === feed.id ? 'Çekiliyor...' : 'Şimdi Senkronize Et'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SEKME 3: EXCEL / CSV İLE TOPLU STOK YÜKLE */}
      {subTab === 'excel_import' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6 animate-fadeIn max-w-4xl mx-auto">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-900">Excel Dosyası ile Toplu Ürün, Varyant & Maliyet Yükleme</h3>
            <p className="text-xs text-slate-500">
              Trendyol satıcı panelinden indirdiğiniz Excel çıktısını doğrudan yükleyebilir veya izeeg AI tam donanımlı şablonunu kullanabilirsiniz.
            </p>
          </div>

          {/* 2 Farklı Şablon Seçeneği */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🟠</span>
                <div>
                  <strong className="text-xs font-bold text-orange-950 block">Trendyol Resmi Ürün Listesi Formatı (.csv)</strong>
                  <span className="text-[11px] text-orange-800/80">Trendyol Satıcı Paneli dışa aktarma formatıyla %100 birebirdir.</span>
                </div>
              </div>

              <button
                onClick={() => handleDownloadTemplate('TRENDYOL')}
                className="w-full py-2 px-3 rounded-xl bg-white border border-orange-300 hover:bg-orange-100 text-orange-900 font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#f27a1a]" />
                <span>Trendyol Resmi Şablonunu İndir</span>
              </button>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💎</span>
                <div>
                  <strong className="text-xs font-bold text-emerald-950 block">izeeg AI Tam Donanımlı Şablon (.csv)</strong>
                  <span className="text-[11px] text-emerald-800/80">Tedarikçi (Alınan Yer), Alış Maliyeti, KDV, Desi ve Komisyon sütunları dahil.</span>
                </div>
              </div>

              <button
                onClick={() => handleDownloadTemplate('IZEEG_MASTER')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>izeeg Master Şablonunu İndir</span>
              </button>
            </div>
          </div>

          {/* Sürükle Bırak / Modal Açma Alanı */}
          <div 
            onClick={() => setIsUploadModalOpen(true)}
            className="border-2 border-dashed border-[#f27a1a]/60 bg-orange-50/30 rounded-3xl p-8 text-center space-y-3 hover:bg-orange-50/60 transition-all cursor-pointer relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#f27a1a] flex items-center justify-center mx-auto shadow-sm">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-slate-800">
              Excel / CSV Dosyanızı Yüklemek İçin <span className="text-[#f27a1a] underline font-extrabold">Akıllı İçe Aktarma Sihirbazını Açın</span>
            </div>
            <span className="text-[10px] text-slate-500 block">
              Trendyol Excel dosyasını seçtiğinizde sistem otomatik olarak algılar ve eksik maliyetleri tanımlamanız için akıllı sihirbazı başlatır.
            </span>
          </div>

          {uploadFileName && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <div>Dosya Başarıyla İçe Aktarıldı: <strong>{uploadFileName}</strong></div>
                <div className="text-[11px] text-emerald-600 font-normal mt-0.5">Ürün kataloğu, stok miktarları ve net kâr hesaplamaları anında güncellendi.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SEKME 4: STOK HAREKET GÜNLÜĞÜ */}
      {subTab === 'movements' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="text-sm font-black text-slate-900">Son Depo Giriş / Çıkış Hareketleri</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Tarih & Saat</th>
                  <th className="py-2.5 px-3">İşlem Türü</th>
                  <th className="py-2.5 px-3">Ürün & SKU</th>
                  <th className="py-2.5 px-3 text-center">Miktar</th>
                  <th className="py-2.5 px-3">Açıklama & Kaynak</th>
                  <th className="py-2.5 px-3">İşlem Yapan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-3 font-mono text-slate-500">{m.date}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        m.type === 'OUT'
                          ? 'bg-rose-100 text-rose-800'
                          : m.type === 'IN'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.type === 'OUT' ? '⬇ Çıkış (Satış)' : m.type === 'IN' ? '⬆ Giriş (Tedarik)' : '🔄 İade Girişi'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">{m.productName}</td>
                    <td className="py-3 px-3 text-center font-black text-xs">{m.quantity}</td>
                    <td className="py-3 px-3 text-slate-600">{m.reason}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">{m.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEKME 5: DEPO LİSTESİ */}
      {subTab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
          {WAREHOUSES_LIST.map(wh => (
            <div key={wh.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  🏢
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${wh.type === 'FBA' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {wh.type}
                </span>
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">{wh.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{wh.location}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Kapasite / Doluluk:</span>
                <strong className="text-slate-900">{wh.usedCapacity}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ürün & Maliyet Yükleme Modalı (Trendyol & izeeg Şablonları) */}
      <ProductUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProductsImported={handleProductsImported}
      />

    </div>
  );
}
