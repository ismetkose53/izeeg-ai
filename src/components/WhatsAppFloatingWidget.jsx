import React, { useState } from 'react';
import { MessageSquare, PhoneCall, X, Send, Sparkles } from 'lucide-react';

const WHATSAPP_PHONE_RAW = '905436970755';
const WHATSAPP_PHONE_DISPLAY = '0543 697 07 55';

export function WhatsAppFloatingWidget({ onOpenContactModal }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleQuickChat = () => {
    const text = encodeURIComponent("Merhaba İsmet Bey, izeeg AI e-ticaret yönetim yazılımı hakkında bilgi almak istiyorum.");
    window.open(`https://wa.me/${WHATSAPP_PHONE_RAW}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans">
      
      {/* Küçük Popover Kartı */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 animate-scaleUp text-slate-800 space-y-3 relative">
          
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-3 top-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md shadow-emerald-600/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">izeeg Müşteri Destek</h4>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Çevrimiçi • {WHATSAPP_PHONE_DISPLAY}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
            👋 Merhaba! E-ticaret entegrasyonu, canlı demo veya paketler hakkında hemen bilgi alabilirsiniz.
          </p>

          <div className="space-y-2">
            <button
              onClick={() => {
                setIsOpen(false);
                if (onOpenContactModal) onOpenContactModal();
              }}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-[#FF6000] to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Biz Sizi Arayalım (Form)</span>
            </button>

            <button
              onClick={handleQuickChat}
              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp'tan Yazın</span>
            </button>
          </div>
        </div>
      )}

      {/* Ana Yuvarlak Yüzen Buton */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/40 transition-all hover:scale-105 active:scale-95"
        title="Canlı WhatsApp Destek & Biz Sizi Arayalım"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>

        <MessageSquare className="w-5 h-5 text-white" />
        <span className="text-xs font-black tracking-wide hidden sm:inline">
          Biz Sizi Arayalım
        </span>

        {/* Küçük Bildirim Balonu */}
        <span className="absolute -top-1 -right-1 bg-[#FF6000] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
          1
        </span>
      </button>

    </div>
  );
}

export default WhatsAppFloatingWidget;
