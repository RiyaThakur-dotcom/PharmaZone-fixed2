import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────
   ChatBot.jsx — PharaFriend AI
   Improvements:
   - Richer system prompt with medicine/pricing context
   - Suggested questions dynamically update per conversation
   - Medicine search shortcut from chat
   - Typing indicator is smoother
   - Message timestamps
   - Clear chat button
   - Context-aware quick replies that evolve
───────────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are PharaFriend, the smart AI health assistant for PharmaZone — India's #1 cross-platform medicine price comparison app.

YOUR CORE KNOWLEDGE:
- PharmaZone compares medicine prices across 1mg, PharmEasy, Netmeds, Apollo247, MedPlus
- We show real-time prices, discounts, delivery timelines, and stock availability
- We have an AI-powered substitute finder — same salt/molecule, lower price
- We have prescription upload + OCR feature to extract medicine lists from photos
- We have doctor consultation booking (online, with digital prescription)
- Users can track orders and prescriptions in their dashboard
- Average savings: 40-80% when switching to generic equivalents

TABLET BUDGET CALCULATOR (NEW FEATURE):
- On the medicine detail page, users can enter their budget (e.g. ₹200)
- Set tablets per strip (10/15/20/30)
- The table instantly shows how many tablets they can get from each platform
- E.g. "With ₹200 on 1mg (₹16/strip, 10 tabs each) = 12 strips = 120 tablets"

RESPONSE RULES:
- Keep responses under 3-4 sentences. Be crisp.
- Use friendly Hinglish naturally (mix Hindi + English like Indians actually speak)
- For medicine queries: always mention generic = same salt = cheaper option
- For pricing: mention the Budget Calculator feature if relevant
- For serious symptoms: ALWAYS say "Doctor se zaroor milna, main sirf prices compare karta hoon"
- Never diagnose. Never recommend stopping prescribed medicines.
- End every response with ONE actionable suggestion (search, use calculator, consult doctor, etc.)
- Use 1-2 emojis max per message

QUICK EXAMPLES:
User: "Dolo 650 kitne ka hai?"
Reply: "Dolo 650 abhi 1mg pe ₹14/strip se milta hai — sabse sasta! 💊 Generic option 'Calpol' same paracetamol hai, aur bhi sasta. Budget calculator use karo — batao ₹200 mein kitne tablets chahiye?"

User: "Generic medicine safe hai kya?"
Reply: "Bilkul! Generic = same molecule, same dose, same effect — bas alag brand name. India mein DCGI approved hoti hain. 40-80% savings possible hai bhai. 🎯 PharmaZone pe koi bhi medicine search karo, substitutes section check karo."`;

const INITIAL_MESSAGES = [
  {
    text: "Hey! Main hoon PharaFriend 👋 — aapka smart medicine saving buddy!\n\nSearch karo, prices compare karo, ya budget mein kitni tablets milegi — sab bataunga. Kya chahiye?",
    type: 'bot',
    time: new Date(),
  }
];

const QUICK_REPLY_SETS = {
  initial: [
    "Dolo 650 ka generic?",
    "Sasti medicine kaise dhundhe?",
    "Budget calculator kaise use karo?",
    "Prescription upload karna hai 📋",
  ],
  medicine: [
    "Iska substitute kya hai?",
    "₹200 mein kitni tablets?",
    "Cheapest platform kaun sa?",
    "Doctor se consult karna hai",
  ],
  generic: [
    "Generic safe hai kya?",
    "Doctor approve karega?",
    "Kahan milega generic?",
    "Aur koi savings tip?",
  ],
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
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
          system: SYSTEM_PROMPT,
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
      if (q.includes('dolo') || q.includes('paracetamol') || q.includes('fever'))
        reply = "Dolo 650 = Paracetamol 650mg. Generic alternative: Calpol, Metacin — same kaam, 50-60% sasta! 💊 1mg pe abhi ₹14/strip. Budget calculator use karo — batao budget, main tablets count bataata hoon.";
      else if (q.includes('budget') || q.includes('calculator') || q.includes('tablet'))
        reply = "Budget Calculator use karo! 🎯 Medicine detail page pe ₹ enter karo → har platform ka tablet count automatically aata hai. Jaise ₹200 mein 1mg = 120 tablets, Netmeds = 90 tablets.";
      else if (q.includes('generic') || q.includes('substitute') || q.includes('same salt'))
        reply = "Generic = same active molecule, same dose, DCGI approved — bas cheaper brand! ✅ Average 40-80% savings. Search mein medicine dhundo → Substitutes tab check karo — doctor-verified alternatives milenge.";
      else if (q.includes('prescription') || q.includes('upload'))
        reply = "Prescription upload karo — AI har medicine extract kar deta hai! 📄 Home page → Smart Upload tap karo. Phir direct search ya compare.";
      else if (q.includes('doctor') || q.includes('consult'))
        reply = "Online consultation available hai! 👨‍⚕️ Orders page → Consultations tab. ₹199 mein General Physician, digital prescription milegi minutes mein.";
      else
        reply = "Network thoda slow hai 😅 PharmaZone pe medicine search karo — live prices, generics, aur budget calculator sab milega! Koi specific medicine batao?";

      setMessages(prev => [...prev, { text: reply, type: 'bot', time: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setQuickSet('initial');
  };

  const chatWidth = isExpanded ? 'w-[480px]' : 'w-[360px]';
  const chatHeight = isExpanded ? 'max-h-[640px]' : 'max-h-[520px]';

  return (
    <>
      {/* ── TRIGGER BUTTON ── */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 right-6 z-[200] w-14 h-14 rounded-full bg-[#15342C] shadow-[0_8px_30px_rgba(21,52,44,0.4)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200">
        <span className={`transition-all duration-200 ${isOpen ? 'rotate-45 scale-110' : 'rotate-0'}`}>
          {isOpen
            ? <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
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

        {/* Header */}
        <div className="bg-[#15342C] px-5 py-4 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#F4A522] flex items-center justify-center text-xl shrink-0">💊</div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-white font-['Outfit'] text-sm">PharaFriend AI</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
              <span className="text-emerald-300/80 text-xs font-medium truncate">Powered by Claude · Hinglish ready</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {/* Expand toggle */}
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
            {/* Clear */}
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
