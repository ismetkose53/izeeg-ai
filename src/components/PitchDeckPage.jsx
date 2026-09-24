import React, { useState } from 'react';
import { 
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
  HelpCircle,
  BarChart3,
  RotateCcw,
  Truck,
  Percent,
  Play,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { IzeegLogo } from './IzeegLogo';

export function PitchDeckPage({ onOpenContactModal, onOpenSubModal, onNavigateTab }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Slayt Tanımları & Zengin Pazarlama İçerikleri
  const slides = [
    // 1. SLAYT: VİZYON & PROBLEM
    {
      id: 'vision',
      menuTitle: '1. Vizyon & Problem',
      badge: '🌟 VİZYON & PROBLEM',
      title: 'izeeg AI: Ciroya Değil, Cebinize Giren Net Kâra Odaklanın',
      subtitle: 'Türkiye’nin İlk Kâr ve Kayıp Korumalı, Çok Kanallı Akıllı E-Ticaret İşletim Sistemi',
      icon: Crown,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent border border-orange-200">
            <h3 className="text-base lg:text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
              🎯 Neden Kurulduk? E-Ticaret Satıcısının En Büyük Problemi Nedir?
            </h3>
            <p className="text-xs lg:text-sm text-slate-700 leading-relaxed">
              Binlerce satıcı pazar yerlerinde ayda yüzbinlerce TL ciro yapıyor; ancak ay sonunda banka hesabına baktığında <strong>"Ben bu kadar sattım ama kazandığım para nerede?"</strong> sorusunu soruyor. Çünkü komisyonlar, gizli kargo desi kesintileri, reklam harcamaları, iadeler ve stopajlar kârı eritiyor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-[#f27a1a] transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#f27a1a] flex items-center justify-center font-black text-xl">
                1
              </div>
              <h4 className="text-sm font-black text-slate-900">Sıfır Hayali Veri Prensibi</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tahmini veya uydurma rakamlar yok. Tüm pazar yerlerinin resmi API'leri ile kuruşu kuruşuna doğrulanmış net hakediş hesaplanır.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-emerald-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xl">
                2
              </div>
              <h4 className="text-sm font-black text-slate-900">Kargo Kaçak Avcısı</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kargo firmalarının faturalarda kestiği fazla desileri ve haksız ücretleri tek tıkla yakalar, resmi itiraz dilekçesiyle paranızı geri alır.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-purple-500 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-xl">
                3
              </div>
              <h4 className="text-sm font-black text-slate-900">7/24 Otonom AI Çalışanı</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fiyat kırar, Buybox alır, müşteri sorularına satış odaklı yanıt verir ve e-faturaları onayınızla otomatik yönetir.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // 2. SLAYT: ÇOK KANALLI ÜRÜN YÜKLEME & DAĞITIM (YENİ AMİRAL GEMİSİ)
    {
      id: 'omnichannel',
      menuTitle: '2. Çok Kanallı Dağıtım',
      badge: '🚀 YENİ AMİRAL GEMİSİ',
      title: 'Çok Kanallı Ürün Yükleme & Katalog Dağıtım Motoru',
      subtitle: '1 Kez Ürün Girin ➔ Trendyol, Hepsiburada, Amazon, Pazarama ve Web Sitenize Aynı Anda Gönderin!',
      icon: Globe,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/15 via-orange-500/10 to-transparent border border-blue-200">
            <h3 className="text-base lg:text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              Günde 3 Saatlik Operasyonel Hamallığa Son!
            </h3>
            <p className="text-xs lg:text-sm text-slate-700 leading-relaxed">
              Artık 4 farklı pazar yerine ve kendi sitenize tek tek girip fotoğraf yüklemek, açıklama kopyalamak yok.
              izeeg AI ile tek bir standart form doldurun; sistem tüm kanalların kurallarına göre saniyeler içinde yayına alsın.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>AI Otomatik SEO & Açıklama Yazarı</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trendyol için zengin HTML metin, Amazon A9 için 5 maddeli Bullet Points ve Web siteniz için Google SEO meta etiketlerini tek tıkla üretir.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span>Kanal Bazlı Akıllı Fiyat & Kâr</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Alış maliyetinizi girin; Trendyol (%14.5), Hepsiburada (%16), Amazon (%15) ve Kendi Siteniz (%2 POS) için net kârınızı canlı hesaplayın.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-orange-700 font-bold text-sm">
                <Boxes className="w-5 h-5 text-[#f27a1a]" />
                <span>Ortak Sanal Stok Havuzu</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hantal depo ERP programlarına gerek kalmadan, tek bir sanal stok havuzundan tüm kanallarda stok düşümü senkronize yönetilir.
              </p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Sıfır Hata Pre-Flight Doğrulaması</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Eksik barkod veya kategori varsa sistem yayına göndermeden önce uyarır, pazar yerlerinden ret almanızı ve ceza yemenizi önler.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // 3. SLAYT: 7/24 AI ÇALIŞANI & GÜVENLİK KAPISI
    {
      id: 'ai-worker',
      menuTitle: '3. 7/24 AI Çalışanı',
      badge: '🤖 7/24 AKILLI ÇALIŞAN',
      title: '7/24 Çalışan AI E-Ticaret Asistanı ve Güvenlik Protokolü',
      subtitle: 'Mağazanız uyurken bile kâr kaçaklarını yakalar, onayınız olmadan tek kuruş değiştirmez.',
      icon: Bot,
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-amber-50/90 border border-amber-200 text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-black text-base lg:text-lg text-amber-900">
              <Lock className="w-6 h-6 text-amber-600" />
              <span>Kritik Güvenlik İlkesi (Action Approval Gate):</span>
            </div>
            <p className="text-xs lg:text-sm text-amber-900 leading-relaxed">
              Diğer tehlikeli botlar gibi fiyatlarınızı kafasına göre değiştirip sizi zarara sokmaz! AI Çalışanı fırsatı yakalar, hesaplamayı yapar ve önünüze onay butonu koyar. Siz <strong>"Onayla"</strong> demeden hiçbir pazar yerine müdahale edilmez.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
              <span className="text-orange-600 font-black text-xs uppercase tracking-wider block">🔍 1. Saniye Saniye Tarar</span>
              <h5 className="font-bold text-slate-900 text-sm">Anomali Tespiti</h5>
              <p className="text-xs text-slate-600">Kargo kesintilerini, Buybox kayıplarını ve kritik stok bitişlerini arka planda izler.</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
              <span className="text-blue-600 font-black text-xs uppercase tracking-wider block">💡 2. Çözüm Önerir</span>
              <h5 className="font-bold text-slate-900 text-sm">Matematiksel Reçete</h5>
              <p className="text-xs text-slate-600">"Bu ürünü 399 TL yaparsan ayda +2.450 TL kâr edersin" şeklinde hazır reçete sunar.</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-1.5">
              <span className="text-emerald-600 font-black text-xs uppercase tracking-wider block">✅ 3. Onayınızla Uygular</span>
              <h5 className="font-bold text-slate-900 text-sm">Güvenli İcra</h5>
              <p className="text-xs text-slate-600">Tek tık onayınızla pazar yeri API'sine emri iletir ve denetim kaydına yazar.</p>
            </div>
          </div>
        </div>
      )
    },

    // 4. SLAYT: TÜM MODÜLLERİN TAM LİSTESİ
    {
      id: 'modules',
      menuTitle: '4. 10 Büyük Modül',
      badge: '📦 EKSİKSİZ 10 DEV MODÜL',
      title: 'İçerisinde Neler Var? Tek Abonelikle 10 Güçlü Modül',
      subtitle: 'Ayrı ayrı 5 farklı yazılıma ayda 15.000 TL ödemek yerine hepsi izeeg AI çatısı altında',
      icon: Layers,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[480px] overflow-y-auto pr-1">
          
          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#f27a1a] flex items-center justify-center flex-shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">1. Çok Kanallı Ürün Yükleme</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Trendyol, HB, Amazon, Web Sitenize tek tıkla ürün dağıtımı ve AI SEO yazarı.</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">2. Gerçek Net Kâr & Bilanço</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Komisyon, kargo, reklam ve stopaj düşülmüş kuruşu kuruşuna net hakediş.</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">3. Kargo Kaçağı & İtiraz Sihirbazı</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Hatalı kesilen fazla desileri yakalar, resmi PDF itiraz dilekçesi üretir.</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">4. Akıllı Buybox Repricer</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Zarar etmeden taban fiyat korumasıyla 7/24 Buybox kazandırır.</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center flex-shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">5. Stok Tahmini & Tedarik PO Fişi</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Stok tükenmeden önce tedarikçiye WhatsApp sipariş fişi keser.</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">6. Müşteri Soruları AI Asistanı</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Gelen sorulara 15 saniyede ikna edici ve pazar yeri kurallarına uygun yanıt verir.</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">7. E-Fatura & Toplu Kargo Barkodu</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Tek tıkla GİB e-arşiv faturalandırma ve A4/Termal kargo sticker baskısı.</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">8. İade & Çift Kargo Yönetimi</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Gidiş-dönüş kargo zararlarını analiz eder ve kusurlu iadelere itiraz ettirir.</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">9. WhatsApp Sabah Yönetici Bülteni</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Her sabah 09:00'da cep telefonunuza dünün kâr/zarar özetini yollar.</span>
            </div>
          </div>

          <div className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <strong className="text-slate-900 block font-bold text-xs">10. Reklam ROAS & Kâr Analizi</strong>
              <span className="text-slate-500 text-[11px] leading-relaxed block">Pazar yeri reklamlarının net kârınıza gerçek katkısını ölçer.</span>
            </div>
          </div>

        </div>
      )
    },

    // 5. SLAYT: RAKİP KARŞILAŞTIRMA MATRİSİ
    {
      id: 'comparison',
      menuTitle: '5. Rakip Karşılaştırma',
      badge: '⚔️ RAKİPLERLE FARKIMIZ',
      title: 'Klasik Entegratörler vs. izeeg AI Kâr Motoru',
      subtitle: 'Neden sadece stok kopyalayan eski programlara binlerce lira ödememelisiniz?',
      icon: Scale,
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-black text-xs">
                  <th className="py-3 px-4">Özellik / Yetenek</th>
                  <th className="py-3 px-4 text-rose-300 bg-slate-800">Eski Nesil Entegratörler</th>
                  <th className="py-3 px-4 text-emerald-300 bg-slate-950 font-black">izeeg AI E-Ticaret Sistemi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-medium text-slate-700">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-slate-900">Çok Kanallı Ürün Yükleme</td>
                  <td className="py-3 px-4 text-slate-500 bg-rose-50/30">❌ Karmaşık Excel & Ek Modül Ücretleri</td>
                  <td className="py-3 px-4 text-emerald-900 font-bold bg-emerald-50/60">✅ 1 Tıkla AI SEO'lu Dağıtım</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Gerçek Net Kâr Hesabı</td>
                  <td className="py-3 px-4 text-slate-500 bg-rose-50/30">❌ Yok (Sadece Ciro Gösterir)</td>
                  <td className="py-3 px-4 text-emerald-900 font-bold bg-emerald-50/60">✅ Kuruşu kuruşuna canlı net kâr</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-slate-900">Kargo Desi Kaçağı Yakalama</td>
                  <td className="py-3 px-4 text-slate-500 bg-rose-50/30">❌ Yok (Faturadaki hatayı görmez)</td>
                  <td className="py-3 px-4 text-emerald-900 font-bold bg-emerald-50/60">✅ 1 Tıkla resmi itiraz dilekçesi</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Otomatik Buybox & Repricer</td>
                  <td className="py-3 px-4 text-slate-500 bg-rose-50/30">❌ Ekstra 2.500 TL+ aylık ücret</td>
                  <td className="py-3 px-4 text-emerald-900 font-bold bg-emerald-50/60">✅ Dahili & Zarar Korumalı</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-bold text-slate-900">Müşteri Soruları AI</td>
                  <td className="py-3 px-4 text-slate-500 bg-rose-50/30">❌ Yok (Elle tek tek yazılır)</td>
                  <td className="py-3 px-4 text-emerald-900 font-bold bg-emerald-50/60">✅ 1 Tıkla satış odaklı cevap</td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="py-3 px-4 font-bold text-slate-900">Fiyat Politikası</td>
                  <td className="py-3 px-4 text-slate-500 bg-rose-50/30">❌ Yıllık zorunlu taahhütler</td>
                  <td className="py-3 px-4 text-emerald-900 font-black bg-emerald-50/60">✅ 979 ₺/ay • Taahhütsüz & 7 Gün Ücretsiz</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },

    // 6. SLAYT: ROI & NET KÂR KANITI
    {
      id: 'roi',
      menuTitle: '6. ROI & Kazanç Kanıtı',
      badge: '💰 YATIRIM GERİ DÖNÜŞÜ (ROI)',
      title: 'Yatırımınız İlk Haftadan Katbekat Geri Döner',
      subtitle: 'izeeg sadece bir yazılım değil, mağazanızın kasasını koruyan bir kalkan.',
      icon: Award,
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl text-slate-800 space-y-3">
            <div className="flex items-center gap-2 font-black text-emerald-900 text-base">
              <Award className="w-6 h-6 text-emerald-600" />
              <span>Gerçek Bir Satıcı Örneği (Aylık 300 Sipariş):</span>
            </div>
            <div className="space-y-2 text-xs lg:text-sm text-emerald-950 font-medium">
              <div>• <strong>Kargo Desi Kurtarması:</strong> Faturadaki 18 hatalı desiden ➔ <strong>+1.420 ₺ kurtarıldı.</strong></div>
              <div>• <strong>Buybox Artışı:</strong> Algoritmanın kazandırdığı ek satışlardan ➔ <strong>+4.800 ₺ net kâr.</strong></div>
              <div>• <strong>Zararlı Reklam Durdurma:</strong> ROAS avcısının kapattığı kampanyadan ➔ <strong>+950 ₺ tasarruf.</strong></div>
              <div>• <strong>Ürün Yükleme Zaman Tasarrufu:</strong> 25 saat operasyonel iş gücü kazancı ➔ <strong>+3.500 ₺ değer.</strong></div>
            </div>
            <div className="pt-3 border-t border-emerald-300 font-black text-emerald-900 flex justify-between text-base">
              <span>Toplam Sağlanan Aylık Fayda:</span>
              <span className="text-lg text-emerald-700">+10.670 ₺ / Ay</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center space-y-1">
            <p className="text-xs text-slate-700 leading-relaxed">
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

  const handleSharePresentation = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("IZEEG AI - E-TICARET PLATFORMU TANITIM VE PITCH DECK", 15, 20);
    doc.setFontSize(12);
    doc.text("Turkiye'nin Ilk Kar ve Kayip Korumali E-Ticaret Isletim Sistemi", 15, 30);
    doc.setFontSize(10);
    doc.text("1. Cok Kanalli Urun Yukleme & Dagitim Motoru", 15, 45);
    doc.text("2. Gercek Net Kar ve Bilanço Hesaplama", 15, 55);
    doc.text("3. Kargo Desi Kacagi ve Resmi Itiraz Sihirbazi", 15, 65);
    doc.text("4. 7/24 Akilli Buybox Repricer ve Fiyat Savascisi", 15, 75);
    doc.text("5. Stok Tahmini ve Tedarikci PO Fisi", 15, 85);
    doc.text("6. Musteri Sorulari AI Yanitlayici", 15, 95);
    doc.text("7. E-Fatura ve Toplu Kargo Barkodu", 15, 105);
    doc.text("8. Iade ve Cift Kargo Maliyet Kurtarma", 15, 115);
    doc.text("9. WhatsApp Sabah Yonetici Bulteni", 15, 125);
    doc.text("10. 7/24 Guvenlik Onay Kapili AI E-Ticaret Calisani", 15, 135);
    doc.text("Aylik Fiyat: 979 TL (Taahhutsuz & 7 Gun Ucretsiz Deneme)", 15, 155);
    doc.text("Web: www.izeeg.ai | Iletisim: destek@izeeg.ai", 15, 165);
    doc.save("izeeg_AI_Urun_Sunumu_PitchDeck.pdf");
    confetti({ particleCount: 70, spread: 70 });
  };

  const currentSlideData = slides[activeSlide];

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      
      {/* 1. Üst Tanıtım Hero Başlığı */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1a2536] to-[#111827] rounded-3xl p-6 lg:p-8 text-white border border-slate-700 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f27a1a]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-[#f27a1a] text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                MÜŞTERİ SUNUMU & PITCH DECK v2.4
              </span>
              <span className="text-xs text-slate-300 font-bold bg-white/10 px-2.5 py-1 rounded-full">
                Slayt {activeSlide + 1} / {slides.length}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              {currentSlideData.title}
            </h1>

            <p className="text-xs lg:text-sm text-slate-300 font-medium leading-relaxed">
              {currentSlideData.subtitle}
            </p>
          </div>

          {/* Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shadow-sm"
              title="Sunumu PDF olarak indir"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>PDF İndir</span>
            </button>

            <button
              onClick={onOpenContactModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
            >
              <span>📞 Bizi Arayın</span>
            </button>

            <button
              onClick={onOpenSubModal}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f27a1a] to-orange-600 hover:opacity-95 text-white font-black text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>7 Gün Ücretsiz Başla</span>
            </button>
          </div>
        </div>

        {/* Slayt İlerleme Çubuğu */}
        <div className="mt-6 pt-4 border-t border-slate-700/80">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#f27a1a] to-emerald-400 transition-all duration-300"
              style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Slayt Sekme Butonları (Hızlı Geçiş) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {slides.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeSlide === idx;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSlide(idx)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                isActive 
                  ? 'bg-[#f27a1a] text-white shadow-orange-500/20 font-black' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{s.menuTitle}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Ana Slayt İçerik Alanı */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-orange-50 text-[#f27a1a] border border-orange-200">
            {currentSlideData.badge}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={activeSlide === 0}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>

            <button
              onClick={handleNext}
              disabled={activeSlide === slides.length - 1}
              className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>İleri</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dinamik Slayt Gövdesi */}
        <div>
          {currentSlideData.content}
        </div>

        {/* Alt Hızlı Gezinme & Dönüş */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL • GİB Uyumlu • KVKK Güvenceli Bulut Altyapısı</span>
          </div>

          <div className="flex items-center gap-3">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('ai-worker')}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Panele Geri Dön
              </button>
            )}

            <button
              onClick={onOpenSubModal}
              className="px-5 py-2 rounded-xl bg-[#f27a1a] text-white font-black hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20"
            >
              Ücretsiz Denemeyi Başlat
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default PitchDeckPage;
