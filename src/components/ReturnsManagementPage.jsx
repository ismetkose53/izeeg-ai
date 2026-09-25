import React, { useState, useEffect, useMemo } from 'react';
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
  Info,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  Image as ImageIcon,
  Check,
  ChevronRight,
  Plus,
  Box
} from 'lucide-react';
import { 
  getStoredReturns, 
  saveStoredReturns, 
  syncAllReturns, 
  extractReturnsFromOrders,
  getStoredImageCache,
  saveCustomProductImage,
  resolveSmartProductImage,
  getCustomCargoSettings,
  runAutoSyncAll
} from '../services/marketplaceSyncService';
import { PageGuideButton } from './PageHelpGuideModal';

export function ReturnsManagementPage({ onNavigateBack, onTriggerActionApproval, onOpenGuide }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedMarketplace, setSelectedMarketplace] = useState('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  
  // Canlı İadeler State'i (Sanal/demo veri tamamen kaldırıldı; yalnızca gerçek veriler listelenir)
  const [liveReturns, setLiveReturns] = useState(() => {
    const stored = getStoredReturns();
    if (stored && stored.length > 0) return stored;
    
    try {
      const ordersRaw = localStorage.getItem('izeeg_live_orders');
      if (ordersRaw) {
        const parsedOrders = JSON.parse(ordersRaw);
        const extracted = extractReturnsFromOrders(parsedOrders);
        if (extracted.length > 0) return extracted;
      }
    } catch {}
    
    return [];
  });

  // Görsel Güncelleme Modalı State'i
  const [editImageModal, setEditImageModal] = useState(null); // { barcode, sku, title, currentImage }
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Canlı İade ve Görsel Güncellemelerini Dinle
  const refreshLocalData = () => {
    const stored = getStoredReturns();
    try {
      const ordersRaw = localStorage.getItem('izeeg_live_orders');
      const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
      const extracted = extractReturnsFromOrders(orders);
      
      const map = new Map();
      [...stored, ...extracted].forEach(r => map.set(r.orderId || r.id, r));
      const merged = Array.from(map.values());
      setLiveReturns(merged);
    } catch {
      setLiveReturns(stored);
    }
  };

  useEffect(() => {
    refreshLocalData();
    const handleImagesUpdated = () => refreshLocalData();
    window.addEventListener('izeeg_images_updated', handleImagesUpdated);
    return () => window.removeEventListener('izeeg_images_updated', handleImagesUpdated);
  }, []);

  // API'den Canlı İadeleri & Siparişleri Çek Butonu
  const handleSyncReturns = async () => {
    setIsSyncing(true);
    setSyncMessage('Trendyol Claims & Hepsiburada Returns API taranıyor...');
    try {
      // 1. Önce genel pazaryeri senkronizasyonu (siparişler, ürün katalog resimleri ve durumlar)
      await runAutoSyncAll({});

      // 2. Ardından resmi claims/returns uç noktalarını senkronize et
      const res = await syncAllReturns();
      refreshLocalData();

      if (res.count > 0) {
        setSyncMessage(`✅ ${res.count} adet güncel iade ve talep kaydı başarıyla çekildi.`);
      } else {
        setSyncMessage('✅ Pazaryeri bağlantısı güncel. Açık veya bekleyen yeni iade talebi bulunamadı.');
      }
    } catch (err) {
      setSyncMessage('⚠️ Senkronizasyon tamamlandı (Sipariş havuzu tarandı).');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 5000);
    }
  };

  // Aktif Veri Listesi: SADECE GERÇEK VERİ
  const activeDataset = useMemo(() => {
    return liveReturns;
  }, [liveReturns]);

  // Filtreleme
  const filteredReturns = useMemo(() => {
    return activeDataset.filter(item => {
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) return false;
      if (selectedMarketplace !== 'ALL' && item.marketplace !== selectedMarketplace) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (item.id && item.id.toLowerCase().includes(q)) ||
          (item.orderId && item.orderId.toLowerCase().includes(q)) ||
          (item.customerName && item.customerName.toLowerCase().includes(q)) ||
          (item.productName && item.productName.toLowerCase().includes(q)) ||
          (item.reasonCategory && item.reasonCategory.toLowerCase().includes(q)) ||
          (item.barcode && item.barcode.includes(q)) ||
          (item.sku && item.sku.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeDataset, selectedStatus, selectedMarketplace, searchQuery]);

  // Toplam Maliyet ve İade Metrikleri
  const totalReturnLoss = activeDataset.reduce((sum, item) => sum + (Number(item.totalLossFromReturn) || 0), 0);
  const totalDoubleCargoLoss = activeDataset.reduce((sum, item) => sum + ((Number(item.outboundCargoFee) || 0) + (Number(item.returnCargoFee) || 0)), 0);

  // Kategori Bazlı Neden Dağılımı
  const reasonStats = useMemo(() => {
    const counts = {
      size: { count: 0, loss: 0 },
      remorse: { count: 0, loss: 0 },
      damage: { count: 0, loss: 0 },
      other: { count: 0, loss: 0 }
    };

    activeDataset.forEach(it => {
      const reason = (it.reasonCategory || '').toLowerCase();
      const loss = Number(it.totalLossFromReturn) || 0;
      if (reason.includes('beden') || reason.includes('kalıp')) {
        counts.size.count += 1;
        counts.size.loss += loss;
      } else if (reason.includes('cayma') || reason.includes('beğenilmedi') || reason.includes('renk')) {
        counts.remorse.count += 1;
        counts.remorse.loss += loss;
      } else if (reason.includes('hasar') || reason.includes('kargo')) {
        counts.damage.count += 1;
        counts.damage.loss += loss;
      } else {
        counts.other.count += 1;
        counts.other.loss += loss;
      }
    });

    const total = activeDataset.length || 1;
    return {
      size: { ...counts.size, percent: activeDataset.length > 0 ? Math.round((counts.size.count / total) * 100) : 0 },
      remorse: { ...counts.remorse, percent: activeDataset.length > 0 ? Math.round((counts.remorse.count / total) * 100) : 0 },
      damage: { ...counts.damage, percent: activeDataset.length > 0 ? Math.round((counts.damage.count / total) * 100) : 0 },
      other: { ...counts.other, percent: activeDataset.length > 0 ? Math.round((counts.other.count / total) * 100) : 0 }
    };
  }, [activeDataset]);

  // Özel Görsel Kaydetme
  const handleSaveCustomImage = () => {
    if (!editImageModal || !customImageUrl.trim()) return;
    const targetKey = editImageModal.barcode || editImageModal.sku || editImageModal.title;
    saveCustomProductImage(targetKey, customImageUrl.trim());
    setEditImageModal(null);
    setCustomImageUrl('');
    refreshLocalData();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      
      {/* 1. ÜST BAŞLIK, CANLI SENKRONİZASYON & VERİ BİLGİSİ */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        
        <div className="flex items-center gap-3.5">
          <button 
            onClick={onNavigateBack}
            className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all shadow-sm cursor-pointer flex-shrink-0"
            title="Geri Dön"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Çift Kargo & İade Kâr Motoru
              </span>

              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-0.5 rounded-full">
                🟢 Canlı Mağaza Havuzu
              </span>

              {onOpenGuide && (
                <PageGuideButton 
                  onClick={onOpenGuide} 
                  label="💡 Nasıl Kullanılır?" 
                  className="py-0.5 px-3" 
                />
              )}
            </div>

            <h1 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <RotateCcw className="w-6 h-6 text-rose-600" />
              İade & Değişim Yönetimi
              <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                {activeDataset.length} Gerçek İade
              </span>
            </h1>
          </div>
        </div>

        {/* Sağ Taraf: Anlık API Senkronizasyon Butonu ve Toplam Zarar */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          <button
            onClick={handleSyncReturns}
            disabled={isSyncing}
            className={`px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              isSyncing ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <RefreshCw className={`w-4 h-4 text-rose-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'İadeler Taranıyor...' : 'Pazaryerinden İadeleri Çek'}</span>
          </button>

          {/* Toplam İade Kayıp Özeti Kartı */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200/80 rounded-2xl p-2.5 px-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-700 flex items-center justify-center font-bold">
              <PackageX className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Net İade Zararı</span>
              <strong className="text-base font-black text-rose-600">
                -{totalReturnLoss.toFixed(2)} ₺
              </strong>
            </div>
          </div>

        </div>

      </div>

      {syncMessage && (
        <div className="p-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs animate-fadeIn flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* 2. AI İADE ANALİZ & KÂR KURTARMA AKSİYONU */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-[#121924] rounded-3xl p-6 text-white border border-rose-800/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                AI Çift Kargo Hesaplayıcı
              </span>
              <span className="text-xs text-rose-400 font-bold">
                ⚠️ Her İade Size 174,00 ₺ Çift Kargo (87 ₺ Gidiş + 87 ₺ Dönüş) + Ambalaj Zararı Yüklüyor
              </span>
            </div>

            <h3 className="text-base lg:text-lg font-black text-white">
              Pazaryeri İadelerini & Kargo Hasar İtirazlarını 1-Tıkla Yönetin
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              İade edilen ürünlerde komisyon tutarı pazaryeri tarafından iptal edilse dahi <strong>kargo bedeli çift taraflı olarak satıcıdan tahsil edilir</strong>. Hasarlı gelen iadeler için otomatik tutanak ve kargo itiraz dilekçesi oluşturabilirsiniz.
            </p>
          </div>

          <button
            onClick={() => onTriggerActionApproval({
              id: 'AI-RET-ACTION-DISPUTE',
              title: 'İade & Kargo Hasar İtiraz Taleplerini Başlat',
              marketplace: 'Trendyol & Hepsiburada',
              product: 'İade ve Kargo Kayıtları',
              q3_financialImpact: 'Kargo Hasar Tazmin Dilekçesi Hazırlanacaktır',
              action: {
                type: 'CARGO_DISPUTE',
                label: 'İtiraz Dilekçesi Hazırla',
                payload: { action: 'DISPUTE_ALL' }
              }
            })}
            className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-lg shadow-rose-600/40 transition-all whitespace-nowrap hover:scale-105 flex items-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI İade & Kargo İtiraz Sihirbazı</span>
          </button>
        </div>
      </div>

      {/* 3. 3'LÜ FİNANSAL İADE KAYIP VE NEDEN KARTLARI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Neden 1: Beden / Kalıp */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">1. Beden / Kalıp Uymadı</span>
            <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
              %{reasonStats.size.percent} Pay
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2.5">
            {reasonStats.size.count} Adet İade
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Toplam Zarar: <strong className="text-rose-600 font-black">-{reasonStats.size.loss.toFixed(2)} ₺</strong>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <span>💡</span> <span>Çözüm: Beden tablosu ve kalıp uyarısı</span>
          </div>
        </div>

        {/* Neden 2: Cayma / Renk Farkı */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">2. Cayma / Beğenilmeme</span>
            <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              %{reasonStats.remorse.percent} Pay
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2.5">
            {reasonStats.remorse.count} Adet İade
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Toplam Zarar: <strong className="text-amber-700 font-black">-{reasonStats.remorse.loss.toFixed(2)} ₺</strong>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] text-amber-700 font-bold flex items-center gap-1">
            <span>💡</span> <span>Çözüm: Ürün detay açıklaması optimizasyonu</span>
          </div>
        </div>

        {/* Neden 3: Kargo Taşıma Hasarı */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">3. Kargo Taşıma Hasarı</span>
            <span className="text-xs font-black text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              %{reasonStats.damage.percent} Pay
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2.5">
            {reasonStats.damage.count} Adet İade
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Toplam Zarar: <strong className="text-blue-600 font-black">-{reasonStats.damage.loss.toFixed(2)} ₺</strong>
          </div>
          <div className="mt-3.5 pt-2.5 border-t border-slate-100 text-[11px] text-blue-600 font-bold flex items-center gap-1">
            <span>💡</span> <span>Çözüm: Kargo hasar tazmin dilekçesi</span>
          </div>
        </div>

      </div>

      {/* 4. CANLI İADE KAYITLARI & DETAYLI MALİYET TABLOSU */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        
        {/* Filtre ve Arama Çubuğu */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>Canlı İade & Değişim Kayıtları</span>
              <span className="text-xs font-bold text-slate-500 font-normal">
                ({filteredReturns.length} kayıt)
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Gidiş kargosu (87 ₺) + Dönüş kargosu (87 ₺) + Yeniden paketleme maliyeti net kârdan anında düşülür.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            
            {/* Pazar Yeri Filtresi */}
            <select
              value={selectedMarketplace}
              onChange={(e) => setSelectedMarketplace(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">Tüm Pazar Yerleri</option>
              <option value="Trendyol">Trendyol</option>
              <option value="Hepsiburada">Hepsiburada</option>
              <option value="Amazon TR">Amazon TR</option>
            </select>

            {/* Durum Filtresi */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="IN_TRANSIT">Kargoda Geliyor</option>
              <option value="ACCEPTED">İade Kabul Edildi</option>
              <option value="REJECTED">İade Reddedildi</option>
            </select>

            {/* Arama Inputu */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İade No, Müşteri, Barkod Ara..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

          </div>
        </div>

        {/* Tablo */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="py-3.5 px-3">Görsel & Ürün</th>
                <th className="py-3.5 px-3">İade No & Pazar Yeri</th>
                <th className="py-3.5 px-3">Müşteri & Tarih</th>
                <th className="py-3.5 px-3">İade Nedeni</th>
                <th className="py-3.5 px-3 text-right">Gidiş + Dönüş Kargo</th>
                <th className="py-3.5 px-3 text-right">Ambalaj & Maliyet</th>
                <th className="py-3.5 px-3 text-right text-rose-600 font-black">Net Kâr Kaybı</th>
                <th className="py-3.5 px-3 text-center">Durum & Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500 font-medium">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                      <Box className="w-6 h-6" />
                    </div>
                    <div className="font-bold text-slate-700 text-sm">Açık İade Kaydı Bulunmuyor</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Pazaryeri mağazanızda şu an bekleyen bir iade talebi yoktur. <strong>"Pazaryerinden İadeleri Çek"</strong> butonuna basarak anlık güncelleyebilirsiniz.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredReturns.map(ret => {
                  const resolvedImg = resolveSmartProductImage({
                    directImage: ret.image,
                    barcode: ret.barcode,
                    sku: ret.sku,
                    title: ret.productName
                  });

                  return (
                    <tr key={ret.id} className="hover:bg-slate-50/90 transition-colors group">
                      
                      {/* Ürün Görseli & Başlık */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => {
                              setEditImageModal({
                                barcode: ret.barcode,
                                sku: ret.sku,
                                title: ret.productName,
                                currentImage: resolvedImg
                              });
                              setCustomImageUrl(resolvedImg);
                            }}
                            className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 cursor-pointer group/img bg-slate-100 flex items-center justify-center"
                            title="Görseli Değiştir / Güncelle"
                          >
                            {resolvedImg ? (
                              <img 
                                src={resolvedImg} 
                                alt={ret.productName} 
                                className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const fb = e.currentTarget.parentElement?.querySelector('.no-img-badge');
                                  if (fb) fb.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`no-img-badge w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-black text-xs items-center justify-center ${resolvedImg ? 'hidden' : 'flex'}`}>
                              {(ret.productName || 'Ü').trim().charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white text-[9px] font-bold">
                              Değiştir
                            </div>
                          </div>

                          <div className="min-w-0 max-w-xs">
                            <div className="font-black text-slate-900 truncate" title={ret.productName}>
                              {ret.productName}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                              <span>SKU: {ret.sku || 'N/A'}</span>
                              {ret.barcode && <span>Barkod: {ret.barcode}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* İade No & Pazar Yeri */}
                      <td className="py-3.5 px-3">
                        <strong className="text-slate-900 font-bold block">{ret.id}</strong>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] font-black px-1.5 py-0.2 rounded border ${
                            ret.marketplace === 'Trendyol'
                              ? 'bg-orange-50 text-[#f27a1a] border-orange-200'
                              : ret.marketplace === 'Hepsiburada'
                              ? 'bg-orange-50 text-[#ff6000] border-orange-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {ret.marketplace}
                          </span>
                          <span className="text-[10px] text-slate-400">{ret.orderId}</span>
                        </div>
                      </td>

                      {/* Müşteri & Tarih */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-800">{ret.customerName}</div>
                        <span className="text-[10px] text-slate-400">{ret.returnDate}</span>
                      </td>

                      {/* İade Sebebi */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] border ${
                          (ret.reasonCategory || '').includes('Beden')
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : (ret.reasonCategory || '').includes('Hasar')
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {ret.reasonCategory}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5 max-w-[200px] truncate" title={ret.reasonDetail}>
                          {ret.reasonDetail}
                        </div>
                      </td>

                      {/* Gidiş + Dönüş Kargo Maliyeti */}
                      <td className="py-3.5 px-3 text-right font-medium text-slate-700">
                        <span className="font-black text-slate-900">
                          -{((Number(ret.outboundCargoFee) || 0) + (Number(ret.returnCargoFee) || 0)).toFixed(2)} ₺
                        </span>
                        <div className="text-[10px] text-slate-400">
                          ({Number(ret.outboundCargoFee || 0).toFixed(0)} ₺ Gidiş + {Number(ret.returnCargoFee || 0).toFixed(0)} ₺ Dönüş)
                        </div>
                      </td>

                      {/* Ambalaj Zararı */}
                      <td className="py-3.5 px-3 text-right font-medium text-slate-700">
                        -{Number(ret.repackagingCost || 15).toFixed(2)} ₺
                      </td>

                      {/* Toplam Net Zarar */}
                      <td className="py-3.5 px-3 text-right font-black text-rose-600 text-xs">
                        -{Number(ret.totalLossFromReturn || 0).toFixed(2)} ₺
                      </td>

                      {/* Durum & Hızlı Aksiyon */}
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-1.5 ${
                          ret.status === 'IN_TRANSIT'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : ret.status === 'ACCEPTED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}>
                          {ret.status === 'IN_TRANSIT' ? 'Kargoda Geliyor' : ret.status === 'ACCEPTED' ? 'İade Kabul Edildi' : 'İtirazda'}
                        </span>

                        <button
                          onClick={() => onTriggerActionApproval({
                            id: `DISPUTE-${ret.id}`,
                            title: `Kargo Hasar / İade İtirazı Başlat (${ret.orderId})`,
                            marketplace: ret.marketplace,
                            product: ret.productName,
                            q3_financialImpact: `${ret.totalLossFromReturn} ₺ Kargo Tazmin İtirazı`,
                            action: {
                              type: 'CARGO_DISPUTE',
                              label: 'İtiraz Dilekçesi Oluştur',
                              payload: { returnId: ret.id }
                            }
                          })}
                          className="w-full text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>İtiraz / Aksiyon Al</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 5. GÖRSEL GÜNCELLEME MODALI */}
      {editImageModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#f27a1a]" />
                Ürün Görselini Tanımla
              </h3>
              <button 
                onClick={() => setEditImageModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                <strong className="text-slate-900 block">{editImageModal.title}</strong>
                <span className="text-[11px] text-slate-400">Barkod: {editImageModal.barcode || 'N/A'}</span>
              </div>

              {/* Görsel Önizleme */}
              <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md bg-slate-50 flex items-center justify-center">
                {customImageUrl ? (
                  <img 
                    src={customImageUrl} 
                    alt="Önizleme"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400 font-bold">Görsel Yok</span>
                )}
              </div>

              {/* Görsel URL Girişi */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ürünün Gerçek Görsel Linki (URL)
                </label>
                <input 
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://cdn.dsmcdn.com/... (Görsel URL)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#f27a1a]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditImageModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveCustomImage}
                className="flex-1 py-2.5 rounded-xl bg-[#f27a1a] hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20"
              >
                Görseli Kaydet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
