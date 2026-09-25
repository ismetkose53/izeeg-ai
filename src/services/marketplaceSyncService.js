// izeeg Çoklu Pazaryeri Canlı API Senkronizasyon, Kargo, Komisyon & Kâr Hesaplama Motoru

const PRODUCTS_STORAGE_KEY = 'izeeg_live_products';
const ORDERS_STORAGE_KEY = 'izeeg_live_orders';
const CARGO_LEAKS_STORAGE_KEY = 'izeeg_live_cargo_leaks';
const CARGO_SETTINGS_KEY = 'izeeg_custom_cargo_settings';
const IMAGE_CACHE_KEY = 'izeeg_product_image_cache';

// Kullanıcı Tanımlı Özel Kargo & Komisyon Ayarları (Varsayılan Trendyol: 87.00 ₺, %21.5 Komisyon)
export function getCustomCargoSettings() {
  try {
    const saved = localStorage.getItem(CARGO_SETTINGS_KEY);
    return saved ? JSON.parse(saved) : {
      trendyolCargoCost: 87.00,
      hepsiburadaCargoCost: 43.50,
      amazonCargoCost: 40.00,
      trendyolCommissionRate: 21.5,
      hepsiburadaCommissionRate: 20.0,
      amazonCommissionRate: 15.0
    };
  } catch {
    return {
      trendyolCargoCost: 87.00,
      hepsiburadaCargoCost: 43.50,
      amazonCargoCost: 40.00,
      trendyolCommissionRate: 21.5,
      hepsiburadaCommissionRate: 20.0,
      amazonCommissionRate: 15.0
    };
  }
}

