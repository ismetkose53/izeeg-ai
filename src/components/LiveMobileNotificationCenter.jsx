import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCheck, 
  DollarSign, 
  Crown, 
  AlertTriangle, 
  Truck, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  ChevronRight, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Web Audio API ile Kristal Netliğinde Bildirim Sesi Sentezleyici
function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // 1. Ton (High ping)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15); // A6
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.4);

    // 2. Ton (Warm harmonic chime)
    setTimeout(() => {
      try {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1320, ctx.currentTime); // E6
        gain2.gain.setValueAtTime(0.25, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.5);
      } catch (e) {}
    }, 120);

  } catch (e) {
    console.error('Audio chime error:', e);
  }
}

export function LiveMobileNotificationCenter({ 
  isOpen, 
  onClose, 
  onNavigateTab,
  unreadCount = 0 
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('izeeg_live_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  if (!isOpen) return null;

  // Hepsini Okundu Say
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  // Bildirime Tıklayınca İlgili Sekmeye Git
  const handleNotificationClick = (item) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isUnread: false } : n));
    if (item.targetTab && onNavigateTab) {
      onNavigateTab(item.targetTab);
    }
    onClose();
  };

  // Test Amaçlı Canlı Bildirim Sesi ve Bildirim Tetikleme
  const handleTriggerTestProfitNotification = () => {
    if (soundEnabled) {
      playNotificationChime();
    }
    
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      type: 'ORDER_PROFIT',
      title: 'Canlı Bildirim Testi Başarılı',
      marketplace: 'izeeg AI',
      description: 'Sistem bildirim ses ve push mekanizması aktif çalışıyor.',
      timeAgo: 'Az önce',
      isUnread: true,
      targetTab: 'orders',
      iconColor: 'bg-emerald-100 text-emerald-700'
    };

    setNotifications(prev => [newNotif, ...prev]);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Çekmece Üst Başlık */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#f27a1a] flex items-center justify-center text-white">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Canlı Bildirim Merkezi</h3>
              <span className="text-[11px] text-slate-400">
                {notifications.filter(n => n.isUnread).length} Okunmamış Bildirim
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Bildirim sesini kapat' : 'Bildirim sesini aç'}
              className={`p-1.5 rounded-lg border transition-colors ${
                soundEnabled 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hızlı Aksiyon & Test Çubuğu */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={handleTriggerTestProfitNotification}
            className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-sm transition-all text-[11px] cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-emerald-200" />
            <span>+ Canlı Kâr Bildirimi Test Et</span>
          </button>

          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Tümünü Okundu Say</span>
            </button>
          )}
        </div>

        {/* Bildirim Listesi */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                item.isUnread ? 'bg-orange-50/50 hover:bg-orange-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${item.iconColor}`}>
                {item.type === 'ORDER_PROFIT' ? '💵' :
                 item.type === 'BUYBOX_WON' ? '👑' :
                 item.type === 'LOW_STOCK' ? '⚠️' : '📦'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <strong className="text-xs font-black text-slate-900 truncate block">
                    {item.title}
                  </strong>
                  <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                    {item.timeAgo}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                    {item.marketplace}
                  </span>
                  {item.isUnread && (
                    <span className="w-2 h-2 rounded-full bg-[#f27a1a]"></span>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-medium line-clamp-2">
                  {item.description}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 self-center flex-shrink-0" />
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-16 text-center text-slate-400 text-xs px-4 space-y-2">
              <Bell className="w-10 h-10 text-slate-300 mx-auto" />
              <span className="font-bold text-slate-700 block text-sm">Henüz Yeni Bildirim Yok</span>
              <p className="text-slate-500 max-w-xs mx-auto">Yeni sipariş, kârlılık uyarısı ve Buybox bildirimleri burada anlık olarak listelenir.</p>
            </div>
          )}
        </div>

        {/* Çekmece Alt Bilgi */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-slate-400" />
          <span>Mobil ve Web Anlık Push Bildirimleri Aktif</span>
        </div>

      </div>
    </div>
  );
}

export default LiveMobileNotificationCenter;
