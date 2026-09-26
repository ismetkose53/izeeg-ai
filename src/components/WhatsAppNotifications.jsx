import React, { useState } from 'react';
import { 
  BellRing, 
  Send, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle,
  Flame,
  Check,
  ExternalLink,
  Info,
  Server,
  Key,
  Globe,
  Radio,
  Share2
} from 'lucide-react';
import { 
  getNotificationSettings, 
  saveNotificationSettings, 
  formatWhatsAppMorningBrief,
  normalizePhoneNumber,
  getWhatsAppDirectUrl,
  sendWhatsAppMessage
} from '../services/notificationService';
import confetti from 'canvas-confetti';

export function WhatsAppNotifications({ metrics, onTriggerWhatsAppSend }) {
  const [settings, setSettings] = useState(getNotificationSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [browserNotifStatus, setBrowserNotifStatus] = useState(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const phoneInfo = normalizePhoneNumber(settings.phoneNumber);
  const messageText = formatWhatsAppMorningBrief(settings, metrics);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    saveNotificationSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleRequestBrowserPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setBrowserNotifStatus(perm);
      if (perm === 'granted') {
        new Notification("izeeg AI Bildirimleri Aktif", {
          body: "Sabah 09:00 bültenleri ve acil kaçak alarmları bu tarayıcıya iletilecektir.",
          icon: '/favicon.ico'
        });
      }
    }
  };

  const handleSendLiveWhatsApp = async () => {
    if (!phoneInfo.cleanNumber) {
      alert("Lütfen önce geçerli bir WhatsApp cep telefonu numarası giriniz.");
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      // Önce ayarları kaydet
      saveNotificationSettings(settings);

      const res = await sendWhatsAppMessage({
        settings,
        messageText,
        metrics
      });

      setSendResult({
        success: true,
        message: res.method === 'DIRECT'
          ? 'WhatsApp açıldı! Raporunuz mesaja hazır şekilde yerleştirildi.'
          : res.message
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

      if (onTriggerWhatsAppSend) {
        onTriggerWhatsAppSend(res);
      }
    } catch (err) {
      setSendResult({
        success: false,
        message: err.message || 'Gönderim sırasında bir hata oluştu.'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. Üst Bilgi Başlığı */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                Otomatik Rapor Botu
              </span>
              <span className="text-xs text-slate-600 font-bold">Her Sabah 09:00'da WhatsApp'ınıza Canlı Mesaj</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <BellRing className="w-6 h-6 text-emerald-600" />
              WhatsApp & SMS Otomatik Bildirim Merkezi
            </h2>
          </div>

          {/* Tarayıcı Bildirim İzni Durumu */}
          {browserNotifStatus === 'granted' ? (
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Masaüstü Push İzni Aktif
            </span>
          ) : (
            <button
              onClick={handleRequestBrowserPermission}
              className="text-xs font-black text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Sabah 09:00'da panel açıkken masaüstü alarmı almak için izin verin"
            >
              <BellRing className="w-4 h-4 text-amber-600" />
              09:00 Masaüstü Alarm İzni Ver
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
          Bilgisayarı açmanıza gerek kalmadan, dünkü net kârınız, kritik kaçaklar ve acil yapılması gerekenler doğrudan cebinize gelir.
        </p>
      </div>

      {/* Şeffaf Bilgilendirme Kutusu: Sistem Nasıl Çalışır? */}
      <div className="bg-gradient-to-r from-slate-900 to-[#121924] border border-slate-700 text-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center flex-shrink-0 font-black">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <strong className="text-white text-sm block">💡 WhatsApp Otomasyonu Nasıl Çalışır?</strong>
            <p className="text-slate-300 leading-relaxed">
              <strong>1 Tıkla WhatsApp:</strong> Aşağıdaki <span className="text-emerald-400 font-bold">"WhatsApp'ta Canlı Gönder"</span> butonuna bastığınızda telefonunuz veya WhatsApp Web anında açılarak günlük bülteni hazırlar.
              <br />
              <strong>7/24 Bulut Otomasyonu:</strong> Bilgisayarınız tamamen kapalıyken her sabah 09:00'da doğrudan mesaj almak için aşağıdaki <em>"Bulut WhatsApp Gateway (UltraMsg / Webhook)"</em> modunu seçebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sol Kolon: Yapılandırma ve Telefon Ayarları (7 Kolon) */}
        <div className="lg:col-span-7 bg-white border border-slate-300 rounded-2xl p-5 lg:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                WA
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Bildirim & Telefon Ayarları</h3>
                <span className="text-xs text-slate-500 font-medium">Mesajların iletileceği numara</span>
              </div>
            </div>

            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              WhatsApp Botu Hazır
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Ad Soyad / Hitap */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-1.5">
                Hitap & Yetkili Adı
              </label>
              <input
                type="text"
                value={settings.fullName}
                onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                placeholder="Örn: yumey Yöneticisi (İsmet Bey)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Cep Telefonu */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-slate-800">
                  WhatsApp Numarası (Ülke Kodu Dahil)
                </label>
                {phoneInfo.isValid && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ Format: {phoneInfo.formatted}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  placeholder="0543 697 07 55 veya 905436970755"
                  className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-mono font-black text-slate-900 focus:outline-none focus:bg-white ${
                    settings.phoneNumber && !phoneInfo.isValid ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 focus:border-emerald-600'
                  }`}
                />
                <Smartphone className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Türkiye için <strong>05XX...</strong> veya <strong>905XX...</strong> şeklinde yazabilirsiniz. Sistem otomatik olarak WhatsApp uluslararası koduna dönüştürür.
              </p>
            </div>

            {/* Gönderim Modu Seçici */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-3">
              <label className="text-xs font-black text-slate-900 block">
                İletim ve Otomasyon Yöntemi:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                
                {/* 1. Doğrudan WhatsApp */}
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, deliveryMethod: 'DIRECT' })}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    settings.deliveryMethod === 'DIRECT'
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-black">
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-emerald-600" />
                      1 Tıkla WhatsApp
                    </span>
                    {settings.deliveryMethod === 'DIRECT' && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <span className="text-[11px] text-slate-600 mt-1">
                    Ücretsiz, anında WhatsApp Web veya Mobil uygulamasını açar.
                  </span>
                </button>

                {/* 2. UltraMsg Bulut Gateway */}
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, deliveryMethod: 'ULTRAMSG' })}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    settings.deliveryMethod === 'ULTRAMSG'
                      ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-500/20 text-emerald-950'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between font-black">
                    <span className="flex items-center gap-1.5">
                      <Server className="w-4 h-4 text-purple-600" />
                      UltraMsg 7/24 Bulut Bot
                    </span>
                    {settings.deliveryMethod === 'ULTRAMSG' && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <span className="text-[11px] text-slate-600 mt-1">
                    Bilgisayar kapalıyken bile arka planda otomatik SMS/WhatsApp gönderir.
                  </span>
                </button>

              </div>

              {/* UltraMsg Alanları (Aktifse Göster) */}
              {settings.deliveryMethod === 'ULTRAMSG' && (
                <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2.5 mt-2 animate-fadeIn">
                  <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-purple-700" />
                    UltraMsg API Bilgileri (ultramsg.com)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={settings.ultramsgInstanceId || ''}
                      onChange={(e) => setSettings({ ...settings, ultramsgInstanceId: e.target.value })}
                      placeholder="Instance ID (örn: instance12345)"
                      className="w-full bg-white border border-purple-300 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                    <input
                      type="text"
                      value={settings.ultramsgToken || ''}
                      onChange={(e) => setSettings({ ...settings, ultramsgToken: e.target.value })}
                      placeholder="Token (örn: abcdef123456)"
                      className="w-full bg-white border border-purple-300 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gönderim Saati */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  Sabah Bülteni Gönderim Saati
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Her sabah otomatik hazırlanır ve iletilir</div>
              </div>
              <select
                value={settings.morningBriefTime}
                onChange={(e) => setSettings({ ...settings, morningBriefTime: e.target.value })}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-black text-slate-900 focus:outline-none"
              >
                <option value="08:00">08:00</option>
                <option value="08:30">08:30</option>
                <option value="09:00">09:00 (Önerilen)</option>
                <option value="09:30">09:30</option>
                <option value="10:00">10:00</option>
              </select>
            </div>

            {/* Bildirim Tipleri Toggle Listesi */}
            <div className="space-y-2.5 pt-1">
              <span className="text-xs font-black text-slate-800 block mb-1">Gönderilecek Bildirim Türleri:</span>

              {/* Toggle 1: Sabah Bülteni */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">☀️</span>
                  <div>
                    <div className="text-xs font-black text-slate-900">09:00 Sabah Yönetici Raporu</div>
                    <div className="text-[11px] text-slate-500 font-medium">Dünkü ciro, net kâr ve günün görevleri</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.whatsappEnabled}
                  onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>

              {/* Toggle 2: Acil Kaçak Alarmları */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">🚨</span>
                  <div>
                    <div className="text-xs font-black text-slate-900">Anlık Para Kaçağı Alarmları</div>
                    <div className="text-[11px] text-slate-500 font-medium">Zararına satış veya bütçe yutan reklam uyarısı</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyOnDangerLeaks}
                  onChange={(e) => setSettings({ ...settings, notifyOnDangerLeaks: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>

              {/* Toggle 3: Kargo Desi İtiraz Bildirimleri */}
              <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">📦</span>
                  <div>
                    <div className="text-xs font-black text-slate-900">Kargo Desi İade Müjdeleri</div>
                    <div className="text-[11px] text-slate-500 font-medium">Faturada fazla kesinti yakalandığında bildirim</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifyOnMilestones}
                  onChange={(e) => setSettings({ ...settings, notifyOnMilestones: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
              </label>
            </div>

            {/* Butonlar */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                {savedSuccess ? 'Ayarlar Başarıyla Kaydedildi!' : 'Telefon Ayarlarını Kaydet'}
              </button>
            </div>

          </form>
        </div>

        {/* Sağ Kolon: Canlı WhatsApp Telefon Mockup Önizlemesi (5 Kolon) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full max-w-sm rounded-[32px] border-[6px] border-slate-800 bg-[#0c1317] p-3 shadow-2xl relative overflow-hidden">
            {/* Telefon Ahize Çentiği */}
            <div className="w-24 h-3.5 bg-slate-800 rounded-full mx-auto mb-2"></div>

            {/* WhatsApp Üst Bar */}
            <div className="bg-[#1f2c34] p-3 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f27a1a] to-pink-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                  iz
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    izeeg AI Bot
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">çevrimiçi • Canlı Asistan</div>
                </div>
              </div>
              <span className="text-xs text-slate-400">⋮</span>
            </div>

            {/* Sohbet Alanı */}
            <div className="p-3 bg-[#0b141a] space-y-3 min-h-[360px] max-h-[400px] overflow-y-auto">
              
              {/* Tarih Etiketi */}
              <div className="text-center">
                <span className="text-[10px] font-semibold text-slate-400 bg-[#182229] px-2 py-0.5 rounded-md">
                  BUGÜN
                </span>
              </div>

              {/* Botun Mesaj Balonu */}
              <div className="p-3.5 rounded-2xl rounded-tl-none bg-[#005c4b] text-white text-[11px] leading-relaxed shadow-md border border-white/5 space-y-1.5">
                <div className="font-mono whitespace-pre-wrap">
                  {messageText}
                </div>
                <div className="text-right text-[9px] text-slate-300 flex items-center justify-end gap-1 mt-1">
                  <span>{settings.morningBriefTime || '09:00'}</span>
                  <span className="text-cyan-300 font-bold">✓✓</span>
                </div>
              </div>

            </div>

            {/* Alt Mesaj Yazma Barı */}
            <div className="p-2 bg-[#1f2c34] rounded-b-2xl flex items-center justify-between text-xs text-slate-400">
              <span>Mesaj yaz...</span>
              <span className="text-emerald-400">🎤</span>
            </div>
          </div>

          {/* Gerçek WhatsApp Gönder Butonu */}
          <button
            onClick={handleSendLiveWhatsApp}
            disabled={isSending}
            className={`mt-4 w-full max-w-sm py-3.5 rounded-xl text-xs font-black transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              isSending
                ? 'bg-emerald-800 text-white opacity-80'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/30'
            }`}
          >
            <Send className="w-4 h-4" />
            {isSending ? 'İletiliyor...' : '📲 WhatsApp\'ta Canlı Aç & Raporu Gönder'}
          </button>

          {/* Sonuç Bildirimi */}
          {sendResult && (
            <div className={`mt-3 w-full max-w-sm p-3 rounded-xl text-xs font-bold border animate-fadeIn flex items-center gap-2 ${
              sendResult.success 
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}>
              {sendResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
              <span>{sendResult.message}</span>
            </div>
          )}

          <p className="text-[11px] text-slate-500 text-center mt-2 max-w-xs">
            Butona bastığınızda WhatsApp Web veya WhatsApp masaüstü/mobil uygulaması açılarak bülteni tek tıkla sohbete aktarır.
          </p>

        </div>

      </div>

    </div>
  );
}

export default WhatsAppNotifications;

