import React from 'react';
import { Play, Heart, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function PlaylistCard({ playlist }) {
  const { isFavorite, toggleFavorite, setPlaylist } = useAppContext();
  const navigate = useNavigate();
  const favorite = isFavorite(playlist.playlistId);

  const handlePlay = () => {
    setPlaylist(playlist);
    navigate('/player');
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 backdrop-blur-md relative group overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-500/10 to-transparent blur-xl pointer-events-none" />
      
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider text-purple-300">
            {playlist.mood}
          </span>
          <h3 className="text-xl font-bold mt-4 text-white group-hover:text-purple-300 transition-colors">
            {playlist.name}
          </h3>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            {playlist.description}
          </p>
          {playlist.reason && (
             <p className="text-blue-300 text-xs mt-3 italic bg-blue-900/30 p-2 rounded-lg border border-blue-500/20">
               {playlist.reason}
             </p>
          )}
        </div>
        
        <button 
          onClick={() => toggleFavorite(playlist)}
          className={`p-2 rounded-full transition-all ${favorite ? 'bg-pink-500/20 text-pink-500' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
        >
          <Heart size={20} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-8 flex gap-3 relative z-10">
        <button 
          onClick={handlePlay}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 py-3 rounded-xl font-medium shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
        >
          <Play size={18} fill="currentColor" /> Play Now
        </button>
      </div>
    </motion.div>
  );
}
