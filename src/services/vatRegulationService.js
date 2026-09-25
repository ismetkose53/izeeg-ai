// GİB Resmi Katma Değer Vergisi (KDV) Mevzuatı ve Otomatik Oran Tespit Motoru
// 3065 Sayılı Katma Değer Vergisi Kanunu ve 7346 Sayılı Cumhurbaşkanı Kararı Esas Alınmıştır.

export const OFFICIAL_VAT_RATES = {
  REDUCED_1: 1,   // I Sayılı Liste: Temel Gıda Maddeleri, Tohumculuk, Basın/Yayın
  REDUCED_10: 10, // II Sayılı Liste: Tekstil, Konfeksiyon, Giyim, Ayakkabı, Çanta, Ev Tekstili, Hijyen, Sağlık
  STANDARD_20: 20 // Genel Oran: Kozmetik, Takı/Aksesuar, Elektronik, Mobilya, Züccaciye ve Diğerleri
};

export const OFFICIAL_VAT_CATEGORIES = [
  {
    id: 'textile_apparel',
    name: 'Tekstil, Konfeksiyon & Giyim',
    rate: 10,
    lawReference: '7346 Sayılı C.K. (II Sayılı Liste Madde 4 & 5)',
    description: 'Tişört, Pantolon, Jean, Elbise, Etek, Takım, Ceket, Hırka, Kazak, Şort, Eşofman, Tayt, Crop, Bluz, Gömlek, Kaban, Mont, İç Giyim',
    keywords: [
      'tshirt', 'tişört', 't-shirt', 'jean', 'pantolon', 'elbise', 'etek', 'takım', 'ceket', 'hırka', 
      'kazak', 'şort', 'eşofman', 'tayt', 'crop', 'bluz', 'gömlek', 'kaban', 'mont', 'trençkot', 
      'pijama', 'gecelik', 'sütyen', 'külot', 'çorap', 'yelek', 'palazzo', 'palozzo', 'kaşkorse', 
      'triko', 'sweatshirt', 'hoodie', 'body', 'atlet', 'tulum', 'modal', 'keten', 'viskon', 'pamuk'
    ]
  },
  {
    id: 'shoes_bags',
    name: 'Ayakkabı, Çanta & Deri Eşya',
    rate: 10,
    lawReference: '7346 Sayılı C.K. (II Sayılı Liste Madde 6)',
    description: 'Ayakkabı, Terlik, Sandalet, Çizme, Bot, Sneaker, Çanta, Sırt Çantası, Cüzdan, Kemer, Valiz',
    keywords: [
      'ayakkabı', 'sneaker', 'bot', 'çizme', 'sandalet', 'terlik', 'babet', 'topuklu', 'loafers',
      'çanta', 'cüzdan', 'kemer', 'valiz', 'bavul', 'sırt çantası', 'omuz çantası', 'el çantası', 'kartlık'
    ]
  },
  {
    id: 'home_textile',
    name: 'Ev Tekstili & Mefruşat',
    rate: 10,
    lawReference: '7346 Sayılı C.K. (II Sayılı Liste Madde 4)',
    description: 'Havlu, Bornoz, Nevresim, Çarşaf, Yastık Kılıfı, Pike, Yorgan, Battaniye, Perde, Tül, Masa Örtüsü',
    keywords: [
      'havlu', 'bornoz', 'nevresim', 'çarşaf', 'yastık kılıfı', 'pike', 'yorgan', 'battaniye',
      'perde', 'tül', 'masa örtüsü', 'koltuk örtüsü', 'kırlent', 'yastık', 'alez'
    ]
  },
  {
    id: 'hygiene_medical',
    name: 'Temel Hijyen, Temizlik & Medikal',
    rate: 10,
    lawReference: '7346 Sayılı C.K. (II Sayılı Liste Madde 28 & 37)',
    description: 'Sabun, Şampuan, Diş Macunu, Tuvalet Kağıdı, Kağıt Havlu, Bebek Bezi, Hijyenik Ped, Dezenfektan, Tıbbi Cihaz',
    keywords: [
      'sabun', 'şampuan', 'diş macunu', 'tuvalet kağıdı', 'kağıt havlu', 'bebek bezi', 'hijyenik ped',
      'ped', 'dezenfektan', 'kolonya', 'ıslak mendil', 'maske', 'medikal', 'tansiyon', 'derece'
    ]
  },
  {
    id: 'food_basic',
    name: 'Temel Gıda & Tarım Ürünleri',
    rate: 1,
    lawReference: '7346 Sayılı C.K. (I Sayılı Liste)',
    description: 'Un, Ekmek, Süt, Yoğurt, Peynir, Yumurta, Zeytin, Zeytinyağı, Bakliyat, Pirinç, Bulgur, Çay, Şeker, Et, Balık, Sebze, Meyve',
    keywords: [
      'un', 'ekmek', 'süt', 'yoğurt', 'peynir', 'yumurta', 'zeytin', 'zeytinyağı', 'sıvı yağ',
      'pirinç', 'bulgur', 'mercimek', 'nohut', 'fasulye', 'makarna', 'çay', 'şeker', 'tuz',
      'bal', 'reçel', 'et', 'kıyma', 'tavuk', 'balık', 'sebze', 'meyve', 'tohum', 'fidan'
    ]
  },
  {
    id: 'cosmetics_beauty',
    name: 'Kozmetik, Parfüm & Kişisel Bakım',
    rate: 20,
    lawReference: '3065 Sayılı Kanun Madde 28 (Genel KDV Oranı)',
    description: 'Parfüm, Cilt Bakım Kremi, Serum, Makyaj Malzemesi, Ruj, Maskara, Fondöten, Oje, Saç Boyası',
    keywords: [
      'parfüm', 'krem', 'serum', 'makyaj', 'ruj', 'maskara', 'fondöten', 'allık', 'far', 'oje',
      'saç boyası', 'güneş kremi', 'tonik', 'losyon', 'vücut spreyi', 'eyeliner', 'pudra'
    ]
  },
  {
    id: 'accessories_jewelry',
    name: 'Aksesuar, Takı & Saat',
    rate: 20,
    lawReference: '3065 Sayılı Kanun Madde 28 (Genel KDV Oranı)',
    description: 'Kolye, Küpe, Yüzük, Bileklik, Kol Saati, Güneş Gözlüğü, Şapka, Broş, Toka',
    keywords: [
      'kolye', 'küpe', 'yüzük', 'bileklik', 'saat', 'kol saati', 'güneş gözlüğü', 'gözlük',
      'şapka', 'broş', 'toka', 'halhal', 'piercing', 'kol düğmesi', 'kravat'
    ]
  },
  {
    id: 'electronics_accessories',
    name: 'Elektronik & Dijital Aksesuar',
    rate: 20,
    lawReference: '3065 Sayılı Kanun Madde 28 (Genel KDV Oranı)',
    description: 'Telefon Kılıfı, Şarj Cihazı, Kablo, Kulaklık, Powerbank, Hoparlör, Bilgisayar Parçası',
    keywords: [
      'kılıf', 'şarj', 'kablo', 'kulaklık', 'powerbank', 'hoparlör', 'adaptör', 'ekran koruyucu',
      'mouse', 'klavye', 'bluetooth', 'usb', 'hafıza kartı', 'telefon', 'tablet', 'elektronik'
    ]
  },
  {
    id: 'home_kitchen',
    name: 'Ev, Mutfak & Züccaciye',
    rate: 20,
    lawReference: '3065 Sayılı Kanun Madde 28 (Genel KDV Oranı)',
    description: 'Tencere, Tava, Tabak, Bardak, Çatal Bıçak, Saklama Kabı, Mobilya, Plastik Eşya',
    keywords: [
      'tencere', 'tava', 'tabak', 'bardak', 'fincan', 'çatal', 'bıçak', 'kaşık', 'saklama kabı',
      'süzgeç', 'termos', 'mobilya', 'sandalye', 'masa', 'sehpa', 'dolap', 'kitaplık', 'vazo', 'tablo'
    ]
  }
];

