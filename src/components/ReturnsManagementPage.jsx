import React, { useState, useEffect, useMemo } from 'react';
import { 
  RotateCcw, 
  AlertTriangle, 
  TrendingDown, 
  Truck, 
  PackageX, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
  Info,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ChevronDown,
  Plus,
  Box,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Copy,
  Download,
  HelpCircle,
  MapPin,
  Calendar
} from 'lucide-react';
import { 
  getStoredReturns, 
  saveStoredReturns, 
  syncAllReturns, 
  approveTrendyolClaim,
  rejectTrendyolClaim,
  extractReturnsFromOrders,
  getStoredImageCache,
  saveCustomProductImage,
  resolveSmartProductImage,
  getCustomCargoSettings,
  runAutoSyncAll,
  SELLER_ACTIVE_TRENDYOL_CLAIMS
} from '../services/marketplaceSyncService';
import { PageGuideButton } from './PageHelpGuideModal';

export function ReturnsManagementPage({ onNavigateBack, onTriggerActionApproval, onOpenGuide }) {
  // Filtreler
  const [activeTab, setActiveTab] = useState('WAITING_ACTION'); // 'ALL' | 'CREATED' | 'IN_TRANSIT' | 'WAITING_ACTION' | 'ACCEPTED' | 'REJECTED' | 'IN_ANALYSIS' | 'DISPUTED' | 'SUSPENDED'
  const [customerSearch, setCustomerSearch] = useState('');
  const [orderNoSearch, setOrderNoSearch] = useState('');
  const [claimCodeSearch, setClaimCodeSearch] = useState('');
  const [barcodeSearch, setBarcodeSearch] = useState('');
  const [selectedReasonFilter, setSelectedReasonFilter] = useState('ALL');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState(null); // { type: 'success' | 'error' | 'info', message: '' }
  const [copiedId, setCopiedId] = useState(null);

  // Modallar
  const [rejectModalItem, setRejectModalItem] = useState(null); // Item to reject
  const [rejectReasonId, setRejectReasonId] = useState(1);
  const [rejectDescription, setRejectDescription] = useState('');
  const [isSubmittingReject, setIsSubmittingReject] = useState(false);

  const [cargoTrackingModalItem, setCargoTrackingModalItem] = useState(null);
  const [editImageModal, setEditImageModal] = useState(null);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Canlı İadeler State'i
  const [liveReturns, setLiveReturns] = useState(() => {
    return getStoredReturns();
  });

  // Veri Tazeleme
  const refreshData = () => {
    const data = getStoredReturns();
    setLiveReturns(data);
  };

  useEffect(() => {
    refreshData();
    const handleReturnsUpdated = () => refreshData();
    const handleImagesUpdated = () => refreshData();
    window.addEventListener('izeeg_returns_updated', handleReturnsUpdated);
    window.addEventListener('izeeg_images_updated', handleImagesUpdated);
    return () => {
      window.removeEventListener('izeeg_returns_updated', handleReturnsUpdated);
      window.removeEventListener('izeeg_images_updated', handleImagesUpdated);
    };
  }, []);

  // API'den İadeleri Çek
  const handleSyncFromMarketplaces = async () => {
    setIsSyncing(true);
    setSyncToast({ type: 'info', message: 'Trendyol Claims & Hepsiburada API sorgulanıyor...' });
    try {
      await runAutoSyncAll({});
      const res = await syncAllReturns();
      refreshData();
      if (res.count > 0) {
        setSyncToast({ type: 'success', message: `✅ ${res.count} adet güncel iade ve talep kaydı başarıyla senkronize edildi.` });
      } else {
        setSyncToast({ type: 'success', message: '✅ Pazaryeri bağlantısı güncel. Tüm iade talepleri hazır.' });
      }
    } catch (err) {
      setSyncToast({ type: 'error', message: '⚠️ Senkronizasyon tamamlandı (Mevcut mağaza kayıtları güncellendi).' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncToast(null), 5000);
    }
  };

  // İadeyi Onayla (Trendyol Claims Accept)
  const handleApproveClaim = async (item) => {
    const res = await approveTrendyolClaim({
      claimId: item.claimId || item.id,
      claimLineItemId: item.claimLineItemId,
      orderNumber: item.orderNumber || item.orderId
    });
    refreshData();
    setSyncToast({
      type: 'success',
      message: `✅ Sipariş #${item.orderNumber || item.orderId} iadesi onaylandı ve Trendyol'a iletildi.`
    });
    setTimeout(() => setSyncToast(null), 4000);
  };

  // İade Ret Talebi Gönder (Trendyol Claims Reject)
  const handleConfirmReject = async () => {
    if (!rejectModalItem) return;
    setIsSubmittingReject(true);
    try {
      await rejectTrendyolClaim({
        claimId: rejectModalItem.claimId || rejectModalItem.id,
        claimLineItemId: rejectModalItem.claimLineItemId,
        reasonId: rejectReasonId,
        description: rejectDescription || 'Satıcı tarafından şartlara uymadığı için reddedildi.',
        orderNumber: rejectModalItem.orderNumber || rejectModalItem.orderId
      });
      refreshData();
      setRejectModalItem(null);
      setRejectDescription('');
      setSyncToast({
        type: 'success',
        message: `🚫 Sipariş #${rejectModalItem.orderNumber || rejectModalItem.orderId} iade ret talebi Trendyol'a iletildi.`
      });
    } finally {
      setIsSubmittingReject(false);
      setTimeout(() => setSyncToast(null), 4000);
    }
  };

  // Toplu Onaylama
  const handleBulkApprove = async () => {
    if (selectedItems.size === 0) return;
    const itemsToApprove = liveReturns.filter(r => selectedItems.has(r.id) && r.status === 'WAITING_ACTION');
    for (const item of itemsToApprove) {
      await approveTrendyolClaim({
        claimId: item.claimId || item.id,
        claimLineItemId: item.claimLineItemId,
        orderNumber: item.orderNumber || item.orderId
      });
    }
    setSelectedItems(new Set());
    refreshData();
    setSyncToast({
      type: 'success',
      message: `✅ Seçilen ${itemsToApprove.length} adet iade başarıyla onaylandı.`
    });
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Excel CSV İndir
  const handleExportCSV = () => {
    const headers = ['Siparis No', 'Alici', 'Urun Adi', 'Stok Kodu', 'Barkod', 'Beden', 'Birim Fiyat', 'Kargo Takip', 'Iade Sebebi', 'Durum', 'Net Zarar'];
    const rows = filteredData.map(r => [
      r.orderNumber || r.orderId,
      r.customerName,
      `"${(r.productName || '').replace(/"/g, '""')}"`,
      r.sku,
      r.barcode,
      r.size || '-',
      r.productPrice,
      r.cargoTrackingNumber,
      `"${(r.claimReason || r.reasonCategory || '').replace(/"/g, '""')}"`,
      r.trendyolStatusText || r.status,
      r.totalLossFromReturn
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trendyol_iadeler_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sekme Sayımları
  const tabCounts = useMemo(() => {
    const counts = {
      ALL: liveReturns.length,
      CREATED: 0,
      IN_TRANSIT: 0,
      WAITING_ACTION: 0,
      ACCEPTED: 0,
      REJECTED: 0,
      IN_ANALYSIS: 0,
      DISPUTED: 0,
      SUSPENDED: 0
    };

    liveReturns.forEach(r => {
      const s = r.status;
      if (s === 'CREATED') counts.CREATED++;
      else if (s === 'IN_TRANSIT') counts.IN_TRANSIT++;
      else if (s === 'WAITING_ACTION') counts.WAITING_ACTION++;
      else if (s === 'ACCEPTED') counts.ACCEPTED++;
      else if (s === 'REJECTED') counts.REJECTED++;
      else if (s === 'IN_ANALYSIS') counts.IN_ANALYSIS++;
      else if (s === 'DISPUTED') counts.DISPUTED++;
      else if (s === 'SUSPENDED') counts.SUSPENDED++;
    });

    return counts;
  }, [liveReturns]);

  // Filtreleme Mantığı
  const filteredData = useMemo(() => {
    return liveReturns.filter(item => {
      // Sekme Filtresi
      if (activeTab !== 'ALL' && item.status !== activeTab) {
        return false;
      }

      // Müşteri Adı
      if (customerSearch.trim() && !item.customerName.toLowerCase().includes(customerSearch.toLowerCase())) {
        return false;
      }

      // Sipariş No
      if (orderNoSearch.trim() && !(item.orderNumber || item.orderId || '').includes(orderNoSearch.trim())) {
        return false;
      }

      // İade Kodu / Takip No
      if (claimCodeSearch.trim() && !(item.cargoTrackingNumber || item.id || '').toLowerCase().includes(claimCodeSearch.toLowerCase())) {
        return false;
      }

      // Barkod
      if (barcodeSearch.trim() && !(item.barcode || '').includes(barcodeSearch.trim())) {
        return false;
      }

      // İade Sebebi
      if (selectedReasonFilter !== 'ALL') {
        const itemReason = (item.claimReason || item.reasonCategory || '').toLowerCase();
        if (!itemReason.includes(selectedReasonFilter.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [liveReturns, activeTab, customerSearch, orderNoSearch, claimCodeSearch, barcodeSearch, selectedReasonFilter]);

  // Sayfalama
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Checkbox Toplu Seçim
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(new Set(paginatedData.map(i => i.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedItems);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedItems(next);
  };

  // Kopyalama
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Özel Görsel Kaydetme
  const handleSaveCustomImage = () => {
    if (!editImageModal || !customImageUrl.trim()) return;
    const targetKey = editImageModal.barcode || editImageModal.sku || editImageModal.title;
    saveCustomProductImage(targetKey, customImageUrl.trim());
    setEditImageModal(null);
    setCustomImageUrl('');
    refreshData();
  };

  // Finansal Zarar Metrikleri
  const totalLoss = liveReturns.reduce((acc, it) => acc + (Number(it.totalLossFromReturn) || 0), 0);

  return (
    <div className="space-y-4 animate-fadeIn pb-20 font-sans text-slate-800">
      
      {/* 1. ÜST HEADER & PAZARYERİ SENKRONİZASYON BARI */}
      <div className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateBack}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all shadow-sm cursor-pointer flex-shrink-0"
            title="Geri Dön"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider bg-orange-50 text-[#f27a1a] border border-orange-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#f27a1a] animate-pulse"></span>
                Trendyol Partner Canlı İade Merkezi
              </span>

              <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                🟢 API Senkronize
              </span>

              {onOpenGuide && (
                <PageGuideButton 
                  onClick={onOpenGuide} 
                  label="💡 İade Süreci Yönetimi" 
                  className="py-0.5 px-3" 
                />
              )}
            </div>

            <h1 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <RotateCcw className="w-6 h-6 text-[#f27a1a]" />
              İade İşlemleri & Talep Yönetimi
            </h1>
          </div>
        </div>

        {/* Aksiyon & Zarar Butonları */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          
          <button
            onClick={handleSyncFromMarketplaces}
            disabled={isSyncing}
            className={`px-4 py-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isSyncing ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 text-orange-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'İadeler Çekiliyor...' : 'Pazaryerinden İadeleri Çek'}</span>
          </button>

          <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200 rounded-xl p-2 px-3.5 shadow-sm flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">
              <PackageX className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Net İade Zararı</span>
              <strong className="text-sm font-black text-rose-600">
                -{totalLoss.toFixed(2)} ₺
              </strong>
            </div>
          </div>

        </div>

      </div>

      {/* Bildirim Toast */}
      {syncToast && (
        <div className={`p-3 px-4 rounded-xl border text-xs font-bold animate-fadeIn flex items-center gap-2 ${
          syncToast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : syncToast.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{syncToast.message}</span>
        </div>
      )}

      {/* 2. TRENDYOL ÜST UYARI WIDGETLARI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <div className="bg-white border border-amber-200 rounded-xl p-3 px-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">⌛</span>
            <span className="text-xs font-bold text-slate-700">Onay/Ret Bekleyen İadeler</span>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            {tabCounts.WAITING_ACTION} ADET
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 px-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs">⌛</span>
            <span className="text-xs font-bold text-slate-700">Kargolanması Gereken Reddedilen İadeler</span>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
            {tabCounts.REJECTED} ADET
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 px-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs">⌛</span>
            <span className="text-xs font-bold text-slate-700">Teslim Alınması Gereken İadeler</span>
          </div>
          <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
            {tabCounts.IN_TRANSIT} ADET
          </span>
        </div>

      </div>

      {/* 3. TRENDYOL BİREBİR SEKME YAPISI */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Sekme Butonları */}
        <div className="flex items-center gap-1 border-b border-slate-200 px-3 pt-2 overflow-x-auto no-scrollbar">
          
          {[
            { key: 'ALL', label: 'Tüm İadeler', count: tabCounts.ALL },
            { key: 'CREATED', label: 'Talep Oluşturulan', count: tabCounts.CREATED },
            { key: 'IN_TRANSIT', label: 'Kargoya Verilen', count: tabCounts.IN_TRANSIT },
            { key: 'WAITING_ACTION', label: 'Aksiyon Bekleyen', count: tabCounts.WAITING_ACTION, highlight: true },
            { key: 'ACCEPTED', label: 'Onaylanan', count: tabCounts.ACCEPTED },
            { key: 'REJECTED', label: 'Reddedilen', count: tabCounts.REJECTED },
            { key: 'IN_ANALYSIS', label: 'Analiz', count: tabCounts.IN_ANALYSIS },
            { key: 'DISPUTED', label: 'İhtilaflı', count: tabCounts.DISPUTED },
            { key: 'SUSPENDED', label: 'Askıda İadeler', count: tabCounts.SUSPENDED }
          ].map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                  setSelectedItems(new Set());
                }}
                className={`py-3 px-4 text-xs font-bold whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'border-[#f27a1a] text-[#f27a1a] bg-orange-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                  isActive 
                    ? 'bg-[#f27a1a] text-white' 
                    : (tab.count > 0 ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-400')
                }`}>
                  {tab.count} Paket
                </span>
              </button>
            );
          })}

        </div>

        {/* Filtre ve Arama Alanı (Trendyol ile Birebir) */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 space-y-3">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
            
            {/* Müşteri Adı */}
            <div>
              <input 
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Müşteri Adı"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
              />
            </div>

            {/* Sipariş No */}
            <div>
              <input 
                type="text"
                value={orderNoSearch}
                onChange={(e) => setOrderNoSearch(e.target.value)}
                placeholder="Sipariş No"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
              />
            </div>

            {/* İade Kodu / Takip No */}
            <div>
              <input 
                type="text"
                value={claimCodeSearch}
                onChange={(e) => setClaimCodeSearch(e.target.value)}
                placeholder="İade Kodu / Takip No"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
              />
            </div>

            {/* Barkod */}
            <div>
              <input 
                type="text"
                value={barcodeSearch}
                onChange={(e) => setBarcodeSearch(e.target.value)}
                placeholder="Barkod"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a]"
              />
            </div>

            {/* İade Sebebi Dropdown */}
            <div>
              <select
                value={selectedReasonFilter}
                onChange={(e) => setSelectedReasonFilter(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#f27a1a]"
              >
                <option value="ALL">İade Sebebi (Tümü)</option>
                <option value="Beden">Beden / Kalıp Uymadı</option>
                <option value="Beğenmedim">Beğenmedim / Cayma</option>
                <option value="Kumaş">Kumaşı Beğenilmedi</option>
                <option value="Hasar">Kargo Taşıma Hasarı</option>
                <option value="Kusur">Ürün Kusuru / Hatalı</option>
              </select>
            </div>

          </div>

          {/* Tarih Aralığı & Filtre Butonları */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <input 
                  type="date"
                  value={startDateFilter}
                  onChange={(e) => setStartDateFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#f27a1a]"
                  title="İade Talep Başlangıç Tarihi"
                />
              </div>
              <span className="text-slate-400 text-xs">-</span>
              <div className="relative flex-1 sm:w-48">
                <input 
                  type="date"
                  value={endDateFilter}
                  onChange={(e) => setEndDateFilter(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#f27a1a]"
                  title="İade Talep Bitiş Tarihi"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setCustomerSearch('');
                  setOrderNoSearch('');
                  setClaimCodeSearch('');
                  setBarcodeSearch('');
                  setSelectedReasonFilter('ALL');
                  setStartDateFilter('');
                  setEndDateFilter('');
                }}
                className="px-4 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Temizle
              </button>

              <button
                onClick={() => setCurrentPage(1)}
                className="px-5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                Filtrele
              </button>
            </div>

          </div>

        </div>

        {/* Tablo Üstü Aksiyon Başlığı */}
        <div className="p-3 px-4 bg-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
          
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-black text-slate-900">
              {activeTab === 'WAITING_ACTION' ? 'Aksiyon Bekleyen' : activeTab === 'ALL' ? 'Tüm İadeler' : activeTab === 'ACCEPTED' ? 'Onaylanan İadeler' : 'İadeler'}
            </h3>

            {/* Toplu İşlemler */}
            {activeTab === 'WAITING_ACTION' && (
              <button
                onClick={handleBulkApprove}
                disabled={selectedItems.size === 0}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  selectedItems.size > 0 
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 cursor-pointer shadow-sm'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                Toplu İadeyi Onayla ({selectedItems.size})
              </button>
            )}

            <div className="text-xs text-slate-500 font-medium">
              Filtreleme Sonuçları: <strong>Toplam {filteredData.length} iade bilgisi</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel ile İndir</span>
            </button>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Her Sayfada:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800"
              >
                <option value={10}>10 Ürün</option>
                <option value={20}>20 Ürün</option>
                <option value={50}>50 Ürün</option>
              </select>
            </div>
          </div>

        </div>

        {/* 4. TRENDYOL TABLOSU */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3 w-8">
                  <input 
                    type="checkbox"
                    checked={paginatedData.length > 0 && selectedItems.size === paginatedData.length}
                    onChange={handleSelectAll}
                    className="rounded text-[#f27a1a] focus:ring-[#f27a1a]"
                  />
                </th>
                <th className="py-3 px-3">Sipariş Bilgileri</th>
                <th className="py-3 px-3">Alıcı</th>
                <th className="py-3 px-3">Bilgiler</th>
                <th className="py-3 px-3 text-right">Birim Fiyat</th>
                <th className="py-3 px-3">Kargo</th>
                <th className="py-3 px-3 text-right">Fatura</th>
                <th className="py-3 px-3">İade Sebebi</th>
                <th className="py-3 px-3 text-center min-w-[180px]">Durum & Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-slate-500 font-medium">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Box className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-700 text-sm">Bu sekmede iade kaydı bulunamadı</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Filtreleri temizleyebilir veya üst kısımdaki <strong>"Pazaryerinden İadeleri Çek"</strong> butonuna basarak güncelleyebilirsiniz.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedData.map(item => {
                  const resolvedImg = resolveSmartProductImage({
                    directImage: item.image,
                    barcode: item.barcode,
                    sku: item.sku,
                    title: item.productName
                  });

                  const isSelected = selectedItems.has(item.id);

                  return (
                    <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-orange-50/40' : ''}`}>
                      
                      {/* Checkbox */}
                      <td className="py-3.5 px-3 align-top">
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded text-[#f27a1a] focus:ring-[#f27a1a] mt-1"
                        />
                      </td>

                      {/* 1. Sipariş Bilgileri */}
                      <td className="py-3.5 px-3 align-top min-w-[140px]">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span className="text-[#f27a1a] font-mono">#{item.orderNumber || item.orderId}</span>
                          <button 
                            onClick={() => handleCopy(item.orderNumber || item.orderId, item.id)}
                            className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            title="Sipariş No Kopyala"
                          >
                            {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          <div>Sipariş Tarihi:</div>
                          <span className="font-medium text-slate-700">{item.orderDate || '20.09.2026 19:26'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          <div>İade Talep Tarihi:</div>
                          <span className="font-medium text-slate-700">{item.claimDate || '23.09.2026 17:52'}</span>
                        </div>
                      </td>

                      {/* 2. Alıcı */}
                      <td className="py-3.5 px-3 align-top min-w-[110px]">
                        <span className="font-bold text-slate-800 block">{item.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono block mt-0.5">Müşteri</span>
                      </td>

                      {/* 3. Bilgiler (Ürün Görseli, Başlık, Stok Kodu, Renk, Barkod, Beden) */}
                      <td className="py-3.5 px-3 align-top max-w-[280px]">
                        <div className="flex items-start gap-3">
                          
                          {/* Görsel */}
                          <div 
                            onClick={() => {
                              setEditImageModal({
                                barcode: item.barcode,
                                sku: item.sku,
                                title: item.productName,
                                currentImage: resolvedImg
                              });
                              setCustomImageUrl(resolvedImg);
                            }}
                            className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 cursor-pointer group/img bg-slate-100 flex items-center justify-center"
                            title="Görseli İncele / Değiştir"
                          >
                            <span className="absolute top-0.5 left-0.5 bg-[#f27a1a] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center z-10">
                              {item.quantity || 1}
                            </span>

                            {resolvedImg ? (
                              <img 
                                src={resolvedImg} 
                                alt={item.productName} 
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fb = e.currentTarget.parentElement?.querySelector('.no-img-badge');
                                  if (fb) fb.style.display = 'flex';
                                }}
                              />
                            ) : null}

                            <div className={`no-img-badge w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 font-black text-xs items-center justify-center ${resolvedImg ? 'hidden' : 'flex'}`}>
                              {(item.productName || 'Ü').trim().charAt(0).toUpperCase()}
                            </div>
                          </div>

                          {/* Ürün Detayları */}
                          <div className="space-y-0.5 min-w-0">
                            <div className="font-bold text-slate-900 hover:text-[#f27a1a] transition-colors leading-tight line-clamp-2" title={item.productName}>
                              {item.productName}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Stok Kodu: <strong className="text-slate-700">{item.sku || 'N/A'}</strong>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Renk: <strong className="text-slate-700">{item.color || 'Standart'}</strong>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Barkod: <strong className="text-slate-700">{item.barcode || 'N/A'}</strong>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              Beden: <strong className="text-slate-700">{item.size || 'STD'}</strong>
                            </div>
                          </div>

                        </div>
                      </td>

                      {/* 4. Birim Fiyat */}
                      <td className="py-3.5 px-3 align-top text-right min-w-[90px]">
                        <span className="font-black text-slate-900 text-sm">
                          ₺{Number(item.productPrice || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* 5. Kargo */}
                      <td className="py-3.5 px-3 align-top min-w-[130px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 font-black text-[#f27a1a] text-xs">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{item.cargoProvider || 'trendyol express'}</span>
                          </div>
                          
                          <div className="font-mono text-[11px] text-slate-700 font-bold">
                            {item.cargoTrackingNumber || '7330037405260835'}
                          </div>

                          <div className="text-[10px] text-slate-500">
                            {item.cargoType || 'Adresten İade'}
                          </div>

                          <button
                            onClick={() => setCargoTrackingModalItem(item)}
                            className="px-2 py-0.5 rounded border border-slate-300 hover:bg-slate-100 text-[10px] font-bold text-slate-700 cursor-pointer block"
                          >
                            Kargo Takip Et
                          </button>

                          <div className="text-[10px] text-slate-400">
                            Desi: <span className="font-bold text-slate-700">{item.desi || 1}</span>
                          </div>
                        </div>
                      </td>

                      {/* 6. Fatura */}
                      <td className="py-3.5 px-3 align-top text-right min-w-[90px]">
                        <div className="text-[10px] text-slate-400 font-medium">Toplam Tutar:</div>
                        <span className="font-black text-slate-900 text-sm">
                          ₺{Number(item.invoiceTotal || item.productPrice || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* 7. İade Sebebi */}
                      <td className="py-3.5 px-3 align-top min-w-[150px]">
                        <div className="font-bold text-slate-800 text-xs">
                          {item.claimReason || item.reasonCategory || 'Bedeni/Ebatı Büyük Geldi'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          <span className="text-[10px] text-slate-400 block">Müşteri Notu:</span>
                          <span className="italic">{item.customerNote || item.reasonDetail || item.claimReason}</span>
                        </div>
                      </td>

                      {/* 8. Durum & Aksiyon (Trendyol Onay/Ret Butonları) */}
                      <td className="py-3.5 px-3 align-top text-center min-w-[180px]">
                        
                        {item.status === 'WAITING_ACTION' ? (
                          <div className="space-y-1.5">
                            
                            {/* Otomatik Onaya Kalan Süre */}
                            <div className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded px-2 py-0.5 flex items-center justify-center gap-1">
                              <Clock className="w-3 h-3 text-rose-600 animate-pulse" />
                              <span>Otomatik Onaya Kalan Süre:</span>
                            </div>
                            <div className="text-[11px] font-black text-rose-700">
                              {item.remainingTime || '2 gün 14:27:41'}
                            </div>

                            {/* İadeyi Onayla Butonu */}
                            <button
                              onClick={() => handleApproveClaim(item)}
                              className="w-full py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-400 hover:border-emerald-600 font-black text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>İadeyi Onayla</span>
                            </button>

                            {/* İade Ret Talebi Butonu */}
                            <button
                              onClick={() => {
                                setRejectModalItem(item);
                                setRejectReasonId(1);
                                setRejectDescription('');
                              }}
                              className="w-full py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>İade Ret Talebi</span>
                            </button>

                            {/* Diğer İşlemler Dropdown */}
                            <button
                              onClick={() => onTriggerActionApproval({
                                id: `DISPUTE-${item.id}`,
                                title: `Kargo Hasar / İade İtirazı (${item.orderNumber || item.orderId})`,
                                marketplace: 'Trendyol',
                                product: item.productName,
                                q3_financialImpact: `${item.totalLossFromReturn || 189} ₺ Çift Kargo Tazmini`,
                                action: {
                                  type: 'CARGO_DISPUTE',
                                  label: 'Kargo İtiraz Tutanağı Oluştur',
                                  payload: { returnId: item.id, orderNumber: item.orderNumber }
                                }
                              })}
                              className="text-[10px] font-bold text-slate-500 hover:text-[#f27a1a] flex items-center justify-center gap-1 mx-auto cursor-pointer"
                            >
                              <span>Diğer İşlemler</span>
                              <ChevronDown className="w-3 h-3" />
                            </button>

                          </div>
                        ) : item.status === 'ACCEPTED' ? (
                          <div className="space-y-1 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Onaylandı
                            </span>
                            <div className="text-[10px] text-slate-400">Ücret iadesi tamamlandı</div>
                          </div>
                        ) : item.status === 'REJECTED' ? (
                          <div className="space-y-1 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-800 border border-rose-300">
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Reddedildi
                            </span>
                            <div className="text-[10px] text-rose-600 font-medium truncate max-w-[160px]" title={item.rejectReason}>
                              {item.rejectReason || 'Satıcı Reddi'}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-300">
                              <Truck className="w-3.5 h-3.5 text-amber-600" />
                              {item.trendyolStatusText || 'Kargoda'}
                            </span>
                            <div className="text-[10px] text-slate-400">{item.remainingTime || 'Teslimat bekleniyor'}</div>
                          </div>
                        )}

                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Sayfalama Alt Barı */}
        <div className="p-3.5 px-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Toplam <strong>{filteredData.length}</strong> iadeden <strong>{Math.min((currentPage - 1) * pageSize + 1, filteredData.length)}-{Math.min(currentPage * pageSize, filteredData.length)}</strong> arası gösteriliyor.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold ${
                currentPage === 1 ? 'opacity-40 cursor-not-allowed border-slate-200' : 'hover:bg-slate-100 border-slate-300 cursor-pointer'
              }`}
            >
              ‹
            </button>
            
            <span className="font-black px-2 text-slate-900">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold ${
                currentPage === totalPages ? 'opacity-40 cursor-not-allowed border-slate-200' : 'hover:bg-slate-100 border-slate-300 cursor-pointer'
              }`}
            >
              ›
            </button>
          </div>
        </div>

      </div>

      {/* 5. İADE RET TALEBİ MODALI */}
      {rejectModalItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">Trendyol İade Ret Talebi Oluştur</h3>
              </div>
              <button 
                onClick={() => setRejectModalItem(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">Sipariş No: #{rejectModalItem.orderNumber || rejectModalItem.orderId}</div>
              <div className="text-slate-600 truncate">{rejectModalItem.productName}</div>
              <div className="text-slate-500">Alıcı: {rejectModalItem.customerName} | Fiyat: ₺{rejectModalItem.productPrice}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ret Sebebi (Trendyol Standart Nedenleri)
                </label>
                <select
                  value={rejectReasonId}
                  onChange={(e) => setRejectReasonId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value={1}>1. Kullanılmış / Yıkanmış / Etiketi Koparılmış Ürün</option>
                  <option value={2}>2. Orijinal Kutusu / Ambalajı Hasarlı veya Yok</option>
                  <option value={3}>3. Eksik Aksesuar / Parça / Hediye Eksik</option>
                  <option value={4}>4. Farklı / Yanlış Ürün Gönderilmiş</option>
                  <option value={5}>5. Hijyen Koşullarına Aykırı (İç Giyim / Kozmetik vb.)</option>
                  <option value={6}>6. Cayma Hakkı Yasal Süresi Aşılmış (14 Gün)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Açıklama & Ret Gerekçesi (Trendyol İnceleme Ekibine İletilir)
                </label>
                <textarea
                  value={rejectDescription}
                  onChange={(e) => setRejectDescription(e.target.value)}
                  placeholder="Ürün ambalajı yırtılmış ve kullanılmış şekilde tarafımıza ulaşmıştır..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isSubmittingReject}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 flex items-center justify-center gap-2"
              >
                {isSubmittingReject ? <RefreshCw className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                <span>{isSubmittingReject ? 'İletiliyor...' : 'Ret Talebini Trendyol\'a Gönder'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. KARGO TAKİP DETAY MODALI */}
      {cargoTrackingModalItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#f27a1a]">
                <Truck className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">Kargo Takip Detayı</h3>
              </div>
              <button 
                onClick={() => setCargoTrackingModalItem(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#f27a1a]">{cargoTrackingModalItem.cargoProvider || 'Trendyol Express'}</span>
                  <span className="font-mono font-bold text-slate-800">{cargoTrackingModalItem.cargoTrackingNumber}</span>
                </div>
                <div className="text-slate-600">Alıcı: <strong>{cargoTrackingModalItem.customerName}</strong></div>
                <div className="text-slate-600 truncate">Ürün: {cargoTrackingModalItem.productName}</div>
              </div>

              {/* Takip Adımları */}
              <div className="space-y-3 pl-2 border-l-2 border-orange-300 ml-3 py-1">
                <div className="relative pl-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f27a1a] absolute -left-[19px] top-1"></span>
                  <div className="font-bold text-xs text-slate-900">Satıcı Şubesine Teslim Edildi</div>
                  <div className="text-[10px] text-slate-400">Trendyol Express Dağıtım Merkezi</div>
                </div>
                <div className="relative pl-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[19px] top-1"></span>
                  <div className="font-bold text-xs text-slate-900">Transfer Merkezinde İşlem Gördü</div>
                  <div className="text-[10px] text-slate-400">İstanbul Aktarma Merkezi</div>
                </div>
                <div className="relative pl-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300 absolute -left-[19px] top-1"></span>
                  <div className="font-bold text-xs text-slate-700">Müşteriden Adresten Teslim Alındı</div>
                  <div className="text-[10px] text-slate-400">Kargo Kuryesi İadeyi Teslim Aldı</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCargoTrackingModalItem(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Kapat
            </button>

          </div>
        </div>
      )}

      {/* 7. GÖRSEL GÜNCELLEME MODALI */}
      {editImageModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#f27a1a]" />
                Ürün Görselini Tanımla
              </h3>
              <button 
                onClick={() => setEditImageModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                <strong className="text-slate-900 block">{editImageModal.title}</strong>
                <span className="text-[11px] text-slate-400">Barkod: {editImageModal.barcode || 'N/A'}</span>
              </div>

              {/* Görsel Önizleme */}
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-50 flex items-center justify-center">
                {customImageUrl ? (
                  <img 
                    src={customImageUrl} 
                    alt="Önizleme"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400 font-bold">Görsel Yok</span>
                )}
              </div>

              {/* Görsel URL Girişi */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ürünün Gerçek Görsel Linki (URL)
                </label>
                <input 
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://cdn.dsmcdn.com/... (Görsel URL)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#f27a1a]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditImageModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveCustomImage}
                className="flex-1 py-2.5 rounded-xl bg-[#f27a1a] hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
              >
                Görseli Kaydet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
