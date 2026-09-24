import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  RefreshCw, 
  Link2, 
  ExternalLink,
  ShieldCheck,
  PackageCheck,
  ChevronRight,
  Plus,
  FileSpreadsheet
} from 'lucide-react';
import { PRODUCT_MAPPINGS_DATA } from '../services/mockData';
import { ProductUploadModal } from './ProductUploadModal';
import confetti from 'canvas-confetti';
import { PageGuideButton } from './PageHelpGuideModal';

export function ProductMappingPage({ onNavigateBack, onOpenGuide, products = [], setProducts }) {
  const [mappings, setMappings] = useState(PRODUCT_MAPPINGS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleProductsImported = (newProducts) => {
    if (setProducts) {
      setProducts(prev => [...newProducts, ...prev]);
    }

    // Haritalama listesine de otomatik ekle
    const newMappings = newProducts.map(p => ({
      masterId: p.id,
      masterName: p.name,
      barcode: p.barcode,
      totalStockUnified: p.stock,
      matchConfidence: 100,
      needsUserReview: false,
      channels: [
        { platform: 'Trendyol', sku: p.id, stock: p.stock, price: p.sellingPrice, status: 'SYNCED' }
      ]
    }));

    setMappings(prev => [...newMappings, ...prev]);
    confetti({ particleCount: 90, spread: 80 });
  };

  const handleApproveMatch = (masterId) => {
    setMappings(prev => prev.map(m => {
      if (m.masterId === masterId) {
        return {
          ...m,
          matchConfidence: 100,
          needsUserReview: false,
          channels: m.channels.map(c => ({ ...c, status: 'SYNCED' }))
        };
      }
      return m;
    }));

    confetti({ particleCount: 70, spread: 60 });
  };

  const filtered = mappings.filter(m => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.masterName.toLowerCase().includes(q) ||
        m.barcode.includes(q) ||
        m.masterId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. Üst Başlık & Geri Dön */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateBack}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#f27a1a] bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Ortak Veri Modeli & Normalizasyon
              </span>
              <span className="text-xs text-slate-500 font-medium">Merkezi Stok & SKU Havuzu</span>
              {onOpenGuide && (
                <PageGuideButton 
                  onClick={onOpenGuide} 
                  label="💡 Nasıl Kullanılır?" 
                  className="py-1 px-3" 
                />
              )}
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <Link2 className="w-6 h-6 text-[#f27a1a]" />
              Çok Kanallı Ürün & SKU/Barkod Eşleştirici
            </h1>
          </div>
        </div>

        {/* Aksiyon Butonları & Arama */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>+ Excel / Trendyol Ürün Yükle</span>
          </button>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün, Barkod, SKU Ara..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f27a1a] shadow-sm"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* 2. Bilgilendirme Kartı */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f27a1a]/10 text-[#f27a1a] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Merkezi Stok Senkronizasyonu & Tekil Ürün Kataloğu
              </h3>
              <p className="text-xs text-slate-500">
                Trendyol, Hepsiburada, Amazon ve Shopify'daki farklı SKU isimlerine sahip aynı ürünleri barkod ve yapay zeka ile tek bir ana stok havuzunda birleştirin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Eşleşme Oranı</span>
              <strong className="text-sm font-black text-emerald-600">%98.4 Başarılı</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Eşleştirilmiş Ürün Kartları Listesi */}
      <div className="space-y-4">
        {filtered.map(item => (
          <div 
            key={item.masterId} 
            className={`bg-white border rounded-3xl p-5 shadow-sm transition-all ${
              item.needsUserReview ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
            }`}
          >
            
            {/* Üst Kısım: Ana Ürün Bilgisi */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                  📦
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{item.masterName}</h4>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>Barkod: <strong className="font-mono text-slate-800">{item.barcode}</strong></span>
                    <span>•</span>
                    <span>Toplam Ortak Stok: <strong className="text-slate-800">{item.totalStockUnified} Adet</strong></span>
                  </div>
                </div>
              </div>

              {/* Eşleşme Güven Skoru & Onay */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                  item.matchConfidence === 100 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {item.matchConfidence === 100 ? '✓ %100 Eşleşti' : `⚠️ %${item.matchConfidence} Güven (Onay Bekliyor)`}
                </span>

                {item.needsUserReview && (
                  <button
                    onClick={() => handleApproveMatch(item.masterId)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Eşleştirmeyi Onayla</span>
                  </button>
                )}
              </div>
            </div>

            {/* İnceleme Uyarısı Varsa */}
            {item.needsUserReview && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{item.reviewNote}</span>
              </div>
            )}

            {/* Alt Kısım: Kanallar Grid'i */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {item.channels.map((ch, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                    <strong className="text-slate-900 font-bold">{ch.marketplace}</strong>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      ch.status === 'SYNCED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ch.status === 'SYNCED' ? 'Bağlı' : 'Onay Bekliyor'}
                    </span>
                  </div>

                  <div className="space-y-1 pt-2">
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Kanal SKU:</span>
                      <span className="font-mono text-slate-800 font-bold">{ch.channelSku}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Kanal Fiyatı:</span>
                      <strong className="text-slate-900">{ch.price.toFixed(2)} ₺</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Senkronize Stok:</span>
                      <strong className="text-emerald-700 font-bold">{ch.stock} Adet</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Ürün & Excel Yükleme Modalı */}
      <ProductUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProductsImported={handleProductsImported}
      />

    </div>
  );
}
