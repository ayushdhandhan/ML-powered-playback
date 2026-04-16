import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Play, Pause, SkipBack, SkipForward, Volume2, Repeat } from 'lucide-react';

export default function Player({ playlist, autoplay }) {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [repeatMode, setRepeatMode] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('3:30');

  // Simulate playback when video is off
  useEffect(() => {
    if (!isPlaying || showVideo) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (repeatMode === 2) {
            return 0; // Repeat current song
          } else if (repeatMode === 1) {
            setProgress(0);
            return 0; // Repeat all
          }
          setIsPlaying(false);
          return 100;
        }
        return prev + 0.5;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying, showVideo, repeatMode]);

  // Update time display
  useEffect(() => {
    const totalSeconds = 210; // 3:30
    const currentSeconds = (progress / 100) * totalSeconds;
    const mins = Math.floor(currentSeconds / 60);
    const secs = Math.floor(currentSeconds % 60);
    setCurrentTime(`${mins}:${secs.toString().padStart(2, '0')}`);
  }, [progress]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    setProgress(prev => Math.min(prev + 20, 100));
  };

  const handleSkipBack = () => {
    setProgress(prev => Math.max(prev - 10, 0));
  };

  const handleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const handleProgressChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, percent)));
  };

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };

  if (!playlist) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-3xl">
        <p className="text-slate-500 font-medium tracking-wide">Select a mood to get a recommendation</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlist.playlistId}${autoplay ? '&autoplay=1' : ''}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${playlist.firstVideoId}/maxresdefault.jpg`;

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
      <div className="relative w-full bg-slate-900" style={{ paddingBottom: '56.25%' }}>
        {/* YouTube iframe when video is ON */}
        {showVideo && (
          <iframe
            src={embedUrl}
            title="YouTube Playlist Player"
            className="absolute w-full h-full border-0"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 50px), 0 100%)' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}

        {/* Audio Player UI - Show when video is OFF */}
        {!showVideo && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-6 py-12">
            {/* Album Art - YouTube Video Thumbnail */}
            <div className="mb-8 w-48 h-48 rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-700">
              <img 
                src={thumbnailUrl}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Song Info */}
            <h3 className="text-2xl font-bold text-white text-center mb-2">{playlist.name}</h3>
            <p className="text-slate-400 text-center mb-8">{playlist.description}</p>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mb-6">
              <div 
                className="flex items-center gap-3 mb-2 cursor-pointer"
                onClick={handleProgressChange}
              >
                <span className="text-xs text-slate-400 font-medium">{currentTime}</span>
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden hover:h-2 transition-all cursor-pointer group">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full transition-all relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-medium">{duration}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <button 
                onClick={handleRepeat}
                className={`transition-all hover:scale-110 ${
                  repeatMode === 0 
                    ? 'text-slate-400' 
                    : repeatMode === 1
                    ? 'text-teal-400'
                    : 'text-blue-400'
                }`}
                title={`Repeat: ${repeatMode === 0 ? 'Off' : repeatMode === 1 ? 'All' : 'One'}`}
              >
                <Repeat size={22} />
              </button>
              <button 
                onClick={handleSkipBack}
                className="text-slate-400 hover:text-white transition-all hover:scale-110 active:scale-95"
                title="Skip back 10 seconds"
              >
                <SkipBack size={26} />
              </button>
              <button 
                onClick={handlePlayPause}
                className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all transform hover:scale-110 active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={32} fill="white" />
                ) : (
                  <Play size={32} fill="white" className="ml-1" />
                )}
              </button>
              <button 
                onClick={handleSkipForward}
                className="text-slate-400 hover:text-white transition-all hover:scale-110 active:scale-95"
                title="Skip forward 15 seconds"
              >
                <SkipForward size={26} />
              </button>
              <button 
                className="text-slate-400 hover:text-white transition-all hover:scale-110 relative group"
                title={`Volume: ${volume}%`}
              >
                <Volume2 size={22} />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {volume}%
                </div>
              </button>
            </div>

            {/* Volume Slider */}
            <div className="w-full max-w-xs mb-6">
              <div className="flex items-center gap-3">
                <Volume2 size={16} className="text-slate-400" />
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer accent-teal-500 hover:accent-teal-400"
                  title="Adjust volume"
                />
                <span className="text-xs text-slate-400 w-8 text-right">{volume}%</span>
              </div>
            </div>

            {/* Mood Badge */}
            <div className="mt-4 px-4 py-2 rounded-full bg-slate-700/50 border border-slate-600">
              <p className="text-xs text-slate-300 tracking-wider">MOOD-ENERGY MATCH: <span className="font-bold text-teal-400">{playlist.mood.toUpperCase()}</span></p>
            </div>
          </div>
        )}
      </div>
      
      {/* Playlist Info */}
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
