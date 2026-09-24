import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ArrowRight, 
  Flame, 
  DollarSign, 
  Scale, 
  Zap 
} from 'lucide-react';
import { askAIAssistant } from '../services/aiAdvisorService';

export function AIChatModal({ isOpen, onClose, storeContext, initialPrompt = '', onNavigateTab }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Merhaba! 🤖 Ben sizin dijital e-ticaret danışmanınızım. Mağazanızın tüm canlı sipariş, kargo, komisyon ve net kâr verilerini analiz etmeye hazırım.\n\nBugün mağazanız ve operasyonunuzla ilgili neyi derinlemesine incelememizi istersiniz?`,
      time: 'Şimdi'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const newMsg = { sender: 'user', text: query, time: 'Şimdi' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = askAIAssistant(query, storeContext);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: response.text, 
          suggestedAction: response.suggestedAction,
          time: 'Şimdi' 
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  const quickQuestions = [
    "📉 Geçen haftaya göre kârım neden düştü?",
    "🏆 En çok kâr bırakan ürünüm hangisi?",
    "💰 Fiyatları 50 TL artırırsam net kârım ne olur?",
    "📦 Kargo desi itirazını nasıl yapmalıyım?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[620px] rounded-3xl bg-white border border-slate-300 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Üst Başlık */}
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#f27a1a] to-pink-600 flex items-center justify-center text-white shadow">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">izeeg AI Danışmanı</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Canlı Bağlı
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Trendyol & Hepsiburada Finans Verileriyle Eğitildi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mesaj Akışı */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs flex-shrink-0 ${
                m.sender === 'user' 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-[#f27a1a] text-white shadow'
              }`}>
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              </div>

              <div className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#151e2a] text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm space-y-2 font-medium'
              }`}>
                <div className="whitespace-pre-wrap">{m.text}</div>

                {m.suggestedAction && (
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        onClose();
                        onNavigateTab('cargo-audit');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f27a1a]/10 hover:bg-[#f27a1a]/20 text-[#f27a1a] text-[11px] font-black border border-[#f27a1a]/30 transition-all"
                    >
                      <Zap className="w-3 h-3" />
                      {m.suggestedAction} ↳
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 p-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#f27a1a] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#f27a1a] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#f27a1a] animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px]">AI finans verilerinizi inceliyor...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Hızlı Soru Çipleri */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-bold px-3 py-1 rounded-full bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 whitespace-nowrap transition-all shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Mesaj Giriş Alanı */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="İşinizle veya finansla ilgili bir soru sorun (Örn: En kârlı ürünüm hangisi?)..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-[#f27a1a] focus:bg-white"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-xl bg-[#f27a1a] hover:bg-[#d9680e] text-white shadow transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
