import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, LogOut, Music } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

import { supabase } from '../utils/supabase';

export default function Navbar() {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 md:px-10 border-b border-slate-200 bg-white/40 backdrop-blur-md">
      <div className="flex-1 flex items-center gap-3">
        <Music size={32} className="text-teal-600" />
        <h2 
          className="text-3xl md:text-4xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600"
          style={{ fontFamily: "'Bauhaus 93', impact, sans-serif" }}
        >
          Music Reco
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 border border-slate-200">
              <User size={20} className="text-slate-600" />
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:text-slate-800 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <NavLink 
            to="/login"
            className="px-5 py-2 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-200 transition-colors"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
}