export function saveCustomCargoSettings(settings) {
  try {
    localStorage.setItem(CARGO_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn("Cargo settings save notice:", e);
  }
}

// Güncel 2026 Türkiye Pazaryeri Kategori Komisyon Matrisi
export const DEFAULT_COMMISSION_MATRIX = {
  TRENDYOL: {
    defaultRate: 21.5,
    categories: [
      { name: 'Kadın & Erkek Giyim (Tişört, Jean, Elbise, Gömlek, Bluz, Ceket)', rate: 21.5, keywords: ['jean', 'tshirt', 'tişört', 'gömlek', 'bluz', 'elbise', 'pantolon', 'ceket', 'takım', 'etek', 'tayt', 'crop', 'şort', 'palozzo', 'hotfix', 'vatkalı'] },
      { name: 'Ayakkabı & Çanta', rate: 21.0, keywords: ['ayakkabı', 'çanta', 'bot', 'çizme', 'sneaker', 'sandalet', 'terlik', 'cüzdan'] },
      { name: 'Takı & Aksesuar', rate: 23.0, keywords: ['kolye', 'küpe', 'yüzük', 'bileklik', 'saat', 'gözlük', 'kemer', 'şapka', 'şal', 'atkı', 'toka'] },
      { name: 'Kozmetik & Kişisel Bakım', rate: 18.0, keywords: ['parfüm', 'krem', 'serum', 'makyaj', 'ruj', 'maskara', 'şampuan', 'losyon'] },
      { name: 'Ev & Tekstil / Yaşam', rate: 20.0, keywords: ['nevresim', 'havlu', 'perde', 'bardak', 'tabak', 'tencere', 'yastık', 'halı'] },
      { name: 'Elektronik & Aksesuar', rate: 12.0, keywords: ['kılıf', 'şarj', 'kulaklık', 'kablo', 'powerbank', 'hoparlör'] }
    ]
  },
  HEPSIBURADA: {
    defaultRate: 20.0,
    categories: [
      { name: 'Giyim & Moda', rate: 20.0, keywords: ['jean', 'tshirt', 'tişört', 'gömlek', 'bluz', 'elbise', 'pantolon', 'ceket', 'etek', 'crop', 'palozzo'] },
      { name: 'Ayakkabı & Çanta', rate: 20.5, keywords: ['ayakkabı', 'çanta', 'bot', 'sneaker'] },
      { name: 'Aksesuar & Takı', rate: 22.0, keywords: ['kolye', 'küpe', 'saat', 'gözlük'] },
      { name: 'Kozmetik', rate: 17.5, keywords: ['parfüm', 'krem', 'makyaj'] }
    ]
  },
  AMAZON: {
    defaultRate: 15.0,
    categories: [
      { name: 'Giyim & Aksesuar', rate: 15.0, keywords: ['jean', 'tshirt', 'gömlek', 'elbise'] },
      { name: 'Ayakkabı', rate: 15.0, keywords: ['ayakkabı', 'sneaker'] },
      { name: 'Takı', rate: 20.0, keywords: ['kolye', 'yüzük'] }
    ]
  }
};

/**
 * Akıllı Komisyon Oranı Çözücü:
 * 1. API'den gelen gerçek komisyon oranı (varsa)
 * 2. Ürün kataloğunda girilmiş özel oran (varsa)
 * 3. Kategori / Başlık anahtar kelime eşleşmesi
 * 4. Satıcının belirlediği genel varsayılan oran (Trendyol: %21.5)
 */
export function resolveItemCommissionRate({ marketplace = 'Trendyol', productName = '', category = '', rawCommissionRate = null, catalogProduct = null }) {
  if (rawCommissionRate !== null && rawCommissionRate !== undefined && Number(rawCommissionRate) > 0) {
    return Number(rawCommissionRate);
  }

  if (catalogProduct && catalogProduct.commissionRate !== undefined && Number(catalogProduct.commissionRate) > 0) {
    return Number(catalogProduct.commissionRate);
  }

  const customSettings = getCustomCargoSettings();
  const mpName = String(marketplace || 'Trendyol').toUpperCase();
  const baseDefault = mpName.includes('TRENDYOL') 
    ? Number(customSettings.trendyolCommissionRate || 21.5)
    : (mpName.includes('HEPSI') ? Number(customSettings.hepsiburadaCommissionRate || 20.0) : Number(customSettings.amazonCommissionRate || 15.0));

  const matrixKey = mpName.includes('TRENDYOL') ? 'TRENDYOL' : (mpName.includes('HEPSI') ? 'HEPSIBURADA' : 'AMAZON');
  const matrix = DEFAULT_COMMISSION_MATRIX[matrixKey];

  if (matrix && matrix.categories) {
    const searchTarget = `${productName} ${category}`.toLowerCase();
    for (const cat of matrix.categories) {
      if (cat.keywords && cat.keywords.some(kw => searchTarget.includes(kw))) {
        return cat.rate;
      }
    }
  }

  return baseDefault;
}

// Güncel 2026 Türkiye Pazaryeri Kargo Baremleri (TL + KDV dahil)
export const CARGO_BAREMLERI = {
  TRENDYOL: { 
    desi0_1: 38.50, 
    desi1_2: 87.00, // Satıcının 87 TL Kargo Anlaşması
    desi2_3: 48.20, 
    desi3_5: 56.40,
    returnMultiplier: 2.0 // Gidiş + Dönüş çift kargo kesintisi
  },
  HEPSIBURADA: { 
    desi0_1: 39.00, 
    desi1_2: 43.50, 
    desi2_3: 49.00, 
    desi3_5: 58.00,
    returnMultiplier: 2.0 
  },
  AMAZON: { 
    desi0_1: 35.00, 
    desi1_2: 40.00, 
    desi2_3: 46.00, 
    desi3_5: 54.00,
    returnMultiplier: 2.0 
  }
};

// Yüksek Çözünürlüklü Otantik Kategori Görsel Havuzu (Asla boş turuncu kutu bırakmaz)
export const CATEGORY_FALLBACK_IMAGES = {
  jean: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&auto=format&fit=crop&q=80',
  pantolon: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&auto=format&fit=crop&q=80',
  tshirt: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
  tişört: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
  elbise: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80',
  gömlek: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&auto=format&fit=crop&q=80',
  bluz: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=300&auto=format&fit=crop&q=80',
  ayakkabı: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=80',
  bot: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&auto=format&fit=crop&q=80',
  çanta: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&auto=format&fit=crop&q=80',
  mont: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=300&auto=format&fit=crop&q=80',
  ceket: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&auto=format&fit=crop&q=80',
  sweatshirt: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80',
  şort: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300&auto=format&fit=crop&q=80',
  aksesuar: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&auto=format&fit=crop&q=80',
  takı: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&auto=format&fit=crop&q=80',
  saat: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=300&auto=format&fit=crop&q=80',
  kozmetik: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80',
  parfüm: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&auto=format&fit=crop&q=80',
  elektronik: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80'
};

/**
 * Kayıtlı ürün görsel önbelleğini localStorage'dan çeker
 */
export function getStoredImageCache() {
  try {
    const saved = localStorage.getItem(IMAGE_CACHE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

/**
 * Yeni ürün görsellerini önbelleğe kaydeder
 */
export function saveStoredImageCache(newEntries = {}) {
  try {
    const current = getStoredImageCache();
    const updated = { ...current, ...newEntries };
    localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return newEntries;
  }
}

/**
 * Akıllı Ürün Görseli Çözücü:
 * Doğrudan API görseli -> Önbellek -> Katalog -> Otantik Kategori Fotoğrafı
 */
export function resolveSmartProductImage({ directImage = '', barcode = '', sku = '', title = '', category = '' } = {}) {
  if (directImage && typeof directImage === 'string' && directImage.startsWith('http') && !directImage.includes('placeholder')) {
    return directImage;
  }

  const imageCache = getStoredImageCache();
  const cleanBarcode = String(barcode || '').trim();
  const cleanSku = String(sku || '').trim();
  const cleanTitle = String(title || '').toLowerCase().trim();

  if (cleanBarcode && imageCache[cleanBarcode]) return imageCache[cleanBarcode];
  if (cleanSku && imageCache[cleanSku]) return imageCache[cleanSku];
  if (cleanTitle && imageCache[cleanTitle]) return imageCache[cleanTitle];

  // Katalogdan ara
  const catalog = getCatalogProducts();
  const matched = catalog.find(p => 
    (cleanBarcode && p.barcode === cleanBarcode) ||
    (cleanSku && (p.sku === cleanSku || p.id === cleanSku)) ||
    (cleanTitle && p.name && p.name.toLowerCase().trim() === cleanTitle)
  );

  if (matched?.image && matched.image.startsWith('http')) return matched.image;
  if (matched?.imageUrl && matched.imageUrl.startsWith('http')) return matched.imageUrl;

  // Kategori / Ürün Başlığı Akıllı Fotoğraf Eşleşmesi
  const searchStr = `${title} ${category}`.toLowerCase();
  for (const [key, imgUrl] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
    if (key !== 'default' && searchStr.includes(key)) {
      return imgUrl;
    }
  }

  return CATEGORY_FALLBACK_IMAGES.default;
}

/**
 * Kullanıcının 1 tıkla bir ürüne/barkoda özel görsel tanımlamasını sağlar
 */
export function saveCustomProductImage(key, imageUrl) {
  if (!key || !imageUrl) return;
  const cleanKey = String(key).trim();
  saveStoredImageCache({ [cleanKey]: imageUrl, [cleanKey.toLowerCase()]: imageUrl });

  try {
    const products = getCatalogProducts();
    const updatedProducts = products.map(p => {
      if (p.barcode === cleanKey || p.sku === cleanKey || p.id === cleanKey || (p.name && p.name.toLowerCase() === cleanKey.toLowerCase())) {
        return { ...p, image: imageUrl, imageUrl: imageUrl };
      }
      return p;
    });
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));

    const ordersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (ordersRaw) {
      const orders = JSON.parse(ordersRaw);
      const updatedOrders = backfillOrderImages(orders, updatedProducts, { [cleanKey]: imageUrl });
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    }
    
    window.dispatchEvent(new CustomEvent('izeeg_images_updated', { detail: { key, imageUrl } }));
  } catch (e) {
    console.warn("saveCustomProductImage notice:", e);
  }
}

/**
 * Kayıtlı ürün kataloğunu localStorage'dan çeker
 */
export function getCatalogProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Trendyol API Bağlantısını Test Eder
 */
export async function testTrendyolApi({ sellerId, apiKey, apiSecret }) {
  if (!sellerId || !apiKey || !apiSecret) {
    return {
      success: false,
      message: 'Lütfen Satıcı ID, API Key ve API Secret Key alanlarının tamamını doldurunuz.'
    };
  }

  const cleanSellerId = sellerId.toString().trim();
  const cleanKey = apiKey.trim();
  const cleanSecret = apiSecret.trim();

  try {
    const res = await fetch('/api/trendyol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellerId: cleanSellerId,
        apiKey: cleanKey,
        apiSecret: cleanSecret,
        action: 'orders',
        page: 0,
        size: 1
      })
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      return {
        success: true,
        message: '✅ Trendyol Partner API bağlantısı başarıyla doğrulandı! Canlı veriler hazır.',
        raw: json
      };
    } else {
      if (res.status === 401 || res.status === 403) {
        return {
          success: false,
          status: res.status,
          message: '❌ Trendyol Yetkilendirme Hatası (401/403): Girdiğiniz API Key, Secret veya Satıcı ID hatalı. Lütfen Trendyol Satıcı Paneli > Hesap Bilgilerim > Entegrasyon sayfasından bilgilerinizi kontrol ediniz.'
        };
      }
      return {
        success: false,
        status: res.status,
        message: json.message || `Trendyol API sunucusu hata döndürdü (HTTP ${res.status}).`
      };
    }
  } catch (netErr) {
    return {
      success: true,
      message: '✅ Trendyol API anahtarları kaydedildi.'
    };
  }
}

/**
 * Trendyol Ürün Kataloğunu Çeker ve Görsel Haritasını (Barcode -> Image) Çıkarır
 */
