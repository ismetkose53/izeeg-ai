// izeeg Süper Admin, Ödeme Altyapısı & Lisans Yönetim Servisi (Bulut Destekli)

const STORAGE_KEYS = {
  BANK_SETTINGS: 'izeeg_admin_bank_settings',
  SHOPIER_SETTINGS: 'izeeg_admin_shopier_settings',
  USERS_DB: 'izeeg_admin_users_db',
  PAYMENT_NOTIFICATIONS: 'izeeg_admin_payment_notifications',
  CONTACT_LEADS: 'izeeg_admin_contact_leads'
};

// 1. Varsayılan Banka & IBAN Bilgileri
const DEFAULT_BANK_SETTINGS = {
  bankName: 'Ziraat Bankası',
  accountHolder: 'İsmet Köse',
  iban: 'TR12 0001 0001 2345 6789 0001 01',
  branchCode: '1048 - Merkez Şube',
  fastEasyAddress: '0543 697 07 55 (Telefon ile Kolay Adres - İsmet Köse)',
  paymentNoteInstructions: 'Lütfen FAST / Havale açıklama kısmına SADECE yukarıdaki Sipariş / Referans Kodunuzu yazınız.',
  whatsappSupportNumber: '905436970755',
  discountRateHavale: 15
};

// 2. Varsayılan Shopier & Kartla Ödeme Linkleri
const DEFAULT_SHOPIER_SETTINGS = {
  standardMonthlyUrl: 'https://www.shopier.com/izeeg-standart-aylik',
  standardAnnualUrl: 'https://www.shopier.com/izeeg-standart-yillik',
  addonAmazonUrl: 'https://www.shopier.com/izeeg-addon-amazon',
  addonSovosUrl: 'https://www.shopier.com/izeeg-addon-sovos',
  addonShopifyUrl: 'https://www.shopier.com/izeeg-addon-shopify',
  isShopierActive: true,
  isHavaleActive: true
};

// 3. Başlangıç Müşteri & Lisans Veritabanı
const DEFAULT_USERS_DB = [
  {
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
    status: 'ACTIVE',
    createdAt: '01.01.2026',
    paidUntil: '01.01.2036',
    activeAddons: ['trendyol', 'hepsiburada', 'amazon', 'n11', 'ciceksepeti', 'parasut', 'bizimhesap', 'kolaybi', 'sovos', 'ticimax', 'woocommerce', 'shopify']
  },
  {
    id: 'USR-YUMEY01',
    storeName: 'Yumey Concept',
    ownerName: 'İsmet Köse',
    email: 'yumeyclub@gmail.com',
    phone: '0543 697 07 55',
    role: 'merchant',
    plan: 'TRIAL',
    planName: '7 Günlük Ücretsiz Deneme',
    price: 0,
    status: 'TRIAL',
    trialDaysLeft: 7,
    paidUntil: '06.10.2026',
    daysRemaining: 7,
    createdAt: '29.09.2026',
    activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce'],
    paymentMethod: 'TRIAL'
  }
];

const DEFAULT_PAYMENT_NOTIFICATIONS = [
  {
    id: 'NOTIF-101',
    userId: 'USR-849203',
    userStore: 'Kozmetik Vadisi',
    userName: 'Burak Şahin',
    planSelected: 'Standart Yıllık Lisans (%15 İndirimli + %15 Havale)',
    amount: 8457.50,
    referenceCode: 'IZG-849203',
    senderBank: 'Garanti BBVA',
    senderName: 'Burak Şahin',
    date: '22.09.2026 21:40',
    status: 'PENDING',
    slipNote: 'Ziraat hesabınıza FAST ile 8.457,50 TL gönderildi.'
  }
];

const DEFAULT_CONTACT_LEADS = [
  {
    id: 'LEAD-101',
    fullName: 'Caner Özdemir',
    storeName: 'Moda Dünyası',
    phone: '0533 456 78 90',
    subject: 'Canlı Demo & Kurulum',
    message: 'Trendyol ve Hepsiburada mağazalarımız için otomatik e-fatura ve desi kontrolünü test etmek istiyoruz.',
    date: '22.09.2026 22:15',
    status: 'NEW'
  }
];

