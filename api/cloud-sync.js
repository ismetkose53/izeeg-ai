// Vercel Serverless Function & Cloud Sync Engine: Central Cloud Database & Multi-Device Sync Gateway
// Destek: Kullanıcı Üyelikleri, Süper Admin Kullanıcı Listesi, Pazaryeri API Anahtarları Senkronizasyonu, Sipariş Havuzu, Ayarlar ve Bildirimler

import fs from 'fs';
import path from 'path';

// Server-side persistent storage file (Local / Container fallback)
const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'cloud_db.json');

// In-Memory Global Store (Vercel Serverless Function instance persistence)
let globalMemoryDb = null;

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

const INITIAL_DB_STATE = {
  users: [
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
      email: 'yumey@izeeg.com',
      phone: '0543 697 07 55',
      role: 'merchant',
      plan: 'PRO_PLUS',
      planName: 'Pro Plus Paket (Trendyol + Hepsiburada + Sovos)',
      price: 1760,
      status: 'ACTIVE',
      trialDaysLeft: 0,
      paidUntil: '01.01.2027',
      daysRemaining: 95,
      createdAt: '20.09.2026',
      activeAddons: ['trendyol', 'hepsiburada', 'amazon', 'parasut', 'sovos', 'ticimax', 'woocommerce'],
      paymentMethod: 'HAVALE_FAST'
    },
    {
      id: 'USR-849201',
      storeName: 'Trend Butik & Ayakkabı',
      ownerName: 'Ahmet Yılmaz',
      email: 'ahmet@trendbutik.com',
      phone: '0532 999 88 77',
      role: 'merchant',
      plan: 'STANDARD',
      planName: 'Standart Paket (Trendyol + Hepsiburada)',
      price: 979,
      status: 'ACTIVE',
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
      role: 'merchant',
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
      id: 'USR-849204',
      storeName: 'Lina Butik Moda',
      ownerName: 'Selin Demir',
      email: 'selin@linabutik.com',
      phone: '0535 111 22 33',
      role: 'merchant',
      plan: 'TRIAL',
      planName: '7 Günlük Ücretsiz Deneme',
      price: 0,
      status: 'TRIAL',
      trialDaysLeft: 5,
      daysRemaining: 5,
      createdAt: '25.09.2026',
      paidUntil: '02.10.2026',
      activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce'],
      paymentMethod: 'TRIAL'
    }
  ],
  userStoreData: {}, // userId -> { credentials: {}, orders: [], products: [], settings: {} }
  bankSettings: {
    bankName: 'Ziraat Bankası',
    accountHolder: 'İsmet Köse',
    iban: 'TR12 0001 0001 2345 6789 0001 01',
    branchCode: '1048 - Merkez Şube',
    fastEasyAddress: '0543 697 07 55 (Telefon ile Kolay Adres - İsmet Köse)',
    paymentNoteInstructions: 'Lütfen FAST / Havale açıklama kısmına SADECE yukarıdaki Sipariş / Referans Kodunuzu yazınız.',
    whatsappSupportNumber: '905436970755',
    discountRateHavale: 15
  },
  shopierSettings: {
    standardMonthlyUrl: 'https://www.shopier.com/izeeg-standart-aylik',
    standardAnnualUrl: 'https://www.shopier.com/izeeg-standart-yillik',
    addonAmazonUrl: 'https://www.shopier.com/izeeg-addon-amazon',
    addonSovosUrl: 'https://www.shopier.com/izeeg-addon-sovos',
    addonShopifyUrl: 'https://www.shopier.com/izeeg-addon-shopify',
    isShopierActive: true,
    isHavaleActive: true
  },
  paymentNotifications: [
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
  ],
  contactLeads: [
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
  ]
};

// Database Reader & Writer with safe file and memory sync
function getDb() {
  if (globalMemoryDb) return globalMemoryDb;

  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(content);
      if (loaded && Array.isArray(loaded.users)) {
        INITIAL_DB_STATE.users.forEach(defU => {
          if (!loaded.users.some(u => u.id === defU.id || (u.email && defU.email && u.email.toLowerCase() === defU.email.toLowerCase()))) {
            loaded.users.push(defU);
          }
        });
      }
      globalMemoryDb = loaded;
      return globalMemoryDb;
    }
  } catch (e) {
    console.warn("DB file read error:", e);
  }

  globalMemoryDb = JSON.parse(JSON.stringify(INITIAL_DB_STATE));
  saveDb(globalMemoryDb);
  return globalMemoryDb;
}

function saveDb(dbData) {
  globalMemoryDb = dbData;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (e) {
    // Non-blocking for read-only environments
  }
}

