import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  Scale, 
  ShoppingBag, 
  Globe, 
  Boxes, 
  MessageSquare, 
  FileText, 
  RotateCcw, 
  BarChart3, 
  Megaphone,
  Brain,
  Lightbulb,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Tüm Sayfalar İçin Kapsamlı ve Detaylı "Nasıl Kullanılır?" Rehber Veritabanı
export const PAGE_GUIDE_DATA = {
  'orders': {
    title: 'Kargo Aşamasındaki Siparişler & Barkod Merkezi',
    badge: '📦 Sipariş Yönetimi',
    icon: ShoppingBag,
    color: 'blue',
    summary: 'Trendyol, Hepsiburada, Amazon ve Web sitenizden gelen tüm siparişleri tek ekranda toplar, kargo barkodlarını ve e-faturalarını saniyeler içinde basmanızı sağlar.',
    whyItMatters: 'Farklı pazar yerlerinin satıcı panellerine tek tek girip çıkmak günde 2-3 saatinizi çalar. Bu sayfada tüm siparişleri aynı standartta görür, her siparişin cebinize bıraktığı NET kârı anlık olarak bilirsiniz.',
    steps: [
      {
        number: '1',
        title: 'Pazar Yeri Havuzunu Filtreleyin',
        desc: 'Üst bardan ister tüm kanalları ("Tüm Kanallar"), ister sadece "Trendyol" veya "Hepsiburada" siparişlerinizi listeleyin.'
      },
      {
        number: '2',
        title: 'Paket Başı Net Kârınızı Kontrol Edin',
        desc: 'Her sipariş satırındaki yeşil "Net Kâr" hanesine bakın; ürün maliyetiniz, komisyon ve kargo düşüldükten sonra net kazancınız canlı hesaplanır.'
      },
      {
        number: '3',
        title: 'Kargo Barkodunu Tek Tıkla Yazdırın',
        desc: '"Kargo Etiketini A4 Yazdır" veya "Sticker Yazdır" butonuna basarak kargo fişini anında yazıcıdan çıkarın.'
      },
      {
        number: '4',
        title: 'E-Fatura Kesin veya İndirin',
        desc: '"Fatura İşlemleri" butonuna tıklayarak GİB e-Arşiv faturasını anında oluşturun ve müşteriye iletin.'
      }
    ],
    proTips: [
      '💡 "Bugün Kargolanması Gereken Siparişler" kutucuğuna tıklayarak gecikme riski olan paketleri öne alabilirsiniz.',
      '💡 Sol taraftaki kutucukları işaretleyip "Toplu İşlemler" menüsünden 100 siparişi aynı anda kargoya verebilirsiniz.'
    ],
    faqs: [
      {
        q: 'Siparişler ne kadar sıklıkla güncellenir?',
        a: 'Pazar yeri API webhooks sayesinde sipariş müşterinin sepetinden geçtiği anda (maksimum 15 saniyede) ekrana düşer.'
      },
      {
        q: 'Net kâr rakamı kesin midir?',
        a: 'Evet; ürünün alış maliyeti, pazar yeri resmi komisyonu, KDV ve anlaşmalı kargo kesintisi tam formülle hesaplanır.'
      }
    ]
  },

  'omnichannel-products': {
    title: 'Çok Kanallı Ürün Yükleme & Katalog Dağıtım Motoru',
    badge: '🌐 1 Tıkla Tüm Kanallara Gönder',
    icon: Globe,
    color: 'orange',
    summary: 'Ürününüzü 1 kez girip; Trendyol, Hepsiburada, Amazon, Pazarama ve kendi web sitenize (Shopify / İkas) aynı anda eksiksiz yayınlamanızı sağlar.',
    whyItMatters: 'Normalde 1 ürünü 4 farklı pazar yerine tek tek eklemek 1 saatinizi alır. izeeg AI ile 2 dakikada tek bir form doldurur, AI ile zengin SEO açıklaması üretir ve tek tıkla tüm mağazalarınıza fırlatırsınız.',
    steps: [
      {
        number: '1',
        title: 'Temel Bilgileri & Barkodu Girin',
        desc: 'Ürün adı, marka ve model kodunu yazın. İsterseniz "Rastgele EAN-13 Üret" butonuna basarak saniyede resmi Türk barkodu oluşturun.'
      },
      {
        number: '2',
        title: 'Maliyetinizi ve Satış Fiyatınızı Belirleyin',
        desc: 'Alış maliyetinizi (COGS) girin. Sistem sağ taraftaki panelde hangi pazar yerinde ne kadar net kâr edeceğinizi anında gösterir.'
      },
      {
        number: '3',
        title: '✨ AI ile İçerik & SEO Açıklaması Üretin',
        desc: '"AI ile İçerik Oluştur" butonuna basın. Trendyol için zengin HTML metin, Amazon için 5 maddeli Bullet Points otomatik yazılır.'
      },
      {
        number: '4',
        title: 'Hedef Kanalları Seçin ve Yayınlayın',
        desc: 'Göndermek istediğiniz pazar yerlerini işaretleyin (Trendyol, HB, Amazon, Web Siten) ve "Seçili Kanallarda Yayınla" butonuna tıklayın.'
      }
    ],
    proTips: [
      '💡 Kendi Web Sitenizde komisyon (%2 POS) çok düşük olduğu için kendi sitenizde daha uygun fiyat vererek satışlarınızı katlayabilirsiniz.',
      '💡 Tüm kanallar "Ortak Sanal Stok" havuzundan beslenir, böylece bir yerde satılan ürün diğer kanallarda otomatik düşer.'
    ],
    faqs: [
      {
        q: 'Pazar yerinden eksik bilgi hatası alır mıyım?',
        a: 'Hayır, sistem "Sıfır Hata Pre-Flight" motoru ile pazar yerlerinin tüm zorunlu alanlarını doğrulamadan yayına göndermez.'
      },
      {
        q: 'Alış maliyetimi pazar yerleri veya müşteriler görebilir mi?',
        a: 'Kesinlikle hayır! Alış maliyetiniz sadece sizin net kârınızı hesaplamak için izeeg AI veri tabanında şifreli saklanır.'
      }
    ]
  },

  'net-profit': {
    title: 'Gerçek Net Kâr Modülü ("Bugün Gerçekten Ne Kazandım?")',
    badge: '💰 Kâr & Finansal Net Hakediş',
    icon: DollarSign,
    color: 'emerald',
    summary: 'Brüt ciro illüzyonunu ortadan kaldırır; komisyon, stopaj, kargo, iade zararları ve reklam giderleri düşüldükten sonra bankanıza yatacak net parayı kuruşu kuruşuna gösterir.',
    whyItMatters: 'Ciro yapmak başarı değildir; ay sonunda cebinizde kalan net kâr önemlidir. Birçok satıcı çok satarken aslında gizli maliyetler yüzünden zarar ettiğini çok geç fark eder.',
    steps: [
      {
        number: '1',
        title: 'Net Kâr ve Kâr Marjınızı İnceleyin',
        desc: 'Üstteki ana karttan bugünkü toplam cironuzun ne kadarının gerçek net kâr olduğunu (örn: %22.4 marj) görün.'
      },
      {
        number: '2',
        title: 'Maliyet Dağılım Grafiğini Analiz Edin',
        desc: 'Paranızın nereye gittiğini görün: Ürün Maliyeti, Pazar Yeri Komisyonu, Kargo Kesintileri, Reklam Giderleri ve İade Masrafları.'
      },
      {
        number: '3',
        title: 'Zarar Eden Gizli Kaçakları Tespit Edin',
        desc: 'Kâr marjı düşük veya eksiye düşen ürünler için AI çalışanının önerdiği aksiyonları (Fiyat artır veya Reklamı kıs) uygulayın.'
      }
    ],
    proTips: [
      '💡 "Zarar Eden Ürünler" sekmesini haftada en az bir kez kontrol ederek gizli eriyen sermayenizi durdurun.',
      '💡 "Pro Kâr Tablosu" bağlantısına tıklayarak ürün bazında tek tek simülasyon yapabilirsiniz.'
    ],
    faqs: [
      {
        q: 'Reklam harcamaları da bu kârdan düşüyor mu?',
        a: 'Evet! Trendyol Sponsorlu, HepsiAd ve Amazon reklam harcamalarınız anlık olarak kârdan düşülerek net sonuç verilir.'
      }
    ]
  },

  'cargo-audit': {
    title: 'Kargo Kaçak Denetimi & Fazla Desi İtiraz Sihirbazı',
    badge: '⚖️ Kargo Kaçak Avcısı',
    icon: Scale,
    color: 'amber',
    summary: 'Kargo firmalarının sisteme hatalı girdiği fazla desileri (Örn: 1 desilik t-shirt\'ü 5 desi faturalandırma) otomatik tespit eder ve tek tıkla resmi itiraz dilekçesi hazırlar.',
    whyItMatters: 'Kargo şirketleri ayda binlerce pakette desiyi yüksek göstererek satıcılardan habersiz yüzbinlerce TL fazla kesinti yapar. izeeg AI bu parayı kuruşu kuruşuna geri almanızı sağlar.',
    steps: [
      {
        number: '1',
        title: 'Tespit Edilen Kargo Kaçaklarını İnceleyin',
        desc: 'Sistem gerçek ürün desisi ile kargo firmasının faturadaki desisini kıyaslar ve haksız kesilen tutarı kırmızıyla vurgular.'
      },
      {
        number: '2',
        title: 'Kanıt Dosyasını & Ölçümleri Görün',
        desc: 'Hangi sipariş kodunda, hangi kargo şubesinin ne kadar fazla kestiğini satır bazında inceleyin.'
      },
      {
        number: '3',
        title: 'Tek Tıkla İtiraz Dilekçesi İndirin',
        desc: '"İtiraz Dilekçesi Oluştur" butonuna basın. Trendyol / Kargo firması formatında resmi iade talep yazısı PDF/Word olarak hazır insin.'
      }
    ],
    proTips: [
      '💡 İtiraz dilekçesini Trendyol Canlı Destek veya Kargo Portalı üzerinden ileterek ortalama 3-5 iş gününde iadenizi alabilirsiniz.'
    ],
    faqs: [
      {
        q: 'Gerçek desiyi sistem nereden biliyor?',
        a: 'Ürün yüklerken girdiğiniz orijinal desi ve ürün boyutları veri tabanında referans olarak tutulur.'
      }
    ]
  },

  'repricer': {
    title: 'Akıllı Buybox Repricer & Dinamik Fiyat Savaşçısı',
    badge: '⚡ Otomatik Buybox',
    icon: Zap,
    color: 'amber',
    summary: 'Rakiplerinizi 7/24 saniye saniye izler; belirlediğiniz taban fiyatın altına asla inmeden Buybox\'ı almak için fiyatınızı otomatik optimize eder.',
    whyItMatters: 'Fiyat savaşlarında manuel takip imkansızdır. Rakipler gece fiyat kırıp sabah yükselterek satışlarınızı çalar. Repricer sizin yerinize 7/24 nöbet tutar ve kârınızı korur.',
    steps: [
      {
        number: '1',
        title: 'Taban (Min) ve Tavan (Max) Fiyatınızı Belirleyin',
        desc: 'Ürünün zarar etmemesi için inebileceği en düşük fiyatı ve hedef kâr tavan fiyatını girin.'
      },
      {
        number: '2',
        title: 'Buybox Stratejinizi Seçin',
        desc: '"Rakibin 1 TL Altına İn", "Buybox\'ı Alınca Fiyat Yükselt" veya "Maksimum Kâr Odaklı" stratejilerden birini aktif edin.'
      },
      {
        number: '3',
        title: 'Otomatik Korumayı Başlatın',
        desc: 'AI motoru kurallara göre pazar yerinde fiyatınızı anlık günceller.'
      }
    ],
    proTips: [
      '💡 "Zarar Önleme Kilidi": Taban fiyatınız maliyetinizin altına asla ayarlanamaz, böylece yanlışlıkla zararına satış yapmazsınız.'
    ],
    faqs: [
      {
        q: 'Rakip stok bitirdiğinde sistem fiyatımı yükseltir mi?',
        a: 'Evet! Rakibin stoğu bittiği anda sistem fiyatınızı tavan fiyata çıkararak kârınızı maksimize eder.'
      }
    ]
  },

  'supplier-reorder': {
    title: 'Stok Tahmini & Tedarikçi Sipariş Fişi (PO)',
    badge: '📦 Stok & Tedarik',
    icon: Boxes,
    color: 'emerald',
    summary: 'Satış hızınıza göre hangi ürünün kaç gün sonra tükeneceğini yapay zeka ile tahmin eder ve tedarikçinize tek tıkla WhatsApp sipariş fişi keser.',
    whyItMatters: 'En çok satan ürününüzün stokunun bitmesi ("Out of Stock") pazar yerindeki sıralamanızı ve algoritma puanınızı yerle bir eder. izeeg AI stok bitmeden sizi uyarır.',
    steps: [
      {
        number: '1',
        title: 'Kritik Stok Uyarılarını İnceleyin',
        desc: 'Kırmızı ve sarı alarmlarla "3 gün içinde tükenecek" ürünlerin listesini görün.'
      },
      {
        number: '2',
        title: 'Önerilen Sipariş Adedini Onaylayın',
        desc: 'AI satış grafiğinize göre tedarikçiden kaç adet istemeniz gerektiğini hesaplar.'
      },
      {
        number: '3',
        title: 'WhatsApp ile Tedarikçiye Gönderin',
        desc: '"WhatsApp Sipariş Fişi Oluştur" butonuna basarak hazır sipariş metnini veya PDF fişini tedarikçinize iletin.'
      }
    ],
    proTips: [
      '💡 Tedarikçi teslim süresini (Lead Time) girdiğinizde sistem tam zamanında sipariş vermeniz için alarm kurar.'
    ],
    faqs: [
      {
        q: 'Tedarikçi sipariş fişi yasal belge midir?',
        a: 'Evet, standart Satın Alma Sipariş Emri (Purchase Order) formatında resmi döküm üretir.'
      }
    ]
  },

  'customer-questions': {
    title: 'Müşteri Soruları & Yorumlar AI Asistanı',
    badge: '💬 1-Tık Yanıtlayıcı',
    icon: MessageSquare,
    color: 'purple',
    summary: 'Trendyol ve Hepsiburada müşteri sorularına pazar yeri kurallarına %100 uygun, kibar, profesyonel ve ikna edici yanıtları saniyeler içinde üretir.',
    whyItMatters: 'Müşteri sorularına ilk 15 dakikada verilen doğru yanıtlar satışa dönüşme oranını %40 artırır ve mağaza puanınızı yükseltir.',
    steps: [
      {
        number: '1',
        title: 'Gelen Soruları İnceleyin',
        desc: 'Müşterinin hangi ürün için ne sorduğunu (Beden uyumu, kargo süresi, kumaş türü vb.) görün.'
      },
      {
        number: '2',
        title: 'AI Öneri Yanıtını Kontrol Edin',
        desc: 'izeeg AI ürünün özelliklerine bakarak en ideal ve kurallara uygun yanıtı hazırlar.'
      },
      {
        number: '3',
        title: 'Tek Tıkla Pazar Yerine İletin',
        desc: '"Yanıtı Gönder" butonuna basarak cevabı anında yayınlayın.'
      }
    ],
    proTips: [
      '💡 İletişim bilgisi veya yasaklı kelime içeren durumları AI otomatik tespit edip sizi uyarır (Hesap cezasını önler).'
    ],
    faqs: [
      {
        q: 'AI ürünün kumaşını veya ölçüsünü nereden biliyor?',
        a: 'Ürün kartındaki kategori, varyant ve açıklama bilgilerini otomatik okuyarak doğru bilgi verir.'
      }
    ]
  },

  'invoices': {
    title: 'E-Fatura & Toplu Fatura Yazdırma Merkezi',
    badge: '📄 E-Fatura & GİB',
    icon: FileText,
    color: 'emerald',
    summary: 'Pazar yeri siparişlerinin e-arşiv faturalarını otomatik oluşturur, tek tıkla toplu PDF yazdırır veya müşterinin e-posta adresine iletir.',
    whyItMatters: 'Geciken faturalar pazar yeri cezalarına ve müşteri şikayetlerine yol açar. Otomatik faturalandırma operasyon yükünüzü sıfıra indirir.',
    steps: [
      {
        number: '1',
        title: 'Otomatik Fatura Modunu Açın',
        desc: 'Sipariş geldiği anda faturanın otomatik kesilmesini sağlayın.'
      },
      {
        number: '2',
        title: 'Toplu PDF İndirin & Yazdırın',
        desc: 'Günün tüm faturalarını tek bir PDF dosyasında birleştirip yazıcıya gönderin.'
      }
    ],
    proTips: [
      '💡 Kargo barkodunun üzerine fatura linkini ekleyerek kağıt israfını önleyebilirsiniz.'
    ],
    faqs: [
      {
        q: 'Hangi entegratörlerle uyumludur?',
        a: 'Uyumsoft, Paraşüt, BizimHesap, KolayBi ve GİB Portal ile tam entegre çalışır.'
      }
    ]
  },

  'returns': {
    title: 'İade & Çift Kargo Maliyet Yönetimi',
    badge: '🔄 İade Koruma',
    icon: RotateCcw,
    color: 'rose',
    summary: 'İade edilen ürünlerin çift kargo masraflarını hesaplar, hasarlı veya kullanılmış ürün iadelerinde pazar yeri itiraz süreçlerini yönetir.',
    whyItMatters: 'İadeler e-ticaret satıcısının en büyük gizli gideridir (Gidiş + Dönüş kargo ücreti satıcıya kesilir). İade oranını düşürmek kârlılığı anında artırır.',
    steps: [
      {
        number: '1',
        title: 'İade Nedenlerini Analiz Edin',
        desc: 'Ürünün neden iade edildiğini (Beden uymadı, kusurlu, vazgeçti) görün.'
      },
      {
        number: '2',
        title: 'Kusurlu İadelere İtiraz Edin',
        desc: 'Kullanılmış veya hasarlı iadeler için fotoğraflı itiraz paketini hazırlayın.'
      }
    ],
    proTips: [
      '💡 İade oranı %10\'un üzerinde olan ürünlerde beden tablosunu veya fotoğrafları güncelleyerek iadeleri yarı yarıya azaltabilirsiniz.'
    ],
    faqs: [
      {
        q: 'Çift kargo faturasını kargo denetiminde görebilir miyim?',
        a: 'Evet, Kargo Denetimi sayfasıyla senkronize çalışarak gereksiz kesintileri yakalar.'
      }
    ]
  },

  'pro-table': {
    title: 'Pro Maliyet, Komisyon & Kâr Simülatörü',
    badge: '📊 Kâr Simülatörü',
    icon: BarChart3,
    color: 'teal',
    summary: 'Ürünlerinizin pazar yeri komisyonlarını, kargo maliyetlerini, KDV\'sini ve reklam payını tek bir excel benzeri tabloda simüle eder.',
    whyItMatters: 'Fiyatınızı 20 TL artırdığınızda kârınızın yüzde kaç artacağını önceden görmek doğru fiyat stratejisi kurmanızı sağlar.',
    steps: [
      {
        number: '1',
        title: 'Maliyet ve Fiyatları Düzenleyin',
        desc: 'Tablodaki hücreleri canlı olarak düzenleyip net kârın nasıl değiştiğini anında görün.'
      },
      {
        number: '2',
        title: 'Farklı Pazar Yerlerini Karşılaştırın',
        desc: 'Aynı ürünün Trendyol, Hepsiburada ve Amazon\'daki kârlılığını yan yana inceleyin.'
      }
    ],
    proTips: [
      '💡 Excel formatında dışa aktararak muhasebenizle doğrudan paylaşabilirsiniz.'
    ],
    faqs: [
      {
        q: 'Değiştirdiğim fiyatlar doğrudan pazar yerine yansır mı?',
        a: 'Güvenlik kapısı onayınız olmadan fiyatlar pazar yerine gönderilmez; burada güvenle simülasyon yapabilirsiniz.'
      }
    ]
  },

  'ads': {
    title: 'Reklam Performansı & Gerçek ROAS Analizörü',
    badge: '📢 Reklam & ROAS',
    icon: Megaphone,
    color: 'blue',
    summary: 'Pazar yeri reklamlarına (Trendyol Sponsorlu, HepsiAd vb.) harcadığınız paranın gerçekte size ne kadar kâr getirdiğini ölçer.',
    whyItMatters: 'ROAS (Reklam Getirisi) yüksek görünse bile, komisyon ve maliyetler çıktıktan sonra reklamın sizi zarara uğratıp uğratmadığını anlamanın tek yolu budur.',
    steps: [
      {
        number: '1',
        title: 'Reklam Harcaması ve Satış Getirisini Görün',
        desc: 'Kanal bazında harcanan bütçe ve elde edilen ciroyu kıyaslayın.'
      },
      {
        number: '2',
        title: 'Reklam Sonrası Net Kârı İnceleyin',
        desc: 'Reklam ücreti kesildikten sonra kalan gerçek net kazancınızı kontrol edin.'
      }
    ],
    proTips: [
      '💡 ROAS değeri 4.0\'ın altında olan ve net kârı eksiye düşüren reklamları durdurarak paranızı koruyun.'
    ],
    faqs: [
      {
        q: 'Veriler nereden çekiliyor?',
        a: 'Trendyol ve Hepsiburada resmi reklam raporlama API\'sinden günlük olarak güncellenir.'
      }
    ]
  },

  'ai-worker': {
    title: 'AI E-Ticaret Çalışanı (7/24 Otonom Mağaza Denetçisi)',
    badge: '🤖 7/24 AI Çalışanı',
    icon: Brain,
    color: 'orange',
    summary: 'Mağazanızdaki kâr kaçaklarını, stok bitişlerini, kargo hatalarını ve fiyat fırsatlarını saniye saniye denetleyen akıllı e-ticaret asistanınız.',
    whyItMatters: 'İşletmenizde yüzlerce ürün ve sipariş akarken gözden kaçan detayları sizin yerinize yakalar, ne yapmanız gerektiğini söyler ve onayınızla uygular.',
    steps: [
      {
        number: '1',
        title: 'Öncelikli AI Aksiyonlarını İnceleyin',
        desc: 'AI çalışanının mağazanız için hazırladığı tasarruf ve kâr fırsatlarını kontrol edin.'
      },
      {
        number: '2',
        title: 'Güvenlik Kapısı ile Onaylayın',
        desc: '"Onayla" butonuna basarak pazar yerinde fiyat güncellemeyi veya itiraz oluşturmayı tek tıkla yürütün.'
      }
    ],
    proTips: [
      '💡 Sağ üstteki "AI Danışman" butonuna tıklayarak mağazanız hakkında aklınıza gelen her soruyu serbestçe sorabilirsiniz.'
    ],
    faqs: [
      {
        q: 'AI benim iznim olmadan fiyat değiştirebilir mi?',
        a: 'ASLA! izeeg AI güvenlik ilkesi gereği hiçbir aksiyon sizin açık onayınız olmadan mağazanıza uygulanmaz.'
      }
    ]
  }
};

