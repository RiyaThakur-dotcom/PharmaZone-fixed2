import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      login(response.data);
      navigate(from, { replace: true });
    } catch (err) {
      // Backend is down → demo mode: create a local session
      if (!err.response) {
        const demoUser = {
          token: 'demo-token-' + Date.now(),
          userId: '101',
          fullName: formData.email.split('@')[0],
          email: formData.email,
          role: 'CUSTOMER',
        };
        login(demoUser);
        navigate(from, { replace: true });
        return;
      }
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fbfbfb] p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Deep Green Brand Area */}
        <div className="md:w-5/12 bg-[#15342C] p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Abstract blobs */}
          <div className="absolute top-[-20%] left-[-20%] w-64 h-64 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-[#F4A522]/20 rounded-full blur-[40px] pointer-events-none"></div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-[10px] bg-[#F4A522] flex items-center justify-center">
                <span className="text-[#15342C] font-black text-xl leading-none pt-0.5">+</span>
              </div>
              <span className="font-['Outfit'] font-black text-2xl tracking-tight text-white">
                PharmaZone
              </span>
            </Link>
          </div>

          <div className="relative z-10 mb-8">
            <h2 className="text-4xl font-black font-['Outfit'] mb-6 leading-tight">Compare.<br/>Save.<br/>Heal.</h2>
            <p className="text-emerald-100/70 font-medium font-['Inter'] leading-relaxed max-w-sm">
              Access real-time inventory from over 120+ pharmacies and unlock exclusive generic alternatives with your account.
            </p>
          </div>
        </div>

        {/* Right Side - Form Area */}
        <div className="md:w-7/12 p-10 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black text-[#15342C] font-['Outfit'] mb-3">Welcome Back</h2>
              <p className="text-slate-500 font-medium font-['Inter']">Sign in to your PharmaZone account</p>
            </div>

            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 p-4 rounded-r-xl mb-8 font-medium text-sm flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 transition-all duration-300 focus:bg-white focus:border-[#F4A522] focus:ring-0 outline-none font-['Inter'] font-medium"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-[#15342C] font-['Outfit'] tracking-wide">
                    Password
                  </label>
                  <a href="#" className="text-xs font-bold text-[#F4A522] hover:text-[#F39C12] transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-11 pr-5 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 transition-all duration-300 focus:bg-white focus:border-[#F4A522] focus:ring-0 outline-none font-['Inter'] font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-[#15342C] text-white hover:bg-[#F4A522] hover:text-[#15342C] transition-all duration-300 py-4 rounded-xl font-black tracking-widest font-['Outfit'] flex items-center justify-center uppercase shadow-lg shadow-[#15342C]/10 hover:shadow-[#F4A522]/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-500 font-['Inter']">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#15342C] font-bold hover:text-[#F4A522] transition-colors">
                Create one now
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
