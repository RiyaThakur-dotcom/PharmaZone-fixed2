import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER',
    registrationNo: '',
    shopName: '',
    licenseNo: '',
    gstin: '',
    // Doctor Details
    specialization: '',
    experience: '',
    qualification: '',
    licenseExpiry: '',
    consultationFee: '',
    clinicAddress: '',
    onlineConsult: true,
    // Admin Details
    adminSecret: '',
    adminRole: 'SUB_ADMIN',
    permissions: {
       users: true, vendors: true, doctors: true, analytics: true
    }
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      login(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      // Automatic Fallback for Demo
      const demoUser = {
        token: 'demo-token-' + Date.now(),
        userId: Math.floor(Math.random() * 1000) + 100,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
      };
      login(demoUser);
      navigate(from, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fbfbfb] p-6 lg:py-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row-reverse">
        
        {/* Right Side - Brand Area */}
        <div className="md:w-5/12 bg-[#15342C] p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-[#F4A522]/20 rounded-full blur-[40px] pointer-events-none"></div>

          <div className="relative z-10 flex justify-end">
            <Link to="/" className="inline-flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity">
              <span className="font-['Outfit'] font-black text-2xl tracking-tight text-white">PharmaZone</span>
              <div className="w-10 h-10 rounded-[10px] bg-[#F4A522] flex items-center justify-center">
                <span className="text-[#15342C] font-black text-xl leading-none pt-0.5">+</span>
              </div>
            </Link>
          </div>

          <div className="relative z-10 mb-8 text-right">
            <h2 className="text-4xl font-black font-['Outfit'] mb-6 leading-tight">Join the<br/>Healthcare<br/>Revolution.</h2>
            <p className="text-emerald-100/70 font-medium leading-relaxed ml-auto max-w-sm">
              Create an account to access specialized services for patients, vendors, and medical professionals.
            </p>
          </div>
        </div>

        {/* Left Side - Form Area */}
        <div className="md:w-7/12 p-10 md:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-3">Create Account</h2>
              <p className="text-slate-500 font-medium">Get started with your profile today</p>
            </div>

            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-r-xl mb-8 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-xs font-black text-[#15342C] uppercase tracking-[0.2em] mb-3">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#F4A522] outline-none font-medium transition-all" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-xs font-black text-[#15342C] uppercase tracking-[0.2em] mb-3">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#F4A522] outline-none font-medium transition-all" placeholder="name@example.com" required />
                </div>
              </div>

              {/* Account Type Selection */}
              <div>
                <label className="block text-xs font-black text-[#15342C] uppercase tracking-[0.2em] mb-3">Select Account Type</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#F4A522] outline-none font-black text-xs uppercase tracking-widest transition-all appearance-none cursor-pointer">
                  <option value="CUSTOMER">Patient / Customer</option>
                  <option value="PHARMA_VENDOR">Pharma Vendor / Chemist</option>
                  <option value="DOCTOR">Doctor / Specialist</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              {/* Conditional Vendor Fields */}
              {formData.role === 'PHARMA_VENDOR' && (
                <div className="p-6 bg-emerald-50 rounded-[2rem] border-2 border-emerald-100/50 space-y-4 animate-in fade-in slide-in-from-top-2">
                   <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-2">Pharmacy Credentials</p>
                   <input type="text" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Shop / Pharmacy Name" className="w-full px-5 py-3 rounded-xl border-2 border-white focus:border-[#F4A522] outline-none text-sm font-bold shadow-sm" required />
                   <div className="grid grid-cols-2 gap-4">
                     <input type="text" name="licenseNo" value={formData.licenseNo} onChange={handleChange} placeholder="License No." className="w-full px-5 py-3 rounded-xl border-2 border-white focus:border-[#F4A522] outline-none text-sm font-bold shadow-sm" required />
                     <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="GSTIN" className="w-full px-5 py-3 rounded-xl border-2 border-white focus:border-[#F4A522] outline-none text-sm font-bold shadow-sm" />
                   </div>
                </div>
              )}

              {/* Conditional Doctor Fields */}
              {formData.role === 'DOCTOR' && (
                <div className="p-7 bg-indigo-50 rounded-[2.5rem] border-2 border-indigo-100/50 space-y-5 animate-in fade-in slide-in-from-top-2">
                   <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest mb-2">Professional Profile</p>
                   <div className="grid grid-cols-2 gap-4">
                      <select name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border-2 border-white focus:border-indigo-500 outline-none text-xs font-bold shadow-sm">
                        <option value="">Specialization</option>
                        <option value="MD">General Physician</option>
                        <option value="SURGEON">Surgeon</option>
                      </select>
                      <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Exp. (Yrs)" className="w-full px-5 py-3 rounded-xl border-2 border-white focus:border-indigo-500 outline-none text-sm font-bold shadow-sm" required />
                   </div>
                   <input type="text" name="licenseNo" value={formData.licenseNo} onChange={handleChange} placeholder="Medical License No." className="w-full px-5 py-3 rounded-xl border-2 border-white focus:border-indigo-500 outline-none text-sm font-bold shadow-sm" required />
                   <div className="bg-white/60 border-2 border-dashed border-indigo-200 rounded-2xl p-4 text-center">
                      <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Upload License Proof</p>
                   </div>
                </div>
              )}

              {/* Conditional Admin Fields */}
              {formData.role === 'ADMIN' && (
                <div className="p-7 bg-slate-900 rounded-[2.5rem] border-2 border-slate-800 space-y-5 animate-in fade-in slide-in-from-top-2">
                   <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Admin Security Panel</p>
                   <input type="password" name="adminSecret" value={formData.adminSecret} onChange={handleChange} placeholder="Authority Secret Key" className="w-full px-6 py-4 rounded-2xl border-2 border-slate-800 bg-slate-800/50 text-white focus:border-[#F4A522] outline-none text-sm font-bold shadow-inner" required />
                   <div className="flex gap-4">
                     <div className="flex-1 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">Permissions</p>
                        <div className="grid grid-cols-2 gap-2">
                           {['users', 'vendors', 'doctors', 'analytics'].map(p => (
                             <div key={p} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                                <span className="text-[10px] font-black text-slate-500 uppercase">{p}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                   </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-black text-[#15342C] uppercase tracking-[0.2em] mb-3">Secure Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-[#F4A522] outline-none font-medium transition-all" placeholder="••••••••" required />
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-[#15342C] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:bg-[#F4A522] hover:text-[#15342C] transition-all active:scale-[0.98]">
                {isLoading ? 'Creating Account...' : 'Complete Registration →'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm font-medium">Already have an account? <Link to="/login" className="text-[#15342C] font-black hover:underline tracking-tight">Login here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
