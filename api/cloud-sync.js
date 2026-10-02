// Vercel Serverless Function & Cloud Sync Engine: Central Cloud Database & Multi-Device Sync Gateway
// Destek: Kullanıcı Üyelikleri, Süper Admin Kullanıcı Listesi, Pazaryeri API Anahtarları Senkronizasyonu, Sipariş Havuzu, Ayarlar ve Bildirimler

import fs from 'fs';
import path from 'path';

// Multi-Environment Persistent Storage Files (.data and /tmp for serverless runtime)
const DATA_DIR = path.join(process.cwd(), '.data');
const LOCAL_DB_FILE = path.join(DATA_DIR, 'cloud_db.json');
const TMP_DB_FILE = path.join('/tmp', 'cloud_db.json');

// In-Memory Global Store
let globalMemoryDb = null;

function getDbFilePath() {
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) return LOCAL_DB_FILE;
    if (fs.existsSync(TMP_DB_FILE)) return TMP_DB_FILE;
  } catch {}
  return LOCAL_DB_FILE;
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
  ],
  userStoreData: {},
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
  paymentNotifications: [],
  contactLeads: []
};

// Database Reader & Writer with safe multi-location sync
function getDb() {
  if (globalMemoryDb) return globalMemoryDb;

  // 1. Try reading from local .data/cloud_db.json or /tmp/cloud_db.json
  const filePaths = [LOCAL_DB_FILE, TMP_DB_FILE];
  for (const fPath of filePaths) {
    try {
      if (fs.existsSync(fPath)) {
        const content = fs.readFileSync(fPath, 'utf-8');
        const loaded = JSON.parse(content);
        if (loaded && Array.isArray(loaded.users)) {
          // Ensure Kurucu Admin exists
          if (!loaded.users.some(u => u.role === 'admin' || u.email === 'ismetnote2@gmail.com')) {
            loaded.users.unshift(INITIAL_DB_STATE.users[0]);
          }
          globalMemoryDb = loaded;
          return globalMemoryDb;
        }
      }
    } catch (e) {
      console.warn("DB file read notice:", e);
    }
  }

  // 2. Initialize new DB if file does not exist
  globalMemoryDb = JSON.parse(JSON.stringify(INITIAL_DB_STATE));
  saveDb(globalMemoryDb);
  return globalMemoryDb;
}

