import React from 'react';
import { motion } from 'framer-motion';

export default function Player({ playlist, autoplay }) {
  if (!playlist) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-slate-900/50 rounded-3xl border border-slate-800">
        <p className="text-slate-400">Select a mood to get a recommendation</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed?listType=playlist&list=${playlist.playlistId}${autoplay ? '&autoplay=1' : ''}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-slate-900/60 rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl"
    >
      {/* Aspect ratio 16:9 for YouTube */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          title="YouTube video player"
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="p-6 md:p-8 bg-gradient-to-b from-slate-800/40 to-transparent">
         <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
           {playlist.name}
         </h2>
         <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
           <span className="text-xs font-semibold text-slate-300 tracking-wider">MOOD MATCH:</span>
           <span className="text-sm font-bold text-white uppercase">{playlist.mood}</span>
         </div>
         {playlist.reason && (
           <p className="mt-4 text-slate-300 leading-relaxed max-w-3xl glass backdrop-blur-sm p-4 rounded-xl border border-white/5">
             <span className="info-icon mr-2">🧠</span> 
             <span className="font-semibold text-white">Ai Recommendation Engine: </span>
             {playlist.reason}
             <br />
             <span className="text-xs text-slate-400 mt-2 block">
                Features analyzing: Energy: {playlist.energy} | Valence: {playlist.valence} | Tempo: {playlist.tempo}
             </span>
           </p>
         )}
      </div>
    </motion.div>
  );
}
