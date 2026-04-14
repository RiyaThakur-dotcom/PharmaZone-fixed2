import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const BLOG_POSTS = {
  'generics-vs-brands': {
    title: "Generics vs Brands: The Ultimate Efficacy Truth",
    tag: "Economics",
    date: "Apr 09, 2024",
    img: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=1000",
    content: `
      In the world of medicine, the term "Generic" often carries a stigma of being "cheap" or "lower quality." However, the scientific truth is far more reassuring. 
      
      A generic medicine is clinically identical to its brand-name counterpart in dosage, safety, strength, quality, the way it is taken, and how it should be used. The FDA (and India's CDSCO) requires generic drugs to have the same active ingredient and same therapeutic effect as brand-name drugs.
      
      At PharmaZone, our AI scanning engine cross-references the "Salt" or "Molecule" of every medicine. For instance, Febrex Plus (Brand) and Paracetamol+Phenylephrine (Generic) work exactly the same way in the human body. The only difference? The price. 
      
      Brand names spend billions on marketing (TV ads, doctor visits, celebrity endorsements), and you pay for that. PharmaZone helps you skip the marketing tax and get the same cure for 70% less.
    `
  },
  'salt-scandal': {
    title: "The Salt Scandal: Reading Medicine Labels Like a Pro",
    tag: "Chemistry",
    date: "Apr 08, 2024",
    img: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=1000",
    content: `
      Have you ever looked at the back of a medicine strip? That long, unpronounceable name like "Fexofenadine Hydrochloride" is what actually heals you—the "Salt."
      
      The scandal is that pharmaceutical companies often hide these names in tiny fonts while splashing big brand names on the front. Why? So you don't realize that the ₹200 medicine and the ₹40 medicine have the SAME EXACT SALT.
      
      By learning just 5 common salts—Paracetamol (Pain/Fever), Metformin (Sugar), Atorvastatin (Cholesterol), Pantoprazole (Acidity), and Amoxicillin (Infection)—you can save thousands every year. PharmaZone's mission is to make Molecule Search the new standard in global healthcare.
    `
  },
  'ai-in-pharma': {
    title: "How AI is Fixing the Fragmented Pharma Market",
    tag: "Technology",
    date: "Apr 07, 2024",
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=1000",
    content: `
      India's pharmacy market is one of the most complex in the world. With over 800,000 chemists and dozens of online apps, price transparency was a distant dream until now.
      
      PharmaZone uses "Neural Price Scanning" to monitor inventory across 10+ major health platforms every second. We don't just find the lowest price; we track "Delivery Velocity" and "Batch Freshness." 
      
      By analyzing millions of data points, our AI predicts when a medicine price might drop or where a shortage might occur. We aren't just a comparison app; we are your personal health economist.
    `
  }
};

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = BLOG_POSTS[id] || BLOG_POSTS['generics-vs-brands'];

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="text-[#F4A522] font-black uppercase text-[10px] tracking-[0.3em] mb-10 flex items-center gap-2 hover:-translate-x-2 transition-transform"
          >
            ← Back to Knowledge Hub
          </button>
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
             <div className="flex-1">
                <div className="bg-[#15342C] text-emerald-400 text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full w-fit mb-6">
                  {post.tag}
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-[#15342C] font-['Outfit'] leading-tight tracking-tighter">
                  {post.title}
                </h1>
             </div>
             <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4">IV-09/2024</p>
          </div>
          
          <div className="aspect-[16/8] rounded-[3.5rem] overflow-hidden mb-20 shadow-3xl grayscale hover:grayscale-0 transition-all duration-700">
            <img src={post.img} alt={post.title} className="w-full h-full object-cover scale-110" />
          </div>
          
          <div className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-slate-50 relative">
             <div className="absolute top-10 right-10 opacity-10 text-[10rem] font-bold text-[#15342C] pointer-events-none font-['Outfit']">"</div>
             <div className="prose prose-2xl max-w-none text-slate-500 font-medium leading-relaxed font-['Inter'] whitespace-pre-line text-lg">
                {post.content}
             </div>
             
             <div className="mt-20 pt-12 border-t border-slate-50 flex flex-wrap items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 rounded-[2rem] bg-[#15342C] flex items-center justify-center text-4xl shadow-2xl">🧪</div>
                   <div>
                      <h4 className="font-black text-[#15342C] font-['Outfit'] text-xl tracking-tight">Verified by PharaFriend AI</h4>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Medical Research Wing • Sector 09</p>
                   </div>
                </div>
                <button onClick={() => navigate('/search')} className="bg-[#F4A522] text-[#15342C] px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">Search Molecules →</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
