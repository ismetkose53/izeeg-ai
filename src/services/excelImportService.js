// izeeg AI - Çoklu Pazar Yeri & Trendyol Excel / CSV Ürün İçe ve Dışa Aktarma Servisi

/**
 * 1. Trendyol Resmi Satıcı Formatında Örnek Excel / CSV Verisi Üretici
 * (Trendyol Satıcı Paneli -> Ürünler -> Ürün Listesi -> Excel İle İndir formatı ile %100 birebir)
 */
export function generateTrendyolOfficialCsvContent() {
  const headers = [
    "Barkod",
    "Model Kodu",
    "Ürün Adı",
    "Marka",
    "Kategori Adı",
    "Para Birimi",
    "Piyasa Satış Fiyatı (KDV Dahil)",
    "Trendyol Satış Fiyatı (KDV Dahil)",
    "Ürün Stok Adedi",
    "KDV Oranı",
    "Desi",
    "Görsel 1",
    "Renk",
    "Beden",
    "Sevkiyat Süresi",
    "Sevkiyat Tipi",
    "Ürün Durumu"
  ];

  const sampleRows = [
    [
      "ANT.ESOFMAN2",
      "Antrasitesofman1",
      "Antrasit Yıkamalı Taş Detaylı Kadın Eşofman Takımı",
      "izeeg Collection",
      "Kadın Eşofman Takımı",
      "TRY",
      "3200.00",
      "2750.00",
      "45",
      "10",
      "3",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200",
      "Antrasit Yıkamalı",
      "M",
      "1",
      "Standart",
      "Satışta"
    ],
    [
      "kedisiyahtas3",
      "T.T.1106",
      "Kedi Taş Aksesuarlı Vatkalı tshirt T.T.1106 Siyah S/M",
      "izeeg Collection",
      "Kadın Tişört",
      "TRY",
      "1850.00",
      "1519.05",
      "60",
      "10",
      "2",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200",
      "Siyah",
      "S/M",
      "1",
      "Standart",
      "Satışta"
    ],
    [
      "kedisiyahtas2",
      "T.T.1106",
      "Kedi Taş Aksesuarlı Vatkalı tshirt T.T.1106 Beyaz S/M",
      "izeeg Collection",
      "Kadın Tişört",
      "TRY",
      "1850.00",
      "1519.05",
      "55",
      "10",
      "2",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200",
      "Beyaz",
      "S/M",
      "1",
      "Standart",
      "Satışta"
    ],
    [
      "ymydrop2",
      "merchantSku",
      "Ymy Drop Taş Aksesuarlı Palozzo Jean ymy-drop-jeans1",
      "YMY Jeans",
      "Kadın Jean",
      "TRY",
      "1950.00",
      "1588.80",
      "30",
      "10",
      "3",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200",
      "Mavi",
      "46",
      "1",
      "Standart",
      "Satışta"
    ],
    [
      "EKRU_VTSHIRT1",
      "V-TSHIRT-01",
      "Kadın Basic V Yaka Pamuklu Premium Tshirt Ekru S",
      "izeeg Basic",
      "Kadın Tişört",
      "TRY",
      "650.00",
      "489.90",
      "120",
      "10",
      "1",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200",
      "Ekru",
      "S",
      "1",
      "Standart",
      "Satışta"
    ],
    [
      "KBAN_BEJ_001",
      "KASE-KABAN-BEJ",
      "Oversize Kaşe Kruvaze Kaban Bej L",
      "izeeg Outerwear",
      "Kadın Kaban",
      "TRY",
      "4200.00",
      "3490.00",
      "25",
      "10",
      "5",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200",
      "Bej",
      "L",
      "2",
      "Standart",
      "Satışta"
    ]
  ];

  const csvRows = [headers.join(";")];
  sampleRows.forEach(row => csvRows.push(row.join(";")));
  return csvRows.join("\n");
}

/**
 * 2. izeeg AI Tam Donanımlı Kapsamlı Ürün & Alış Maliyeti Excel / CSV Şablonu
 * (Tedarikçi, Alış Fiyatı, Varyant, Renk, Beden, KDV, Desi, Komisyon dahil tam model)
 */
