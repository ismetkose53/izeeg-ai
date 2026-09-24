import React from 'react';

/**
 * izeeg Modern E-Ticaret & AI Marka Logosu
 * Trendyol & Amazon sadeliğinde, modern ve akılda kalıcı vektörel logo
 */
export function IzeegLogo({ 
  size = 'md',          // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant = 'full',     // 'full' (icon + text) | 'icon' (only icon) | 'text' (only text)
  theme = 'dark',       // 'dark' (for dark header/bg) | 'light' (for white bg/invoices)
  showBadge = true,
  badgeText = 'AI',
  className = ''
}) {
  // Boyut ayarları
  const sizes = {
    xs: { icon: 24, text: 'text-sm', badge: 'text-[9px] px-1 py-0.2', gap: 'gap-1.5' },
    sm: { icon: 28, text: 'text-base', badge: 'text-[10px] px-1.5 py-0.5', gap: 'gap-2' },
    md: { icon: 34, text: 'text-xl', badge: 'text-[10px] px-2 py-0.5', gap: 'gap-2.5' },
    lg: { icon: 42, text: 'text-2xl', badge: 'text-xs px-2.5 py-0.5', gap: 'gap-3' },
    xl: { icon: 54, text: 'text-3xl', badge: 'text-sm px-3 py-1', gap: 'gap-3.5' }
  };

  const currentSize = sizes[size] || sizes.md;
  const isLight = theme === 'light';

  return (
    <div className={`flex items-center ${currentSize.gap} select-none ${className}`}>
      {/* 1. İKON / AMBLEM (Vektörel Modern Z & Gülümseyen Enerji Yayı) */}
      {(variant === 'full' || variant === 'icon') && (
        <div 
          className="relative flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105"
          style={{ width: currentSize.icon, height: currentSize.icon }}
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-md"
          >
            <defs>
              {/* Enerjik Trendyol/Amazon Turuncu-Mercan Gradyanı */}
              <linearGradient id="izeegBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF6000" />
                <stop offset="50%" stopColor="#FF7A00" />
                <stop offset="100%" stopColor="#FF3D00" />
              </linearGradient>

              {/* AI Kıvılcım & Z Zirvesi Gradyanı */}
              <linearGradient id="izeegAccentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>

              {/* Arka Plan Yumuşak Gölge */}
              <linearGradient id="izeegBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
            </defs>

            {/* Yumuşak Yuvarlak Kare Taban (Superellipse Squircle) */}
            <rect
              x="2"
              y="2"
              width="96"
              height="96"
              rx="28"
              fill="url(#izeegBrandGrad)"
            />

            {/* İç Derinlik Vurgusu */}
            <rect
              x="3"
              y="3"
              width="94"
              height="94"
              rx="27"
              stroke="#FFFFFF"
              strokeOpacity="0.25"
              strokeWidth="2"
            />

            {/* Modern Geometrik 'iz' & Sonsuzluk / Hız Formu */}
            {/* 'i' Noktası (Akıllı AI Çekirdeği) */}
            <circle cx="28" cy="28" r="7" fill="#FFFFFF" />

            {/* 'i' Gövdesi */}
            <rect x="23" y="42" width="10" height="28" rx="5" fill="#FFFFFF" />

            {/* 'z' ve Dinamik E-Ticaret Hız Formu */}
            <path
              d="M44 42 H76 C78.2 42 79.5 44.5 78.1 46.2 L52 70 H78 C80.2 70 82 71.8 82 74 C82 76.2 80.2 78 78 78 H46 C43.8 78 42.5 75.5 43.9 73.8 L70 50 H44 C41.8 50 40 48.2 40 46 C40 43.8 41.8 42 44 42 Z"
              fill="#FFFFFF"
            />

            {/* Amazon & Trendyol Stili Dinamik Gülümseme / Büyüme Oku */}
            <path
              d="M20 84 C42 93 64 93 82 82"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeOpacity="0.9"
            />
            {/* Gülümseme Ok Ucu */}
            <path
              d="M80 77 L85 83 L77 86"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.9"
            />
          </svg>
        </div>
      )}

      {/* 2. TİPOGRAFİ & MARKA İSMİ (izeeg) */}
      {(variant === 'full' || variant === 'text') && (
        <div className="flex items-center leading-none tracking-tight">
          <div className="flex items-baseline">
            <span 
              className={`font-black font-sans lowercase tracking-tight ${currentSize.text} ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              iz
            </span>
            <span 
              className={`font-black font-sans lowercase tracking-tight ${currentSize.text} bg-gradient-to-r from-[#FF6000] via-[#FF7A00] to-[#FF4500] bg-clip-text text-transparent`}
            >
              eeg
            </span>
          </div>

          {/* AI / PRO Akıllı Rozet */}
          {showBadge && (
            <span 
              className={`ml-2 font-black uppercase tracking-wider rounded-md shadow-sm border transition-all ${currentSize.badge} ${
                isLight 
                  ? 'bg-slate-900 text-white border-slate-800' 
                  : 'bg-gradient-to-r from-[#FF6000] to-[#FF4500] text-white border-orange-400/30'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default IzeegLogo;
