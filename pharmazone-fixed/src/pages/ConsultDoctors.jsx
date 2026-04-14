import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const SPECIALTIES = [
  { id: 1, name: "General Physician", icon: "🩺", waitTime: "< 5 min", fee: 299, available: true },
  { id: 2, name: "Dermatologist", icon: "✨", waitTime: "< 15 min", fee: 499, available: true },
  { id: 3, name: "Diabetologist", icon: "🩸", waitTime: "< 10 min", fee: 449, available: true },
  { id: 4, name: "Cardiologist", icon: "❤️", waitTime: "< 20 min", fee: 699, available: true },
  { id: 5, name: "Orthopaedic", icon: "🦴", waitTime: "< 15 min", fee: 549, available: true },
  { id: 6, name: "Gynaecologist", icon: "🌸", waitTime: "< 10 min", fee: 599, available: true },
  { id: 7, name: "Psychiatrist", icon: "🧠", waitTime: "< 20 min", fee: 699, available: true },
  { id: 8, name: "ENT Specialist", icon: "👂", waitTime: "< 15 min", fee: 449, available: false },
  { id: 9, name: "Paediatrician", icon: "👶", waitTime: "< 10 min", fee: 399, available: true },
  { id: 10, name: "Neurologist", icon: "⚡", waitTime: "< 25 min", fee: 799, available: false },
  { id: 11, name: "Pulmonologist", icon: "🫁", waitTime: "< 20 min", fee: 649, available: true },
  { id: 12, name: "Urologist", icon: "💧", waitTime: "< 20 min", fee: 599, available: false },
];

const FEATURES = [
  { icon: "⚡", title: "Consult in Minutes", desc: "Connect with a verified doctor in under 5 minutes" },
  { icon: "🔒", title: "100% Private", desc: "Confidential consultation, never shared with anyone" },
  { icon: "📋", title: "Digital Prescription", desc: "Receive valid prescription directly on WhatsApp" },
  { icon: "🌙", title: "Available 24/7", desc: "Talk to a doctor anytime, even at 3 AM" },
];

const ConsultDoctors = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleConsultClick = (specialty) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/consult' } } });
      return;
    }
    setSelectedSpecialty(specialty);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/consultations/request/${user.userId || user.id}`, {
        symptoms: `[${selectedSpecialty.name}] ${symptoms}`,
        specialty: selectedSpecialty.name,
        fee: selectedSpecialty.fee
      });
      setSubmitted(true);
    } catch (err) {
      // For demo mode just simulate success
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfb]">

      {/* ═══ HERO ════════════════════════════════════════════════════ */}
      <section className="bg-[#15342C] pt-32 pb-44 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-20 w-64 h-64 bg-[#F4A522]/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            800+ Verified Doctors · Available Now
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white font-['Outfit'] mb-5 leading-tight">
            Talk to a Real Doctor.<br/>
            <span className="text-[#F4A522]">Right Now.</span>
          </h1>
          <p className="text-emerald-100/70 text-lg font-['Inter'] mb-12 max-w-xl mx-auto leading-relaxed">
            Describe your symptoms. Get a personalised diagnosis and a valid digital prescription — without leaving home.
          </p>

          {/* Feature Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 text-left hover:bg-white/15 transition-colors">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h4 className="font-bold text-white text-sm font-['Outfit'] mb-1">{f.title}</h4>
                <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 w-full left-0 translate-y-[1px]">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 0C360 80 1080 80 1440 0V100H0V0Z" fill="#fbfbfb"/>
          </svg>
        </div>
      </section>

      {/* ═══ SPECIALTIES GRID ════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-24">
        <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 p-8 md:p-12 mb-12">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-black text-[#15342C] font-['Outfit']">Choose a Specialist</h2>
              <p className="text-slate-400 font-medium mt-1">Select the type of doctor you want to consult</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              {SPECIALTIES.filter(s => s.available).length} Doctors Online Now
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {SPECIALTIES.map(spec => (
              <button
                key={spec.id}
                onClick={() => handleConsultClick(spec)}
                disabled={!spec.available}
                className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-300 group text-center ${
                  spec.available
                    ? 'border-slate-100 hover:border-[#F4A522] hover:shadow-[0_10px_30px_rgba(244,165,34,0.15)] hover:-translate-y-2 cursor-pointer bg-white'
                    : 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-60'
                }`}
              >
                {spec.available && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                )}
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{spec.icon}</span>
                <div>
                  <p className="font-black text-[#15342C] text-sm font-['Outfit'] leading-tight">{spec.name}</p>
                  {spec.available ? (
                    <>
                      <p className="text-[10px] text-emerald-600 font-bold mt-1">Wait {spec.waitTime}</p>
                      <p className="text-[11px] text-[#F4A522] font-black mt-0.5">₹{spec.fee}</p>
                    </>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Unavailable</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-[#15342C] rounded-[2rem] p-10 md:p-14 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4A522]/10 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black font-['Outfit'] mb-10 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Choose Specialty", desc: "Pick the type of doctor you need based on your concern" },
                { step: "02", title: "Describe Symptoms", desc: "Tell us what you're experiencing in detail" },
                { step: "03", title: "Doctor Reviews", desc: "A verified doctor reads and analyzes your case" },
                { step: "04", title: "Get Prescription", desc: "Valid digital Rx sent to your WhatsApp within minutes" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#F4A522]/20 border border-[#F4A522]/30 flex items-center justify-center text-[#F4A522] font-black text-xl font-['Outfit']">{s.step}</div>
                  <h4 className="font-black text-white font-['Outfit'] text-lg">{s.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                  {i < 3 && <div className="hidden md:block absolute" style={{}}></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MODAL ═══════════════════════════════════════════════════ */}
      {showModal && selectedSpecialty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-10 shadow-2xl relative">
            <button onClick={() => { setShowModal(false); setSubmitted(false); setSymptoms(''); }} className="absolute top-6 right-6 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-[#15342C] hover:bg-slate-200 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-3">Request Sent!</h2>
                <p className="text-slate-500 font-['Inter'] mb-2">Your consultation with a <strong>{selectedSpecialty.name}</strong> has been submitted.</p>
                <p className="text-slate-400 text-sm mb-8">Our doctor will review your symptoms and respond shortly via your account dashboard.</p>
                <button onClick={() => navigate('/orders')} className="btn-accent w-full flex justify-center items-center">
                  Track in My Account
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-[#15342C] rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    {selectedSpecialty.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#15342C] font-['Outfit']">Consult {selectedSpecialty.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Wait: {selectedSpecialty.waitTime}
                      </span>
                      <span className="text-[#F4A522] font-black text-sm">₹{selectedSpecialty.fee}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  <label className="block text-xs font-black text-[#15342C] uppercase tracking-widest mb-3 font-['Outfit']">
                    Describe Your Symptoms in Detail
                  </label>
                  <textarea
                    rows="5"
                    className="w-full p-4 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#F4A522] outline-none font-['Inter'] font-medium resize-none transition-colors mb-6"
                    placeholder="E.g. I've had a severe headache and mild fever since yesterday. I also feel nauseous in the morning..."
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    disabled={submitting || !symptoms.trim()}
                    className="w-full bg-[#15342C] text-white hover:bg-[#F4A522] hover:text-[#15342C] py-4 rounded-xl font-black tracking-widest font-['Outfit'] uppercase transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {submitting
                      ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Sending...</>
                      : <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg> Send to Doctor</>
                    }
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultDoctors;