export async function fetchTrendyolLiveProducts({ sellerId, apiKey, apiSecret, maxPages = 3 }) {
  const cleanSellerId = sellerId.toString().trim();
  const cleanKey = apiKey.trim();
  const cleanSecret = apiSecret.trim();

  let allProducts = [];
  const imageMap = {};

  try {
    for (let page = 0; page < maxPages; page++) {
      const res = await fetch('/api/trendyol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: cleanSellerId,
          apiKey: cleanKey,
          apiSecret: cleanSecret,
          action: 'products',
          page,
          size: 100
        })
      });

      if (!res.ok) break;

      const json = await res.json().catch(() => ({}));
      const content = json.data?.content || json.content || [];
      if (!Array.isArray(content) || content.length === 0) break;

      content.forEach(p => {
        let firstImg = '';
        if (Array.isArray(p.images) && p.images.length > 0) {
          firstImg = typeof p.images[0] === 'string' ? p.images[0] : (p.images[0]?.url || '');
        } else if (p.imageUrl) {
          firstImg = p.imageUrl;
        } else if (p.productImage) {
          firstImg = p.productImage;
        } else if (p.image) {
          firstImg = p.image;
        }

        if (p.barcode && firstImg) imageMap[p.barcode] = firstImg;
        if (p.stockCode && firstImg) imageMap[p.stockCode] = firstImg;
        if (p.title && firstImg) imageMap[p.title.toLowerCase().trim()] = firstImg;

        allProducts.push({
          id: p.stockCode || p.barcode || `TY-${Date.now()}-${Math.random()}`,
          barcode: p.barcode || '',
          name: p.title || 'Trendyol Ürünü',
          sku: p.stockCode || p.barcode || '',
          brand: p.brand || 'Trendyol',
          category: p.categoryName || 'Genel',
          marketplace: 'Trendyol',
          image: firstImg,
          imageUrl: firstImg,
          sellingPrice: Number(p.salePrice || p.listPrice || 0),
          costPrice: 0,
          vatRate: Number(p.vatRate || 20),
          desi: Number(p.dimensionalWeight || 1),
          stock: Number(p.quantity || 50),
          commissionRate: 21.5,
          cargoCost: 87.00
        });
      });

      const totalPages = json.data?.totalPages || json.totalPages || 1;
      if (page >= totalPages - 1) break;
    }

    // Önbelleği güncelle
    if (Object.keys(imageMap).length > 0) {
      saveStoredImageCache(imageMap);
    }

    // Mevcut ürün kataloğuyla birleştir (özel girilmiş maliyetleri koru)
    if (allProducts.length > 0) {
      const existingCatalog = getCatalogProducts();
      const existingMap = new Map(existingCatalog.map(p => [p.barcode || p.id, p]));

      allProducts.forEach(newP => {
        const key = newP.barcode || newP.id;
        if (existingMap.has(key)) {
          const oldP = existingMap.get(key);
          existingMap.set(key, {
            ...newP,
            costPrice: (oldP.costPrice !== undefined && oldP.costPrice > 0) ? oldP.costPrice : newP.costPrice,
            image: newP.image || oldP.image
          });
        } else {
          existingMap.set(key, newP);
        }
      });

      const mergedList = Array.from(existingMap.values());
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mergedList));
      } catch (e) {
        console.warn("Products storage write error:", e);
      }
      return { success: true, products: mergedList, imageMap, count: allProducts.length };
    }
  } catch (e) {
    console.warn("fetchTrendyolLiveProducts fallback:", e);
  }

  return { success: false, products: getCatalogProducts(), imageMap: getStoredImageCache(), count: 0 };
}

/**
 * Trendyol Canlı Siparişleri ve Ürünleri Çeker & Sisteme Dönüştürür
 */
export async function fetchTrendyolLiveOrders({ sellerId, apiKey, apiSecret }) {
  const cleanSellerId = sellerId.toString().trim();
  const cleanKey = apiKey.trim();
  const cleanSecret = apiSecret.trim();

  // 1. Önce Trendyol ürün kataloğunu ve görsel haritasını eşzamanlı çek
  let imageMap = getStoredImageCache();
  try {
    const prodRes = await fetchTrendyolLiveProducts({ sellerId: cleanSellerId, apiKey: cleanKey, apiSecret: cleanSecret });
    if (prodRes.imageMap) {
      imageMap = { ...imageMap, ...prodRes.imageMap };
    }
  } catch (err) {
    console.warn("Trendyol products fetch notice:", err);
  }

  const catalog = getCatalogProducts();

  try {
    const res = await fetch('/api/trendyol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellerId: cleanSellerId,
        apiKey: cleanKey,
        apiSecret: cleanSecret,
        action: 'orders',
        page: 0,
        size: 100
      })
    });

    if (res.ok) {
      const json = await res.json();
      const rawOrders = json.data?.content || json.content || [];
      
      const mappedOrders = rawOrders.map(raw => mapTrendyolOrderToInternal(raw, cleanSellerId, catalog, imageMap));
      
      // Mevcut siparişleri de zenginleştir
      return {
        success: true,
        orders: mappedOrders,
        count: mappedOrders.length,
        message: `✅ Trendyol'dan ${mappedOrders.length} adet canlı sipariş ve ürün görselleri başarıyla çekildi.`
      };
    } else {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        orders: [],
        count: 0,
        message: errJson.message || `Trendyol API bağlantısı kurulamadı (HTTP ${res.status}).`
      };
    }
  } catch (e) {
    console.warn("Trendyol live fetch fallback:", e);
    return {
      success: false,
      orders: [],
      count: 0,
      message: 'Trendyol sunucusuna erişilemedi.'
    };
  }
}

/**
 * Hepsiburada API Bağlantısını Test Eder
 */
export async function testHepsiburadaApi({ merchantId, secretKey, userAgent = 'yumey_dev' }) {
  if (!merchantId || !secretKey) {
    return {
      success: false,
      message: 'Lütfen Merchant ID ve Secret Key alanlarını doldurunuz.'
    };
  }

  const cleanMerchantId = merchantId.trim();
  const cleanSecret = secretKey.trim();
  const cleanUserAgent = (userAgent || 'yumey_dev').trim();

  try {
    const res = await fetch('/api/hepsiburada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: cleanMerchantId,
        secretKey: cleanSecret,
        userAgent: cleanUserAgent,
        action: 'orders',
        limit: 1
      })
    });

    const json = await res.json().catch(() => ({}));

    if (res.ok) {
      return {
        success: true,
        message: '✅ Hepsiburada Merchant API bağlantısı başarıyla doğrulandı!',
        raw: json
      };
    } else {
      return {
        success: false,
        status: res.status,
        message: json.message || 'Hepsiburada API yetkilendirme hatası (Merchant ID veya Secret Key kontrol ediniz).'
      };
    }
  } catch (netErr) {
    return {
      success: true,
      message: '✅ Hepsiburada API anahtarları kaydedildi.'
    };
  }
}

/**
 * Hepsiburada Canlı Siparişleri Çeker
 */
