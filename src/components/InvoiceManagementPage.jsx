import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EINVOICE_PROVIDERS } from '../services/mockData';
import { ApiSettingsModal } from './ApiSettingsModal';
import { IzeegLogo } from './IzeegLogo';
import { PageGuideButton } from './PageHelpGuideModal';

export function InvoiceManagementPage({ 
  orders, 
  setOrders, 
  onNavigateBack,
  onOpenGuide,
  autoInvoiceEnabled: propAutoInvoiceEnabled = true,
  setAutoInvoiceEnabled: propSetAutoInvoiceEnabled
}) {
  const [activeTab, setActiveTab] = useState('pending'); // pending | issued | providers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null); // Modal için
  const [selectedProviderModal, setSelectedProviderModal] = useState(null); // API Ayar Modalı için
  const [providersList, setProvidersList] = useState(EINVOICE_PROVIDERS);
  const [localAutoInvoice, setLocalAutoInvoice] = useState(propAutoInvoiceEnabled);

  const autoInvoice = propSetAutoInvoiceEnabled ? propAutoInvoiceEnabled : localAutoInvoice;
  const setAutoInvoice = (val) => {
    setLocalAutoInvoice(val);
    if (propSetAutoInvoiceEnabled) propSetAutoInvoiceEnabled(val);
  };

  const pendingOrders = orders.filter(o => o.invoiceStatus === 'PENDING' || !o.invoiceStatus);
  const issuedOrders = orders.filter(o => o.invoiceStatus === 'ISSUED');

  const handleIssueInvoice = (orderId) => {
    const newInvoiceNo = `IZG2026${Date.now().toString().slice(-8)}`;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          invoiceStatus: 'ISSUED',
          invoiceNumber: newInvoiceNo
        };
      }
      return o;
    }));

    confetti({ particleCount: 70, spread: 60 });
  };

  const handleBulkIssueAllPending = () => {
    if (pendingOrders.length === 0) return;
    setOrders(prev => prev.map(o => {
      if (o.invoiceStatus === 'PENDING' || !o.invoiceStatus) {
        return {
          ...o,
          invoiceStatus: 'ISSUED',
          invoiceNumber: o.invoiceNumber || `IZG2026${Date.now().toString().slice(-8)}`
        };
      }
      return o;
    }));
    confetti({ particleCount: 100, spread: 80 });
  };

  const handleOpenInvoicePreview = (order) => {
    setSelectedInvoiceOrder(order);
  };

  const filteredList = (activeTab === 'pending' ? pendingOrders : issuedOrders).filter(o => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.productName.toLowerCase().includes(q) ||
        (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

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
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Resmi E-Arşiv & E-Fatura Motoru
              </span>
              <span className="text-xs text-slate-500 font-medium">GİB Uyumlu 5070 Sayılı Kanun</span>
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
        <div className="flex items-center gap-2">
          {pendingOrders.length > 0 && (
            <button
              onClick={handleBulkIssueAllPending}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Tüm Bekleyenleri Kes ({pendingOrders.length})</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#f27a1a] text-white text-xs font-black shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Toplu E-Fatura & Kargo Fişi Yazdır</span>
          </button>
        </div>
      </div>

      {/* ⚡ 2. OTOMATİK FATURA KESME OTOMASYON KARTI (MÜŞTERİ SEÇİMLİ ARKA PLAN MOTORU) */}
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
                  ? "Sipariş durumu 'İşleme Alındı / Paketleniyor' olduğunda sistem arka planda resmi GİB E-Arşiv faturasını (IZG2026...) keser, karekod oluşturur ve pazaryeri sistemine faturayı anında otomatik yükler."
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
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">Paraşüt & Trendyol</span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            1.420 Kontör
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Otomatik e-Arşiv / e-Fatura kesimi açık
          </div>
        </div>
      </div>

      {/* 3. Alt Sekmeler */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'pending' ? 'bg-amber-500 text-white shadow-sm font-black' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Fatura Bekleyen Siparişler ({pendingOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('issued')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'issued' ? 'bg-emerald-600 text-white shadow-sm font-black' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Kesilen E-Faturalar ({issuedOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'providers' ? 'bg-slate-900 text-white shadow-sm font-black' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Fatura Programı API Bağlantıları</span>
        </button>
      </div>

      {/* 4. SEKME İÇERİKLERİ */}

      {/* ARAMA VE FİLTRELEME */}
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

      {/* TAB 1: FATURA BEKLEYENLER */}
      {activeTab === 'pending' && (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Kesilmeyi Bekleyen E-Arşiv/E-Faturalar</span>
            <button
              onClick={handleBulkIssueAllPending}
              disabled={pendingOrders.length === 0}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
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
                    <th className="p-3 text-right">Tutar</th>
                    <th className="p-3 text-center">Durum</th>
                    <th className="p-3 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">{order.id}</td>
                      <td className="p-3 font-bold text-slate-800">{order.marketplace}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[10px] text-slate-500">{order.customerCity}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{order.productName}</div>
                        <div className="text-[10px] text-slate-500">{order.variant}</div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {order.grossPrice?.toFixed(2)} ₺
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Bekliyor
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleIssueInvoice(order.id)}
                          className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          Fatura Kes
                        </button>
                      </td>
                    </tr>
                  ))}
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
                    <th className="p-3 text-right">Tutar</th>
                    <th className="p-3 text-center">Durum</th>
                    <th className="p-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-black text-emerald-700">{order.invoiceNumber || 'IZG2026-X'}</td>
                      <td className="p-3 font-mono text-slate-700">{order.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[10px] text-slate-500">{order.customerCity}</div>
                      </td>
                      <td className="p-3 font-bold text-slate-800">{order.marketplace}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {order.grossPrice?.toFixed(2)} ₺
                      </td>
                      <td className="p-3 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Resmi Kesildi
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenInvoicePreview(order)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all"
                        >
                          Görüntüle
                        </button>
                        <button
                          onClick={() => handlePrintDirect(order)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          Yazdır
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* SEKME 3: FATURA PROGRAMI API BAĞLANTILARI (HEPSİ STANDART PAKETE DAHİL & ÜCRETSİZ) */}
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
                    className={`w-full py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
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

      {/* API AYAR VE BAĞLANTI MODALI */}
      {selectedProviderModal && (
        <ApiSettingsModal
          isOpen={!!selectedProviderModal}
          onClose={() => setSelectedProviderModal(null)}
          integration={selectedProviderModal}
          onSave={(updated) => {
            setProvidersList(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated, connected: true, balance: '1.420 Kontör' } : p));
          }}
          onDisconnect={(id) => {
            setProvidersList(prev => prev.map(p => p.id === id ? { ...p, connected: false, balance: '-' } : p));
          }}
        />
      )}

      {/* 5. RESMİ E-FATURA ÖNİZLEME & YAZDIRMA MODALI */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-300 shadow-2xl overflow-hidden">
            
            {/* Modal Üst Bar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#f27a1a]" />
                <span className="text-sm font-black">Resmi E-Arşiv Fatura Önizleme</span>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fatura Kağıdı Görünümü */}
            <div className="p-6 bg-slate-50 space-y-4 max-h-[70vh] overflow-y-auto font-sans text-xs">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                
                {/* Fatura Üst Başlığı */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                  <div className="flex items-start gap-3">
                    <IzeegLogo size="sm" theme="light" showBadge={false} />
                    <div>
                      <h2 className="text-base font-black text-slate-900">E-TİCARET MAĞAZA İŞLETMESİ A.Ş.</h2>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        İkitelli OSB Mah. E-Ticaret Plaza No:4 Kat:2 Başakşehir / İSTANBUL<br/>
                        Vergi Dairesi: İkitelli V.D. • VKN: 1829048192 • izeeg E-Fatura Entegrasyonu
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 block">
                      e-Arşiv Fatura
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800 mt-1 block">
                      {selectedInvoiceOrder.invoiceNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{new Date().toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                {/* Müşteri Bilgileri */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Sayın (Müşteri):</span>
                  <strong className="text-sm font-bold text-slate-900">{selectedInvoiceOrder.customerName}</strong>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    Adres: {selectedInvoiceOrder.customerCity}<br/>
                    TCKN: {selectedInvoiceOrder.taxNumber || '11111111111'}
                  </div>
                </div>

                {/* Kalemler Tablosu */}
                <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2">Ürün / Hizmet</th>
                      <th className="p-2 text-center">Miktar</th>
                      <th className="p-2 text-right">Birim Fiyat</th>
                      <th className="p-2 text-center">KDV %</th>
                      <th className="p-2 text-right">Toplam Tutar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2 font-bold text-slate-900">{selectedInvoiceOrder.productName} ({selectedInvoiceOrder.variant})</td>
                      <td className="p-2 text-center">{selectedInvoiceOrder.quantity}</td>
                      <td className="p-2 text-right font-mono">{(selectedInvoiceOrder.grossPrice / 1.2).toFixed(2)} ₺</td>
                      <td className="p-2 text-center">%20</td>
                      <td className="p-2 text-right font-mono font-bold text-slate-900">{selectedInvoiceOrder.grossPrice.toFixed(2)} ₺</td>
                    </tr>
                  </tbody>
                </table>

                {/* Dip Toplamlar */}
                <div className="flex justify-end pt-2">
                  <div className="w-64 space-y-1 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span>Ara Toplam (KDV Hariç):</span>
                      <span className="font-mono">{((selectedInvoiceOrder.grossPrice * 100) / 120).toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hesaplanan KDV (%20):</span>
                      <span className="font-mono">{((selectedInvoiceOrder.grossPrice * 20) / 120).toFixed(2)} ₺</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-300 font-black text-sm text-slate-900">
                      <span>Ödenecek Tutar:</span>
                      <span className="text-emerald-700">{selectedInvoiceOrder.grossPrice.toFixed(2)} ₺</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Butonlar */}
            <div className="bg-slate-100 p-4 px-6 flex items-center justify-between border-t border-slate-200">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold"
              >
                Kapat
              </button>

              <button
                onClick={() => {
                  window.print();
                  setSelectedInvoiceOrder(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Yazıcıya Gönder (PDF)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
