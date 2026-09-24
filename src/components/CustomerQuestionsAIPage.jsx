import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Star, 
  ArrowLeft, 
  Bot, 
  ThumbsUp, 
  AlertCircle, 
  Filter, 
  Clock, 
  CheckCircle2, 
  RefreshCw,
  ShoppingBag,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PageGuideButton } from './PageHelpGuideModal';

export function CustomerQuestionsAIPage({ onNavigateBack, onOpenGuide }) {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'reviews' | 'templates'
  const [selectedTone, setSelectedTone] = useState('FRIENDLY_SALES'); // 'FRIENDLY_SALES' | 'CONCISE' | 'DEFENSIVE_SOLUTION'
  const [generatingId, setGeneratingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Müşteri Soruları Havuzu
  const [questions, setQuestions] = useState([
    {
      id: 'Q-101',
      customerName: 'Ahmet K.',
      marketplace: 'Trendyol',
      productTitle: 'Oversize Keten Gömlek - Bej / L',
      productSku: 'TY-GMLK-01',
      questionText: 'Merhabalar, 1.78 boy 76 kilo için hangi beden uygun olur? Kalıbı dar mı geniş mi, bir de kumaşı yazın terletir mi?',
      timeAgo: '14 dk önce',
      status: 'PENDING', // 'PENDING' | 'ANSWERED'
      aiSuggestedAnswer: 'Merhabalar efendim! 🌟 1.78 boy ve 76 kilo için L beden tam ve dökümlü bir oversize duruş sağlayacaktır; eğer daha oturmasını isterseniz M bedeni de tercih edebilirsiniz. Ürünümüz %100 doğal nefes alan keten dokumadır, yaz sıcaklarında kesinlikle terletmez ve serin tutar. Keyifli alışverişler dileriz! 🌿',
      sellerAnswer: ''
    },
    {
      id: 'Q-102',
      customerName: 'Selin Y.',
      marketplace: 'Hepsiburada',
      productTitle: 'Kablosuz TWS Bluetooth Kulaklık v5.3',
      productSku: 'HB-TWS-53',
      questionText: 'Bugün saat 16:00 ya kadar alsam bugün kargoya verilir mi? Cuma gününe doğum günü hediyesi olarak yetişmesi gerekiyor.',
      timeAgo: '42 dk önce',
      status: 'PENDING',
      aiSuggestedAnswer: 'Merhaba Selin Hanım! 🎁 Saat 16:00\'ya kadar verilen tüm siparişler aynı gün saat 17:00 teslimatında HepsiJET kargoya verilmektedir. Bulunduğunuz şehre göre ortalama 1-2 iş gününde teslim edilir, hediyenizin Cuma gününe güvenle yetişeceğini öngörüyoruz. Şimdiden mutlu yaşlar dileriz! 🎈',
      sellerAnswer: ''
    },
    {
      id: 'Q-103',
      customerName: 'Murat B.',
      marketplace: 'Amazon TR',
      productTitle: 'Deri Cüzdan & Kartlık - Siyah',
      productSku: 'TY-CZDN-BLK',
      questionText: 'Hakiki dana derisi mi yoksa suni deri mi? Kart gözlerine yeni kimlik ve ehliyet rahat sığıyor mu?',
      timeAgo: '2 saat önce',
      status: 'PENDING',
      aiSuggestedAnswer: 'Merhaba Murat Bey, ürünümüz %100 1. sınıf hakiki dana derisinden el işçiliği ile üretilmiştir; zamanla yıpranmaz, şık bir patina kazanır. Kart yuvaları yeni çipli kimlik ve ehliyet standartlarına birebir uyumludur, rahatlıkla sığar. İlginiz için teşekkür ederiz.',
      sellerAnswer: ''
    }
  ]);

  // Ürün Değerlendirme Yorumları Havuzu
  const [reviews, setReviews] = useState([
    {
      id: 'REV-201',
      customerName: 'Merve T.',
      rating: 5,
      marketplace: 'Trendyol',
      productTitle: 'Oversize Keten Gömlek - Bej / L',
      reviewText: 'Kumaş kalitesi harika! Tam bir yazlık kurtarıcı parça. Keten dokusu tok ve kaliteli. Kesinlikle tavsiye ederim.',
      timeAgo: 'Dün',
      status: 'PENDING',
      aiSuggestedAnswer: 'Değerli müşterimiz, güzel yorumunuz ve bizi tercih ettiğiniz için çok teşekkür ederiz! ✨ Gömleğinizi güzel ve mutlu günlerde kullanmanızı dileriz. Yeni sezon renklerimize de göz atmayı unutmayın! 🌸'
    },
    {
      id: 'REV-202',
      customerName: 'Caner D.',
      rating: 3,
      marketplace: 'Trendyol',
      productTitle: 'Deri Cüzdan & Kartlık - Siyah',
      reviewText: 'Ürün güzel ve kaliteli ama kargo 4 günde geldi, dış ambalaj biraz ezilmişti.',
      timeAgo: '2 gün önce',
      status: 'PENDING',
      aiSuggestedAnswer: 'Merhaba Caner Bey, ürünümüzü beğenmenize çok sevindik. Kargo taşıma aşamasında yaşanan gecikme ve paket ezilmesi adına kargo firması adına özür dileriz. İlgili kargo şubesine gerekli uyarıları ilettik. Cüzdanınızı keyifle kullanmanızı dileriz!'
    },
    {
      id: 'REV-203',
      customerName: 'Oğuzhan K.',
      rating: 1,
      marketplace: 'Hepsiburada',
      productTitle: 'Kablosuz TWS Bluetooth Kulaklık v5.3',
      reviewText: 'Sol kulaklıktan ses gelmiyordu, iade talebi oluşturdum.',
      timeAgo: '3 gün önce',
      status: 'PENDING',
      aiSuggestedAnswer: 'Merhaba Oğuzhan Bey, yaşadığınız bu aksilik adına çok üzgünüz. Kulaklık kutu eşleştirmesi bazen ilk şarjda sıfırlama gerektirebilmektedir (kutudaki düğmeye 10 sn basılı tutunuz). İade veya anında birebir sıfır değişim talebiniz derhal onaylanacaktır, memnuniyetiniz bizim için esastır.'
    }
  ]);

  // AI ile Yanıt Yeniden Üretme
  const handleRegenerateAnswer = (id, type = 'question') => {
    setGeneratingId(id);
    setTimeout(() => {
      setGeneratingId(null);
      confetti({ particleCount: 40, spread: 50 });
    }, 800);
  };

  // Yanıtı Kopyalama & Gönderme
  const handleSendOrCopy = (item, answerText, type = 'question') => {
    navigator.clipboard.writeText(answerText);
    setCopiedId(item.id);

    if (type === 'question') {
      setQuestions(prev => prev.map(q => q.id === item.id ? { ...q, status: 'ANSWERED', sellerAnswer: answerText } : q));
    } else {
      setReviews(prev => prev.map(r => r.id === item.id ? { ...r, status: 'ANSWERED' } : r));
    }

    setTimeout(() => setCopiedId(null), 2500);
    confetti({ particleCount: 70, spread: 60 });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 font-sans">
      
      {/* 1. Üst Başlık */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            {onNavigateBack && (
              <button 
                onClick={onNavigateBack}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> GPT-4o E-Ticaret Asistanı
                </span>
                <span className="text-xs text-amber-300 font-bold flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" /> Satışa Yönlendiren Yanıtlar
                </span>
                {onOpenGuide && (
                  <PageGuideButton 
                    onClick={onOpenGuide} 
                    label="💡 Nasıl Kullanılır?" 
                    className="bg-white/10 hover:bg-white/20 text-amber-300 border-white/20 py-1 px-3" 
                  />
                )}
              </div>
              <h1 className="text-xl lg:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <Bot className="w-6 h-6 text-purple-400" />
                Pazar Yeri Müşteri Soruları & Yorumlar AI Yanıtlayıcı
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl">
            Trendyol, Hepsiburada ve Amazon'dan gelen müşteri sorularına ve ürün değerlendirmelerine 1 tıkla nazik, profesyonel ve satın almaya ikna eden Türkçe yanıtlar üretin.
          </p>
        </div>

        {/* Bekleyen Soru Sayacı */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 px-5 rounded-2xl border border-white/20 relative z-10 text-right">
          <span className="text-[11px] text-slate-300 font-bold block">Bekleyen Müşteri Sorusu</span>
          <strong className="text-2xl font-black text-purple-300">
            {questions.filter(q => q.status === 'PENDING').length} Soru
          </strong>
          <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">Ort. Yanıt Hızı: 3 Dk</span>
        </div>

        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* 2. Filtre ve Ton Seçici Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'questions'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            💬 Müşteri Soruları ({questions.filter(q => q.status === 'PENDING').length} Bekleyen)
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'reviews'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            ⭐ Değerlendirme Yorumları ({reviews.length})
          </button>
        </div>

        {/* Yanıt Tonu */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">AI Yanıt Tonu:</span>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none focus:border-purple-500"
          >
            <option value="FRIENDLY_SALES">👔 Nazik & Satışa Teşvik Eden (Önerilen)</option>
            <option value="CONCISE">⚡ Kısa, Net & Profesyonel</option>
            <option value="DEFENSIVE_SOLUTION">🛡️ İade Önleyici & Çözüm Odaklı</option>
          </select>
        </div>
      </div>

      {/* 3. TAB 1: MÜŞTERİ SORULARI */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {questions.map((q) => {
            const isCopied = copiedId === q.id;
            const isGenerating = generatingId === q.id;

            return (
              <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                
                {/* Soru Üst Başlığı */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                      q.marketplace === 'Trendyol' ? 'bg-orange-100 text-orange-800' :
                      q.marketplace === 'Amazon TR' ? 'bg-amber-100 text-amber-900' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {q.marketplace}
                    </span>
                    <strong className="text-xs font-black text-slate-900">{q.productTitle}</strong>
                    <span className="text-[11px] text-slate-500 font-mono">({q.productSku})</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{q.timeAgo}</span>
                    <span className="font-bold text-slate-700">• {q.customerName}</span>
                  </div>
                </div>

                {/* Müşteri Sorusu */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    ?
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Gelen Soru:</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">{q.questionText}</p>
                  </div>
                </div>

                {/* AI Önerilen Yanıt Kutusu */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <strong className="text-xs font-black text-purple-950">AI Tarafından Hazırlanan Yanıt:</strong>
                    </div>

                    <button
                      onClick={() => handleRegenerateAnswer(q.id, 'question')}
                      disabled={isGenerating}
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span>Farklı Yanıt Üret</span>
                    </button>
                  </div>

                  <textarea
                    defaultValue={q.aiSuggestedAnswer}
                    rows="3"
                    className="w-full bg-white border border-purple-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-purple-500 font-medium"
                  />

                  {/* Aksiyon Butonları */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500 font-medium">
                      💡 Bu yanıt pazar yeri müşteri memnuniyeti kurallarına %100 uygundur.
                    </span>

                    <button
                      onClick={() => handleSendOrCopy(q, q.aiSuggestedAnswer, 'question')}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm ${
                        isCopied || q.status === 'ANSWERED'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
                      }`}
                    >
                      {isCopied || q.status === 'ANSWERED' ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                      <span>{isCopied || q.status === 'ANSWERED' ? 'Kopyalandı & İletildi!' : 'Yanıtı Kopyala & Gönder'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 4. TAB 2: ÜRÜN DEĞERLENDİRME YORUMLARI */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.map((rev) => {
            const isCopied = copiedId === rev.id;

            return (
              <div key={rev.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
                
                {/* Yorum Başlığı & Yıldızlar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                        />
                      ))}
                    </div>
                    <strong className="text-xs font-black text-slate-900">{rev.productTitle}</strong>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    {rev.customerName} • {rev.timeAgo}
                  </span>
                </div>

                {/* Yorum İçeriği */}
                <p className="text-xs text-slate-800 font-bold bg-slate-50 p-3 rounded-xl border border-slate-200">
                  "{rev.reviewText}"
                </p>

                {/* AI Yorum Yanıtı */}
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Önerilen Satıcı Teşekkür / Çözüm Yanıtı:</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium bg-white p-2.5 rounded-xl border border-purple-100">
                    {rev.aiSuggestedAnswer}
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleSendOrCopy(rev, rev.aiSuggestedAnswer, 'review')}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all flex items-center gap-1 shadow-sm"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Kopyalandı!' : 'Yanıtı Kopyala'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default CustomerQuestionsAIPage;