export default async function handler(req, res) {
  // CORS & Security Headers
  const origin = req.headers.origin || '';
  const isAllowedOrigin = 
    !origin || 
    origin.includes('localhost') || 
    origin.includes('127.0.0.1') || 
    origin.includes('.vercel.app') || 
    origin.includes('izeeg.com');

  if (isAllowedOrigin && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const action = body.action || req.query?.action || 'status';
  const db = getDb();

  try {
    // 1. STATÜ KONTROLÜ
    if (action === 'status') {
      return res.status(200).json({
        success: true,
        status: 'ONLINE',
        timestamp: new Date().toISOString(),
        usersCount: db.users.length,
        version: '2.0.0'
      });
    }

    // 2. KULLANICI KAYDI (REGISTER)
    if (action === 'register') {
      const { storeName, fullName, email, phone, password } = body;
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanName = (fullName || storeName || '').trim();
      const cleanStore = (storeName || cleanName || 'E-Ticaret Mağazam').trim();
      const cleanPhone = (phone || '').trim();

      if (!cleanEmail || !cleanName) {
        return res.status(400).json({ success: false, message: 'Ad soyad ve e-posta zorunludur.' });
      }

      // Mevcut kullanıcı kontrolü
      const existingUser = db.users.find(u => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Bu e-posta adresi ile kayıtlı bir hesap zaten bulunmaktadır. Lütfen giriş yapınız.'
        });
      }

      const newUserId = `USR-${Date.now().toString().slice(-6)}`;
      const newUser = {
        id: newUserId,
        storeName: cleanStore,
        ownerName: cleanName,
        email: cleanEmail,
        phone: cleanPhone || '0500 000 00 00',
        passwordHash: password ? computeAuthHash(password) : null,
        role: 'merchant',
        plan: 'TRIAL',
        planName: '7 Günlük Ücretsiz Deneme',
        trialDaysLeft: 7,
        daysRemaining: 7,
        status: 'TRIAL',
        createdAt: new Date().toLocaleDateString('tr-TR'),
        paidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
      };

      db.users.push(newUser);
      db.userStoreData[newUserId] = {
        credentials: {},
        orders: [],
        products: [],
        settings: {}
      };
      saveDb(db);

      const { passwordHash, ...safeUser } = newUser;
      return res.status(200).json({
        success: true,
        user: { ...safeUser, isLoggedIn: true },
        message: 'Kayıt başarıyla oluşturuldu.'
      });
    }

    // 3. KULLANICI GİRİŞİ (LOGIN) & BULUTTAN VERİLERİNİ ÇEKME
    if (action === 'login') {
      const { email, password } = body;
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      if (!cleanEmail || !cleanPass) {
        return res.status(400).json({ success: false, message: 'E-posta ve şifre zorunludur.' });
      }

      // Kurucu / Admin Girişi
      const isAdminEmail = (
        cleanEmail === 'ismetnote2@gmail.com' || 
        cleanEmail === 'ismet@izeeg.com' || 
        cleanEmail === 'admin@izeeg.com' ||
        cleanEmail === 'admin'
      );

      if (isAdminEmail) {
        const inputHash = computeAuthHash(cleanPass);
        if (ADMIN_HASHES.has(inputHash)) {
          const adminUser = db.users.find(u => u.role === 'admin') || {
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
            status: 'ACTIVE',
            activeAddons: ['trendyol', 'hepsiburada', 'amazon', 'n11', 'ciceksepeti', 'parasut', 'bizimhesap', 'kolaybi', 'sovos', 'ticimax', 'woocommerce', 'shopify']
          };

          const storeData = db.userStoreData[adminUser.id] || db.userStoreData[adminUser.email] || {};
          return res.status(200).json({
            success: true,
            user: { ...adminUser, isLoggedIn: true },
            storeData: storeData,
            message: '👑 Kurucu Admin girişi doğrulandı.'
          });
        } else {
          return res.status(401).json({ success: false, message: 'Yönetici şifresi hatalı.' });
        }
      }

      // Normal Satıcı Girişi
      let user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        // Eğer veritabanında yoksa ancak geçerli şifre girilmişse otomatik oluştur (kolay geçiş)
        if (cleanPass.length >= 4) {
          const newUserId = `USR-${Date.now().toString().slice(-6)}`;
          user = {
            id: newUserId,
            storeName: cleanEmail.split('@')[0].toUpperCase() + ' Mağazası',
            ownerName: cleanEmail.split('@')[0],
            email: cleanEmail,
            phone: '0500 000 00 00',
            passwordHash: computeAuthHash(cleanPass),
            role: 'merchant',
            plan: 'TRIAL',
            planName: '7 Günlük Ücretsiz Deneme',
            trialDaysLeft: 7,
            daysRemaining: 7,
            status: 'TRIAL',
            createdAt: new Date().toLocaleDateString('tr-TR'),
            paidUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
            activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
          };
          db.users.push(user);
          saveDb(db);
        } else {
          return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı. Lütfen kayıt olunuz.' });
        }
      } else {
        // Şifre kontrolü (eğer kayıtlı hash varsa)
        if (user.passwordHash) {
          const inputHash = computeAuthHash(cleanPass);
          if (inputHash !== user.passwordHash && cleanPass.length < 4) {
            return res.status(401).json({ success: false, message: 'Hatalı şifre girdiniz.' });
          }
        }
      }

      const storeData = db.userStoreData[user.id] || db.userStoreData[user.email] || {};
      const { passwordHash, ...safeUser } = user;

      return res.status(200).json({
        success: true,
        user: { ...safeUser, isLoggedIn: true },
        storeData: storeData,
        message: `Hoş geldiniz ${user.ownerName || user.storeName}!`
      });
    }

    // 4. KULLANICI VERİLERİNİ BULUTA KAYDETME (SYNC STORE DATA)
    if (action === 'save-user-data') {
      const { userId, email, credentials, orders, products, cargoLeaks, settings } = body;
      const key = userId || email;
      if (!key) {
        return res.status(400).json({ success: false, message: 'Kullanıcı kimliği zorunludur.' });
      }

      const existingData = db.userStoreData[key] || {};
      db.userStoreData[key] = {
        ...existingData,
        credentials: credentials !== undefined ? credentials : existingData.credentials,
        orders: orders !== undefined ? orders : existingData.orders,
        products: products !== undefined ? products : existingData.products,
        cargoLeaks: cargoLeaks !== undefined ? cargoLeaks : existingData.cargoLeaks,
        settings: settings !== undefined ? settings : existingData.settings,
        lastSyncedAt: new Date().toISOString()
      };

      // Ayrıca ana kullanıcı kaydı varsa bilgileri güncelle
      const userIdx = db.users.findIndex(u => u.id === userId || u.email === email);
      if (userIdx !== -1 && body.userProfile) {
        db.users[userIdx] = { ...db.users[userIdx], ...body.userProfile };
      }

      saveDb(db);
      return res.status(200).json({ success: true, message: 'Veriler bulut sunucusuna senkronize edildi.' });
    }

    // 5. KULLANICI VERİLERİNİ BULUTTAN ÇEKME (GET STORE DATA)
    if (action === 'get-user-data') {
      const { userId, email } = body;
      const key = userId || email;
      const storeData = db.userStoreData[key] || db.userStoreData[userId] || db.userStoreData[email] || {};
      const user = db.users.find(u => u.id === userId || u.email === email);

      return res.status(200).json({
        success: true,
        user: user ? (({ passwordHash, ...s }) => s)(user) : null,
        storeData: storeData
      });
    }

    // 6. ADMIN: TÜM KULLANICILARI LİSTELEME
    if (action === 'admin-get-users') {
      const safeUsers = db.users.map(({ passwordHash, ...u }) => u);
      return res.status(200).json({
        success: true,
        users: safeUsers,
        total: safeUsers.length
      });
    }

    // 7. ADMIN: KULLANICIYI GÜNCELLEME (Lisans Uzatma, Yetki, Dondurma)
    if (action === 'admin-update-user') {
      const { userId, updates } = body;
      const userIdx = db.users.findIndex(u => u.id === userId);
      if (userIdx === -1) {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
      }

      db.users[userIdx] = { ...db.users[userIdx], ...updates };
      saveDb(db);

      const { passwordHash, ...safeUser } = db.users[userIdx];
      return res.status(200).json({
        success: true,
        user: safeUser,
        message: 'Kullanıcı bilgileri güncellendi.'
      });
    }

    // ADMIN: KULLANICI SİLME
    if (action === 'admin-delete-user') {
      const { userId } = body;
      const initialCount = db.users.length;
      db.users = db.users.filter(u => u.id !== userId && u.email !== userId);
      delete db.userStoreData[userId];
      saveDb(db);

      return res.status(200).json({
        success: true,
        deleted: db.users.length < initialCount,
        message: 'Kullanıcı hesabı başarıyla silindi.'
      });
    }

    // ADMIN: MANUEL KULLANICI OLUŞTURMA
    if (action === 'admin-create-user') {
      const { storeName, ownerName, email, phone, plan, daysRemaining, activeAddons } = body;
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail) {
        return res.status(400).json({ success: false, message: 'E-posta zorunludur.' });
      }

      const newUserId = `USR-${Date.now().toString().slice(-6)}`;
      const days = parseInt(daysRemaining, 10) || 30;
      const newUser = {
        id: newUserId,
        storeName: storeName || 'E-Ticaret Mağazam',
        ownerName: ownerName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: phone || '0500 000 00 00',
        role: 'merchant',
        plan: plan || 'STANDARD',
        planName: plan === 'PRO_PLUS' ? 'Pro Plus Paket' : (plan === 'TRIAL' ? '7 Günlük Ücretsiz Deneme' : 'Standart Paket (Aktif Lisans)'),
        trialDaysLeft: plan === 'TRIAL' ? days : 0,
        daysRemaining: days,
        status: 'ACTIVE',
        createdAt: new Date().toLocaleDateString('tr-TR'),
        paidUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        activeAddons: activeAddons || ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
      };

      db.users.push(newUser);
      saveDb(db);

      return res.status(200).json({
        success: true,
        user: newUser,
        message: 'Yeni satıcı hesabı oluşturuldu.'
      });
    }

    // 8. ADMIN: BANKA & SHOPIER AYARLARI
    if (action === 'get-admin-settings') {
      return res.status(200).json({
        success: true,
        bankSettings: db.bankSettings,
        shopierSettings: db.shopierSettings
      });
    }

    if (action === 'save-admin-settings') {
      if (body.bankSettings) db.bankSettings = { ...db.bankSettings, ...body.bankSettings };
      if (body.shopierSettings) db.shopierSettings = { ...db.shopierSettings, ...body.shopierSettings };
      saveDb(db);
      return res.status(200).json({ success: true, message: 'Admin ayarları kaydedildi.' });
    }

    // 9. HAVALE BİLDİRİMLERİ & TALEPLER
    if (action === 'get-payment-notifications') {
      return res.status(200).json({ success: true, notifications: db.paymentNotifications || [] });
    }

    if (action === 'submit-payment-notification') {
      const notif = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'PENDING',
        ...body.notification
      };
      db.paymentNotifications = [notif, ...(db.paymentNotifications || [])];
      saveDb(db);
      return res.status(200).json({ success: true, notification: notif });
    }

    if (action === 'approve-payment-notification') {
      const { notifId, daysToAdd = 30 } = body;
      let targetUserId = null;
      db.paymentNotifications = (db.paymentNotifications || []).map(n => {
        if (n.id === notifId) {
          targetUserId = n.userId;
          return { ...n, status: 'APPROVED', approvedAt: new Date().toLocaleDateString('tr-TR') };
        }
        return n;
      });

      if (targetUserId) {
        const uIdx = db.users.findIndex(u => u.id === targetUserId);
        if (uIdx !== -1) {
          const curDays = db.users[uIdx].daysRemaining || 0;
          db.users[uIdx].daysRemaining = curDays + daysToAdd;
          db.users[uIdx].status = 'ACTIVE';
          db.users[uIdx].trialDaysLeft = 0;
          db.users[uIdx].plan = 'STANDARD';
          db.users[uIdx].planName = 'Standart Paket (Aktif Lisans)';
          db.users[uIdx].paidUntil = new Date(Date.now() + (curDays + daysToAdd) * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR');
        }
      }

      saveDb(db);
      return res.status(200).json({ success: true, message: 'Ödeme onaylandı ve lisans uzatıldı.' });
    }

    // 10. İLETİŞİM / ARAMA TALEPLERİ (LEADS)
    if (action === 'get-leads') {
      return res.status(200).json({ success: true, leads: db.contactLeads || [] });
    }

    if (action === 'submit-lead') {
      const newLead = {
        id: `LEAD-${Date.now().toString().slice(-4)}`,
        date: new Date().toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'NEW',
        ...body.lead
      };
      db.contactLeads = [newLead, ...(db.contactLeads || [])];
      saveDb(db);
      return res.status(200).json({ success: true, lead: newLead });
    }

    if (action === 'toggle-lead-status') {
      const { leadId } = body;
      db.contactLeads = (db.contactLeads || []).map(l => {
        if (l.id === leadId) {
          return { ...l, status: l.status === 'NEW' ? 'CONTACTED' : 'NEW' };
        }
        return l;
      });
      saveDb(db);
      return res.status(200).json({ success: true, leads: db.contactLeads });
    }

    return res.status(400).json({ success: false, message: `Bilinmeyen işlem: ${action}` });
  } catch (err) {
    console.error("Cloud Sync Handler Error:", err);
    return res.status(500).json({ success: false, message: 'Sunucu hatası: ' + (err.message || err) });
  }
}
