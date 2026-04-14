import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { MEDICINES_DB } from '../services/medicinesDB';

const CATEGORIES = [
  { label: 'All',          value: 'All' },
  { label: 'Pain Relief',  value: 'Pain Relief' },
  { label: 'Antibiotics',  value: 'Antibiotics' },
  { label: 'Diabetes',     value: 'Diabetes' },
  { label: 'Heart',        value: 'Cardiac Care' },
  { label: 'Vitamins',     value: 'Supplements' },
  { label: 'Skin',         value: 'Dermatology' },
  { label: 'Mental Health',value: 'Mental Health' },
  { label: 'Allergy',      value: 'Allergy' },
  { label: 'Gastro',       value: 'Gastro' },
];

const localSearch = (q) => {
  if (!q.trim()) return MEDICINES_DB;
  const lq = q.toLowerCase();
  return MEDICINES_DB.filter(m =>
    m.name?.toLowerCase().includes(lq) ||
    m.genericName?.toLowerCase().includes(lq) ||
    m.salt?.toLowerCase().includes(lq) ||
    m.saltComposition?.toLowerCase().includes(lq) ||
    m.category?.toLowerCase().includes(lq) ||
    m.uses?.toLowerCase().includes(lq)
  );
};

const MedicineCard = ({ med }) => {
  const prices = med.platformPrices || [];
  const sorted = [...prices].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0];

  return (
    <Link to={`/medicine/${med.id}`}
      className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-black text-slate-800 font-['Outfit'] text-base leading-tight">{med.name}</h3>
            {med.requiresPrescription && (
              <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full uppercase flex-shrink-0">Rx</span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate">{med.genericName}</p>
          {/* Salt Analysis */}
          {med.salt && (
            <p className="text-[11px] text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md mt-1 truncate font-medium">
              🧪 {med.salt}
            </p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-black text-[#15342C]">₹{cheapest?.price || med.price}</p>
          {cheapest?.mrp && cheapest.mrp > cheapest.price && (
            <p className="text-xs text-slate-400 line-through">₹{cheapest.mrp}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{med.category}</span>
        {cheapest && (
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-bold">
            Best: {cheapest.platformName}
          </span>
        )}
      </div>

      {med.uses && (
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{med.uses}</p>
      )}

      {/* Platform price pills */}
      {sorted.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {sorted.slice(0, 3).map((p, i) => (
            <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${i === 0 ? 'bg-[#F4A522] text-[#15342C]' : 'bg-slate-100 text-slate-500'}`}>
              {p.platformName?.replace('Apollo Pharmacy','Apollo').replace('Tata 1mg','1mg')} ₹{p.price}
            </span>
          ))}
          {sorted.length > 3 && <span className="text-[10px] text-slate-400 font-medium self-center">+{sorted.length - 3} more</span>}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
        <span className="text-xs text-slate-400">{prices.length} platform{prices.length !== 1 ? 's' : ''}</span>
        <span className="text-xs text-[#F4A522] font-bold group-hover:translate-x-1 transition-transform">Compare prices →</span>
      </div>
    </Link>
  );
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [fromBackend, setFromBackend] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setCategory(CATEGORIES[0]); // reset category on new search
    performSearch(q);
  }, [searchParams]);

  const performSearch = async (q) => {
    setSearching(true);
    setFromBackend(false);
    try {
      const res = await api.get(`/medicines/search?query=${encodeURIComponent(q)}`);
      if (res.data?.length > 0) {
        setResults(res.data);
        setFromBackend(true);
      } else {
        setResults(localSearch(q));
      }
    } catch {
      setResults(localSearch(q));
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
    else navigate('/search');
  };

  // Filter by category — compare against string, not object
  const filtered = category.value === 'All'
    ? results
    : results.filter(m => m.category === category.value);

  return (
    <div className="min-h-screen bg-[#f7f8f9]">
      {/* Search Header */}
      <div className="bg-[#15342C] px-6 pt-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-black text-white font-['Outfit'] mb-4">
            {query ? `Results for "${query}"` : 'Browse Medicines'}
          </h1>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search medicine, generic name, or salt..."
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-5 py-3 focus:outline-none focus:bg-white/20 focus:border-[#F4A522] transition-all font-medium"
            />
            <button type="submit" className="bg-[#F4A522] text-[#15342C] font-black px-6 py-3 rounded-xl hover:bg-[#e09a1e] transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 sticky top-[64px] z-10">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full transition-all ${
                category.value === cat.value
                  ? 'bg-[#15342C] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {searching ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <svg className="animate-spin h-10 w-10 text-[#F4A522]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p className="text-slate-500 font-medium animate-pulse">Scanning prices across platforms...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <p className="text-sm text-slate-500">
                <span className="font-bold text-slate-800">{filtered.length}</span> medicines
                {category.value !== 'All' && <span className="ml-1">in <span className="font-bold text-[#15342C]">{category.label}</span></span>}
                {fromBackend && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Live API</span>}
              </p>
              {category.value !== 'All' && (
                <button onClick={() => setCategory(CATEGORIES[0])} className="text-xs text-slate-400 hover:text-rose-500 font-bold">
                  Clear filter ✕
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-xl font-black text-slate-800 font-['Outfit']">No results in {category.label}</p>
                <p className="text-slate-500 mt-2 text-sm">Try a different category or search term</p>
                <button onClick={() => setCategory(CATEGORIES[0])} className="mt-4 text-[#F4A522] font-bold hover:underline text-sm">
                  Show all medicines →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(med => <MedicineCard key={med.id} med={med} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
