import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  Heart, 
  Scissors, 
  Truck, 
  AlertTriangle,
  QrCode,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function OrderDocsModal({
  isOpen,
  onClose,
  type, // 'DISTANCE_CONTRACT' | 'PRE_INFO' | 'STORE_CARD' | 'SPLIT_PACKAGE' | 'CHANGE_CARRIER' | 'CANCEL_ORDER'
  order,
  onActionComplete
}) {
  const [selectedCarrier, setSelectedCarrier] = useState('HepsiJET');
  const [newTrackingNo, setNewTrackingNo] = useState('');
  const [splitQuantities, setSplitQuantities] = useState({});
  const [cancelReason, setCancelReason] = useState('OUT_OF_STOCK');

  if (!isOpen || !order) return null;

  const handleComplete = (msg) => {
    confetti({ particleCount: 50, spread: 60 });
    if (onActionComplete) onActionComplete(msg, order);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Başlığı */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {type === 'DISTANCE_CONTRACT' && <FileText className="w-5 h-5 text-[#f27a1a]" />}
            {type === 'PRE_INFO' && <FileText className="w-5 h-5 text-blue-400" />}
            {type === 'STORE_CARD' && <Heart className="w-5 h-5 text-pink-500" />}
            {type === 'SPLIT_PACKAGE' && <Scissors className="w-5 h-5 text-amber-400" />}
            {type === 'CHANGE_CARRIER' && <Truck className="w-5 h-5 text-emerald-400" />}
            {type === 'CANCEL_ORDER' && <AlertTriangle className="w-5 h-5 text-rose-500" />}

            <div>
              <h3 className="text-base font-bold text-white">
                {type === 'DISTANCE_CONTRACT' && 'Mesafeli Satış Sözleşmesi'}
                {type === 'PRE_INFO' && 'Ön Bilgilendirme Formu'}
                {type === 'STORE_CARD' && 'Müşteri Teşekkür & Mağaza Kartı'}
                {type === 'SPLIT_PACKAGE' && 'Paketi Böl & Ayrı Gönder'}
                {type === 'CHANGE_CARRIER' && 'Başka Kargo Firması İle Gönder'}
                {type === 'CANCEL_ORDER' && 'Siparişi İptal Et'}
              </h3>
              <span className="text-xs text-slate-300">
                Sipariş: {order.id || order.orderNumber} • {order.customerName}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal İçerik Gövdesi */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800 text-xs">
          
          {/* 1. MESAFELİ SATIŞ SÖZLEŞMESİ */}
          {type === 'DISTANCE_CONTRACT' && (
            <div className="space-y-4 leading-relaxed font-sans">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                Bu sözleşme 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği'ne uygun olarak elektronik ortamda akdedilmiştir.
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <h4 className="font-extrabold text-slate-900 border-b pb-1 text-xs uppercase">1. TARAFLAR</h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <strong>SATICI:</strong> Moda Trend Butik A.Ş.<br />
                    <strong>Adres:</strong> İkitelli OSB, Atatürk Bulv. No:14 Başakşehir/İstanbul<br />
                    <strong>VKN:</strong> 18290481920 • <strong>Mersis:</strong> 0182904819200001
                  </div>
                  <div>
                    <strong>ALICI:</strong> {order.customerName}<br />
                    <strong>Teslimat Adresi:</strong> {order.customerAddress || order.customerCity}<br />
                    <strong>Tarih:</strong> {order.orderDate}
                  </div>
                </div>

                <h4 className="font-extrabold text-slate-900 border-b pb-1 pt-2 text-xs uppercase">2. SÖZLEŞME KONUSU ÜRÜN & TUTAR</h4>
                <div className="bg-slate-50 p-3 rounded-lg text-[11px]">
                  <div className="flex justify-between font-bold text-slate-900 pb-1 border-b border-slate-200">
                    <span>Ürün / Paket</span>
                    <span>Toplam Tutar (KDV Dahil)</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>{order.productName || 'Sipariş Paketi Ürünleri'} ({order.quantity || 1} Adet)</span>
                    <span className="font-bold text-[#f27a1a]">{(order.grossPrice || 0).toFixed(2)} ₺</span>
                  </div>
                </div>

                <h4 className="font-extrabold text-slate-900 border-b pb-1 pt-2 text-xs uppercase">3. CAYMA HAKKI</h4>
                <p className="text-[11px] text-slate-600">
                  Alıcı, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa tesliminden itibaren 14 (on dört) gün içinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir.
                </p>
              </div>
            </div>
          )}

          {/* 2. ÖN BİLGİLENDİRME FORMU */}
          {type === 'PRE_INFO' && (
            <div className="space-y-4 leading-relaxed font-sans">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900">
                <strong>Yasal Ön Bilgilendirme:</strong> Tüketici bu formu onaylayarak siparişin ödeme yükümlülüğü doğuracağını kabul etmiş sayılır.
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2.5 text-[11px]">
                <div><strong>Satıcı Ünvanı:</strong> Moda Trend Butik A.Ş.</div>
                <div><strong>Kargo Firması:</strong> {order.carrier || 'Trendyol Express'}</div>
                <div><strong>Teslimat Süresi:</strong> Sipariş onayından itibaren yasal 30 günlük süreyi aşmamak kaydıyla ortalama 1-3 iş günü.</div>
                <div><strong>Ödeme Şekli:</strong> Pazar Yeri Güvenli Havuz Ödemesi (Kredi Kartı)</div>
                <div><strong>Toplam Ödenecek Bedel:</strong> <span className="font-black text-slate-900">{(order.grossPrice || 0).toFixed(2)} ₺</span></div>
              </div>
            </div>
          )}

          {/* 3. MAĞAZA TEŞEKKÜR KARTI & KUPON ÇIKTISI */}
          {type === 'STORE_CARD' && (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md bg-gradient-to-br from-orange-500 via-pink-600 to-purple-700 text-white p-6 rounded-2xl shadow-xl space-y-4 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md">
                  <Heart className="w-6 h-6 text-white animate-pulse" />
                </div>
                
                <div>
                  <h3 className="text-xl font-black">Bizi Tercih Ettiğiniz İçin Teşekkür Ederiz!</h3>
                  <p className="text-xs text-orange-100 mt-1">
                    Sevgili <strong>{order.customerName}</strong>, siparişinizi özenle hazırladık.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-xs">
                  <div className="text-[11px] uppercase tracking-wider text-orange-200 font-bold">Sonraki Alışverişinize Özel</div>
                  <div className="text-lg font-black tracking-widest text-amber-300 mt-0.5">%15 İNDİRİM KODU</div>
                  <div className="font-mono text-sm bg-black/30 px-3 py-1 rounded-lg inline-block mt-1 font-extrabold border border-white/20">
                    TRENDYOL15
                  </div>
                </div>

                <div className="text-[10px] text-white/80">
                  Bizi değerlendirmeyi ve 5 yıldız vermeyi unutmayın ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
          )}

          {/* 4. PAKETİ BÖL */}
          {type === 'SPLIT_PACKAGE' && (
            <div className="space-y-4 font-sans">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <strong>Paket Bölme İşlemi:</strong> Çoklu ürün içeren siparişlerde hazır olan ürünleri bekletmeden ayrı bir paket ve yeni takip numarası ile kargolayabilirsiniz.
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800 text-xs block">Bu paketteki ürünler:</span>
                {order.items && order.items.length > 0 ? (
                  order.items.map((it, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{it.title || it.name}</div>
                        <div className="text-[11px] text-slate-500">{it.barcode || it.sku} • {it.color || ''} {it.size || ''}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600">Adet: {it.quantity}</span>
                        <button className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all">
                          Ayrı Pakete Al
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{order.productName}</div>
                      <div className="text-[11px] text-slate-500">{order.variant}</div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">Adet: {order.quantity || 1}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. BAŞKA KARGO FİRMASI İLE GÖNDER */}
          {type === 'CHANGE_CARRIER' && (
            <div className="space-y-4 font-sans">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900">
                Varsayılan kargo şirketi (<strong>{order.carrier}</strong>) yerine farklı bir anlaşmalı kargo firması seçebilir veya manuel takip numarası girebilirsiniz.
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Yeni Kargo Şirketi Seçin</label>
                  <select 
                    value={selectedCarrier}
                    onChange={(e) => setSelectedCarrier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#f27a1a]"
                  >
                    <option value="Trendyol Express">Trendyol Express (Anlaşmalı)</option>
                    <option value="HepsiJET">HepsiJET</option>
                    <option value="Yurtiçi Kargo">Yurtiçi Kargo</option>
                    <option value="Aras Kargo">Aras Kargo</option>
                    <option value="MNG Kargo">MNG Kargo</option>
                    <option value="Sürat Kargo">Sürat Kargo</option>
                    <option value="PTT Kargo">PTT Kargo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Manuel Takip Barkod Numarası (Opsiyonel)</label>
                  <input 
                    type="text"
                    value={newTrackingNo}
                    onChange={(e) => setNewTrackingNo(e.target.value)}
                    placeholder="Örn: 73300998827163"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#f27a1a]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. SİPARİŞİ İPTAL ET */}
          {type === 'CANCEL_ORDER' && (
            <div className="space-y-4 font-sans">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <strong>Dikkat:</strong> Sipariş iptal edildiğinde müşteriye para iadesi başlatılır ve sipariş "Askıda / İptal" durumuna alınır.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">İptal Gerekçesi Seçin</label>
                <select 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="OUT_OF_STOCK">Tedarik Edilemiyor / Stok Yetersiz</option>
                  <option value="CUSTOMER_REQUEST">Müşteri Talebi Doğrultusunda İptal</option>
                  <option value="DEFECTIVE_PRODUCT">Ürün Kalite / Hasar Kontrolünden Geçemedi</option>
                  <option value="PRICE_ERROR">Fiyatlandırma / Entegrasyon Hatası</option>
                </select>
              </div>
            </div>
          )}

        </div>

        {/* Modal Alt Aksiyon Çubuğu */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all"
          >
            Kapat
          </button>

          <div className="flex items-center gap-2">
            {(type === 'DISTANCE_CONTRACT' || type === 'PRE_INFO' || type === 'STORE_CARD') && (
              <button
                onClick={() => {
                  window.print();
                  handleComplete('Belge yazdırıldı');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow flex items-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Belgeyi Yazdır</span>
              </button>
            )}

            {type === 'CHANGE_CARRIER' && (
              <button
                onClick={() => handleComplete(`Kargo firması ${selectedCarrier} olarak güncellendi.`)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow flex items-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kargo Firmasını Değiştir</span>
              </button>
            )}

            {type === 'SPLIT_PACKAGE' && (
              <button
                onClick={() => handleComplete('Paket 2 ayrı kargo gönderisine bölündü.')}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow flex items-center gap-2 transition-all"
              >
                <Scissors className="w-4 h-4" />
                <span>Paketi Böl & Onayla</span>
              </button>
            )}

            {type === 'CANCEL_ORDER' && (
              <button
                onClick={() => handleComplete('Sipariş gerekçeli olarak iptal edildi.')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow flex items-center gap-2 transition-all"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Siparişi Kesin İptal Et</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
