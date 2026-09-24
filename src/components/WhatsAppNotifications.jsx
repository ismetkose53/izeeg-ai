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
  Check
} from 'lucide-react';
import { 
  getNotificationSettings, 
  saveNotificationSettings, 
  formatWhatsAppMorningBrief 
} from '../services/notificationService';
import confetti from 'canvas-confetti';

export function WhatsAppNotifications({ metrics, onTriggerWhatsAppSend }) {
  const [settings, setSettings] = useState(getNotificationSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    saveNotificationSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleSendTest = () => {
    setTestSent(true);
    if (onTriggerWhatsAppSend) {
      onTriggerWhatsAppSend();
    }
    setTimeout(() => setTestSent(false), 3500);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const messageText = formatWhatsAppMorningBrief(settings, metrics);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Başlık */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm">
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
        <p className="text-xs text-slate-600 mt-0.5">
          Bilgisayarı açmanıza gerek kalmadan, dünkü net kârınız, kritik kaçaklar ve acil yapılması gerekenler doğrudan cebinize gelir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sol Kolon: Yapılandırma ve Telefon Ayarları (7 Kolon) */}
        <div className="lg:col-span-7 bg-white border border-slate-300 rounded-2xl p-5 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
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
              WhatsApp Botu Aktif
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
                placeholder="Örn: İsmet Bey"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            {/* Cep Telefonu */}
            <div>
              <label className="text-xs font-black text-slate-800 block mb-1.5">
                WhatsApp Numarası (Ülke Koduyla)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  placeholder="+90 532 123 45 67"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-black text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
                <Smartphone className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Gönderim Saati */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between">
              <div>
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  Sabah Bülteni Gönderim Saati
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Her sabah otomatik iletilir</div>
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
            <div className="space-y-2.5 pt-2">
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
            <div className="pt-4 flex items-center justify-between gap-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {savedSuccess ? 'Ayarlar Kaydedildi!' : 'Telefon Ayarlarını Kaydet'}
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6000] to-pink-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                  iz
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    izeeg AI Bot
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">çevrimiçi • Resmi Asistan</div>
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
                  <span>09:00</span>
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

          {/* Test Gönder Butonu */}
          <button
            onClick={handleSendTest}
            disabled={testSent}
            className={`mt-4 w-full max-w-sm py-2.5 rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 ${
              testSent
                ? 'bg-emerald-800 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            {testSent ? '✓ Bildirim Cep Telefonunuza İletildi!' : 'Telefonuma Canlı Test Bildirimi Gönder'}
          </button>

        </div>

      </div>

    </div>
  );
}
