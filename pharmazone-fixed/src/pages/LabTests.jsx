import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LAB_TESTS = [
  {
    id: 1, name: "Complete Blood Count (CBC)", category: "Full Body", price: 299, mrp: 499,
    turnaround: "Same Day", homeSample: true, nabl: true, description: "Check RBC, WBC, Platelet count, Haemoglobin levels",
    includes: ["Haemoglobin", "RBC Count", "WBC Count", "Platelets", "ESR", "HCT"]
  },
  {
    id: 2, name: "Full Body Checkup", category: "Full Body", price: 999, mrp: 2499,
    turnaround: "24 Hours", homeSample: true, nabl: true, description: "Comprehensive 80-parameter health screening package",
    includes: ["CBC", "Liver Function", "Kidney Function", "Lipid Profile", "Blood Sugar", "Thyroid (TSH)", "Vitamin D", "Vitamin B12"]
  },
  {
    id: 3, name: "HbA1c (Diabetes Control)", category: "Diabetes", price: 349, mrp: 550,
    turnaround: "Same Day", homeSample: true, nabl: true, description: "3-month blood sugar average control test",
    includes: ["HbA1c", "Fasting Blood Sugar", "Post Prandial Sugar"]
  },
  {
    id: 4, name: "Diabetes Screening Package", category: "Diabetes", price: 549, mrp: 999,
    turnaround: "Same Day", homeSample: true, nabl: true, description: "Complete diabetes management panel",
    includes: ["HbA1c", "Fasting Glucose", "Post-meal Glucose", "Insulin", "Urine Microalbumin", "Creatinine"]
  },
  {
    id: 5, name: "Vitamin D & B12 Panel", category: "Vitamins", price: 799, mrp: 1400,
    turnaround: "24 Hours", homeSample: true, nabl: true, description: "Deficiency check for most critical vitamins",
    includes: ["Vitamin D3 (25-OH)", "Vitamin B12", "Folate", "Iron Studies"]
  },
  {
    id: 6, name: "Thyroid Profile (TSH, T3, T4)", category: "Thyroid", price: 399, mrp: 750,
    turnaround: "Same Day", homeSample: true, nabl: true, description: "Complete thyroid function evaluation",
    includes: ["TSH", "T3 (Triiodothyronine)", "T4 (Thyroxine)", "Free T3", "Free T4"]
  },
  {
    id: 7, name: "Liver Function Test (LFT)", category: "Fever Tests", price: 299, mrp: 499,
    turnaround: "Same Day", homeSample: true, nabl: true, description: "Check liver health through enzyme levels",
    includes: ["SGPT", "SGOT", "Alkaline Phosphatase", "Bilirubin", "Total Protein", "Albumin"]
  },
  {
    id: 8, name: "Dengue NS1 Antigen + IgM/IgG", category: "Fever Tests", price: 699, mrp: 1200,
    turnaround: "4 Hours", homeSample: true, nabl: true, description: "Fast dengue detection combo test",
    includes: ["NS1 Antigen", "IgM Antibody", "IgG Antibody"]
  },
  {
    id: 9, name: "Typhoid (Widal + Blood Culture)", category: "Fever Tests", price: 499, mrp: 900,
    turnaround: "48 Hours", homeSample: true, nabl: true, description: "Comprehensive typhoid fever detection",
    includes: ["Widal Test", "Typhidot IgM", "Blood Culture & Sensitivity"]
  },
  {
    id: 10, name: "Lipid Profile (Cholesterol)", category: "Cardiac", price: 299, mrp: 550,
    turnaround: "Same Day", homeSample: true, nabl: true, description: "Complete cholesterol & heart risk assessment",
    includes: ["Total Cholesterol", "LDL", "HDL", "VLDL", "Triglycerides", "LDL/HDL Ratio"]
  },
  {
    id: 11, name: "Cardiac Risk Markers", category: "Cardiac", price: 1299, mrp: 2500,
    turnaround: "24 Hours", homeSample: true, nabl: true, description: "Advanced cardiovascular risk profiling",
    includes: ["hs-CRP", "Troponin I", "Homocysteine", "Lipid Profile", "ECG", "BNP"]
  },
  {
    id: 12, name: "Kidney Function Test (KFT)", category: "Full Body", price: 299, mrp: 499,
    turnaround: "Same Day", homeSample: true, nabl: true, description: "Renal health evaluation panel",
    includes: ["Creatinine", "Urea", "Uric Acid", "eGFR", "Electrolytes", "Urine Routine"]
  },
  {
    id: 13, name: "COVID-19 RT-PCR Test", category: "Infection", price: 499, mrp: 900,
    turnaround: "6 Hours", homeSample: true, nabl: true, description: "Gold standard COVID detection test",
    includes: ["RT-PCR (SARS-CoV-2)", "Certificate with QR Code"]
  },
  {
    id: 14, name: "Cancer Marker Screening", category: "Cancer", price: 2499, mrp: 4500,
    turnaround: "48 Hours", homeSample: false, nabl: true, description: "Early cancer detection blood markers",
    includes: ["PSA (Prostate)", "CEA (Colon)", "CA-125 (Ovarian)", "AFP (Liver)", "CA 19-9 (Pancreas)", "Beta HCG"]
  },
  {
    id: 15, name: "Women's Wellness Package", category: "Full Body", price: 1499, mrp: 3000,
    turnaround: "24 Hours", homeSample: true, nabl: true, description: "Complete women's health screening",
    includes: ["CBC", "Thyroid", "Vitamin D", "Iron", "PCOS Hormones", "Calcium", "Pap Smear Guidance", "Breast Cancer Marker"]
  },
  {
    id: 16, name: "Urine Routine & Microscopy", category: "Infection", price: 149, mrp: 250,
    turnaround: "Same Day", homeSample: true, nabl: true, description: "Basic urine analysis for UTI and kidney health",
    includes: ["Physical Exam", "Chemical Exam", "Microscopic Exam", "Culture (if abnormal)"]
  },
];