export function generateIzeegMasterCsvContent() {
  const headers = [
    "Barkod",
    "ModelKodu",
    "UrunAdi",
    "TedarikciAlinanYer",
    "AlisFiyatiMaliyetTL",
    "SatisFiyatiTL",
    "StokAdedi",
    "VaryantBeden",
    "Renk",
    "Kategori",
    "KDVOraniYuzde",
    "KargoDesisi",
    "PazaryeriKomisyonYuzde",
    "DepoRafKodu",
    "GorselUrl"
  ];

  const sampleRows = [
    [
      "ANT.ESOFMAN2",
      "Antrasitesofman1",
      "Antrasit Yıkamalı Taş Detaylı Kadın Eşofman Takımı",
      "Merter Tekstil İmalat",
      "1100.00",
      "2750.00",
      "45",
      "M",
      "Antrasit Yıkamalı",
      "Kadın Giyim",
      "10",
      "3",
      "14",
      "A-12",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200"
    ],
    [
      "kedisiyahtas3",
      "T.T.1106",
      "Kedi Taş Aksesuarlı Vatkalı tshirt T.T.1106 Siyah",
      "Güngören Toptan Triko",
      "580.00",
      "1519.05",
      "60",
      "S/M",
      "Siyah",
      "Kadın Tişört",
      "10",
      "2",
      "14",
      "B-04",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200"
    ],
    [
      "kedisiyahtas2",
      "T.T.1106",
      "Kedi Taş Aksesuarlı Vatkalı tshirt T.T.1106 Beyaz",
      "Güngören Toptan Triko",
      "580.00",
      "1519.05",
      "55",
      "S/M",
      "Beyaz",
      "Kadın Tişört",
      "10",
      "2",
      "14",
      "B-05",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200"
    ],
    [
      "ymydrop2",
      "merchantSku",
      "Ymy Drop Taş Aksesuarlı Palozzo Jean",
      "Zeytinburnu Denim Fabrikası",
      "650.00",
      "1588.80",
      "30",
      "46",
      "Mavi",
      "Kadın Jean",
      "10",
      "3",
      "15",
      "C-08",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200"
    ],
    [
      "EKRU_VTSHIRT1",
      "V-TSHIRT-01",
      "Kadın Basic V Yaka Pamuklu Premium Tshirt",
      "Bursa Pamuk Örme",
      "190.00",
      "489.90",
      "120",
      "S",
      "Ekru",
      "Kadın Tişört",
      "10",
      "1",
      "14",
      "A-02",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200"
    ],
    [
      "KBAN_BEJ_001",
      "KASE-KABAN-BEJ",
      "Oversize Kaşe Kruvaze Kaban Bej",
      "Kastamonu Kumaş & Konfeksiyon",
      "1450.00",
      "3490.00",
      "25",
      "L",
      "Bej",
      "Kadın Kaban",
      "10",
      "5",
      "14",
      "D-01",
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200"
    ]
  ];

  const csvRows = [headers.join(";")];
  sampleRows.forEach(row => csvRows.push(row.join(";")));
  return csvRows.join("\n");
}

/**
 * 3. Excel veya CSV Dosyasını Akıllıca Analiz Edip Parse Eden Motor
 */
