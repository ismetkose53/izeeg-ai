import React, { useState } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Zap, 
  Activity,
  Sliders,
  Filter
} from 'lucide-react';
import { AD_PERFORMANCE_DATA } from '../services/mockData';
import { PageGuideButton } from './PageHelpGuideModal';

export function AdPerformancePage({ onNavigateBack, onTriggerActionApproval, onOpenGuide }) {
  const [selectedChannel, setSelectedChannel] = useState('ALL');

  const filteredAds = AD_PERFORMANCE_DATA.filter(ad => {
    if (selectedChannel === 'ALL') return true;
    return ad.channel.toLowerCase().includes(selectedChannel.toLowerCase());
  });

  const totalAdSpend = AD_PERFORMANCE_DATA.reduce((sum, ad) => sum + ad.totalSpend, 0);
  const totalAdRevenue = AD_PERFORMANCE_DATA.reduce((sum, ad) => sum + ad.generatedRevenue, 0);
  const avgRoas = totalAdSpend > 0 ? (totalAdRevenue / totalAdSpend).toFixed(2) : '0';
  const totalNetAfterAds = AD_PERFORMANCE_DATA.reduce((sum, ad) => sum + ad.netProfitAfterAd, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. Üst Başlık & Geri Dön */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                ROAS & Gerçek Kâr Analizörü
              </span>
              <span className="text-xs text-slate-500 font-medium">Doğrulanmış API Verisi</span>
              {onOpenGuide && (
                <PageGuideButton 
                  onClick={onOpenGuide} 
                  label="💡 Nasıl Kullanılır?" 
                  className="py-1 px-3" 
                />
              )}
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-blue-600" />
              Reklam Performansı & Kârlılık Motoru
            </h1>
          </div>
        </div>

        {/* Kanal Filtresi */}
        <div className="flex items-center gap-2">
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm"
          >
            <option value="ALL">🌐 Tüm Reklam Kanalları</option>
            <option value="Trendyol">Trendyol Sponsorlu</option>
            <option value="Hepsiburada">Hepsiburada HepsiAd</option>
            <option value="Amazon">Amazon Sponsored</option>
          </select>
        </div>
      </div>

      {/* 2. Reklam Metrikleri 4'lü Kart Grubu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Toplam Reklam Harcaması */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block">Toplam Reklam Harcaması</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {totalAdSpend.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Son 7 Günlük Toplam Bütçe
          </div>
        </div>

        {/* Reklam Kaynaklı Ciro */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block">Reklam Kaynaklı Ciro</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {totalAdRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Toplam 155 Adet Sipariş
          </div>
        </div>

        {/* Ortalama ROAS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Ortalama ROAS</span>
            <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
              1 ₺ ➔ {avgRoas} ₺
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {avgRoas}x
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Harcanan her 1 TL'ye gelen ciro
          </div>
        </div>

        {/* Reklam Sonrası Saf Net Kâr */}
        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-bold text-emerald-800 block">Reklam Sonrası Net Kâr</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            +{totalNetAfterAds.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            Reklam gideri düşülmüş net nakit
          </div>
        </div>

      </div>

      {/* 3. AI Reklam Kök Neden & Gizli Zarar Analiz Kutusu */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white border border-blue-800/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                🚨 Gizli Reklam Kaçağı Uyarısı
              </span>
              <span className="text-xs text-blue-300 font-bold">
                ROAS Aldatmacası: Ciro Var Ama Net Zarar Yazıyor!
              </span>
            </div>

            <h3 className="text-base font-black text-white">
              “Erkek Koşu Şortu” reklamı kasanıza -1.059,10 ₺ zarar ettiriyor.
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Bu kampanya 5.598 ₺ ciro getirdiği için başarılı gibi görünebilir. Ancak 3.400 ₺ reklam harcaması, komisyonlar ve yüksek iade oranı düşüldüğünde <strong>ürün başına kâr eksiye düşmektedir</strong>. Bu bütçe %35 kısılarak daha karlı olan Kadın Spor Ayakkabı kampanyasına kaydırılmalıdır.
            </p>
          </div>

          <button
            onClick={() => onTriggerActionApproval({
              id: 'AI-AD-ACTION-01',
              title: 'Erkek Şortu Reklam Bütçesini %35 Kıs',
              marketplace: 'Trendyol Sponsorlu Ürünler',
              product: 'Erkek Koşu Şortu (Lacivert / M)',
              q3_financialImpact: 'Haftalık 1.190 ₺ Boşa Reklam Zararı Kurtarılacaktır',
              action: {
                type: 'AD_BUDGET_REDUCE',
                label: 'Bütçeyi %35 Kısma Onayı Ver',
                payload: { estimatedSaving: '1.190 ₺/hafta' }
              }
            })}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-600/30 transition-all whitespace-nowrap hover:scale-105 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Bütçe Optimizasyonunu Onayla</span>
          </button>
        </div>
      </div>

      {/* 4. Reklam Kampanyaları Tablosu */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Kanal ve Kampanya Bazlı Reklam Raporu
            </h3>
            <p className="text-xs text-slate-500">
              Tıklama Başı Maliyet (CPC), ROAS ve reklam harcaması düşüldükten sonraki net kâr.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500">
            Aktif Kampanya: {filteredAds.length}
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3">Kampanya & Pazar Yeri</th>
                <th className="py-3 px-3">Hedef Ürün</th>
                <th className="py-3 px-3 text-right">Reklam Harcaması</th>
                <th className="py-3 px-3 text-right">Tıklama / CPC</th>
                <th className="py-3 px-3 text-right">Getirdiği Ciro</th>
                <th className="py-3 px-3 text-right">ROAS</th>
                <th className="py-3 px-3 text-right font-bold">Reklam Sonrası Net Kâr</th>
                <th className="py-3 px-3">AI Değerlendirmesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAds.map(ad => (
                <tr key={ad.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  <td className="py-3.5 px-3">
                    <strong className="text-slate-900 font-bold block">{ad.campaignName}</strong>
                    <span className="text-[10px] text-blue-600 font-semibold">{ad.channel}</span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-800 truncate max-w-xs">{ad.productName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{ad.sku}</span>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                    {ad.totalSpend.toFixed(2)} ₺
                    <div className="text-[10px] text-slate-400">({ad.budgetDaily} ₺/gün)</div>
                  </td>

                  <td className="py-3.5 px-3 text-right text-slate-700">
                    <div>{ad.clicks} Tık</div>
                    <div className="text-[10px] text-slate-400 font-mono">{ad.cpc.toFixed(2)} ₺ CPC</div>
                  </td>

                  <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                    {ad.generatedRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    <div className="text-[10px] text-slate-400">{ad.generatedOrders} Sipariş</div>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                      ad.roas >= 5 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : ad.roas >= 3 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {ad.roas}x
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <span className={`text-xs font-black ${
                      ad.netProfitAfterAd > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {ad.netProfitAfterAd > 0 ? `+${ad.netProfitAfterAd.toFixed(2)} ₺` : `${ad.netProfitAfterAd.toFixed(2)} ₺`}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="text-[11px] text-slate-600 max-w-xs leading-tight">
                      {ad.aiNote}
                    </p>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
