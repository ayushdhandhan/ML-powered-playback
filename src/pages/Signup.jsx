import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { motion } from 'framer-motion';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Account created! You may now sign in.");
      // Depending on Supabase settings, email confirmation might be required.
      // If it auto-logins, onAuthStateChange handles the rest.
      setTimeout(() => navigate('/login'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] px-4 sm:px-0 flex items-center justify-center py-10 md:py-0 mb-10 md:mb-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white/90 rounded-[2rem] border border-orange-100 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(249,115,22,0.15)] flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Graphics Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-50 to-orange-100/50 flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden">
           {/* Decorative background note */}
           <img 
             src="/music_icon.png" 
             alt="Music Note" 
             className="w-48 h-48 absolute -top-10 -left-10 opacity-30 mix-blend-multiply -rotate-12 blur-[2px]" 
           />
           <img 
             src="/music_icon.png" 
             alt="Music Note" 
             className="w-32 h-32 absolute -bottom-8 right-8 opacity-20 mix-blend-multiply rotate-12 blur-[1px]" 
           />
           
           <h3 className="text-2xl font-bold text-orange-600 mb-6 relative z-10 text-center">Join The Vibe</h3>
           
           <img 
             src="/retro.png" 
             alt="Retro Boombox" 
             className="w-full max-w-[280px] object-cover rounded-3xl shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500 scale-x-[-1]" 
           />
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <h2 className="text-3xl font-extrabold mb-8 text-center text-slate-800 tracking-tight">Create Account</h2>
          
          {errorMsg && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {errorMsg}
            </div>
          )}
          
          {successMsg && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 flex-1">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-orange-50/50 border border-orange-200 rounded-xl px-4 py-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all font-medium"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-orange-50/50 border border-orange-200 rounded-xl px-4 py-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all font-medium"
                placeholder="•••••••• (Min 6 characters)"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-orange-500 py-4 rounded-xl font-bold text-lg text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:shadow-orange-500/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            Already have an account? <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