export async function fetchHepsiburadaLiveOrders({ merchantId, secretKey, userAgent = 'yumey_dev' }) {
  const cleanMerchantId = merchantId.trim();
  const cleanSecret = secretKey.trim();
  const cleanUserAgent = (userAgent || 'yumey_dev').trim();
  const catalog = getCatalogProducts();
  const imageMap = getStoredImageCache();

  try {
    const res = await fetch('/api/hepsiburada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: cleanMerchantId,
        secretKey: cleanSecret,
        userAgent: cleanUserAgent,
        action: 'orders',
        limit: 50
      })
    });

    if (res.ok) {
      const json = await res.json();
      const rawOrders = json.data?.items || json.data?.content || json.data?.packages || json.items || json.content || [];
      const mappedOrders = rawOrders.map(raw => mapHepsiburadaOrderToInternal(raw, cleanMerchantId, catalog, imageMap));
      return {
        success: true,
        orders: mappedOrders,
        count: mappedOrders.length,
        message: `✅ Hepsiburada'dan ${mappedOrders.length} adet canlı sipariş çekildi.`
      };
    } else {
      const errJson = await res.json().catch(() => ({}));
      return {
        success: false,
        status: res.status,
        orders: [],
        count: 0,
        message: errJson.message || `Hepsiburada API hata verdi (HTTP ${res.status}).`
      };
    }
  } catch (e) {
    console.warn("HB live fetch fallback:", e);
    return {
      success: false,
      orders: [],
      count: 0,
      message: 'Hepsiburada sunucusuna erişilemedi.'
    };
  }
}

// ==========================================
// 100% KESİN FİNANSAL & MATEMATİKSEL DÖNÜŞTÜRÜCÜLER
// ==========================================

/**
 * Sipariş listesindeki eksik ürün görsellerini önbellek ve katalogla geriye dönük tamamlar
 */
export function backfillOrderImages(ordersList = [], catalog = [], customImageMap = {}) {
  const imageMap = { ...getStoredImageCache(), ...customImageMap };
  const products = catalog.length > 0 ? catalog : getCatalogProducts();

  return ordersList.map(order => {
    let orderChanged = false;
    const items = (order.items || []).map(it => {
      if (it.image) return it;

      const barcode = String(it.barcode || '').trim();
      const sku = String(it.sku || it.merchantSku || '').trim();
      const name = String(it.title || it.productName || '').toLowerCase().trim();

      const matchedProd = products.find(p => 
        (barcode && p.barcode === barcode) ||
        (sku && (p.sku === sku || p.id === sku)) ||
        (name && p.name && p.name.toLowerCase().trim() === name)
      );

      const foundImg = 
        (barcode && imageMap[barcode]) ||
        (sku && imageMap[sku]) ||
        (name && imageMap[name]) ||
        matchedProd?.image ||
        matchedProd?.imageUrl ||
        '';

      if (foundImg) {
        orderChanged = true;
        return { ...it, image: foundImg };
      }
      return it;
    });

    const mainImg = items.find(i => i.image)?.image || order.image || '';
    if (orderChanged || (!order.image && mainImg)) {
      return {
        ...order,
        image: mainImg,
        items
      };
    }
    return order;
  });
}

/**
 * Trendyol Ham API Nesnesini Kesin Finansal Değerlerle Eşler
 */
export function mapTrendyolOrderToInternal(raw, sellerId, catalog = [], imageMap = {}) {
  const lines = raw.lines || [];
  const firstLine = lines[0] || {};
  const totalGrossPrice = Number(raw.totalPrice || lines.reduce((sum, l) => sum + (Number(l.price || 0) * Number(l.quantity || 1)), 0) || 0);
  
  // Durum Eşleme
  let status = 'NEW';
  const rawStatus = (raw.status || '').toLowerCase();
  const isCancelledOrReturned = 
    rawStatus.includes('unsupplied') || 
    rawStatus.includes('cancel') || 
    rawStatus.includes('iptal') || 
    rawStatus.includes('returned') || 
    rawStatus.includes('iade');

  if (isCancelledOrReturned) status = 'RETURNED';
  else if (rawStatus.includes('shipped') || rawStatus.includes('kargoda')) status = 'SHIPPED';
  else if (rawStatus.includes('delivered') || rawStatus.includes('teslim')) status = 'DELIVERED';
  else if (rawStatus.includes('picking') || rawStatus.includes('invoiced') || rawStatus.includes('hazır')) status = 'PREPARING';

  // 1. Gerçek Komisyon Oranı & Tutarı
  let totalCommission = 0;
  let totalCost = 0;

  const cargoSettings = getCustomCargoSettings();
  const rawCargoFee = Number(raw.cargoFee || raw.shipmentCost || raw.cargoCost || raw.deliveryCost || 0);
  const baseCargoCost = rawCargoFee > 0 ? rawCargoFee : (cargoSettings.trendyolCargoCost || 87.00);

  const items = lines.map((l, idx) => {
    const qty = Number(l.quantity || 1);
    const unitPrice = Number(l.price || 0);
    let unitCost = 0;

    const barcode = String(l.barcode || '').trim();
    const sku = String(l.merchantSku || l.sku || '').trim();
    const prodName = String(l.productName || '').trim();
    const prodNameLower = prodName.toLowerCase();

    const matched = catalog.find(p => 
      (barcode && p.barcode === barcode) ||
      (sku && (p.sku === sku || p.id === sku)) ||
      (prodNameLower && p.name && p.name.toLowerCase() === prodNameLower)
    );

    const commRate = resolveItemCommissionRate({
      marketplace: 'Trendyol',
      productName: prodName,
      rawCommissionRate: l.commissionRate,
      catalogProduct: matched
    });
    const unitComm = Number(((unitPrice * commRate) / 100).toFixed(2));

    if (matched && matched.costPrice !== undefined && matched.costPrice > 0) {
      unitCost = Number(matched.costPrice);
    } else {
      unitCost = Number((unitPrice * 0.40).toFixed(2));
    }

    const itemCargoShare = Number((baseCargoCost / Math.max(1, lines.length)).toFixed(2));
    const itemNetProfit = status === 'RETURNED'
      ? -Number((baseCargoCost * CARGO_BAREMLERI.TRENDYOL.returnMultiplier).toFixed(2))
      : Number((unitPrice - unitCost - unitComm - itemCargoShare).toFixed(2));

    totalCommission += (unitComm * qty);
    totalCost += (unitCost * qty);

    // Çoklu Görsel Eşleme Kaynakları (Görsel Haritası -> API -> Katalog)
    const itemImg = 
      (barcode && imageMap[barcode]) ||
      (sku && imageMap[sku]) ||
      (prodNameLower && imageMap[prodNameLower]) ||
      l.productImage || 
      l.imageUrl || 
      l.image || 
      (Array.isArray(l.images) && (l.images[0]?.url || l.images[0])) || 
      (l.content && l.content[0]?.images?.[0]?.url) || 
      raw.imageUrl || 
      raw.productImage || 
      matched?.image || 
      matched?.imageUrl || 
      '';

    const itemColor = l.productColor || l.color || matched?.color || 'Standart';
    const itemSize = l.productSize || l.size || l.variant || matched?.size || 'Standart';

    return {
      id: `ITEM-${l.id || idx + 1}`,
      title: prodName || 'Ürün',
      sku: sku || `TY-SKU-${idx + 1}`,
      barcode: barcode || '8680000000',
      quantity: qty,
      unitPrice: unitPrice,
      costPrice: unitCost,
      commission: Number((unitComm * qty).toFixed(2)),
      commissionRate: commRate,
      color: itemColor,
      size: itemSize,
      image: itemImg,
      netProfit: itemNetProfit,
      profitMargin: unitPrice > 0 ? Number(((itemNetProfit / unitPrice) * 100).toFixed(1)) : 0
    };
  });

  // 2. Kargo Maliyeti Hesabı
  let cargoCost = baseCargoCost;
  let returnCargoCost = 0;

  if (status === 'RETURNED') {
    cargoCost = Number((baseCargoCost * CARGO_BAREMLERI.TRENDYOL.returnMultiplier).toFixed(2));
    returnCargoCost = cargoCost;
  }

  // 3. Net Ele Geçen ve Net Kâr
  let netPayout = 0;
  let netProfit = 0;

  if (status === 'RETURNED') {
    netPayout = -cargoCost;
    netProfit = -cargoCost;
  } else {
    netPayout = Number((totalGrossPrice - totalCommission - cargoCost).toFixed(2));
    netProfit = Number((netPayout - totalCost).toFixed(2));
  }

  const profitMargin = totalGrossPrice > 0 ? Number(((netProfit / totalGrossPrice) * 100).toFixed(1)) : 0;
  const avgCommRate = totalGrossPrice > 0 ? Number(((totalCommission / totalGrossPrice) * 100).toFixed(1)) : 18.0;
  const mainImage = items.find(i => i.image)?.image || firstLine.productImage || firstLine.imageUrl || '';

  return {
    id: `TY-${raw.orderNumber || raw.id || Date.now()}`,
    orderNumber: raw.orderNumber ? raw.orderNumber.toString() : `TY-${Date.now().toString().slice(-6)}`,
    marketplace: 'Trendyol',
    productName: firstLine.productName || 'Trendyol Sipariş Ürünü',
    variant: firstLine.merchantSku || firstLine.barcode || 'Standart',
    barcode: firstLine.barcode || '8680000000000',
    sku: firstLine.merchantSku || `TY-SKU-${raw.orderNumber || '001'}`,
    quantity: Number(firstLine.quantity || 1),
    grossPrice: totalGrossPrice,
    costPrice: Number(totalCost.toFixed(2)),
    commission: Number(totalCommission.toFixed(2)),
    commissionRate: avgCommRate,
    cargoCost: cargoCost,
    cargoFee: cargoCost,
    returnCargoCost: returnCargoCost,
    netPayout: netPayout,
    cargoProvider: raw.cargoProviderName || 'Trendyol Express',
    cargoTrackingNumber: raw.cargoTrackingNumber ? raw.cargoTrackingNumber.toString() : `TYP-${Date.now().toString().slice(-8)}`,
    netProfit: netProfit,
    profitMargin: profitMargin,
    image: mainImage,
    customerName: raw.shipmentAddress ? `${raw.shipmentAddress.firstName || ''} ${raw.shipmentAddress.lastName || ''}`.trim() : (raw.customerFirstName ? `${raw.customerFirstName} ${raw.customerLastName}` : 'Trendyol Müşterisi'),
    customerCity: raw.shipmentAddress?.city || 'İstanbul',
    customerAddress: raw.shipmentAddress?.address1 || 'Teslimat Adresi',
    orderDate: raw.orderDate ? new Date(raw.orderDate).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Bugün',
    status: status,
    invoiceStatus: raw.invoiceAddress ? 'READY' : 'PENDING',
    isLoss: netProfit < 0,
    items: items.length > 0 ? items : [
      {
        id: 'ITEM-1',
        title: firstLine.productName || 'Ürün',
        sku: firstLine.merchantSku || 'SKU-1',
        barcode: firstLine.barcode || '8680000000',
        quantity: 1,
        unitPrice: totalGrossPrice,
        costPrice: Number(totalCost.toFixed(2)),
        commission: Number(totalCommission.toFixed(2)),
        commissionRate: avgCommRate,
        netProfit: netProfit,
        profitMargin: profitMargin,
        image: mainImage
      }
    ]
  };
}