/**
 * 🎯 Ürün veya Sipariş Bilgisine Göre Resmi GİB KDV Oranını Akıllıca Tespit Eder
 * @param {Object|string} itemOrName - Ürün nesnesi, sipariş nesnesi veya ürün başlığı
 * @returns {number} - 1, 10 veya 20 (% KDV)
 */
export function detectOfficialVatRate(itemOrName) {
  if (!itemOrName) return OFFICIAL_VAT_RATES.REDUCED_10; // Varsayılan giyim & e-ticaret oranı %10

  // 1. Doğrudan atanmış geçerli bir KDV oranı varsa
  if (typeof itemOrName === 'object' && itemOrName !== null) {
    const rawVat = itemOrName.vatRate !== undefined ? itemOrName.vatRate : itemOrName.kdvRate;
    const numVat = Number(rawVat);
    if (!isNaN(numVat) && [1, 10, 20].includes(numVat)) {
      return numVat;
    }
  }

  // 2. Metin analizi için stringleri toparla
  let textToAnalyze = '';
  if (typeof itemOrName === 'string') {
    textToAnalyze = itemOrName;
  } else if (typeof itemOrName === 'object' && itemOrName !== null) {
    textToAnalyze = [
      itemOrName.name || '',
      itemOrName.title || '',
      itemOrName.productName || '',
      itemOrName.category || '',
      itemOrName.variant || '',
      itemOrName.sku || '',
      ...(itemOrName.items ? itemOrName.items.map(i => `${i.title || ''} ${i.name || ''}`) : [])
    ].join(' ').toLowerCase();
  }

  const cleanText = textToAnalyze.toLowerCase().replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');

  // Öncelik 1: Temel Gıda (%1)
  const foodCategory = OFFICIAL_VAT_CATEGORIES.find(c => c.id === 'food_basic');
  if (foodCategory && foodCategory.keywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(cleanText))) {
    return OFFICIAL_VAT_RATES.REDUCED_1;
  }

  // Öncelik 2: Kozmetik, Takı, Elektronik, Züccaciye (%20 Genel Oran)
  const standardCategories = OFFICIAL_VAT_CATEGORIES.filter(c => c.rate === 20);
  for (const cat of standardCategories) {
    if (cat.keywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(cleanText))) {
      return OFFICIAL_VAT_RATES.STANDARD_20;
    }
  }

  // Öncelik 3: Tekstil, Giyim, Ayakkabı, Ev Tekstili, Hijyen (%10 İndirimli Oran)
  const reducedCategories = OFFICIAL_VAT_CATEGORIES.filter(c => c.rate === 10);
  for (const cat of reducedCategories) {
    if (cat.keywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(cleanText))) {
      return OFFICIAL_VAT_RATES.REDUCED_10;
    }
  }

  // E-Ticaret mağazamız yumey ağırlıklı tekstil/giyim olduğundan varsayılan %10
  return OFFICIAL_VAT_RATES.REDUCED_10;
}

