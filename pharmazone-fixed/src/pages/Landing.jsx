import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PriceRadar from '../components/PriceRadar';
import { jsPDF } from "jspdf";

/* ─── STATS COUNTER HOOK ─── */
const useCounter = (end, duration = 1800, start = 0) => {
  const [count, setCount] = useState(start);
  useEffect(() => {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end]);
  return count;
};

/* ─── MARQUEE DATA ─── */
const MARQUEE_ITEMS = [
  '💊 Dolo 650', '🔵 Crocin', '🟡 Azithral', '💉 Metformin',
  '🟢 Pantop 40', '🔴 Telma 40', '🟣 Allegra', '🟠 Augmentin',
  '⚪ Thyronorm', '🔵 Shelcal', '💊 Combiflam', '🟡 Glycomet',
];

const ALL_MEDICINES = [
  'Dolo 650', 'Augmentin 625 Duo', 'Allegra 120mg', 'Combiflam',
  'Pantop 40', 'Telma 40', 'Shelcal 500', 'Thyronorm', 'Glycomet GP', 'Azithral 500'
];

const SLANGS = [
  { main: "Sasti Dawai,", sub: "Asli Kamai.", accent: "text-[#F4A522]" },
  { main: "Paisa Vasool,", sub: "Swasthya Cool.", accent: "text-emerald-400" },
  { main: "Smart Switch,", sub: "Save Huge.", accent: "text-[#F4A522]" },
  { main: "Dawai Wahi,", sub: "Daam Sahi.", accent: "text-emerald-400" },
];

/* ─── TRUST LOGOS (placeholder SVGs representing real pharmacy brands) ─── */
const TrustBrands = () => (
  <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
    {['1mg', 'PharmEasy', 'Netmeds', 'Apollo247', 'MedPlus'].map((name) => (
      <div key={name} className="bg-white/10 border border-white/15 px-5 py-2.5 rounded-xl backdrop-blur-sm">
        <span className="font-['Outfit'] font-black text-sm text-white tracking-wide">{name}</span>
      </div>
    ))}
  </div>
);

/* ─── HOW IT WORKS STEPS ─── */
const HOW_STEPS = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Search Medicine',
    desc: 'Type any brand name, salt, or composition — we match it instantly across our database of 10,000+ medicines.',
    color: 'from-[#F4A522]/20 to-amber-50',
    border: 'border-[#F4A522]/30',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Compare Prices',
    desc: 'See live prices from all major platforms side-by-side. Filter by delivery speed, discount %, or nearest pharmacy.',
    color: 'from-emerald-500/15 to-emerald-50',
    border: 'border-emerald-400/30',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Find Substitutes',
    desc: 'AI suggests same-salt generics costing 40–80% less. Doctor-verified alternatives shown with confidence scores.',
    color: 'from-violet-500/15 to-violet-50',
    border: 'border-violet-400/30',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Save & Buy',
    desc: 'Order from the best-priced platform directly. Track all orders, prescriptions, and savings in your dashboard.',
    color: 'from-rose-500/15 to-rose-50',
    border: 'border-rose-400/30',
  },
];

/* ─── TESTIMONIALS ─── */
const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', save: '₹1,840', text: 'Mujhe pata hi nahi tha ki same medicine itni sasti bhi milti hai! Thyronorm generic pe switch kiya — ₹180 se ₹22 per strip.', avatar: 'PS', color: 'bg-emerald-600' },
  { name: 'Rajesh Agarwal', city: 'Jaipur', save: '₹3,200', text: 'Diabetes medicines pe poore family ka ₹3,200 mahine ka bachaa. PharmaZone ne sach mein health affordable bana diya!', avatar: 'RA', color: 'bg-[#F4A522]' },
  { name: 'Dr. Anita Menon', city: 'Bengaluru', save: '—', text: 'As a doctor, I now recommend PharmaZone to all patients. The generic suggestions are medically accurate and transparent.', avatar: 'AM', color: 'bg-violet-600' },
];

