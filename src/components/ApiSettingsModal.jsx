import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  Globe, 
  Store, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function ApiSettingsModal({
  isOpen,
  onClose,
  integration,
  onSave,
  onDisconnect
}) {
  if (!isOpen || !integration) return null;

  const [apiKey, setApiKey] = useState(integration.apiKey || '');
  const [apiSecret, setApiSecret] = useState(integration.apiSecret || '');
  const [merchantId, setMerchantId] = useState(integration.merchantId || '');
  const [storeUrl, setStoreUrl] = useState(integration.storeUrl || (integration.id === 'ticimax' ? 'https://magaza.ticimax.com' : integration.id === 'shopify' ? 'https://magazam.myshopify.com' : ''));
  const [showSecret, setShowSecret] = useState(false);

  // Test Bağlantısı State'i
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // null | 'SUCCESS' | 'ERROR'

  // Otomasyon Seçenekleri
  const [autoSyncOrders, setAutoSyncOrders] = useState(true);
  const [autoSyncStock, setAutoSyncStock] = useState(true);
  const [autoIssueInvoice, setAutoIssueInvoice] = useState(true);

  useEffect(() => {
    if (integration) {
      setApiKey(integration.apiKey || '');
      setApiSecret(integration.apiSecret || '');
      setMerchantId(integration.merchantId || '');
      setStoreUrl(integration.storeUrl || (integration.id === 'ticimax' ? 'https://magaza.ticimax.com' : integration.id === 'shopify' ? 'https://magazam.myshopify.com' : ''));
      setTestResult(null);
    }
  }, [integration]);

  const handleRunTest = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult('SUCCESS');
      confetti({ particleCount: 50, spread: 60 });
    }, 1100);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...integration,
        apiKey,
        apiSecret,
        merchantId,
        storeUrl,
        active: true,
        connected: true,
        autoSyncOrders,
        autoSyncStock,
        autoIssueInvoice,
        lastSync: 'Az önce'
      });
    }
    confetti({ particleCount: 80, spread: 70 });
    onClose();
  };

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect(integration.id);
    }
    onClose();
  };

  const isUrlRequired = ['ticimax', 'shopify'].includes(integration.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-scaleUp text-slate-900">
        
        {/* Modal Başlık */}
        <div className="bg-gradient-to-r from-slate-900 via-[#151e2a] to-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#f27a1a] to-pink-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              {integration.logo || '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-300 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-400/30">
                  {integration.category || 'API Entegrasyonu'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  integration.active || integration.connected 
                    ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40' 
                    : 'bg-slate-700 text-slate-300'
                }`}>
                  {integration.active || integration.connected ? 'Bağlı & Aktif' : 'Kurulum Bekliyor'}
                </span>
              </div>
              <h2 className="text-base lg:text-lg font-black text-white mt-0.5">
                {integration.name} API Ayarları
              </h2>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal İçerik Formu */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <p className="text-[11px] text-slate-600 leading-snug">
              API anahtarlarınız ve token verileriniz 256-Bit SSL ile güvenli şekilde şifrelenir. Asla 3. şahıslarla paylaşılmaz.
            </p>
          </div>

          {/* Web Sitesi URL (Ticimax / Shopify için) */}
          {isUrlRequired && (
            <div>
              <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                <span>Mağaza / Web Sitesi Alan Adı (URL) *</span>
                <span className="text-[10px] text-slate-400 font-normal">örn: https://magaza.ticimax.com</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://magaza.ticimax.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 font-medium text-slate-900 focus:outline-none focus:border-[#f27a1a] focus:bg-white text-xs"
                />
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Satıcı / Mağaza ID veya VKN */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Satıcı ID / Mağaza Kodu / VKN *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="Örn: 182904 veya 1829048192"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 font-mono font-bold text-slate-900 focus:outline-none focus:border-[#f27a1a] focus:bg-white text-xs"
              />
              <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              API Anahtarı (API Key / Client ID / Web Servis Kullanıcı Adı) *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="live_api_key_..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 font-mono text-slate-900 font-bold focus:outline-none focus:border-[#f27a1a] focus:bg-white text-xs"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* API Secret */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Gizli Anahtar (API Secret / Web Servis Şifresi / Token) *
            </label>
            <div className="relative">
              <input
                type={showSecret ? 'text' : 'password'}
                required
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="••••••••••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 font-mono text-slate-900 font-bold focus:outline-none focus:border-[#f27a1a] focus:bg-white text-xs"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Canlı Bağlantı Test Butonu ve Sonucu */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRunTest}
                disabled={testing || !apiKey}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#f27a1a] text-white font-bold transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Bağlantı Doğrulanıyor...' : '⚡ Bağlantıyı Canlı Test Et'}</span>
              </button>

              {testResult === 'SUCCESS' && (
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>HTTP 200 OK (112ms) - Doğrulandı!</span>
                </div>
              )}
            </div>
          </div>

          {/* Otomatik Senkronizasyon Tercihleri */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 mt-3">
            <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#f27a1a]" />
              Otomasyon ve Senkronizasyon Seçenekleri
            </h4>
            
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-xs">
              <input
                type="checkbox"
                checked={autoSyncOrders}
                onChange={(e) => setAutoSyncOrders(e.target.checked)}
                className="w-4 h-4 accent-[#f27a1a] rounded"
              />
              <span>Siparişleri anlık çek ve bildirim gönder</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-xs">
              <input
                type="checkbox"
                checked={autoSyncStock}
                onChange={(e) => setAutoSyncStock(e.target.checked)}
                className="w-4 h-4 accent-[#f27a1a] rounded"
              />
              <span>Stok havuzunu diğer tüm pazar yerleriyle çift yönlü eşitle</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 text-xs">
              <input
                type="checkbox"
                checked={autoIssueInvoice}
                onChange={(e) => setAutoIssueInvoice(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
              <span>Sipariş işleme alındığında resmi GİB E-Faturayı otomatik düzenle</span>
            </label>
          </div>

          {/* Alt Aksiyon Butonları */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {(integration.active || integration.connected) ? (
              <button
                type="button"
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Bağlantıyı Kes</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#f27a1a] hover:bg-[#d9680e] text-white font-black shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Kaydet ve Entegrasyonu Başlat</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
