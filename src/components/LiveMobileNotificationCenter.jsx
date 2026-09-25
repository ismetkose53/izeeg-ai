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
  unreadCount = 3 
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-01',
      type: 'ORDER_PROFIT',
      title: 'Yeni Sipariş: +663.75 ₺ Net Kâr!',
      marketplace: 'Trendyol',
      description: "1x Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım siparişi geldi. Tüm komisyon ve kargo düşüldükten sonra net kârınız kasada.",
      timeAgo: '2 dk önce',
      isUnread: true,
      targetTab: 'orders',
      iconColor: 'bg-emerald-100 text-emerald-700'
    },
    {
      id: 'NOTIF-02',
      type: 'BUYBOX_WON',
      title: 'Buybox Korundu (Fiyat: 1.599,00 ₺)',
      marketplace: 'Trendyol',
      description: 'Rakip "ModaTrend" fiyat kırdı. Akıllı Repricer anında 1 TL alta çekerek Buybox kutusunu %100 korudu.',
      timeAgo: '15 dk önce',
      isUnread: true,
      targetTab: 'repricer',
      iconColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'NOTIF-03',
      type: 'LOW_STOCK',
      title: 'Stok Uyarısı: 1.6 Gün Kaldı',
      marketplace: 'Trendyol',
      description: 'Siyah Modal Takım stoğunuz 4 adede düştü. Güngören Tekstil sipariş fişi tek tıkla hazırlandı.',
      timeAgo: '45 dk önce',
      isUnread: true,
      targetTab: 'supplier-reorder',
      iconColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'NOTIF-04',
      type: 'CARGO_DISPUTE',
      title: 'Kargo İtirazı Kabul: +124.50 ₺ İade',
      marketplace: 'Trendyol Express',
      description: 'Geçen ayki 3 siparişin fazla desi itiraz dilekçesi onaylandı, cari hesabınıza alacak kaydedildi.',
      timeAgo: '3 saat önce',
      isUnread: false,
      targetTab: 'cargo-audit',
      iconColor: 'bg-blue-100 text-blue-800'
    }
  ]);

  if (!isOpen) return null;

  // Hepsini Okundu Say
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  // Yeni Test Kâr Bildirimi Simüle Et
  const handleTriggerTestProfitNotification = () => {
    if (soundEnabled) playNotificationChime();

    const sampleOrders = [
      { name: "Siyah Modal Tshirt 2'li Takım", profit: '663.75 ₺', market: 'Trendyol' },
      { name: 'Yıldız Taşlı Vatkalı Tişört', profit: '528.22 ₺', market: 'Trendyol' },
      { name: 'Palazzo Jean Pantolon', profit: '586.75 ₺', market: 'Trendyol' }
    ];
    const picked = sampleOrders[Math.floor(Math.random() * sampleOrders.length)];

    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: 'ORDER_PROFIT',
      title: `Yeni Sipariş: +${picked.profit} Net Kâr!`,
      marketplace: picked.market,
      description: `1x ${picked.name} siparişi alındı. Net kâr anlık olarak bilançonuzla eşleştirildi.`,
      timeAgo: 'Az önce',
      isUnread: true,
      targetTab: 'orders',
      iconColor: 'bg-emerald-100 text-emerald-700'
    };

    setNotifications([newNotif, ...notifications]);
    confetti({ particleCount: 70, spread: 60 });
  };

  const handleNotificationClick = (item) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isUnread: false } : n));
    if (onNavigateTab && item.targetTab) {
      onNavigateTab(item.targetTab);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 lg:p-6 bg-slate-950/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp text-slate-900 mt-12">
        
        {/* Çekmece Üst Başlık */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Canlı Bildirim Merkezi</h3>
              <span className="text-[10px] text-slate-400">Anlık Satış, Kâr & Buybox Alarmları</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                soundEnabled ? 'text-emerald-400 hover:bg-white/10' : 'text-slate-500 hover:bg-white/10'
              }`}
              title={soundEnabled ? 'Bildirim Sesi Açık' : 'Bildirim Sesi Kapalı'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hızlı Aksiyon & Test Çubuğu */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={handleTriggerTestProfitNotification}
            className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-sm transition-all text-[11px]"
          >
            <Sparkles className="w-3 h-3 text-emerald-200" />
            <span>+ Canlı Kâr Bildirimi Test Et</span>
          </button>

          <button
            onClick={handleMarkAllRead}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Tümünü Okundu Say</span>
          </button>
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
