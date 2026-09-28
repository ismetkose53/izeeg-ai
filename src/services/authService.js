// izeeg Kullanıcı Oturumu, Rol & Yetkilendirme Servisi (Bulut & Çoklu Cihaz Senkronizasyonlu)

const AUTH_STORAGE_KEY = 'izeeg_current_auth_user';
const CREDENTIALS_KEY = 'izeeg_core_api_credentials';

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
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn("saveCurrentUser notice:", e);
  }
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
  'b80720588337855b',
  'dc1e2c0854b50520'
]);

/**
 * Bulut Kullanıcı Kaydı (Her cihazdan erişilebilir ortak DB)
 */
export async function registerUserAsync({ storeName, fullName, email, phone, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (fullName || storeName || '').trim();
  const cleanStore = (storeName || cleanName || 'E-Ticaret Mağazam').trim();
  const cleanPhone = (phone || '').trim();

  if (!cleanEmail || !cleanName) {
    return { success: false, message: 'Lütfen ad soyad ve e-posta adresinizi giriniz.' };
  }

  try {
    const res = await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'register',
        storeName: cleanStore,
        fullName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password
      })
    });

    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success && json.user) {
      saveCurrentUser(json.user);
      return { success: true, user: json.user, message: json.message };
    } else {
      return { success: false, message: json.message || 'Kayıt işlemi gerçekleştirilemedi.' };
    }
  } catch (e) {
    console.warn("Cloud register fallback to local:", e);
    // Offline / Local Fallback
    const newUser = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      storeName: cleanStore,
      ownerName: cleanName,
      email: cleanEmail,
      phone: cleanPhone || '0532 000 00 00',
      role: 'merchant',
      plan: 'TRIAL',
      planName: '7 Günlük Ücretsiz Deneme',
      trialDaysLeft: 7,
      daysRemaining: 7,
      isLoggedIn: true,
      activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
    };
    saveCurrentUser(newUser);
    return { success: true, user: newUser };
  }
}

/**
 * Giriş Yap (Hem Senkron hem Asenkron Bulut Destekli)
 */
export async function loginUserAsync(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, message: 'Lütfen e-posta adresinizi ve şifrenizi giriniz.' };
  }

  // 1. Önce Bulut Sunucusundan Doğrula & Verileri Getir
  try {
    const res = await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        email: cleanEmail,
        password: cleanPass
      })
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok && json.success && json.user) {
      const user = json.user;
      saveCurrentUser(user);

      // Buluttan gelen kayıtlı API anahtarlarını ve sipariş/ürün verilerini cihaza aktar
      if (json.storeData) {
        if (json.storeData.credentials) {
          try {
            const currentLocalCreds = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || '{}');
            const mergedCreds = { ...json.storeData.credentials, ...currentLocalCreds };
            localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(mergedCreds));
          } catch {}
        }
        if (json.storeData.orders && Array.isArray(json.storeData.orders) && json.storeData.orders.length > 0) {
          try {
            const localOrders = JSON.parse(localStorage.getItem('izeeg_live_orders') || '[]');
            if (localOrders.length === 0) {
              localStorage.setItem('izeeg_live_orders', JSON.stringify(json.storeData.orders));
            }
          } catch {}
        }
        if (json.storeData.products && Array.isArray(json.storeData.products) && json.storeData.products.length > 0) {
          try {
            const localProds = JSON.parse(localStorage.getItem('izeeg_live_products') || '[]');
            if (localProds.length === 0) {
              localStorage.setItem('izeeg_live_products', JSON.stringify(json.storeData.products));
            }
          } catch {}
        }
      }

      return { success: true, user, message: json.message };
    } else if (res.status === 401 || res.status === 400) {
      return { success: false, message: json.message || 'Giriş bilgileri hatalı.' };
    }
  } catch (e) {
    console.warn("Cloud login fallback to local check:", e);
  }

  // 2. Offline / Local Fallback Giriş Kontrolü
  return loginUser(email, password);
}

// Senkron Giriş (Geriye dönük tam uyumluluk)
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

  // Normal Satıcı Girişi
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

/**
 * Kullanıcı Verilerini Buluta Yedekle / Senkronize Et
 */
export async function syncUserDataToCloud() {
  const user = getCurrentUser();
  if (!user || !user.isLoggedIn || !user.email) return { success: false };

  try {
    const creds = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || '{}');
    const orders = JSON.parse(localStorage.getItem('izeeg_live_orders') || '[]');
    const products = JSON.parse(localStorage.getItem('izeeg_live_products') || '[]');
    const cargoLeaks = JSON.parse(localStorage.getItem('izeeg_live_cargo_leaks') || '[]');

    const res = await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save-user-data',
        userId: user.id,
        email: user.email,
        userProfile: user,
        credentials: creds,
        orders: orders.slice(0, 150), // En güncel 150 sipariş
        products: products.slice(0, 300),
        cargoLeaks: cargoLeaks
      })
    });

    const json = await res.json().catch(() => ({}));
    return { success: json.success || false };
  } catch (e) {
    return { success: false };
  }
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
  if (user.role === 'admin') return true;
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
    syncUserDataToCloud();
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
  syncUserDataToCloud();
  return updated;
}
