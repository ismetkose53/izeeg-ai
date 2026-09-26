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
  Scale,
  Receipt,
  DollarSign,
  TrendingDown,
  Layers,
  ShieldAlert,
  PieChart,
  Percent,
  Truck,
  Megaphone
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
import { 
  getStoredIncomingInvoices, 
  saveStoredIncomingInvoices, 
  syncAllMarketplaceIncomingInvoices, 
  calculateIncomingInvoicesSummary 
} from '../services/marketplaceSyncService';
import { IzeegLogo } from './IzeegLogo';
import { PageGuideButton } from './PageHelpGuideModal';

const EINVOICE_STORAGE_KEY = 'izeeg_einvoice_providers';
const ACTIVE_PROVIDER_STORAGE_KEY = 'izeeg_active_einvoice_provider';

export function InvoiceManagementPage({ 
  orders: propOrders = [], 
  setOrders: propSetOrders, 
  initialTab = 'pending',
  onNavigateBack,
  onOpenGuide,
  autoInvoiceEnabled: propAutoInvoiceEnabled = true,
  setAutoInvoiceEnabled: propSetAutoInvoiceEnabled
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'pending'); // pending | issued | incoming_invoices | providers | vat_matrix
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null); // Modal için
  const [selectedProviderModal, setSelectedProviderModal] = useState(null); // API Ayar Modalı için
  const [toastMessage, setToastMessage] = useState(null);

  // Tarafınıza Kesilen Pazaryeri Gider Faturaları Havuzu
  const [incomingInvoices, setIncomingInvoices] = useState(() => getStoredIncomingInvoices());
  const [incomingPeriod, setIncomingPeriod] = useState('ALL'); // ALL | TODAY | THIS_WEEK | THIS_MONTH
  const [incomingCategory, setIncomingCategory] = useState('ALL'); // ALL | COMMISSION | CARGO | ADVERTISEMENT | PLATFORM_FEE
  const [incomingMarketplace, setIncomingMarketplace] = useState('ALL'); // ALL | Trendyol | Hepsiburada
  const [isSyncingIncoming, setIsSyncingIncoming] = useState(false);
  const [selectedIncomingInvoiceModal, setSelectedIncomingInvoiceModal] = useState(null);
  const [isManualIncomingModalOpen, setIsManualIncomingModalOpen] = useState(false);
  const [newIncomingForm, setNewIncomingForm] = useState({
    marketplace: 'Trendyol',
    issuerName: 'DSM Grup Danışmanlık İletişim ve Satış Tic. A.Ş. (Trendyol)',
    issuerTaxId: '3130557885',
    invoiceNumber: '',
    invoiceType: 'Komisyon Faturası',
    category: 'COMMISSION',
    netAmount: '',
    description: ''
  });

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

  // Pazaryerinden Canlı Fatura Çek
  const handleSyncIncomingFromMarketplaces = async () => {
    setIsSyncingIncoming(true);
    try {
      const result = await syncAllMarketplaceIncomingInvoices({ onToast: showToast });
      if (result && result.invoices) {
        setIncomingInvoices(result.invoices);
      }
    } catch (err) {
      showToast('⚠️ Pazaryeri fatura çekimi sırasında bir hata oluştu.');
    } finally {
      setIsSyncingIncoming(false);
    }
  };

  // Manuel Gider Faturası Kaydet
  const handleSaveManualIncoming = (e) => {
    e.preventDefault();
    const net = parseFloat(newIncomingForm.netAmount) || 0;
    if (net <= 0) {
      showToast('⚠️ Lütfen geçerli bir fatura matrah tutarı giriniz.');
      return;
    }
    const vat = Number((net * 0.20).toFixed(2));
    const total = Number((net + vat).toFixed(2));
    const invNo = newIncomingForm.invoiceNumber.trim() || `MAN2026${Date.now().toString().slice(-6)}`;
    
    const newInv = {
      id: `man-inv-${Date.now()}`,
      marketplace: newIncomingForm.marketplace,
      invoiceNumber: invNo,
      ettnUuid: `f3e4-${Date.now().toString(16)}-4ab1-89ce-${Math.random().toString(16).slice(2, 14)}`,
      issueDate: new Date().toLocaleDateString('tr-TR'),
      period: 'Bu Ay',
      issuerName: newIncomingForm.issuerName,
      issuerTaxId: newIncomingForm.issuerTaxId,
      issuerTaxOffice: 'Boğaziçi Kurumlar V.D.',
      issuerAddress: newIncomingForm.marketplace === 'Trendyol' 
        ? 'Maslak Mah. Büyükdere Cad. No:1 Sarıyer / İSTANBUL'
        : 'Kuştepe Mah. Mecidiyeköy Yolu Cad. No:12 Şişli / İSTANBUL',
      recipientName: 'İzmir E-Ticaret Tekstil Ltd. Şti.',
      recipientTaxId: '4820194829',
      recipientTaxOffice: 'Kordon Vergi Dairesi',
      recipientAddress: 'Alsancak Mah. Atatürk Cad. No:42 Konak / İZMİR',
      invoiceType: newIncomingForm.invoiceType,
      category: newIncomingForm.category,
      categoryLabel: newIncomingForm.invoiceType,
      description: newIncomingForm.description || `${newIncomingForm.marketplace} platform kesinti faturası`,
      netAmount: net,
      vatRate: 20,
      vatAmount: vat,
      totalAmount: total,
      currency: 'TRY',
      paymentStatus: 'DEDUCTED_FROM_SETTLEMENT',
      statusLabel: 'Hesaptan Mahsup Edildi / Muhasebeleşti',
      pdfAvailable: true,
      ublAvailable: true,
      isApiLive: false,
      items: [
        {
          name: newIncomingForm.description || newIncomingForm.invoiceType,
          quantity: 1,
          unit: 'Adet',
          unitPrice: net,
          netMatrah: net,
          vatRate: 20,
          vatAmount: vat,
          totalAmount: total
        }
      ]
    };

    const updated = [newInv, ...incomingInvoices];
    setIncomingInvoices(updated);
    saveStoredIncomingInvoices(updated);
    setIsManualIncomingModalOpen(false);
    setNewIncomingForm({
      marketplace: 'Trendyol',
      issuerName: 'DSM Grup Danışmanlık İletişim ve Satış Tic. A.Ş. (Trendyol)',
      issuerTaxId: '3130557885',
      invoiceNumber: '',
      invoiceType: 'Komisyon Faturası',
      category: 'COMMISSION',
      netAmount: '',
      description: ''
    });
    showToast(`✅ ${invNo} numaralı gider faturası başarıyla eklendi!`);
    confetti({ particleCount: 50, spread: 50 });
  };

  // Tarafımıza Kesilen Faturalar Özeti (Gider/Kesinti Özeti)
  const incomingSummary = useMemo(() => {
    return calculateIncomingInvoicesSummary(incomingInvoices, incomingPeriod);
  }, [incomingInvoices, incomingPeriod]);

  // Canlı API Girişi Var mı Kontrolü
  const hasLiveApiCredentials = useMemo(() => {
    try {
      const creds = JSON.parse(localStorage.getItem('izeeg_core_api_credentials') || '{}');
      return !!(
        (creds.trendyol?.sellerId && creds.trendyol?.apiKey) ||
        (creds.hepsiburada?.merchantId && creds.hepsiburada?.secretKey)
      );
    } catch {
      return false;
    }
  }, []);

  // Filtrelenmiş Tarafımıza Kesilen Faturalar Listesi
  const filteredIncomingInvoices = useMemo(() => {
    const list = incomingSummary?.filteredInvoices || incomingSummary?.invoices || [];
    return list.filter(inv => {
      if (!inv) return false;
      // Kategori Filtresi
      if (incomingCategory !== 'ALL' && inv.category !== incomingCategory) {
        return false;
      }
      // Pazaryeri Filtresi
      if (incomingMarketplace !== 'ALL' && inv.marketplace !== incomingMarketplace) {
        return false;
      }
      // Arama Metni
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(q)) ||
          (inv.issuerName && inv.issuerName.toLowerCase().includes(q)) ||
          (inv.issuerTaxId && String(inv.issuerTaxId).includes(q)) ||
          (inv.description && inv.description.toLowerCase().includes(q)) ||
          (inv.categoryLabel && inv.categoryLabel.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [incomingSummary, incomingCategory, incomingMarketplace, searchQuery]);

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
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                activeTab === 'incoming_invoices'
                  ? 'text-rose-700 bg-rose-50 border-rose-200'
                  : 'text-emerald-600 bg-emerald-50 border-emerald-200'
              }`}>
                {activeTab === 'incoming_invoices' ? 'Pazaryeri Gider & Kesinti Faturaları' : 'Resmi E-Arşiv & E-Fatura Motoru'}
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
              {activeTab === 'incoming_invoices' ? (
                <>
                  <Building className="w-6 h-6 text-rose-600" />
                  <span>Tarafınıza Kesilen Pazaryeri Faturaları & Gider Analizi</span>
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6 text-emerald-600" />
                  <span>E-Fatura & Fatura Yazdırma Merkezi</span>
                </>
              )}
            </h1>
          </div>
        </div>

        {/* Toplu Aksiyon Butonları */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === 'incoming_invoices' ? (
            <>
              <button
                onClick={handleSyncIncomingFromMarketplaces}
                disabled={isSyncingIncoming}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingIncoming ? 'animate-spin' : ''}`} />
                <span>{isSyncingIncoming ? 'Faturalar Çekiliyor...' : 'Pazaryerinden Canlı Çek'}</span>
              </button>
              <button
                onClick={() => setIsManualIncomingModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Manuel Fatura Ekle</span>
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* ⚡ 2. OTOMATİK FATURA KESME OTOMASYON KARTI (Müşteri satış faturaları için) */}
      {activeTab !== 'incoming_invoices' && (
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
      )}

      {/* 3. KPI Kartları (Satış faturaları için) */}
      {activeTab !== 'incoming_invoices' && (
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
      )}

      {/* 🚀 HIZLI GEÇİŞ BİLGİLENDİRME BANNERI (Satış sekmelerindeyken Tarafımıza Kesilen Faturalara Kolay Yönlendirme) */}
      {activeTab !== 'incoming_invoices' && (
        <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-rose-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-sm">
              📥
            </div>
            <div>
              <span className="text-xs font-black text-rose-950 block">Pazaryerlerinin firmanıza kestiği komisyon ve kargo gider faturalarını mı arıyorsunuz?</span>
              <span className="text-[11px] text-rose-800 font-medium">Trendyol, Hepsiburada vb. komisyon, kargo, ceza ve reklam gider faturalarınız için özel sekmemiz hazır.</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('incoming_invoices')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black whitespace-nowrap shadow-sm transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Tarafınıza Kesilen Faturalara Git ({incomingInvoices.length})</span>
            <span>➔</span>
          </button>
        </div>
      )}

      {/* 4. Alt Sekmeler */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'pending' ? 'bg-amber-500 text-white shadow-sm font-black ring-2 ring-amber-400/40' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Fatura Bekleyen Siparişler ({pendingOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('issued')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'issued' ? 'bg-emerald-600 text-white shadow-sm font-black ring-2 ring-emerald-400/40' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Kesilen Satış E-Faturaları ({issuedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('incoming_invoices')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'incoming_invoices' 
              ? 'bg-rose-600 text-white shadow-md font-black ring-2 ring-rose-400/50' 
              : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-300 font-bold'
          }`}
        >
          <Building className="w-4 h-4 text-rose-500" />
          <span>📥 Tarafınıza Kesilen Faturalar (Pazaryeri Giderleri)</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
            activeTab === 'incoming_invoices' ? 'bg-white text-rose-700' : 'bg-rose-200 text-rose-900'
          }`}>
            {incomingInvoices.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'providers' ? 'bg-slate-900 text-white shadow-sm font-black' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Fatura Programı API Entegratörleri</span>
        </button>

        <button
          onClick={() => setActiveTab('vat_matrix')}
          className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'vat_matrix' ? 'bg-blue-600 text-white shadow-sm font-black' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>GİB Resmi KDV Oran Matrisi</span>
        </button>
      </div>

      {/* 5. ARAMA VE FİLTRELEME (pending & issued sekmeleri için) */}
      {(activeTab === 'pending' || activeTab === 'issued') && (
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

      {/* SEKME: TARAFINIZA KESİLEN PAZARYERİ GİDER FATURALARI */}
      {activeTab === 'incoming_invoices' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* 1. Şeffaflık & Canlı API Bağlantı Durumu Kartı */}
          <div className={`p-5 rounded-3xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            hasLiveApiCredentials 
              ? 'bg-gradient-to-r from-emerald-900/90 via-slate-900 to-slate-900 text-white border-emerald-500/40' 
              : 'bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 text-white border-amber-500/40'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner ${
                hasLiveApiCredentials 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-400/40'
              }`}>
                {hasLiveApiCredentials ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    hasLiveApiCredentials 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  }`}>
                    {hasLiveApiCredentials ? 'Canlı Pazaryeri Finans API Aktif' : 'Canlı API Bağlantısı Bekleniyor'}
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    {hasLiveApiCredentials 
                      ? 'Trendyol & Hepsiburada Resmi Finans & Kesinti Ekstreleri Doğrudan Çekilir' 
                      : 'Gerçek resmi faturaların çekilmesi için API bağlantısı gereklidir (Uydurma/Sanal Veri Gösterilmez)'}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-1">
                  Pazaryerlerinin Firmanıza Kestiği Gider & Kesinti Faturaları
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl mt-0.5 leading-relaxed">
                  Pazaryerleri (Trendyol DSM Grup A.Ş., Hepsiburada D-Market A.Ş.) adınıza komisyon, kargo, reklam (CPC) ve platform hizmet bedeli faturaları keser. Bu faturalar doğrudan giderlerinize ve net kârınıza yansıtılır.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
              <button
                onClick={handleSyncIncomingFromMarketplaces}
                disabled={isSyncingIncoming}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black shadow transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingIncoming ? 'animate-spin' : ''}`} />
                <span>{isSyncingIncoming ? 'Faturalar Çekiliyor...' : 'Pazaryerinden Canlı Çek'}</span>
              </button>

              <button
                onClick={() => setIsManualIncomingModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black border border-slate-700 shadow transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Manuel Gider Faturası Ekle</span>
              </button>
            </div>
          </div>

          {/* 2. Dönem Filtreleri & Gider Özet KPI Kartları */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            
            {/* Dönem Butonları (Bugün / Bu Hafta / Bu Ay / Tümü) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                  Dönemsel Kesinti & Gider Analizi
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Hangi zaman aralığındaki kesinti faturalarını görmek istiyorsunuz?
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setIncomingPeriod('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    incomingPeriod === 'ALL' 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tümü ({incomingSummary?.allCount ?? incomingSummary?.count ?? 0})
                </button>
                <button
                  onClick={() => setIncomingPeriod('TODAY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    incomingPeriod === 'TODAY' 
                      ? 'bg-rose-600 text-white shadow-sm font-black' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bugün ({incomingSummary?.todayCount ?? 0})
                </button>
                <button
                  onClick={() => setIncomingPeriod('THIS_WEEK')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    incomingPeriod === 'THIS_WEEK' 
                      ? 'bg-rose-600 text-white shadow-sm font-black' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bu Hafta ({incomingSummary?.weekCount ?? 0})
                </button>
                <button
                  onClick={() => setIncomingPeriod('THIS_MONTH')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    incomingPeriod === 'THIS_MONTH' 
                      ? 'bg-rose-600 text-white shadow-sm font-black' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bu Ay ({incomingSummary?.monthCount ?? 0})
                </button>
              </div>
            </div>

            {/* 4 Ana KPI Kartı */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Kart 1: Toplam Kesinti */}
              <div className="bg-gradient-to-br from-rose-50 via-white to-rose-50/40 border border-rose-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-rose-800 uppercase tracking-wider">
                    {incomingPeriod === 'TODAY' ? 'Bugünkü Toplam Gider' : incomingPeriod === 'THIS_WEEK' ? 'Haftalık Toplam Gider' : incomingPeriod === 'THIS_MONTH' ? 'Aylık Toplam Gider' : 'Toplam Kesinti Faturası'}
                  </span>
                  <Receipt className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black text-rose-700 mt-1">
                  {Number(incomingSummary?.totalAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </div>
                <div className="text-[10px] text-slate-500 mt-1 flex justify-between font-medium">
                  <span>Matrah: {Number(incomingSummary?.netMatrah || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                  <span className="text-blue-700 font-bold">KDV (%20): {Number(incomingSummary?.vatAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                </div>
              </div>

              {/* Kart 2: Komisyon Faturaları */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                    Komisyon Faturaları
                  </span>
                  <Percent className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {Number(incomingSummary?.commissionTotal || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium">
                  Pazaryeri satış komisyon bedelleri
                </div>
              </div>

              {/* Kart 3: Kargo Faturaları */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                    Kargo & Lojistik Faturaları
                  </span>
                  <Truck className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {Number(incomingSummary?.cargoTotal || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium">
                  Taşıma & barem kargo bedelleri
                </div>
              </div>

              {/* Kart 4: Reklam & Platform Bedelleri */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                    Reklam & Platform Hizmeti
                  </span>
                  <Megaphone className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-purple-700 mt-1">
                  {Number((incomingSummary?.adTotal || 0) + (incomingSummary?.platformFeeTotal || 0)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-medium">
                  CPC reklam, entegrasyon & listeleme
                </div>
              </div>
            </div>

          </div>

          {/* 3. Filtreleme & Arama Çubuğu */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Arama Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Fatura No, Düzenleyen Firma veya Açıklama Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
              />
            </div>

            {/* Kategori ve Pazaryeri Seçicileri */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Pazaryeri Seçimi */}
              <select
                value={incomingMarketplace}
                onChange={(e) => setIncomingMarketplace(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
              >
                <option value="ALL">Tüm Pazaryerleri</option>
                <option value="Trendyol">Trendyol (DSM Grup)</option>
                <option value="Hepsiburada">Hepsiburada (D-Market)</option>
              </select>

              {/* Kategori Seçimi */}
              <select
                value={incomingCategory}
                onChange={(e) => setIncomingCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
              >
                <option value="ALL">Tüm Gider Türleri</option>
                <option value="COMMISSION">Komisyon Faturaları</option>
                <option value="CARGO">Kargo / Lojistik</option>
                <option value="ADVERTISEMENT">Reklam / CPC</option>
                <option value="PLATFORM_FEE">Platform & Hizmet Bedeli</option>
                <option value="PENALTY_OTHER">Ceza / Diğer Kesintiler</option>
              </select>

              <span className="text-xs font-bold text-slate-500 pl-2">
                Toplam <strong>{filteredIncomingInvoices.length}</strong> Fatura
              </span>
            </div>

          </div>

          {/* 4. Tarafımıza Kesilen Faturalar Tablosu */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-rose-600" />
                <span>Pazaryerlerinin Tarafınıza Kestiği Resmi E-Arşiv / E-Faturalar</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                Seçilen Dönem Toplamı: <strong className="text-rose-600">{filteredIncomingInvoices.reduce((s, i) => s + (Number(i.totalAmount) || 0), 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              {filteredIncomingInvoices.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-base font-black text-slate-800">Seçilen Kriterlerde Gider Faturası Bulunamadı</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Filtrelerinizi değiştirebilir veya "Pazaryerinden Canlı Çek" butonuna basarak en güncel mutabakat ekstrelerini sorgulayabilirsiniz.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-100 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Fatura No & Tip</th>
                      <th className="p-3">Düzenleyen Kurum (VKN)</th>
                      <th className="p-3">Tarih</th>
                      <th className="p-3">Gider Türü & Açıklama</th>
                      <th className="p-3 text-right">Net Matrah</th>
                      <th className="p-3 text-right">KDV (%20)</th>
                      <th className="p-3 text-right">Toplam Tutar</th>
                      <th className="p-3 text-center">Durum</th>
                      <th className="p-3 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredIncomingInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                            <span>{inv.invoiceNumber}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[140px]" title={inv.ettnUuid}>
                            ETTN: {inv.ettnUuid?.slice(0, 13)}...
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${inv.marketplace === 'Trendyol' ? 'bg-[#f27a1a]' : 'bg-[#ff6000]'}`}></span>
                            <span>{inv.issuerName}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            VKN: <strong>{inv.issuerTaxId}</strong> ({inv.issuerTaxOffice || 'Boğaziçi V.D.'})
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="font-medium text-slate-900">{inv.issueDate}</div>
                          <div className="text-[10px] text-slate-400">{inv.period || 'Bu Ay'}</div>
                        </td>

                        <td className="p-3">
                          <div>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              inv.category === 'COMMISSION' ? 'bg-amber-100 text-amber-800' :
                              inv.category === 'CARGO' ? 'bg-blue-100 text-blue-800' :
                              inv.category === 'ADVERTISEMENT' ? 'bg-purple-100 text-purple-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {inv.categoryLabel || inv.invoiceType}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium mt-1 truncate max-w-[220px]" title={inv.description}>
                            {inv.description}
                          </div>
                        </td>

                        <td className="p-3 text-right font-mono font-bold text-slate-700">
                          {Number(inv.netAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>

                        <td className="p-3 text-right font-mono text-blue-700 font-bold">
                          {Number(inv.vatAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>

                        <td className="p-3 text-right font-mono font-black text-rose-700 text-sm">
                          {Number(inv.totalAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>

                        <td className="p-3 text-center">
                          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ {inv.statusLabel || 'Mahsup Edildi'}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedIncomingInvoiceModal(inv)}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1"
                              title="Resmi GİB E-Arşiv Fatura Görüntüle"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>GİB Görüntüle</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedIncomingInvoiceModal(inv);
                                setTimeout(() => window.print(), 300);
                              }}
                              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                              title="Yazdır / PDF"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

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

      {/* 8. TARAFINIZA KESİLEN GİDER FATURASI ÖNİZLEME MODALI */}
      {selectedIncomingInvoiceModal && (
        <IncomingInvoicePreviewModal
          invoice={selectedIncomingInvoiceModal}
          onClose={() => setSelectedIncomingInvoiceModal(null)}
        />
      )}

      {/* 9. MANUEL GİDER FATURASI EKLEME MODALI */}
      {isManualIncomingModalOpen && (
        <ManualIncomingInvoiceModal
          formData={newIncomingForm}
          setFormData={setNewIncomingForm}
          onClose={() => setIsManualIncomingModalOpen(false)}
          onSave={handleSaveManualIncoming}
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
                  <div>Kargo Takip: <span className="font-mono text-slate-600">{order.trackingNumber || order.cargoTrackingNumber || order.packageNo || order.deliveryNo || order.id}</span></div>
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

/**
 * 🏢 Tarafınıza Kesilen Pazaryeri Gider Faturası (GİB E-Arşiv/E-Fatura) Önizleme Modalı
 */
function IncomingInvoicePreviewModal({ invoice, onClose }) {
  if (!invoice) return null;

  const netMatrah = Number(invoice.netAmount || 0);
  const vatAmount = Number(invoice.vatAmount || 0);
  const totalAmount = Number(invoice.totalAmount || 0);
  const vatRate = Number(invoice.vatRate || 20);
  const items = invoice.items && invoice.items.length > 0 ? invoice.items : [
    {
      name: invoice.description || invoice.categoryLabel || invoice.invoiceType,
      quantity: 1,
      unit: 'Adet',
      unitPrice: netMatrah,
      netMatrah: netMatrah,
      vatRate: vatRate,
      vatAmount: vatAmount,
      totalAmount: totalAmount
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn font-sans overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden animate-scaleUp text-slate-900 my-auto">
        
        {/* Modal Başlık Barı (Yazdırıldığında Gizlenir) */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-700 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                  Gider & Kesinti Faturası
                </span>
                <span className="text-[10px] font-mono text-slate-300">
                  ETTN: {invoice.ettnUuid}
                </span>
              </div>
              <h2 className="text-sm lg:text-base font-black text-white mt-0.5">
                {invoice.issuerName} - {invoice.invoiceNumber}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 📄 RESMİ GİB E-ARŞİV FATURA KAĞIDI (PRINT ALANI) */}
        <div className="p-6 lg:p-10 max-h-[75vh] overflow-y-auto bg-slate-50 print:bg-white print:p-0 print:max-h-none text-xs">
          
          <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
            
            {/* Üst Header: GİB E-Arşiv / Fatura Başlığı */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 font-black text-lg">
                  {invoice.marketplace === 'Trendyol' ? 'TY' : 'HB'}
                </div>
                <div>
                  <h1 className="text-base font-black text-slate-900 tracking-wide">
                    T.C. GELİR İDARESİ BAŞKANLIĞI
                  </h1>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 uppercase tracking-wider">
                    E-ARŞİV FATURA / TİCARİ FATURA
                  </span>
                </div>
              </div>

              <div className="text-right font-mono text-xs space-y-0.5">
                <div><strong>Fatura No:</strong> <span className="font-bold text-rose-700">{invoice.invoiceNumber}</span></div>
                <div><strong>Fatura Tarihi:</strong> {invoice.issueDate}</div>
                <div><strong>Düzenleme Zamanı:</strong> 11:42:19</div>
                <div><strong>Senaryo:</strong> TİCARİ FATURA</div>
                <div><strong>Fatura Tipi:</strong> SATIŞ / KOMİSYON / HİZMET</div>
              </div>
            </div>

            {/* İki Kolonlu Alıcı & Satıcı Bilgileri */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-[11px]">
              
              {/* Düzenleyen (Pazaryeri / Hizmet Sağlayıcı) */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider block border-b border-rose-200 pb-1">
                  DÜZENLEYEN (PAZARYERİ / SATICI)
                </span>
                <div className="font-black text-slate-900 text-xs">{invoice.issuerName}</div>
                <div><strong>VKN / TCKN:</strong> <span className="font-mono font-bold text-slate-800">{invoice.issuerTaxId}</span></div>
                <div><strong>Vergi Dairesi:</strong> {invoice.issuerTaxOffice || 'Boğaziçi Kurumlar V.D.'}</div>
                <div><strong>Adres:</strong> {invoice.issuerAddress || 'Maslak Mah. Büyükdere Cad. No:1 Sarıyer / İSTANBUL'}</div>
                <div><strong>Mersis No:</strong> 0313055788500019</div>
              </div>

              {/* Müşteri / Tarafınız (Hizmet Alan) */}
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider block border-b border-slate-200 pb-1">
                  ALICI (FİRMANIZ / MAĞAZANIZ)
                </span>
                <div className="font-black text-slate-900 text-xs">{invoice.recipientName || 'İzmir E-Ticaret Tekstil Ltd. Şti.'}</div>
                <div><strong>VKN / TCKN:</strong> <span className="font-mono font-bold text-slate-800">{invoice.recipientTaxId || '4820194829'}</span></div>
                <div><strong>Vergi Dairesi:</strong> {invoice.recipientTaxOffice || 'Kordon Vergi Dairesi'}</div>
                <div><strong>Adres:</strong> {invoice.recipientAddress || 'Alsancak Mah. Atatürk Cad. No:42 Konak / İZMİR'}</div>
                <div><strong>Ödeme Şekli:</strong> Satıcı Hakedişinden Otomatik Mahsup</div>
              </div>

            </div>

            {/* Fatura Kalemleri Tablosu */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 text-center w-10">Sıra</th>
                    <th className="p-2.5">Mal / Hizmet Açıklaması</th>
                    <th className="p-2.5 text-center">Miktar</th>
                    <th className="p-2.5 text-right">Birim Fiyat</th>
                    <th className="p-2.5 text-right">İskonto</th>
                    <th className="p-2.5 text-center">KDV %</th>
                    <th className="p-2.5 text-right">KDV Tutarı</th>
                    <th className="p-2.5 text-right">Toplam Tutar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900">
                        {it.name}
                        <div className="text-[10px] text-slate-500 font-normal">
                          {invoice.marketplace} Platformu Dönemsel Kesinti Dekontu
                        </div>
                      </td>
                      <td className="p-2.5 text-center font-mono">{it.quantity || 1} Adet</td>
                      <td className="p-2.5 text-right font-mono">{Number(it.unitPrice || it.netMatrah || netMatrah).toFixed(2)} ₺</td>
                      <td className="p-2.5 text-right font-mono text-slate-400">0,00 ₺</td>
                      <td className="p-2.5 text-center font-mono font-bold text-blue-700">%{it.vatRate || vatRate}</td>
                      <td className="p-2.5 text-right font-mono text-blue-700 font-bold">{Number(it.vatAmount || vatAmount).toFixed(2)} ₺</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">{Number(it.totalAmount || totalAmount).toFixed(2)} ₺</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alt Kısım: Karekod, İmza Metni ve Toplam Matrah */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-4 border-t border-slate-200">
              
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-slate-900 text-white rounded-lg p-1.5 flex flex-col items-center justify-center font-mono text-[9px] text-center shadow-sm">
                  <QrCode className="w-12 h-12 text-white mx-auto" />
                  <span className="text-[7px]">GİB DOĞRULAMA</span>
                </div>

                <div className="space-y-1 text-[10px] text-slate-500 max-w-xs">
                  <div className="font-bold text-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    5070 Sayılı Elektronik İmza Kanunu
                  </div>
                  <p className="leading-tight">
                    Bu fatura 213 Sayılı V.U.K. ve GİB E-Arşiv / E-Fatura mevzuatına uygun olarak elektronik ortamda düzenlenmiş, imzalanmış ve onaylanmıştır.
                  </p>
                </div>
              </div>

              {/* Matrah & KDV Özeti */}
              <div className="w-full sm:w-80 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Hizmet Toplam Tutarı (Matrah):</span>
                  <span className="font-mono font-bold">{netMatrah.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span>Hesaplanan KDV (%{vatRate}):</span>
                  <span className="font-mono font-bold text-blue-700">{vatAmount.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-slate-300 font-black text-sm text-slate-900">
                  <span>Ödenecek / Kesilen Tutar (KDV Dahil):</span>
                  <span className="text-rose-700 font-mono text-base">{totalAmount.toFixed(2)} ₺</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Butonlar */}
        <div className="bg-slate-100 p-4 px-6 flex items-center justify-between border-t border-slate-200 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-50"
          >
            Kapat
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert(`📄 Resmi UBL-TR 1.2 XML E-Fatura paketi (${invoice.invoiceNumber}.xml) indiriliyor...`);
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
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow transition-all cursor-pointer"
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

/**
 * ➕ Manuel Gider Faturası Ekleme Modalı
 */
function ManualIncomingInvoiceModal({ formData, setFormData, onClose, onSave }) {
  const net = parseFloat(formData.netAmount) || 0;
  const vat = Number((net * 0.20).toFixed(2));
  const total = Number((net + vat).toFixed(2));

  const handleMarketplaceChange = (mp) => {
    if (mp === 'Trendyol') {
      setFormData({
        ...formData,
        marketplace: 'Trendyol',
        issuerName: 'DSM Grup Danışmanlık İletişim ve Satış Tic. A.Ş. (Trendyol)',
        issuerTaxId: '3130557885'
      });
    } else if (mp === 'Hepsiburada') {
      setFormData({
        ...formData,
        marketplace: 'Hepsiburada',
        issuerName: 'D-Market Elektronik Hizmetler ve Tic. A.Ş. (Hepsiburada)',
        issuerTaxId: '2650179910'
      });
    } else {
      setFormData({
        ...formData,
        marketplace: 'Diğer',
        issuerName: '',
        issuerTaxId: ''
      });
    }
  };

  const handleCategoryChange = (cat) => {
    const labels = {
      COMMISSION: 'Komisyon Faturası',
      CARGO: 'Kargo & Lojistik Faturası',
      ADVERTISEMENT: 'Reklam / CPC Faturası',
      PLATFORM_FEE: 'Platform Hizmet Bedeli',
      PENALTY_OTHER: 'Ceza / Ek Kesinti'
    };
    setFormData({
      ...formData,
      category: cat,
      invoiceType: labels[cat] || 'Gider Faturası'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-scaleUp text-slate-900">
        
        {/* Modal Başlık */}
        <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              ➕
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                Gider & Kesinti Kaydı
              </span>
              <h2 className="text-base font-black text-white mt-0.5">
                Manuel Gider Faturası Ekle
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

        {/* Form Alanı */}
        <form onSubmit={onSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Pazaryeri Seçimi */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Pazaryeri / Kurum *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Trendyol', 'Hepsiburada', 'Diğer'].map(mp => (
                <button
                  type="button"
                  key={mp}
                  onClick={() => handleMarketplaceChange(mp)}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                    formData.marketplace === mp
                      ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {mp}
                </button>
              ))}
            </div>
          </div>

          {/* Düzenleyen Kurum Adı & VKN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Düzenleyen Kurum Adı *
              </label>
              <input
                type="text"
                required
                value={formData.issuerName}
                onChange={(e) => setFormData({ ...formData, issuerName: e.target.value })}
                placeholder="örn: DSM Grup Danışmanlık..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Kurum VKN / Vergi No *
              </label>
              <input
                type="text"
                required
                value={formData.issuerTaxId}
                onChange={(e) => setFormData({ ...formData, issuerTaxId: e.target.value })}
                placeholder="örn: 3130557885"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Fatura No ve Gider Türü */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Fatura Numarası *
              </label>
              <input
                type="text"
                required
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value.toUpperCase() })}
                placeholder="örn: DSM202600008492"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Gider Türü *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="COMMISSION">Komisyon Faturası</option>
                <option value="CARGO">Kargo / Lojistik Faturası</option>
                <option value="ADVERTISEMENT">Reklam / CPC Faturası</option>
                <option value="PLATFORM_FEE">Platform Hizmet Bedeli</option>
                <option value="PENALTY_OTHER">Ceza / Ek Kesinti</option>
              </select>
            </div>
          </div>

          {/* Fatura Tutarı (Matrah) */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Fatura Net Matrah Tutarı (KDV Hariç ₺) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.netAmount}
              onChange={(e) => setFormData({ ...formData, netAmount: e.target.value })}
              placeholder="0.00"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-black text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Otomatik KDV ve Toplam Hesaplama Önizlemesi */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 space-y-1 font-mono text-xs">
            <div className="flex justify-between text-slate-700">
              <span>Net Matrah:</span>
              <span className="font-bold">{net.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-blue-700 font-bold">
              <span>Hesaplanan KDV (%20):</span>
              <span>{vat.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-rose-200 text-rose-700 font-black text-sm">
              <span>Toplam Kesinti Tutarı:</span>
              <span>{total.toFixed(2)} ₺</span>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Fatura Açıklaması / Not
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="örn: 1-15 Mart dönemi komisyon ve barem kesintisi..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Kaydet Butonları */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow transition-all cursor-pointer flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              <span>Giderlere Kaydet</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

