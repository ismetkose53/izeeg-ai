import React, { useState } from 'react';
import { 
  RotateCcw, 
  AlertTriangle, 
  TrendingDown, 
  Truck, 
  PackageX, 
  Sparkles, 
  Search, 
  Filter, 
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
  Info
} from 'lucide-react';
import { RETURNS_MANAGEMENT_DATA, INITIAL_PRODUCTS } from '../services/mockData';
import confetti from 'canvas-confetti';
import { PageGuideButton } from './PageHelpGuideModal';

export function ReturnsManagementPage({ onNavigateBack, onTriggerActionApproval, onOpenGuide }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredReturns = RETURNS_MANAGEMENT_DATA.filter(item => {
    if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.orderId.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        item.reasonCategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalReturnLoss = RETURNS_MANAGEMENT_DATA.reduce((sum, item) => sum + item.totalLossFromReturn, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. Üst Başlık & Geri Dön Butonu */}
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
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Çift Kargo & Kâr Kayıp Motoru
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
              <RotateCcw className="w-6 h-6 text-rose-600" />
              İade Yönetimi & Kârlılık Analizi
            </h1>
          </div>
        </div>

        {/* Toplam İade Kayıp Özeti */}
        <div className="bg-white border border-rose-200 rounded-2xl p-3 px-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
            <PackageX className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-semibold block">Bu Ayki İade Kaynaklı Net Kayıp</span>
            <strong className="text-base font-black text-rose-600">
              -{totalReturnLoss.toFixed(2)} ₺
            </strong>
          </div>
        </div>
      </div>

      {/* 2. AI İade Analiz & Önleme Kutusu */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 rounded-3xl p-6 text-white border border-rose-800/40 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                AI İade Önleme Raporu
              </span>
              <span className="text-xs text-rose-400 font-bold">
                ⚠️ İadelerin %62'si Engellenebilir Nedenlerden Kaynaklanıyor
              </span>
            </div>

            <h3 className="text-base font-black text-white">
              “Erkek Koşu Şortu” iade oranı %22.3 ile kritik eşiği aştı!
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Müşterilerin 19'u <strong>"Kalıbı dar geldi"</strong> gerekçesiyle iade yaptı. Her iade size <strong>85,82 ₺ gidiş-dönüş kargo bedeli</strong> ve ambalaj hasarı yüklüyor. Ürün açıklamasına <em>"1 Beden Büyük Önerilir"</em> uyarısı ve net beden tablosu eklendiğinde beklenen iade düşüşü: <strong>%40</strong>.
            </p>
          </div>

          <button
            onClick={() => onTriggerActionApproval({
              id: 'AI-RET-ACTION',
              title: 'Erkek Şortu Beden Tablosu & Dar Kalıp Uyarısı Ekle',
              marketplace: 'Trendyol',
              product: 'Erkek Koşu Şortu (Lacivert / M)',
              q3_financialImpact: 'Aylık ~1.690 ₺ Çift Kargo Kaybı Önlenecektir',
              action: {
                type: 'LISTING_UPDATE',
                label: 'Beden Uyarısını Yayına Al',
                payload: { estimatedSaving: '1.690 ₺/ay' }
              }
            })}
            className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all whitespace-nowrap hover:scale-105 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Önerisini Onayla & Uygula</span>
          </button>
        </div>
      </div>

      {/* 3. İade Nedenleri ve Maliyet Analizi 3'lü Kart Grubu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Neden 1: Beden / Kalıp */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">1. Beden / Kalıp Uymadı</span>
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">%62 Pay</span>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">14 Adet İade</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Toplam Çift Kargo Maliyeti: <strong className="text-slate-800">1.201,48 ₺</strong>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-emerald-600 font-bold">
            💡 Çözüm: Beden tablosu optimizasyonu
          </div>
        </div>

        {/* Neden 2: Cayma / Beğenilmeme */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">2. Cayma / Renk Farkı</span>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">%24 Pay</span>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">5 Adet İade</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Toplam Çift Kargo Maliyeti: <strong className="text-slate-800">429,10 ₺</strong>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-emerald-600 font-bold">
            💡 Çözüm: Gerçek gün ışığı stüdyo fotoğrafı
          </div>
        </div>

        {/* Neden 3: Kargo Hasarı */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">3. Kargo Taşıma Hasarı</span>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">%14 Pay</span>
          </div>
          <div className="text-xl font-black text-slate-900 mt-2">3 Adet İade</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Toplam Çift Kargo Maliyeti: <strong className="text-slate-800">257,46 ₺</strong>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-blue-600 font-bold">
            💡 Çözüm: Kargo firmasına hasar tazmin talebi
          </div>
        </div>

      </div>

      {/* 4. Canlı İade Kayıtları Tablosu */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900">
              Gelen İadeler & Maliyet Dökümü
            </h3>
            <p className="text-xs text-slate-500">
              Gidiş kargosu + Dönüş kargosu + Yeniden paketleme maliyeti net kârdan düşülür.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İade No, Müşteri veya Neden Ara..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3 px-3">İade No & Pazar Yeri</th>
                <th className="py-3 px-3">Müşteri & Tarih</th>
                <th className="py-3 px-3">Ürün</th>
                <th className="py-3 px-3">İade Sebebi</th>
                <th className="py-3 px-3 text-right">Gidiş + Dönüş Kargo</th>
                <th className="py-3 px-3 text-right">Ambalaj Zararı</th>
                <th className="py-3 px-3 text-right text-rose-600 font-bold">Toplam Net Zarar</th>
                <th className="py-3 px-3 text-center">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReturns.map(ret => (
                <tr key={ret.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  <td className="py-3 px-3">
                    <strong className="text-slate-900 font-bold block">{ret.id}</strong>
                    <span className="text-[10px] text-slate-500">{ret.orderId} • {ret.marketplace}</span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-800">{ret.customerName}</div>
                    <span className="text-[10px] text-slate-400">{ret.returnDate}</span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900 max-w-xs truncate">{ret.productName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{ret.sku}</span>
                  </td>

                  <td className="py-3 px-3">
                    <span className="inline-block bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-[11px] border border-rose-200">
                      {ret.reasonCategory}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">{ret.reasonDetail}</div>
                  </td>

                  <td className="py-3 px-3 text-right font-medium text-slate-700">
                    -{(ret.outboundCargoFee + ret.returnCargoFee).toFixed(2)} ₺
                    <div className="text-[9px] text-slate-400">({ret.outboundCargoFee} + {ret.returnCargoFee})</div>
                  </td>

                  <td className="py-3 px-3 text-right font-medium text-slate-700">
                    -{ret.repackagingCost.toFixed(2)} ₺
                  </td>

                  <td className="py-3 px-3 text-right font-black text-rose-600 text-xs">
                    -{ret.totalLossFromReturn.toFixed(2)} ₺
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {ret.status === 'IN_TRANSIT' ? 'Kargoda Geliyor' : 'İade Kabul Edildi'}
                    </span>
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
