import React, { useState } from 'react';
import { 
  Building2, 
  Store, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  ShieldCheck, 
  Layers, 
  HelpCircle,
  TrendingUp,
  CreditCard,
  Key,
  X,
  Zap,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerUserAsync, saveCurrentUser } from '../services/authService';

export function OnboardingWizardModal({ isOpen, onClose, onCompleteSetup }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: İşletme, 2: Kullanım, 3: Plan, 4: Bağlantı

  // 1. Adım State'leri (İşletme)
  const [storeName, setStoreName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // 2. Adım State'leri (Satış Kanalları & Kullanım Amacı)
  const [selectedChannels, setSelectedChannels] = useState(['Trendyol', 'Hepsiburada']);
  const [selectedGoals, setSelectedGoals] = useState(['Net kârı görmek', 'Ödemeleri takip etmek']);

  // 3. Adım State'leri (Plan Seçimi)
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlan, setSelectedPlan] = useState('ODAK'); // 'ODAK' | 'PANORAMA' | 'ZIRVE'

  // 4. Adım State'leri (API Entegrasyonu / Mağaza Bağlantısı)
  const [connectOption, setConnectOption] = useState('trendyol'); // 'trendyol' | 'hepsiburada' | 'demo'
  const [trendyolSellerId, setTrendyolSellerId] = useState('');
  const [trendyolApiKey, setTrendyolApiKey] = useState('');
  const [trendyolApiSecret, setTrendyolApiSecret] = useState('');
  const [hepsiburadaMerchantId, setHepsiburadaMerchantId] = useState('');
  const [hepsiburadaSecretKey, setHepsiburadaSecretKey] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // Kanal Aç/Kapa
  const toggleChannel = (channel) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  // Hedef Aç/Kapa
  const toggleGoal = (goal) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  // İleri Adım Kontrolleri
  const handleNext = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !storeName.trim() || !password.trim()) {
        setErrorMessage('Lütfen tüm zorunlu alanları eksiksiz doldurunuz.');
        return;
      }
      if (password.length < 4) {
        setErrorMessage('Şifreniz en az 4 karakter olmalıdır.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedChannels.length === 0) {
        setErrorMessage('Lütfen en az bir satış kanalı seçiniz.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  // Geri Adım
  const handleBack = () => {
    setErrorMessage('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Kurulumu Tamamla & 14 Günlük Denemeyi Başlat
  const handleFinishOnboarding = async (useDemoDirect = false) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Kullanıcıyı Kaydet
      const regRes = await registerUserAsync({
        storeName: storeName.trim() || 'E-Ticaret Mağazam',
        fullName: fullName.trim() || 'Değerli Satıcı',
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password.trim()
      });

      const user = regRes.user || {
        id: `USR-${Date.now().toString().slice(-6)}`,
        storeName: storeName || 'E-Ticaret Mağazam',
        ownerName: fullName || 'Satıcı',
        email: email.toLowerCase(),
        phone: phone,
        role: 'merchant',
        plan: selectedPlan,
        planName: `${selectedPlan} Planı (14 Gün Ücretsiz Deneme)`,
        trialDaysLeft: 14,
        daysRemaining: 14,
        isLoggedIn: true,
        selectedChannels,
        selectedGoals
      };

      // 14 Gün Deneme Bilgisini Güncelle
      user.trialDaysLeft = 14;
      user.planName = `${selectedPlan} Planı (14 Gün Ücretsiz Deneme)`;
      user.plan = selectedPlan;
      user.selectedChannels = selectedChannels;
      user.selectedGoals = selectedGoals;
      saveCurrentUser(user);

      // 2. API Bilgileri Varsa Kaydet
      const coreCreds = JSON.parse(localStorage.getItem('izeeg_core_api_credentials') || '{}');
      if (trendyolSellerId || trendyolApiKey || trendyolApiSecret) {
        coreCreds.trendyol = {
          sellerId: trendyolSellerId,
          apiKey: trendyolApiKey,
          apiSecret: trendyolApiSecret,
          status: 'CONNECTED',
          lastSync: new Date().toISOString()
        };
      }
      if (hepsiburadaMerchantId || hepsiburadaSecretKey) {
        coreCreds.hepsiburada = {
          merchantId: hepsiburadaMerchantId,
          secretKey: hepsiburadaSecretKey,
          status: 'CONNECTED',
          lastSync: new Date().toISOString()
        };
      }
      localStorage.setItem('izeeg_core_api_credentials', JSON.stringify(coreCreds));

      if (useDemoDirect || connectOption === 'demo') {
        localStorage.setItem('izeeg_demo_mode', 'true');
      }

      confetti({ particleCount: 140, spread: 100, origin: { y: 0.5 } });
      setIsLoading(false);

      if (onCompleteSetup) {
        onCompleteSetup(user);
      }
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Kurulum sırasında bir hata oluştu.');
    }
  };

  const channelsList = [
    { id: 'Trendyol', label: 'Trendyol' },
    { id: 'Hepsiburada', label: 'Hepsiburada' },
    { id: 'N11', label: 'N11' },
    { id: 'Amazon Türkiye', label: 'Amazon Türkiye' },
    { id: 'Çiçeksepeti', label: 'Çiçeksepeti' },
    { id: 'Pazarama', label: 'Pazarama' },
    { id: 'Shopify', label: 'Shopify' },
    { id: 'WooCommerce', label: 'WooCommerce' },
    { id: 'Diğer', label: 'Diğer' }
  ];

  const goalsList = [
    { id: 'Net kârı görmek', label: 'Net kârı görmek' },
    { id: 'Ödemeleri takip etmek', label: 'Ödemeleri takip etmek' },
    { id: 'Kargo giderlerini azaltmak', label: 'Kargo giderlerini azaltmak' },
    { id: 'İadeleri takip etmek', label: 'İadeleri takip etmek' },
    { id: 'Stok ve maliyetleri yönetmek', label: 'Stok ve maliyetleri yönetmek' },
    { id: 'Müşteri davranışını anlamak', label: 'Müşteri davranışını anlamak' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-950 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-fadeIn my-auto text-slate-800 dark:text-zinc-100">
        
        {/* Üst Başlık & Adım Göstergesi (EZV Birebir Stili) */}
        <div className="border-b border-slate-100 dark:border-zinc-800 px-6 sm:px-8 py-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block mb-0.5">
              IZEEG AI
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white">
              Hesap kurulumu
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Size uygun raporları hazırlamak için birkaç kısa bilgi alın, planınızı seçin ve ilk mağazanızı bağlayın.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 dark:text-zinc-500">
              {currentStep} / 4
            </span>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Adım İlerleme Çubuğu */}
        <div className="px-6 sm:px-8 pt-4 pb-2 border-b border-slate-100 dark:border-zinc-800/60 bg-slate-50/50 dark:bg-zinc-900/30">
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
            {[
              { num: 1, label: 'İşletme' },
              { num: 2, label: 'Kullanım' },
              { num: 3, label: 'Plan' },
              { num: 4, label: 'Bağlantı' }
            ].map(step => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <div key={step.num} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : isCurrent 
                      ? 'bg-slate-900 text-white dark:bg-indigo-600' 
                      : 'bg-slate-200 text-slate-500 dark:bg-zinc-800'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : step.num}
                  </div>
                  <span className={`text-[11px] font-bold truncate ${
                    isCurrent ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-zinc-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Alanı (İki Kolonlu: Sol Form, Sağ Bilgi Kartı) */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sol Kolon: Form İçeriği */}
          <div className="lg:col-span-8 space-y-5">
            
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-400 animate-shake flex items-center gap-2">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            {/* ADIM 1: İŞLETME BİLGİLERİ */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">İşletme ve Mağaza Bilgileri</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">14 günlük ücretsiz deneme hesabınızı oluşturmak için bilgilerinizi giriniz.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                      Mağaza veya Şirket Adı *
                    </label>
                    <div className="relative">
                      <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="text"
                        name="iz_onb_store"
                        autoComplete="off"
                        data-lpignore="true"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Örn: Butik Moda Tekstil Ltd."
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-zinc-950 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                      Yetkili Adı Soyadı *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="text"
                        name="iz_onb_fullname"
                        autoComplete="off"
                        data-lpignore="true"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Örn: Ahmet Yılmaz"
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-zinc-950 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                      Telefon Numarası *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="tel"
                        name="iz_onb_phone"
                        autoComplete="off"
                        data-lpignore="true"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Örn: 0532 000 00 00"
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-zinc-950 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                      E-posta Adresi (Giriş için) *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="email"
                        name="iz_onb_email"
                        autoComplete="new-password"
                        data-lpignore="true"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Örn: ahmet@magaza.com"
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-zinc-950 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                      Giriş Şifresi *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input 
                        type="password"
                        name="iz_onb_secret"
                        autoComplete="new-password"
                        data-lpignore="true"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="En az 4 karakter"
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-indigo-600 focus:bg-white dark:focus:bg-zinc-950 font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADIM 2: SATIŞ KANALLARI VE KULLANIM AMACI */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Satış kanalları ve kullanım amacı</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Birden fazla seçenek işaretleyebilirsiniz.</p>
                </div>

                {/* Satış Yaptığınız Kanallar */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-2">
                    Satış yaptığınız kanallar
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {channelsList.map(ch => {
                      const isSelected = selectedChannels.includes(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => toggleChannel(ch.id)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm' 
                              : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-slate-300'
                          }`}
                        >
                          <span>{ch.label}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-zinc-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Öncelikli Kullanım Amacı */}
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block mb-2">
                    Öncelikli kullanım amacı
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {goalsList.map(g => {
                      const isSelected = selectedGoals.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => toggleGoal(g.id)}
                          className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected 
                              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm' 
                              : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-slate-300'
                          }`}
                        >
                          <span>{g.label}</span>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-zinc-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ADIM 3: PLANINIZI SEÇİN */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Planınızı seçin</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Sipariş hacminize göre uygun planı işaretledik. İsterseniz değiştirebilirsiniz.</p>
                  </div>
                  {/* Aylık / Yıllık Toggle */}
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        billingCycle === 'monthly' ? 'bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
                      }`}
                    >
                      Aylık
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('yearly')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        billingCycle === 'yearly' ? 'bg-white dark:bg-zinc-800 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500'
                      }`}
                    >
                      Yıllık (%20 İndirim)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  
                  {/* Plan 1: Odak */}
                  <div 
                    onClick={() => setSelectedPlan('ODAK')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      selectedPlan === 'ODAK' 
                        ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-600/20' 
                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Odak</h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlan === 'ODAK' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-zinc-700'
                      }`}>
                        {selectedPlan === 'ODAK' && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-900/50 px-2 py-0.5 rounded-full inline-block mb-3">
                      Sipariş hacminize uygun
                    </span>
                    <div className="mb-3">
                      <strong className="text-xl font-black text-slate-950 dark:text-white">₺{billingCycle === 'monthly' ? '499,99' : '399,99'}</strong>
                      <span className="text-[10px] text-slate-400 block">aylık ödeme</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 border-t border-slate-100 dark:border-zinc-800 pt-2.5">
                      <p>• Ayda 1.000 sipariş</p>
                      <p>• 10.000 ürüne kadar</p>
                      <p className="text-indigo-600 font-bold">İlk 14 gün ücretsiz</p>
                    </div>
                  </div>

                  {/* Plan 2: Panorama */}
                  <div 
                    onClick={() => setSelectedPlan('PANORAMA')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      selectedPlan === 'PANORAMA' 
                        ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-600/20' 
                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Panorama</h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlan === 'PANORAMA' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-zinc-700'
                      }`}>
                        {selectedPlan === 'PANORAMA' && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full inline-block mb-3">
                      Büyüyen Mağazalar
                    </span>
                    <div className="mb-3">
                      <strong className="text-xl font-black text-slate-950 dark:text-white">₺{billingCycle === 'monthly' ? '699,90' : '559,90'}</strong>
                      <span className="text-[10px] text-slate-400 block">aylık ödeme</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 border-t border-slate-100 dark:border-zinc-800 pt-2.5">
                      <p>• Ayda 5.000 sipariş</p>
                      <p>• 20.000 ürüne kadar</p>
                      <p className="text-indigo-600 font-bold">İlk 14 gün ücretsiz</p>
                    </div>
                  </div>

                  {/* Plan 3: Zirve */}
                  <div 
                    onClick={() => setSelectedPlan('ZIRVE')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                      selectedPlan === 'ZIRVE' 
                        ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-600/20' 
                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Zirve</h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedPlan === 'ZIRVE' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-zinc-700'
                      }`}>
                        {selectedPlan === 'ZIRVE' && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-100/70 dark:bg-amber-950/50 px-2 py-0.5 rounded-full inline-block mb-3">
                      Yüksek Hacimli Satıcılar
                    </span>
                    <div className="mb-3">
                      <strong className="text-xl font-black text-slate-950 dark:text-white">₺{billingCycle === 'monthly' ? '999,90' : '799,90'}</strong>
                      <span className="text-[10px] text-slate-400 block">aylık ödeme</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-zinc-300 space-y-1 border-t border-slate-100 dark:border-zinc-800 pt-2.5">
                      <p>• Ayda 10.000+ sipariş</p>
                      <p>• 30.000 ürüne kadar</p>
                      <p className="text-indigo-600 font-bold">İlk 14 gün ücretsiz</p>
                    </div>
                  </div>

                </div>

                <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-2">
                  Denemeyi başlatmak için kart gerekmez. Deneme sonunda otomatik ödeme alınmaz.
                </p>
              </div>
            )}

            {/* ADIM 4: MAĞAZA BAĞLANTISI (API) */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">İlk Mağazanızı Bağlayın</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Pazaryeri API bilgilerinizi girerek gerçek verilerinizi anında içeri aktarabilirsiniz. Dilerseniz önce demo verilerle de başlayabilirsiniz.</p>
                </div>

                {/* Bağlantı Seçeneği */}
                <div className="flex gap-2 border-b border-slate-200 dark:border-zinc-800 pb-2">
                  <button
                    type="button"
                    onClick={() => setConnectOption('trendyol')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      connectOption === 'trendyol' ? 'bg-[#f27a1a] text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600'
                    }`}
                  >
                    Trendyol API
                  </button>
                  <button
                    type="button"
                    onClick={() => setConnectOption('hepsiburada')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      connectOption === 'hepsiburada' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600'
                    }`}
                  >
                    Hepsiburada API
                  </button>
                  <button
                    type="button"
                    onClick={() => setConnectOption('demo')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      connectOption === 'demo' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600'
                    }`}
                  >
                    Demo Moduyla Başla
                  </button>
                </div>

                {connectOption === 'trendyol' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                        Trendyol Satıcı ID (Supplier ID)
                      </label>
                      <input 
                        type="text"
                        value={trendyolSellerId}
                        onChange={(e) => setTrendyolSellerId(e.target.value)}
                        placeholder="Örn: 123456"
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                        Trendyol API Key
                      </label>
                      <input 
                        type="text"
                        value={trendyolApiKey}
                        onChange={(e) => setTrendyolApiKey(e.target.value)}
                        placeholder="API Anahtarı"
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                        Trendyol API Secret Key
                      </label>
                      <input 
                        type="password"
                        value={trendyolApiSecret}
                        onChange={(e) => setTrendyolApiSecret(e.target.value)}
                        placeholder="Gizli Anahtar"
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {connectOption === 'hepsiburada' && (
                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                        Hepsiburada Merchant ID
                      </label>
                      <input 
                        type="text"
                        value={hepsiburadaMerchantId}
                        onChange={(e) => setHepsiburadaMerchantId(e.target.value)}
                        placeholder="Örn: a1b2c3d4-..."
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-300 block mb-1">
                        Hepsiburada Servis Anahtarı (Secret Key)
                      </label>
                      <input 
                        type="password"
                        value={hepsiburadaSecretKey}
                        onChange={(e) => setHepsiburadaSecretKey(e.target.value)}
                        placeholder="Entegrasyon Servis Anahtarı"
                        className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {connectOption === 'demo' && (
                  <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs space-y-2">
                    <p className="font-bold text-indigo-950 dark:text-indigo-200">
                      💡 API anahtarınız yanınızda değil mi?
                    </p>
                    <p className="text-indigo-800/80 dark:text-indigo-300">
                      Şimdi gerçekçi demo mağaza verileriyle paneli hemen deneyimleyebilir, daha sonra ayarlar bölümünden istediğiniz an API bilgilerinizi bağlayabilirsiniz.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Alt Butonlar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Geri
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  Devam Et
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleFinishOnboarding(connectOption === 'demo')}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Kurulum Tamamlanıyor...' : '14 Günlük Denemeyi Başlat 🚀'}
                </button>
              )}
            </div>

          </div>

          {/* Sağ Kolon: Açıklama ve Neden Gerekli Kutucukları (EZV Birebir Tasarımı) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-slate-50 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
                BU ADIM NEDEN GEREKLİ?
              </h4>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                {currentStep === 1 && "Kişiselleştirilmiş panelinizi ve mağaza güvenlik anahtarlarınızı güvenle oluşturmak için temel iletişim bilgilerinizi alıyoruz."}
                {currentStep === 2 && "Seçimleriniz ilk açılışta ilgili raporları öne çıkarır ve pazar yeri kârlılık grafiklerinizi en optimize şekilde yapılandırır."}
                {currentStep === 3 && "Plan ve deneme koşullarını başlamadan önce açıkça karşılaştırabilir, kart bilgisi girmeden 14 gün boyunca tüm özellikleri test edebilirsiniz."}
                {currentStep === 4 && "Pazaryeri verilerinizin otomatik çekilerek net kâr, iade ve kargo analizlerinizin canlı hesaplanmasını sağlar."}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3">
                KURULUM SONUNDA
              </h4>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>İlk mağazanız doğrulanır</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Sipariş ve ürün aktarımı başlar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>Kârlılık ve iade raporlarınız hazırlanır</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
