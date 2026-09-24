// izeeg Kullanıcı Oturumu, Rol & Yetkilendirme Servisi

const AUTH_STORAGE_KEY = 'izeeg_current_auth_user';

const DEFAULT_CURRENT_USER = {
  id: null,
  storeName: 'Misafir Mağazası',
  ownerName: 'Ziyaretçi',
  email: '',
  phone: '',
  role: 'merchant',
  plan: 'TRIAL',
  planName: '7 Günlük Ücretsiz Deneme',
  trialDaysLeft: 7,
  daysRemaining: 7,
  isLoggedIn: false,
  activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
};

export function getCurrentUser() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CURRENT_USER;
  } catch (e) {
    return DEFAULT_CURRENT_USER;
  }
}

export function saveCurrentUser(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

// Giriş Yap
export function loginUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // Kurucu & Süper Admin Kontrolü (ismetnote2@gmail.com / krobaba53)
  if (
    cleanEmail === 'ismetnote2@gmail.com' || 
    cleanPass === 'krobaba53' || 
    cleanEmail.includes('admin') ||
    cleanEmail === 'ismet@izeeg.com'
  ) {
    const adminUser = {
      id: 'ADMIN-001',
      storeName: '👑 izeeg Kurucu & Süper Admin',
      ownerName: 'İsmet Köse',
      email: 'ismetnote2@gmail.com',
      phone: '0543 697 07 55',
      role: 'admin',
      plan: 'SUPER_ADMIN',
      planName: 'Süper Yönetici & Kurucu Lisansı',
      trialDaysLeft: 9999,
      daysRemaining: 9999,
      isLoggedIn: true,
      activeAddons: ['trendyol', 'hepsiburada', 'amazon', 'n11', 'ciceksepeti', 'parasut', 'bizimhesap', 'kolaybi', 'sovos', 'ticimax', 'woocommerce', 'shopify']
    };
    saveCurrentUser(adminUser);
    return { success: true, user: adminUser };
  }

  // Normal Satıcı Girişi
  const merchantUser = {
    id: `USR-${Date.now().toString().slice(-6)}`,
    storeName: 'E-Ticaret Mağazam',
    ownerName: 'Mağaza Yöneticisi',
    email: email,
    phone: '0532 000 00 00',
    role: 'merchant',
    plan: 'TRIAL',
    planName: '7 Günlük Ücretsiz Deneme',
    trialDaysLeft: 7,
    daysRemaining: 7,
    isLoggedIn: true,
    activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
  };
  saveCurrentUser(merchantUser);
  return { success: true, user: merchantUser };
}

// Hızlı Rol Değiştirme (Admin <-> Satıcı)
export function switchUserRole(targetRole) {
  const current = getCurrentUser();
  if (targetRole === 'admin') {
    return loginUser('admin@izeeg.com', 'admin');
  } else {
    const regular = {
      ...DEFAULT_CURRENT_USER,
      role: 'merchant'
    };
    saveCurrentUser(regular);
    return { success: true, user: regular };
  }
}

// Çıkış Yap
export function logoutUser() {
  const loggedOut = {
    ...DEFAULT_CURRENT_USER,
    isLoggedIn: false
  };
  saveCurrentUser(loggedOut);
  return loggedOut;
}

// Eklenti Lisansı Aktif mi?
export function isAddonActiveForUser(addonId) {
  const user = getCurrentUser();
  if (user.role === 'admin') return true; // Süper admin her şeye erişebilir
  return (user.activeAddons || []).includes(addonId);
}

// Kullanıcıya Eklenti Lisansı Tanımla
export function unlockAddonForCurrentUser(addonId) {
  const user = getCurrentUser();
  const currentAddons = user.activeAddons || [];
  if (!currentAddons.includes(addonId)) {
    const updated = {
      ...user,
      activeAddons: [...currentAddons, addonId]
    };
    saveCurrentUser(updated);
    return updated;
  }
  return user;
}

// Kullanıcıdan Eklenti Lisansını Kaldır
export function lockAddonForCurrentUser(addonId) {
  const user = getCurrentUser();
  const currentAddons = user.activeAddons || [];
  const updated = {
    ...user,
    activeAddons: currentAddons.filter(id => id !== addonId)
  };
  saveCurrentUser(updated);
  return updated;
}

