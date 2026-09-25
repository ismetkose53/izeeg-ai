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

function computeAuthHash(str) {
  let hash1 = 0x811c9dc5;
  let hash2 = 5381;
  const salted = "izeeg_salt_9841_" + (str || '') + "_shield_2026";
  for (let i = 0; i < salted.length; i++) {
    const code = salted.charCodeAt(i);
    hash1 ^= code;
    hash1 = (hash1 * 0x01000193) >>> 0;
    hash2 = (((hash2 << 5) + hash2) + code) >>> 0;
  }
  return hash1.toString(16) + hash2.toString(16);
}

const ADMIN_HASHES = new Set([
  'b80720588337855b', // Hashed credentials
  'dc1e2c0854b50520'
]);

// Giriş Yap
export function loginUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, message: 'Lütfen e-posta adresinizi ve şifrenizi giriniz.' };
  }

  // Kurucu & Süper Admin Güvenli Giriş Kontrolü
  const isAdminEmail = (
    cleanEmail === 'ismetnote2@gmail.com' || 
    cleanEmail === 'ismet@izeeg.com' || 
    cleanEmail === 'admin@izeeg.com' ||
    cleanEmail === 'admin'
  );

  if (isAdminEmail) {
    const inputHash = computeAuthHash(cleanPass);
    if (ADMIN_HASHES.has(inputHash)) {
      const adminUser = {
        id: 'ADMIN-001',
        storeName: '👑 izeeg Kurucu & Süper Admin',
        ownerName: 'İsmet Köse',
        email: cleanEmail.includes('@') ? cleanEmail : 'ismetnote2@gmail.com',
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
    } else {
      return { success: false, message: 'Yönetici şifresi hatalı. Lütfen kurucu şifrenizi doğru giriniz.' };
    }
  }

  // Normal Satıcı Girişi (Şifre en az 4 karakter olmalı)
  if (cleanPass.length < 4) {
    return { success: false, message: 'Şifreniz en az 4 karakterden oluşmalıdır.' };
  }

  const merchantUser = {
    id: `USR-${Date.now().toString().slice(-6)}`,
    storeName: 'E-Ticaret Mağazam',
    ownerName: 'Mağaza Yöneticisi',
    email: cleanEmail,
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

// Rol Değiştirme / Sıfırlama
export function switchUserRole(targetRole) {
  const current = getCurrentUser();
  if (targetRole === 'admin') {
    if (current.role === 'admin' && current.isLoggedIn) {
      return { success: true, user: current };
    }
    return { success: false, message: 'Yönetici yetkisi için lütfen kurucu girişi yapınız.' };
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