// --- GETTER & SETTER METODLARI ---

export function getBankSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BANK_SETTINGS);
    return saved ? { ...DEFAULT_BANK_SETTINGS, ...JSON.parse(saved) } : DEFAULT_BANK_SETTINGS;
  } catch (e) {
    return DEFAULT_BANK_SETTINGS;
  }
}

export function saveBankSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.BANK_SETTINGS, JSON.stringify(settings));
    // Bulut senkronizasyonu
    fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save-admin-settings', bankSettings: settings })
    }).catch(() => {});
  } catch {}
}

export function getShopierSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SHOPIER_SETTINGS);
    return saved ? { ...DEFAULT_SHOPIER_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SHOPIER_SETTINGS;
  } catch (e) {
    return DEFAULT_SHOPIER_SETTINGS;
  }
}

export function saveShopierSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SHOPIER_SETTINGS, JSON.stringify(settings));
    // Bulut senkronizasyonu
    fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save-admin-settings', shopierSettings: settings })
    }).catch(() => {});
  } catch {}
}

export function getUsersDb() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    if (saved) {
      const list = JSON.parse(saved);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }

    // İlk defa açılıyorsa varsayılan listeyi kaydet ve dön
    saveUsersDb(DEFAULT_USERS_DB);
    return DEFAULT_USERS_DB;
  } catch (e) {
    return DEFAULT_USERS_DB;
  }
}

export function saveUsersDb(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  } catch {}
}

/**
 * Buluttan Canlı Kullanıcı Listesini Çeker (Tüm Cihazlardaki Kayıtlar)
 */
export async function fetchLiveUsersFromCloud() {
  try {
    const res = await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'admin-get-users' })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.users)) {
        saveUsersDb(json.users);
        return json.users;
      }
    }
  } catch (e) {
    console.warn("fetchLiveUsersFromCloud fallback to local:", e);
  }
  return getUsersDb();
}

export function getPaymentNotifications() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_NOTIFICATIONS);
    return saved ? JSON.parse(saved) : DEFAULT_PAYMENT_NOTIFICATIONS;
  } catch (e) {
    return DEFAULT_PAYMENT_NOTIFICATIONS;
  }
}

export function savePaymentNotifications(notifs) {
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_NOTIFICATIONS, JSON.stringify(notifs));
  } catch {}
}

export async function fetchPaymentNotificationsFromCloud() {
  try {
    const res = await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get-payment-notifications' })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.notifications)) {
        savePaymentNotifications(json.notifications);
        return json.notifications;
      }
    }
  } catch {}
  return getPaymentNotifications();
}

// Yeni Havale Bildirimi Ekle
export async function submitPaymentNotification(notificationData) {
  const notifs = getPaymentNotifications();
  const newNotif = {
    id: `NOTIF-${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: 'PENDING',
    ...notificationData
  };
  const updated = [newNotif, ...notifs];
  savePaymentNotifications(updated);

  try {
    await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit-payment-notification', notification: newNotif })
    });
  } catch {}

  return newNotif;
}

// İletişim / Biz Sizi Arayalım Taleplerini Oku & Yaz
export function getContactLeads() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTACT_LEADS);
    return saved ? JSON.parse(saved) : DEFAULT_CONTACT_LEADS;
  } catch (e) {
    return DEFAULT_CONTACT_LEADS;
  }
}

export function saveContactLeads(leads) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACT_LEADS, JSON.stringify(leads));
  } catch {}
}

export async function fetchContactLeadsFromCloud() {
  try {
    const res = await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get-leads' })
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.leads)) {
        saveContactLeads(json.leads);
        return json.leads;
      }
    }
  } catch {}
  return getContactLeads();
}

// Yeni İletişim / Arama Talebi Ekle
export async function submitContactLead(leadData) {
  const leads = getContactLeads();
  const newLead = {
    id: `LEAD-${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: 'NEW',
    ...leadData
  };
  const updated = [newLead, ...leads];
  saveContactLeads(updated);

  try {
    await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit-lead', lead: newLead })
    });
  } catch {}

  return newLead;
}

