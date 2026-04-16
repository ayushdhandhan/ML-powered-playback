import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, LogOut, Music, Settings, LayoutDashboard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

import { supabase } from '../utils/supabase';

export default function Navbar() {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 md:px-10 border-b border-slate-200 bg-white/40 backdrop-blur-md relative z-50">
      <div className="flex-1 flex items-center gap-3">
        <Music size={32} className="text-teal-600" />
        <h2 
          className="text-xl md:text-4xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 truncate"
          style={{ fontFamily: "'Bauhaus 93', impact, sans-serif" }}
        >
          Adaptive Listening Engine
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <User size={20} className="text-slate-600" />
            </button>
            
            {showDropdown && (
              <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs text-slate-500 font-medium">Signed in</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{user.email || 'User'}</p>
                </div>
                
                <NavLink 
                  to="/analytics" 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  <LayoutDashboard size={16} /> Analytics
                </NavLink>
                
                <NavLink 
                  to="/settings" 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  <Settings size={16} /> Settings
                </NavLink>
                
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                
                <button 
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink 
            to="/login"
            className="px-5 py-2 rounded-full bg-white text-slate-900 font-medium hover:bg-slate-200 border border-slate-200 shadow-sm transition-colors"
          >
            Sign In
          </NavLink>
        )}
      </div>
    </header>
  );
}
