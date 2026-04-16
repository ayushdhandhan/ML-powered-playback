import React from 'react';
import { Play, Heart, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function PlaylistCard({ playlist }) {
  const { isFavorite, toggleFavorite, setPlaylist, trackMoodSelection } = useAppContext();
  const navigate = useNavigate();
  const favorite = isFavorite(playlist.playlistId);

  const handlePlay = () => {
    trackMoodSelection(playlist.mood);
    setPlaylist(playlist);
    navigate(`/player?mood=${playlist.mood.toLowerCase()}`);
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-teal-500/5 to-transparent blur-xl pointer-events-none" />
      
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-600">
            {playlist.mood}
          </span>
          <h3 className="text-xl font-bold mt-4 text-slate-800 group-hover:text-teal-600 transition-colors">
            {playlist.name}
          </h3>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            {playlist.description}
          </p>
          {playlist.reason && (
             <p className="text-teal-700 text-xs mt-3 italic bg-teal-50 p-2 rounded-lg border border-teal-100">
               {playlist.reason}
             </p>
          )}
        </div>
        
        <button 
          onClick={() => toggleFavorite(playlist)}
          className={`p-2 rounded-full transition-all ${favorite ? 'bg-pink-100 text-pink-500' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
        >
          <Heart size={20} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-8 flex gap-3 relative z-10">
        <button 
          onClick={handlePlay}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white hover:bg-slate-700 py-3 rounded-xl font-medium shadow-md transition-all"
        >
          <Play size={18} fill="currentColor" /> Play Now
        </button>
      </div>
    </motion.div>
  );
}