export function parseUploadedProductFile(fileContent) {
  if (!fileContent || typeof fileContent !== 'string') {
    return { success: false, error: 'Dosya içeriği okunamadı.' };
  }

  const lines = fileContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    return { success: false, error: 'Dosyada yeterli başlık veya ürün satırı bulunamadı.' };
  }

  // İlk satırdaki başlıkları ayrıştır
  const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
  const rawHeaders = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

  // Format Tespiti
  const isTrendyolOfficial = rawHeaders.some(h => h.includes('trendyol satış') || h.includes('model kodu') || h.includes('piyasa satış'));
  const isIzeegMaster = rawHeaders.some(h => h.includes('tedarikci') || h.includes('alisfiyati') || h.includes('alis'));

  const parsedProducts = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const cols = rawLine.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));

    if (isTrendyolOfficial) {
      // Trendyol Resmi Formatı
      const barcode = cols[0] || `TY-${Date.now()}-${i}`;
      const sku = cols[1] || `SKU-${i}`;
      const name = cols[2] || `Trendyol Ürün #${i}`;
      const brand = cols[3] || 'Trendyol Satıcı';
      const category = cols[4] || 'Giyim';
      const marketPrice = parseFloat(cols[6]?.replace(',', '.')) || 0;
      const sellingPrice = parseFloat(cols[7]?.replace(',', '.')) || marketPrice || 350;
      const stock = parseInt(cols[8], 10) || 50;
      const vatRate = parseInt(cols[9], 10) || 10;
      const desi = parseFloat(cols[10]?.replace(',', '.')) || 2;
      const image = cols[11] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150';
      const color = cols[12] || 'Standart';
      const size = cols[13] || 'Standart';

      // Trendyol çıktısında maliyet olmadığı için başlangıçta tahmini %40 alış fiyatı atanır
      const defaultCost = Number((sellingPrice * 0.40).toFixed(2));
      const defaultCommission = Number((sellingPrice * 0.14).toFixed(2));
      const defaultCargo = desi <= 2 ? 42.91 : desi <= 5 ? 58.00 : 75.00;
      const netProfit = Number((sellingPrice - defaultCost - defaultCommission - defaultCargo).toFixed(2));
      const profitMargin = sellingPrice > 0 ? Number(((netProfit / sellingPrice) * 100).toFixed(1)) : 0;

      parsedProducts.push({
        id: sku,
        barcode,
        name,
        brand,
        supplier: 'Trendyol İçe Aktarma (Tedarikçi Belirtilmedi)',
        costPrice: defaultCost,
        sellingPrice,
        stock,
        color,
        variant: size,
        size,
        category,
        vatRate,
        desi,
        commissionRate: 14,
        shelfLocation: `TY-${i}`,
        warehouse: 'Ana Merkez Depo',
        marketplace: 'Trendyol',
        image,
        netProfit,
        profitMargin,
        isCostMissing: true // Kullanıcıya maliyet girmesi gerektiğini hatırlatır
      });
    } else {
      // izeeg Master Formatı veya Genel CSV
      const barcode = cols[0] || `BC-${Date.now()}-${i}`;
      const sku = cols[1] || `SKU-${i}`;
      const name = cols[2] || `Ürün #${i}`;
      const supplier = cols[3] || 'Genel Tedarikçi';
      const costPrice = parseFloat(cols[4]?.replace(',', '.')) || 100;
      const sellingPrice = parseFloat(cols[5]?.replace(',', '.')) || (costPrice * 2.5);
      const stock = parseInt(cols[6], 10) || 50;
      const size = cols[7] || 'Tek Ebat';
      const color = cols[8] || 'Standart';
      const category = cols[9] || 'Genel';
      const vatRate = parseInt(cols[10], 10) || 10;
      const desi = parseFloat(cols[11]?.replace(',', '.')) || 2;
      const commRate = parseFloat(cols[12]?.replace(',', '.')) || 15;
      const shelf = cols[13] || 'A-01';
      const image = cols[14] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150';

      const commAmount = (sellingPrice * commRate) / 100;
      const cargoFee = desi <= 2 ? 42.91 : 58.00;
      const netProfit = Number((sellingPrice - costPrice - commAmount - cargoFee).toFixed(2));
      const profitMargin = sellingPrice > 0 ? Number(((netProfit / sellingPrice) * 100).toFixed(1)) : 0;

      parsedProducts.push({
        id: sku,
        barcode,
        name,
        supplier,
        costPrice,
        sellingPrice,
        stock,
        color,
        variant: size,
        size,
        category,
        vatRate,
        desi,
        commissionRate: commRate,
        shelfLocation: shelf,
        warehouse: 'Ana Merkez Depo',
        marketplace: 'Trendyol',
        image,
        netProfit,
        profitMargin,
        isCostMissing: false
      });
    }
  }

  return {
    success: true,
    formatType: isTrendyolOfficial ? 'TRENDYOL_OFFICIAL' : isIzeegMaster ? 'IZEEG_MASTER' : 'GENERIC_CSV',
    totalCount: parsedProducts.length,
    products: parsedProducts,
    hasMissingCost: isTrendyolOfficial
  };
}