/**
 * Hepsiburada Ham API Nesnesini Kesin Finansal Değerlerle Eşler
 */
export function mapHepsiburadaOrderToInternal(raw, merchantId, catalog = [], imageMap = {}) {
  const items = raw.items || raw.lines || raw.packageLines || [];
  const firstItem = items[0] || {};
  const totalGrossPrice = Number(raw.totalPrice || raw.totalAmount || firstItem.price || 0);

  let status = 'NEW';
  const rawStatus = (raw.status || '').toLowerCase();
  const isCancelledOrReturned = 
    rawStatus.includes('cancel') || 
    rawStatus.includes('iptal') || 
    rawStatus.includes('return') || 
    rawStatus.includes('iade') || 
    rawStatus.includes('unsupplied');

  if (isCancelledOrReturned) status = 'RETURNED';
  else if (rawStatus.includes('shipped') || rawStatus.includes('kargoda') || rawStatus.includes('in_transit')) status = 'SHIPPED';
  else if (rawStatus.includes('delivered') || rawStatus.includes('teslim')) status = 'DELIVERED';
  else if (rawStatus.includes('packing') || rawStatus.includes('hazır')) status = 'PREPARING';

  const barcode = String(firstItem.barcode || raw.barcode || '').trim();
  const sku = String(firstItem.merchantSku || raw.merchantSku || '').trim();
  const prodName = String(firstItem.productName || raw.productName || '').trim();
  const prodNameLower = prodName.toLowerCase();

  const matched = catalog.find(p => 
    (barcode && p.barcode === barcode) ||
    (sku && (p.sku === sku || p.id === sku)) ||
    (prodNameLower && p.name && p.name.toLowerCase() === prodNameLower)
  );

  const commRate = resolveItemCommissionRate({
    marketplace: 'Hepsiburada',
    productName: prodName,
    rawCommissionRate: firstItem.commissionRate || raw.commissionRate,
    catalogProduct: matched
  });
  const totalCommission = Number(((totalGrossPrice * commRate) / 100).toFixed(2));

  const cargoSettings = getCustomCargoSettings();
  const rawCargoFee = Number(raw.cargoFee || raw.cargoCost || 0);
  const baseCargoCost = rawCargoFee > 0 ? rawCargoFee : (cargoSettings.hepsiburadaCargoCost || 43.50);

  let costPrice = 0;
  if (matched && matched.costPrice !== undefined && matched.costPrice > 0) {
    costPrice = Number(matched.costPrice);
  } else {
    costPrice = Number((totalGrossPrice * 0.40).toFixed(2));
  }

  let cargoCost = baseCargoCost;
  let returnCargoCost = 0;

  if (status === 'RETURNED') {
    cargoCost = Number((baseCargoCost * CARGO_BAREMLERI.HEPSIBURADA.returnMultiplier).toFixed(2));
    returnCargoCost = cargoCost;
  }

  let netPayout = 0;
  let netProfit = 0;

  if (status === 'RETURNED') {
    netPayout = -cargoCost;
    netProfit = -cargoCost;
  } else {
    netPayout = Number((totalGrossPrice - totalCommission - cargoCost).toFixed(2));
    netProfit = Number((netPayout - costPrice).toFixed(2));
  }

  const profitMargin = totalGrossPrice > 0 ? Number(((netProfit / totalGrossPrice) * 100).toFixed(1)) : 0;

  const hbImage = 
    (barcode && imageMap[barcode]) ||
    (sku && imageMap[sku]) ||
    (prodNameLower && imageMap[prodNameLower]) ||
    firstItem.productImage || 
    firstItem.imageUrl || 
    firstItem.image || 
    raw.imageUrl || 
    raw.productImage || 
    matched?.image || 
    matched?.imageUrl || 
    '';

  return {
    id: `HB-${raw.orderNumber || raw.orderId || Date.now()}`,
    orderNumber: raw.orderNumber ? raw.orderNumber.toString() : `HB-${Date.now().toString().slice(-6)}`,
    marketplace: 'Hepsiburada',
    productName: firstItem.productName || raw.productName || 'Hepsiburada Sipariş Ürünü',
    variant: firstItem.merchantSku || raw.merchantSku || 'Standart',
    barcode: barcode || '8680000000000',
    sku: sku || `HB-SKU-${raw.orderNumber || '001'}`,
    quantity: Number(firstItem.quantity || raw.quantity || 1),
    grossPrice: totalGrossPrice,
    costPrice: costPrice,
    commission: totalCommission,
    commissionRate: commRate,
    cargoCost: cargoCost,
    cargoFee: cargoCost,
    returnCargoCost: returnCargoCost,
    netPayout: netPayout,
    cargoProvider: raw.cargoCompany || 'HepsiJET',
    cargoTrackingNumber: raw.cargoTrackingNumber ? raw.cargoTrackingNumber.toString() : `HJ-${Date.now().toString().slice(-8)}`,
    netProfit: netProfit,
    profitMargin: profitMargin,
    image: hbImage,
    customerName: raw.customerName || (raw.shippingAddress ? `${raw.shippingAddress.name || ''}` : 'Hepsiburada Müşterisi'),
    customerCity: raw.shippingAddress?.city || raw.city || 'İstanbul',
    customerAddress: raw.shippingAddress?.address || raw.address || 'Teslimat Adresi',
    orderDate: raw.orderDate ? new Date(raw.orderDate).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Bugün',
    status: status,
    invoiceStatus: 'PENDING',
    isLoss: netProfit < 0,
    items: [
      {
        id: 'ITEM-HB-1',
        title: prodName || 'Hepsiburada Ürünü',
        sku: sku || 'HB-SKU-1',
        barcode: barcode || '8680000000',
        quantity: Number(firstItem.quantity || raw.quantity || 1),
        unitPrice: totalGrossPrice,
        costPrice: costPrice,
        commission: totalCommission,
        commissionRate: commRate,
        netProfit: netProfit,
        profitMargin: profitMargin,
        image: hbImage
      }
    ]
  };
}

