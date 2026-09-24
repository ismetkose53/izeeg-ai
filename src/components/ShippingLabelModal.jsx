import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  QrCode,
  Truck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function ShippingLabelModal({
  isOpen,
  onClose,
  order,
  orders = [],
  labelType = 'A4', // 'A4' | 'STICKER'
  onSuccess
}) {
  const [activeFormat, setActiveFormat] = useState(labelType); // 'A4' | 'STICKER'

  if (!isOpen) return null;

  // Tekli veya çoklu sipariş listesi
  const ordersToPrint = orders.length > 0 ? orders : (order ? [order] : []);

  const handlePrint = () => {
    confetti({ particleCount: 40, spread: 50 });
    window.print();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Üst Başlık */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#f27a1a] flex items-center justify-center text-white shadow-lg">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#f27a1a] bg-[#f27a1a]/20 px-2 py-0.5 rounded border border-[#f27a1a]/30">
                  Resmi Kargo Çıktısı
                </span>
                <span className="text-xs text-slate-300">
                  {ordersToPrint.length} Paket Seçildi
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                Kargo Taşıma Etiketi & Barkod Yazdırma
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Değiştirici */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-700">
              <button
                onClick={() => setActiveFormat('A4')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeFormat === 'A4'
                    ? 'bg-[#f27a1a] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                A4 Sayfa Çıktısı
              </button>
              <button
                onClick={() => setActiveFormat('STICKER')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeFormat === 'STICKER'
                    ? 'bg-[#f27a1a] text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                100x150 mm Termal Sticker
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Gövde (Önizleme Alanı) */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100/70 flex flex-col items-center">
          
          <div className="w-full max-w-2xl space-y-6">
            {ordersToPrint.map((ord, idx) => (
              <div 
                key={ord.id || idx}
                className={`bg-white border-2 border-slate-900 rounded-lg shadow-md p-6 text-slate-900 font-sans transition-all ${
                  activeFormat === 'STICKER' 
                    ? 'max-w-md mx-auto aspect-[100/150] flex flex-col justify-between border-dashed' 
                    : 'w-full'
                }`}
              >
                
                {/* 1. Üst Kısım: Taşıyıcı Logo & Barkod */}
                <div className="border-b-2 border-slate-900 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xl font-black tracking-tight text-slate-900">
                        trendyol<span className="text-[#f27a1a]">express</span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase">
                        Trendyol Anlaşmalı Taşıma Belgesi
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                        STANDART
                      </span>
                      <div className="text-[11px] font-bold text-slate-700 mt-0.5">
                        DESİ: {ord.items?.length > 1 ? '3' : '2'}
                      </div>
                    </div>
                  </div>

                  {/* Kargo Takip Barkodu (Gerçekçi Çizgili SVG Barkod) */}
                  <div className="mt-3 text-center bg-slate-50 p-2.5 rounded border border-slate-300">
                    <div className="h-14 flex items-end justify-center gap-[3px] mx-auto overflow-hidden">
                      {/* Simüle Edilmiş Code 128 Barkod Çizgileri */}
                      {[3,1,4,2,1,5,2,3,1,4,2,3,5,1,2,4,1,3,2,5,1,4,2,3,1,5,3,2,1,4,3,2,4,1,5,2,3,1,4,2].map((h, bIdx) => (
                        <div 
                          key={bIdx} 
                          className="bg-slate-900" 
                          style={{ 
                            width: `${(bIdx % 3 === 0 ? 3 : (bIdx % 2 === 0 ? 2 : 1.5))}px`, 
                            height: '100%' 
                          }}
                        />
                      ))}
                    </div>
                    <div className="font-mono text-sm font-black tracking-widest text-slate-900 mt-1">
                      {ord.trackingNumber || '7330037383986536'}
                    </div>
                  </div>
                </div>

                {/* 2. Orta Kısım: Alıcı Bilgileri & Teslimat Adresi */}
                <div className="py-3 border-b-2 border-slate-900 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      ALICI BİLGİLERİ
                    </span>
                    {ord.isPlus && (
                      <span className="text-[10px] font-black text-pink-600 bg-pink-50 border border-pink-200 px-1.5 rounded">
                        ★ Trendyol Plus
                      </span>
                    )}
                  </div>
                  
                  <div className="font-extrabold text-sm text-slate-900">
                    {ord.customerName}
                  </div>
                  
                  <div className="text-slate-700 leading-snug font-medium">
                    {ord.customerAddress || `${ord.customerCity}, Türkiye`}
                  </div>

                  <div className="text-slate-600 font-bold text-[11px] pt-1 flex items-center justify-between">
                    <span>İl / İlçe: {ord.customerCity}</span>
                    <span>Paket No: {ord.packageNo || '4182778690'}</span>
                  </div>
                </div>

                {/* 3. Gönderici & Sipariş Numarası */}
                <div className="py-2.5 border-b border-slate-300 grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">GÖNDERİCİ (MAĞAZA)</span>
                    <span className="font-bold text-slate-900 block">Moda Trend Butik A.Ş.</span>
                    <span className="text-slate-600 text-[10px]">Cari ID: 104829</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">SİPARİŞ NO</span>
                    <span className="font-mono font-black text-slate-900 block">{ord.id || ord.orderNumber}</span>
                    <span className="text-slate-500 text-[10px]">{ord.orderDate}</span>
                  </div>
                </div>

                {/* 4. Paket İçi Ürünler Listesi */}
                <div className="pt-2 text-[11px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    PAKET İÇERİĞİ ({ord.items ? ord.items.length : 1} ÇEŞİT ÜRÜN)
                  </span>
                  
                  <div className="space-y-1">
                    {ord.items && ord.items.length > 0 ? (
                      ord.items.map((it, itIdx) => (
                        <div key={itIdx} className="flex items-center justify-between text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                          <div className="font-bold truncate max-w-[280px]">
                            <span className="text-[#f27a1a] mr-1">[{it.quantity}x]</span>
                            {it.title || it.name}
                          </div>
                          <div className="text-right font-mono text-[10px] text-slate-600">
                            {it.barcode || it.sku} • {it.size || ''}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-between text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        <span className="font-bold">
                          <span className="text-[#f27a1a] mr-1">[{ord.quantity || 1}x]</span>
                          {ord.productName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-600">{ord.variant}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alt Not */}
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 font-medium">
                  <span>Bu etiket Trendyol Entegrasyon API üzerinden üretilmiştir.</span>
                  <span className="font-mono">SYS-OK-2026</span>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Modal Alt Aksiyon Çubuğu */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Yazıcı formatı: <strong>{activeFormat === 'STICKER' ? '100x150 mm Barkod Termal Yazıcı' : 'A4 Standart Lazer/Mürekkep Yazıcı'}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Vazgeç
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-[#f27a1a] hover:bg-[#d9670f] text-white text-xs font-extrabold shadow-lg shadow-orange-500/30 flex items-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır ({ordersToPrint.length} Paket)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
