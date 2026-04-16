import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Play, Pause, SkipBack, SkipForward, Volume2, Repeat } from 'lucide-react';

export default function Player({ playlist, autoplay }) {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);
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

      {/* Aspect ratio 16:9 for YouTube - Always in DOM, hidden when video is off */}
      <div className="relative w-full bg-slate-900" style={{ paddingBottom: '56.25%' }}>
        {/* Hidden YouTube iframe running in background */}
        <div style={{ display: showVideo ? 'block' : 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <iframe
            src={embedUrl}
            title="YouTube Playlist Player"
            className="w-full h-full border-0"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 50px), 0 100%)' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Audio Player UI - Show when video is OFF */}
        {!showVideo && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-6 py-12">
            {/* Album Art - Playlist Thumbnail */}
            <div className="mb-8 w-48 h-48 rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-700">
              <img 
                src={playlist.thumbnail || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop'} 
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Song Info */}
            <h3 className="text-2xl font-bold text-white text-center mb-2">{playlist.name}</h3>
            <p className="text-slate-400 text-center mb-8">{playlist.description}</p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-slate-400">0:45</span>
                <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-400">3:30</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-6">
              <button className="text-slate-400 hover:text-white transition-colors">
                <Repeat size={20} />
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <SkipBack size={24} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-lg transition-all transform hover:scale-105"
              >
                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <SkipForward size={24} />
              </button>
              <button className="text-slate-400 hover:text-white transition-colors">
                <Volume2 size={20} />
              </button>
            </div>

            {/* Mood Badge */}
            <div className="mt-8 px-4 py-2 rounded-full bg-slate-700/50 border border-slate-600">
              <p className="text-xs text-slate-300 tracking-wider">MOOD-ENERGY MATCH: <span className="font-bold text-teal-400">{playlist.mood.toUpperCase()}</span></p>
            </div>
          </div>
        )}
      </div>
      
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