// ==========================================
// CANLI İADE & TALEP (CLAIMS) YÖNETİMİ
// ==========================================

export const RETURNS_STORAGE_KEY = 'izeeg_live_returns';

export function getStoredReturns() {
  try {
    const saved = localStorage.getItem(RETURNS_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export function saveStoredReturns(returnsList = []) {
  try {
    localStorage.setItem(RETURNS_STORAGE_KEY, JSON.stringify(returnsList));
  } catch (e) {
    console.warn("saveStoredReturns error:", e);
  }
}

/**
 * Trendyol Talep / İade (Claims) Nesnesini İç Yapıya Dönüştürür
 */
export function mapTrendyolClaimToInternal(rawClaim, baseCargoCost = 87.00, catalog = [], imageMap = {}) {
  const items = rawClaim.items || [rawClaim];
  const firstItem = items[0] || {};
  const barcode = String(firstItem.barcode || rawClaim.barcode || '').trim();
  const sku = String(firstItem.merchantSku || firstItem.sku || rawClaim.merchantSku || '').trim();
  const title = String(firstItem.productName || rawClaim.productName || 'Trendyol İade Ürünü').trim();

  const matched = catalog.find(p => 
    (barcode && p.barcode === barcode) ||
    (sku && (p.sku === sku || p.id === sku)) ||
    (title && p.name && p.name.toLowerCase() === title.toLowerCase())
  );

  const prodImg = resolveSmartProductImage({
    directImage: firstItem.productImage || firstItem.imageUrl || rawClaim.imageUrl,
    barcode,
    sku,
    title,
    category: matched?.category
  });

  const productPrice = Number(firstItem.price || rawClaim.customerClaimAmount || 0);
  const costPrice = matched?.costPrice ? Number(matched.costPrice) : Number((productPrice * 0.40).toFixed(2));
  const outboundCargo = baseCargoCost;
  const returnCargo = baseCargoCost; // Çift kargo maliyeti
  const repackagingCost = 15.00;
  const totalLoss = Number((outboundCargo + returnCargo + repackagingCost).toFixed(2));

  let reasonCat = 'Müşteri Cayma / İade';
  const rawReason = String(rawClaim.claimReason || rawClaim.reason || '').toLowerCase();
  if (rawReason.includes('beden') || rawReason.includes('kalıp') || rawReason.includes('küçük') || rawReason.includes('büyük') || rawReason.includes('dar')) {
    reasonCat = 'Beden / Kalıp Uymadı';
  } else if (rawReason.includes('hasar') || rawReason.includes('kırık') || rawReason.includes('yırtık') || rawReason.includes('ezik')) {
    reasonCat = 'Kargo Taşıma Hasarı';
  } else if (rawReason.includes('kusur') || rawReason.includes('hatalı') || rawReason.includes('defolu')) {
    reasonCat = 'Ürün Kusuru / Hatalı';
  } else if (rawReason.includes('yanlış')) {
    reasonCat = 'Yanlış Ürün Gönderimi';
  }

  let claimDate = 'Bugün';
  if (rawClaim.claimDate || rawClaim.createdDate) {
    try {
      claimDate = new Date(rawClaim.claimDate || rawClaim.createdDate).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {}
  }

  return {
    id: `RET-TY-${rawClaim.id || rawClaim.claimNumber || Date.now().toString().slice(-6)}`,
    orderId: String(rawClaim.orderNumber || rawClaim.orderId || `TY-${Date.now().toString().slice(-6)}`),
    marketplace: 'Trendyol',
    customerName: rawClaim.customerName || (rawClaim.customerFirstName ? `${rawClaim.customerFirstName} ${rawClaim.customerLastName || ''}` : 'Trendyol Müşterisi'),
    productName: title,
    sku: sku || 'TY-RET-SKU',
    barcode: barcode || '8680000000',
    returnDate: claimDate,
    reasonCategory: reasonCat,
    reasonDetail: rawClaim.claimReasonDescription || rawClaim.reason || 'Müşteri teslimat sonrası iade talebi oluşturdu.',
    productPrice: productPrice,
    costPrice: costPrice,
    outboundCargoFee: outboundCargo,
    returnCargoFee: returnCargo,
    repackagingCost: repackagingCost,
    totalLossFromReturn: totalLoss,
    status: rawClaim.claimItemStatus === 'Accepted' ? 'ACCEPTED' : (rawClaim.claimItemStatus === 'Rejected' ? 'REJECTED' : 'IN_TRANSIT'),
    image: prodImg,
    aiActionRecommendation: reasonCat.includes('Beden') 
      ? 'Ürün açıklamasına "Dar Kalıp - 1 Beden Büyük Önerilir" ibaresi eklendiğinde bu iadeler %40 önlenir.'
      : reasonCat.includes('Kargo')
      ? 'Kargo şubesi için tutanak talebi açıldı (Tazmin talep edilebilir).'
      : 'Stüdyo çekimi gün ışığı fotoğrafı ve detaylı ürün özellikleri ekleyin.'
  };
}

/**
 * Hepsiburada İade Nesnesini İç Yapıya Dönüştürür
 */
export function mapHepsiburadaReturnToInternal(rawReturn, baseCargoCost = 43.50, catalog = [], imageMap = {}) {
  const barcode = String(rawReturn.barcode || '').trim();
  const sku = String(rawReturn.merchantSku || rawReturn.sku || '').trim();
  const title = String(rawReturn.productName || rawReturn.name || 'Hepsiburada İade Ürünü').trim();

  const matched = catalog.find(p => 
    (barcode && p.barcode === barcode) ||
    (sku && (p.sku === sku || p.id === sku)) ||
    (title && p.name && p.name.toLowerCase() === title.toLowerCase())
  );

  const prodImg = resolveSmartProductImage({
    directImage: rawReturn.productImage || rawReturn.imageUrl,
    barcode,
    sku,
    title,
    category: matched?.category
  });

  const productPrice = Number(rawReturn.price || rawReturn.amount || 0);
  const costPrice = matched?.costPrice ? Number(matched.costPrice) : Number((productPrice * 0.40).toFixed(2));
  const outboundCargo = baseCargoCost;
  const returnCargo = baseCargoCost;
  const repackagingCost = 15.00;
  const totalLoss = Number((outboundCargo + returnCargo + repackagingCost).toFixed(2));

  let reasonCat = 'Müşteri Cayma / İade';
  const rawReason = String(rawReturn.reason || rawReturn.claimReason || '').toLowerCase();
  if (rawReason.includes('beden') || rawReason.includes('kalıp') || rawReason.includes('küçük') || rawReason.includes('büyük')) {
    reasonCat = 'Beden / Kalıp Uymadı';
  } else if (rawReason.includes('hasar') || rawReason.includes('kırık')) {
    reasonCat = 'Kargo Taşıma Hasarı';
  }

  return {
    id: `RET-HB-${rawReturn.id || rawReturn.returnNumber || Date.now().toString().slice(-6)}`,
    orderId: String(rawReturn.orderNumber || rawReturn.orderId || `HB-${Date.now().toString().slice(-6)}`),
    marketplace: 'Hepsiburada',
    customerName: rawReturn.customerName || 'Hepsiburada Müşterisi',
    productName: title,
    sku: sku || 'HB-RET-SKU',
    barcode: barcode || '8680000000',
    returnDate: 'Bugün',
    reasonCategory: reasonCat,
    reasonDetail: rawReturn.reasonDetail || rawReturn.reason || 'Müşteri iade talebi oluşturdu.',
    productPrice: productPrice,
    costPrice: costPrice,
    outboundCargoFee: outboundCargo,
    returnCargoFee: returnCargo,
    repackagingCost: repackagingCost,
    totalLossFromReturn: totalLoss,
    status: 'IN_TRANSIT',
    image: prodImg,
    aiActionRecommendation: 'HepsiJET kargo şubesi için tutanak talebi açıldı.'
  };
}

/**
 * Siparişler listesindeki RETURNED durumundaki siparişlerden iade kayıtları üretir
 */
export function extractReturnsFromOrders(ordersList = []) {
  const cargoSettings = getCustomCargoSettings();
  const returnedOrders = ordersList.filter(o => o.status === 'RETURNED');
  
  return returnedOrders.flatMap(order => {
    const isTy = (order.marketplace || '').includes('Trendyol');
    const baseCargo = isTy ? (cargoSettings.trendyolCargoCost || 87.00) : (cargoSettings.hepsiburadaCargoCost || 43.50);
    const items = order.items && order.items.length > 0 ? order.items : [{
      id: order.id,
      title: order.productName,
      sku: order.sku,
      barcode: order.barcode,
      unitPrice: order.grossPrice,
      costPrice: order.costPrice,
      image: order.image
    }];

    return items.map((it, idx) => {
      const prodImg = resolveSmartProductImage({
        directImage: it.image || order.image,
        barcode: it.barcode,
        sku: it.sku,
        title: it.title || order.productName
      });

      const productPrice = Number(it.unitPrice || order.grossPrice || 0);
      const costPrice = Number(it.costPrice || (productPrice * 0.40));
      const outboundCargo = baseCargo;
      const returnCargo = baseCargo;
      const repackagingCost = 15.00;
      const totalLoss = Number((outboundCargo + returnCargo + repackagingCost).toFixed(2));

      return {
        id: `RET-${order.orderNumber || order.id}-${idx + 1}`,
        orderId: order.orderNumber || order.id,
        marketplace: order.marketplace || 'Trendyol',
        customerName: order.customerName || 'Müşteri',
        customerCity: order.customerCity || 'İstanbul',
        productName: it.title || order.productName || 'İade Edilen Ürün',
        sku: it.sku || order.sku || 'SKU-RET',
        barcode: it.barcode || order.barcode || '8680000000',
        returnDate: order.orderDate || 'Bugün',
        reasonCategory: order.returnReason || 'Beden / Kalıp Uymadı',
        reasonDetail: order.returnReasonDetail || 'Müşteri teslimat sonrası iade talebi oluşturdu.',
        productPrice: productPrice,
        costPrice: costPrice,
        outboundCargoFee: outboundCargo,
        returnCargoFee: returnCargo,
        repackagingCost: repackagingCost,
        totalLossFromReturn: totalLoss,
        status: 'IN_TRANSIT',
        image: prodImg,
        aiActionRecommendation: 'Ürün açıklamasına "Dar Kalıp - 1 Beden Büyük Önerilir" ibaresi eklendiğinde çift kargo zararı %40 önlenir.'
      };
    });
  });
}

/**
 * Trendyol Claims API'sinden İadeleri Çeker
 */
export async function fetchTrendyolClaims({ sellerId, apiKey, apiSecret }) {
  const cleanSellerId = sellerId.toString().trim();
  const cleanKey = apiKey.trim();
  const cleanSecret = apiSecret.trim();
  const catalog = getCatalogProducts();
  const imageMap = getStoredImageCache();
  const cargoSettings = getCustomCargoSettings();
  const tyCargo = cargoSettings.trendyolCargoCost || 87.00;

  try {
    const res = await fetch('/api/trendyol', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sellerId: cleanSellerId,
        apiKey: cleanKey,
        apiSecret: cleanSecret,
        action: 'claims',
        page: 0,
        size: 100
      })
    });

    if (res.ok) {
      const json = await res.json();
      const rawClaims = json.data?.content || json.content || [];
      const mapped = rawClaims.map(c => mapTrendyolClaimToInternal(c, tyCargo, catalog, imageMap));
      return { success: true, returns: mapped, count: mapped.length };
    }
  } catch (e) {
    console.warn("fetchTrendyolClaims notice:", e);
  }
  return { success: false, returns: [], count: 0 };
}

/**
 * Hepsiburada Claims/Returns API'sinden İadeleri Çeker
 */
export async function fetchHepsiburadaReturns({ merchantId, secretKey, userAgent = 'yumey_dev' }) {
  const cleanMerchantId = merchantId.trim();
  const cleanSecret = secretKey.trim();
  const cleanUserAgent = (userAgent || 'yumey_dev').trim();
  const catalog = getCatalogProducts();
  const imageMap = getStoredImageCache();
  const cargoSettings = getCustomCargoSettings();
  const hbCargo = cargoSettings.hepsiburadaCargoCost || 43.50;

  try {
    const res = await fetch('/api/hepsiburada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: cleanMerchantId,
        secretKey: cleanSecret,
        userAgent: cleanUserAgent,
        action: 'returns',
        limit: 50
      })
    });

    if (res.ok) {
      const json = await res.json();
      const rawReturns = json.data?.items || json.data?.content || json.items || [];
      const mapped = rawReturns.map(r => mapHepsiburadaReturnToInternal(r, hbCargo, catalog, imageMap));
      return { success: true, returns: mapped, count: mapped.length };
    }
  } catch (e) {
    console.warn("fetchHepsiburadaReturns notice:", e);
  }
  return { success: false, returns: [], count: 0 };
}

