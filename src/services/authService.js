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

export function clearUserSessionData() {
  try {
    const keysToRemove = [
      'izeeg_core_api_credentials',
      'izeeg_live_orders',
      'izeeg_live_products',
      'izeeg_live_cargo_leaks',
      'izeeg_live_returns',
      'izeeg_customer_returns_v2',
      'izeeg_marketplace_questions',
      'izeeg_marketplace_reviews',
      'izeeg_marketplace_incoming_invoices',
      'izeeg_live_notifications',
      'izeeg_demo_mode'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn("clearUserSessionData notice:", e);
  }
}

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
 * Bulut Kullanıcı Kaydı (Her cihazdan erişilebilir ortak DB + Yönetici Paneli Anlık Eşleme)
 */
export async function registerUserAsync({ storeName, fullName, email, phone, password }) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanName = (fullName || storeName || '').trim();
  const cleanStore = (storeName || cleanName || 'E-Ticaret Mağazam').trim();
  const cleanPhone = (phone || '').trim();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanName) {
    return { success: false, message: 'Lütfen ad soyad ve e-posta adresinizi giriniz.' };
  }

  if (cleanPass.length < 4) {
    return { success: false, message: 'Şifreniz en az 4 karakterden oluşmalıdır.' };
  }

  // Önceki kullanıcının verilerini tamamen sıfırla (İzolasyon Güvencesi)
  clearUserSessionData();

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
        password: cleanPass
      })
    });

    const json = await res.json().catch(() => ({}));
    if (res.ok && json.success && json.user) {
      saveCurrentUser(json.user);

      // Yönetici Paneli Yerel DB'sine Anında Kaydet
      try {
        const usersDb = JSON.parse(localStorage.getItem('izeeg_admin_users_db') || '[]');
        const idx = usersDb.findIndex(u => u.email && u.email.toLowerCase() === cleanEmail);
        if (idx >= 0) {
          usersDb[idx] = { ...usersDb[idx], ...json.user };
        } else {
          usersDb.unshift(json.user);
        }
        localStorage.setItem('izeeg_admin_users_db', JSON.stringify(usersDb));
      } catch {}

      return { success: true, user: json.user, message: json.message };
    } else {
      return { success: false, message: json.message || 'Kayıt işlemi gerçekleştirilemedi.' };
    }
  } catch (e) {
    console.warn("Cloud register fallback notice:", e);
    // Offline / Local Fallback
    const newUser = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      storeName: cleanStore,
      ownerName: cleanName,
      email: cleanEmail,
      phone: cleanPhone || '0532 000 00 00',
      passwordHash: computeAuthHash(cleanPass),
      role: 'merchant',
      plan: 'TRIAL',
      planName: '14 Günlük Ücretsiz Deneme',
      trialDaysLeft: 14,
      daysRemaining: 14,
      status: 'TRIAL',
      isLoggedIn: true,
      createdAt: new Date().toLocaleDateString('tr-TR'),
      paidUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
      activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
    };
    saveCurrentUser(newUser);

    try {
      const usersDb = JSON.parse(localStorage.getItem('izeeg_admin_users_db') || '[]');
      usersDb.unshift(newUser);
      localStorage.setItem('izeeg_admin_users_db', JSON.stringify(usersDb));
    } catch {}

    return { success: true, user: newUser };
  }
}

/**
 * Giriş Yap (Kesin Şifreli & Kayıt Doğrulamalı Bulut Sistemi)
 */
export async function loginUserAsync(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, message: 'Lütfen e-posta adresinizi ve şifrenizi giriniz.' };
  }

  // Önceki oturumun artıklarını temizle
  clearUserSessionData();

  // 1. Bulut Sunucusundan Doğrula & Verileri Getir
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

      // Yalnızca giriş yapan kullanıcının kendi verilerini cihaza aktar
      if (json.storeData) {
        if (json.storeData.credentials && Object.keys(json.storeData.credentials).length > 0) {
          try {
            localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(json.storeData.credentials));
          } catch {}
        }
        if (json.storeData.orders && Array.isArray(json.storeData.orders) && json.storeData.orders.length > 0) {
          try {
            localStorage.setItem('izeeg_live_orders', JSON.stringify(json.storeData.orders));
          } catch {}
        }
        if (json.storeData.products && Array.isArray(json.storeData.products) && json.storeData.products.length > 0) {
          try {
            localStorage.setItem('izeeg_live_products', JSON.stringify(json.storeData.products));
          } catch {}
        }
        if (json.storeData.cargoLeaks && Array.isArray(json.storeData.cargoLeaks) && json.storeData.cargoLeaks.length > 0) {
          try {
            localStorage.setItem('izeeg_live_cargo_leaks', JSON.stringify(json.storeData.cargoLeaks));
          } catch {}
        }
      }

      return { success: true, user, storeData: json.storeData || {}, message: json.message };
    } else {
      // Sunucu tarafından reddedildi
      return { success: false, message: json.message || 'Giriş bilgileri doğrulanamadı.' };
    }
  } catch (e) {
    console.warn("Cloud login network error, checking local fallback:", e);
    return loginUser(email, password);
  }
}

// Senkron / Offline Giriş Kontrolü (Kayıtsız Kullanıcı Girişi Kesinlikle Engellendi)
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
      return { success: false, message: 'Yönetici şifresi hatalıdır. Lütfen kurucu şifrenizi doğru giriniz.' };
    }
  }

  // Yerel veritabanında kullanıcı var mı kontrol et
  try {
    const saved = localStorage.getItem('izeeg_admin_users_db');
    const users = saved ? JSON.parse(saved) : [];
    const existing = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);

    if (!existing) {
      return { 
        success: false, 
        message: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı. Lütfen önce "Kayıt Ol" sekmesinden ücretsiz hesap oluşturunuz.' 
      };
    }

    const inputHash = computeAuthHash(cleanPass);
    if (existing.passwordHash) {
      if (inputHash !== existing.passwordHash) {
        return { success: false, message: 'Girdiğiniz şifre hatalıdır. Lütfen şifrenizi kontrol ediniz.' };
      }
    } else {
      // Şifre bağla
      existing.passwordHash = inputHash;
      localStorage.setItem('izeeg_admin_users_db', JSON.stringify(users));
    }

    const safeUser = { ...existing, isLoggedIn: true };
    saveCurrentUser(safeUser);
    return { success: true, user: safeUser };
  } catch {
    return { success: false, message: 'Kullanıcı doğrulanamadı. Lütfen kayıt olunuz.' };
  }
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
        orders: orders.slice(0, 200), // En güncel 200 sipariş
        products: products.slice(0, 400),
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
  clearUserSessionData();
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
