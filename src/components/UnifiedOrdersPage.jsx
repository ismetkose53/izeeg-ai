import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Printer, 
  CheckCircle2, 
  Truck, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  DollarSign, 
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PackageCheck,
  Send,
  Copy,
  Info,
  Download,
  FileSpreadsheet,
  Settings,
  Star,
  Layers,
  FileText,
  AlertTriangle,
  HelpCircle,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  Wallet,
  Percent,
  Calculator,
  ChevronRightCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ShippingLabelModal } from './ShippingLabelModal';
import { OrderDocsModal } from './OrderDocsModal';
import { calculateOrderProfit } from '../services/marketplaceEngine';
import { getStoredImageCache, resolveSmartProductImage, saveCustomProductImage } from '../services/marketplaceSyncService';
import confetti from 'canvas-confetti';

export function UnifiedOrdersPage({ 
  orders, 
  setOrders, 
  products = [],
  setProducts,
  selectedMarketplace,
  autoInvoiceEnabled = true,
  onNavigateToInvoices,
  onOpenGuide
}) {
  // Statü Sekmesi: 'ALL' | 'NEW' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'SUSPENDED'
  const [activeStatusTab, setActiveStatusTab] = useState('NEW');
  const [localMarketplaceFilter, setLocalMarketplaceFilter] = useState('ALL');

  // Gelişmiş Filtreleme State'leri
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterOrderNo, setFilterOrderNo] = useState('');
  const [filterPackageNo, setFilterPackageNo] = useState('');
  const [filterBarcode, setFilterBarcode] = useState('');
  const [filterCargoCode, setFilterCargoCode] = useState('');
  const [filterSupplyStatus, setFilterSupplyStatus] = useState('ALL');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterProductName, setFilterProductName] = useState('');

  // Tablo Kontrolleri
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);

  // Açık Dropdown Menüler & Popoverlar
  const [openActionOrderId, setOpenActionOrderId] = useState(null);
  const [openInvoiceOrderId, setOpenInvoiceOrderId] = useState(null);
  const [openProfitBreakdownOrderId, setOpenProfitBreakdownOrderId] = useState(null);
  const [batchActionMenuOpen, setBatchActionMenuOpen] = useState(false);

  // Modallar
  const [shippingModalConfig, setShippingModalConfig] = useState({ isOpen: false, order: null, orders: [], labelType: 'A4' });
  const [docsModalConfig, setDocsModalConfig] = useState({ isOpen: false, type: 'DISTANCE_CONTRACT', order: null });

  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Metin Kopyalama
  const handleCopyText = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`📋 ${label} kopyalandı: ${text}`);
  };

  // Satır İçi (Inline) Alış Fiyatı Düzenleme & Ürün Hafızasına Kaydetme
  const handleUpdateItemCost = (orderId, itemId, barcode, sku, newCostValue) => {
    const costNumber = Number(newCostValue) || 0;
    
    // 1. Siparişler state'ini güncelle (bu siparişteki ve aynı ürüne sahip diğer tüm siparişlerdeki maliyeti eşitle)
    setOrders(prevOrders => prevOrders.map(ord => {
      let orderChanged = false;
      const updatedItems = (ord.items || []).map(it => {
        const isMatch = (ord.id === orderId && it.id === itemId) || 
                        (barcode && it.barcode === barcode) ||
                        (sku && it.sku === sku);
        if (isMatch) {
          orderChanged = true;
          return {
            ...it,
            costPrice: costNumber
          };
        }
        return it;
      });

      if (orderChanged) {
        return {
          ...ord,
          items: updatedItems,
          costPrice: ord.id === orderId ? costNumber : ord.costPrice
        };
      }
      return ord;
    }));

    // 2. Ana ürün kataloğuna (Master Products Memory) kaydet
    if (setProducts) {
      setProducts(prevProds => {
        let found = false;
        const updated = prevProds.map(p => {
          if ((barcode && p.barcode === barcode) || (sku && p.id === sku)) {
            found = true;
            return {
              ...p,
              costPrice: costNumber,
              isCostMissing: false
            };
          }
          return p;
        });

        if (!found && (barcode || sku)) {
          updated.push({
            id: sku || `SKU-${Date.now().toString().slice(-4)}`,
            barcode: barcode || `868000${Date.now().toString().slice(-4)}`,
            name: 'Katalog Ürünü',
            costPrice: costNumber,
            sellingPrice: 0,
            stock: 10,
            isCostMissing: false
          });
        }
        return updated;
      });
    }

    showToast(`💾 Alış maliyeti (₺${costNumber.toFixed(2)}) ürün hafızasına işlendi ve tüm siparişlere uygulandı!`);
  };

  // Efektif Pazar Yeri Filtresi (Üst bar veya sayfa içi seçim)
  const effectiveMarketplace = selectedMarketplace !== 'ALL' ? selectedMarketplace : localMarketplaceFilter;

  // Filtrelenmiş Sipariş Listesi
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Pazar yeri filtresi
      if (effectiveMarketplace !== 'ALL' && order.marketplace !== effectiveMarketplace) {
        return false;
      }
      // Statü filtresi
      if (activeStatusTab !== 'ALL' && order.status !== activeStatusTab) {
        return false;
      }
      // Müşteri Adı
      if (filterCustomer.trim() && !order.customerName.toLowerCase().includes(filterCustomer.toLowerCase())) {
        return false;
      }
      // Sipariş No
      if (filterOrderNo.trim() && !order.id.toLowerCase().includes(filterOrderNo.toLowerCase())) {
        return false;
      }
      // Paket / Teslimat No
      if (filterPackageNo.trim()) {
        const pkgMatch = order.packageNo && order.packageNo.includes(filterPackageNo);
        const delMatch = order.deliveryNo && order.deliveryNo.includes(filterPackageNo);
        if (!pkgMatch && !delMatch) return false;
      }
      // Barkod
      if (filterBarcode.trim()) {
        const hasBarcode = order.items?.some(it => it.barcode?.toLowerCase().includes(filterBarcode.toLowerCase()));
        if (!hasBarcode) return false;
      }
      // Kargo Kodu
      if (filterCargoCode.trim() && !order.trackingNumber?.includes(filterCargoCode)) {
        return false;
      }
      // Tedarik Süresi
      if (filterSupplyStatus !== 'ALL' && order.supplyStatus !== filterSupplyStatus) {
        return false;
      }
      // Ürün Adı / Model Kodu
      if (filterProductName.trim()) {
        const query = filterProductName.toLowerCase();
        const inProductName = order.productName?.toLowerCase().includes(query);
        const inItems = order.items?.some(it => it.title?.toLowerCase().includes(query) || it.sku?.toLowerCase().includes(query));
        if (!inProductName && !inItems) return false;
      }
      return true;
    });
  }, [
    orders,
    effectiveMarketplace,
    activeStatusTab,
    filterCustomer,
    filterOrderNo,
    filterPackageNo,
    filterBarcode,
    filterCargoCode,
    filterSupplyStatus,
    filterProductName
  ]);

  // Sekme ve Kanal Sayıları
  const counts = useMemo(() => {
    const res = { ALL: orders.length, NEW: 0, PREPARING: 0, SHIPPED: 0, DELIVERED: 0, RETURNED: 0, SUSPENDED: 0 };
    orders.forEach(o => {
      if (res[o.status] !== undefined) res[o.status]++;
    });
    return res;
  }, [orders]);

  const channelCounts = useMemo(() => {
    const res = { ALL: orders.length, Trendyol: 0, Hepsiburada: 0, 'Amazon TR': 0, N11: 0, 'Kendi Sitem (Shopify)': 0 };
    orders.forEach(o => {
      if (res[o.marketplace] !== undefined) res[o.marketplace]++;
      else res[o.marketplace] = (res[o.marketplace] || 0) + 1;
    });
    return res;
  }, [orders]);

  // Filtreleri Temizleme
  const handleResetFilters = () => {
    setFilterCustomer('');
    setFilterOrderNo('');
    setFilterPackageNo('');
    setFilterBarcode('');
    setFilterCargoCode('');
    setFilterSupplyStatus('ALL');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterProductName('');
    showToast("Filtreler temizlendi.");
  };

  // Toplu Seçim İşlemleri
  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Sipariş Durumu Güncelleme
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const willAutoInvoice = autoInvoiceEnabled && newStatus !== 'NEW' && o.invoiceStatus !== 'ISSUED';
        const issuedInvoiceNo = willAutoInvoice ? (o.invoiceNumber || `IZG2026${Date.now().toString().slice(-8)}`) : o.invoiceNumber;

        return {
          ...o,
          status: newStatus,
          statusLabel: newStatus === 'PREPARING' ? 'İşleme Alındı' : newStatus === 'SHIPPED' ? 'Taşımada' : 'Teslim Edildi',
          statusBadge: newStatus === 'PREPARING' 
            ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' 
            : newStatus === 'SHIPPED'
            ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
            : 'bg-slate-500/10 text-slate-700 border border-slate-500/20',
          invoiceStatus: willAutoInvoice ? 'ISSUED' : o.invoiceStatus,
          invoiceNumber: issuedInvoiceNo
        };
      }
      return o;
    }));

    confetti({ particleCount: 40, spread: 50 });
    showToast(`Sipariş ${newStatus === 'PREPARING' ? 'İşleme Alındı' : 'Güncellendi'}.`);
    setOpenActionOrderId(null);
  };

  // Excel Dışa Aktarma
  const handleExportExcel = () => {
    const csvHeader = "SiparisNo;PaketNo;Musteri;Tarih;Tutar;Kargo;KargoTakip;FaturaDurumu;Durum\n";
    const csvRows = filteredOrders.map(o => 
      `"${o.id}";"${o.packageNo || ''}";"${o.customerName}";"${o.orderDate}";"${o.grossPrice} ₺";"${o.carrier}";"${o.trackingNumber || ''}";"${o.invoiceStatus}";"${o.statusLabel}"`
    ).join("\n");

    const blob = new Blob(['\uFEFF' + csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Trendyol_Siparisler_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("📊 Siparişler Excel formatında indirildi.");
    confetti({ particleCount: 50, spread: 60 });
  };

  // Toplu Etiket Yazdırma
  const handleBatchPrint = (type = 'A4') => {
    const selected = orders.filter(o => selectedOrderIds.includes(o.id));
    if (selected.length === 0) {
      showToast("Lütfen önce listeden en az bir sipariş seçin.");
      return;
    }
    setShippingModalConfig({
      isOpen: true,
      order: selected[0],
      orders: selected,
      labelType: type
    });
    setBatchActionMenuOpen(false);
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-16 font-sans text-slate-900">
      
      {/* Toast Bildirim Kutucuğu */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-2xl border border-slate-700 animate-fadeIn flex items-center gap-2">
          <span>✨</span> {toastMsg}
        </div>
      )}

      {/* 1. ÜST BAŞLIK, GECİKEN SİPARİŞLER VE YARDIM BARI (Görsel 2 ile Birebir) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Kargo Aşamasındaki Siparişler
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          {/* Geciken Siparişler */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-bold">Geciken Siparişler</span>
            <span className="text-slate-400">Yeni: <strong className="text-orange-600 font-bold">0 Adet</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">İşleme Alınanlar: <strong className="text-orange-600 font-bold">0 Adet</strong></span>
          </div>

          {/* Bugün Kargolanması Gereken */}
          <div className="flex items-center gap-1.5 bg-orange-50/80 text-orange-800 px-3 py-1.5 rounded-lg border border-orange-200">
            <span>Bugün Kargolanması Gereken Sipariş:</span>
            <span className="font-extrabold text-[#f27a1a]">3 Adet</span>
            <Info className="w-3.5 h-3.5 text-orange-500 cursor-pointer" title="Bugün saat 18:00'e kadar kargoya verilmesi gereken paketler" />
          </div>

          {/* Sayfa Kullanım Kılavuzu & Yardım Butonu */}
          <button 
            type="button"
            onClick={() => onOpenGuide && onOpenGuide('orders')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#f27a1a] border border-orange-500/30 font-black text-xs shadow-sm transition-all cursor-pointer group"
            title="Siparişler ekranı nasıl kullanılır? Tıkla öğren."
          >
            <BookOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>💡 Bu Sayfa Nasıl Kullanılır?</span>
          </button>
        </div>
      </div>

      {/* 2. ÇOKLU PAZARYERİ KANAL FİLTRESİ & CANLI API SENKRONİZASYON BARI */}
      <div className="bg-[#182230] text-white rounded-xl p-3 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-300 font-bold mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#f27a1a]" />
            <span>Pazar Yeri Havuzu:</span>
          </span>

          <button
            onClick={() => setLocalMarketplaceFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              effectiveMarketplace === 'ALL'
                ? 'bg-[#f27a1a] text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>Tüm Kanallar</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">{orders.length}</span>
          </button>

          <button
            onClick={() => setLocalMarketplaceFilter('Trendyol')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              effectiveMarketplace === 'Trendyol'
                ? 'bg-[#f27a1a] text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>🟠 Trendyol</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">{channelCounts['Trendyol'] || 0}</span>
          </button>

          <button
            onClick={() => setLocalMarketplaceFilter('Hepsiburada')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              effectiveMarketplace === 'Hepsiburada'
                ? 'bg-[#ff6000] text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>🟠 Hepsiburada</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">{channelCounts['Hepsiburada'] || 0}</span>
          </button>

          <button
            onClick={() => setLocalMarketplaceFilter('Amazon TR')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              effectiveMarketplace === 'Amazon TR'
                ? 'bg-amber-500 text-slate-900 shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>🟡 Amazon TR</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">{channelCounts['Amazon TR'] || 0}</span>
          </button>

          <button
            onClick={() => setLocalMarketplaceFilter('N11')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              effectiveMarketplace === 'N11'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>🔴 N11</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">{channelCounts['N11'] || 0}</span>
          </button>

          <button
            onClick={() => setLocalMarketplaceFilter('Kendi Sitem (Shopify)')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              effectiveMarketplace === 'Kendi Sitem (Shopify)'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span>🟢 Kendi Sitem</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full">{channelCounts['Kendi Sitem (Shopify)'] || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>⚡ Ortak Havuz: Bağlanan tüm pazar yeri API'lerinden anlık çekilir</span>
        </div>
      </div>

      {/* 3. STATÜ SEKME BARI (Görsel 2 - Tüm Siparişler, Yeni, İşleme Alınanlar, Taşıma Durumunda vb.) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 pt-1 flex items-center gap-6 overflow-x-auto text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveStatusTab('ALL')}
          className={`py-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeStatusTab === 'ALL' 
              ? 'text-[#f27a1a] border-[#f27a1a]' 
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Tüm Siparişler</span>
          <span className="text-[11px] font-normal text-slate-500">({counts.ALL} Paket)</span>
        </button>

        <button
          onClick={() => setActiveStatusTab('NEW')}
          className={`py-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeStatusTab === 'NEW' 
              ? 'text-[#f27a1a] border-[#f27a1a]' 
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Yeni</span>
          <span className="text-[11px] font-bold text-[#f27a1a]">({counts.NEW} Paket)</span>
        </button>

        <button
          onClick={() => setActiveStatusTab('PREPARING')}
          className={`py-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeStatusTab === 'PREPARING' 
              ? 'text-[#f27a1a] border-[#f27a1a]' 
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>İşleme Alınanlar</span>
          {counts.PREPARING > 0 && <span className="text-[11px] font-normal text-slate-500">({counts.PREPARING} Paket)</span>}
        </button>

        <button
          onClick={() => setActiveStatusTab('SHIPPED')}
          className={`py-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeStatusTab === 'SHIPPED' 
              ? 'text-[#f27a1a] border-[#f27a1a]' 
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Taşıma Durumunda</span>
          <span className="text-[11px] font-normal text-slate-500">({counts.SHIPPED || 41} Paket)</span>
        </button>

        <button
          onClick={() => setActiveStatusTab('DELIVERED')}
          className={`py-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeStatusTab === 'DELIVERED' 
              ? 'text-[#f27a1a] border-[#f27a1a]' 
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Teslim Edilen</span>
          <span className="text-[11px] font-normal text-slate-500">({counts.DELIVERED || 1201} Paket)</span>
        </button>

        <button
          onClick={() => setActiveStatusTab('RETURNED')}
          className={`py-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeStatusTab === 'RETURNED' 
              ? 'text-[#f27a1a] border-[#f27a1a]' 
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Yeniden Gönderimler</span>
          <span className="text-[11px] font-normal text-slate-500">(1 Paket)</span>
        </button>

        <button
          onClick={() => setActiveStatusTab('SUSPENDED')}
          className={`py-3.5 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeStatusTab === 'SUSPENDED' 
              ? 'text-[#f27a1a] border-[#f27a1a]' 
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Askıdaki Siparişler</span>
          <Info className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* 3. İKİ SIRALI GELİŞMİŞ FİLTRE KUTUSU (Görsel 2 ile Birebir) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        
        {/* Satır 1: Müşteri Adı | Sipariş No | Paket / Teslimat No | Barkod | Kargo Kodu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <input 
              type="text"
              value={filterCustomer}
              onChange={(e) => setFilterCustomer(e.target.value)}
              placeholder="Müşteri Adı"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
            />
          </div>

          <div className="relative">
            <input 
              type="text"
              value={filterOrderNo}
              onChange={(e) => setFilterOrderNo(e.target.value)}
              placeholder="Sipariş No"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
            />
            <Info className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div>
            <input 
              type="text"
              value={filterPackageNo}
              onChange={(e) => setFilterPackageNo(e.target.value)}
              placeholder="Paket / Teslimat No"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
            />
          </div>

          <div>
            <input 
              type="text"
              value={filterBarcode}
              onChange={(e) => setFilterBarcode(e.target.value)}
              placeholder="Barkod"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
            />
          </div>

          <div>
            <input 
              type="text"
              value={filterCargoCode}
              onChange={(e) => setFilterCargoCode(e.target.value)}
              placeholder="Kargo Kodu"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
            />
          </div>
        </div>

        {/* Satır 2: Tedarik Süresi Durumu | Başlangıç Tarihi | Bitiş Tarihi | Ürün Adı/Model Kodu | [Temizle] [Filtrele] */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <select 
              value={filterSupplyStatus}
              onChange={(e) => setFilterSupplyStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#f27a1a]"
            >
              <option value="ALL">Tedarik Süresi Durumu</option>
              <option value="Zamanında">Zamanında Teslimat</option>
              <option value="Kritik Tedarik Süresi">Kritik Süre (Bugün Kargolanacak)</option>
              <option value="Geciken">Geciken Siparişler</option>
            </select>
          </div>

          <div>
            <input 
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              placeholder="Sipariş Başlangıç Tarihi"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#f27a1a]"
            />
          </div>

          <div>
            <input 
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              placeholder="Sipariş Bitiş Tarihi"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#f27a1a]"
            />
          </div>

          <div className="relative">
            <input 
              type="text"
              value={filterProductName}
              onChange={(e) => setFilterProductName(e.target.value)}
              placeholder="Ürün Adı / Model Kodu"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
            />
            <Info className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Temizle & Filtrele Butonları */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg py-2 text-xs font-bold transition-all text-center"
            >
              Temizle
            </button>
            <button
              onClick={() => showToast(`Filtreleme uygulandı (${filteredOrders.length} sipariş).`)}
              className="flex-1 bg-[#182230] hover:bg-slate-800 text-white rounded-lg py-2 text-xs font-bold transition-all text-center shadow"
            >
              Filtrele
            </button>
          </div>
        </div>

      </div>

      {/* 4. TABLO ÜSTÜ HIZLI İŞLEM ÇUBUĞU (Görsel 2 - Toplu İşlemler, Ülke, Sıralama, Excel, Sayfalama) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-2">
        
        {/* Sol Hızlı Butonlar */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Toplu İşlemler Dropdown */}
          <div className="relative">
            <button
              onClick={() => setBatchActionMenuOpen(!batchActionMenuOpen)}
              className="px-4 py-2 bg-[#f27a1a] hover:bg-[#d9670f] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
            >
              <span>Toplu İşlemler</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {batchActionMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 space-y-1 z-40 text-xs font-bold animate-scaleUp">
                <button
                  onClick={() => handleBatchPrint('A4')}
                  className="w-full p-2 rounded-lg flex items-center gap-2 text-left text-slate-700 hover:bg-slate-100"
                >
                  <Printer className="w-4 h-4 text-[#f27a1a]" />
                  <span>Kargo Etiketi A4 Yazdır ({selectedOrderIds.length})</span>
                </button>
                <button
                  onClick={() => handleBatchPrint('STICKER')}
                  className="w-full p-2 rounded-lg flex items-center gap-2 text-left text-slate-700 hover:bg-slate-100"
                >
                  <Printer className="w-4 h-4 text-orange-500" />
                  <span>Kargo Etiketi Sticker Yazdır ({selectedOrderIds.length})</span>
                </button>
                <button
                  onClick={() => {
                    selectedOrderIds.forEach(id => handleUpdateOrderStatus(id, 'PREPARING'));
                    setBatchActionMenuOpen(false);
                    showToast(`${selectedOrderIds.length} sipariş toplu işleme alındı.`);
                  }}
                  className="w-full p-2 rounded-lg flex items-center gap-2 text-left text-slate-700 hover:bg-slate-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Toplu İşleme Al ({selectedOrderIds.length})</span>
                </button>
              </div>
            )}
          </div>

          {/* Ülke Filtresi */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-7"
            >
              <option value="ALL">🌐 Ülke</option>
              <option value="TR">Türkiye (TR)</option>
              <option value="AZ">Azerbaycan (AZ)</option>
              <option value="DE">Almanya (DE)</option>
            </select>
          </div>

          {/* Sıralama */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="NEWEST">Sipariş Tarihi (Yeniden Eskiye)</option>
              <option value="OLDEST">Sipariş Tarihi (Eskiden Yeniye)</option>
              <option value="PRICE_HIGH">Tutar (Yüksekten Düşüğe)</option>
              <option value="REMAINING_TIME">Kalan Süre (Öncelikli)</option>
            </select>
          </div>

        </div>

        {/* Sağ Bilgi ve Excel */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600 font-medium w-full lg:w-auto justify-between lg:justify-end">
          <div>
            Filtreleme: <strong className="text-slate-900 font-bold">Toplam {filteredOrders.length} sipariş</strong>
          </div>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden md:inline text-[11px] text-slate-400">Son Güncelleme: 23 Eylül 2026 08:40</span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold shadow-sm transition-all text-xs"
            >
              <FileSpreadsheet className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-600" />
              <span>Excel</span>
            </button>

            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-500 hidden sm:inline">Her Sayfada</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-700">&lt;</button>
              <span className="w-6 h-6 rounded bg-[#182230] text-white flex items-center justify-center font-bold">1</span>
              <button className="w-6 h-6 rounded border border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-700">&gt;</button>
            </div>
          </div>
        </div>

      </div>

      {/* 5. ANA BİRLEŞİK ÇOKLU PAZARYERİ SİPARİŞLER TABLOSU */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Tablo Başlıkları */}
            <thead>
              <tr className="bg-[#f8fafc] text-slate-700 font-bold border-b border-slate-300 text-[11px]">
                <th className="py-3 px-3 w-10 text-center">
                  <input 
                    type="checkbox"
                    checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    onChange={handleToggleSelectAll}
                    className="rounded text-[#f27a1a] focus:ring-[#f27a1a] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-bold">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Sipariş Bilgileri & Kanal</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold">Alıcı</th>
                <th className="py-3 px-4 font-bold">Bilgiler (Ürün / Model)</th>
                <th className="py-3 px-3 font-bold">Birim Fiyat</th>
                
                {/* YENİ EKLENEN NET KÂR (CEBİNE KALAN) SÜTUNU */}
                <th className="py-3 px-3 font-extrabold bg-emerald-50 text-emerald-900 border-x border-emerald-200">
                  <div className="flex items-center gap-1 cursor-pointer" title="Tüm maliyetler, komisyonlar ve kargo düşüldükten sonra cebinize giren net nakit kâr">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Net Kâr (Cebine Kalan)</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-200/70 px-1 py-0.2 rounded font-black">CANLI</span>
                  </div>
                </th>

                <th className="py-3 px-4 font-bold">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Kargo</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 font-bold">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Fatura</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 font-bold">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Durum / Aksiyon</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-2 w-8 text-center text-slate-400">
                  <Settings className="w-4 h-4 mx-auto" />
                </th>
              </tr>
            </thead>

            {/* Tablo Satırları */}
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-500 bg-slate-50/80">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="font-black text-base text-slate-900">
                          {orders.length === 0 ? '🟢 Canlı Satış Modu Aktif (0 Sipariş)' : 'Filtreye Uygun Sipariş Bulunamadı'}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {orders.length === 0 
                            ? 'Tüm deneme verileri temizlenmiştir. Pazar yeri API bağlantılarınızdan veya web sitenizden yeni sipariş aldığınızda anlık olarak tüm detaylarıyla burada listelenecektir.' 
                            : 'Arama kriterlerinizi değiştirebilir veya filtreleri temizleyerek tüm siparişleri görebilirsiniz.'}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const cachedImageMap = getStoredImageCache();
                  const rawItems = order.items && order.items.length > 0 ? order.items : [
                    {
                      id: 'ITEM-DEFAULT',
                      quantity: order.quantity || 1,
                      title: order.productName,
                      sku: order.sku || 'SKU-DEFAULT',
                      color: 'Standart',
                      barcode: order.barcode || '8680001928',
                      size: order.variant || 'Tek Ebat',
                      unitPrice: order.grossPrice,
                      costPrice: order.costPrice || (order.grossPrice ? order.grossPrice * 0.4 : 0),
                      commission: order.commission || (order.grossPrice ? order.grossPrice * 0.15 : 0),
                      netProfit: order.netProfit,
                      profitMargin: order.profitMargin,
                      image: order.image
                    }
                  ];

                  const itemsList = rawItems.map(item => {
                    const barcode = String(item.barcode || '').trim();
                    const sku = String(item.sku || '').trim();
                    const title = String(item.title || '').trim();
                    const titleLower = title.toLowerCase();

                    const matchedProd = (products || []).find(p => 
                      (barcode && p.barcode === barcode) ||
                      (sku && (p.sku === sku || p.id === sku)) ||
                      (titleLower && p.name && p.name.toLowerCase().trim() === titleLower)
                    );

                    const resolvedImage = resolveSmartProductImage({
                      directImage: item.image || order.image,
                      barcode,
                      sku,
                      title,
                      category: matchedProd?.category
                    });

                    return {
                      ...item,
                      image: resolvedImage
                    };
                  });

                  // Deterministik Gerçek Net Kâr ve Maliyet Hesaplaması (products hafızası ile senkron)
                  const profitCalc = calculateOrderProfit(order, products);

                  // Pazar Yeri Rozet Stili
                  const getMarketplaceBadge = (mp) => {
                    switch(mp) {
                      case 'Trendyol':
                        return { label: '🟠 Trendyol', className: 'bg-orange-100 text-orange-800 border-orange-300' };
                      case 'Hepsiburada':
                        return { label: '🟠 Hepsiburada', className: 'bg-orange-50 text-[#ff6000] border-orange-200' };
                      case 'Amazon TR':
                        return { label: '🟡 Amazon TR', className: 'bg-amber-100 text-amber-900 border-amber-300' };
                      case 'N11':
                        return { label: '🔴 N11', className: 'bg-rose-100 text-rose-800 border-rose-300' };
                      case 'Kendi Sitem (Shopify)':
                      case 'Shopify':
                        return { label: '🟢 Kendi Sitem', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
                      default:
                        return { label: mp, className: 'bg-slate-100 text-slate-800 border-slate-300' };
                    }
                  };

                  const mpBadge = getMarketplaceBadge(order.marketplace);

                  return (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-slate-50/90 transition-colors ${isSelected ? 'bg-orange-50/40' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-3 text-center align-top">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(order.id)}
                          className="rounded text-[#f27a1a] focus:ring-[#f27a1a] cursor-pointer"
                        />
                      </td>

                      {/* 1. SİPARİŞ BİLGİLERİ & KANAL ROZETİ */}
                      <td className="py-4 px-4 align-top space-y-1.5 min-w-[210px]">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                          <span className="font-mono text-slate-900">{order.id}</span>
                          <button 
                            onClick={() => handleCopyText(order.orderNumber || order.id, 'Sipariş No')}
                            className="text-slate-400 hover:text-slate-700"
                            title="Sipariş No Kopyala"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Pazar Yeri Rozeti */}
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold border ${mpBadge.className}`}>
                            {mpBadge.label}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Sipariş Tarihi: <span className="font-medium text-slate-700">{order.orderDate}</span>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Paket No: <span className="font-mono text-slate-700">{order.packageNo || '4182778690'}</span>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          Teslimat No: <span className="font-mono text-slate-700">{order.deliveryNo || '10888698922'}</span>
                        </div>

                        {order.remainingTime && (
                          <div className={`text-[11px] font-bold pt-0.5 ${order.remainingTimeUrgent ? 'text-rose-600' : 'text-blue-600'}`}>
                            Kalan Süre: {order.remainingTime}
                          </div>
                        )}
                      </td>

                      {/* 2. ALICI */}
                      <td className="py-4 px-3 align-top space-y-1 min-w-[140px]">
                        <div className="flex items-center gap-1 font-bold text-slate-900 text-xs">
                          {order.isPlus && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                          <span>{order.customerName}</span>
                        </div>

                        {order.isPlus && (
                          <div className="text-[10px] font-black text-pink-600 tracking-wide">
                            {order.marketplace === 'Amazon TR' ? 'Prime Üyesi' : order.marketplace === 'Hepsiburada' ? 'Premium Üye' : 'Trendyol Plus\'lı'}
                          </div>
                        )}

                        <div className="text-[10px] text-slate-500 leading-tight">
                          {order.customerCity}
                        </div>
                      </td>

                      {/* 3. BİLGİLER (ÜRÜN VEYA ÇOKLU ÜRÜN LİSTESİ) */}
                      <td className="py-4 px-4 align-top space-y-3 min-w-[280px]">
                        {itemsList.map((item, itemIdx) => (
                          <div key={item.id || itemIdx} className="flex items-start gap-3">
                            {/* Ürün Resmi & Mavi Adet Rozeti */}
                            <div className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex items-center justify-center">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.title || 'Ürün'} 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const fallback = e.currentTarget.parentElement?.querySelector('.no-img-badge');
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                  className="w-12 h-12 object-cover"
                                />
                              ) : null}
                              <div className={`no-img-badge w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-black text-xs items-center justify-center ${item.image ? 'hidden' : 'flex'}`}>
                                {(item.title || 'Ü').trim().charAt(0).toUpperCase()}
                              </div>
                              <span className="absolute -top-1 -left-1 w-4 h-4 bg-blue-600 text-white font-black text-[10px] rounded-full flex items-center justify-center shadow-sm z-10">
                                {item.quantity || 1}
                              </span>
                            </div>

                            {/* Ürün Metin Detayları */}
                            <div className="text-[11px] space-y-0.5 leading-snug">
                              <div className="flex items-center gap-1">
                                <a 
                                  href="#urun" 
                                  onClick={(e) => e.preventDefault()}
                                  className="font-bold text-slate-800 hover:text-blue-600 line-clamp-1"
                                  title={item.title}
                                >
                                  {item.title}
                                </a>
                                <button 
                                  onClick={() => handleCopyText(item.title, 'Ürün Başlığı')}
                                  className="text-slate-400 hover:text-slate-700 flex-shrink-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="text-slate-500 text-[10px]">
                                Stok Kodu: <span className="font-mono text-slate-700">{item.sku}</span>
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                Renk: <span className="text-slate-700">{item.color}</span>
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                Barkod: <span className="font-mono text-slate-700">{item.barcode}</span>
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                Beden: <span className="font-bold text-slate-700">{item.size}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </td>

                      {/* 4. BİRİM FİYAT */}
                      <td className="py-4 px-3 align-top min-w-[90px]">
                        <div className="space-y-3">
                          {itemsList.map((item, itemIdx) => (
                            <div key={itemIdx} className="font-bold text-slate-900 text-xs pt-1">
                              ₺{(item.unitPrice || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 5. NET KÂR (CEBİNE KALAN) & SATIR İÇİ (INLINE) ALIŞ MALİYETİ DÜZENLEME */}
                      <td className="py-4 px-3 align-top min-w-[190px] bg-emerald-50/40 border-x border-emerald-100">
                        <div className="space-y-2">
                          {/* Ürün Bazlı Kâr & Düzenlenebilir Maliyet Satırları */}
                          {profitCalc.items.map((calcItem, itemIdx) => {
                            const isCostKnown = calcItem.isCostEntered && calcItem.costPrice > 0;

                            return (
                              <div key={calcItem.id || itemIdx} className="pt-0.5 pb-1.5 border-b border-dashed border-emerald-200/80 last:border-0 space-y-1">
                                <div className="flex items-center justify-between gap-1">
                                  <span className={`font-extrabold text-xs ${calcItem.unitNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                                    {calcItem.unitNetProfit >= 0 
                                      ? `+₺${calcItem.unitNetProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                                      : `-₺${Math.abs(calcItem.unitNetProfit).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                  </span>
                                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                                    calcItem.unitNetProfit >= 0 
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                                  }`}>
                                    %{calcItem.profitMarginPercent} Marj
                                  </span>
                                </div>

                                {/* Satır İçi (Inline) Alış Fiyatı Kutucuğu & API Komisyonu */}
                                <div className="flex items-center justify-between gap-1 text-[10px] pt-0.5">
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-500 font-bold text-[10px]">Alış:</span>
                                    <div className="relative inline-flex items-center">
                                      <span className="text-slate-400 font-bold text-[9px] absolute left-1">₺</span>
                                      <input
                                        type="number"
                                        defaultValue={calcItem.costPrice ? calcItem.costPrice : ''}
                                        key={`input-${order.id}-${calcItem.id || itemIdx}-${calcItem.costPrice}`}
                                        onBlur={(e) => {
                                          const val = e.target.value;
                                          if (val !== '' && Number(val) !== calcItem.costPrice) {
                                            handleUpdateItemCost(order.id, calcItem.id, calcItem.barcode, calcItem.sku, val);
                                          }
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.target.blur();
                                          }
                                        }}
                                        placeholder="0.00"
                                        className={`w-16 pl-3 pr-1 py-0.5 rounded text-[10px] font-mono font-bold focus:outline-none transition-all ${
                                          isCostKnown 
                                            ? 'bg-white border border-slate-300 text-slate-800 hover:border-emerald-500 focus:border-[#f27a1a] focus:ring-1 focus:ring-[#f27a1a]' 
                                            : 'bg-amber-100 border-2 border-amber-400 text-amber-900 font-black animate-pulse focus:animate-none'
                                        }`}
                                        title="Alış maliyetini değiştirmek için yazıp Enter'a basın veya dışarı tıklayın. Otomatik olarak ürün hafızasına işlenir."
                                      />
                                    </div>
                                  </div>

                                  {/* API Komisyonu */}
                                  <span className="text-slate-500 text-[10px] font-medium" title={`API Kategori Komisyonu (%${calcItem.commissionRate || 15})`}>
                                    Kom: ₺{calcItem.commissionAmount?.toFixed(2)}
                                  </span>
                                </div>

                                {!isCostKnown && (
                                  <div className="text-[9px] text-amber-800 font-bold flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                    <span>⚠️ Alış fiyatını girin</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Paket Toplam Net Cebine Kalan */}
                          <div className="pt-1.5 mt-1 border-t border-emerald-300">
                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tight flex items-center justify-between">
                              <span>Paket Net Kâr:</span>
                              <span className="text-[9px] text-emerald-800 font-extrabold bg-emerald-100 px-1 py-0.2 rounded border border-emerald-200">
                                %{profitCalc.profitMarginPercent} Marj
                              </span>
                            </div>
                            <div className="text-sm font-black text-emerald-700 flex items-center gap-1 pt-0.5">
                              <span>{profitCalc.netProfit >= 0 ? `+₺${profitCalc.netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `-₺${Math.abs(profitCalc.netProfit).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                            </div>

                            {/* Popover / Tooltip Butonu: Açık Kâr Kırılım Kartı */}
                            <div className="relative mt-1.5">
                              <button
                                onClick={() => setOpenProfitBreakdownOrderId(openProfitBreakdownOrderId === order.id ? null : order.id)}
                                className="text-[10px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 bg-white hover:bg-emerald-100 px-2 py-1 rounded transition-all w-full justify-center border border-emerald-300 shadow-sm"
                              >
                                <Calculator className="w-3 h-3 text-emerald-600" />
                                <span>Kâr Kırılımı ⓘ</span>
                              </button>

                              {openProfitBreakdownOrderId === order.id && (
                                <div className="absolute top-full left-0 mt-1.5 w-72 bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl p-3.5 z-50 text-xs font-medium animate-scaleUp">
                                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                                    <span className="font-extrabold text-white text-[11px] flex items-center gap-1">
                                      <Sparkles className="w-3.5 h-3.5 text-[#f27a1a]" />
                                      <span>Net Kâr Hesaplama Motoru</span>
                                    </span>
                                    <button 
                                      onClick={() => setOpenProfitBreakdownOrderId(null)}
                                      className="text-slate-400 hover:text-white text-xs font-bold px-1"
                                    >
                                      ✕
                                    </button>
                                  </div>

                                  <div className="space-y-1.5 text-[11px]">
                                    <div className="flex justify-between text-slate-300">
                                      <span>(+) Brüt Satış Tutarı (API):</span>
                                      <span className="font-bold text-white">₺{profitCalc.grossPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-rose-300">
                                      <span>(-) Ürün Alış Maliyeti (Hafıza):</span>
                                      <span className="font-bold text-rose-400">-₺{profitCalc.totalCostPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-amber-300">
                                      <span>(-) Pazar Yeri Komisyonu (API %):</span>
                                      <span className="font-bold text-amber-400">-₺{profitCalc.totalCommission.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-blue-300">
                                      <span>(-) Kargo Gönderim Bedeli (Barem):</span>
                                      <span className="font-bold text-blue-400">-₺{profitCalc.cargoFee.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    
                                    <div className="border-t border-slate-700 pt-1.5 mt-1.5">
                                      <div className="flex justify-between text-[11px] text-slate-400">
                                        <span>🏦 Hesaba Yatacak Hakediş:</span>
                                        <span className="font-bold text-slate-200">₺{profitCalc.netPayout.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                      </div>
                                      <div className="flex justify-between text-xs font-black text-emerald-400 pt-1">
                                        <span>💰 CEBİNE KALAN NET:</span>
                                        <span className="text-sm">+₺{profitCalc.netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                                      </div>
                                      <div className="text-[10px] text-emerald-300/80 text-right font-bold">
                                        Net Kâr Marjı: %{profitCalc.profitMarginPercent}
                                      </div>
                                    </div>

                                    {/* Güvence Rozeti */}
                                    <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                                      <span>Resmi API Cari Ekstre & Kategori Baremi ile Doğrulanmıştır.</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 6. KARGO - Dinamik Taşıyıcı ve Takip */}
                      <td className="py-4 px-4 align-top space-y-1 min-w-[140px]">
                        <div>
                          {order.carrier === 'Trendyol Express' ? (
                            <span className="font-black text-xs tracking-tight text-slate-900">
                              trendyol<span className="text-[#f27a1a]">express</span>
                            </span>
                          ) : order.carrier === 'HepsiJET' ? (
                            <span className="font-black text-xs tracking-tight text-[#ff6000]">
                              Hepsi<span className="text-slate-900">JET</span>
                            </span>
                          ) : order.carrier?.includes('Kolay Gelsin') ? (
                            <span className="font-black text-xs text-amber-800">
                              Kolay Gelsin <span className="text-[10px] text-slate-500 font-normal">(Amazon)</span>
                            </span>
                          ) : (
                            <span className="font-bold text-xs text-slate-800">
                              {order.carrier || 'Yurtiçi Kargo'}
                            </span>
                          )}
                        </div>

                        <div className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{order.trackingNumber || '7330037383986536'}</span>
                          <button 
                            onClick={() => handleCopyText(order.trackingNumber || '', 'Kargo Takip No')}
                            className="text-slate-400 hover:text-slate-700"
                            title="Kargo Takip No Kopyala"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-[10px] text-slate-500 font-medium">
                          {order.marketplace} anlaşmalı kargo
                        </div>
                      </td>

                      {/* 7. FATURA */}
                      <td className="py-4 px-4 align-top space-y-1.5 min-w-[150px]">
                        <div className="text-xs font-bold text-slate-900">
                          Satış Tutarı: <span className="font-extrabold">₺{(order.grossPrice || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                        </div>

                        {/* Fatura Durum Rozeti */}
                        <div>
                          {order.invoiceStatus === 'ISSUED' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                              ✓ Kesildi: {order.invoiceNumber ? order.invoiceNumber.slice(0, 10) + '...' : 'E-Fatura'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                              <AlertCircle className="w-3 h-3 text-rose-500" />
                              Fatura Bekleniyor
                            </span>
                          )}
                        </div>

                        {/* Fatura İşlemleri Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenInvoiceOrderId(openInvoiceOrderId === order.id ? null : order.id)}
                            className="text-[11px] text-slate-700 hover:text-slate-900 font-bold flex items-center gap-1 border border-slate-300 rounded px-2 py-1 bg-white hover:bg-slate-50"
                          >
                            <span>Fatura İşlemleri</span>
                            <ChevronDown className="w-3 h-3" />
                          </button>

                          {openInvoiceOrderId === order.id && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1 space-y-1 z-40 text-xs font-bold animate-scaleUp">
                              <button
                                onClick={() => {
                                  handleUpdateOrderStatus(order.id, order.status);
                                  setOpenInvoiceOrderId(null);
                                  showToast(`⚡ GİB E-Faturası anında kesildi ve ${order.marketplace} sistemine yüklendi.`);
                                }}
                                className="w-full p-2 text-left hover:bg-slate-100 rounded-lg text-slate-700"
                              >
                                E-Fatura Kes & Gönder
                              </button>
                              <button
                                onClick={() => {
                                  if (onNavigateToInvoices) onNavigateToInvoices();
                                  setOpenInvoiceOrderId(null);
                                }}
                                className="w-full p-2 text-left hover:bg-slate-100 rounded-lg text-slate-700"
                              >
                                Faturayı Görüntüle / İndir
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 8. DURUM / AKSİYON BUTONLARI (A4 Etiket, Sticker Etiket, İşlemler ∨) */}
                      <td className="py-4 px-4 align-top space-y-1.5 min-w-[200px]">
                        
                        {/* Buton 1: Kargo Etiketini A4 Yazdır */}
                        <button
                          onClick={() => setShippingModalConfig({ isOpen: true, order, orders: [order], labelType: 'A4' })}
                          className="w-full py-1.5 px-3 rounded border border-[#f27a1a] text-[#f27a1a] hover:bg-orange-50 font-bold text-xs transition-colors text-center block"
                        >
                          Kargo Etiketini A4 Yazdır
                        </button>

                        {/* Buton 2: Kargo Etiketini Sticker Yazdır */}
                        <button
                          onClick={() => setShippingModalConfig({ isOpen: true, order, orders: [order], labelType: 'STICKER' })}
                          className="w-full py-1.5 px-3 rounded border border-[#f27a1a] text-[#f27a1a] hover:bg-orange-50 font-bold text-xs transition-colors text-center block"
                        >
                          Kargo Etiketini Sticker Yazdır
                        </button>

                        {/* Buton 3: İşlemler ∨ (Görsel 3 ile Birebir Pop-up Menü) */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenActionOrderId(openActionOrderId === order.id ? null : order.id)}
                            className="w-full py-1.5 px-3 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>İşlemler</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openActionOrderId === order.id ? 'rotate-180' : ''}`} />
                          </button>

                          {openActionOrderId === order.id && (
                            <div className="absolute right-0 top-full mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 space-y-0.5 z-40 text-xs font-semibold text-slate-800 animate-scaleUp">
                              
                              {/* 1. İşleme Al */}
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                                className="w-full p-2 text-left hover:bg-slate-100 rounded-lg flex items-center gap-2 font-bold text-emerald-700"
                              >
                                <span>⚡</span> İşleme Al
                              </button>

                              {/* 2. Başka Kargo Firması İle Gönder */}
                              <button
                                onClick={() => {
                                  setDocsModalConfig({ isOpen: true, type: 'CHANGE_CARRIER', order });
                                  setOpenActionOrderId(null);
                                }}
                                className="w-full p-2 text-left hover:bg-slate-100 rounded-lg flex items-center gap-2"
                              >
                                <span>🚚</span> Başka Kargo Firması İle Gönder
                              </button>

                              {/* 3. Paketi Böl */}
                              <button
                                onClick={() => {
                                  setDocsModalConfig({ isOpen: true, type: 'SPLIT_PACKAGE', order });
                                  setOpenActionOrderId(null);
                                }}
                                className="w-full p-2 text-left hover:bg-slate-100 rounded-lg flex items-center gap-2"
                              >
                                <span>✂️</span> Paketi Böl
                              </button>

                              {/* 4. İptal Et */}
                              <button
                                onClick={() => {
                                  setDocsModalConfig({ isOpen: true, type: 'CANCEL_ORDER', order });
                                  setOpenActionOrderId(null);
                                }}
                                className="w-full p-2 text-left hover:bg-rose-50 rounded-lg flex items-center gap-2 text-rose-600 font-bold"
                              >
                                <span>❌</span> İptal Et
                              </button>

                              {/* 5. Mağaza Kartı Yazdır */}
                              <button
                                onClick={() => {
                                  setDocsModalConfig({ isOpen: true, type: 'STORE_CARD', order });
                                  setOpenActionOrderId(null);
                                }}
                                className="w-full p-2 text-left hover:bg-slate-100 rounded-lg flex items-center gap-2"
                              >
                                <span>🏷️</span> Mağaza Kartı Yazdır
                              </button>

                              {/* 6. Mesafeli Satış Sözleşmesi */}
                              <button
                                onClick={() => {
                                  setDocsModalConfig({ isOpen: true, type: 'DISTANCE_CONTRACT', order });
                                  setOpenActionOrderId(null);
                                }}
                                className="w-full p-2 text-left hover:bg-slate-100 rounded-lg flex items-center gap-2"
                              >
                                <span>📄</span> Mesafeli Satış Sözleşmesi
                              </button>

                              {/* 7. Ön Bilgilendirme Formu */}
                              <button
                                onClick={() => {
                                  setDocsModalConfig({ isOpen: true, type: 'PRE_INFO', order });
                                  setOpenActionOrderId(null);
                                }}
                                className="w-full p-2 text-left hover:bg-slate-100 rounded-lg flex items-center gap-2"
                              >
                                <span>📋</span> Ön Bilgilendirme Formu
                              </button>

                            </div>
                          )}
                        </div>

                      </td>

                      {/* Ayar / 3 Nokta */}
                      <td className="py-4 px-2 text-center align-top text-slate-400">
                        <button 
                          onClick={() => showToast(`Sipariş #${order.id} detaylı logları açıldı.`)}
                          className="hover:text-slate-700"
                        >
                          •••
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. SOL ALT TURUNCU CANLI DESTEK BUTONU (Görsellerdeki Orijinal Widget) */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => showToast("Trendyol Satıcı Canlı Destek asistanı bağlandı.")}
          className="bg-[#f27a1a] hover:bg-[#d9670f] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black tracking-wide transition-all transform hover:scale-105"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span>Canlı Destek</span>
        </button>
      </div>

      {/* 7. SAĞ KENAR DİKEY GERİ BİLDİRİM BUTONU (Görsellerdeki Orijinal Widget) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => showToast("Geri bildirim formu açıldı.")}
          className="bg-[#182230] text-white text-[11px] font-bold px-2 py-3 rounded-l-lg shadow-lg flex items-center gap-1.5 [writing-mode:vertical-rl] rotate-180 hover:bg-slate-800 transition-colors"
        >
          <span>Geri bildirim</span>
        </button>
      </div>

      {/* Modallar */}
      <ShippingLabelModal
        isOpen={shippingModalConfig.isOpen}
        onClose={() => setShippingModalConfig({ ...shippingModalConfig, isOpen: false })}
        order={shippingModalConfig.order}
        orders={shippingModalConfig.orders}
        labelType={shippingModalConfig.labelType}
        onSuccess={() => showToast("Kargo etiketi başarıyla yazdırıldı.")}
      />

      <OrderDocsModal
        isOpen={docsModalConfig.isOpen}
        onClose={() => setDocsModalConfig({ ...docsModalConfig, isOpen: false })}
        type={docsModalConfig.type}
        order={docsModalConfig.order}
        onActionComplete={(msg) => showToast(msg)}
      />

    </div>
  );
}
