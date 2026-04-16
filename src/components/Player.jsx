import React from 'react';
import { motion } from 'framer-motion';

export default function Player({ playlist, autoplay }) {
  if (!playlist) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-3xl">
        <p className="text-slate-500 font-medium tracking-wide">Select a mood to get a recommendation</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed?listType=playlist&list=${playlist.playlistId}${autoplay ? '&autoplay=1' : ''}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg"
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
      
      <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100">
         <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
           {playlist.name}
         </h2>
         <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
           <span className="text-xs font-semibold text-slate-500 tracking-wider">MOOD MATCH:</span>
           <span className="text-sm font-bold text-teal-700 uppercase">{playlist.mood}</span>
         </div>
         {playlist.reason && (
           <p className="mt-4 text-slate-600 leading-relaxed max-w-3xl bg-white p-4 rounded-xl border border-teal-100">
             <span className="info-icon mr-2">🧠</span> 
             <span className="font-semibold text-teal-800">Ai Recommendation Engine: </span>
             {playlist.reason}
             <br />
             <span className="text-xs text-slate-400 mt-2 block font-medium">
                Features analyzing: Energy: {playlist.energy} | Valence: {playlist.valence} | Tempo: {playlist.tempo}
             </span>
           </p>
         )}
      </div>
    </motion.div>
  );
}
