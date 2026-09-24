import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Crown, 
  Flame,
  ArrowRight,
  Building,
  CreditCard,
  Copy,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  Lock,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IzeegLogo } from './IzeegLogo';
import { getBankSettings, getShopierSettings, submitPaymentNotification } from '../services/adminSettingsService';

export function SubscriptionModal({ isOpen, onClose, trialDaysLeft = 5, totalSaved = 2450, initialSelectedAddon = null }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [selectedPlan, setSelectedPlan] = useState(initialSelectedAddon || 'standard');
  const [paymentMethod, setPaymentMethod] = useState('havale'); // 'havale' | 'shopier'
  const [successNotifSent, setSuccessNotifSent] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);
  
  // Havale Bildirim Form State
  const [senderName, setSenderName] = useState('');
  const [senderBank, setSenderBank] = useState('');
  const [slipNote, setSlipNote] = useState('');

  // Dinamik Admin Ayarları
  const [bankSettings, setBankSettings] = useState(getBankSettings());
  const [shopierSettings, setShopierSettings] = useState(getShopierSettings());

  useEffect(() => {
    if (isOpen) {
      setBankSettings(getBankSettings());
      setShopierSettings(getShopierSettings());
      setSuccessNotifSent(false);
      if (initialSelectedAddon) {
        setSelectedPlan(initialSelectedAddon);
      }
    }
  }, [isOpen, initialSelectedAddon]);

  if (!isOpen) return null;

  // Fiyat Hesaplama (+%15 optimize edilmiş fiyatlar ve %15 yıllık indirim)
  const monthlyBase = 979;
  const annualBase = 9950; // 11.748 TL yerine %15 indirimle 9.950 TL (Aylık 829 TL)
  const standardPrice = billingCycle === 'monthly' ? monthlyBase : annualBase;
  const havaleDiscountRate = bankSettings.discountRateHavale || 15;
  const havaleFinalPrice = (standardPrice * (100 - havaleDiscountRate) / 100).toFixed(2);
  const dynamicRefCode = `IZG-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleCopyIban = () => {
    navigator.clipboard.writeText(bankSettings.iban.replace(/\s+/g, ''));
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleSubmitHavaleNotification = (e) => {
    e.preventDefault();
    if (!senderName) return;

    submitPaymentNotification({
      userId: 'USR-849203',
      userStore: 'E-Ticaret Mağazam',
      userName: senderName,
      planSelected: selectedPlan === 'standard' ? `Standart Paket (${billingCycle === 'annual' ? 'Yıllık 9.950 ₺' : 'Aylık 979 ₺'})` : `${selectedPlan.toUpperCase()} Eklentisi`,
      amount: Number(havaleFinalPrice),
      referenceCode: dynamicRefCode,
      senderBank: senderBank || bankSettings.bankName,
      senderName: senderName,
      slipNote: slipNote || 'FAST/Havale ile ödeme yapıldı.'
    });

    setSuccessNotifSent(true);
    confetti({ particleCount: 90, spread: 70 });
  };

  const handleShopierRedirect = () => {
    const targetUrl = billingCycle === 'annual' 
      ? shopierSettings.standardAnnualUrl 
      : shopierSettings.standardMonthlyUrl;
    
    window.open(targetUrl, '_blank');
    confetti({ particleCount: 60, spread: 50 });
  };

  const handleWhatsAppSlip = () => {
    const text = encodeURIComponent(`Merhaba, izeeg lisans ödemesini FAST ile gerçekleştirdim.\n\nSipariş Referans Kodu: ${dynamicRefCode}\nGönderen: ${senderName || 'Mağaza Sahibi'}\nTutar: ${havaleFinalPrice} TL\nDekontu buradan iletiyorum.`);
    window.open(`https://wa.me/${bankSettings.whatsappSupportNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-300 p-6 lg:p-8 shadow-2xl">
        
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Üst Bilgilendirme */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="flex justify-center mb-2">
            <IzeegLogo size="lg" theme="light" showBadge={true} badgeText="PRO" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Deneme Sürenizden <strong>{trialDaysLeft} Gün</strong> Kaldı</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Kârınızı Garantiye Alın, <span className="text-[#FF6000]">Kesintisiz Büyüyün</span>
          </h2>
          
          <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>izeeg bu hafta mağazanızda <strong>{totalSaved.toLocaleString('tr-TR')} ₺</strong> kaçak ve fazla kargo kesintisi yakaladı!</span>
          </div>

          {/* Aylık / Yıllık Seçici */}
          <div className="flex items-center justify-center gap-3 mt-4 bg-slate-100 p-1.5 rounded-2xl max-w-md mx-auto">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aylık Ödeme (979 ₺)
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📅 Yıllık Paket (9.950 ₺)</span>
              <span className="text-[10px] bg-emerald-500 text-white font-black px-1.5 py-0.2 rounded-full">
                %15 İNDİRİM
              </span>
            </button>
          </div>
        </div>

        {/* 2. PAKET ÖZETİ & DAHİL OLANLAR */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold bg-[#FF6000] text-white px-2 py-0.5 rounded uppercase">Standart Paket</span>
              <h3 className="text-base font-black text-slate-900 mt-1">izeeg Çok Kanallı AI E-Ticaret Lisansı</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {billingCycle === 'annual' ? 'Yıllık alımda ayda sadece 829 ₺ (Toplam 9.950 ₺/yıl)' : 'Aylık 979 ₺ düzenli abonelik'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {billingCycle === 'annual' ? '9.950 ₺' : '979 ₺'}
              </span>
              <span className="text-xs text-slate-500 font-bold block">
                {billingCycle === 'annual' ? '/ Yıllık Peşin (%15 İndirimli)' : '/ Aylık'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs text-slate-700 font-bold">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5 flex-shrink-0" /> Trendyol Dahil
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5 flex-shrink-0" /> Hepsiburada Dahil
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5 flex-shrink-0" /> Paraşüt E-Fatura
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5 flex-shrink-0" /> Ticimax & WooCommerce
            </div>
          </div>
        </div>

        {/* 3. ÖDEME YÖNTEMİ SEÇİCİ */}
        <div className="mb-6">
          <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
            Ödeme Yöntemini Seçin:
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* YÖNTEM 1: BANKA FAST / HAVALE (%15 İNDİRİMLİ) */}
            <button
              type="button"
              onClick={() => setPaymentMethod('havale')}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                paymentMethod === 'havale'
                  ? 'border-[#FF6000] bg-orange-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                %{havaleDiscountRate} EK İNDİRİM
              </span>
              <div className="flex items-center gap-2 mb-1">
                <Building className="w-5 h-5 text-[#FF6000]" />
                <strong className="text-sm font-black text-slate-900">Banka FAST / Havale</strong>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Komisyonsuz, anında FAST ile 7/24 havale yapın ve ek %{havaleDiscountRate} indirim kazanın.
              </p>
              <div className="mt-2 text-xs font-black text-emerald-700 font-mono">
                İndirimli Tutar: {havaleFinalPrice} ₺
              </div>
            </button>

            {/* YÖNTEM 2: KREDİ KARTI (SHOPIER) */}
            <button
              type="button"
              onClick={() => setPaymentMethod('shopier')}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                paymentMethod === 'shopier'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="absolute top-2.5 right-2.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                12 Taksit İmkanı
              </span>
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <strong className="text-sm font-black text-slate-900">Kredi / Banka Kartı (Shopier)</strong>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                3D Secure ve BDDK onaylı altyapı ile tüm banka kartlarıyla güvenli ödeme.
              </p>
              <div className="mt-2 text-xs font-black text-slate-900 font-mono">
                Tutar: {standardPrice} ₺
              </div>
            </button>
          </div>
        </div>

        {/* 4. SEÇİLEN ÖDEME YÖNTEMİ DETAYLARI */}

        {/* HAVALE / FAST ALANI */}
        {paymentMethod === 'havale' && (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4 animate-fadeIn">
            
            {/* Banka Hesap Bilgisi Kartı */}
            <div className="bg-white border border-slate-300 rounded-2xl p-4 space-y-2.5 shadow-sm text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Banka:</span>
                <strong className="font-black text-slate-900">{bankSettings.bankName}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500">Hesap Sahibi:</span>
                <strong className="font-bold text-slate-900">{bankSettings.accountHolder}</strong>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 border-t border-slate-100">
                <span className="font-bold text-slate-500">IBAN:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900 text-xs sm:text-sm">{bankSettings.iban}</span>
                  <button
                    onClick={handleCopyIban}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1 font-bold text-[10px]"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedIban ? 'Kopyalandı!' : 'Kopyala'}</span>
                  </button>
                </div>
              </div>

              {bankSettings.fastEasyAddress && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="font-bold text-slate-500">Kolay Adres (FAST):</span>
                  <strong className="font-mono font-bold text-slate-800">{bankSettings.fastEasyAddress}</strong>
                </div>
              )}

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] font-bold">
                ⚠️ {bankSettings.paymentNoteInstructions}
                <div className="font-mono text-sm text-[#FF6000] mt-1">
                  Referans Kodunuz: <strong>{dynamicRefCode}</strong>
                </div>
              </div>
            </div>

            {/* Havale Bildirim Formu */}
            {successNotifSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black text-emerald-900">Havale Bildiriminiz Alındı!</h4>
                <p className="text-xs text-emerald-700">
                  Ödemeniz admin panelimize iletildi. Birkaç dakika içinde kontrol edilerek lisansınız aktif edilecektir.
                </p>
                <button
                  onClick={handleWhatsAppSlip}
                  className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>WhatsApp'tan Dekont Gönder (Anında Açılsın)</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitHavaleNotification} className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase">Ödemeyi Yaptıktan Sonra Bildirin:</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Gönderen Adı Soyadı</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Ahmet Yılmaz"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Gönderdiğiniz Banka</label>
                    <input
                      type="text"
                      placeholder="Örn: Garanti BBVA"
                      value={senderBank}
                      onChange={(e) => setSenderBank(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Havale Bildirimini Kaydet & Gönder</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSlip}
                    className="w-full sm:w-auto px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Dekont Hattı</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* KREDİ KARTI / SHOPIER ALANI */}
        {paymentMethod === 'shopier' && (
          <div className="bg-indigo-50/50 border border-indigo-200 rounded-3xl p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CreditCard className="w-6 h-6" />
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-base font-black text-slate-900">Shopier 3D Secure Güvenli Ödeme</h4>
              <p className="text-xs text-slate-600">
                Aşağıdaki butona tıkladığınızda Shopier güvenli ödeme sayfasına yönlendirileceksiniz. Kredi veya banka kartınızla 12 aya varan taksit seçenekleriyle ödemenizi yapabilirsiniz.
              </p>
            </div>

            <div className="p-3 bg-white border border-indigo-100 rounded-2xl max-w-xs mx-auto text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Ödenecek Tutar:</span>
              <strong className="text-base font-black text-indigo-700 font-mono">{standardPrice} ₺</strong>
            </div>

            <button
              onClick={handleShopierRedirect}
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl transition-all inline-flex items-center gap-2"
            >
              <span>Shopier Güvenli Ödeme Sayfasına Git</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default SubscriptionModal;
