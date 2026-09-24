import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Search, 
  Filter, 
  Clock, 
  PackageCheck, 
  TrendingDown,
  DollarSign,
  Send,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { PageGuideButton } from './PageHelpGuideModal';

export function CargoAuditPage({ cargoLeaks, setCargoLeaks, onNavigateBack, onOpenGuide }) {
  const [selectedLeakId, setSelectedLeakId] = useState(cargoLeaks[0]?.id || 'CRG-AUDIT-101');
  const [copied, setCopied] = useState(false);
  const [carrierFilter, setCarrierFilter] = useState('ALL');

  const selectedLeak = cargoLeaks.find(l => l.id === selectedLeakId) || cargoLeaks[0];
  const totalLeakAmount = cargoLeaks.reduce((sum, item) => sum + item.leakAmount, 0);

  // Kargo Taşıyıcı Firma Performans Verisi
  const carrierMetrics = [
    { name: 'Trendyol Express', avgDeliveryDays: '1.4 Gün', onTimeRate: '%98.2', desiLeakCount: 1, damageRate: '%0.4', rating: 'Mükemmel' },
    { name: 'HepsiJET', avgDeliveryDays: '1.6 Gün', onTimeRate: '%97.5', desiLeakCount: 1, damageRate: '%0.8', rating: 'İyi' },
    { name: 'Kolay Gelsin (Amazon)', avgDeliveryDays: '1.2 Gün', onTimeRate: '%99.1', desiLeakCount: 0, damageRate: '%0.2', rating: 'Zirve' },
    { name: 'Aras Kargo', avgDeliveryDays: '2.8 Gün', onTimeRate: '%91.0', desiLeakCount: 2, damageRate: '%2.1', rating: 'Dikkat' },
    { name: 'Yurtiçi Kargo', avgDeliveryDays: '1.9 Gün', onTimeRate: '%95.4', desiLeakCount: 0, damageRate: '%0.9', rating: 'İyi' }
  ];

  // İtiraz Durumunu Güncelleme
  const handleToggleDisputeStatus = (leakId) => {
    if (setCargoLeaks) {
      setCargoLeaks(prev => prev.map(l => {
        if (l.id === leakId) {
          const nextStatus = l.status === 'RECOVERED' ? 'PENDING' : l.status === 'DISPUTED' ? 'RECOVERED' : 'DISPUTED';
          return { ...l, status: nextStatus };
        }
        return l;
      }));
    }
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleCopyPetition = () => {
    const text = `T.C. ${selectedLeak?.marketplace?.toUpperCase() || 'TRENDYOL'} PAZAR YERİ VE ${selectedLeak?.carrier?.toUpperCase() || 'KARGO'} OPERASYONLARI DİREKTÖRLÜĞÜ'NE

Konu: Hatalı Desi / Fazla Kargo Ücreti Kesintisi İtirazı ve Cari İade Talebi
Tarih: ${new Date().toLocaleDateString('tr-TR')}
Sipariş No: ${selectedLeak?.orderNumber}
Kargo Taşıyıcı: ${selectedLeak?.carrier}

Açıklama:
Yukarıda bilgileri yer alan siparişe ait ürünümüz sistemde ${selectedLeak?.registeredDesi} Desi olarak kayıtlı ve standart ambalajında sevk edilmiştir. Ancak faturaya ${selectedLeak?.billedDesi} Desi olarak yansıtılmış ve sipariş başına ${selectedLeak?.leakAmount} TL haksız fazla kesinti yapılmıştır.

Şube kantar ve kamera kayıtlarının incelenerek haksız kesilen tutarın satıcı cari hesabımıza iadesini arz ederiz.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("RESMI KARGO DESI ITIRAZ DILEKCESI", 20, 25);
    doc.setFontSize(11);
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 35);
    doc.text(`Pazar Yeri: ${selectedLeak?.marketplace}`, 20, 45);
    doc.text(`Siparis No: ${selectedLeak?.orderNumber}`, 20, 55);
    doc.text(`Urun: ${selectedLeak?.productName}`, 20, 65);
    doc.text(`Kargo Firmasi: ${selectedLeak?.carrier}`, 20, 75);
    doc.text(`Sistemde Kayitli Desi: ${selectedLeak?.registeredDesi} Desi`, 20, 85);
    doc.text(`Faturada Kesilen Desi: ${selectedLeak?.billedDesi} Desi`, 20, 95);
    doc.text(`Haksiz Kesinti Tutari: ${selectedLeak?.leakAmount} TL`, 20, 105);
    doc.text("Bu tutarin satici cari hesabina derhal iadesini talep ederiz.", 20, 125);
    doc.text("Firma Yetkilisi / Magaza Yonetimi", 20, 150);
    doc.save(`Desi_Itiraz_${selectedLeak?.orderNumber || 'Talep'}.pdf`);
    confetti({ particleCount: 70, spread: 70 });
  };

  // Toplu İtiraz Listesi CSV/Excel İndirme
  const handleDownloadDisputeListCsv = () => {
    const headers = ['Siparis No', 'Pazar Yeri', 'Kargo Firmasi', 'Urun Adi', 'Fatura Tarihi', 'Kayitli Desi', 'Faturadaki Desi', 'Fazla Kesinti (TL)', 'Durum'];
    const rows = cargoLeaks.map(l => [
      l.orderNumber,
      l.marketplace,
      l.carrier,
      `"${l.productName.replace(/"/g, '""')}"`,
      l.invoiceDate || '2026-09-20',
      l.registeredDesi,
      l.billedDesi,
      l.leakAmount,
      l.status || 'PENDING'
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kargo_Desi_Itiraz_Listesi_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 80, spread: 70 });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      
      {/* 1. Üst Başlık & ROI Kurtarma Banner'ı */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {onNavigateBack && (
              <button 
                onClick={onNavigateBack}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Kaçak Desi Avcısı
                </span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Resmi İtiraz Sihirbazı
                </span>
                {onOpenGuide && (
                  <PageGuideButton 
                    onClick={onOpenGuide} 
                    label="💡 Nasıl Kullanılır?" 
                    className="bg-white/10 hover:bg-white/20 text-amber-300 border-white/20 py-1 px-3" 
                  />
                )}
              </div>
              <h1 className="text-xl lg:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <Scale className="w-6 h-6 text-amber-400" />
                Kargo Kaçağı & İade Kurtarma Analizörü
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl">
            Kargo faturalarınızdaki gizli desi şişirmelerini ve haksız kesintileri tespit edin. 1 tıkla resmi itiraz dilekçesi ve Excel itiraz listesi oluşturup paranızı geri alın.
          </p>
        </div>

        {/* Kurtarılabilir Tutar Özeti */}
        <div className="bg-white/10 backdrop-blur-md p-4 px-6 rounded-2xl border border-white/20 relative z-10 text-right">
          <span className="text-[11px] text-slate-300 font-bold block">Geri Alınabilir Desi Fazlalığı</span>
          <strong className="text-2xl font-black text-amber-400">
            +{totalLeakAmount.toFixed(2)} ₺
          </strong>
          <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">
            {cargoLeaks.length} Hatalı Kesinti Bulundu
          </span>
        </div>

        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* 2. Kargo Firmaları Teslimat ve Hasar Karnesi */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 lg:p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-700" />
          Kargo Firmaları Teslimat Hızı & Hasar/Kaçak Karnesi
        </h3>
        <p className="text-xs text-slate-500 mb-4">Pazar yerlerinde siparişlerinizi taşıyan kargo firmalarının gerçek performans metrikleri.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {carrierMetrics.map((car, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black text-slate-900">{car.name}</strong>
                <span className={`text-[10px] font-black px-2 py-0.2 rounded-full ${
                  car.rating === 'Mükemmel' || car.rating === 'Zirve'
                    ? 'bg-emerald-100 text-emerald-800'
                    : car.rating === 'İyi'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {car.rating}
                </span>
              </div>

              <div className="space-y-1 text-xs pt-1 border-t border-slate-200/80">
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Ort. Teslimat:</span>
                  <strong className="text-slate-900">{car.avgDeliveryDays}</strong>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Zamanında Teslim:</span>
                  <strong className="text-emerald-700">{car.onTimeRate}</strong>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Desi Uyuşmazlığı:</span>
                  <strong className={car.desiLeakCount > 0 ? 'text-rose-600' : 'text-slate-700'}>{car.desiLeakCount} Hata</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Desi Kaçakları Listesi ve Hazır İtiraz Dilekçesi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sol Taraf: Hatalı Siparişler Listesi */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Faturada Fazla Desi Kesilen Siparişler
              </h3>
              <p className="text-xs text-slate-500">
                Kayıtlı desi vs fatura desisi arasındaki kaçaklar.
              </p>
            </div>
            
            <button
              onClick={handleDownloadDisputeListCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Toplu İtiraz Listesi (CSV)</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {cargoLeaks.length === 0 ? (
              <div className="text-center py-10 px-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-xs font-black text-emerald-900">Kargo Faturası Temiz! Desi Kaçağı Bulunmuyor</h4>
                <p className="text-[11px] text-slate-600 max-w-sm mx-auto mt-1">
                  Pazaryeri faturalarınızda desi uyuşmazlığı tespit edilmemiştir.
                </p>
              </div>
            ) : (
              cargoLeaks.map(leak => (
                <div
                  key={leak.id}
                  onClick={() => setSelectedLeakId(leak.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedLeakId === leak.id
                      ? 'bg-amber-50/70 border-amber-400 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-black text-slate-900">{leak.orderNumber}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-orange-100 text-orange-800">
                        {leak.marketplace}
                      </span>
                      <span className="text-[10px] text-slate-400">{leak.invoiceDate}</span>
                    </div>
                    <div className="text-xs text-slate-700 font-bold mt-1">{leak.productName}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Kayıtlı: <strong>{leak.registeredDesi} Desi</strong> ➔ Faturada: <span className="text-rose-600 font-bold">{leak.billedDesi} Desi</span> ({leak.carrier})
                    </div>
                  </div>

                  <div className="text-right space-y-1.5">
                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 block">
                      +{leak.leakAmount.toFixed(2)} ₺ Kaçak
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleDisputeStatus(leak.id);
                      }}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                        leak.status === 'RECOVERED'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : leak.status === 'DISPUTED'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {leak.status === 'RECOVERED' ? '✅ İade Alındı' :
                       leak.status === 'DISPUTED' ? '⏳ İtiraz İletildi' : '⚠️ İtiraz Bekliyor'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sağ Taraf: Otomatik Üretilen Resmi İtiraz Dilekçesi */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-5 lg:p-6 shadow-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">
                  Resmi Kargo İtiraz Dilekçesi ({selectedLeak?.orderNumber})
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPetition}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center gap-1 border border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="px-3.5 py-1.5 rounded-xl bg-[#f27a1a] hover:bg-orange-600 text-xs font-black text-white shadow transition-all flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF İndir</span>
                </button>
              </div>
            </div>

            {/* Dilekçe Metin Önizleme */}
            <div className="bg-[#151e2a] border border-slate-800 rounded-2xl p-4 mt-4 text-xs font-mono text-slate-300 space-y-2.5 leading-relaxed overflow-y-auto max-h-72">
              <p className="text-amber-400 font-bold">
                T.C. {selectedLeak?.marketplace?.toUpperCase() || 'TRENDYOL'} PAZAR YERİ VE {selectedLeak?.carrier?.toUpperCase() || 'KARGO'} OPERASYONLARI DİREKTÖRLÜĞÜ'NE
              </p>
              <p><strong>Konu:</strong> Hatalı Desi Kesintisi İtirazı ve Cari İade Talebi</p>
              <p><strong>Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</p>
              <p><strong>Sipariş No:</strong> {selectedLeak?.orderNumber} ({selectedLeak?.productName})</p>
              <p><strong>Taşıyıcı Firma:</strong> {selectedLeak?.carrier}</p>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700/60 my-2 text-slate-200">
                • Sistemimizde Kayıtlı Paket Ebatı: <strong>{selectedLeak?.registeredDesi} Desi</strong><br/>
                • Kargo Faturasında Tahsil Edilen: <strong className="text-rose-400">{selectedLeak?.billedDesi} Desi</strong><br/>
                • Haksız Kesilen Fazla Tutar: <strong className="text-emerald-400">+{selectedLeak?.leakAmount} TL</strong>
              </div>
              <p className="text-[11px] text-slate-400">
                Yukarıda detayları verilen siparişin desi tartımının şube kamera ve kantar kayıtlarıyla tekrar incelenmesini ve haksız kesilen tutarın satıcı cari hesabımıza iadesini arz ederiz.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Trendyol, Hepsiburada ve Amazon satıcı panelleriyle %100 uyumludur.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default CargoAuditPage;
