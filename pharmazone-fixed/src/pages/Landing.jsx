import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PriceRadar from '../components/PriceRadar';
import BudgetCalculator from '../components/BudgetCalculator';
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
  { name: 'Dr. Anita Menon', city: 'Bengaluru', save: 'Verified', text: 'As a doctor, I now recommend PharmaZone to all patients. The generic suggestions are medically accurate and transparent.', avatar: 'AM', color: 'bg-violet-600' },
  { name: 'Vikram Singh', city: 'New Delhi', save: '₹2,100', text: 'Prescription upload feature is magic. Just clicked a photo and it added all medicines to cart with cheapest prices!', avatar: 'VS', color: 'bg-indigo-600' },
  { name: 'Sonal Verma', city: 'Pune', save: '₹4,500', text: 'The AI PharaFriend suggested a generic salt for my knee pain medicine. Same result, but 70% cheaper than the branded version.', avatar: 'SV', color: 'bg-rose-500' },
  { name: 'Manish Gupta', city: 'Lucknow', save: '₹950', text: 'Very impressive UI and fast search. Life-saver for chronic medication users who want to save money monthly.', avatar: 'MG', color: 'bg-blue-500' },
];

/* ─── FEATURE TILES ─── */
const FEATURES = [
  { icon: '🔍', title: 'Real-Time Prices', desc: 'Live data from 5+ platforms, updated every 6 hours.', bg: 'bg-amber-50', border: 'border-amber-200' },
  { icon: '🤖', title: 'AI Substitutes', desc: 'Same molecule, fraction of the price. Verified by doctors.', bg: 'bg-violet-50', border: 'border-violet-200' },
  { icon: '📄', title: 'Rx Scanner', desc: 'Upload your prescription — AI extracts every medicine automatically.', bg: 'bg-blue-50', border: 'border-blue-200' },
  { icon: '⚖️', title: 'Budget Calculator', desc: 'Calculate how many tablets you get for ₹200.', bg: 'bg-emerald-50', border: 'border-emerald-200' },
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
  const location = useLocation();
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const heroRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showSavingsInfo, setShowSavingsInfo] = useState(false);
  const [showBudgetCalc, setShowBudgetCalc] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [verifyStatus, setVerifyStatus] = useState('idle');
  const [expandedReview, setExpandedReview] = useState(null);
  const [slangIndex, setSlangIndex] = useState(0);
  const [heroVisible, setHeroVisible] = useState(false);

  const savingsCount = useCounter(2840);
  const usersCount = useCounter(50000);
  const medsCount = useCounter(10000);

  // Handle URL deep links for modals
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modal = params.get('modal');
    if (modal === 'upload') {
      setActiveModal('upload');
      // Clean up URL without refreshing
      window.history.replaceState({}, '', '/');
    }
  }, [location.search]);

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

  const onFileChange = (e, type = 'upload') => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (type === 'verify') {
      setVerifyStatus('verifying');
      // Step 1: UI Feedback
      setTimeout(() => setVerifyStatus('scanning_signature'), 800);
      // Step 2: License DB check
      setTimeout(() => setVerifyStatus('checking_database'), 1800);
      // Step 3: Finalize
      setTimeout(() => {
        setVerifyStatus('done');
      }, 3000);
    } else {
      setUploadStatus('uploading');
      setTimeout(() => {
        setUploadStatus('done');
      }, 2800);
    }
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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>



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

              {/* Premium AI Savings Badge */}
              <div 
                onClick={() => setShowSavingsInfo(true)}
                className="fade-up delay-1 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-2xl mb-10 cursor-pointer hover:bg-white/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(244,165,34,0.15)] transition-all duration-300 group">
                <div className="w-8 h-8 rounded-lg bg-[#F4A522] flex items-center justify-center text-[#15342C] shadow-lg shadow-[#F4A522]/30 group-hover:rotate-12 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="text-left">
                  <p className="text-[#F4A522] font-black text-[9px] uppercase tracking-widest font-['Outfit'] mb-0.5">PharmaZone Intelligence</p>
                  <p className="text-white font-bold text-xs font-['Inter']">40–80% Savings Guaranteed <span className="text-[#F4A522] underline underline-offset-4 decoration-2 ml-1">Learn How →</span></p>
                </div>
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
                    className="w-full py-5 px-4 text-[15px] font-semibold text-[#15342C] placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                  <div className="flex shrink-0">
                    <button 
                      type="button"
                      onClick={() => setShowBudgetCalc(true)}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-5 flex items-center gap-2 border-l border-r border-slate-100 transition-colors">
                      <span className="text-lg">⚖️</span>
                      <span className="text-[9px] font-black uppercase tracking-widest hidden sm:block">Budget Calc</span>
                    </button>
                    <button type="submit"
                      className="bg-[#15342C] hover:bg-[#1c4a3a] text-[#F4A522] px-7 py-5 font-black uppercase text-xs tracking-widest transition-colors font-['Outfit']">
                      Search
                    </button>
                  </div>
                </form>

                {/* Autocomplete */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-slate-100 z-[60] max-h-[320px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
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
                    <div 
                      onClick={() => setShowBudgetCalc(true)}
                      className="p-4 bg-emerald-50 border-t border-emerald-100 flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-100 transition-colors sticky bottom-0">
                      <span className="text-lg">⚖️</span>
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Open Budget Calculator</span>
                    </div>
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
                  onClick={() => {
                    if (i === 0 || i === 1) navigate('/search');
                    else if (i === 3) setShowBudgetCalc(true);
                    else if (i === 2) setActiveModal('upload');
                    else if (i === 4) navigate('/consult');
                  }}>
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
                  <div key={i} onClick={() => {
                    if (item.type === 'consult') navigate('/consult');
                    else if (item.type === 'rx') navigate('/dashboard?tab=prescriptions');
                    else setActiveModal(item.type);
                  }}
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
                <div className="relative">
                  <p className={`text-white/65 text-sm leading-relaxed font-['Inter'] ${expandedReview === i ? '' : 'line-clamp-2'}`}>
                    "{t.text}"
                  </p>
                  {t.text.length > 60 && (
                    <button 
                      onClick={() => setExpandedReview(expandedReview === i ? null : i)}
                      className="text-[#F4A522] text-[10px] font-black uppercase mt-2 hover:underline">
                      {expandedReview === i ? 'Show Less' : 'Read More +'}
                    </button>
                  )}
                </div>
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
          MODALS
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
                    <div className="fade-up">
                      <div className="text-5xl mb-4 text-emerald-500">✅</div>
                      <p className="font-bold text-emerald-600 text-lg mb-2">Prescription Confirmed!</p>
                      <p className="text-slate-500 text-sm mb-6">Our AI has extracted the medicines. Would you like to view them or keep shopping?</p>
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => navigate('/dashboard?tab=prescriptions')} className="bg-[#15342C] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase">View in Vault</button>
                        <button onClick={() => { setActiveModal(null); setUploadStatus('idle'); }} className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase">Continue Shopping</button>
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => onFileChange(e, 'upload')} />
                <p className="text-xs text-slate-400 text-center">Encrypted · HIPAA-compliant storage</p>
              </div>
            )}

            {activeModal === 'consult' && (
              <div className="text-center">
                <div className="text-5xl mb-5">👨‍⚕️</div>
                <p className="text-slate-600 mb-6 leading-relaxed">How would you like to proceed with your consultation?</p>
                <div className="space-y-3 mb-6">
                  <div 
                    onClick={() => setActiveModal(null)}
                    className="p-4 bg-violet-50 border border-violet-100 rounded-2xl text-left cursor-pointer hover:border-violet-400 transition-all group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-[#15342C] text-sm">AI Health Bot</span>
                      <span className="bg-violet-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Instant</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Quick analysis, symptom check & generic advice.</p>
                  </div>
                  <div 
                    onClick={() => navigate('/consult')}
                    className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-left cursor-pointer hover:border-emerald-400 transition-all group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-[#15342C] text-sm">Human Specialist</span>
                      <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Live · ₹199</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Video call with a licensed doctor & digital Rx.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['General Physician', 'Dermatologist'].map(sp => (
                    <div key={sp} className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sp}</div>
                  ))}
                </div>
              </div>
            )}

            {activeModal === 'rx' && (
              <div className="text-center">
                <div className="text-5xl mb-5">📋</div>
                <p className="text-slate-600 mb-6 leading-relaxed font-medium">Your Medical Vault</p>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Recently Scanned</div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-sm">📄</div>
                        <div>
                          <p className="text-xs font-bold text-[#15342C]">Dr. S. K. Gupta</p>
                          <p className="text-[9px] text-slate-400">14-Apr-2024 · 3 Medicines</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md uppercase">Verified</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl opacity-60 grayscale">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm">📄</div>
                        <div>
                          <p className="text-xs font-bold text-[#15342C]">Max Hospital</p>
                          <p className="text-[9px] text-slate-400">02-Mar-2024 · 5 Medicines</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md uppercase">Archived</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setActiveModal(null); navigate('/dashboard?tab=prescriptions'); }}
                  className="w-full bg-[#15342C] text-white font-black py-4 rounded-2xl hover:bg-[#1c4a3a] transition-colors font-['Outfit'] shadow-lg shadow-[#15342C]/20">
                  Open Complete Vault →
                </button>
              </div>
            )}

            {activeModal === 'verify' && (
              <div className="text-center">
                <div className="text-5xl mb-5">✅</div>
                <p className="text-slate-600 mb-6 leading-relaxed">Upload any prescription and AI verifies authenticity, doctor license, and expiry in seconds.</p>
                {verifyStatus === 'idle' && (
                  <div
                    className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-6 cursor-pointer hover:border-[#F4A522] hover:bg-amber-50 transition-all"
                    onClick={() => fileInputRef.current?.click()}>
                    <p className="font-bold text-slate-700">📎 Upload Rx for verification</p>
                    <p className="text-sm text-slate-400 mt-1">AI-powered authenticity check</p>
                  </div>
                )}
                {verifyStatus === 'verifying' && (
                  <div className="py-10">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent animate-spin rounded-full mx-auto mb-4" />
                    <p className="font-bold text-violet-700">Analyzing Prescription OCR...</p>
                  </div>
                )}
                {verifyStatus === 'scanning_signature' && (
                  <div className="py-10">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent animate-spin rounded-full mx-auto mb-4" />
                    <p className="font-bold text-emerald-700">Scanning Digital Signature...</p>
                  </div>
                )}
                {verifyStatus === 'checking_database' && (
                  <div className="py-10">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent animate-spin rounded-full mx-auto mb-4" />
                    <p className="font-bold text-amber-600">Checking NMC/MCI Registry...</p>
                  </div>
                )}
                {verifyStatus === 'done' && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-6 text-left fade-up">
                    <div className="flex items-center gap-3 text-emerald-600 font-bold mb-4">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      Verified Authenticity
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Doctor License Status:</span>
                        <span className="text-emerald-600 font-black">ACTIVE</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">License Expiry:</span>
                        <span className="text-[#15342C] font-black italic">28-Aug-2028</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Digital Signature:</span>
                        <span className="text-emerald-600 font-black">VALIDATE ✓</span>
                      </div>
                      <div className="pt-3 border-t border-emerald-100 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#F4A522]">
                        <span>Reg No: MCI-84920-RJ</span>
                        <span>Dr. S. K. Gupta</span>
                      </div>
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => onFileChange(e, 'verify')} />
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {['Doctor License', 'Expiry Date', 'Digital Signature'].map(c => (
                    <div key={c} className="bg-violet-50 border border-violet-100 text-violet-700 font-bold rounded-xl p-2">{c}</div>
                  ))}
                </div>
                {verifyStatus === 'done' && (
                  <button 
                    onClick={() => { setVerifyStatus('idle'); setActiveModal(null); }}
                    className="w-full mt-6 bg-[#15342C] text-white py-3 rounded-xl font-black uppercase tracking-widest">Done</button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ PREMIUM SAVINGS EXPLANATION MODAL ═══════════════════════ */}
      {showSavingsInfo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#15342C]/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300 font-['Outfit']">
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl -ml-24 -mb-24"></div>

            <button 
              onClick={() => setShowSavingsInfo(false)} 
              className="absolute top-8 right-8 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-[#15342C] hover:text-white transition-all z-10 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>

            <div className="p-10 md:p-14 relative z-0">
              <div className="inline-flex items-center gap-2 bg-[#F4A522]/10 text-[#F4A522] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-[#F4A522]/20">
                <span className="w-1.5 h-1.5 bg-[#F4A522] rounded-full animate-pulse"></span>
                Generic Intelligence Protocol
              </div>
              <h2 className="text-4xl font-black text-[#15342C] font-['Outfit'] mb-6 leading-tight">
                How we save you <br/>
                <span className="text-emerald-600">40% to 80% every day.</span>
              </h2>
              <p className="text-slate-500 font-medium font-['Inter'] mb-10 leading-relaxed text-sm">
                Medicine prices vary significantly between brands, even when the active ingredient (salt) is identical. Our AI identifies identical molecules at a fraction of the cost.
              </p>

              {/* Price Comparison Grid */}
              <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 uppercase tracking-widest">Comparative Analysis: Paracetamol 650mg</p>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-[#15342C]">Top Branded Tablet</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase italic">Heavy Marketing & Brand Tax</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-rose-500">₹32.00</p>
                      <p className="text-[9px] text-rose-400 font-black tracking-widest uppercase">Per Strip</p>
                    </div>
                  </div>
                  <div className="h-px bg-slate-200/50"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-700">Generic Alternative</p>
                        <p className="text-[11px] text-emerald-500 font-bold uppercase font-['Inter']">Same Salt · Same Effect</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-600">₹6.40</p>
                      <p className="text-[9px] text-emerald-400 font-black tracking-widest uppercase">PharmaZone Verified</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex-shrink-0 flex items-center justify-center text-xl shadow-inner">🔬</div>
                  <div>
                    <h4 className="font-black text-[#15342C] text-sm font-['Outfit'] mb-1">Quality Guaranteed</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed font-['Inter'] font-medium">All generics are DCGI approved and sourced from WHO-GMP certified facilities.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex-shrink-0 flex items-center justify-center text-xl shadow-inner">👨‍⚕️</div>
                  <div>
                    <h4 className="font-black text-[#15342C] text-sm font-['Outfit'] mb-1">Doctor Verified</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed font-['Inter'] font-medium">Our clinical team verifies every substitute to ensure 100% molecular matches.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Budget Calculator Modal */}
      {showBudgetCalc && <BudgetCalculator onClose={() => setShowBudgetCalc(false)} />}
    </div>
  );
};

export default Landing;
