import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Scale, 
  Bot, 
  Boxes, 
  MessageSquare, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Download, 
  Copy, 
  Check, 
  Send, 
  Smartphone, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  FileText, 
  Layers, 
  Award,
  Crown,
  Flame,
  ArrowRight,
  ExternalLink,
  Globe,
  ShoppingBag,
  Clock,
  Lock,
  Search,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { IzeegLogo } from './IzeegLogo';

export function ProductPitchDeckModal({ isOpen, onClose, onOpenContactModal, onOpenSubModal }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);

  if (!isOpen) return null;

  const slides = [
    // SLIDE 0: VİZYON & PROBLEM
    {
      id: 'vision',
      badge: '🌟 VİZYON & HİKAYEMİZ',
      title: 'izeeg AI: E-Ticarette Ciroya Değil, Cebinize Giren Net Kâra Odaklanın',
      subtitle: 'Türkiye’nin İlk Kâr ve Kayıp Korumalı, Çok Kanallı Akıllı E-Ticaret İşletim Sistemi',
      content: (
        <div className="space-y-4 text-xs leading-relaxed text-slate-700">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200">
            <h4 className="text-sm font-black text-slate-900 mb-1 flex items-center gap-2">
              🎯 Neden Kurulduk? E-Ticaret Satıcısının En Büyük Problemi Nedir?
            </h4>
            <p className="text-slate-700">
              Binlerce satıcı pazar yerlerinde ayda yüzbinlerce TL ciro yapıyor; ancak ay sonunda banka hesabına baktığında <strong>"Ben bu kadar sattım ama kazandığım para nerede?"</strong> sorusunu soruyor. Çünkü komisyonlar, gizli kargo desi kesintileri, reklam harcamaları, iadeler ve stopajlar kârı eritiyor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#f27a1a] flex items-center justify-center mx-auto text-lg font-black">
                1
              </div>
              <strong className="text-xs font-black text-slate-900 block">Sıfır Hayali Veri</strong>
              <p className="text-[11px] text-slate-500">Tahmini değil, API ile kuruşu kuruşuna doğrulanmış net hakediş.</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-lg font-black">
                2
              </div>
              <strong className="text-xs font-black text-slate-900 block">Kaçak Avcısı</strong>
              <p className="text-[11px] text-slate-500">Kargo firmalarının kestiği fazla desileri tek tıkla yakalayıp geri alır.</p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto text-lg font-black">
                3
              </div>
              <strong className="text-xs font-black text-slate-900 block">7/24 AI Çalışanı</strong>
              <p className="text-[11px] text-slate-500">Fiyat kırar, Buybox alır, müşteri sorularını ve faturaları otomatik yönetir.</p>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 1: ÇOK KANALLI ÜRÜN YÜKLEME & DAĞITIM (YENİ AMİRAL GEMİSİ)
    {
      id: 'omnichannel',
      badge: '🚀 YENİ AMİRAL GEMİSİ ÖZELLİK',
      title: 'Çok Kanallı Ürün Yükleme & Katalog Dağıtım Motoru',
      subtitle: '1 Kez Ürün Girin ➔ Trendyol, Hepsiburada, Amazon, Pazarama ve Web Sitenize Aynı Anda Gönderin!',
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-orange-500/10 to-transparent border border-blue-200 text-slate-800">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm mb-1">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Günde 3 Saat Operasyon Hamallığından Kurtulun:</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Artık 4 farklı pazar yerine ve kendi sitenize tek tek fotoğraf yükleyip açıklama yazmak yok. 
              izeeg AI ile tek bir form doldurun, sistem tüm pazar yerlerinin kurallarına uygun olarak saniyeler içinde yayına alsın.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-purple-700 font-bold">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI Otomatik SEO & Açıklama Yazarı</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Trendyol için zengin HTML metin, Amazon A9 için 5 maddeli Bullet Points ve Web siteniz için Google SEO meta etiketlerini tek tıkla üretir.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Kanal Bazlı Akıllı Fiyat & Kâr</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Alış maliyetinizi girin; Trendyol (%14.5), Hepsiburada (%16), Amazon (%15) ve Kendi Siteniz (%2 POS) için net kârınızı canlı hesaplayın.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-orange-700 font-bold">
                <Boxes className="w-4 h-4 text-[#f27a1a]" />
                <span>Ortak Sanal Stok Havuzu</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Hantal depo programlarına gerek kalmadan, tek bir stok havuzundan tüm kanallar senkronize yönetilir.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-blue-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Sıfır Hata Pre-Flight Doğrulaması</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Eksik barkod veya kategori varsa sistem yayına göndermeden önce uyarır, pazar yerlerinden ret almanızı önler.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 2: AI ÇALIŞANI & GÜVENLİK KAPISI
    {
      id: 'ai-worker',
      badge: '🤖 7/24 AKILLI ÇALIŞAN',
      title: '7/24 Çalışan AI E-Ticaret Asistanı ve Güvenlik Protokolü',
      subtitle: 'Mağazanız uyurken bile kâr kaçaklarını yakalar, onayınız olmadan tek kuruş değiştirmez.',
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-sm text-amber-900">
              <Lock className="w-5 h-5 text-amber-600" />
              <span>Kritik Güvenlik İlkesi (Action Approval Gate):</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Diğer tehlikeli botlar gibi fiyatlarınızı kafasına göre değiştirip sizi zarara sokmaz! AI Çalışanı fırsatı yakalar, hesaplamayı yapar ve önünüze onay butonu koyar. Siz <strong>"Onayla"</strong> demeden hiçbir pazar yerine müdahale edilmez.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-orange-600 font-bold block mb-1">🔍 1. Saniye Saniye Tarar</span>
              <p className="text-[11px] text-slate-500">Kargo kesintilerini, Buybox kayıplarını ve stok bitişlerini izler.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-blue-600 font-bold block mb-1">💡 2. Çözüm Önerir</span>
              <p className="text-[11px] text-slate-500">"Bu ürünü 399 TL yaparsan ayda +2.450 TL kâr edersin" şeklinde hazır reçete sunar.</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-emerald-600 font-bold block mb-1">✅ 3. Onayınızla Uygular</span>
              <p className="text-[11px] text-slate-500">Tek tık onayınızla pazar yeri API'sine emri iletir ve audit log'a kaydeder.</p>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 3: TÜM MODÜLLERİN TAM LİSTESİ
    {
      id: 'modules',
      badge: '📦 EKSİKSİZ 10 DEV MODÜL',
      title: 'İçerisinde Neler Var? Tek Abonelikle 10 Güçlü Modül',
      subtitle: 'Ayrı ayrı 5 farklı yazılıma ayda 15.000 TL ödemek yerine hepsi izeeg AI çatısı altında',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs max-h-[380px] overflow-y-auto pr-1">
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <Globe className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">1. Çok Kanallı Ürün Yükleme</strong>
              <span className="text-slate-500 text-[11px]">Trendyol, HB, Amazon, Web Sitenize tek tıkla ürün dağıtımı.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <DollarSign className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">2. Gerçek Net Kâr & Bilanço</strong>
              <span className="text-slate-500 text-[11px]">Komisyon, kargo, reklam ve stopaj düşülmüş kuruşu kuruşuna net hakediş.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <Scale className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">3. Kargo Kaçağı & İtiraz Sihirbazı</strong>
              <span className="text-slate-500 text-[11px]">Hatalı kesilen fazla desileri yakalar, resmi itiraz dilekçesi üretir.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <Zap className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">4. Akıllı Buybox Repricer</strong>
              <span className="text-slate-500 text-[11px]">Zarar etmeden taban fiyat korumasıyla 7/24 Buybox kazandırır.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <Boxes className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">5. Stok Tahmini & Tedarik PO Fişi</strong>
              <span className="text-slate-500 text-[11px]">Stok tükenmeden önce tedarikçiye WhatsApp sipariş fişi keser.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <MessageSquare className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">6. Müşteri Soruları AI Asistanı</strong>
              <span className="text-slate-500 text-[11px]">Gelen sorulara 15 saniyede ikna edici ve pazar yeri kurallarına uygun yanıt verir.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <FileText className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">7. E-Fatura & Toplu Kargo Barkodu</strong>
              <span className="text-slate-500 text-[11px]">Tek tıkla GİB e-arşiv faturalandırma ve A4/Termal kargo sticker baskısı.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <RotateCcw className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">8. İade & Çift Kargo Yönetimi</strong>
              <span className="text-slate-500 text-[11px]">Gidiş-dönüş kargo zararlarını analiz eder ve kusurlu iadelere itiraz ettirir.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <Smartphone className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">9. WhatsApp Sabah Yönetici Bülteni</strong>
              <span className="text-slate-500 text-[11px]">Her sabah 09:00'da cep telefonunuza dünün kâr/zarar özetini yollar.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-2.5">
            <Megaphone className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold">10. Reklam ROAS & Kâr Analizi</strong>
              <span className="text-slate-500 text-[11px]">Pazar yeri reklamlarının net kârınıza gerçek katkısını ölçer.</span>
            </div>
          </div>

        </div>
      )
    },

    // SLIDE 4: RAKİP KARŞILAŞTIRMA
    {
      id: 'comparison',
      badge: '⚔️ RAKİPLERLE FARKIMIZ',
      title: 'Klasik Entegratörler vs. izeeg AI Kâr Motoru',
      subtitle: 'Neden sadece stok kopyalayan eski programlara binlerce lira ödememelisiniz?',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200 text-[11px]">
                <th className="py-2.5 px-3">Özellik / Yetenek</th>
                <th className="py-2.5 px-3 text-rose-700 bg-rose-50/50">Eski Nesil Entegratörler (X, Y, Z)</th>
                <th className="py-2.5 px-3 text-emerald-800 bg-emerald-50 font-black">izeeg AI E-Ticaret Sistemi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px] font-medium text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Çok Kanallı Ürün Yükleme</td>
                <td className="py-2.5 px-3 text-slate-500">❌ Karmaşık Excel & Ek Ücretler</td>
                <td className="py-2.5 px-3 text-emerald-800 font-bold bg-emerald-50/50">✅ 1 Tıkla AI SEO'lu Dağıtım</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Gerçek Net Kâr Hesabı</td>
                <td className="py-2.5 px-3 text-slate-500">❌ Yok (Sadece Ciro Gösterir)</td>
                <td className="py-2.5 px-3 text-emerald-800 font-bold bg-emerald-50/50">✅ Kuruşu kuruşuna canlı net kâr</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Kargo Desi Kaçağı Yakalama</td>
                <td className="py-2.5 px-3 text-slate-500">❌ Yok (Faturadaki hatayı görmez)</td>
                <td className="py-2.5 px-3 text-emerald-800 font-bold bg-emerald-50/50">✅ 1 Tıkla resmi itiraz dilekçesi</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Otomatik Buybox & Repricer</td>
                <td className="py-2.5 px-3 text-slate-500">❌ Ekstra 2.500 TL+ aylık ücret</td>
                <td className="py-2.5 px-3 text-emerald-800 font-bold bg-emerald-50/50">✅ Dahili & Zarar Korumalı</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Müşteri Soruları AI</td>
                <td className="py-2.5 px-3 text-slate-500">❌ Yok (Elle tek tek yazılır)</td>
                <td className="py-2.5 px-3 text-emerald-800 font-bold bg-emerald-50/50">✅ 1 Tıkla satış odaklı cevap</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Fiyat Politikası</td>
                <td className="py-2.5 px-3 text-slate-500">❌ Yıllık zorunlu taahhütler</td>
                <td className="py-2.5 px-3 text-emerald-800 font-black bg-emerald-50/50">✅ 979 ₺/ay • Taahhütsüz & 7 Gün Ücretsiz</td>
              </tr>
            </tbody>
          </table>
        </div>
      )
    },

    // SLIDE 5: ROI & KÂR KANITI
    {
      id: 'roi',
      badge: '💰 YATIRIM GERİ DÖNÜŞÜ (ROI)',
      title: 'Yatırımınız İlk Haftadan Katbekat Geri Döner',
      subtitle: 'izeeg sadece bir yazılım değil, mağazanızın kasasını koruyan bir kalkan.',
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Gerçek Bir Satıcı Örneği (Aylık 300 Sipariş):</span>
            </div>
            <div className="space-y-1.5 text-xs text-emerald-950 font-medium">
              <div>• <strong>Kargo Desi Kurtarması:</strong> Faturadaki 18 hatalı desiden ➔ <strong>+1.420 ₺ kurtarıldı.</strong></div>
              <div>• <strong>Buybox Artışı:</strong> Algoritmanın kazandırdığı ek satışlardan ➔ <strong>+4.800 ₺ net kâr.</strong></div>
              <div>• <strong>Zararlı Reklam Durdurma:</strong> ROAS avcısının kapattığı kampanyadan ➔ <strong>+950 ₺ tasarruf.</strong></div>
              <div>• <strong>Ürün Yükleme Zaman Tasarrufu:</strong> 25 saat operasyonel iş gücü kazancı ➔ <strong>+3.500 ₺ değer.</strong></div>
            </div>
            <div className="pt-2.5 border-t border-emerald-300 font-black text-emerald-900 flex justify-between text-sm">
              <span>Toplam Sağlanan Aylık Fayda:</span>
              <span>+10.670 ₺ / Ay</span>
            </div>
          </div>

          <div className="text-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-600">
              Sistem ücretimiz ise ayda sadece <strong>979 ₺</strong>! Yani izeeg, kendi maliyetinin <strong>10 katından fazlasını</strong> doğrudan satıcının cebine geri koymaktadır.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) setActiveSlide(prev => prev + 1);
  };

  const handlePrev = () => {
    if (activeSlide > 0) setActiveSlide(prev => prev - 1);
  };

  const currentSlideData = slides[activeSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden animate-scaleUp flex flex-col max-h-[90vh]">
        
        {/* Üst Header */}
        <div className="bg-gradient-to-r from-[#121924] via-[#1a2536] to-[#121924] text-white p-5 flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <IzeegLogo size="sm" variant="full" theme="dark" showBadge={true} badgeText="PRO" />
            <div className="hidden sm:block border-l border-slate-700 pl-3">
              <span className="text-[10px] uppercase font-black tracking-widest text-orange-400 block">
                MÜŞTERİ SUNUMU & PITCH DECK
              </span>
              <span className="text-xs text-slate-300 font-bold">
                Slide {activeSlide + 1} / {slides.length}
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slayt İlerleme Çubuğu */}
        <div className="w-full bg-slate-100 h-1.5 flex-shrink-0">
          <div 
            className="h-full bg-gradient-to-r from-[#f27a1a] to-emerald-500 transition-all duration-300"
            style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Ana Slayt Gövdesi */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 text-[#f27a1a] border border-orange-200">
              {currentSlideData.badge}
            </span>
            <h2 className="text-lg lg:text-xl font-black text-slate-900 mt-2">
              {currentSlideData.title}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentSlideData.subtitle}
            </p>
          </div>

          <div className="pt-2">
            {currentSlideData.content}
          </div>
        </div>

        {/* Alt Navigasyon & Aksiyon Barı */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          
          {/* İleri / Geri Butonları */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={handlePrev}
              disabled={activeSlide === 0}
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>

            <button
              onClick={handleNext}
              disabled={activeSlide === slides.length - 1}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>İleri</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                if (onOpenContactModal) onOpenContactModal();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📞 Bizi Arayın</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onOpenSubModal) onOpenSubModal();
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f27a1a] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>7 Gün Ücretsiz Başla</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