function saveDb(dbData) {
  globalMemoryDb = dbData;
  const jsonStr = JSON.stringify(dbData, null, 2);

  // Write to both local and /tmp
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_FILE, jsonStr, 'utf-8');
  } catch (e) {
    // Attempt /tmp fallback for Serverless read-only root
    try {
      fs.writeFileSync(TMP_DB_FILE, jsonStr, 'utf-8');
    } catch {}
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
        planName: '14 Günlük Ücretsiz Deneme',
        trialDaysLeft: 14,
        daysRemaining: 14,
        status: 'TRIAL',
        createdAt: new Date().toLocaleDateString('tr-TR'),
        paidUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
        activeAddons: ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
      };

      db.users.push(newUser);
      db.userStoreData[newUserId] = {
        credentials: {},
        orders: [],
        products: [],
        cargoLeaks: [],
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
        return res.status(400).json({ success: false, message: 'Lütfen e-posta adresinizi ve şifrenizi giriniz.' });
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
          return res.status(401).json({ success: false, message: 'Yönetici şifresi hatalıdır. Lütfen kurucu şifrenizi kontrol ediniz.' });
        }
      }

      // Normal Satıcı Girişi (Kayıtsız Giriş Kesinlikle Engellendi)
      let user = db.users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Bu e-posta adresiyle kayıtlı bir hesap bulunamadı. Sisteme erişmek için lütfen önce "Kayıt Ol" sekmesinden ücretsiz 7 günlük deneme hesabı oluşturunuz.'
        });
      }

      // Şifre Kontrolü (Hatalı Şifre Engeli)
      const inputHash = computeAuthHash(cleanPass);
      if (user.passwordHash) {
        if (inputHash !== user.passwordHash) {
          return res.status(401).json({
            success: false,
            message: 'Girdiğiniz şifre hatalıdır. Lütfen şifrenizi kontrol edip tekrar deneyiniz.'
          });
        }
      } else {
        // İlk şifre kaydı (şifresiz oluşturulmuş eski kayıtlar için güvenli bağlama)
        user.passwordHash = inputHash;
        saveDb(db);
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
      const { userId, email, credentials, orders, products, cargoLeaks, settings, userProfile } = body;
      const cleanEmail = (email || userProfile?.email || '').trim().toLowerCase();
      const cleanId = userId || userProfile?.id || (cleanEmail ? `USR-${cleanEmail.split('@')[0]}` : null);

      if (!cleanId && !cleanEmail) {
        return res.status(400).json({ success: false, message: 'Kullanıcı kimliği veya e-posta zorunludur.' });
      }

      // 1. Mağaza verilerini (API anahtarları, siparişler, ürünler) kaydet
      const updateData = {
        credentials: credentials !== undefined ? credentials : {},
        orders: orders !== undefined ? orders : [],
        products: products !== undefined ? products : [],
        cargoLeaks: cargoLeaks !== undefined ? cargoLeaks : [],
        settings: settings !== undefined ? settings : {},
        lastSyncedAt: new Date().toISOString()
      };

      if (cleanId) {
        db.userStoreData[cleanId] = { ...(db.userStoreData[cleanId] || {}), ...updateData };
      }
      if (cleanEmail) {
        db.userStoreData[cleanEmail] = { ...(db.userStoreData[cleanEmail] || {}), ...updateData };
      }

      // 2. Ana Kullanıcı Listesine (db.users) Ekle veya Güncelle -> Yönetici Panelinde Anında Görünür
      const userIdx = db.users.findIndex(u => 
        (cleanId && u.id === cleanId) || 
        (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail)
      );

      if (userIdx !== -1) {
        db.users[userIdx] = {
          ...db.users[userIdx],
          ...(userProfile || {}),
          email: cleanEmail || db.users[userIdx].email,
          lastActiveAt: new Date().toISOString()
        };
      } else if (cleanEmail) {
        const profile = userProfile || {};
        const newUser = {
          id: cleanId || `USR-${Date.now().toString().slice(-6)}`,
          storeName: profile.storeName || (cleanEmail === 'yumeyclub@gmail.com' ? 'YUMEYCLUB Mağazası' : 'E-Ticaret Mağazam'),
          ownerName: profile.ownerName || profile.fullName || (cleanEmail === 'yumeyclub@gmail.com' ? 'yumeyclub' : cleanEmail.split('@')[0]),
          email: cleanEmail,
          phone: profile.phone || '0500 000 00 00',
          sellerId: profile.sellerId || (cleanEmail === 'yumeyclub@gmail.com' ? '104829' : ''),
          taxNumber: profile.taxNumber || (cleanEmail === 'yumeyclub@gmail.com' ? '1234567890' : ''),
          role: profile.role || (cleanEmail.includes('admin') || cleanEmail === 'ismetnote2@gmail.com' ? 'admin' : 'merchant'),
          plan: profile.plan || 'TRIAL',
          planName: profile.planName || '7 Günlük Ücretsiz Deneme',
          trialDaysLeft: profile.trialDaysLeft ?? 7,
          daysRemaining: profile.daysRemaining ?? 7,
          status: profile.status || 'TRIAL',
          createdAt: profile.createdAt || new Date().toLocaleDateString('tr-TR'),
          paidUntil: profile.paidUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('tr-TR'),
          activeAddons: profile.activeAddons || ['trendyol', 'hepsiburada', 'parasut', 'ticimax', 'woocommerce']
        };
        db.users.push(newUser);
      }

      saveDb(db);
      return res.status(200).json({ 
        success: true, 
        message: 'Veriler ve kullanıcı profili merkezi bulut veritabanına başarıyla kaydedildi.',
        usersCount: db.users.length
      });
    }

    // 5. KULLANICI VERİLERİNİ BULUTTAN ÇEKME (GET STORE DATA)
    if (action === 'get-user-data') {
      const { userId, email } = body;
      const cleanEmail = (email || '').trim().toLowerCase();
      const storeData = (cleanEmail && db.userStoreData[cleanEmail]) || (userId && db.userStoreData[userId]) || {};
      const user = db.users.find(u => (userId && u.id === userId) || (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail));

      return res.status(200).json({
        success: true,
        user: user ? (({ passwordHash, ...s }) => s)(user) : null,
        storeData: storeData
      });
    }

    // 6. ADMIN: TÜM KULLANICILARI LİSTELEME (Süper Yönetici Paneli)
    if (action === 'admin-get-users') {
      const enrichedUsers = db.users.map(({ passwordHash, ...u }) => {
        const uStore = (u.email && db.userStoreData[u.email.toLowerCase()]) || db.userStoreData[u.id] || {};
        return {
          ...u,
          ordersCount: Array.isArray(uStore.orders) ? uStore.orders.length : (u.ordersCount || 0),
          productsCount: Array.isArray(uStore.products) ? uStore.products.length : (u.productsCount || 0),
          hasApiConnected: !!(uStore.credentials && (uStore.credentials.tyApiKey || uStore.credentials.apiKey || uStore.credentials.hbMerchantId))
        };
      });

      return res.status(200).json({
        success: true,
        users: enrichedUsers,
        total: enrichedUsers.length
      });
    }

    // 7. ADMIN: KULLANICIYI GÜNCELLEME (Lisans Uzatma, Yetki, Dondurma)
    if (action === 'admin-update-user') {
      const { userId, updates } = body;
      const userIdx = db.users.findIndex(u => u.id === userId || (u.email && u.email.toLowerCase() === (userId || '').toLowerCase()));
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
      db.users = db.users.filter(u => u.id !== userId && u.email !== userId && u.email?.toLowerCase() !== userId?.toLowerCase());
      if (userId) {
        delete db.userStoreData[userId];
        delete db.userStoreData[userId.toLowerCase()];
      }
      saveDb(db);

      return res.status(200).json({
        success: true,
        deleted: db.users.length < initialCount,
        message: 'Kullanıcı hesabı ve tüm bulut verileri başarıyla silindi.'
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
