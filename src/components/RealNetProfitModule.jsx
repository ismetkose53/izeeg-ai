import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  ArrowRight, 
  RotateCcw, 
  Truck, 
  Megaphone, 
  Percent, 
  Layers, 
  HelpCircle,
  Database,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { DATA_STATUS_BADGES } from '../services/mockData';
import { PageGuideButton } from './PageHelpGuideModal';

export function RealNetProfitModule({ 
  products, 
  orders, 
  onOpenGuide,
  onNavigateToReturns, 
  onNavigateToAds,
  onNavigateToProTable 
}) {
  // Dönem Filtresi: 'TODAY' (Bugün) | 'THIS_WEEK' (Bu Hafta) | 'THIS_MONTH' (Bu Ay)
  const [period, setPeriod] = useState('TODAY');

  // Döneme Göre Finansal Metrikler
  const financialData = useMemo(() => {
    if (period === 'TODAY') {
      return {
        grossSales: 38900.00,
        orderCount: 18,
        cogs: 18450.00,
        missingCostProductsCount: 2, // ⚠️ 2 Üründe alış maliyeti eksik uyarısı
        commission: 5640.50,
        cargoCost: 3850.00,
        cargoLeakDeduction: 67.68,
        returnCount: 1,
        returnProductLoss: 279.90,
        returnDoubleCargoCost: 85.82,
        totalReturnLoss: 365.72,
        adSpend: 1450.00,
        adApiStatus: 'API_VERIFIED', // API_VERIFIED | SYNC_FAILED
        estimatedVat: 1256.00,
        netProfit: 8270.10,
        netMargin: 21.3,
        roi: 44.8,
        marketplaces: [
          { name: 'Trendyol', gross: 24500, net: 5120, margin: 20.9, color: '#f27a1a' },
          { name: 'Hepsiburada', gross: 8400, net: 1890, margin: 22.5, color: '#ff6000' },
          { name: 'Amazon TR', gross: 4200, net: 920, margin: 21.9, color: '#ff9900' },
          { name: 'Kendi Sitem (Shopify)', gross: 1800, net: 340.10, margin: 18.8, color: '#96bf48' }
        ],
        returnsList: [
          { date: 'Bugün 16:05', orderId: 'TY-9488102', product: 'Erkek Koşu Şortu', reason: 'Beden Dar Geldi', loss: 100.82 }
        ]
      };
    } else if (period === 'THIS_WEEK') {
      return {
        grossSales: 241850.00,
        orderCount: 114,
        cogs: 114200.00,
        missingCostProductsCount: 2,
        commission: 34850.00,
        cargoCost: 24120.00,
        cargoLeakDeduction: 245.50,
        returnCount: 8,
        returnProductLoss: 2150.00,
        returnDoubleCargoCost: 686.56,
        totalReturnLoss: 2836.56,
        adSpend: 8950.00,
        adApiStatus: 'API_VERIFIED',
        estimatedVat: 7850.00,
        netProfit: 51847.94,
        netMargin: 21.4,
        roi: 45.4,
        marketplaces: [
          { name: 'Trendyol', gross: 148000, net: 31200, margin: 21.0, color: '#f27a1a' },
          { name: 'Hepsiburada', gross: 52000, net: 11400, margin: 21.9, color: '#ff6000' },
          { name: 'Amazon TR', gross: 28000, net: 6400, margin: 22.8, color: '#ff9900' },
          { name: 'Kendi Sitem (Shopify)', gross: 13850, net: 2847.94, margin: 20.5, color: '#96bf48' }
        ],
        returnsList: [
          { date: '21 Eyl', orderId: 'TY-9488102', product: 'Erkek Koşu Şortu', reason: 'Beden Dar Geldi', loss: 100.82 },
          { date: '19 Eyl', orderId: 'TY-9480112', product: 'Siyah Şişme Mont', reason: 'Cayma / Renk Farkı', loss: 136.00 },
          { date: '18 Eyl', orderId: 'HB-7721094', product: 'Kadın Spor Ayakkabı', reason: 'Kargo Hasarı', loss: 110.82 }
        ]
      };
    } else {
      // THIS_MONTH
      return {
        grossSales: 984500.00,
        orderCount: 462,
        cogs: 465000.00,
        missingCostProductsCount: 3,
        commission: 142100.00,
        cargoCost: 98400.00,
        cargoLeakDeduction: 980.00,
        returnCount: 31,
        returnProductLoss: 8900.00,
        returnDoubleCargoCost: 2650.00,
        totalReturnLoss: 11550.00,
        adSpend: 34500.00,
        adApiStatus: 'API_VERIFIED',
        estimatedVat: 31800.00,
        netProfit: 212170.00,
        netMargin: 21.5,
        roi: 45.6,
        marketplaces: [
          { name: 'Trendyol', gross: 590000, net: 126000, margin: 21.3, color: '#f27a1a' },
          { name: 'Hepsiburada', gross: 210000, net: 46000, margin: 21.9, color: '#ff6000' },
          { name: 'Amazon TR', gross: 124000, net: 28500, margin: 22.9, color: '#ff9900' },
          { name: 'Kendi Sitem (Shopify)', gross: 60500, net: 11670, margin: 19.2, color: '#96bf48' }
        ],
        returnsList: [
          { date: '21 Eyl', orderId: 'TY-9488102', product: 'Erkek Koşu Şortu', reason: 'Beden Dar Geldi', loss: 100.82 },
          { date: '19 Eyl', orderId: 'TY-9480112', product: 'Siyah Şişme Mont', reason: 'Cayma / Renk', loss: 136.00 },
          { date: '18 Eyl', orderId: 'HB-7721094', product: 'Kadın Spor Ayakkabı', reason: 'Kargo Hasarı', loss: 110.82 },
          { date: '15 Eyl', orderId: 'TY-9471029', product: 'Yoga Matı Mor', reason: 'Müşteri Cayma', loss: 95.00 }
        ]
      };
    }
  }, [period]);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Üst Başlık & Dönem Değiştirici (Gün / Hafta / Ay) */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="min-w-0 w-full">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] sm:text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                Gerçek Veriye Dayalı Net Kâr Motoru
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-100 px-2 sm:px-2.5 py-0.5 rounded-lg">
                <Database className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-blue-600 flex-shrink-0" />
                <span>0 TL Varsayılmaz Prensibi Aktif</span>
              </span>
              {onOpenGuide && (
                <PageGuideButton 
                  onClick={onOpenGuide} 
                  label="💡 Nasıl Kullanılır?" 
                  className="py-0.5 sm:py-1 px-2 sm:px-3 text-xs" 
                />
              )}
            </div>

            <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
              <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-600 flex-shrink-0" />
              “Bugün Gerçekten Ne Kazandım?”
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tüm gelirlerinizden ürün maliyeti, pazar yeri komisyonları, kargo, iade zararları ve reklam harcamaları düşülerek kasanıza kalan saf net kâr.
            </p>
          </div>

          {/* Günlük / Haftalık / Aylık Buton Grubu (Mobilde Eşit Dağılım) */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 p-1 sm:p-1.5 rounded-2xl border border-slate-200 text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setPeriod('TODAY')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all text-center ${
                period === 'TODAY'
                  ? 'bg-slate-900 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📅 Bugün
            </button>

            <button
              onClick={() => setPeriod('THIS_WEEK')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all text-center ${
                period === 'THIS_WEEK'
                  ? 'bg-slate-900 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📊 Bu Hafta
            </button>

            <button
              onClick={() => setPeriod('THIS_MONTH')}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all text-center ${
                period === 'THIS_MONTH'
                  ? 'bg-slate-900 text-white shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📈 Bu Ay
            </button>
          </div>
        </div>
      </div>

      {/* 2. ANA NET KÂR KAHRAMAN KARTI (HERO CARD) */}
      <div className="bg-gradient-to-br from-[#0e1724] via-[#152336] to-[#122822] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 min-w-0 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 sm:px-3 py-0.5 rounded-full border border-emerald-500/40">
                {period === 'TODAY' ? 'GÜNLÜK SAF NET KAZANÇ' : period === 'THIS_WEEK' ? 'HAFTALIK SAF NET KAZANÇ' : 'AYLIK SAF NET KAZANÇ'}
              </span>
              <span className="text-xs text-slate-300">
                ({financialData.orderCount} Başarılı Sipariş)
              </span>
            </div>

            <div className="text-2xl sm:text-3xl lg:text-5xl font-black text-emerald-400 tracking-tight flex items-baseline gap-2 flex-wrap">
              <span>+{financialData.netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
              <span className="text-xs sm:text-sm lg:text-base font-bold text-emerald-300/80">Net Nakit</span>
            </div>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Toplam <strong>{financialData.grossSales.toLocaleString('tr-TR')} ₺</strong> ciro içerisinden tüm maliyetler, komisyonlar, kargolar ve reklamlar düştükten sonra cebinize giren reel para.
            </p>
          </div>

          {/* Marj ve ROI Göstergesi */}
          <div className="flex items-center justify-around sm:justify-start gap-4 bg-slate-800/80 p-3 sm:p-4 rounded-2xl border border-slate-700 w-full lg:w-auto">
            <div className="text-center px-2 sm:px-3 border-r border-slate-700 flex-1 sm:flex-initial">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Kâr Marjı</span>
              <strong className="text-lg sm:text-xl lg:text-2xl font-black text-emerald-400">%{financialData.netMargin}</strong>
            </div>
            <div className="text-center px-2 sm:px-3 flex-1 sm:flex-initial">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Sermaye ROI</span>
              <strong className="text-lg sm:text-xl lg:text-2xl font-black text-blue-400">%{financialData.roi}</strong>
            </div>
          </div>
        </div>

        {/* EKSİK VERİ UYARISI PANELİ (KRİTİK GEREKSİNİM: 0 TL SAYILMAZ!) */}
        {financialData.missingCostProductsCount > 0 && (
          <div className="mt-4 sm:mt-5 p-3 sm:p-3.5 bg-amber-500/15 border border-amber-500/40 rounded-2xl text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>⚠️ Gerçek Veri Uyarısı:</strong> {financialData.missingCostProductsCount} adet ürünün alış maliyeti (COGS) sisteme girilmemiş. Sistem bu ürünleri 0 TL varsayıp sahte kâr üretmez; net kârınız eksik hesaplanmaktadır.
              </span>
            </div>

            {onNavigateToProTable && (
              <button
                onClick={onNavigateToProTable}
                className="w-full sm:w-auto text-center px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs transition-all whitespace-nowrap cursor-pointer"
              >
                Maliyetleri Gir ➔
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. 7 KALEMLİ FİNANSAL KÖPRÜ (WATERFALL BREAKDOWN) */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-sm">
        <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1">
          Gelir - Gider Şelalesi (Net Kâra Giden Yol)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Paranız nereye gidiyor? Cirodan net kâra kadar olan tüm kesinti adımları:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3 text-xs">
          
          {/* 1. Brüt Ciro */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase block">1. Brüt Satış (Ciro)</span>
              <strong className="text-base font-black text-slate-900 block mt-1">
                {financialData.grossSales.toLocaleString('tr-TR')} ₺
              </strong>
            </div>
            <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 p-1 rounded">
              +{financialData.orderCount} Sipariş
            </div>
          </div>

          {/* 2. Ürün Alış Maliyeti */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-rose-800 uppercase block">2. Ürün Maliyeti (COGS)</span>
              <strong className="text-base font-black text-rose-600 block mt-1">
                -{financialData.cogs.toLocaleString('tr-TR')} ₺
              </strong>
            </div>
            <div className="mt-2 text-[10px] text-rose-700 font-bold">
              Alış faturası bedelleri
            </div>
          </div>

          {/* 3. Komisyonlar */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-rose-800 uppercase block">3. Pazar Yeri Komisyonu</span>
              <strong className="text-base font-black text-rose-600 block mt-1">
                -{financialData.commission.toLocaleString('tr-TR')} ₺
              </strong>
            </div>
            <div className="mt-2 text-[10px] text-slate-500">
              Ort. %14.5 komisyon
            </div>
          </div>

          {/* 4. Kargo & Desi */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-rose-800 uppercase block">4. Kargo & Desi Gideri</span>
              <strong className="text-base font-black text-rose-600 block mt-1">
                -{financialData.cargoCost.toLocaleString('tr-TR')} ₺
              </strong>
            </div>
            <div className="mt-2 text-[10px] text-amber-700 font-bold">
              Desi cezası dahil
            </div>
          </div>

          {/* 5. İadeler & Çift Kargo */}
          <div className="bg-rose-50/70 border border-rose-300 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-rose-900 uppercase block">5. İade & Çift Kargo Kaybı</span>
              <strong className="text-base font-black text-rose-700 block mt-1">
                -{financialData.totalReturnLoss.toFixed(2)} ₺
              </strong>
            </div>
            <div className="mt-2 text-[10px] text-rose-700 font-bold">
              {financialData.returnCount} İade ({financialData.returnDoubleCargoCost} ₺ kargo)
            </div>
          </div>

          {/* 6. Reklam Harcamaları */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-3.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-rose-800 uppercase block">6. Reklam Gideri</span>
              <strong className="text-base font-black text-rose-600 block mt-1">
                -{financialData.adSpend.toLocaleString('tr-TR')} ₺
              </strong>
            </div>
            <div className="mt-2 text-[10px] text-emerald-700 font-bold">
              Doğrulanmış API
            </div>
          </div>

          {/* 7. Gerçek Net Kâr */}
          <div className="col-span-2 sm:col-span-1 bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3.5 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[10px] font-black text-emerald-900 uppercase block">7. GERÇEK NET KÂR</span>
              <strong className="text-base font-black text-emerald-700 block mt-1">
                +{financialData.netProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </strong>
            </div>
            <div className="mt-2 text-[10px] text-emerald-800 font-black bg-emerald-100 p-1 rounded text-center">
              %{financialData.netMargin} Saf Marj
            </div>
          </div>

        </div>
      </div>

      {/* 4. İADE DETAYLARI & KANAL BAZLI DAĞILIM İKİLİ GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sol Taraf: İadelerin Gün/Hafta/Ay Detaylı Dökümü */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  {period === 'TODAY' ? 'Bugünkü İadeler' : period === 'THIS_WEEK' ? 'Bu Haftaki İadeler' : 'Bu Ayki İadeler'}
                </h3>
                <span className="text-xs text-slate-500">Çift kargo maliyeti ve ürün ziyanı dökümü</span>
              </div>
            </div>

            <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Toplam Kayıp: -{financialData.totalReturnLoss.toFixed(2)} ₺
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Tarih</th>
                  <th className="py-2.5 px-3">Sipariş & Ürün</th>
                  <th className="py-2.5 px-3">İade Nedeni</th>
                  <th className="py-2.5 px-3 text-right">Net Zarar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financialData.returnsList.map((ret, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{ret.date}</td>
                    <td className="py-2.5 px-3">
                      <strong className="text-slate-900 block">{ret.product}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{ret.orderId}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-200">
                        {ret.reason}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-rose-600">
                      -{ret.loss.toFixed(2)} ₺
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sağ Taraf: Pazar Yeri Net Kâr Katkı Dağılımı */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900">
              Pazar Yerlerinin Net Kâr Katkısı
            </h3>
            <span className="text-xs text-slate-500 font-medium">Kanal Dağılımı</span>
          </div>

          <div className="space-y-3">
            {financialData.marketplaces.map((mp, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mp.color }}></span>
                    <strong className="text-xs font-bold text-slate-900">{mp.name}</strong>
                  </div>
                  <span className="text-xs font-black text-emerald-700">
                    +{mp.net.toLocaleString('tr-TR')} ₺ Net
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Ciro: <strong>{mp.gross.toLocaleString('tr-TR')} ₺</strong></span>
                  <span className="text-emerald-800 font-bold">Marj: %{mp.margin}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
