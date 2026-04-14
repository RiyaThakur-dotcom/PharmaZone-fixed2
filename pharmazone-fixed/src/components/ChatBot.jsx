import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────
   ChatBot.jsx — PharaFriend AI
───────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are PharaFriend, the ultra-smart AI health assistant for PharmaZone.

CORE CAPABILITIES:
- Compare medicine prices across 1mg, PharmEasy, Netmeds, Apollo247, and MedPlus.
- Find 100% molecularly identical substitutes (Generics) that save 40-80%.
- Explain salt compositions and safety advice.
- Handle multi-language chat (Hindi, English, Hinglish).

CONVERSATIONAL RULES:
1. GREETINGS: Always respond warmly to 'Hi', 'Hello', 'Kaise ho?', etc.
2. INTERACTIVE: Start with a greeting and ask how you can help.
3. MEDICINE INFO: Provide details for any medicine name given.
4. ACTIONABLE: Suggest a next step (search, compare, or generic).
`;

const INITIAL_MESSAGES = [
  {
    text: "Namaste! 👋 I'm PharaFriend, your AI health assistant. \n\nHello, how are you? Main aapki medicines dhoondhne aur paise bachane mein madad kar sakta hoon. How can I assist you today?",
    type: 'bot',
    time: new Date(),
  }
];

const QUICK_REPLY_SETS = {
  initial: [
    "Hi! Kaise ho?",
    "Dolo 650 ka generic?",
    "Sasti medicine kaise milegi?",
    "Prescription upload 📋",
  ],
  medicine: [
    "Iska substitute dikhao",
    "₹200 mein kitne tablets?",
    "Sabse sasta platform?",
    "Doctor se baat karni hai",
  ],
  generic: [
    "Generic safe hai kya?",
    "Doctor approve karega?",
    "Kahan se sasta milega?",
    "Savings tips?"
  ],
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const ChatBot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickSet, setQuickSet] = useState('initial');
  const [unread, setUnread] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (msgText) => {
    const text = (msgText || input).trim();
    if (!text || isLoading) return;
    setInput('');

    const userMsg = { text, type: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Update quick reply context
    const lower = text.toLowerCase();
    if (lower.includes('generic') || lower.includes('substitute') || lower.includes('salt'))
      setQuickSet('generic');
    else if (lower.includes('tablet') || lower.includes('price') || lower.includes('₹') || lower.includes('budget'))
      setQuickSet('medicine');
    else
      setQuickSet('medicine');

    try {
      const history = messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      history.push({ role: 'user', content: text });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          system: `${SYSTEM_PROMPT}\nUSER PREFERRED LANGUAGE: ${language === 'hi' ? 'Hindi/Hinglish' : 'English'}`,
          messages: history,
        }),
      });

      const data = await response.json();
      const botReply = data.content?.[0]?.text || "Thoda network issue hai 😅 Dubara try karo!";
      setMessages(prev => [...prev, { text: botReply, type: 'bot', time: new Date() }]);
      if (!isOpen) setUnread(u => u + 1);

    } catch {
      // Smart offline fallback
      const q = lower;
      let reply;
      if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste'))
        reply = "Hello! 👋 Kaise hain aap? I'm PharaFriend, your medicine saving buddy. Generic medicines search karke 80% tak paise bachayein. How can I help you today?";
      else if (q.includes('how are you') || q.includes('kaise ho') || q.includes('kya hal'))
        reply = "Main bilkul theek hoon, thank you! 😊 Aap bataiye, aaj PharmaZone pe sasti medicine dhoondhne mein main aapki kya madad kar sakta hoon?";
      else if (q.includes('dolo') || q.includes('paracetamol') || q.includes('fever'))
        return setMessages(prev => [...prev, { 
          text: "Dolo 650 = Paracetamol 650mg. Sabse sasta deal 1mg pe hai.", 
          type: 'bot', 
          time: new Date(),
          card: { 
            name: 'Dolo 650mg (15 Tab)', 
            salt: 'Paracetamol 650mg',
            prices: [
              { store: '1mg', price: '₹14.20', status: 'cheapest' },
              { store: 'PhEasy', price: '₹18.50' },
              { store: 'Apollo', price: '₹22.00' }
            ]
          },
          action: { label: '💊 Show Substitutes', link: '/search?q=Paracetamol' }
        }]);
      else if (q.includes('budget') || q.includes('calculator') || q.includes('tablet'))
        return setMessages(prev => [...prev, { 
          text: "Budget Calculator se aap jaan sakte hain ki apne budget mein kitni tablets milengi.", 
          type: 'bot', 
          time: new Date(),
          action: { label: '⚖️ Open Calculator', link: '/search' }
        }]);
      else if (q.includes('generic') || q.includes('substitute') || q.includes('same salt'))
        return setMessages(prev => [...prev, { 
          text: "Generic medicines branded se 80% tak sasti hoti hain aur medical performance same hoti hai.", 
          type: 'bot', 
          time: new Date(),
          action: { label: '💊 Search Generics', link: '/search' }
        }]);
      else if (q.includes('prescription') || q.includes('upload'))
        return setMessages(prev => [...prev, { 
          text: "Prescription upload karke aap turant sasti medicines list dekh sakte hain.", 
          type: 'bot', 
          time: new Date(),
          action: { label: '📤 Upload Now', link: '/?modal=upload' }
        }]);
      else if (q.includes('doctor') || q.includes('consult'))
        return setMessages(prev => [...prev, { 
          text: "Aap hamare licensed doctors se online consult kar sakte hain ₹199 mein.", 
          type: 'bot', 
          time: new Date(),
          action: { label: '👨‍⚕️ Book Consult', link: '/consult' }
        }]);
      else
        reply = "Main samjha nahi, par main PharmaZone pe medicine search, price compare aur saste alternatives dhoondhne mein help kar sakta hoon. 🤖 Koi medicine ka naam bataiye?";

      setMessages(prev => [...prev, { text: reply, type: 'bot', time: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    // We send a new array reference to ensure React detects the change and re-renders
    setMessages([...INITIAL_MESSAGES]);
    setQuickSet('initial');
  };

  const chatWidth = isExpanded ? 'w-[480px]' : 'w-[360px]';
  const chatHeight = isExpanded ? 'max-h-[640px]' : 'max-h-[520px]';

  return (
    <>
      {/* ── TRIGGER BUTTON ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-[#15342C] shadow-[0_8px_40px_rgba(21,52,44,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group ${!isOpen ? 'animate-bounce' : ''}`}
        style={{ animationDuration: '3s' }}>
        <div className={`absolute inset-0 rounded-full bg-[#F4A522] opacity-20 scale-110 blur-md ${!isOpen ? 'animate-pulse' : 'hidden'}`} />
        <span className={`relative z-10 transition-all duration-300 ${isOpen ? 'rotate-45 scale-110' : 'rotate-0'}`}>
          {isOpen
            ? <svg className="w-6 h-6 text-[#F4A522]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            : <div className="relative">
                <span className="text-2xl">💊</span>
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F4A522] rounded-full text-[#15342C] text-[9px] font-black flex items-center justify-center">
                    {unread}
                  </span>
                )}
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping opacity-60" />
              </div>
          }
        </span>
      </button>

      {/* ── CHAT PANEL ── */}
      <div className={`fixed bottom-24 right-6 z-[199] ${chatWidth} ${chatHeight} flex flex-col bg-white rounded-[24px] shadow-[0_20px_70px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>

        {/* Toggle Language */}
        <div className="bg-[#1c4a3a] px-6 py-2 flex items-center justify-between border-b border-white/5">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#F4A522]">Assistant Language</span>
          <div className="flex gap-2">
            {['en', 'hi'].map(l => (
              <button 
                key={l}
                onClick={() => setLanguage(l)}
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded transition-colors ${language === l ? 'bg-[#F4A522] text-[#15342C]' : 'bg-white/10 text-white/40'}`}>
                {l === 'en' ? 'English' : 'हिंदी'}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="bg-[#15342C] px-5 py-5 flex items-center gap-3 shrink-0 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-[#F4A522] to-emerald-500 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
          
          <div className="w-10 h-10 rounded-full bg-[#F4A522] flex items-center justify-center text-xl shrink-0 shadow-lg shadow-[#F4A522]/20 animate-pulse">💊</div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-white font-['Outfit'] text-sm tracking-wide">PharaFriend AI</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
              <span className="text-emerald-300/80 text-xs font-medium truncate">Powered by Claude · Hinglish ready</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsExpanded(e => !e)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/60 hover:text-white"
              title={isExpanded ? 'Compact' : 'Expand'}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {isExpanded
                  ? <path d="M9 9L3 3m0 0h6M3 3v6M15 9l6-6m0 0h-6m6 0v6M9 15l-6 6m0 0h6m-6 0v-6M15 15l6 6m0 0h-6m6 0v-6" strokeLinecap="round" strokeLinejoin="round"/>
                  : <path d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                }
              </svg>
            </button>
            <button
              onClick={clearChat}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/60 hover:text-white"
              title="Clear chat">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 bg-[#f9fafb]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
              {msg.type === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-[#15342C] flex items-center justify-center text-sm shrink-0 mt-0.5">💊</div>
              )}
              <div className="max-w-[82%]">
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.type === 'user'
                    ? 'bg-[#15342C] text-white rounded-br-sm'
                    : 'bg-white text-slate-700 rounded-bl-sm shadow-sm border border-slate-100'
                }`}>
                  {msg.text}
                  {msg.card && (
                    <div className="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#F4A522]/5 rounded-full -mr-12 -mt-12 blur-xl" />
                      <div className="relative z-10">
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Live Comparison</p>
                        <h4 className="font-black text-[#15342C] text-sm mb-0.5">{msg.card.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold mb-4">{msg.card.salt}</p>
                        <div className="space-y-2">
                          {msg.card.prices.map((p, ix) => (
                            <div key={ix} className="flex justify-between items-center text-xs">
                              <span className="text-slate-500 font-medium">{p.store}</span>
                              <div className="text-right">
                                <span className={`font-black ${p.status === 'cheapest' ? 'text-emerald-600' : 'text-[#15342C]'}`}>{p.price}</span>
                                {p.status === 'cheapest' && <span className="ml-1 text-[8px] bg-emerald-500 text-white px-1 py-0.5 rounded font-black">LOWEST</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {msg.action && (
                    <button 
                      onClick={() => navigate(msg.action.link)}
                      className="mt-3 w-full bg-[#15342C] text-[#F4A522] py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#1c4a3a] transition-all shadow-md active:scale-95">
                      {msg.action.label}
                    </button>
                  )}
                </div>
                {msg.time && (
                  <div className={`text-[10px] text-slate-400 mt-1 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(msg.time)}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start gap-2">
              <div className="w-7 h-7 rounded-full bg-[#15342C] flex items-center justify-center text-sm shrink-0">💊</div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 flex gap-1.5 items-center">
                {[0, 150, 300].map(d => (
                  <span key={d} className="w-2 h-2 bg-[#F4A522] rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
                <span className="text-slate-400 text-xs ml-1">typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        <div className="px-4 py-2.5 flex gap-2 flex-wrap bg-[#f9fafb] border-t border-slate-100">
          {QUICK_REPLY_SETS[quickSet].map((q, i) => (
            <button key={i} onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-[#F4A522] hover:text-[#15342C] hover:bg-amber-50 transition-all font-medium disabled:opacity-40">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={e => { e.preventDefault(); sendMessage(); }}
          className="px-4 pb-4 pt-2 bg-white border-t border-slate-100 flex gap-2 shrink-0">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Medicine ka naam ya koi sawaal..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4A522]/30 focus:border-[#F4A522] transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-[#F4A522] rounded-xl flex items-center justify-center hover:bg-[#e09a1e] active:scale-95 transition-all disabled:opacity-40 shrink-0 shadow-sm">
            <svg className="w-4 h-4 text-[#15342C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatBot;