export function PageHelpGuideModal({ isOpen, onClose, pageKey = 'orders' }) {
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' | 'faqs'

  if (!isOpen) return null;

  const data = PAGE_GUIDE_DATA[pageKey] || PAGE_GUIDE_DATA['orders'];
  const IconComponent = data.icon || HelpCircle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
        
        {/* Üst Başlık Barı */}
        <div className="bg-gradient-to-r from-[#121924] via-[#1a2638] to-[#121924] text-white p-5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-[#f27a1a]">
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/30">
                  {data.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Kullanım & Özellik Kılavuzu</span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                {data.title}
              </h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sekme Butonları */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-slate-50/50 flex-shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-[#f27a1a] text-[#f27a1a] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📘 Nasıl Kullanılır & Ne İşe Yarar?</span>
          </button>

          <button
            onClick={() => setActiveTab('faqs')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'faqs'
                ? 'border-[#f27a1a] text-[#f27a1a] font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>❓ Sıkça Sorulan Sorular ({data.faqs?.length || 0})</span>
          </button>
        </div>

        {/* Gövde - Kaydırılabilir Alan */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed flex-1">
          
          {activeTab === 'guide' && (
            <>
              {/* 1. Ne İşe Yarar? (Değer Önerisi Kutusu) */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-orange-950 font-black text-xs">
                  <Sparkles className="w-4 h-4 text-[#f27a1a]" />
                  <span>Bu Sayfa Ne İşe Yarar ve Neden Önemlidir?</span>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed text-[11px]">
                  {data.summary}
                </p>
                <p className="text-orange-900/90 text-[11px] pt-1 border-t border-orange-200/60 leading-relaxed">
                  <strong>💡 Satıcıya Kazancı:</strong> {data.whyItMatters}
                </p>
              </div>

              {/* 2. Adım Adım Nasıl Kullanılır? */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Adım Adım Kullanım Rehberi</span>
                </h4>

                <div className="space-y-2.5">
                  {data.steps.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#121924] text-white flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                        {step.number}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 text-xs">{step.title}</h5>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Pro İpuçları */}
              {data.proTips && data.proTips.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-black text-xs">
                    <Lightbulb className="w-4 h-4 text-emerald-600" />
                    <span>Uzman Satıcı İpuçları (Pro Tips)</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-emerald-950 font-medium">
                    {data.proTips.map((tip, tIdx) => (
                      <li key={tIdx} className="leading-relaxed">{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-purple-600" />
                <span>Bu Sayfa Hakkında En Çok Sorulanlar</span>
              </h4>

              <div className="space-y-2.5">
                {data.faqs?.map((faq, fIdx) => (
                  <div key={fIdx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-1.5">
                    <div className="font-black text-slate-900 text-xs flex items-center gap-2">
                      <span className="text-purple-600">Q:</span> {faq.q}
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed pl-4 border-l-2 border-purple-300">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Alt Buton Barı */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>7/24 Kesintisiz AI Destek Devrede</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#f27a1a] hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            Anladım, Sayfaya Dön
          </button>
        </div>

      </div>
    </div>
  );
}

// Kolay Kullanım İçin Her Sayfaya Konulacak Şık Buton Bileşeni
export function PageGuideButton({ onClick, label = "Nasıl Kullanılır & Rehber", className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-[#f27a1a] border border-orange-500/30 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer group ${className}`}
      title="Bu sayfa ne işe yarar ve nasıl kullanılır? Tıkla öğren."
    >
      <BookOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
      <span>{label}</span>
    </button>
  );
}
