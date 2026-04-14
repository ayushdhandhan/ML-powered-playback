import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { settings, setSettings } = useAppContext();

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
          Settings
        </h1>
        <p className="text-slate-400 text-lg">Customize your Adaptive Player experience.</p>
      </div>

      <div className="space-y-6">
        {/* Toggle Option 1 */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-md flex items-center justify-between">
           <div>
             <h3 className="text-xl font-semibold text-white">Autoplay Recommendations</h3>
             <p className="text-slate-400 text-sm mt-1">Automatically start playing when a playlist is recommended.</p>
           </div>
           <button 
             onClick={() => toggleSetting('autoplay')}
             className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.autoplay ? 'bg-green-500' : 'bg-slate-700'}`}
           >
             <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.autoplay ? 'translate-x-6' : 'translate-x-0'}`}></div>
           </button>
        </div>

        {/* Toggle Option 2 */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 backdrop-blur-md flex items-center justify-between">
           <div>
             <h3 className="text-xl font-semibold text-white">Enable Smart Recommendations</h3>
             <p className="text-slate-400 text-sm mt-1">Use AI-logic to immediately select a playlist after mood input.</p>
           </div>
           <button 
             onClick={() => toggleSetting('recommendations')}
             className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.recommendations ? 'bg-green-500' : 'bg-slate-700'}`}
           >
             <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.recommendations ? 'translate-x-6' : 'translate-x-0'}`}></div>
           </button>
        </div>
      </div>
    </div>
  );
}
