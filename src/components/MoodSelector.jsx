import React from 'react';
import { motion } from 'framer-motion';

export default function MoodSelector({ onSelectMood, currentMood }) {
  const moods = [
    { name: 'Happy', emoji: '😊', color: 'from-yellow-400 to-orange-500', shadow: 'shadow-orange-500/50' },
    { name: 'Sad', emoji: '😔', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-indigo-500/50' },
    { name: 'Energetic', emoji: '⚡', color: 'from-red-500 to-pink-600', shadow: 'shadow-pink-500/50' },
    { name: 'Chill', emoji: '😌', color: 'from-teal-400 to-emerald-500', shadow: 'shadow-emerald-500/50' },
    { name: 'Focus', emoji: '🧠', color: 'from-indigo-400 to-purple-600', shadow: 'shadow-purple-500/50' },
    { name: 'Party', emoji: '🎉', color: 'from-fuchsia-500 to-rose-600', shadow: 'shadow-rose-500/50' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8">
      {moods.map((mood, idx) => {
        const isSelected = currentMood === mood.name;
        
        return (
          <motion.button
            key={mood.name}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelectMood(mood.name)}
            className={`
              relative flex flex-col items-center justify-center p-6 md:p-10 rounded-3xl 
              border border-white/10 backdrop-blur-md overflow-hidden group transition-all
              ${isSelected ? 'ring-2 ring-white scale-105' : 'hover:border-white/30'}
            `}
          >
            {/* Background Gradient Fill (animated) */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${mood.color}
              ${isSelected ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}
              transition-opacity duration-500
            `} />
            
            <span className="text-4xl md:text-6xl mb-4 drop-shadow-lg filter group-hover:scale-110 transition-transform duration-300">
              {mood.emoji}
            </span>
            <span className="text-lg md:text-xl font-semibold tracking-wide z-10 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 transition-all">
              {mood.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
