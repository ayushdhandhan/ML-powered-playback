import React from 'react';
import { NavLink } from 'react-router-dom';
import { Music, Filter, Heart, Settings, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Player', path: '/player', icon: Music },
    { name: 'Recommendations', path: '/recommendations', icon: Filter },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 flex flex-col pt-6">
      <div className="flex items-center justify-center md:justify-start md:px-6 mb-10">
        <div className="bg-gradient-to-tr from-purple-500 to-blue-500 p-2 rounded-xl text-white">
          <Music size={24} />
        </div>
        <span className="ml-3 hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Adaptive
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >
              <Icon size={20} className="md:mr-3 mx-auto md:mx-0 group-hover:scale-110 transition-transform" />
              <span className="hidden md:block font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