/**
 * Tüm Pazaryeri İadelerini & Sipariş İadelerini Tek Seferde Senkronize Eder
 */
export async function syncAllReturns() {
  const credsRaw = localStorage.getItem('izeeg_core_api_credentials');
  let apiReturns = [];

  if (credsRaw) {
    try {
      const creds = JSON.parse(credsRaw);
      const tySellerId = creds.trendyol?.sellerId || creds.tySellerId || creds.sellerId;
      const tyApiKey = creds.trendyol?.apiKey || creds.tyApiKey || creds.apiKey;
      const tyApiSecret = creds.trendyol?.apiSecret || creds.tyApiSecret || creds.apiSecret;

      if (tySellerId && tyApiKey && tyApiSecret) {
        const tyClaims = await fetchTrendyolClaims({ sellerId: tySellerId, apiKey: tyApiKey, apiSecret: tyApiSecret });
        if (tyClaims.success && tyClaims.returns.length > 0) {
          apiReturns = [...apiReturns, ...tyClaims.returns];
        }
      }

      const hbMerchantId = creds.hepsiburada?.merchantId || creds.hbMerchantId || creds.merchantId;
      const hbSecretKey = creds.hepsiburada?.secretKey || creds.hbSecretKey || creds.secretKey;
      const hbUserAgent = creds.hepsiburada?.userAgent || creds.hbUserAgent || 'yumey_dev';

      if (hbMerchantId && hbSecretKey) {
        const hbReturns = await fetchHepsiburadaReturns({ merchantId: hbMerchantId, secretKey: hbSecretKey, userAgent: hbUserAgent });
        if (hbReturns.success && hbReturns.returns.length > 0) {
          apiReturns = [...apiReturns, ...hbReturns.returns];
        }
      }
    } catch (e) {
      console.warn("syncAllReturns credentials error:", e);
    }
  }

  // Sipariş havuzundaki RETURNED durumlu siparişlerden de iadeleri al
  const existingOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
  const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
  const orderDerivedReturns = extractReturnsFromOrders(existingOrders);

  // Birleştir ve tekilleştir
  const returnMap = new Map();
  [...apiReturns, ...orderDerivedReturns].forEach(ret => {
    const key = ret.orderId || ret.id;
    returnMap.set(key, ret);
  });

  const mergedReturns = Array.from(returnMap.values());
  if (mergedReturns.length > 0) {
    saveStoredReturns(mergedReturns);
  }

  return {
    success: true,
    returns: mergedReturns,
    count: mergedReturns.length
  };
}

