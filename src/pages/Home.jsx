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
        setTimeout(() => navigate('/player'), 600); // give time for animation
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
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white drop-shadow-xl">
          How are you feeling <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 animate-pulse">today?</span>
        </h1>
        <p className="text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
          Select your mood, and our intelligent recommendation engine will curate the perfect soundtrack for your moment using advanced feature matching.
        </p>
      </motion.div>

      <MoodSelector onSelectMood={handleMoodSelect} currentMood={mood} />
    </div>
  );
}