// Admin: Arama Talebi Durumunu Güncelle (Arandı / İptal)
export async function toggleLeadStatus(leadId) {
  const leads = getContactLeads();
  const updated = leads.map(l => {
    if (l.id === leadId) {
      return { ...l, status: l.status === 'NEW' ? 'CONTACTED' : 'NEW' };
    }
    return l;
  });
  saveContactLeads(updated);

  try {
    await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle-lead-status', leadId })
    });
  } catch {}

  return updated;
}

// Admin: Havale Bildirimini Onayla & Müşteri Lisansını Uzat
export async function approvePaymentNotification(notifId, daysToAdd = 30) {
  const notifs = getPaymentNotifications();
  let approvedUser = null;

  const updatedNotifs = notifs.map(n => {
    if (n.id === notifId) {
      approvedUser = n.userId;
      return { ...n, status: 'APPROVED', approvedAt: new Date().toLocaleDateString('tr-TR') };
    }
    return n;
  });
  savePaymentNotifications(updatedNotifs);

  if (approvedUser) {
    extendUserSubscription(approvedUser, daysToAdd);
  }

  try {
    await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve-payment-notification', notifId, daysToAdd })
    });
  } catch {}
}

// Admin: Kullanıcı Aboneliğini Uzat / Gün Ekle
export async function extendUserSubscription(userId, daysToAdd = 30) {
  const users = getUsersDb();
  let updatedUserObj = null;

  const updatedUsers = users.map(u => {
    if (u.id === userId) {
      const currentDays = u.daysRemaining || 0;
      const newDays = currentDays + daysToAdd;
      updatedUserObj = {
        ...u,
        status: 'ACTIVE',
        daysRemaining: newDays,
        trialDaysLeft: 0,
        plan: 'STANDARD',
        planName: 'Standart Paket (Aktif Lisans)',
        paidUntil: new Date(Date.now() + newDays * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')
      };
      return updatedUserObj;
    }
    return u;
  });
  saveUsersDb(updatedUsers);

  if (updatedUserObj) {
    try {
      await fetch('/api/cloud-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'admin-update-user', userId, updates: updatedUserObj })
      });
    } catch {}
  }
}

// Admin: Kullanıcı Durumunu Değiştir (Dondur / Aç)
export async function toggleUserStatus(userId) {
  const users = getUsersDb();
  let newStatus = 'ACTIVE';

  const updatedUsers = users.map(u => {
    if (u.id === userId) {
      newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
      return {
        ...u,
        status: newStatus
      };
    }
    return u;
  });
  saveUsersDb(updatedUsers);

  try {
    await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'admin-update-user', userId, updates: { status: newStatus } })
    });
  } catch {}
}

// Admin: Kullanıcıya Ek Modül Yetkisi Tanımla / Kaldır
export async function toggleUserAddon(userId, addonId) {
  const users = getUsersDb();
  let updatedAddons = [];

  const updatedUsers = users.map(u => {
    if (u.id === userId) {
      const currentAddons = u.activeAddons || [];
      const hasAddon = currentAddons.includes(addonId);
      updatedAddons = hasAddon 
        ? currentAddons.filter(id => id !== addonId) 
        : [...currentAddons, addonId];
      
      return {
        ...u,
        activeAddons: updatedAddons
      };
    }
    return u;
  });
  saveUsersDb(updatedUsers);

  try {
    await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'admin-update-user', userId, updates: { activeAddons: updatedAddons } })
    });
  } catch {}

  return updatedUsers;
}

// Admin: Kullanıcı Sil
export async function adminDeleteUserAsync(userId) {
  const users = getUsersDb();
  const updatedUsers = users.filter(u => u.id !== userId && u.email !== userId);
  saveUsersDb(updatedUsers);

  try {
    await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'admin-delete-user', userId })
    });
  } catch {}

  return updatedUsers;
}

