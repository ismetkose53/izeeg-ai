import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Building, 
  User, 
  HelpCircle,
  Headphones,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IzeegLogo } from './IzeegLogo';
import { submitContactLead } from '../services/adminSettingsService';

const WHATSAPP_PHONE_RAW = '905436970755';
const WHATSAPP_PHONE_DISPLAY = '0543 697 07 55';

export function ContactModal({ isOpen, onClose, onToast }) {
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Canlı Demo & Kurulum');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    // Lead'i Yerel Admin Veritabanına Kaydet
    submitContactLead({
      fullName,
      storeName: storeName || 'E-Ticaret Mağazası',
      phone,
      subject,
      message: message || 'Görüşmek ve detaylı bilgi almak istiyorum.'
    });

    // WhatsApp Mesaj Formatı
    const waText = 
`*🚀 izeeg AI - Yeni İletişim & Arama Talebi*
━━━━━━━━━━━━━━━━━━━━
👤 *Ad Soyad:* ${fullName}
🏪 *Mağaza / Şirket:* ${storeName || 'Belirtilmedi'}
📞 *Telefon:* ${phone}
📋 *Talep Konusu:* ${subject}
💬 *Not / Mesaj:* ${message || 'Sistem ve paketler hakkında bilgi almak istiyorum.'}
🕒 *Tarih:* ${new Date().toLocaleString('tr-TR')}
━━━━━━━━━━━━━━━━━━━━
_izeeg AI web sitesi üzerinden gönderildi._`;

    // WhatsApp Web/App Yönlendirme
    const waUrl = `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');

    setIsSubmitted(true);
    confetti({ particleCount: 90, spread: 70 });
    if (onToast) onToast("✅ Talebiniz alındı ve WhatsApp üzerinden iletildi!");
  };

  const handleDirectWhatsAppChat = () => {
    const text = encodeURIComponent("Merhaba İsmet Bey, izeeg AI e-ticaret yönetim yazılımı hakkında bilgi almak istiyorum.");
    window.open(`https://wa.me/${WHATSAPP_PHONE_RAW}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-300 p-6 lg:p-8 shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto">
        
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Talebiniz Başarıyla İletildi!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Bilgileriniz WhatsApp üzerinden <strong>{WHATSAPP_PHONE_DISPLAY}</strong> numarasına iletildi. En kısa sürede sizinle iletişime geçeceğiz.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={handleDirectWhatsAppChat}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp Sohbeti Aç
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Kapat
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Tepe Başlık */}
            <div className="text-center mb-5">
              <div className="flex justify-center mb-2">
                <IzeegLogo size="md" theme="light" showBadge={true} badgeText="İletişim" />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                Biz Sizi Arayalım & Destek
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Aşağıdaki formu doldurun, izeeg uzman ekibimiz en kısa sürede sizi arasın.
              </p>
            </div>

            {/* Hızlı WhatsApp Doğrudan İletişim Kutusu */}
            <div 
              onClick={handleDirectWhatsAppChat}
              className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 cursor-pointer hover:bg-emerald-100/70 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <span>WhatsApp Doğrudan Destek Hattı</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-800">
                    {WHATSAPP_PHONE_DISPLAY}
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-emerald-200">
                Yazın 💬
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Ad Soyad */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Adınız Soyadınız <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                    />
                  </div>
                </div>

                {/* Telefon */}
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Telefon Numaranız <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                    />
                  </div>
                </div>
              </div>

              {/* Mağaza / Şirket Adı & Talep Konusu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mağaza / Firma Adı</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Örn: Trend Butik"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Talep Türü</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                  >
                    <option value="Canlı Demo & Kurulum">🎯 Canlı Demo & Kurulum</option>
                    <option value="Paket ve Fiyat Bilgisi">💰 Paket ve Fiyat Bilgisi</option>
                    <option value="Özel Pazaryeri Entegrasyonu">🏬 Özel Pazaryeri Entegrasyonu</option>
                    <option value="E-Fatura & Kargo Entegrasyonu">📄 E-Fatura & Kargo Ayarları</option>
                    <option value="Teknik Destek & Soru">🛠️ Teknik Destek & Soru</option>
                    <option value="Diğer">📌 Diğer Talepler</option>
                  </select>
                </div>
              </div>

              {/* Not / Mesaj */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Mesajınız / Notunuz (İsteğe Bağlı)</label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hangi pazaryerlerinde satış yapıyorsunuz? Belirtmek istediğiniz detayları yazabilirsiniz..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                ></textarea>
              </div>

              {/* Gönder Butonu */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#FF6000] to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-black rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] text-xs"
              >
                <Send className="w-4 h-4" />
                <span>Talebi Gönder & WhatsApp'tan İlet</span>
              </button>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Bilgileriniz gizli tutulur ve yalnızca talebiniz için kullanılır.</span>
              </p>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default ContactModal;
