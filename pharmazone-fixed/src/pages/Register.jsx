import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      login(response.data);
      navigate('/');
    } catch (err) {
      // If backend is down → demo mode: simulate successful registration
      if (!err.response) {
        const demoUser = {
          token: 'demo-token-' + Date.now(),
          userId: Math.floor(Math.random() * 1000) + 100,
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
        };
        login(demoUser);
        navigate('/');
        return;
      }
      // Backend is running but returned an error (e.g. email already exists)
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fbfbfb] p-6 lg:py-12">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row-reverse">
        
        {/* Right Side - Deep Green Brand Area */}
        <div className="md:w-5/12 bg-[#15342C] p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-[#F4A522]/20 rounded-full blur-[40px] pointer-events-none"></div>

          <div className="relative z-10 flex justify-end">
            <Link to="/" className="inline-flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity">
              <span className="font-['Outfit'] font-black text-2xl tracking-tight text-white">
                PharmaZone
              </span>
              <div className="w-10 h-10 rounded-[10px] bg-[#F4A522] flex items-center justify-center">
                <span className="text-[#15342C] font-black text-xl leading-none pt-0.5">+</span>
              </div>
            </Link>
          </div>

          <div className="relative z-10 mb-8 text-right">
            <h2 className="text-4xl font-black font-['Outfit'] mb-6 leading-tight">Join the<br/>Healthcare<br/>Revolution.</h2>
            <p className="text-emerald-100/70 font-medium font-['Inter'] leading-relaxed ml-auto max-w-sm">
              Create a free account to track your orders, manage prescriptions, and unlock exclusive discounts across 80+ cities.
            </p>
          </div>
        </div>

        {/* Left Side - Form Area */}
        <div className="md:w-7/12 p-10 md:p-14 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-3">Create Account</h2>
              <p className="text-slate-500 font-medium font-['Inter']">Fill in your details to get started</p>
            </div>

            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-r-xl mb-8 font-medium text-sm flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#15342C] mb-2 font-['Outfit'] tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-11 pr-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 transition-all duration-300 focus:bg-white focus:border-[#F4A522] focus:ring-0 outline-none font-['Inter'] font-medium"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#15342C] mb-2 font-['Outfit'] tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 transition-all duration-300 focus:bg-white focus:border-[#F4A522] focus:ring-0 outline-none font-['Inter'] font-medium"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#15342C] mb-2 font-['Outfit'] tracking-wide">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 transition-all duration-300 focus:bg-white focus:border-[#F4A522] focus:ring-0 outline-none font-['Inter'] font-medium"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#15342C] mb-2 font-['Outfit'] tracking-wide">
                  Account Type
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-5 pr-10 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 transition-all duration-300 focus:bg-white focus:border-[#F4A522] focus:ring-0 outline-none font-['Inter'] font-medium appearance-none"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="PHARMA_VENDOR">Pharma Vendor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#15342C] mb-2 font-['Outfit'] tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-5 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 transition-all duration-300 focus:bg-white focus:border-[#F4A522] focus:ring-0 outline-none font-['Inter'] font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-[#F4A522] text-[#15342C] hover:bg-[#F39C12] transition-all duration-300 py-3.5 rounded-xl font-black tracking-widest font-['Outfit'] flex items-center justify-center uppercase shadow-[0_4px_15px_rgba(244,165,34,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#15342C]" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Creating...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-500 font-['Inter']">
              Already have an account?{' '}
              <Link to="/login" className="text-[#15342C] font-bold hover:text-[#F4A522] transition-colors">
                Sign in here
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
