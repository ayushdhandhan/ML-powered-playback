import React from 'react';
import { NavLink } from 'react-router-dom';
import { Music, Filter, Heart, Settings, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Player', path: '/player', icon: Music },
    { name: 'Recommendations', path: '/recommendations', icon: Filter },
    { name: 'Favorites', path: '/favorites', icon: Heart },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full h-[72px] md:static md:w-64 md:h-full bg-white/95 md:bg-white/50 backdrop-blur-xl border-t md:border-t-0 md:border-r border-slate-200 flex flex-row md:flex-col md:pt-6 z-50 md:z-10 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] md:shadow-sm">
      <div className="hidden md:flex items-center justify-start px-6 mb-10">
        <div className="bg-gradient-to-tr from-teal-400 to-blue-500 p-2 rounded-xl text-white shadow-md">
          <Music size={24} />
        </div>
        <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
          Adaptive
        </span>
      </div>

      <nav className="flex-1 flex flex-row md:flex-col justify-around md:justify-start items-center md:items-stretch gap-1 md:gap-2 px-2 md:px-3 w-full h-full md:h-auto md:w-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col md:flex-row items-center justify-center md:justify-start px-2 py-1 md:px-3 md:py-3 rounded-xl transition-all duration-300 group flex-1 md:flex-none h-full md:h-auto ${
                  isActive 
                    ? 'text-teal-700 md:bg-teal-50 md:border md:border-teal-200 md:shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`
              }
            >
              <Icon size={22} className={`md:mr-3 group-hover:scale-110 transition-transform mb-1 md:mb-0`} />
              <span className="text-[10px] sm:text-[11px] leading-tight md:text-base font-semibold md:font-medium tracking-tight text-center md:text-left truncate w-full md:w-auto">
                {item.name === 'Recommendations' ? <span className="md:hidden">Reco</span> : null}
                {item.name === 'Recommendations' ? <span className="hidden md:inline">Recommendations</span> : null}
                {item.name !== 'Recommendations' ? item.name : null}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