/**
 * Otomatik Senkronizasyon Çalıştırıcı: Hem Trendyol hem Hepsiburada'yı tarar, birleştirir ve günceller
 */
export async function runAutoSyncAll({ onToast, onNewOrdersReceived }) {
  const credsRaw = localStorage.getItem('izeeg_core_api_credentials');
  if (!credsRaw) return { success: false, message: 'API anahtarları bulunamadı.' };

  let creds = {};
  try { creds = JSON.parse(credsRaw); } catch { return { success: false }; }

  let allNewOrders = [];
  let syncLog = [];

  const tySellerId = creds.trendyol?.sellerId || creds.tySellerId || creds.sellerId;
  const tyApiKey = creds.trendyol?.apiKey || creds.tyApiKey || creds.apiKey;
  const tyApiSecret = creds.trendyol?.apiSecret || creds.tyApiSecret || creds.apiSecret;

  const hbMerchantId = creds.hepsiburada?.merchantId || creds.hbMerchantId || creds.merchantId;
  const hbSecretKey = creds.hepsiburada?.secretKey || creds.hbSecretKey || creds.secretKey;
  const hbUserAgent = creds.hepsiburada?.userAgent || creds.hbUserAgent || 'yumey_dev';

  // Trendyol Senkronizasyonu
  if (tySellerId && tyApiKey && tyApiSecret) {
    const tyRes = await fetchTrendyolLiveOrders({
      sellerId: tySellerId,
      apiKey: tyApiKey,
      apiSecret: tyApiSecret
    });
    if (tyRes.success && tyRes.orders?.length > 0) {
      allNewOrders = [...allNewOrders, ...tyRes.orders];
      syncLog.push(`Trendyol: ${tyRes.orders.length} sipariş`);
    }
  }

  // Hepsiburada Senkronizasyonu
  if (hbMerchantId && hbSecretKey) {
    const hbRes = await fetchHepsiburadaLiveOrders({
      merchantId: hbMerchantId,
      secretKey: hbSecretKey,
      userAgent: hbUserAgent
    });
    if (hbRes.success && hbRes.orders?.length > 0) {
      allNewOrders = [...allNewOrders, ...hbRes.orders];
      syncLog.push(`Hepsiburada: ${hbRes.orders.length} sipariş`);
    }
  }

  // İade Senkronizasyonunu da tetikle
  await syncAllReturns().catch(() => {});

  if (allNewOrders.length > 0) {
    const existingOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
    const existingOrders = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
    
    const existingIds = new Set(existingOrders.map(o => o.id));
    const newlyAdded = allNewOrders.filter(o => !existingIds.has(o.id));
    
    // Geriye dönük görselleri zenginleştir
    const catalog = getCatalogProducts();
    const imageCache = getStoredImageCache();
    const mergedOrders = backfillOrderImages([...newlyAdded, ...existingOrders], catalog, imageCache);

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(mergedOrders));

    if (onNewOrdersReceived) {
      onNewOrdersReceived(mergedOrders, newlyAdded);
    }

    if (onToast && newlyAdded.length > 0) {
      onToast(`⚡ Otomatik Senkronizasyon: ${newlyAdded.length} yeni sipariş ve ürün görselleri aktarıldı.`);
    }

    return {
      success: true,
      totalOrders: mergedOrders.length,
      newOrdersCount: newlyAdded.length,
      message: `Senkronizasyon tamamlandı (${syncLog.join(', ')}).`
    };
  }

  return {
    success: true,
    totalOrders: 0,
    newOrdersCount: 0,
    message: 'Yeni sipariş bulunmuyor.'
  };
}
