import React from 'react';
import MoodSelector from '../components/MoodSelector';
import { useAppContext } from '../context/AppContext';
import { getPlaylistFromMood } from '../utils/recommendation';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const { mood, setMood, setPlaylist, settings, trackMoodSelection } = useAppContext();
  const navigate = useNavigate();

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

  return (
    <div className="w-full max-w-5xl mx-auto py-10 pt-20 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="mb-8 inline-block px-6 py-3 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-full shadow-sm">
          <p className="text-sm md:text-base font-semibold text-teal-700 tracking-wide">Engine running smooth and ready to groove</p>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-800 drop-shadow-sm">
          What are we <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500 animate-pulse">feeling today?</span>
        </h1>
        <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">
          Express how you're feeling and let's get this party started.
        </p>
      </motion.div>

      <MoodSelector onSelectMood={handleMoodSelect} currentMood={mood} />
    </div>
  );
}
