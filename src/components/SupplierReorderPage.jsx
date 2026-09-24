import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Send, 
  FileText, 
  Download, 
  Copy, 
  MessageSquare, 
  Plus, 
  Check, 
  TrendingUp, 
  Truck, 
  Building, 
  Smartphone,
  Calendar,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { PageGuideButton } from './PageHelpGuideModal';

export function SupplierReorderPage({ onNavigateBack, onOpenGuide, products = [] }) {
  // Tedarikçi Listesi
  const [suppliers, setSuppliers] = useState([
    {
      id: 'SUP-1',
      name: 'Merter Tekstil San. A.Ş.',
      contactPerson: 'Mehmet Bey',
      phone: '0532 444 33 22',
      category: 'Tekstil & Giyim',
      leadTimeDays: 3
    },
    {
      id: 'SUP-2',
      name: 'İstoç Toptan İthalat & Deri Ltd.',
      contactPerson: 'Ahmet Usta',
      phone: '0542 555 66 77',
      category: 'Deri & Çanta',
      leadTimeDays: 4
    },
    {
      id: 'SUP-3',
      name: 'Karaköy Elektronik Dağıtım',
      contactPerson: 'Selim Bey',
      phone: '0555 888 99 00',
      category: 'Elektronik',
      leadTimeDays: 2
    }
  ]);

  const [selectedSupplierId, setSelectedSupplierId] = useState('SUP-1');
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [customPoNote, setCustomPoNote] = useState('Acil sevkiyat rica olunur. Faturayı şirket adına düzenleyiniz.');

  // Stok Bitiş Tahminli Ürün Listesi
  const [reorderItems, setReorderItems] = useState([
    {
      id: 'REO-101',
      title: 'Oversize Keten Gömlek - Bej / L',
      sku: 'TY-GMLK-01',
      supplierId: 'SUP-1',
      supplierName: 'Merter Tekstil San. A.Ş.',
      currentStock: 4,
      dailyVelocity: 1.8, // Günde 1.8 adet satılıyor
      daysLeft: 2.2, // ~2 gün sonra stok 0 olacak!
      unitCost: 110.00,
      suggestedQuantity: 50,
      leadTimeDays: 3,
      safetyBufferDays: 5,
      status: 'CRITICAL', // 'CRITICAL' | 'WARNING' | 'HEALTHY'
      selectedForPo: true
    },
    {
      id: 'REO-102',
      title: 'Deri Cüzdan & Kartlık - Siyah',
      sku: 'TY-CZDN-BLK',
      supplierId: 'SUP-2',
      supplierName: 'İstoç Toptan İthalat & Deri Ltd.',
      currentStock: 7,
      dailyVelocity: 1.2,
      daysLeft: 5.8,
      unitCost: 65.00,
      suggestedQuantity: 40,
      leadTimeDays: 4,
      safetyBufferDays: 5,
      status: 'WARNING',
      selectedForPo: true
    },
    {
      id: 'REO-103',
      title: 'Kablosuz TWS Bluetooth Kulaklık v5.3',
      sku: 'HB-TWS-53',
      supplierId: 'SUP-3',
      supplierName: 'Karaköy Elektronik Dağıtım',
      currentStock: 2,
      dailyVelocity: 2.1,
      daysLeft: 0.9,
      unitCost: 240.00,
      suggestedQuantity: 30,
      leadTimeDays: 2,
      safetyBufferDays: 4,
      status: 'CRITICAL',
      selectedForPo: true
    },
    {
      id: 'REO-104',
      title: 'Hakiki Deri Erkek Bot - Taba 42',
      sku: 'AMZ-BOT-42',
      supplierId: 'SUP-2',
      supplierName: 'İstoç Toptan İthalat & Deri Ltd.',
      currentStock: 18,
      dailyVelocity: 0.6,
      daysLeft: 30.0,
      unitCost: 420.00,
      suggestedQuantity: 20,
      leadTimeDays: 5,
      safetyBufferDays: 7,
      status: 'HEALTHY',
      selectedForPo: false
    }
  ]);

  const activeSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];
  const supplierItems = reorderItems.filter(item => item.supplierId === selectedSupplierId);
  const selectedPoItems = supplierItems.filter(item => item.selectedForPo);

  // Toplam Tutar Hesaplama
  const totalPoAmount = selectedPoItems.reduce((sum, item) => sum + (item.unitCost * item.suggestedQuantity), 0);
  const totalPoPieces = selectedPoItems.reduce((sum, item) => sum + item.suggestedQuantity, 0);

  // Sipariş Adedini Güncelleme
  const handleQuantityChange = (id, newQty) => {
    setReorderItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, suggestedQuantity: Math.max(1, parseInt(newQty) || 1) };
      }
      return item;
    }));
  };

  // PO Seçimini Değiştirme
  const handleToggleSelectPo = (id) => {
    setReorderItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, selectedForPo: !item.selectedForPo };
      }
      return item;
    }));
  };

  // WhatsApp Sipariş Metni Oluşturma
  const generateWhatsAppPoText = () => {
    const itemListText = selectedPoItems.map((item, idx) => 
      `${idx + 1}) *${item.title}*\n   • Kod: \`${item.sku}\`\n   • Talep: *${item.suggestedQuantity} Adet*\n   • Birim: ${item.unitCost.toFixed(2)} ₺`
    ).join('\n\n');

    return `📦 *YENİ TEDARİK SATIN ALMA SİPARİŞİ (PO)*
📅 *Tarih:* ${new Date().toLocaleDateString('tr-TR')}
🏢 *Tedarikçi:* ${activeSupplier.name}
👤 *İlgili:* ${activeSupplier.contactPerson}

Sayın ${activeSupplier.contactPerson}, aşağıdaki ürünlerimiz için acil stok siparişi oluşturulmuştur:

${itemListText}

━━━━━━━━━━━━━━━━━━━
📊 *Toplam Kalem:* ${selectedPoItems.length} Çeşit
📦 *Toplam Adet:* ${totalPoPieces} Adet
💰 *Tahmini Sipariş Tutarı:* ${totalPoAmount.toLocaleString('tr-TR')} ₺

📝 *Sipariş Notu:* ${customPoNote}

_Bu sipariş fişi izeeg E-Ticaret Otomasyonu tarafından otomatik oluşturulmuştur._`;
  };

  const handleCopyWhatsAppPo = () => {
    const text = generateWhatsAppPoText();
    navigator.clipboard.writeText(text);
    setCopiedWhatsapp(true);
    setTimeout(() => setCopiedWhatsapp(false), 2500);
    confetti({ particleCount: 60, spread: 70 });
  };

  const handleOpenDirectWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppPoText());
    const cleanPhone = activeSupplier.phone.replace(/\s+/g, '').replace(/^0/, '90');
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleDownloadPdfPo = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("TEDARIKCI SATIN ALMA SIPARIS FISI (PO)", 20, 20);
    doc.setFontSize(10);
    doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 30);
    doc.text(`Tedarikci: ${activeSupplier.name}`, 20, 38);
    doc.text(`Ilgili Kisi: ${activeSupplier.contactPerson} (${activeSupplier.phone})`, 20, 46);

    let y = 60;
    doc.setFontSize(11);
    doc.text("Siparis Kalemleri:", 20, y);
    y += 8;

    selectedPoItems.forEach((item, index) => {
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${item.title} (${item.sku})`, 20, y);
      doc.text(`Adet: ${item.suggestedQuantity} | Birim: ${item.unitCost} TL | Tutar: ${(item.unitCost * item.suggestedQuantity).toLocaleString('tr-TR')} TL`, 20, y + 6);
      y += 14;
    });

    y += 10;
    doc.setFontSize(12);
    doc.text(`Toplam Siparis Tutari: ${totalPoAmount.toLocaleString('tr-TR')} TL`, 20, y);
    doc.setFontSize(10);
    doc.text(`Not: ${customPoNote}`, 20, y + 10);
    doc.text("Siparis Veren: Magaza Yonetimi", 20, y + 30);

    doc.save(`Tedarik_Siparis_${activeSupplier.name.slice(0, 10)}_${Date.now().toString().slice(-4)}.pdf`);
    confetti({ particleCount: 80, spread: 70 });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      
      {/* 1. Üst Başlık */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {onNavigateBack && (
              <button 
                onClick={onNavigateBack}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Akıllı Tahmin Motoru
                </span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Erken Stok Uyarısı
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
                <Boxes className="w-6 h-6 text-emerald-400" />
                Stok Bitiş Tahmini & Tedarikçi Sipariş Fişi (PO)
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl">
            Son 7 günün satış hızına göre stoğunuzun ne zaman biteceğini önceden görün. Tedarik süresi gecikmeden tek tıkla WhatsApp ve PDF sipariş fişi hazırlayın.
          </p>
        </div>

        {/* Kritik Stok Sayacı */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 px-5 rounded-2xl border border-white/20 relative z-10 text-right">
          <span className="text-[11px] text-slate-300 font-bold block">Acil Sipariş Gereken</span>
          <strong className="text-2xl font-black text-amber-400">
            {reorderItems.filter(i => i.status === 'CRITICAL').length} Ürün
          </strong>
          <span className="text-[10px] text-rose-300 font-semibold block mt-0.5">3 Gün İçinde Bitecek</span>
        </div>

        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* 2. Tedarikçi Seçimi ve Üst Bilgi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {suppliers.map(sup => {
          const supItems = reorderItems.filter(i => i.supplierId === sup.id);
          const hasCritical = supItems.some(i => i.status === 'CRITICAL');
          const isSelected = selectedSupplierId === sup.id;

          return (
            <div
              key={sup.id}
              onClick={() => setSelectedSupplierId(sup.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black text-slate-900">{sup.name}</strong>
                {hasCritical && (
                  <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                    ⚠️ Kritik Stok
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 mt-2 space-y-1">
                <div>İlgili: <span className="font-bold text-slate-800">{sup.contactPerson}</span> ({sup.phone})</div>
                <div>Tedarik Süresi: <span className="font-bold text-slate-800">{sup.leadTimeDays} Gün</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Ana Gövde: Stok Tablosu ve Yanında Sipariş Fişi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sol: Tedarikçi Ürünleri & Stok Hızı Analizi (7 Kolon) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-emerald-600" />
                  {activeSupplier.name} Ürünleri
                </h3>
                <p className="text-xs text-slate-500">Stok tükenme gününü ve önerilen sipariş miktarını inceleyin.</p>
              </div>
            </div>

            <div className="space-y-3">
              {supplierItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    item.selectedForPo ? 'bg-slate-50/80 border-slate-300' : 'bg-white border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.selectedForPo}
                        onChange={() => handleToggleSelectPo(item.id)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <strong className="text-xs font-black text-slate-900 block">{item.title}</strong>
                        <span className="text-[11px] text-slate-500 font-mono">{item.sku}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      item.status === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      item.status === 'WARNING' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status === 'CRITICAL' ? `🚨 ${item.daysLeft.toFixed(1)} Gün Kaldı!` :
                       item.status === 'WARNING' ? `⚠️ ${item.daysLeft.toFixed(1)} Gün Kaldı` :
                       `✅ ${item.daysLeft.toFixed(0)} Gün Yeterli`}
                    </span>
                  </div>

                  {/* Metrikler ve Sipariş Adedi Kutusu */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-200/80 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Kalan Stok:</span>
                      <strong className="font-black text-slate-900">{item.currentStock} Adet</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 block">Günlük Hız:</span>
                      <strong className="font-black text-emerald-700">{item.dailyVelocity} Adet/Gün</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 block">Birim Alış:</span>
                      <strong className="font-black text-slate-800">{item.unitCost.toFixed(2)} ₺</strong>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-500 block">Sipariş Miktarı:</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <input
                          type="number"
                          value={item.suggestedQuantity}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                          className="w-16 bg-white border border-slate-300 rounded-lg p-1 text-xs font-black text-emerald-800 text-center focus:outline-none focus:border-emerald-500"
                          min="1"
                        />
                        <span className="text-[10px] text-slate-500 font-bold">Adet</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ: Satın Alma Sipariş Fişi (PO) & WhatsApp / PDF (5 Kolon) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Satın Alma Sipariş Fişi (PO)
                </h3>
                <span className="text-xs text-slate-500">Tedarikçiye iletilecek özet fiş</span>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {selectedPoItems.length} Kalem Seçili
              </span>
            </div>

            {/* Seçili Kalemler Özeti */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedPoItems.map((item, idx) => (
                <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 block line-clamp-1">{idx + 1}. {item.title}</strong>
                    <span className="text-[11px] text-slate-500 font-mono">{item.suggestedQuantity} Adet × {item.unitCost.toFixed(2)} ₺</span>
                  </div>
                  <strong className="text-slate-900 font-black">
                    {(item.unitCost * item.suggestedQuantity).toLocaleString('tr-TR')} ₺
                  </strong>
                </div>
              ))}
            </div>

            {/* Fiş Notu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tedarikçi Özel Notu:</label>
              <textarea
                value={customPoNote}
                onChange={(e) => setCustomPoNote(e.target.value)}
                rows="2"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                placeholder="Özel talimat veya fatura bilgisi yazın..."
              />
            </div>

            {/* Toplam Hesaplama */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Toplam Ürün Adedi:</span>
                <strong className="text-slate-900">{totalPoPieces} Adet</strong>
              </div>
              <div className="flex justify-between text-sm pt-1 border-t border-emerald-200">
                <span className="font-bold text-slate-800">Tahmini Toplam Tutar:</span>
                <strong className="text-base font-black text-emerald-800">
                  {totalPoAmount.toLocaleString('tr-TR')} ₺
                </strong>
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleOpenDirectWhatsApp}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>WhatsApp ile Doğrudan Sipariş İlet</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyWhatsAppPo}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedWhatsapp ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedWhatsapp ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                </button>

                <button
                  onClick={handleDownloadPdfPo}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF Fiş İndir</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

export default SupplierReorderPage;
