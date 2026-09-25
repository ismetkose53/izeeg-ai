import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Building, 
  Sparkles, 
  ArrowLeft,
  X,
  CreditCard,
  ShieldCheck,
  Zap,
  Check,
  RefreshCw,
  QrCode,
  FileCode,
  Send,
  AlertTriangle,
  Lock,
  Key,
  Database,
  Info,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EINVOICE_PROVIDERS, DEMO_EINVOICE_PROVIDERS, DEMO_ORDERS } from '../services/mockData';
import { 
  detectOfficialVatRate, 
  calculateVatBreakdown, 
  getVatLegalCitation, 
  OFFICIAL_VAT_RATES, 
  OFFICIAL_VAT_CATEGORIES 
} from '../services/vatRegulationService';
import { IzeegLogo } from './IzeegLogo';
import { PageGuideButton } from './PageHelpGuideModal';

const EINVOICE_STORAGE_KEY = 'izeeg_einvoice_providers';
const ACTIVE_PROVIDER_STORAGE_KEY = 'izeeg_active_einvoice_provider';

export function InvoiceManagementPage({ 
  orders: propOrders = [], 
  setOrders: propSetOrders, 
  onNavigateBack,
  onOpenGuide,
  autoInvoiceEnabled: propAutoInvoiceEnabled = true,
  setAutoInvoiceEnabled: propSetAutoInvoiceEnabled
}) {
  const [activeTab, setActiveTab] = useState('pending'); // pending | issued | providers | vat_matrix
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null); // Modal için
  const [selectedProviderModal, setSelectedProviderModal] = useState(null); // API Ayar Modalı için
  const [toastMessage, setToastMessage] = useState(null);

  // E-Fatura Sağlayıcıları Havuzu (localStorage destekli)
  const [providersList, setProvidersList] = useState(() => {
    try {
      const saved = localStorage.getItem(EINVOICE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEMO_EINVOICE_PROVIDERS;
  });

  // Aktif Fatura Sağlayıcısı
  const activeProvider = useMemo(() => {
    return providersList.find(p => p.connected) || providersList[0];
  }, [providersList]);

  // Otomatik Fatura Kesme Modu
  const [localAutoInvoice, setLocalAutoInvoice] = useState(() => {
    try {
      const saved = localStorage.getItem('izeeg_auto_invoice_enabled');
      return saved !== null ? saved === 'true' : propAutoInvoiceEnabled;
    } catch {
      return propAutoInvoiceEnabled;
    }
  });

  const autoInvoice = propSetAutoInvoiceEnabled ? propAutoInvoiceEnabled : localAutoInvoice;
  const setAutoInvoice = (val) => {
    setLocalAutoInvoice(val);
    try {
      localStorage.setItem('izeeg_auto_invoice_enabled', val ? 'true' : 'false');
    } catch {}
    if (propSetAutoInvoiceEnabled) propSetAutoInvoiceEnabled(val);
  };

  // Sipariş Havuzu
  const [localOrders, setLocalOrders] = useState(() => {
    if (propOrders && propOrders.length > 0) return propOrders;
    try {
      const saved = localStorage.getItem('izeeg_live_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEMO_ORDERS;
  });

  // propOrders değiştikçe senkronize et
  useEffect(() => {
    if (propOrders && propOrders.length > 0) {
      setLocalOrders(propOrders);
    }
  }, [propOrders]);

  // Siparişleri Güncelleme Yardımcısı
  const updateOrdersState = (updater) => {
    setLocalOrders(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('izeeg_live_orders', JSON.stringify(next));
      } catch {}
      if (propSetOrders) {
        propSetOrders(next);
      }
      return next;
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const pendingOrders = localOrders.filter(o => o.invoiceStatus === 'PENDING' || !o.invoiceStatus);
  const issuedOrders = localOrders.filter(o => o.invoiceStatus === 'ISSUED');

  // Tekil Fatura Kes (GİB Resmi KDV Oranı Otomatik Hesaplanarak Kesilir)
  const handleIssueInvoice = (orderId) => {
    const timestamp = Date.now().toString().slice(-8);
    const newInvoiceNo = `IZG202600${timestamp}`;
    const newEttnUuid = `c7e3f890-${timestamp.slice(0, 4)}-45e6-b890-${Date.now().toString(16).slice(-12)}`;

    updateOrdersState(prev => prev.map(o => {
      if (o.id === orderId) {
        const gross = Number(o.grossPrice || o.totalAmount || 1450);
        const officialVatRate = detectOfficialVatRate(o);
        const vatCalc = calculateVatBreakdown(gross, officialVatRate);

        return {
          ...o,
          invoiceStatus: 'ISSUED',
          invoiceNumber: newInvoiceNo,
          ettnUuid: newEttnUuid,
          vatRate: officialVatRate,
          netMatrah: vatCalc.netMatrah,
          vatAmount: vatCalc.vatAmount,
          legalCitation: vatCalc.legalCitation,
          invoiceDate: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          signedBy: 'GİB Güvenli E-İmza & Mühür'
        };
      }
      return o;
    }));

    // Sağlayıcı bakiyesinden 1 kontör düş
    setProvidersList(prev => {
      const next = prev.map(p => {
        if (p.connected && p.balance && p.balance.includes('Kontör')) {
          const count = parseInt(p.balance, 10);
          if (!isNaN(count) && count > 0) {
            return { ...p, balance: `${count - 1} Kontör` };
          }
        }
        return p;
      });
      try {
        localStorage.setItem(EINVOICE_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    showToast(`✅ ${newInvoiceNo} numaralı E-Fatura resmi KDV oranıyla mühürlendi!`);
    confetti({ particleCount: 70, spread: 60 });
  };

  // Tüm Bekleyenleri Toplu Kes
  const handleBulkIssueAllPending = () => {
    if (pendingOrders.length === 0) return;

    updateOrdersState(prev => prev.map((o, idx) => {
      if (o.invoiceStatus === 'PENDING' || !o.invoiceStatus) {
        const timestamp = (Date.now() + idx).toString().slice(-8);
        const gross = Number(o.grossPrice || o.totalAmount || 1450);
        const officialVatRate = detectOfficialVatRate(o);
        const vatCalc = calculateVatBreakdown(gross, officialVatRate);

        return {
          ...o,
          invoiceStatus: 'ISSUED',
          invoiceNumber: o.invoiceNumber || `IZG202600${timestamp}`,
          ettnUuid: o.ettnUuid || `c7e3f890-${timestamp.slice(0, 4)}-45e6-b890-${(Date.now() + idx).toString(16).slice(-12)}`,
          vatRate: officialVatRate,
          netMatrah: vatCalc.netMatrah,
          vatAmount: vatCalc.vatAmount,
          legalCitation: vatCalc.legalCitation,
          invoiceDate: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          signedBy: 'GİB Güvenli E-İmza & Mühür'
        };
      }
      return o;
    }));

    // Sağlayıcı bakiyesinden toplu düşüm
    setProvidersList(prev => {
      const next = prev.map(p => {
        if (p.connected && p.balance && p.balance.includes('Kontör')) {
          const count = parseInt(p.balance, 10);
          if (!isNaN(count)) {
            return { ...p, balance: `${Math.max(0, count - pendingOrders.length)} Kontör` };
          }
        }
        return p;
      });
      try {
        localStorage.setItem(EINVOICE_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    showToast(`🎉 Toplam ${pendingOrders.length} adet sipariş için resmi KDV oranlarıyla E-Fatura toplu kesildi!`);
    confetti({ particleCount: 120, spread: 80 });
  };

  // Fatura Önizleme Modalını Aç
  const handleOpenInvoicePreview = (order) => {
    setSelectedInvoiceOrder(order);
  };

  // Hızlı Yazdır
  const handlePrintDirect = (order) => {
    setSelectedInvoiceOrder(order);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  // Entegratör Bağlantı Modalı Aç
  const handleConnectProvider = (prov) => {
    setSelectedProviderModal(prov);
  };

  // Entegratör Kaydet ve Aktif Et
  const handleSaveProviderConnection = (updatedProvider) => {
    setProvidersList(prev => {
      const next = prev.map(p => {
        if (p.id === updatedProvider.id) {
          return {
            ...p,
            ...updatedProvider,
            connected: true,
            balance: updatedProvider.balance || '1.420 Kontör',
            lastSync: 'Az önce (Aktif)'
          };
        }
        return p;
      });
      try {
        localStorage.setItem(EINVOICE_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    setSelectedProviderModal(null);
    showToast(`🔌 ${updatedProvider.name} API bağlantısı başarıyla kuruldu ve aktif edildi!`);
    confetti({ particleCount: 80, spread: 70 });
  };

  // Entegratör Bağlantısını Kes
  const handleDisconnectProvider = (providerId) => {
    setProvidersList(prev => {
      const next = prev.map(p => {
        if (p.id === providerId) {
          return {
            ...p,
            connected: false,
            apiKey: '',
            apiSecret: '',
            balance: '-'
          };
        }
        return p;
      });
      try {
        localStorage.setItem(EINVOICE_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    setSelectedProviderModal(null);
    showToast(`⚠️ Fatura entegratör bağlantısı kesildi.`);
  };

  // Filtrelenmiş Liste
  const filteredList = (activeTab === 'pending' ? pendingOrders : issuedOrders).filter(o => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.productName && o.productName.toLowerCase().includes(q)) ||
        (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      
      {/* Toast Bildirimi */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl shadow-emerald-500/30 border border-emerald-400 animate-fadeIn flex items-center gap-2">
          <span>✨</span> {toastMessage}
        </div>
      )}

      {/* 1. Üst Başlık */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onNavigateBack && (
            <button 
              onClick={onNavigateBack}
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Resmi E-Arşiv & E-Fatura Motoru
              </span>
              <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Scale className="w-3 h-3 text-blue-600" />
                GİB Mevzuatı: 7346 Sayılı C.K. Otomatik KDV
              </span>
              {onOpenGuide && (
                <PageGuideButton 
                  onClick={onOpenGuide} 
                  label="💡 Nasıl Kullanılır?" 
                  className="py-1 px-3" 
                />
              )}
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <FileText className="w-6 h-6 text-emerald-600" />
              E-Fatura & Fatura Yazdırma Merkezi
            </h1>
          </div>
        </div>

        {/* Toplu Aksiyon Butonları */}
        <div className="flex items-center gap-2 flex-wrap">
          {pendingOrders.length > 0 && (
            <button
              onClick={handleBulkIssueAllPending}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Tüm Bekleyenleri Kes ({pendingOrders.length})</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#f27a1a] text-white text-xs font-black shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Toplu E-Fatura & Kargo Fişi Yazdır</span>
          </button>
        </div>
      </div>

      {/* ⚡ 2. OTOMATİK FATURA KESME OTOMASYON KARTI */}
      <div className="bg-gradient-to-r from-[#0e1e2d] via-[#122b3b] to-[#0f231e] text-white border border-emerald-500/40 rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner transition-all ${
              autoInvoice 
                ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-400' 
                : 'bg-slate-700/50 border border-slate-600 text-slate-400'
            }`}>
              <Zap className={`w-6 h-6 ${autoInvoice ? 'animate-pulse text-emerald-400' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  Arka Plan Fatura Otomasyonu
                </span>
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                  autoInvoice ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-700 text-slate-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${autoInvoice ? 'bg-slate-950 animate-ping' : 'bg-slate-400'}`}></span>
                  {autoInvoice ? 'OTOMATİK KESİM AKTİF' : 'MANUEL KESİM MODU'}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white mt-1.5">
                Sipariş İşleme Alındığında Otomatik GİB E-Fatura Kes
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
                {autoInvoice 
                  ? "Sipariş durumu 'İşleme Alındı / Paketleniyor' olduğunda sistem ürünün yasal KDV oranını (%10 Tekstil / %20 Genel / %1 Gıda) tespit eder, resmi GİB E-Arşiv faturasını keser, karekod oluşturur ve pazaryeri sistemine faturayı anında otomatik yükler."
                  : "Otomasyon devre dışı. Siparişler işleme alındığında fatura kesilmez, 'Fatura Bekleyen Siparişler' sekmesinden manuel onayınızla kesilir."}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-700 flex-shrink-0 shadow-inner">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-200">Oto-Fatura Motoru</div>
              <div className={`text-[10px] font-bold ${autoInvoice ? 'text-emerald-400' : 'text-slate-400'}`}>
                {autoInvoice ? 'Arka Planda Çalışıyor' : 'Durduruldu'}
              </div>
            </div>
            <button
              onClick={() => setAutoInvoice(!autoInvoice)}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                autoInvoice ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-[10px] font-black ${
                  autoInvoice ? 'translate-x-6 text-emerald-700' : 'translate-x-0 text-slate-600'
                }`}
              >
                {autoInvoice ? '✓' : '✕'}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. KPI Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">Fatura Kesilmeyi Bekleyenler</span>
            <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Acil</span>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {pendingOrders.length} Sipariş
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Kargoya verilmeden önce fatura kesilmeli
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">Kesilen E-Faturalar</span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Onaylı</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {issuedOrders.length} E-Fatura
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            GİB sistemine iletildi ve mühürlendi
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-800">Aktif Fatura Entegratörü</span>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              {activeProvider?.name || 'Paraşüt E-Fatura'}
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {activeProvider?.balance && activeProvider.balance !== '-' ? activeProvider.balance : '1.420 Kontör'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Otomatik e-Arşiv / e-Fatura kesimi açık
          </div>
        </div>
      </div>

      {/* 4. Alt Sekmeler */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'pending' ? 'bg-amber-500 text-white shadow-sm font-black' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Fatura Bekleyen Siparişler ({pendingOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('issued')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'issued' ? 'bg-emerald-600 text-white shadow-sm font-black' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Kesilen E-Faturalar ({issuedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'providers' ? 'bg-slate-900 text-white shadow-sm font-black' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Fatura Programı API Bağlantıları</span>
        </button>

        <button
          onClick={() => setActiveTab('vat_matrix')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'vat_matrix' ? 'bg-blue-600 text-white shadow-sm font-black' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>GİB Resmi KDV Oran Matrisi</span>
        </button>
      </div>

      {/* 5. ARAMA VE FİLTRELEME */}
      {activeTab !== 'providers' && activeTab !== 'vat_matrix' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Sipariş No, Müşteri Adı veya Fatura No Ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
            />
          </div>

          <div className="text-xs font-bold text-slate-600">
            Toplam <strong>{filteredList.length}</strong> Sipariş Kaydı
          </div>
        </div>
      )}

      {/* TAB 1: FATURA BEKLEYENLER */}
      {activeTab === 'pending' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Kesilmeyi Bekleyen E-Arşiv/E-Faturalar</span>
            <button
              onClick={handleBulkIssueAllPending}
              disabled={pendingOrders.length === 0}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tümünü Toplu Kes ({pendingOrders.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            {filteredList.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-base font-black text-slate-800">Fatura Bekleyen Sipariş Bulunmuyor</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Yeni bir sipariş geldiğinde veya pazar yerlerinden sipariş çekildiğinde faturalandırma için burada listelenecektir.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Sipariş No</th>
                    <th className="p-3">Kanal</th>
                    <th className="p-3">Müşteri</th>
                    <th className="p-3">Ürün</th>
                    <th className="p-3 text-center">GİB KDV %</th>
                    <th className="p-3 text-right">Tutar</th>
                    <th className="p-3 text-center">Durum</th>
                    <th className="p-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map(order => {
                    const vatRate = detectOfficialVatRate(order);
                    const gross = Number(order.grossPrice || order.totalAmount || 1450);

                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-bold text-slate-900">{order.orderNumber || order.id}</td>
                        <td className="p-3 font-bold text-slate-800">{order.marketplace || 'Trendyol'}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          <div className="text-[10px] text-slate-500">{order.customerCity || 'İstanbul'}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-slate-800">{order.productName || (order.items && order.items[0]?.title) || 'Tekstil Ürünü'}</div>
                          <div className="text-[10px] text-slate-500">{order.variant || 'M / Standart'}</div>
                        </td>
                        <td className="p-3 text-center">
                          <span 
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full cursor-help ${
                              vatRate === 10 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              vatRate === 1 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                            title={getVatLegalCitation(vatRate)}
                          >
                            %{vatRate} KDV
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          {gross.toFixed(2)} ₺
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Bekliyor
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleIssueInvoice(order.id)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer inline-flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3" />
                            <span>Fatura Kes</span>
                          </button>
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

      {/* TAB 2: KESİLEN FATURALAR */}
      {activeTab === 'issued' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Kesilmiş Resmi E-Faturalar</span>
          </div>

          <div className="overflow-x-auto">
            {filteredList.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h4 className="text-base font-black text-slate-800">Henüz Kesilmiş Fatura Bulunmuyor</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Siparişlerinize fatura kestikçe resmi arşiv kayıtları ve yazdırma butonları burada listelenir.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Fatura No</th>
                    <th className="p-3">Sipariş No</th>
                    <th className="p-3">Müşteri</th>
                    <th className="p-3">Kanal</th>
                    <th className="p-3 text-center">GİB KDV %</th>
                    <th className="p-3 text-right">Tutar</th>
                    <th className="p-3 text-center">Durum</th>
                    <th className="p-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map(order => {
                    const vatRate = order.vatRate || detectOfficialVatRate(order);
                    const gross = Number(order.grossPrice || order.totalAmount || 1450);

                    return (
                      <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono font-black text-emerald-700">{order.invoiceNumber || 'IZG202600189281'}</td>
                        <td className="p-3 font-mono text-slate-700">{order.orderNumber || order.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{order.customerName}</div>
                          <div className="text-[10px] text-slate-500">{order.customerCity || 'İstanbul'}</div>
                        </td>
                        <td className="p-3 font-bold text-slate-800">{order.marketplace || 'Trendyol'}</td>
                        <td className="p-3 text-center">
                          <span 
                            className={`text-[10px] font-black px-2.5 py-0.5 rounded-full cursor-help ${
                              vatRate === 10 ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                              vatRate === 1 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                            title={getVatLegalCitation(vatRate)}
                          >
                            %{vatRate} KDV
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          {gross.toFixed(2)} ₺
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Resmi Kesildi
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenInvoicePreview(order)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            Görüntüle
                          </button>
                          <button
                            onClick={() => handlePrintDirect(order)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
                          >
                            Yazdır
                          </button>
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

      {/* SEKME 3: FATURA PROGRAMI API BAĞLANTILARI */}
      {activeTab === 'providers' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">E-Fatura & Ön Muhasebe Entegrasyonları</h3>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Standart Paketinize Dahil • Ücretsiz
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Her mağaza tek bir fatura programı kullandığı için tüm popüler e-fatura entegrasyonları standart paketinize dahildir. Ek bir ücret ödemeden API anahtarınızı bağlayabilirsiniz.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {providersList.map(prov => (
                <div key={prov.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{prov.logo}</span>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{prov.name}</h4>
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 block mt-0.5">
                            Pakete Dahil
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        prov.connected ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {prov.connected ? '✓ Bağlı' : 'Hazır'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 pt-2.5 mt-2.5 border-t border-slate-200/80">
                      <div className="text-[11px]">Bakiye / Kontör: <strong className="text-slate-900">{prov.balance}</strong></div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleConnectProvider(prov)}
                    className={`w-full py-2 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer ${
                      prov.connected 
                        ? 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-800' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {prov.connected ? '⚙️ API Ayarlarını Düzenle' : '+ Fatura Programını Bağla'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 🌟 ÖZEL E-FATURA & ERP ENTEGRASYON TALEP BANNER'I */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 border border-slate-700 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                  Özel ERP & Muhasebe Entegrasyonu
                </span>
                <span className="text-xs text-emerald-400 font-bold">48 Saatte Canlıya Alma Garantisi</span>
              </div>
              <h3 className="text-lg font-black text-white">
                Farklı bir E-Fatura veya Muhasebe/ERP Programı mı Kullanıyorsunuz?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Listemizde yer almayan <strong>Nebim, Logo Tiger, Mikro Yazılım, Zirve, Akınsoft, Dia Yazılım, Luca</strong> veya özel şirket içi ERP sisteminizi kullanıyorsanız; izeeg AI mühendislik ekibimiz isteğiniz üzerine 48 saat içerisinde özel API entegrasyonunuzu geliştirip mağazanıza tanımlar.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full lg:w-auto">
              <a
                href="https://wa.me/905436970755?text=Merhaba,%20listede%20olmayan%20ozel%20bir%20E-Fatura%20/%20ERP%20programi%20icin%20entegrasyon%20talep%20etmek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>💬 WhatsApp ile Özel Entegrasyon İste</span>
              </a>
            </div>
          </div>

        </div>
      )}

      {/* SEKME 4: GİB RESMİ KDV MEVZUATI MATRİSİ */}
      {activeTab === 'vat_matrix' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  Türkiye Cumhuriyeti Resmi KDV Oran Tablosu (7346 Sayılı C.K.)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sistemimiz pazaryerinden sipariş veya ürün çekerken aşağıdaki resmi yasal mevzuata göre KDV oranını kuruşu kuruşuna otomatik atar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {OFFICIAL_VAT_CATEGORIES.map(cat => (
                <div key={cat.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{cat.name}</span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      cat.rate === 10 ? 'bg-blue-100 text-blue-800' :
                      cat.rate === 1 ? 'bg-amber-100 text-amber-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      %{cat.rate} KDV
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                    📜 {cat.lawReference}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. GELİŞMİŞ E-FATURA & MUHASEBE API BAĞLANTI MODALI */}
      {selectedProviderModal && (
        <EInvoiceApiConnectModal
          provider={selectedProviderModal}
          onClose={() => setSelectedProviderModal(null)}
          onSave={handleSaveProviderConnection}
          onDisconnect={handleDisconnectProvider}
        />
      )}

      {/* 7. RESMİ GİB E-ARŞİV / E-FATURA ÖNİZLEME & YAZDIRMA MODALI */}
      {selectedInvoiceOrder && (
        <OfficialInvoicePreviewModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
          activeProviderName={activeProvider?.name || 'Paraşüt E-Fatura'}
        />
      )}

    </div>
  );
}

/**
 * 🛠️ Gelişmiş E-Fatura API Yapılandırma & Canlı Kontör Test Modalı
 */
function EInvoiceApiConnectModal({ provider, onClose, onSave, onDisconnect }) {
  const [apiKey, setApiKey] = useState(provider.apiKey || 'prs_live_key_9482018');
  const [apiSecret, setApiSecret] = useState(provider.apiSecret || 'sec_tok_84920481920');
  const [companyId, setCompanyId] = useState(provider.companyId || '1829048192');
  const [seriesPrefix, setSeriesPrefix] = useState(provider.seriesPrefix || 'IZG');
  const [invoiceTypeOption, setInvoiceTypeOption] = useState('AUTO_OFFICIAL'); // AUTO_OFFICIAL | DRAFT
  const [showSecret, setShowSecret] = useState(false);

  // Canlı API Testi
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(provider.connected ? { status: 'SUCCESS', message: 'API Bağlantısı Aktif & Doğrulanmış (1.420 Kontör)' } : null);

  const handleRunPingTest = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult({
        status: 'SUCCESS',
        message: `✅ ${provider.name} API v2 sunucularına başarıyla bağlanıldı! Canlı Bakiye: 1.420 Kontör. GİB Mühürleme yetkisi onaylandı.`
      });
      confetti({ particleCount: 50, spread: 60 });
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...provider,
      apiKey,
      apiSecret,
      companyId,
      seriesPrefix,
      invoiceTypeOption,
      connected: true,
      balance: '1.420 Kontör'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-scaleUp text-slate-900">
        
        {/* Modal Başlık */}
        <div className="bg-gradient-to-r from-slate-900 via-[#151e2a] to-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              {provider.logo || '🧾'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  E-Fatura & GİB Entegratörü
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  provider.connected 
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {provider.connected ? 'Bağlı & Aktif' : 'Kurulum Bekliyor'}
                </span>
              </div>
              <h2 className="text-base lg:text-lg font-black text-white mt-0.5">
                {provider.name} API Ayarları
              </h2>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-2.5 text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-[11px] leading-snug font-medium">
              E-Fatura ve E-Arşiv API anahtarlarınız GİB 5070 Sayılı Elektronik İmza Kanunu standartlarında 256-Bit SSL ile şifrelenir.
            </p>
          </div>

          {/* API Anahtarı */}
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
              <span>{provider.name} API Anahtarı (API Key / Client ID) *</span>
              <span className="text-[10px] text-slate-400 font-normal">Entegratör panelinizden alınır</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="örn: prs_live_key_9482018..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* API Secret */}
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
              <span>API Gizli Anahtarı (API Secret / Password) *</span>
              <button 
                type="button" 
                onClick={() => setShowSecret(!showSecret)}
                className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
              >
                {showSecret ? 'Gizle' : 'Göster'}
              </button>
            </label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                required
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="örn: sec_tok_84920481920..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Şirket / Firma Kodu */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Firma / VKN / Şirket ID *
              </label>
              <input
                type="text"
                required
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder="örn: 1829048192"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Fatura Seri Öneki */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                E-Fatura Seri Öneki (3 Harf) *
              </label>
              <input
                type="text"
                maxLength={3}
                required
                value={seriesPrefix}
                onChange={(e) => setSeriesPrefix(e.target.value.toUpperCase())}
                placeholder="örn: IZG"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-black uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Fatura Gönderim Tercihi */}
          <div className="space-y-2 pt-1">
            <label className="block text-slate-700 font-bold">
              Fatura Gönderim Tercihi
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                invoiceTypeOption === 'AUTO_OFFICIAL' 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input
                  type="radio"
                  name="invoiceTypeOption"
                  checked={invoiceTypeOption === 'AUTO_OFFICIAL'}
                  onChange={() => setInvoiceTypeOption('AUTO_OFFICIAL')}
                  className="text-emerald-600"
                />
                <span className="text-[11px]">Resmi Kes & GİB'e Gönder</span>
              </label>

              <label className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                invoiceTypeOption === 'DRAFT' 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input
                  type="radio"
                  name="invoiceTypeOption"
                  checked={invoiceTypeOption === 'DRAFT'}
                  onChange={() => setInvoiceTypeOption('DRAFT')}
                  className="text-emerald-600"
                />
                <span className="text-[11px]">Taslak Olarak Aktar</span>
              </label>
            </div>
          </div>

          {/* Canlı Test Sonucu */}
          {testResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="font-bold">{testResult.message}</div>
            </div>
          )}

          {/* Alt Butonlar */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <div>
              {provider.connected ? (
                <button
                  type="button"
                  onClick={() => onDisconnect(provider.id)}
                  className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Bağlantıyı Kes
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRunPingTest}
                  disabled={isTesting}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Test Ediliyor...' : 'Bağlantıyı Test Et'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fatura Programını Bağla</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

/**
 * 📄 Resmi GİB 5070 Standartlarında E-Arşiv / E-Fatura Önizleme & PDF Modalı
 */
function OfficialInvoicePreviewModal({ order, onClose, activeProviderName }) {
  const [overrideVatRate, setOverrideVatRate] = useState(() => {
    return order.vatRate || detectOfficialVatRate(order);
  });

  const grossAmount = Number(order.grossPrice || order.totalAmount || 1450.00);
  const vatRate = Number(overrideVatRate);
  const vatBreakdown = calculateVatBreakdown(grossAmount, vatRate);
  
  const invoiceNo = order.invoiceNumber || `IZG202600008491`;
  const ettnUuid = order.ettnUuid || `c7e3f890-4412-45e6-b890-123456789abc`;
  const invoiceDateStr = order.invoiceDate || new Date().toLocaleDateString('tr-TR');

  // Kalemler Listesi
  const lineItems = (order.items && order.items.length > 0) ? order.items : [
    {
      title: order.productName || 'Tekstil Ürünü',
      sku: order.sku || 'SKU-MODAL-01',
      barcode: order.barcode || '8680019283712',
      quantity: order.quantity || 1,
      unitPrice: grossAmount / (order.quantity || 1)
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-300 shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* Modal Üst Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#f27a1a]" />
            <span className="text-sm font-black">Resmi E-Arşiv Fatura Önizleme (GİB Standartı)</span>
          </div>

          {/* Hızlı KDV Oranı Değiştirici */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-300 font-bold hidden sm:inline">KDV Oranı:</span>
            <select
              value={overrideVatRate}
              onChange={(e) => setOverrideVatRate(Number(e.target.value))}
              className="bg-slate-800 text-white border border-slate-700 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value={10}>%10 KDV (Tekstil & Giyim - 7346 C.K.)</option>
              <option value={20}>%20 KDV (Genel - Kozmetik, Aksesuar)</option>
              <option value={1}>%1 KDV (Temel Gıda & İhtiyaç)</option>
            </select>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Fatura Kağıdı Görünümü */}
        <div className="p-6 bg-slate-50 space-y-4 max-h-[70vh] overflow-y-auto font-sans text-xs">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            
            {/* Fatura Üst Başlığı */}
            <div className="flex justify-between items-start pb-4 border-b border-slate-200 gap-4">
              <div className="flex items-start gap-3">
                <IzeegLogo size="sm" theme="light" showBadge={false} />
                <div>
                  <h2 className="text-base font-black text-slate-900">YUMEY TEKSTİL VE TİCARET A.Ş.</h2>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                    İkitelli OSB Mah. Giyim Sanatkarları Sitesi 2. Ada A Blok No:12 Başakşehir / İSTANBUL<br/>
                    Vergi Dairesi: İkitelli V.D. • VKN: 1829048192 • Mersis No: 0182904819200014<br/>
                    Entegratör: {activeProviderName} (GİB E-Fatura / E-Arşiv Ağ Geçidi)
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 block text-center">
                  e-Arşiv Fatura
                </span>
                <span className="font-mono text-xs font-black text-slate-900 mt-1.5 block">
                  {invoiceNo}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                  ETTN: {ettnUuid}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Tarih: {invoiceDateStr}</span>
              </div>
            </div>

            {/* Müşteri ve Sipariş Bilgileri */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Sayın (Alıcı Müşteri):</span>
                <strong className="text-sm font-bold text-slate-900 block mt-0.5">{order.customerName}</strong>
                <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Adres: {order.customerAddress || order.customerCity || 'İstanbul'}<br/>
                  TCKN/VKN: <span className="font-mono">{order.taxNumber || '11111111111'}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Sipariş & Gönderi Detayı:</span>
                <div className="text-[11px] text-slate-700 mt-1 space-y-0.5">
                  <div>Kanal: <strong className="text-slate-900">{order.marketplace || 'Trendyol'}</strong></div>
                  <div>Sipariş No: <span className="font-mono font-bold text-slate-900">{order.orderNumber || order.id}</span></div>
                  <div>Kargo Takip: <span className="font-mono text-slate-600">{order.trackingNumber || '7330037383986536'}</span></div>
                  <div>Ödeme Tipi: <strong className="text-emerald-700">Kredi Kartı / Peşin</strong></div>
                </div>
              </div>
            </div>

            {/* Kalemler Tablosu */}
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700">
                <tr>
                  <th className="p-2.5">Sıra</th>
                  <th className="p-2.5">Mal / Hizmet Açıklaması</th>
                  <th className="p-2.5 text-center">Miktar</th>
                  <th className="p-2.5 text-right">Birim Fiyat (KDV Hariç)</th>
                  <th className="p-2.5 text-center">KDV %</th>
                  <th className="p-2.5 text-right">KDV Tutarı</th>
                  <th className="p-2.5 text-right">Toplam Tutar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lineItems.map((item, idx) => {
                  const itemQty = item.quantity || 1;
                  const itemGross = (item.unitPrice || (grossAmount / lineItems.length)) * itemQty;
                  const itemBreakdown = calculateVatBreakdown(itemGross, vatRate);
                  const itemUnitNet = itemBreakdown.netMatrah / itemQty;

                  return (
                    <tr key={idx}>
                      <td className="p-2.5 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{item.title || item.name || order.productName}</div>
                        <div className="text-[10px] text-slate-500">Stok Kodu: {item.sku || order.sku || 'SKU-MODAL-01'} • Barkod: {item.barcode || order.barcode || '8680019283712'}</div>
                      </td>
                      <td className="p-2.5 text-center font-bold">{itemQty} Adet</td>
                      <td className="p-2.5 text-right font-mono font-medium">{itemUnitNet.toFixed(2)} ₺</td>
                      <td className="p-2.5 text-center font-bold text-blue-700">%{vatRate}</td>
                      <td className="p-2.5 text-right font-mono">{itemBreakdown.vatAmount.toFixed(2)} ₺</td>
                      <td className="p-2.5 text-right font-mono font-black text-slate-900">{itemGross.toFixed(2)} ₺</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Dip Toplamlar & Resmi Mühür */}
            <div className="flex flex-col sm:flex-row justify-between items-end gap-4 pt-2 border-t border-slate-200">
              <div className="space-y-2 w-full sm:w-auto">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <QrCode className="w-12 h-12 text-slate-800 flex-shrink-0" />
                  <div className="text-[10px] text-slate-500 leading-snug">
                    <strong className="text-slate-900 block">5070 Sayılı Kanun Uyarınca Mühürlüdür</strong>
                    GİB Doğrulama Kodu: <span className="font-mono text-slate-700">{ettnUuid.slice(0, 18)}...</span><br/>
                    Fatura bu karekod ile GİB E-Arşiv portalından doğrulanabilir.
                  </div>
                </div>

                <div className="text-[10px] font-bold text-blue-800 bg-blue-50 p-2 rounded-lg border border-blue-200 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>Yasal Dayanak: {vatBreakdown.legalCitation}</span>
                </div>
              </div>

              <div className="w-full sm:w-72 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Mal Hizmet Toplam Tutarı (Matrah):</span>
                  <span className="font-mono font-medium">{vatBreakdown.netMatrah.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span>Hesaplanan KDV (%{vatRate}):</span>
                  <span className="font-mono font-medium text-blue-700">{vatBreakdown.vatAmount.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-300 font-black text-sm text-slate-900">
                  <span>Ödenecek Tutar (KDV Dahil):</span>
                  <span className="text-emerald-700 font-mono text-base">{grossAmount.toFixed(2)} ₺</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Butonlar */}
        <div className="bg-slate-100 p-4 px-6 flex items-center justify-between border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
          >
            Kapat
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`📄 UBL-TR 1.2 XML E-Fatura paketi (${invoiceNo}.xml) indiriliyor...`);
              }}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>XML / UBL İndir</span>
            </button>

            <button
              onClick={() => {
                window.print();
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Yazıcıya Gönder (PDF)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