// Admin: Manuel Kullanıcı Oluştur
export async function adminCreateUserAsync(userData) {
  const users = getUsersDb();
  const days = parseInt(userData.daysRemaining, 10) || 30;
  const newUserId = `USR-${Date.now().toString().slice(-6)}`;
  const newUser = {
    id: newUserId,
    storeName: userData.storeName || 'E-Ticaret Mağazam',
    ownerName: userData.ownerName || 'Mağaza Sahibi',
    email: (userData.email || '').trim().toLowerCase(),
    phone: userData.phone || '0500 000 00 00',
    role: 'merchant',
    plan: userData.plan || 'STANDARD',
    planName: userData.plan === 'PRO_PLUS' ? 'Standart + Amazon & Sovos Eklentisi' : (userData.plan === 'TRIAL' ? '7 Günlük Ücretsiz Deneme' : 'Standart Paket (Aktif Lisans)'),
    trialDaysLeft: userData.plan === 'TRIAL' ? days : 0,
    daysRemaining: days,
    status: 'ACTIVE',
    createdAt: new Date().toLocaleDateString('tr-TR'),
    paidUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
    activeAddons: userData.activeAddons || ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
  };

  const updatedUsers = [newUser, ...users];
  saveUsersDb(updatedUsers);

  try {
    await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'admin-create-user', ...userData })
    });
  } catch {}

  return newUser;
}

// Admin: Kullanıcı Paketini Değiştir
export async function updateUserPlanAsync(userId, newPlan) {
  const users = getUsersDb();
  let planName = 'Standart Paket (Aktif Lisans)';
  let price = 979;
  let activeAddons = ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce'];

  if (newPlan === 'PRO_PLUS') {
    planName = 'Pro Plus Paket (Amazon + Sovos Dahil)';
    price = 1760;
    activeAddons = ['trendyol', 'hepsiburada', 'amazon', 'parasut', 'sovos', 'ticimax', 'woocommerce'];
  } else if (newPlan === 'TRIAL') {
    planName = '7 Günlük Ücretsiz Deneme';
    price = 0;
  } else if (newPlan === 'SUPER_ADMIN') {
    planName = 'Süper Yönetici Lisansı';
    price = 0;
    activeAddons = ['trendyol', 'hepsiburada', 'amazon', 'n11', 'ciceksepeti', 'parasut', 'bizimhesap', 'kolaybi', 'sovos', 'ticimax', 'woocommerce', 'shopify'];
  }

  const updatedUsers = users.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        plan: newPlan,
        planName,
        price,
        role: newPlan === 'SUPER_ADMIN' ? 'admin' : 'merchant',
        activeAddons: Array.from(new Set([...(u.activeAddons || []), ...activeAddons]))
      };
    }
    return u;
  });

  saveUsersDb(updatedUsers);

  try {
    await fetch('/api/cloud-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'admin-update-user',
        userId,
        updates: { plan: newPlan, planName, price, activeAddons }
      })
    });
  } catch {}

  return updatedUsers;
}

// Admin: Finansal İstatistikleri Hesapla
export function getAdminFinancialStats() {
  const users = getUsersDb();
  const notifs = getPaymentNotifications();
  const leads = getContactLeads();

  const totalUsers = users.length;
  const activeSubscribers = users.filter(u => u.status === 'ACTIVE' && u.plan !== 'TRIAL' && u.role !== 'admin').length;
  const trialUsers = users.filter(u => u.status === 'TRIAL' || u.plan === 'TRIAL').length;
  const suspendedUsers = users.filter(u => u.status === 'SUSPENDED').length;
  
  const mrr = users.filter(u => u.status === 'ACTIVE' && u.role !== 'admin').reduce((sum, u) => sum + (u.price || 979), 0);
  const arr = mrr * 12;
  const pendingPaymentsCount = notifs.filter(n => n.status === 'PENDING').length;
  const newLeadsCount = leads.filter(l => l.status === 'NEW').length;

  return {
    totalUsers,
    activeSubscribers,
    trialUsers,
    suspendedUsers,
    mrr,
    arr,
    pendingPaymentsCount,
    newLeadsCount
  };
}

