import React, { useState } from 'react';
import MoodSelector from '../components/MoodSelector';
import { useAppContext } from '../context/AppContext';
import { getPlaylistFromMood } from '../utils/recommendation';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function Home() {
  const { mood, setMood, setPlaylist, settings, trackMoodSelection } = useAppContext();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    trackMoodSelection(selectedMood); // Track frequency
    if (settings.recommendations) {
      const match = getPlaylistFromMood(selectedMood);
      if (match) {
        setPlaylist(match);
        setTimeout(() => navigate(`/player?mood=${selectedMood.toLowerCase()}`), 600); // give time for animation
      }
    }
  };

  const mapInputToMood = (input) => {
    const text = input.toLowerCase();
    if (text.includes('happy') || text.includes('good') || text.includes('great') || text.includes('joy') || text.includes('excellent')) return 'Happy';
    if (text.includes('sad') || text.includes('cry') || text.includes('down') || text.includes('bad') || text.includes('lonely') || text.includes('depressed')) return 'Sad';
    if (text.includes('energetic') || text.includes('pumped') || text.includes('workout') || text.includes('gym') || text.includes('hype')) return 'Energetic';
    if (text.includes('chill') || text.includes('relax') || text.includes('calm') || text.includes('peace') || text.includes('tired')) return 'Chill';
    if (text.includes('focus') || text.includes('study') || text.includes('work') || text.includes('concentrate')) return 'Focus';
    if (text.includes('party') || text.includes('dance') || text.includes('lit') || text.includes('fun') || text.includes('wild') || text.includes('crazy')) return 'Party';
    
    // Default fallback - pick a positive/neutral mood randomly if not caught
    const moods = ['Happy', 'Chill', 'Focus'];
    return moods[Math.floor(Math.random() * moods.length)];
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const mappedMood = mapInputToMood(inputText);
    handleMoodSelect(mappedMood);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-10 pt-20 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 w-full px-4"
      >
        <div className="mb-8 inline-block px-6 py-3 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-full shadow-sm">
          <p className="text-sm md:text-base font-semibold text-teal-700 tracking-wide">🎵 Engine running smooth and ready to groove</p>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-800 drop-shadow-sm">
          What are we <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500 animate-pulse">feeling today?</span>
        </h1>
        <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed mb-10">
          Express how you're feeling and let's get this party started.
        </p>

        {/* Free-text input box */}
        <form onSubmit={handleInputSubmit} className="max-w-xl mx-auto relative group mb-12">
           <input 
             type="text"
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="I'm feeling super pumped for my workout..."
             className="w-full pl-6 pr-14 py-4 md:py-5 rounded-[2rem] border-2 border-teal-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-50 transition-all font-medium"
           />
           <button 
             type="submit"
             disabled={!inputText.trim()}
             className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 hover:shadow-lg hover:shadow-teal-500/30 hover:scale-105 active:scale-95 transition-all shadow-md group-focus-within:shadow-teal-200/50 cursor-pointer"
           >
             <Search size={22} className="ml-0.5" />
           </button>
        </form>

        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-16 bg-slate-200"></div>
          <span className="text-sm text-slate-400 font-medium uppercase tracking-widest">Or choose a vibe</span>
          <div className="h-px w-16 bg-slate-200"></div>
        </div>

      </motion.div>

      <MoodSelector onSelectMood={handleMoodSelect} currentMood={mood} />
    </div>
  );
}
