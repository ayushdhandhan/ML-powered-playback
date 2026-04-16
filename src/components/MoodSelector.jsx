import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import playlists from '../data/playlists.json';

export default function MoodSelector({ onSelectMood, currentMood }) {
  const moods = [
    { name: 'Happy', emoji: '😊', color: 'from-amber-100 to-orange-200' },
    { name: 'Sad', emoji: '😔', color: 'from-blue-100 to-indigo-200' },
    { name: 'Energetic', emoji: '⚡', color: 'from-rose-100 to-pink-200' },
    { name: 'Chill', emoji: '😌', color: 'from-teal-100 to-emerald-200' },
    { name: 'Focus', emoji: '🧠', color: 'from-indigo-100 to-purple-200' },
    { name: 'Party', emoji: '🎉', color: 'from-fuchsia-100 to-rose-200' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
      {moods.map((mood, idx) => {
        const isSelected = currentMood === mood.name;
        const playlistData = playlists.find(p => p.mood === mood.name) || {};
        
        return (
          <motion.div
            key={mood.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`
              relative flex flex-col p-6 rounded-3xl 
              border bg-white shadow-sm hover:shadow-md transition-shadow
              ${isSelected ? 'ring-2 ring-teal-500 border-transparent' : 'border-slate-200'}
            `}
          >
            {/* Background Gradient Fill (animated) */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${mood.color} rounded-3xl
              ${isSelected ? 'opacity-30' : 'opacity-10'}
              transition-opacity duration-500 pointer-events-none
            `} />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <span className="text-4xl filter drop-shadow-sm">
                {mood.emoji}
              </span>
              <h3 className="text-xl font-bold tracking-wide text-slate-800">
                {mood.name}
              </h3>
            </div>
            
            <div className="relative z-10 flex-grow">
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                {playlistData.description || "Curated playlist for this mood."}
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400 font-medium uppercase">Energy</div>
                  <div className="text-sm font-bold text-slate-700">{playlistData.energy || 'N/A'}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 text-center">
                  <div className="text-xs text-slate-400 font-medium uppercase">Valence</div>
                  <div className="text-sm font-bold text-slate-700">{playlistData.valence || 'N/A'}</div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => onSelectMood(mood.name)}
              className="relative z-10 w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-medium shadow-md transition-colors"
            >
              <Play size={18} fill="currentColor" /> Play Now
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
