import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff } from 'lucide-react';

export default function Player({ playlist, autoplay }) {
  const [showVideo, setShowVideo] = useState(false);
  if (!playlist) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-3xl">
        <p className="text-slate-500 font-medium tracking-wide">Select a mood to get a recommendation</p>
      </div>
    );
  }

  // Use videoseries format for YouTube playlist embed (official format)
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlist.playlistId}${autoplay ? '&autoplay=1' : ''}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg"
    >
      {/* Video Toggle Button */}
      <div className="flex items-center justify-between px-6 md:px-8 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Playlist Stream</h3>
        <button
          onClick={() => setShowVideo(!showVideo)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            showVideo
              ? 'bg-teal-100 text-teal-700 border border-teal-300'
              : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
          }`}
        >
          {showVideo ? (
            <>
              <Video size={18} /> Video On
            </>
          ) : (
            <>
              <VideoOff size={18} /> Video Off
            </>
          )}
        </button>
      </div>

      {/* Aspect ratio 16:9 for YouTube */}
      {showVideo ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%', overflow: 'hidden' }}>
          <iframe
            src={embedUrl}
            title="YouTube Playlist Player"
            className="absolute top-0 left-0 w-full h-full border-0"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 50px), 0 100%)' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <VideoOff size={48} className="mb-4 opacity-50" />
            <p className="text-slate-400 font-medium">Video playback disabled</p>
            <p className="text-slate-500 text-sm mt-2">Toggle above to enable</p>
          </div>
        </div>
      )}
      
      <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100">
         <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
           {playlist.name}
         </h2>
         <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
           <span className="text-xs font-semibold text-slate-500 tracking-wider">MOOD-ENERGY MATCH:</span>
           <span className="text-sm font-bold text-teal-700 uppercase">{playlist.mood}</span>
         </div>
         {playlist.reason && (
           <p className="mt-4 text-slate-600 leading-relaxed max-w-3xl bg-white p-4 rounded-xl border border-teal-100">
             <span className="info-icon mr-2">🧠</span> 
             <span className="font-semibold text-teal-800">Adaptive Recommendation Engine:</span>
             <br/>
             <span className="text-sm mt-2 block">{playlist.reason}</span>
             <br />
             <span className="text-xs text-slate-400 mt-2 block font-medium">
                Acoustic Features: Energy {(playlist.energy * 100).toFixed(0)}% | Valence {(playlist.valence * 100).toFixed(0)}% | Tempo {playlist.tempo} BPM
             </span>
           </p>
         )}
      </div>
    </motion.div>
  );
}
