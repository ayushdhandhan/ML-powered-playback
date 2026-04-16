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
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
          Settings
        </h1>
        <p className="text-slate-600 text-lg">Customize your Adaptive Player experience.</p>
      </div>

      <div className="space-y-6">
        {/* Toggle Option 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <h3 className="text-xl font-semibold text-slate-800">Autoplay Recommendations</h3>
             <p className="text-slate-500 text-sm mt-1">Automatically start playing when a playlist is recommended.</p>
           </div>
           <button 
             onClick={() => toggleSetting('autoplay')}
             className={`w-14 h-8 rounded-full p-1 transition-colors border shadow-inner ${settings.autoplay ? 'bg-teal-500 border-teal-600' : 'bg-slate-200 border-slate-300'}`}
           >
             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.autoplay ? 'translate-x-6' : 'translate-x-0'}`}></div>
           </button>
        </div>

        {/* Toggle Option 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <h3 className="text-xl font-semibold text-slate-800">Enable Smart Recommendations</h3>
             <p className="text-slate-500 text-sm mt-1">Use AI-logic to immediately select a playlist after mood input.</p>
           </div>
           <button 
             onClick={() => toggleSetting('recommendations')}
             className={`w-14 h-8 rounded-full p-1 transition-colors border shadow-inner ${settings.recommendations ? 'bg-teal-500 border-teal-600' : 'bg-slate-200 border-slate-300'}`}
           >
             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.recommendations ? 'translate-x-6' : 'translate-x-0'}`}></div>
           </button>
        </div>
      </div>
    </div>
  );
}
