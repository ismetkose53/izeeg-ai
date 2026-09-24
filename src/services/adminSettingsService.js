// izeeg Süper Admin, Ödeme Altyapısı & Lisans Yönetim Servisi

const STORAGE_KEYS = {
  BANK_SETTINGS: 'izeeg_admin_bank_settings',
  SHOPIER_SETTINGS: 'izeeg_admin_shopier_settings',
  USERS_DB: 'izeeg_admin_users_db',
  PAYMENT_NOTIFICATIONS: 'izeeg_admin_payment_notifications',
  CONTACT_LEADS: 'izeeg_admin_contact_leads'
};

// 1. Varsayılan Banka & IBAN Bilgileri (Admin Panelinden Değiştirilebilir)
const DEFAULT_BANK_SETTINGS = {
  bankName: 'Ziraat Bankası',
  accountHolder: 'İsmet Köse',
  iban: 'TR12 0001 0001 2345 6789 0001 01',
  branchCode: '1048 - Merkez Şube',
  fastEasyAddress: '0543 697 07 55 (Telefon ile Kolay Adres - İsmet Köse)',
  paymentNoteInstructions: 'Lütfen FAST / Havale açıklama kısmına SADECE yukarıdaki Sipariş / Referans Kodunuzu yazınız.',
  whatsappSupportNumber: '905436970755',
  discountRateHavale: 15 // %15 Havale indirimi
};

// 2. Varsayılan Shopier & Kartla Ödeme Linkleri (Admin Panelinden Değiştirilebilir)
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
    id: 'USR-849201',
    storeName: 'Trend Butik & Ayakkabı',
    ownerName: 'Ahmet Yılmaz',
    email: 'ahmet@trendbutik.com',
    phone: '0532 999 88 77',
    plan: 'STANDARD',
    planName: 'Standart Paket (Trendyol + Hepsiburada)',
    price: 979,
    status: 'ACTIVE', // 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'SUSPENDED'
    trialDaysLeft: 0,
    paidUntil: '22.10.2026',
    daysRemaining: 30,
    createdAt: '22.09.2026',
    activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce'],
    paymentMethod: 'HAVALE_FAST'
  },
  {
    id: 'USR-849202',
    storeName: 'Mega Spor Dünyası Ltd.',
    ownerName: 'Zeynep Aksoy',
    email: 'zeynep@megaspor.com',
    phone: '0544 888 77 66',
    plan: 'PRO_PLUS',
    planName: 'Standart + Amazon & Sovos Eklentisi',
    price: 1760,
    status: 'ACTIVE',
    trialDaysLeft: 0,
    paidUntil: '15.11.2026',
    daysRemaining: 54,
    createdAt: '15.08.2026',
    activeAddons: ['trendyol', 'hepsiburada', 'amazon', 'parasut', 'sovos', 'ticimax', 'woocommerce'],
    paymentMethod: 'SHOPIER_CARD'
  },
  {
    id: 'USR-849203',
    storeName: 'Kozmetik Vadisi',
    ownerName: 'Burak Şahin',
    email: 'burak@kozmetikvadisi.com',
    phone: '0555 777 66 55',
    plan: 'TRIAL',
    planName: '7 Günlük Ücretsiz Deneme',
    price: 0,
    status: 'TRIAL',
    trialDaysLeft: 5,
    paidUntil: '27.09.2026',
    daysRemaining: 5,
    createdAt: '20.09.2026',
    activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce'],
    paymentMethod: 'TRIAL'
  }
];

// 4. Örnek Havale / EFT Bildirimleri Havuzu
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
    status: 'PENDING', // 'PENDING' | 'APPROVED' | 'REJECTED'
    slipNote: 'Ziraat hesabınıza FAST ile 8.457,50 TL gönderildi.'
  }
];

// 5. Örnek İletişim / Biz Sizi Arayalım Talepleri (Leads)
const DEFAULT_CONTACT_LEADS = [
  {
    id: 'LEAD-101',
    fullName: 'Caner Özdemir',
    storeName: 'Moda Dünyası',
    phone: '0533 456 78 90',
    subject: 'Canlı Demo & Kurulum',
    message: 'Trendyol ve Hepsiburada mağazalarımız için otomatik e-fatura ve desi kontrolünü test etmek istiyoruz.',
    date: '22.09.2026 22:15',
    status: 'NEW' // 'NEW' | 'CONTACTED' | 'CONVERTED'
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
  localStorage.setItem(STORAGE_KEYS.BANK_SETTINGS, JSON.stringify(settings));
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
  localStorage.setItem(STORAGE_KEYS.SHOPIER_SETTINGS, JSON.stringify(settings));
}

export function getUsersDb() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    return saved ? JSON.parse(saved) : DEFAULT_USERS_DB;
  } catch (e) {
    return DEFAULT_USERS_DB;
  }
}

