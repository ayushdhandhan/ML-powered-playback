import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
  const { settings } = useAppContext();
  const { setSettings: updateSettings } = useAppContext();

  const toggleSetting = (key) => {
    updateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
          Personalization Settings
        </h1>
        <p className="text-slate-600 text-lg">Configure your adaptive recommendation engine and listening behavior patterns.</p>
      </div>

      <div className="space-y-6">
        {/* Toggle Option 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <h3 className="text-xl font-semibold text-slate-800">Autoplay Acceleration</h3>
             <p className="text-slate-500 text-sm mt-1">Enable automatic playback initiation when recommendations are selected. Improves behavioral flow optimization.</p>
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
             <h3 className="text-xl font-semibold text-slate-800">Smart Recommendations</h3>
             <p className="text-slate-500 text-sm mt-1">Leverage mood-energy feature mapping and temporal listening trends for personalized playlist selection.</p>
           </div>
           <button 
             onClick={() => toggleSetting('recommendations')}
             className={`w-14 h-8 rounded-full p-1 transition-colors border shadow-inner ${settings.recommendations ? 'bg-teal-500 border-teal-600' : 'bg-slate-200 border-slate-300'}`}
           >
             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${settings.recommendations ? 'translate-x-6' : 'translate-x-0'}`}></div>
           </button>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100 mt-8">
          <h3 className="font-semibold text-teal-900 mb-2">🧠 Behavioral Analysis Active</h3>
          <p className="text-teal-800 text-sm">Your listening patterns are being analyzed in real-time. The adaptive engine uses mood frequency, temporal trends, and feature vectors to optimize recommendations.</p>
        </div>
      </div>
    </div>
  );
}
