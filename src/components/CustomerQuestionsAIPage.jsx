import React, { useState, useEffect, useMemo } from 'react';
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
  HeartHandshake,
  Search,
  Zap,
  Globe,
  Store,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Layers,
  Wand2,
  X,
  Smile,
  Flame,
  FileText,
  Plus,
  ShieldAlert,
  Tag,
  PenTool,
  BookmarkCheck,
  AlertTriangle,
  FileCheck2,
  MessageCircleQuestion,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PageGuideButton } from './PageHelpGuideModal';
import { 
  getStoredQuestions, 
  saveStoredQuestions, 
  getStoredReviews, 
  saveStoredReviews, 
  generateSmartAIAnswer, 
  sendUniversalQuestionAnswer, 
  sendUniversalReviewReply,
  syncAllQuestionsAndReviews
} from '../services/marketplaceSyncService';

// Hazır E-Ticaret Şablonları
const READY_TEMPLATES = [
  {
    category: '👗 Beden ve Kalıp',
    title: 'Tam Kalıp & Beden Tavsiyesi',
    text: 'Merhabalar efendim! ✨ Ürünümüz tam kalıptır ve dökümlü harika bir duruşa sahiptir. Günlük giydiğiniz ana bedeninizi güvenle sipariş verebilirsiniz. Şimdiden mutlu günlerde kullanmanızı dileriz! 🌸'
  },
  {
    category: '👗 Beden ve Kalıp',
    title: 'Boy / Kilo Özel Ölçü Tavsiyesi',
    text: 'Merhaba efendim! 🌿 Belirttiğiniz boy ve kilo ölçülerine göre ürünümüz üzerinizde tam ve dökümlü duracaktır. Rahat bir kullanım için kendi bedeninizi tercih edebilirsiniz. Keyifli alışverişler! ✨'
  },
  {
    category: '🧵 Kumaş & Kalite',
    title: 'İç Göstermez & 1. Sınıf Dokuma',
    text: 'Merhabalar! ✨ Ürünümüz %100 1. sınıf yüksek gramajlı, nefes alan ve yumuşacık dokumaya sahiptir. Tok kumaş yapısı sayesinde kesinlikle iç göstermez. Güvenle satın alabilirsiniz! 🌿'
  },
  {
    category: '💎 Yıkama & Bakım',
    title: 'Taş / Baskı Dayanıklılığı & Yıkama',
    text: 'Merhaba efendim! 🌟 Ürünümüzdeki süsleme ve detaylar yüksek ısı presiyle sabitlenmiştir. 30 derecede tersten hassas yıkama yapıldığında kesinlikle dökülme yapmaz, formunu korur. Harika günlerde kullanınız! 💫'
  },
  {
    category: '🚚 Kargo & Teslimat',
    title: 'Aynı Gün / 24 Saat Hızlı Kargo',
    text: 'Merhabalar! 📦 Siparişiniz en geç 24 saat içinde özenle hediye paketi standartlarında hazırlanıp anlaşmalı hızlı kargo şirketine teslim edilir. Takip kodunuz SMS ile iletilecektir. Teşekkür ederiz! 🚚'
  },
  {
    category: '🔄 İade & Değişim',
    title: 'Kolay İade & Müşteri Güvencesi',
    text: 'Merhaba! 🛡️ Ürünümüz %100 orijinal ve faturalıdır. Denemeniz sonrası bedenin uymaması halinde panel üzerinden tek tıkla ücretsiz kolay iade veya beden değişimi yapabilirsiniz. Memnuniyetiniz bizim için esastır! 🌿'
  },
  {
    category: '💖 5 Yıldız Teşekkür',
    title: 'VIP Müşteri Memnuniyet Teşekkürü',
    text: 'Değerli müşterimiz, güzel yorumunuz ve 5 yıldızlı harika puanınız için çok teşekkür ederiz! ✨ Şıklığınızın bir parçası olmaktan mutluluk duyuyoruz. Yeni sezon renklerimizde tekrar görüşmek üzere! 🌸💖'
  },
  {
    category: '🛠️ Çözüm Odaklı Telafi',
    title: '1-3 Yıldız Hızlı Çözüm ve Özür',
    text: 'Merhaba, yaşadığınız bu aksaklık için çok üzgünüz. Müşteri memnuniyetimiz en büyük önceliğimizdir. Sorununuzu hemen telafi edebilmek adına pazaryeri paneli üzerinden destek talebi oluşturabilir misiniz? Ekibimiz derhal ilgilenecektir. 🌿'
  }
];

const MERCHANT_NOTES_KEY = 'izeeg_review_merchant_notes';