const CATEGORIES = ["All", "Full Body", "Diabetes", "Vitamins", "Thyroid", "Fever Tests", "Cardiac", "Cancer", "Infection"];

const FEATURES = [
  { icon: "🏅", title: "NABL Certified Labs", desc: "100% government-accredited testing facilities" },
  { icon: "🏠", title: "Home Sample Collection", desc: "Trained phlebotomist arrives in 60 minutes" },
  { icon: "⚡", title: "Fast Accurate Reports", desc: "Same-day results for most tests via WhatsApp & email" },
  { icon: "🇮🇳", title: "Pan India Coverage", desc: "Available in 500+ cities across India" },
  { icon: "🔒", title: "Data Privacy", desc: "Reports accessible only to you, 100% secure" },
  { icon: "💊", title: "Doctor Consultation", desc: "Free 10-minute report discussion with our doctors" },
];

const LabTests = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("New Delhi");
  const [bookedTests, setBookedTests] = useState([]);

  const filtered = LAB_TESTS.filter(t => {
    const matchCat = selectedCategory === "All" || t.category === selectedCategory;
    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleBook = (test) => {
    setBookedTests(prev => [...prev, test.id]);
    // Add to cart as a service
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('pharmazone_cart')) || []; } catch { cart = []; }
    if (!Array.isArray(cart)) cart = [];
    const exists = cart.findIndex(i => i.id === `lab_${test.id}`);
    if (exists === -1) {
      cart.push({ id: `lab_${test.id}`, name: test.name, genericName: "Lab Test", price: test.price, platform: "PharmaZone Labs", quantity: 1, requiresPrescription: false });
      localStorage.setItem('pharmazone_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
    setTimeout(() => setBookedTests(prev => prev.filter(id => id !== test.id)), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb]">

      {/* ═══ HERO ════════════════════════════════════════════════════ */}
      <section className="bg-[#15342C] pt-32 pb-44 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-[#F4A522]/10 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F4A522]/20 border border-[#F4A522]/30 text-[#F4A522] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <span className="w-2 h-2 bg-[#F4A522] rounded-full animate-pulse"></span>
            NABL Certified · Home Collection Available
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white font-['Outfit'] mb-5 leading-tight">
            Lab Tests, Delivered<br/>
            <span className="text-[#F4A522]">To Your Doorstep.</span>
          </h1>
          <p className="text-emerald-100/70 font-medium font-['Inter'] mb-10 max-w-xl mx-auto text-lg">
            Book certified lab tests online. Sample collected at home, reports on WhatsApp. Trusted by 5M+ patients.
          </p>

          {/* Search Bar with Location */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1.5 bg-[#F4A522]/25 rounded-2xl blur opacity-75"></div>
            <div className="relative flex flex-col sm:flex-row items-stretch bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden gap-0">
              {/* City Selector */}
              <div className="flex items-center gap-2 px-4 py-3 border-b sm:border-b-0 sm:border-r border-slate-100 bg-slate-50 sm:rounded-l-2xl">
                <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="bg-transparent outline-none font-bold text-[#15342C] text-sm cursor-pointer"
                >
                  {["New Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad"].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              {/* Search */}
              <input
                type="text"
                placeholder="Search tests or packages (e.g. Full Body, Diabetes...)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-4 text-[#15342C] placeholder-slate-400 font-semibold outline-none font-['Outfit'] text-base"
              />
              <button className="bg-[#15342C] hover:bg-[#F4A522] text-white hover:text-[#15342C] px-8 py-4 font-black font-['Outfit'] uppercase tracking-widest transition-colors flex items-center gap-2 sm:rounded-r-2xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                Search
              </button>
            </div>
          </div>

          {/* Quick Book Row */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {["Full Body Checkup", "Diabetes Panel", "Thyroid Test", "Vitamin D & B12", "Dengue Test"].map(name => (
              <button key={name} onClick={() => setSearchQuery(name)} className="bg-white/10 hover:bg-[#F4A522] hover:text-[#15342C] text-white/80 text-xs font-semibold px-4 py-2 rounded-full border border-white/20 hover:border-[#F4A522] transition-all duration-200">
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 w-full left-0 translate-y-[1px]">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 0C360 80 1080 80 1440 0V100H0V0Z" fill="#fbfbfb"/>
          </svg>
        </div>
      </section>

      {/* ═══ TRUST FEATURES ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 text-center border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h4 className="font-black text-[#15342C] text-xs font-['Outfit'] mb-1 leading-tight">{f.title}</h4>
              <p className="text-slate-400 text-[10px] font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTS LISTING ═══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-3 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border-2 ${selectedCategory === cat
                ? 'bg-[#15342C] text-white border-[#15342C] shadow-lg'
                : 'bg-white text-slate-600 border-slate-200 hover:border-[#F4A522] hover:text-[#15342C]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">{filtered.length} Tests Available in {city}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(test => (
            <div key={test.id} className="bg-white rounded-3xl border-2 border-slate-100 hover:border-teal-400 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(20,184,166,0.15)] hover:-translate-y-2 transition-all duration-300 overflow-hidden group flex flex-col">
              {/* Category Badge strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#15342C] to-teal-500"></div>

              <div className="p-7 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-teal-200">
                    {test.category}
                  </span>
                  <div className="flex gap-2">
                    {test.homeSample && (
                      <span title="Home Collection" className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-full border border-emerald-200">🏠 Home</span>
                    )}
                    {test.nabl && (
                      <span title="NABL Certified" className="bg-sky-50 text-sky-600 text-[10px] font-black px-2 py-1 rounded-full border border-sky-200">🏅 NABL</span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#15342C] font-['Outfit'] mb-2 leading-tight">{test.name}</h3>
                <p className="text-slate-500 text-sm font-medium mb-4 flex-1 leading-relaxed">{test.description}</p>

                {/* Includes */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {test.includes.slice(0, 4).map((item, i) => (
                    <span key={i} className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded border border-slate-200">{item}</span>
                  ))}
                  {test.includes.length > 4 && (
                    <span className="bg-[#15342C]/5 text-[#15342C] text-[10px] font-black px-2 py-1 rounded border border-[#15342C]/10">+{test.includes.length - 4} more</span>
                  )}
                </div>

                {/* Price + Turnaround */}
                <div className="flex items-end justify-between mb-5 pt-4 border-t border-slate-100">
                  <div>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-[#15342C] font-['Outfit']">₹{test.price}</span>
                      <span className="text-sm text-slate-400 line-through mb-1 font-bold">₹{test.mrp}</span>
                      <span className="text-xs font-black text-emerald-600 mb-1">{Math.round((test.mrp - test.price) / test.mrp * 100)}% off</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wide flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Report in {test.turnaround}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleBook(test)}
                  className={`w-full py-3.5 rounded-xl font-black font-['Outfit'] uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    bookedTests.includes(test.id)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-[#15342C] text-white group-hover:bg-[#F4A522] group-hover:text-[#15342C] shadow-lg'
                  }`}
                >
                  {bookedTests.includes(test.id) ? (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Added to Cart!</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> Book Test</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LabTests;
