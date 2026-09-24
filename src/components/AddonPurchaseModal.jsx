import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Clock,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getBankSettings, getShopierSettings, submitPaymentNotification } from '../services/adminSettingsService';
import { getCurrentUser } from '../services/authService';

export function AddonPurchaseModal({ 
  isOpen, 
  onClose, 
  addon, 
  onAddonUnlocked 
}) {
  if (!isOpen || !addon) return null;

  const [paymentType, setPaymentType] = useState('CARD'); // 'CARD' | 'HAVALE'
  const [isProcessing, setIsProcessing] = useState(false);
  const [havaleForm, setHavaleForm] = useState({
    senderName: '',
    senderBank: 'Garanti BBVA',
    referenceCode: `ADD-${addon.id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
    note: ''
  });
  const [havaleSubmitted, setHavaleSubmitted] = useState(false);

  const bankSettings = getBankSettings();
  const shopierSettings = getShopierSettings();
  const currentUser = getCurrentUser();

  // Kartla Hızlı Satın Alma Simülasyonu & Anında Lisans Aktivasyonu
  const handleCardPurchase = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (onAddonUnlocked) {
        onAddonUnlocked(addon.id);
      }
      onClose();
      confetti({ particleCount: 120, spread: 80 });
    }, 900);
  };

  // Havale Bildirimi Gönderme
  const handleHavaleSubmit = (e) => {
    e.preventDefault();
    if (!havaleForm.senderName) return;

    submitPaymentNotification({
      userId: currentUser.id,
      userStore: currentUser.storeName,
      userName: havaleForm.senderName,
      planSelected: `${addon.name} Ek Modül Satın Alma`,
      amount: parseFloat(addon.price) || 499,
      referenceCode: havaleForm.referenceCode,
      senderBank: havaleForm.senderBank,
      senderName: havaleForm.senderName,
      slipNote: havaleForm.note || `${addon.name} modülü için FAST ödemesi yapıldı.`
    });

    setHavaleSubmitted(true);
    confetti({ particleCount: 80, spread: 70 });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-scaleUp text-slate-900">
        
        {/* Modal Üst Başlık */}
        <div className="p-6 bg-slate-900 text-white relative overflow-hidden flex items-center justify-between">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-2xl flex items-center justify-center shadow-lg">
              {addon.logo || '📦'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#f27a1a] text-white px-2 py-0.5 rounded">
                  Ek Modül & Entegrasyon
                </span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Lisans Aktivasyonu
                </span>
              </div>
              <h2 className="text-lg font-black text-white mt-0.5">
                {addon.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all relative z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Arka Plan Işık Efekti */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#f27a1a]/20 rounded-full blur-3xl"></div>
        </div>

        {/* Modal Gövdesi */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Fiyat & Bilgilendirme Kartı */}
          <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-orange-950 block">Aylık Modül Lisans Bedeli</span>
              <div className="text-2xl font-black text-[#f27a1a] mt-0.5">{addon.price}</div>
              <span className="text-[10px] text-slate-500 font-medium">Taahhütsüz • İstediğiniz ay iptal edebilirsiniz</span>
            </div>
            <div className="text-right space-y-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Zap className="w-3 h-3" /> Anında Aktif Olur
              </span>
              <div className="text-[10px] text-slate-500">256-Bit Güvenli Ödeme</div>
            </div>
          </div>

          {/* Dahil Olan Özellikler */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Bu Modülü Satın Aldığınızda Neler Açılır?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">Tam Otomatik Sipariş Çekme</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">Canlı Komisyon & Hakediş Takibi</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">Kargo Desi & Barkod Eşitleme</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-slate-700 font-medium">Net Kâr Tablosuna Otomatik Entegre</span>
              </div>
            </div>
          </div>

          {/* Ödeme Yöntemi Seçimi */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Ödeme Yönteminizi Seçin
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setPaymentType('CARD'); setHavaleSubmitted(false); }}
                className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 text-left text-xs font-bold ${
                  paymentType === 'CARD'
                    ? 'border-[#f27a1a] bg-orange-50/50 text-[#f27a1a] shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="block font-black">Kredi Kartı / 3D Secure</span>
                  <span className="text-[10px] text-slate-400 font-normal">Hemen Satın Al & Anında Aç</span>
                </div>
              </button>

              <button
                onClick={() => setPaymentType('HAVALE')}
                className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 text-left text-xs font-bold ${
                  paymentType === 'HAVALE'
                    ? 'border-[#f27a1a] bg-orange-50/50 text-[#f27a1a] shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Building2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="block font-black">Banka Havalesi / FAST</span>
                  <span className="text-[10px] text-slate-400 font-normal">IBAN ile Gönder & Onayla</span>
                </div>
              </button>
            </div>
          </div>

          {/* ÖDEME YÖNTEMİ A: KREDİ KARTI */}
          {paymentType === 'CARD' && (
            <form onSubmit={handleCardPurchase} className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800">Kart ile Hızlı Satın Alma</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">3D Secure Aktif</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Kart Üzerindeki İsim</label>
                <input
                  type="text"
                  defaultValue={currentUser.ownerName || 'İsmet Köse'}
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#f27a1a]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Kart Numarası</label>
                <input
                  type="text"
                  defaultValue="5428 •••• •••• 9102"
                  required
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#f27a1a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Son Kullanma (AA/YY)</label>
                  <input
                    type="text"
                    defaultValue="12/28"
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#f27a1a]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">CVC / Güvenlik Kodu</label>
                  <input
                    type="password"
                    defaultValue="842"
                    required
                    maxLength={3}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#f27a1a]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#f27a1a] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Ödeme Doğrulanıyor & Lisans Açılıyor...</span>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>{addon.price} Öde & Modülün Kilidini Anında Aç</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ÖDEME YÖNTEMİ B: HAVALE / FAST */}
          {paymentType === 'HAVALE' && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs animate-fadeIn">
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-bold">Banka:</span>
                  <strong className="text-slate-900">{bankSettings.bankName}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-bold">Alıcı Adı:</span>
                  <strong className="text-slate-900">{bankSettings.accountHolder}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-bold">IBAN:</span>
                  <strong className="font-mono text-slate-900 text-[11px]">{bankSettings.iban}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-bold">FAST Kolay Adres:</span>
                  <strong className="font-mono text-[#f27a1a]">{bankSettings.fastEasyAddress}</strong>
                </div>
              </div>

              {havaleSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-black text-emerald-900 text-sm">Ödeme Bildiriminiz Alındı!</h4>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Referans Kodunuz: <strong className="font-mono">{havaleForm.referenceCode}</strong>. Ödemeniz kontrol edildikten sonra (ortalama 5-10 dk) modülünüz otomatik olarak aktif edilecektir.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 px-4 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                  >
                    Tamam, Kapat
                  </button>
                </div>
              ) : (
                <form onSubmit={handleHavaleSubmit} className="space-y-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Gönderen Ad Soyad</label>
                    <input
                      type="text"
                      value={havaleForm.senderName}
                      onChange={(e) => setHavaleForm({ ...havaleForm, senderName: e.target.value })}
                      placeholder="Örn: Ahmet Yılmaz"
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#f27a1a]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Dekont / İşlem Notu</label>
                    <input
                      type="text"
                      value={havaleForm.note}
                      onChange={(e) => setHavaleForm({ ...havaleForm, note: e.target.value })}
                      placeholder="Örn: Garanti Bankası'ndan FAST yapıldı."
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#f27a1a]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#f27a1a] text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ödeme Bildirimi Gönder (Admin Onayıyla Aç)</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* WhatsApp Hızlı Destek */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sorunuz mu var?</span>
            <a
              href={`https://wa.me/${bankSettings.whatsappSupportNumber || '905436970755'}?text=${encodeURIComponent(`Merhaba, ${addon.name} modülünü satın almak istiyorum.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Satış Danışmanı ile Görüş</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