export function saveUsersDb(users) {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
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
  localStorage.setItem(STORAGE_KEYS.PAYMENT_NOTIFICATIONS, JSON.stringify(notifs));
}

// Yeni Havale Bildirimi Ekle
export function submitPaymentNotification(notificationData) {
  const notifs = getPaymentNotifications();
  const newNotif = {
    id: `NOTIF-${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: 'PENDING',
    ...notificationData
  };
  const updated = [newNotif, ...notifs];
  savePaymentNotifications(updated);
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
  localStorage.setItem(STORAGE_KEYS.CONTACT_LEADS, JSON.stringify(leads));
}

// Yeni İletişim / Arama Talebi Ekle
export function submitContactLead(leadData) {
  const leads = getContactLeads();
  const newLead = {
    id: `LEAD-${Date.now().toString().slice(-4)}`,
    date: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: 'NEW',
    ...leadData
  };
  const updated = [newLead, ...leads];
  saveContactLeads(updated);
  return newLead;
}

// Admin: Arama Talebi Durumunu Güncelle (Arandı / İptal)
export function toggleLeadStatus(leadId) {
  const leads = getContactLeads();
  const updated = leads.map(l => {
    if (l.id === leadId) {
      return { ...l, status: l.status === 'NEW' ? 'CONTACTED' : 'NEW' };
    }
    return l;
  });
  saveContactLeads(updated);
  return updated;
}

// Admin: Havale Bildirimini Onayla & Müşteri Lisansını Uzat
export function approvePaymentNotification(notifId, daysToAdd = 30) {
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
}

// Admin: Kullanıcı Aboneliğini Uzat / Gün Ekle
export function extendUserSubscription(userId, daysToAdd = 30) {
  const users = getUsersDb();
  const updatedUsers = users.map(u => {
    if (u.id === userId) {
      const currentDays = u.daysRemaining || 0;
      const newDays = currentDays + daysToAdd;
      return {
        ...u,
        status: 'ACTIVE',
        daysRemaining: newDays,
        trialDaysLeft: 0,
        plan: 'STANDARD',
        planName: 'Standart Paket (Aktif Lisans)',
        paidUntil: new Date(Date.now() + newDays * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR')
      };
    }
    return u;
  });
  saveUsersDb(updatedUsers);
}

// Admin: Kullanıcı Durumunu Değiştir (Dondur / Aç)
export function toggleUserStatus(userId) {
  const users = getUsersDb();
  const updatedUsers = users.map(u => {
    if (u.id === userId) {
      return {
        ...u,
        status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
      };
    }
    return u;
  });
  saveUsersDb(updatedUsers);
}

// Admin: Kullanıcıya Ek Modül Yetkisi Tanımla / Kaldır
export function toggleUserAddon(userId, addonId) {
  const users = getUsersDb();
  const updatedUsers = users.map(u => {
    if (u.id === userId) {
      const currentAddons = u.activeAddons || [];
      const hasAddon = currentAddons.includes(addonId);
      const newAddons = hasAddon 
        ? currentAddons.filter(id => id !== addonId) 
        : [...currentAddons, addonId];
      
      return {
        ...u,
        activeAddons: newAddons
      };
    }
    return u;
  });
  saveUsersDb(updatedUsers);
  return updatedUsers;
}

// Admin: Finansal İstatistikleri Hesapla
export function getAdminFinancialStats() {
  const users = getUsersDb();
  const notifs = getPaymentNotifications();
  const leads = getContactLeads();

  const totalUsers = users.length;
  const activeSubscribers = users.filter(u => u.status === 'ACTIVE').length;
  const trialUsers = users.filter(u => u.status === 'TRIAL').length;
  
  const mrr = users.filter(u => u.status === 'ACTIVE').reduce((sum, u) => sum + (u.price || 0), 0);
  const arr = mrr * 12;
  const pendingPaymentsCount = notifs.filter(n => n.status === 'PENDING').length;
  const newLeadsCount = leads.filter(l => l.status === 'NEW').length;

  return {
    totalUsers,
    activeSubscribers,
    trialUsers,
    mrr,
    arr,
    pendingPaymentsCount,
    newLeadsCount
  };
}
