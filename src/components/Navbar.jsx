import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Navbar() {
  const { user, setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="h-20 w-full flex items-center justify-between px-6 md:px-10 border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-md">
      <div className="flex-1">
        {/* Placeholder for future search/greeting */}
        <h2 className="text-xl font-medium tracking-wide">
          {user ? `Welcome back, ${user.name}` : 'Welcome to Adaptive Player'}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-slate-700">
              <User size={20} className="text-slate-300" />
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-white transition-colors"
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