/* ─── FEATURE TILES ─── */
const FEATURES = [
  { icon: '🔍', title: 'Real-Time Prices', desc: 'Live data from 5+ platforms, updated every 6 hours.', bg: 'bg-amber-50', border: 'border-amber-200' },
  { icon: '🤖', title: 'AI Substitutes', desc: 'Same molecule, fraction of the price. Verified by doctors.', bg: 'bg-violet-50', border: 'border-violet-200' },
  { icon: '📄', title: 'Rx Scanner', desc: 'Upload your prescription — AI extracts every medicine automatically.', bg: 'bg-blue-50', border: 'border-blue-200' },
  { icon: '💬', title: 'PharaFriend AI', desc: '24/7 health chatbot. Ask anything in Hindi or English.', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { icon: '🏥', title: 'Doctor Consult', desc: 'Online consultation, digital prescription in minutes.', bg: 'bg-rose-50', border: 'border-rose-200' },
  { icon: '📦', title: 'Order Tracking', desc: 'Track all orders and prescriptions from one dashboard.', bg: 'bg-orange-50', border: 'border-orange-200' },
];

/* ─── MEDICINE MARQUEE ROW ─── */
const MedicineMarquee = () => (
  <div className="overflow-hidden py-4 select-none">
    <div className="flex gap-4 animate-marquee whitespace-nowrap">
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/80 text-xs font-bold px-4 py-2 rounded-full shrink-0">
          {item}
        </span>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════
   MAIN LANDING COMPONENT
═══════════════════════════════════════════════════ */
const Landing = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const heroRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [slangIndex, setSlangIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  const savingsCount = useCounter(2840);
  const usersCount = useCounter(50000);
  const medsCount = useCounter(10000);

  /* Slang rotator */
  useEffect(() => {
    const t = setInterval(() => setSlangIndex(p => (p + 1) % SLANGS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* Entry animation */
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredSuggestions = ALL_MEDICINES.filter(m =>
    m.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e, q = searchQuery) => {
    if (e) e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus('uploading');
    setTimeout(() => {
      setUploadStatus('done');
      setTimeout(() => { setActiveModal(null); setUploadStatus('idle'); }, 2000);
    }, 2800);
  };

  /* ── HERO ── */
  return (
    <div className="min-h-screen bg-[#fbfbfb] overflow-x-hidden selection:bg-[#F4A522]/40 selection:text-[#15342C]">

      {/* ── STYLE TAG for marquee & custom animations ── */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
        .fade-up { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) both; }
        .delay-1 { animation-delay: 0.10s }
        .delay-2 { animation-delay: 0.22s }
        .delay-3 { animation-delay: 0.34s }
        .delay-4 { animation-delay: 0.46s }
        .delay-5 { animation-delay: 0.58s }
        @keyframes slangSwap { 0%{opacity:0;transform:translateY(14px)} 12%{opacity:1;transform:translateY(0)} 88%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-10px)} }
        .slang-anim { animation: slangSwap 4s ease both; }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .float-anim { animation: floatY 5s ease-in-out infinite; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .shimmer-line { background: linear-gradient(90deg,transparent,rgba(244,165,34,0.25),transparent); background-size:200% 100%; animation:shimmer 2.5s infinite; }
      `}</style>

      <Navbar />

      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen bg-[#15342C] flex flex-col justify-center pt-20 pb-0 overflow-hidden">

        {/* Background texture blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-8%] right-[-4%] w-[700px] h-[700px] bg-[#F4A522]/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-[10%] left-[-6%] w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px]" />
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT COLUMN */}
            <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

              {/* AI Savings badge */}
              <div className="fade-up delay-1 inline-flex items-center gap-2.5 bg-[#F4A522]/10 border border-[#F4A522]/25 px-4 py-2 rounded-full mb-8">
                <span className="text-[#F4A522] text-sm">🤖</span>
                <span className="text-[#F4A522] font-black text-[10px] uppercase tracking-[0.18em] font-['Outfit']">
                  AI-Powered · 40–80% Savings Guaranteed
                </span>
              </div>

              {/* Headline with slang rotator */}
              <div className="fade-up delay-2 mb-8">
                <h1 className="text-5xl md:text-[68px] xl:text-[78px] font-black text-white font-['Outfit'] leading-[1.05] tracking-[-0.02em]">
                  <span className="block text-white/40 text-2xl md:text-3xl font-semibold tracking-normal mb-3 font-['Inter']">
                    India's Smartest Medicine Savings Hub
                  </span>
                  <span key={slangIndex} className="slang-anim block">
                    {SLANGS[slangIndex].main}
                    <br />
                    <span className={SLANGS[slangIndex].accent}>{SLANGS[slangIndex].sub}</span>
                  </span>
                </h1>
              </div>

              {/* Search bar */}
              <div className="fade-up delay-3 relative mb-10 max-w-xl" ref={dropdownRef}>
                <form onSubmit={handleSearchSubmit}
                  className="relative z-50 flex items-center bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.22)] overflow-hidden ring-2 ring-transparent focus-within:ring-[#F4A522]/60 transition-all">
                  <div className="pl-5 text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search medicine — e.g. Dolo 650, Metformin..."
                    className="w-full py-4 px-4 text-[15px] font-semibold text-[#15342C] placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                  <button type="submit"
                    className="shrink-0 bg-[#15342C] hover:bg-[#1c4a3a] text-[#F4A522] px-7 py-4 font-black uppercase text-xs tracking-widest transition-colors font-['Outfit']">
                    Search
                  </button>
                </form>

                {/* Autocomplete */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden z-[60]">
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Trending Searches</span>
                    </div>
                    {filteredSuggestions.map((med, i) => (
                      <div key={i} onClick={() => { handleSearchSubmit(null, med); setShowSuggestions(false); }}
                        className="px-5 py-3.5 hover:bg-amber-50 cursor-pointer flex items-center gap-4 group border-b border-slate-50 last:border-0 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-[#15342C]/8 flex items-center justify-center shrink-0">
                          <span className="text-base">💊</span>
                        </div>
                        <div>
                          <div className="font-bold text-[#15342C] text-sm group-hover:text-[#F4A522] transition-colors">{med}</div>
                          <div className="text-[11px] text-slate-400">Compare prices across 5 platforms</div>
                        </div>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-[#F4A522] ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Social proof strip */}
              <div className="fade-up delay-4 flex items-center gap-6 flex-wrap">
                <div className="flex -space-x-2.5">
                  {['bg-emerald-500','bg-violet-500','bg-rose-500','bg-amber-500','bg-blue-500'].map((c,i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-[#15342C] flex items-center justify-center text-white text-[10px] font-black`}>
                      {['P','R','S','A','M'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#F4A522] mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-white/70 text-xs font-medium">
                    <span className="text-white font-bold">50,000+</span> families saving monthly
                  </p>
                </div>
                <div className="h-8 w-px bg-white/15 hidden sm:block" />
                <div className="text-white/70 text-xs">
                  Avg. savings: <span className="text-[#F4A522] font-black text-sm">₹2,840/mo</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — Visual card stack */}
            <div className="hidden lg:block relative fade-up delay-3">
              <div className="relative w-full aspect-square max-w-[480px] mx-auto">

                {/* Background blob */}
                <div className="absolute inset-0 bg-emerald-500/8 rounded-[3rem] blur-3xl scale-110" />

                {/* Main medicine image */}
                <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)] float-anim">
                  <img
                    src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&q=85&w=900"
                    alt="Medicine comparison"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15342C]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Currently Comparing</div>
                    <div className="font-['Outfit'] font-black text-white text-lg">Dolo 650mg · ₹14 best price</div>
                  </div>
                </div>

                {/* Floating price card */}
                <div className="absolute -right-6 top-12 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] p-4 z-20 w-[160px]">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Best Deal</div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-['Outfit'] font-black text-2xl text-[#15342C]">₹14</span>
                    <span className="text-slate-400 text-xs line-through">₹32</span>
                  </div>
                  <div className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg inline-block">56% OFF · 1mg</div>
                  <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full w-[56%] bg-gradient-to-r from-[#F4A522] to-emerald-500 rounded-full shimmer-line" />
                  </div>
                </div>

                {/* Floating savings badge */}
                <div className="absolute -left-4 bottom-16 bg-[#F4A522] rounded-2xl shadow-[0_8px_30px_rgba(244,165,34,0.4)] p-4 z-20">
                  <div className="font-['Outfit'] font-black text-[#15342C] text-xl leading-none">₹1,840</div>
                  <div className="text-[#15342C]/70 text-[10px] font-bold mt-0.5">Saved this month</div>
                </div>

                {/* Floating AI pill */}
                <div className="absolute right-4 bottom-6 bg-violet-600 rounded-full shadow-lg px-4 py-2 z-20 flex items-center gap-2">
                  <span className="w-2 h-2 bg-violet-300 rounded-full animate-pulse" />
                  <span className="text-white text-xs font-bold">AI Substitute Found</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by strip */}
        <div className="relative z-10 mt-16 border-t border-white/8 pt-8 pb-6">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-white/35 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Trusted Partner Platforms</p>
            <TrustBrands />
          </div>
        </div>

        {/* Medicine marquee */}
        <div className="relative z-10 mt-2 border-t border-white/6">
          <MedicineMarquee />
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════ */}
      <section className="bg-[#F4A522] py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: `${medsCount.toLocaleString()}+`, label: 'Medicines Listed' },
            { val: '5', label: 'Live Platforms' },
            { val: `₹${savingsCount.toLocaleString()}`, label: 'Avg. Monthly Savings' },
            { val: `${(usersCount / 1000).toFixed(0)}K+`, label: 'Active Families' },
          ].map((s, i) => (
            <div key={i}>
              <div className="font-['Outfit'] font-black text-4xl md:text-5xl text-[#15342C] leading-none">{s.val}</div>
              <div className="text-[#15342C]/65 text-sm font-bold mt-1.5 uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#F4A522] font-black uppercase tracking-[0.25em] text-[10px] block mb-4">Process</span>
            <h2 className="text-5xl md:text-6xl font-black text-[#15342C] font-['Outfit'] tracking-tight">
              How It Works.
            </h2>
            <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto font-['Inter']">
              From search to savings in under 60 seconds. No app needed, no account required to compare.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {HOW_STEPS.map((step, i) => (
              <div key={i}
                className={`relative rounded-[2rem] border ${step.border} bg-gradient-to-br ${step.color} p-8 group hover:-translate-y-2 transition-all duration-300 hover:shadow-xl`}>
                <div className="absolute top-6 right-7 font-['Outfit'] font-black text-5xl text-slate-900/6 leading-none select-none">
                  {step.num}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5 text-[#15342C] group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <h4 className="font-['Outfit'] font-black text-xl text-[#15342C] mb-3">{step.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-['Inter']">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════ */}
      <section className="py-28 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            <div>
              <span className="text-[#F4A522] font-black uppercase tracking-[0.25em] text-[10px] mb-4 block">Everything You Need</span>
              <h2 className="text-5xl md:text-6xl font-black text-[#15342C] font-['Outfit'] mb-6 leading-tight">
                Real Help.<br /><span className="text-emerald-500">Zero Wait.</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed font-['Inter'] mb-10 max-w-lg">
                PharmaZone bundles price intelligence, AI-powered substitutes, prescription scanning, and doctor consultation — all in one platform.
              </p>
              <button onClick={() => navigate('/search')}
                className="inline-flex items-center gap-3 bg-[#15342C] text-[#F4A522] font-black font-['Outfit'] px-8 py-4 rounded-2xl hover:bg-[#1c4a3a] transition-colors shadow-lg group">
                Start Saving Now
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => (
                <div key={i}
                  className={`${f.bg} border ${f.border} rounded-[1.75rem] p-6 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 cursor-pointer`}
                  onClick={() => i < 2 ? navigate('/search') : i === 2 ? setActiveModal('upload') : null}>
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h4 className="font-['Outfit'] font-black text-[#15342C] text-base mb-1.5">{f.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CARE PORTAL + PRICE RADAR
      ══════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white overflow-visible">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <PriceRadar />
            </div>
            <div>
              <span className="text-[#F4A522] font-black uppercase tracking-[0.25em] text-[10px] mb-4 block">Care Portal</span>
              <h2 className="text-5xl md:text-6xl font-black text-[#15342C] font-['Outfit'] mb-12 leading-tight">
                Your Health,<br /><span className="text-emerald-500">Managed.</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '📤', title: 'Smart Upload', desc: 'Scan Your Prescription', type: 'upload', bg: 'bg-amber-50', border: 'border-amber-200', hover: 'hover:bg-[#15342C] hover:border-[#15342C]' },
                  { icon: '👨‍⚕️', title: 'Live Consult', desc: 'Chat with Specialist', type: 'consult', bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:bg-[#15342C] hover:border-[#15342C]' },
                  { icon: '📋', title: 'Digital Rx', desc: 'Your Medical Vault', type: 'rx', bg: 'bg-emerald-50', border: 'border-emerald-200', hover: 'hover:bg-[#15342C] hover:border-[#15342C]' },
                  { icon: '✅', title: 'Auto Verify', desc: 'Check Rx Authenticity', type: 'verify', bg: 'bg-violet-50', border: 'border-violet-200', hover: 'hover:bg-[#15342C] hover:border-[#15342C]' },
                ].map((item, i) => (
                  <div key={i} onClick={() => setActiveModal(item.type)}
                    className={`p-8 ${item.bg} border ${item.border} rounded-[2rem] ${item.hover} transition-all cursor-pointer group hover:text-white hover:shadow-2xl`}>
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <h4 className="font-black font-['Outfit'] text-lg mb-1 text-[#15342C] group-hover:text-white transition-colors">{item.title}</h4>
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#F4A522]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#15342C]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#F4A522] font-black uppercase tracking-[0.25em] text-[10px] block mb-4">Testimonials</span>
            <h2 className="text-5xl font-black text-white font-['Outfit']">Real Savings.<br /><span className="text-[#F4A522]">Real People.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-black text-sm shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-black text-white font-['Outfit']">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.city}</div>
                  </div>
                  {t.save !== '—' && (
                    <div className="ml-auto bg-[#F4A522] text-[#15342C] font-black text-xs px-3 py-1.5 rounded-full shrink-0">
                      {t.save} saved
                    </div>
                  )}
                </div>
                <p className="text-white/65 text-sm leading-relaxed font-['Inter']">"{t.text}"</p>
                <div className="flex gap-0.5 mt-5">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 fill-[#F4A522]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ARTICLES / KNOWLEDGE HUB
      ══════════════════════════════════════ */}
      <section className="py-28 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <span className="text-[#F4A522] font-black uppercase tracking-widest text-[10px] mb-4 block">Medical Insights</span>
              <h2 className="text-5xl font-black text-[#15342C] font-['Outfit']">Knowledge Hub.</h2>
            </div>
            <button className="text-xs font-black text-[#15342C] uppercase tracking-widest border-b-2 border-slate-300 pb-1 hover:border-[#F4A522] transition-colors">
              Archive 2024
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 'generics-vs-brands',
                title: "Generics vs Brands",
                desc: "Why paying 5x more for the same molecule is a myth that costs Indian families crores every year.",
                tag: "Economics",
                img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=900",
              },
              {
                id: 'salt-scandal',
                title: "The Salt Scandal",
                desc: "How to read medicine salts and save like a pro — a guide every Indian household needs.",
                tag: "Chemistry",
                img: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=900",
              },
              {
                id: 'ai-in-pharma',
                title: "AI in Pharma",
                desc: "How we track global drug compositions in real-time and surface the best substitutes.",
                tag: "Technology",
                img: "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=900",
              },
            ].map((art, i) => (
              <div key={i}
                onClick={() => navigate(`/blog/${art.id}`)}
                className="bg-white rounded-[3rem] border border-slate-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 group cursor-pointer overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={art.img} alt={art.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                </div>
                <div className="p-7">
                  <span className="text-[9px] font-black text-[#F4A522] uppercase tracking-[0.2em] mb-3 block">{art.tag}</span>
                  <h4 className="text-2xl font-black text-[#15342C] font-['Outfit'] mb-3 leading-snug group-hover:text-emerald-600 transition-colors">
                    {art.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{art.desc}</p>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase text-[#15342C] tracking-widest group-hover:gap-4 transition-all">
                    Deep Dive <span className="text-emerald-500 text-base">→</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#F4A522]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black text-[#15342C] font-['Outfit'] mb-6 leading-tight">
            Start Saving on<br />Medicines Today.
          </h2>
          <p className="text-[#15342C]/65 text-lg mb-10 font-['Inter']">
            No app install. No signup required to compare. Just search and save.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/search')}
              className="bg-[#15342C] text-white font-black font-['Outfit'] px-10 py-4 rounded-2xl hover:bg-[#1c4a3a] transition-colors shadow-xl text-lg">
              Compare Now — It's Free
            </button>
            <button onClick={() => navigate('/register')}
              className="bg-white text-[#15342C] font-black font-['Outfit'] px-10 py-4 rounded-2xl hover:bg-[#15342C] hover:text-white transition-colors border-2 border-[#15342C] text-lg">
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#15342C] py-12 px-6 border-t border-white/8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4A522] flex items-center justify-center">
              <span className="text-[#15342C] font-black text-xl">+</span>
            </div>
            <span className="font-['Outfit'] font-black text-xl text-white tracking-tight">PharmaZone</span>
          </div>
          <p className="text-white/35 text-xs text-center">
            © 2024 PharmaZone. Hackathon Project · 404 Debuggers · All prices indicative only. Consult a doctor before switching medicines.
          </p>
          <div className="flex gap-6 text-white/40 text-xs font-bold">
            <button onClick={() => navigate('/search')} className="hover:text-white transition-colors">Medicines</button>
            <button onClick={() => navigate('/orders')} className="hover:text-white transition-colors">Orders</button>
            <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Login</button>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          MODALS (unchanged logic, refreshed UI)
      ══════════════════════════════════════ */}
      {activeModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-[#15342C]/70"
          onClick={e => { if (e.target === e.currentTarget) setActiveModal(null); }}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-[0_30px_80px_rgba(0,0,0,0.3)] fade-up">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-[#15342C] font-['Outfit'] uppercase tracking-wide">
                {activeModal === 'upload' && 'Upload Prescription'}
                {activeModal === 'consult' && 'Book Consultation'}
                {activeModal === 'rx' && 'Digital Rx Vault'}
                {activeModal === 'verify' && 'Verify Prescription'}
              </h3>
              <button onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition-colors text-slate-400 font-black text-lg">
                ✕
              </button>
            </div>

            {activeModal === 'upload' && (
              <div>
                <div
                  className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center mb-6 hover:border-[#F4A522] hover:bg-amber-50 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}>
                  {uploadStatus === 'idle' && (
                    <>
                      <div className="text-5xl mb-4">📤</div>
                      <p className="font-bold text-slate-700 mb-1">Click to upload prescription</p>
                      <p className="text-sm text-slate-400">JPG, PNG or PDF · Max 10MB</p>
                    </>
                  )}
                  {uploadStatus === 'uploading' && (
                    <>
                      <div className="w-12 h-12 border-4 border-[#F4A522] border-t-transparent animate-spin rounded-full mx-auto mb-4" />
                      <p className="font-bold text-[#15342C]">AI scanning prescription...</p>
                    </>
                  )}
                  {uploadStatus === 'done' && (
                    <>
                      <div className="text-5xl mb-4">✅</div>
                      <p className="font-bold text-emerald-600">Uploaded successfully!</p>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={onFileChange} />
                <p className="text-xs text-slate-400 text-center">Encrypted · HIPAA-compliant storage</p>
              </div>
            )}

            {activeModal === 'consult' && (
              <div className="text-center">
                <div className="text-5xl mb-5">👨‍⚕️</div>
                <p className="text-slate-600 mb-6 leading-relaxed">Connect with a licensed doctor. Get a digital prescription within minutes.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['General Physician', 'Dermatologist', 'Diabetologist', 'Cardiologist'].map(sp => (
                    <div key={sp} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-700 hover:border-[#F4A522] hover:bg-amber-50 cursor-pointer transition-all">{sp}</div>
                  ))}
                </div>
                <button onClick={() => { setActiveModal(null); navigate('/orders?tab=consultations'); }}
                  className="w-full bg-[#15342C] text-white font-black py-4 rounded-2xl hover:bg-[#1c4a3a] transition-colors font-['Outfit']">
                  Book Consultation →
                </button>
              </div>
            )}

            {activeModal === 'rx' && (
              <div className="text-center">
                <div className="text-5xl mb-5">📋</div>
                <p className="text-slate-600 mb-6 leading-relaxed">All prescriptions stored safely. Access anytime, share with any doctor.</p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-6 text-left">
                  {['Encrypted storage', 'Share with doctors', 'Expiry reminders', 'Download anytime'].map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm text-slate-600 py-1.5">
                      <span className="text-emerald-500 font-black">✓</span> {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => { setActiveModal(null); navigate('/orders'); }}
                  className="w-full bg-[#15342C] text-white font-black py-4 rounded-2xl hover:bg-[#1c4a3a] transition-colors font-['Outfit']">
                  View My Prescriptions →
                </button>
              </div>
            )}

            {activeModal === 'verify' && (
              <div className="text-center">
                <div className="text-5xl mb-5">✅</div>
                <p className="text-slate-600 mb-6 leading-relaxed">Upload any prescription and AI verifies authenticity, doctor license, and expiry in seconds.</p>
                <div
                  className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-6 cursor-pointer hover:border-[#F4A522] hover:bg-amber-50 transition-all"
                  onClick={() => fileInputRef.current?.click()}>
                  <p className="font-bold text-slate-700">📎 Upload Rx for verification</p>
                  <p className="text-sm text-slate-400 mt-1">AI-powered authenticity check</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={onFileChange} />
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {['Doctor License', 'Expiry Date', 'Digital Signature'].map(c => (
                    <div key={c} className="bg-violet-50 border border-violet-100 text-violet-700 font-bold rounded-xl p-2">{c}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