/**
 * 📜 Resmi GİB KDV Yasal Dayanak Açıklamasını Döndürür
 */
export function getVatLegalCitation(vatRate, categoryName = '') {
  const rate = Number(vatRate);
  if (rate === 1) {
    return '3065 Sayılı KDV Kanunu ve 7346 Sayılı C.K. (I Sayılı Liste - Temel Gıda %1 KDV)';
  }
  if (rate === 10) {
    return '3065 Sayılı KDV Kanunu ve 7346 Sayılı C.K. (II Sayılı Liste - Tekstil & Giyim %10 KDV)';
  }
  return '3065 Sayılı KDV Kanunu Madde 28 ve 7346 Sayılı C.K. (Genel Oran %20 KDV)';
}

/**
 * 🧮 KDV Dahil Brüt Tutardan Matrah ve KDV Ayrıştırması Yapar
 */
export function calculateVatBreakdown(grossPrice = 0, customVatRate) {
  const gross = Number(grossPrice) || 0;
  const vatRate = customVatRate !== undefined ? Number(customVatRate) : 10;
  
  const netMatrah = Number(((gross * 100) / (100 + vatRate)).toFixed(2));
  const vatAmount = Number((gross - netMatrah).toFixed(2));

  return {
    grossPrice: gross,
    netMatrah,
    vatRate,
    vatAmount,
    legalCitation: getVatLegalCitation(vatRate)
  };
}