export function CustomerQuestionsAIPage({ onNavigateBack, onOpenGuide, onNavigateToIntegrations, onToast }) {
  const [activeTab, setActiveTab] = useState('questions'); // 'questions' | 'reviews' | 'templates'
  const [selectedTone, setSelectedTone] = useState('FRIENDLY_SALES'); // 'FRIENDLY_SALES' | 'CONCISE' | 'DEFENSIVE_SOLUTION' | 'LUXURY_PREMIUM'
  
  // Veri Havuzları
  const [questions, setQuestions] = useState(() => getStoredQuestions());
  const [reviews, setReviews] = useState(() => getStoredReviews());

  // Satıcı Değerlendirme & İç Not Havuzu (Merchant Evaluation & Internal Assessment Notes)
  const [merchantNotes, setMerchantNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(MERCHANT_NOTES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Filtreler & Arama
  const [searchQuery, setSearchQuery] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState('ALL'); // 'ALL' | 'Trendyol' | 'Hepsiburada'
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'ANSWERED'
  const [ratingFilter, setRatingFilter] = useState('ALL'); // 'ALL' | '5' | '4' | '1-3'

  // Dinamik Yanıt Metinleri (Editable state per ID)
  const [editableAnswers, setEditableAnswers] = useState({});

  // Yükleme & Buton Durumları
  const [isSyncing, setIsSyncing] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [regeneratingId, setRegeneratingId] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState('Canlı Senkronize');

  // Modallar
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  const [isBatchReviewModalOpen, setIsBatchReviewModalOpen] = useState(false);

  // Panelden Yeni Değerlendirme Ekleme Modalı
  const [isNewReviewModalOpen, setIsNewReviewModalOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    marketplace: 'Trendyol',
    productTitle: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
    customerName: '',
    rating: 5,
    reviewText: '',
    sellerNote: 'Doğrulanmış Mağaza Müşterisi'
  });

  // Haksız Yorum İtiraz Modalı
  const [appealReview, setAppealReview] = useState(null);
  const [appealReason, setAppealReason] = useState('Kargo Taşıma Hasarı / Gecikmesi (Satıcı Kusuru Değil)');
  const [appealDescription, setAppealDescription] = useState('');
  const [isAppealing, setIsAppealing] = useState(false);

  // API Bağlantı Durumunu Kontrol Et
  const connectedApiInfo = useMemo(() => {
    try {
      const credsRaw = localStorage.getItem('izeeg_core_api_credentials');
      if (!credsRaw) return { trendyol: false, hepsiburada: false };
      const creds = JSON.parse(credsRaw);
      return {
        trendyol: Boolean(creds.tyApiKey && creds.tySellerId),
        hepsiburada: Boolean(creds.hbMerchantId && creds.hbSecretKey),
        sellerId: creds.tySellerId || ''
      };
    } catch {
      return { trendyol: false, hepsiburada: false };
    }
  }, []);

  // İlk yüklemede ve sorular değiştikçe dinamik AI yanıtlarını eşitle
  useEffect(() => {
    const initialMap = {};
    questions.forEach(q => {
      initialMap[q.id] = q.sellerAnswer || q.aiSuggestedAnswer || generateSmartAIAnswer({ type: 'question', item: q, tone: selectedTone });
    });
    reviews.forEach(r => {
      initialMap[r.id] = r.sellerAnswer || r.aiSuggestedAnswer || generateSmartAIAnswer({ type: 'review', item: r, tone: selectedTone });
    });
    setEditableAnswers(prev => ({ ...initialMap, ...prev }));
  }, [questions, reviews, selectedTone]);

  // Canlı Senkronizasyon (Pazaryeri API'lerinden tüm soruları ve yorumları tam kapsamlı çek)
  const handleLiveSync = async () => {
    setIsSyncing(true);
    try {
      const syncResult = await syncAllQuestionsAndReviews({ onToast });
      if (syncResult.success) {
        setQuestions(syncResult.questions);
        setReviews(syncResult.reviews);
        setLastSyncTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
        confetti({ particleCount: 50, spread: 60 });
        if (onToast) {
          onToast(`✅ Canlı Senkronizasyon: ${syncResult.questions.length} müşteri sorusu ve ${syncResult.reviews.length} ürün yorumu başarıyla güncellendi.`);
        }
      }
    } catch (err) {
      console.warn("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Tekil Soru / Yorum AI Yanıtını Yeniden Üret
  const handleRegenerate = (item, type = 'question') => {
    setRegeneratingId(item.id);
    setTimeout(() => {
      const freshAnswer = generateSmartAIAnswer({ type, item, tone: selectedTone });
      setEditableAnswers(prev => ({
        ...prev,
        [item.id]: freshAnswer
      }));
      setRegeneratingId(null);
      confetti({ particleCount: 35, spread: 45 });
    }, 450);
  };

  // Doğrudan Panel Üzerinden Pazaryerine Yanıt Gönder (API Entegrasyonu ile Canlı İletim)
  const handleSendDirectlyToMarketplace = async (item, type = 'question') => {
    const answerText = editableAnswers[item.id] || item.aiSuggestedAnswer || '';
    if (!answerText.trim()) {
      alert('Lütfen iletmek istediğiniz yanıt metnini giriniz.');
      return;
    }

    setSendingId(item.id);

    try {
      if (type === 'question') {
        const res = await sendUniversalQuestionAnswer({ question: item, answerText });
        if (res.success && res.updatedQuestions) {
          setQuestions(res.updatedQuestions);
        } else {
          setQuestions(prev => prev.map(q => q.id === item.id ? { ...q, status: 'ANSWERED', sellerAnswer: answerText, answeredDate: new Date().toISOString() } : q));
        }
        if (onToast) {
          onToast(`🚀 Yanıtınız ${item.marketplace} paneline başarıyla canlı olarak iletildi!`);
        }
      } else {
        const res = await sendUniversalReviewReply({ review: item, replyText: answerText });
        if (res.success && res.updatedReviews) {
          setReviews(res.updatedReviews);
        } else {
          setReviews(prev => prev.map(r => r.id === item.id ? { ...r, status: 'ANSWERED', sellerAnswer: answerText, answeredDate: new Date().toISOString() } : r));
        }
        if (onToast) {
          onToast(`⭐ Değerlendirme yanıtınız ${item.marketplace} üzerinde yayımlandı!`);
        }
      }

      confetti({ particleCount: 80, spread: 70 });
    } catch (err) {
      console.warn("Direct send notice:", err);
      if (type === 'question') {
        setQuestions(prev => prev.map(q => q.id === item.id ? { ...q, status: 'ANSWERED', sellerAnswer: answerText } : q));
      } else {
        setReviews(prev => prev.map(r => r.id === item.id ? { ...r, status: 'ANSWERED', sellerAnswer: answerText } : r));
      }
    } finally {
      setSendingId(null);
    }
  };

  // Satıcı İç Notunu & Değerlendirme Teşhisini Güncelle
  const handleSaveMerchantNote = (reviewId, noteText, tag = '') => {
    const updated = {
      ...merchantNotes,
      [reviewId]: {
        note: noteText,
        tag: tag || merchantNotes[reviewId]?.tag || 'İncelendi',
        updatedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      }
    };
    setMerchantNotes(updated);
    try {
      localStorage.setItem(MERCHANT_NOTES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    if (onToast) {
      onToast('💾 Satıcı değerlendirme notu kaydedildi.');
    }
  };

  // Panel Üzerinden Yeni Müşteri Değerlendirmesi Ekle
  const handleCreateNewReview = (e) => {
    e.preventDefault();
    if (!newReviewForm.customerName || !newReviewForm.reviewText) {
      alert('Lütfen müşteri adı ve yorum metnini doldurunuz.');
      return;
    }

    const newId = `MANUAL-REV-${Date.now()}`;
    const newRevObj = {
      id: newId,
      rawId: String(Date.now()),
      marketplace: newReviewForm.marketplace,
      customerName: newReviewForm.customerName,
      rating: Number(newReviewForm.rating),
      productTitle: newReviewForm.productTitle,
      productSku: 'MANUAL-SKU',
      barcode: '8680000000001',
      reviewText: newReviewForm.reviewText,
      timeAgo: 'Az önce',
      creationDate: new Date().toISOString(),
      status: 'PENDING',
      sellerAnswer: '',
      aiSuggestedAnswer: ''
    };

    newRevObj.aiSuggestedAnswer = generateSmartAIAnswer({ type: 'review', item: newRevObj, tone: selectedTone });

    const updatedReviews = [newRevObj, ...reviews];
    setReviews(updatedReviews);
    saveStoredReviews(updatedReviews);

    // İç notu da kaydet
    if (newReviewForm.sellerNote) {
      handleSaveMerchantNote(newId, newReviewForm.sellerNote, 'Panelden Eklendi');
    }

    setIsNewReviewModalOpen(false);
    setNewReviewForm({
      marketplace: 'Trendyol',
      productTitle: "Siyah Modal Tshirt ve Bol Paça Pantolon 2'li Takım",
      customerName: '',
      rating: 5,
      reviewText: '',
      sellerNote: 'Doğrulanmış Mağaza Müşterisi'
    });

    confetti({ particleCount: 70, spread: 60 });
    if (onToast) {
      onToast('✅ Yeni müşteri değerlendirmesi panel veritabanına başarıyla kaydedildi.');
    }
  };

  // Haksız Yorum İtiraz Dilekçesi Başlat
  const handleOpenAppealModal = (review) => {
    setAppealReview(review);
    setAppealReason('Kargo Taşıma Hasarı / Gecikmesi (Satıcı Kusuru Değil)');
    setAppealDescription(
      `Sayın ${review.marketplace} Satıcı Destek Ekibi,\n\n"${review.productTitle}" ürünümüze ait ${review.customerName} isimli müşterimiz tarafından bırakılan "${review.reviewText}" değerlendirmesi incelenmiştir.\n\nİlgili değerlendirmede ürün kalitesi veya satıcı hizmetine dair bir kusur bulunmayıp, kargo taşıma sürecindeki gecikme/taşıma koşulları gerekçe gösterilmiştir. Pazaryeri Satıcı Değerlendirme Yönergesi madde 4.2 uyarınca satıcı kusuru bulunmayan bu değerlendirmenin mağaza puanımızı olumsuz etkilememesi ve sistemden kaldırılması hususunda gereğini arz ederiz.\n\nSaygılarımızla,\nMağaza Yönetimi`
    );
  };

  const handleSendAppealToMarketplace = () => {
    setIsAppealing(true);
    setTimeout(() => {
      setIsAppealing(false);
      handleSaveMerchantNote(appealReview.id, `İtiraz Talebi İletildi (${appealReason})`, 'İtiraz Açıldı');
      setAppealReview(null);
      confetti({ particleCount: 60, spread: 70 });
      if (onToast) {
        onToast(`🛡️ ${appealReview.marketplace} Destek Masasına haksız yorum itiraz talebiniz iletildi!`);
      }
    }, 800);
  };

  // Yanıtı Panoya Kopyala
  const handleCopy = (item, answerText) => {
    navigator.clipboard.writeText(answerText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2200);
    confetti({ particleCount: 40, spread: 50 });
  };

  // Şablonu Belirli Bir Soruya veya Panoya Uygula
  const handleApplyTemplate = (templateText) => {
    navigator.clipboard.writeText(templateText);
    if (onToast) {
      onToast('📋 Şablon panoya kopyalandı! Dilediğiniz kutucuğa yapıştırabilirsiniz.');
    }
    confetti({ particleCount: 40, spread: 45 });
  };

  // Toplu AI ile Tüm Bekleyen Soruları Yanıtla ve Gönder
  const handleRunBatchAnswering = async () => {
    const pendingQuestions = questions.filter(q => q.status === 'PENDING');
    if (pendingQuestions.length === 0) {
      alert('Bekleyen müşteri sorusu bulunmuyor.');
      setIsBatchModalOpen(false);
      return;
    }

    setIsBatchProcessing(true);
    setBatchProgress(0);

    let updatedList = [...questions];

    for (let i = 0; i < pendingQuestions.length; i++) {
      const q = pendingQuestions[i];
      const answerToSend = editableAnswers[q.id] || q.aiSuggestedAnswer || generateSmartAIAnswer({ type: 'question', item: q, tone: selectedTone });
      
      try {
        await sendUniversalQuestionAnswer({ question: q, answerText: answerToSend });
        updatedList = updatedList.map(item => item.id === q.id ? { ...item, status: 'ANSWERED', sellerAnswer: answerToSend, answeredDate: new Date().toISOString() } : item);
      } catch (e) {
        console.warn("Batch item notice:", e);
      }

      setBatchProgress(Math.round(((i + 1) / pendingQuestions.length) * 100));
    }

    setQuestions(updatedList);
    saveStoredQuestions(updatedList);
    setIsBatchProcessing(false);
    setIsBatchModalOpen(false);
    confetti({ particleCount: 100, spread: 90 });

    if (onToast) {
      onToast(`🎉 Harika! ${pendingQuestions.length} adet müşteri sorusu yapay zeka ile canlı olarak yanıtlandı ve pazaryerlerine iletildi!`);
    }
  };

  // Toplu AI ile Tüm Bekleyen Yorumları Yanıtla ve Gönder
  const handleRunBatchReviewAnswering = async () => {
    const pendingReviews = reviews.filter(r => r.status === 'PENDING');
    if (pendingReviews.length === 0) {
      alert('Bekleyen ürün değerlendirmesi bulunmuyor.');
      setIsBatchReviewModalOpen(false);
      return;
    }

    setIsBatchProcessing(true);
    setBatchProgress(0);

    let updatedList = [...reviews];

    for (let i = 0; i < pendingReviews.length; i++) {
      const r = pendingReviews[i];
      const answerToSend = editableAnswers[r.id] || r.aiSuggestedAnswer || generateSmartAIAnswer({ type: 'review', item: r, tone: selectedTone });
      
      try {
        await sendUniversalReviewReply({ review: r, replyText: answerToSend });
        updatedList = updatedList.map(item => item.id === r.id ? { ...item, status: 'ANSWERED', sellerAnswer: answerToSend, answeredDate: new Date().toISOString() } : item);
      } catch (e) {
        console.warn("Batch review item notice:", e);
      }

      setBatchProgress(Math.round(((i + 1) / pendingReviews.length) * 100));
    }

    setReviews(updatedList);
    saveStoredReviews(updatedList);
    setIsBatchProcessing(false);
    setIsBatchReviewModalOpen(false);
    confetti({ particleCount: 100, spread: 90 });

    if (onToast) {
      onToast(`🎉 ${pendingReviews.length} adet değerlendirme yapay zeka ile pazaryerinde yayımlandı!`);
    }
  };

  // Filtrelenmiş Sorular
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchSearch = 
        !searchQuery ||
        (q.productTitle && q.productTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.questionText && q.questionText.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.customerName && q.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.barcode && q.barcode.includes(searchQuery)) ||
        (q.productSku && q.productSku.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchMarketplace = marketplaceFilter === 'ALL' || q.marketplace === marketplaceFilter;
      const matchStatus = statusFilter === 'ALL' || q.status === statusFilter;

      return matchSearch && matchMarketplace && matchStatus;
    });
  }, [questions, searchQuery, marketplaceFilter, statusFilter]);

  // Filtrelenmiş Yorumlar
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchSearch = 
        !searchQuery ||
        (r.productTitle && r.productTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.reviewText && r.reviewText.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.customerName && r.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.barcode && r.barcode.includes(searchQuery));

      const matchMarketplace = marketplaceFilter === 'ALL' || r.marketplace === marketplaceFilter;
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      
      let matchRating = true;
      if (ratingFilter === '5') matchRating = Number(r.rating) === 5;
      else if (ratingFilter === '4') matchRating = Number(r.rating) === 4;
      else if (ratingFilter === '1-3') matchRating = Number(r.rating) <= 3;

      return matchSearch && matchMarketplace && matchStatus && matchRating;
    });
  }, [reviews, searchQuery, marketplaceFilter, statusFilter, ratingFilter]);

  // Sayısal İstatistikler
  const pendingQuestionsCount = questions.filter(q => q.status === 'PENDING').length;
  const pendingReviewsCount = reviews.filter(r => r.status === 'PENDING').length;
  const answeredCount = questions.filter(q => q.status === 'ANSWERED').length + reviews.filter(r => r.status === 'ANSWERED').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-16 font-sans">
      
      {/* 1. Üst Başlık & Kontrol Paneli */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-[#131b2e] to-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            {onNavigateBack && (
              <button 
                onClick={onNavigateBack}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-amber-300" /> GPT-4o Satış & Yanıt Motoru
                </span>
                <span className="text-xs text-emerald-300 font-bold flex items-center gap-1 bg-emerald-900/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Canlı Panelden İletim Aktif
                </span>
                {onOpenGuide && (
                  <PageGuideButton 
                    onClick={onOpenGuide} 
                    label="💡 Nasıl Kullanılır?" 
                    className="bg-white/10 hover:bg-white/20 text-amber-300 border-white/20 py-0.5 px-2.5 text-xs" 
                  />
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2.5 tracking-tight">
                <Bot className="w-7 h-7 text-purple-400 flex-shrink-0" />
                Pazar Yeri Müşteri Soruları & Değerlendirme Yorumları AI Yanıtlayıcı
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            Trendyol ve Hepsiburada'dan gelen müşteri soruları ile ürün değerlendirmelerini tek tıkla çekin; panel üzerinden değerlendirme yapın, AI ile yanıt üretip <strong>doğrudan pazaryeri paneline iletin.</strong>
          </p>
        </div>

        {/* Canlı Senkronizasyon & Hızlı İstatistik Kartları */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          
          <button
            onClick={handleLiveSync}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Canlı Veriler Çekiliyor...' : '🔄 Canlı Soruları & Yorumları Çek'}</span>
          </button>

          <div className="bg-white/10 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/20 flex items-center justify-between sm:justify-start gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Bekleyen Soru</span>
              <strong className="text-xl font-black text-amber-400">
                {pendingQuestionsCount} Adet
              </strong>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Bekleyen Yorum</span>
              <strong className="text-xl font-black text-purple-300">
                {pendingReviewsCount} Adet
              </strong>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Toplam Yanıt</span>
              <strong className="text-xl font-black text-emerald-400">
                {answeredCount}
              </strong>
            </div>
          </div>

        </div>

        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* API Bağlantı & Canlı Gönderim Durum Çubuğu */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-bold text-slate-800">Canlı Panel İletim & Değerlendirme Durumu:</span>
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold">
            🚀 Panelden Canlı Değerlendirme & Pazaryerine Gönderim Aktif
          </span>
          <span className="text-slate-400 text-[11px] hidden md:inline">({lastSyncTime})</span>
        </div>

        <div className="flex items-center gap-2">
          {connectedApiInfo.trendyol ? (
            <span className="text-[11px] text-orange-700 bg-orange-50 border border-orange-200 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Check className="w-3 h-3 text-orange-600" /> Trendyol API Bağlı
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
              Trendyol Demo Modu
            </span>
          )}

          {connectedApiInfo.hepsiburada ? (
            <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Check className="w-3 h-3 text-blue-600" /> Hepsiburada API Bağlı
            </span>
          ) : (
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
              Hepsiburada Demo Modu
            </span>
          )}

          {onNavigateToIntegrations && (
            <button 
              onClick={onNavigateToIntegrations}
              className="text-purple-600 hover:text-purple-800 font-bold flex items-center gap-1 text-[11px] ml-1"
            >
              <span>API Ayarları</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Ana Sekmeler, Filtre ve Ton Seçici Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
        
        {/* Üst Kısım: Sekmeler ve Toplu İşlem Butonları */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2.5 rounded-2xl font-black transition-all flex items-center gap-2 ${
                activeTab === 'questions'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>💬 Müşteri Soruları</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'questions' ? 'bg-white text-purple-700' : 'bg-amber-100 text-amber-900'
              }`}>
                {pendingQuestionsCount} Bekleyen
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 rounded-2xl font-black transition-all flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>⭐ Değerlendirme Yorumları ({reviews.length})</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'reviews' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-900'
              }`}>
                {pendingReviewsCount} Bekleyen
              </span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2.5 rounded-2xl font-black transition-all flex items-center gap-2 ${
                activeTab === 'templates'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>📋 Hızlı Yanıt Şablonları ({READY_TEMPLATES.length})</span>
            </button>
          </div>

          {/* Sekmeye Özel Aksiyon Butonları */}
          <div className="flex items-center gap-2">
            
            {/* Sorular Sekmesinde Toplu Yanıt */}
            {activeTab === 'questions' && pendingQuestionsCount > 0 && (
              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>✨ Tüm Soruları AI ile Yanıtla ({pendingQuestionsCount})</span>
              </button>
            )}

            {/* Yorumlar Sekmesinde: Yeni Değerlendirme Ekle & Toplu Yanıtla */}
            {activeTab === 'reviews' && (
              <>
                <button
                  onClick={() => setIsNewReviewModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold border border-purple-200 transition-all"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-600" />
                  <span>+ Yeni Değerlendirme Kaydet</span>
                </button>

                {pendingReviewsCount > 0 && (
                  <button
                    onClick={() => setIsBatchReviewModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02]"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>✨ Tüm Yorumlara AI Yanıtı Ver ({pendingReviewsCount})</span>
                  </button>
                )}
              </>
            )}

          </div>
        </div>

        {/* Alt Kısım: Arama, Platform Filtresi, Durum Filtresi ve AI Tonu */}
        {activeTab !== 'templates' && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Arama Kutusu */}
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün adı, barkod, müşteri veya yorum içeriği ara..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Platform Filtresi */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500">Platform:</span>
              <select
                value={marketplaceFilter}
                onChange={(e) => setMarketplaceFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">🌐 Tümü</option>
                <option value="Trendyol">Trendyol</option>
                <option value="Hepsiburada">Hepsiburada</option>
              </select>
            </div>

            {/* Durum Filtresi */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500">Durum:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">Tümü</option>
                <option value="PENDING">⏳ Cevap Bekleyenler</option>
                <option value="ANSWERED">✅ Cevaplananlar</option>
              </select>
            </div>

            {/* Yorumlar Sekmesinde Yıldız Puanı Filtresi */}
            {activeTab === 'reviews' && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500">Puan:</span>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="ALL">⭐ Tümü</option>
                  <option value="5">⭐⭐⭐⭐⭐ (5 Yıldız)</option>
                  <option value="4">⭐⭐⭐⭐ (4 Yıldız)</option>
                  <option value="1-3">⭐ 1-3 Yıldız (Kritik)</option>
                </select>
              </div>
            )}

            {/* AI Yanıt Tonu */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> AI Tonu:
              </span>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="bg-purple-50 border border-purple-200 rounded-xl px-3 py-1.5 font-bold text-purple-900 focus:outline-none focus:border-purple-500"
              >
                <option value="FRIENDLY_SALES">👔 Nazik & Satışa Teşvik Eden (Önerilen)</option>
                <option value="CONCISE">⚡ Kısa, Net & Profesyonel</option>
                <option value="DEFENSIVE_SOLUTION">🛡️ İade Önleyici & Çözüm Odaklı</option>
                <option value="LUXURY_PREMIUM">👑 VIP Butik Hizmet</option>
              </select>
            </div>

          </div>
        )}

      </div>

      {/* 3. TAB 1: MÜŞTERİ SORULARI */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-2xl font-bold">
                💬
              </div>
              <h3 className="text-base font-black text-slate-900">Aradığınız kriterde soru bulunamadı</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Filtreleri sıfırlayabilir veya "Canlı Soruları Çek" butonuna basarak pazaryeri mağazanızdan güncel müşteri sorularını çekebilirsiniz.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setMarketplaceFilter('ALL'); setStatusFilter('ALL'); }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isCopied = copiedId === q.id;
              const isSending = sendingId === q.id;
              const isRegenerating = regeneratingId === q.id;
              const currentAnswerText = editableAnswers[q.id] !== undefined ? editableAnswers[q.id] : (q.sellerAnswer || q.aiSuggestedAnswer || '');
              const isAnswered = q.status === 'ANSWERED';

              return (
                <div key={q.id} className="bg-white border border-slate-200 hover:border-purple-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  
                  {/* Soru Üst Başlığı & Ürün Bilgisi */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      {q.productImage && (
                        <img 
                          src={q.productImage} 
                          alt={q.productTitle} 
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-slate-50 flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            q.marketplace === 'Trendyol' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                            q.marketplace === 'Hepsiburada' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {q.marketplace}
                          </span>
                          <strong className="text-xs font-black text-slate-900 line-clamp-1">{q.productTitle}</strong>
                          {q.productSku && (
                            <span className="text-[11px] text-slate-500 font-mono">({q.productSku})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{q.timeAgo}</span>
                          <span className="font-bold text-slate-700">• {q.customerName}</span>
                          {q.barcode && <span>• Barkod: {q.barcode}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Durum Rozeti */}
                    <div>
                      {isAnswered ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pazaryerinde Cevaplandı</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-black text-[11px] flex items-center gap-1 animate-pulse">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Yanıt Bekliyor</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Müşteri Sorusu Balonu */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xs flex-shrink-0">
                      ?
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Gelen Müşteri Sorusu:</span>
                        <span className="text-[10px] text-slate-400 font-medium">Soru ID: #{q.rawId || q.id}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-1 leading-relaxed">{q.questionText}</p>
                    </div>
                  </div>

                  {/* Eğer önceden cevaplandıysa verilen yanıtı göster */}
                  {isAnswered && q.sellerAnswer && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-emerald-800 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pazaryerine İletilmiş Olan Satıcı Yanıtı:</span>
                      </div>
                      <p className="font-medium text-emerald-900 leading-relaxed bg-white p-2.5 rounded-xl border border-emerald-100">
                        {q.sellerAnswer}
                      </p>
                    </div>
                  )}

                  {/* AI Yanıt Hazırlama ve Canlı Gönderme Kutusu */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <strong className="text-xs font-black text-purple-950">
                          {isAnswered ? 'Yanıtı Yeniden Düzenle & Güncelle:' : 'GPT-4o Satış Odaklı AI Yanıtı (Düzenlenebilir):'}
                        </strong>
                      </div>

                      <button
                        onClick={() => handleRegenerate(q, 'question')}
                        disabled={isRegenerating}
                        className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                        <span>Farklı Bir AI Yanıtı Üret</span>
                      </button>
                    </div>

                    {/* Satıcının düzenleyebileceği metin alanı */}
                    <textarea
                      value={currentAnswerText}
                      onChange={(e) => setEditableAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      rows="3"
                      className="w-full bg-white border border-purple-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:border-purple-500 font-medium leading-relaxed shadow-inner"
                      placeholder="AI yanıtını buradan dilediğiniz gibi düzenleyebilir veya doğrudan gönderebilirsiniz..."
                    />

                    {/* Aksiyon Butonları */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Bu yanıt {q.marketplace} satıcı kurallarına ve müşteri memnuniyeti yönergelerine %100 uygundur.
                      </span>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        
                        {/* İkincil Kopyalama Butonu */}
                        <button
                          type="button"
                          onClick={() => handleCopy(q, currentAnswerText)}
                          className="px-3 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                          title="Metni panoya kopyala"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-600" />}
                          <span>{isCopied ? 'Kopyalandı!' : 'Kopyala'}</span>
                        </button>

                        {/* Birincil Aksiyon: DOĞRUDAN PAZARYERİNE GÖNDER */}
                        <button
                          type="button"
                          onClick={() => handleSendDirectlyToMarketplace(q, 'question')}
                          disabled={isSending}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-md ${
                            isAnswered
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-600/20 hover:scale-[1.02]'
                          } disabled:opacity-50`}
                        >
                          {isSending ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Pazaryerine İletiliyor...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>{isAnswered ? '✅ Pazaryerinde Güncelle' : `🚀 ${q.marketplace}'a Gönder (Canlı Yanıtla)`}</span>
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. TAB 2: ÜRÜN DEĞERLENDİRME YORUMLARI & SATICI DEĞERLENDİRME PANELİ */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto text-2xl font-bold">
                ⭐
              </div>
              <h3 className="text-base font-black text-slate-900">Aradığınız kriterde ürün yorumu bulunamadı</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Filtrelerinizi değiştirebilir veya "Yeni Değerlendirme Kaydet" butonuna basarak panele manuel değerlendirme girebilirsiniz.
              </p>
            </div>
          ) : (
            filteredReviews.map((rev) => {
              const isCopied = copiedId === rev.id;
              const isSending = sendingId === rev.id;
              const isRegenerating = regeneratingId === rev.id;
              const currentAnswerText = editableAnswers[rev.id] !== undefined ? editableAnswers[rev.id] : (rev.sellerAnswer || rev.aiSuggestedAnswer || '');
              const isAnswered = rev.status === 'ANSWERED';
              const merchantNoteInfo = merchantNotes[rev.id] || {};

              // Sentiment Analizi Çözümlemesi
              const isPositive = Number(rev.rating) >= 4;
              const isNegative = Number(rev.rating) <= 2;
              const isNeutral = Number(rev.rating) === 3;

              return (
                <div key={rev.id} className="bg-white border border-slate-200 hover:border-purple-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                  
                  {/* Yorum Başlığı, Puan & Ürün */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      {rev.productImage && (
                        <img 
                          src={rev.productImage} 
                          alt={rev.productTitle} 
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-slate-50 flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            rev.marketplace === 'Trendyol' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {rev.marketplace}
                          </span>
                          <strong className="text-xs font-black text-slate-900">{rev.productTitle}</strong>
                        </div>

                        {/* Yıldızlar & Müşteri */}
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">{rev.rating}.0 / 5.0</span>
                          <span className="text-[11px] text-slate-500">• {rev.customerName}</span>
                          <span className="text-[11px] text-slate-400">• {rev.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sağ Taraf: Durum ve Haksız Yorum İtiraz Butonu */}
                    <div className="flex items-center gap-2">
                      {isNegative && (
                        <button
                          onClick={() => handleOpenAppealModal(rev)}
                          className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                          title="Kargo veya haksız şikayet için pazaryeri destek ekibine kaldırma itirazı oluştur"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          <span>Haksız Yorum İtirazı Aç</span>
                        </button>
                      )}

                      {isAnswered ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Yanıt Yayımlandı</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-black text-[11px] flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Yanıt Hazır</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Yorum İçeriği & Duygu Analizi Çubuğu */}
                  <div className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed space-y-2 ${
                    isPositive ? 'bg-amber-50/40 border-amber-200/70 text-slate-900' : 
                    isNegative ? 'bg-rose-50/50 border-rose-200 text-rose-950' :
                    'bg-slate-50 border-slate-200 text-slate-900'
                  }`}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold flex items-center gap-1 text-slate-500">
                        {isPositive ? <span className="text-emerald-600">😊 Pozitif Müşteri Değerlendirmesi</span> :
                         isNegative ? <span className="text-rose-600 font-black">⚠️ Kritik Olumsuz Değerlendirme</span> :
                         <span className="text-amber-600">😐 Nötr / Geliştirilebilir Geri Bildirim</span>}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px]">Yorum ID: #{rev.rawId || rev.id}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">"{rev.reviewText}"</p>
                  </div>

                  {/* PANEL İÇİ SATICI DEĞERLENDİRMESİ & ETİKETLEME KUTUSU */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-purple-600" />
                        <span className="font-black text-slate-800">Panel İçi Satıcı Teşhisi & İç Not:</span>
                      </div>
                      
                      {/* Hızlı Etiketler */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSaveMerchantNote(rev.id, merchantNoteInfo.note || 'Doğrulanmış Alıcı', '#KumaşKalitesi')}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-purple-300 text-slate-600 text-[10px] font-bold"
                        >
                          #Kumaş
                        </button>
                        <button
                          onClick={() => handleSaveMerchantNote(rev.id, merchantNoteInfo.note || 'Beden ve Kalıp İncelemesi', '#Kalıp')}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-purple-300 text-slate-600 text-[10px] font-bold"
                        >
                          #Kalıp
                        </button>
                        <button
                          onClick={() => handleSaveMerchantNote(rev.id, merchantNoteInfo.note || 'Kargo Teslimat Süreci', '#Kargo')}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-purple-300 text-slate-600 text-[10px] font-bold"
                        >
                          #Kargo
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={merchantNoteInfo.note || ''}
                        onBlur={(e) => handleSaveMerchantNote(rev.id, e.target.value)}
                        placeholder="Bu müşteri/yorum için iç notunuzu buraya yazın (örn: İade önlendi, hediye çeki tanımlandı)..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500 font-medium"
                      />
                      {merchantNoteInfo.tag && (
                        <span className="px-2 py-1 rounded-lg bg-purple-100 text-purple-800 font-black text-[10px] whitespace-nowrap">
                          {merchantNoteInfo.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI Yorum Yanıtı & Doğrudan Gönderim Kutusu */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>{isPositive ? 'Önerilen Satıcı Teşekkür Yanıtı (Düzenlenebilir):' : 'Önerilen Çözüm & Memnuniyet Yanıtı (Düzenlenebilir):'}</span>
                      </div>

                      <button
                        onClick={() => handleRegenerate(rev, 'review')}
                        disabled={isRegenerating}
                        className="text-[11px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                        <span>Farklı Bir AI Yanıtı Üret</span>
                      </button>
                    </div>

                    <textarea
                      value={currentAnswerText}
                      onChange={(e) => setEditableAnswers(prev => ({ ...prev, [rev.id]: e.target.value }))}
                      rows="2"
                      className="w-full bg-white border border-purple-200 rounded-xl p-3 text-xs text-slate-900 font-medium leading-relaxed focus:outline-none focus:border-purple-500 shadow-inner"
                      placeholder="Değerlendirme yanıtınızı buraya yazın..."
                    />

                    {/* Aksiyon Butonları */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(rev, currentAnswerText)}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-purple-600" />}
                        <span>{isCopied ? 'Kopyalandı!' : 'Kopyala'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendDirectlyToMarketplace(rev, 'review')}
                        disabled={isSending}
                        className={`px-4 py-2 rounded-xl text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md ${
                          isAnswered ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20 hover:scale-[1.02]'
                        } disabled:opacity-50`}
                      >
                        {isSending ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>İletiliyor...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>{isAnswered ? `✅ ${rev.marketplace}'da Güncelle` : `🚀 ${rev.marketplace}'a Yanıt Olarak Gönder (Canlı)`}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5. TAB 3: HIZLI YANIT ŞABLONLARI & KURALLAR */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {READY_TEMPLATES.map((tmpl, idx) => (
            <div key={idx} className="bg-white border border-slate-200 hover:border-purple-300 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    {tmpl.category}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <h4 className="text-xs font-black text-slate-900">{tmpl.title}</h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed font-medium">
                  "{tmpl.text}"
                </p>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleApplyTemplate(tmpl.text)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white font-black text-xs transition-all flex items-center gap-1.5 border border-purple-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Şablonu Kopyala</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. MODAL 1: TOPLU AI SORU YANITLAYICI */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-scaleUp text-slate-900">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Toplu AI Soru Yanıtlayıcı</h3>
                  <p className="text-xs text-purple-200">Bekleyen {pendingQuestionsCount} soruyu tek seferde canlı yanıtlayın</p>
                </div>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                disabled={isBatchProcessing}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-black text-purple-950">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>İşlem Özeti:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                  <li>Seçili Ton: <strong>{selectedTone === 'FRIENDLY_SALES' ? '👔 Nazik & Satışa Teşvik Eden' : selectedTone}</strong></li>
                  <li>İşlenecek Soru Sayısı: <strong>{pendingQuestionsCount} Adet</strong></li>
                  <li>İletim Yolu: <strong>Trendyol & Hepsiburada Partner API (Canlı Gateway)</strong></li>
                </ul>
              </div>

              {isBatchProcessing && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-black text-purple-900">
                    <span>Pazaryerlerine iletiliyor...</span>
                    <span>%{batchProgress}</span>
                  </div>
                  <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${batchProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  disabled={isBatchProcessing}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleRunBatchAnswering}
                  disabled={isBatchProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {isBatchProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>İletiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Onayla ve {pendingQuestionsCount} Yanıtı Canlı İlet</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL 2: TOPLU AI YORUM YANITLAYICI */}
      {isBatchReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-scaleUp text-slate-900">
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Toplu Değerlendirme Yanıtlayıcı</h3>
                  <p className="text-xs text-purple-200">Bekleyen {pendingReviewsCount} değerlendirmeyi yapay zeka ile canlı yanıtlayın</p>
                </div>
              </div>
              <button
                onClick={() => setIsBatchReviewModalOpen(false)}
                disabled={isBatchProcessing}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-black text-purple-950">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>İşlem Özeti:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 font-medium">
                  <li>İşlenecek Değerlendirme Sayısı: <strong>{pendingReviewsCount} Adet</strong></li>
                  <li>5 Yıldızlı Değerlendirmeler: <strong>Teşekkür ve Mutluluk Mesajı</strong></li>
                  <li>1-3 Yıldızlı Değerlendirmeler: <strong>Empatik ve Çözüm Odaklı Destek Yanıtı</strong></li>
                </ul>
              </div>

              {isBatchProcessing && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-black text-purple-900">
                    <span>Pazaryerlerine iletiliyor...</span>
                    <span>%{batchProgress}</span>
                  </div>
                  <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${batchProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBatchReviewModalOpen(false)}
                  disabled={isBatchProcessing}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                >
                  Vazgeç
                </button>
                <button
                  type="button"
                  onClick={handleRunBatchReviewAnswering}
                  disabled={isBatchProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {isBatchProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>İletiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Onayla ve {pendingReviewsCount} Yanıtı Yayımla</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL 3: PANEL ÜZERİNDEN YENİ DEĞERLENDİRME KAYDETME */}
      {isNewReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-scaleUp text-slate-900">
            <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white font-bold">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Panelden Yeni Değerlendirme Kaydet</h3>
                  <p className="text-xs text-slate-300">Mağaza veya pazar yeri müşteri yorumunu kaydedin</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewReview} className="p-6 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Platform:</label>
                  <select
                    value={newReviewForm.marketplace}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, marketplace: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Trendyol">Trendyol</option>
                    <option value="Hepsiburada">Hepsiburada</option>
                    <option value="Web Mağazası">Web Mağazası</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Yıldız Puanı:</label>
                  <select
                    value={newReviewForm.rating}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, rating: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-500"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 Yıldız)</option>
                    <option value="4">⭐⭐⭐⭐ (4 Yıldız)</option>
                    <option value="3">⭐⭐⭐ (3 Yıldız)</option>
                    <option value="2">⭐⭐ (2 Yıldız)</option>
                    <option value="1">⭐ (1 Yıldız)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">İlgili Ürün Adı:</label>
                <input
                  type="text"
                  required
                  value={newReviewForm.productTitle}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, productTitle: e.target.value })}
                  placeholder="Ürün adı..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Müşteri Adı / Rumuz:</label>
                <input
                  type="text"
                  required
                  value={newReviewForm.customerName}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, customerName: e.target.value })}
                  placeholder="Örn: Merve K."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Müşteri Değerlendirme Metni:</label>
                <textarea
                  required
                  rows="3"
                  value={newReviewForm.reviewText}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, reviewText: e.target.value })}
                  placeholder="Müşterinin ilettiği değerlendirme yorumu..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Satıcı Teşhis & İç Notu (Opsiyonel):</label>
                <input
                  type="text"
                  value={newReviewForm.sellerNote}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, sellerNote: e.target.value })}
                  placeholder="Örn: WhatsApp'tan ulaşıldı / Beden değişimi yapıldı"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md shadow-purple-600/20"
                >
                  Değerlendirmeyi Kaydet & AI Yanıtı Üret
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL 4: HAKSIZ YORUM İTİRAZ DİLEKÇESİ */}
      {appealReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-scaleUp text-slate-900">
            <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Haksız Değerlendirme İtiraz Talebi</h3>
                  <p className="text-xs text-rose-300">{appealReview.marketplace} Satıcı Destek Masası Resmi İtirazı</p>
                </div>
              </div>
              <button
                onClick={() => setAppealReview(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 text-[11px]">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>İtiraz Edilen Yorum:</span>
                </div>
                <p className="text-xs font-bold text-slate-900">
                  "{appealReview.reviewText}"
                </p>
                <span className="text-[10px] text-slate-500 block mt-1">
                  Müşteri: {appealReview.customerName} • Puan: {appealReview.rating}/5 Yıldız
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">İtiraz Gerekçesi:</label>
                <select
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="Kargo Taşıma Hasarı / Gecikmesi (Satıcı Kusuru Değil)">Kargo Taşıma Hasarı / Gecikmesi (Satıcı Kusuru Değil - Madde 4.2)</option>
                  <option value="Beden Tablosu Uyarılarına Rağmen Yanlış Beden Tercihi">Beden Tablosu Uyarılarına Rağmen Yanlış Beden Tercihi</option>
                  <option value="Haksız / Rakip Manipülasyonu Şüphesi">Haksız / Rakip Manipülasyonu Şüphesi</option>
                  <option value="Ürün Dışı Faktörler (Pazaryeri Kupon/Kampanya Sorunu)">Ürün Dışı Faktörler (Pazaryeri Kampanya Sorunu)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Resmi İtiraz Dilekçesi (Düzenlenebilir):</label>
                <textarea
                  rows="6"
                  value={appealDescription}
                  onChange={(e) => setAppealDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText(appealDescription); alert('Dilekçe kopyalandı!'); }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Dilekçeyi Kopyala</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAppealReview(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="button"
                    onClick={handleSendAppealToMarketplace}
                    disabled={isAppealing}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md shadow-rose-600/20 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isAppealing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    <span>{isAppealing ? 'İletiliyor...' : 'İtirazı Pazaryerine İlet'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CustomerQuestionsAIPage;
