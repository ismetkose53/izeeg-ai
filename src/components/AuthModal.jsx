import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { loginUser, getCurrentUser, switchUserRole } from '../services/authService';
import { IzeegLogo } from './IzeegLogo';

export function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register' | 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

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
    if (onLoginSuccess) onLoginSuccess(res.user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-300 p-6 lg:p-8 shadow-2xl overflow-hidden">
        
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tepe Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <IzeegLogo size="lg" theme="light" showBadge={true} badgeText="AI" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {authMode === 'admin' 
              ? '👑 Kurucu & Süper Admin Girişi' 
              : authMode === 'register' 
              ? '7 Günlük Ücretsiz Deneme Başlat' 
              : 'Satıcı Paneline Giriş Yap'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'admin'
              ? 'Yönetici anahtarınızı girerek tüm satıcıları ve IBAN ayarlarını yönetin.'
              : 'Trendyol, Hepsiburada ve e-ticaret kârlarınızı tek ekrandan yönetin.'}
          </p>
        </div>

        {/* Sekme Seçici */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              authMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Kayıt Ol (Ücretsiz)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('admin'); setErrorMessage(''); }}
            className={`px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              authMode === 'admin' ? 'bg-slate-900 text-white shadow-sm' : 'text-amber-700 hover:text-amber-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Hata Mesajı */}
        {errorMessage && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {/* Form */}
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
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
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
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
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
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
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
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6000]"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#FF6000] to-[#FF3D00] hover:from-[#e55600] hover:to-[#e03600] text-white rounded-xl font-black text-xs shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2"
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

        {/* Alt Güvenlik Notu */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>256-Bit SSL Şifreli Güvenli Bağlantı</span>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
