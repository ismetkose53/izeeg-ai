import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Building2, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Save,
  Check,
  Store,
  Layers,
  LogOut,
  AlertCircle,
  Database
} from 'lucide-react';
import { loginUser, getCurrentUser, switchUserRole, saveCurrentUser } from '../services/authService';
import { IzeegLogo } from './IzeegLogo';
import confetti from 'canvas-confetti';

export function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  currentUser = {},
  onUpdateUser,
  onLogout,
  onResetToClean,
  onLoadDemoData,
  isDemoMode = false,
  ordersCount = 0,
  productsCount = 0,
  cargoLeaksCount = 0
}) {
  const [authMode, setAuthMode] = useState(currentUser?.isLoggedIn ? 'profile' : 'login'); // 'profile' | 'login' | 'register' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.isLoggedIn) {
      setAuthMode('profile');
      setStoreName(currentUser.storeName || 'yumey concept');
      setOwnerName(currentUser.ownerName || 'İsmet Köse');
      setEmail(currentUser.email || 'ismetnote2@gmail.com');
      setPhone(currentUser.phone || '0543 697 07 55');
      setTaxNumber(currentUser.taxNumber || '1234567890');
      setSellerId(currentUser.sellerId || '104829');
    } else {
      setAuthMode('login');
      setEmail('');
      setPassword('');
      setStoreName('');
      setPhone('');
      setOwnerName('');
    }
    setErrorMessage('');
    setSuccessMessage('');
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!storeName.trim()) {
      setErrorMessage('Lütfen mağaza adınızı giriniz.');
      return;
    }

    const updatedUser = {
      ...currentUser,
      storeName: storeName.trim(),
      ownerName: ownerName.trim() || 'Mağaza Sahibi',
      email: email.trim(),
      phone: phone.trim(),
      taxNumber: taxNumber.trim(),
      sellerId: sellerId.trim(),
      isLoggedIn: true
    };

    saveCurrentUser(updatedUser);
    if (onUpdateUser) onUpdateUser(updatedUser);
    setSuccessMessage('✅ Profil ve mağaza bilgileriniz başarıyla güncellendi.');
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (authMode === 'admin') {
      const cleanKey = (adminKey || '').trim();
      if (cleanKey === 'krobaba53' || cleanKey === 'admin123' || cleanKey === 'ismet2026') {
        const res = switchUserRole('admin');
        if (onLoginSuccess) onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage('Geçersiz Kurucu / Admin Anahtarı!');
      }
      return;
    }

    if (!email) {
      setErrorMessage('Lütfen e-posta adresinizi giriniz.');
      return;
    }

    const res = loginUser(email, password);
    if (res.success) {
      if (onLoginSuccess) onLoginSuccess(res.user);
      onClose();
    } else {
      setErrorMessage(res.message || 'Giriş yapılamadı.');
    }
  };

  const handleResetDataClick = () => {
    if (onResetToClean) {
      onResetToClean();
      setSuccessMessage('🧹 Tüm deneme verileri temizlendi. Sıfır verili canlı satış modu devrede.');
      confetti({ particleCount: 70, spread: 70 });
      setTimeout(() => setSuccessMessage(''), 3500);
    }
  };

  const handleLoadDemoClick = () => {
    if (onLoadDemoData) {
      onLoadDemoData();
      setSuccessMessage('✨ Demo test verileri yüklendi.');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn font-sans overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-white border border-slate-300 p-5 sm:p-7 shadow-2xl overflow-hidden my-auto">
        
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tepe Logo & Başlık */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <IzeegLogo size="lg" theme="light" showBadge={true} badgeText="AI" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {authMode === 'profile'
              ? '👤 Hesap & Mağaza Profili'
              : authMode === 'admin' 
              ? '👑 Kurucu & Süper Admin Girişi' 
              : authMode === 'register' 
              ? '7 Günlük Ücretsiz Deneme Başlat' 
              : 'Satıcı Paneline Giriş Yap'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'profile'
              ? 'Mağaza bilgilerinizi yönetin, deneme verilerini temizleyin ve canlı satış ayarlarınızı yapılandırın.'
              : authMode === 'admin'
              ? 'Yönetici anahtarınızı girerek tüm satıcıları ve IBAN ayarlarını yönetin.'
              : 'Trendyol, Hepsiburada ve e-ticaret kârlarınızı tek ekrandan yönetin.'}
          </p>
        </div>

        {/* Sekme Seçici */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold gap-1">
          {currentUser?.isLoggedIn && (
            <button
              type="button"
              onClick={() => { setAuthMode('profile'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'profile' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mağaza Profili</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'login' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {currentUser?.isLoggedIn ? 'Hesap Değiştir' : 'Giriş Yap'}
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'register' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Kayıt Ol
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('admin'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              authMode === 'admin' ? 'bg-slate-900 text-white shadow-sm font-black' : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Bildirim Mesajları */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* MOD 1: KULLANICI / MAĞAZA PROFİLİ (GİRİŞ YAPILMIŞSA) */}
        {authMode === 'profile' && (
          <div className="space-y-4 text-xs">
            
            {/* Canlı Durum & Sıfır Veri Bilgi Kartı */}
            <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isDemoMode 
                ? 'bg-amber-50/80 border-amber-200 text-amber-900' 
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow ${
                  isDemoMode ? 'bg-amber-500' : 'bg-emerald-600'
                }`}>
                  {isDemoMode ? '🧪' : '🟢'}
                </div>
                <div>
                  <div className="font-black text-xs flex items-center gap-1.5">
                    <span>{isDemoMode ? 'Demo / Simülasyon Modu Aktif' : 'Canlı Satış Modu Devrede (0 Deneme Verisi)'}</span>
                  </div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    {isDemoMode 
                      ? 'Örnek test siparişleri ve ürünleri görüntüleniyor.' 
                      : `Sistem canlı: ${ordersCount} Sipariş, ${productsCount} Ürün, ${cargoLeaksCount} Desi Kaçağı.`}
                  </div>
                </div>
              </div>

              {/* Temizle / Sıfırla Butonu */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetDataClick}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Tüm deneme ve test siparişlerini silip sıfırdan temiz başlatır"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Deneme Verilerini Temizle</span>
                </button>
              </div>
            </div>

            {/* Profil Düzenleme Formu */}
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mağaza Adınız</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Örn: yumey concept"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Yetkili / Satıcı Adı</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Örn: İsmet Köse"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">E-Posta Adresi</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ismetnote2@gmail.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Telefon Numarası</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0543 697 07 55"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Trendyol Satıcı (Cari) ID</label>
                  <div className="relative">
                    <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={sellerId}
                      onChange={(e) => setSellerId(e.target.value)}
                      placeholder="Örn: 104829"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vergi No / T.C. Kimlik</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      placeholder="1234567890"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                    />
                  </div>
                </div>

              </div>

              {/* Alt Butonlar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {!isDemoMode && (
                    <button
                      type="button"
                      onClick={handleLoadDemoClick}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Test için örnek siparişler yükler"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Demo Yükle</span>
                    </button>
                  )}

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Çıkış</span>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#f27a1a] to-pink-600 hover:opacity-95 text-white rounded-xl font-black text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </form>

          </div>
        )}

        {/* MOD 2: GİRİŞ / KAYIT / ADMIN FORMU */}
        {authMode !== 'profile' && (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {authMode === 'admin' ? (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Kurucu / Admin Giriş Anahtarı</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                    autoFocus
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span>Yalnızca yetkili sistem yöneticileri ve kurucu erişimi içindir.</span>
                </p>
              </div>
            ) : (
              <>
                {authMode === 'register' && (
                  <>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Mağaza Adınız</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="Örn: Trend Butik A.Ş."
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Telefon Numaranız</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="05XX XXX XX XX"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-slate-700 font-bold mb-1">E-Posta Adresi</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@magazaniz.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Şifre</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#f27a1a]"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#f27a1a] to-pink-600 hover:opacity-95 text-white rounded-xl font-black text-xs shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>
                {authMode === 'admin' 
                  ? '👑 Süper Admin Paneline Giriş Yap' 
                  : authMode === 'register' 
                  ? '🚀 7 Günlük Denemeyi Başlat' 
                  : 'Panele Giriş Yap'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Alt Güvenlik Notu */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-Bit SSL Şifreli Güvenli Bağlantı</span>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
