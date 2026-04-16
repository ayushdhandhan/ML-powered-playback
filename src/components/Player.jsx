import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Heart } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { supabase } from '../utils/supabase';

let globalPlayer = null;

export default function Player({ playlist, autoplay }) {
  const { user } = useContext(AppContext);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [repeatMode, setRepeatMode] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [currentVideoId, setCurrentVideoId] = useState(playlist?.firstVideoId || '');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [favorites, setFavorites] = useState([]);
  
  const playerContainerRef = useRef(null);
  const pollingRef = useRef(null);
  const playerRef = useRef(null);

  // Load favorites from Supabase
  useEffect(() => {
    if (!user?.id) return;
    
    const loadFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        if (data) {
          // Only include song favorites (those with video_id)
          const songFavs = data
            .filter(fav => fav.video_id && fav.video_id.trim() !== '')
            .map(fav => `${fav.video_id}-${fav.video_title}`);
          console.log('Loaded song favorites:', songFavs);
          setFavorites(songFavs);
        }
      } catch (err) {
        console.warn('Error loading favorites:', err);
      }
    };
    
    loadFavorites();
  }, [user?.id]);

  // Load and initialize YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (!playerRef.current && playerContainerRef.current) {
      initPlayer();
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Update thumbnail when video changes
  useEffect(() => {
    if (currentVideoId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`);
    }
  }, [currentVideoId]);

  const initPlayer = () => {
    if (!playerRef.current && playerContainerRef.current && window.YT) {
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: '',
        width: '100%',
        height: '100%',
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        }
      });
      globalPlayer = playerRef.current;
    }
  };

  const onPlayerReady = (event) => {
    if (playlist?.playlistId && autoplay) {
      event.target.loadPlaylist({
        list: playlist.playlistId,
        listType: 'playlist',
        index: 0,
      });
      event.target.setVolume(volume);
    }
  };

  const onPlayerStateChange = (event) => {
    const YT = window.YT;
    
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startPolling();
    } else if (event.data === YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      stopPolling();
    } else if (event.data === YT.PlayerState.ENDED) {
      setIsPlaying(false);
      stopPolling();
      if (repeatMode === 2) {
        event.target.playVideo();
      }
    }

    // Update thumbnail when video changes
    try {
      const videoData = event.target.getVideoData();
      if (videoData?.video_id) {
        setCurrentVideoId(videoData.video_id);
        setCurrentVideoTitle(videoData.title || 'Now Playing');
      }
    } catch (e) {
      console.warn('Could not get video data');
    }
  };

  const onPlayerError = (event) => {
    console.warn('YouTube player error:', event.data);
  };

  const startPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        try {
          const current = playerRef.current.getCurrentTime();
          const dur = playerRef.current.getDuration();
          if (dur > 0) {
            setProgress((current / dur) * 100);
            setCurrentTime(formatTime(current));
            setDuration(formatTime(dur));
          }
        } catch (e) {
          // Silently handle polling errors
        }
      }
    }, 500);
  };

  const stopPolling = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSkipForward = () => {
    if (!playerRef.current?.nextVideo) return;
    playerRef.current.nextVideo();
  };

  const handleSkipBack = () => {
    if (!playerRef.current?.previousVideo) return;
    playerRef.current.previousVideo();
  };

  const handleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const handleProgressChange = (e) => {
    if (!playerRef.current?.seekTo || !playerRef.current?.getDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    const duration = playerRef.current.getDuration();
    const seekTime = (percent / 100) * duration;
    playerRef.current.seekTo(seekTime, true);
  };

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (playerRef.current?.setVolume) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const toggleFavorite = async () => {
    if (!user?.id) {
      alert('Please log in to save favorites');
      return;
    }

    if (!currentVideoId || !currentVideoTitle) {
      alert('Video information not loaded yet. Please wait a moment and try again.');
      console.warn('Missing video info:', { currentVideoId, currentVideoTitle });
      return;
    }

    const videoKey = `${currentVideoId}-${currentVideoTitle}`;
    const isCurrentlyFavorited = favorites.includes(videoKey);

    console.log('Toggling favorite:', { videoKey, isCurrentlyFavorited, currentVideoId, currentVideoTitle, userId: user.id });

    try {
      if (isCurrentlyFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', currentVideoId)
          .eq('video_title', currentVideoTitle);
        
        if (error) throw error;
        console.log('Removed from favorites');
        setFavorites(prev => prev.filter(v => v !== videoKey));
      } else {
        // Add to favorites
        console.log('Inserting favorite with:', {
          user_id: user.id,
          video_id: currentVideoId,
          video_title: currentVideoTitle,
          playlist_id: playlist.playlistId,
          thumbnail_url: thumbnailUrl,
        });

        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            video_id: currentVideoId,
            video_title: currentVideoTitle,
            playlist_id: playlist.playlistId,
            thumbnail_url: thumbnailUrl,
          });
        
        if (error) throw error;
        console.log('Added to favorites');
        setFavorites(prev => [...prev, videoKey]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to save favorite: ' + err.message);
    }
  };

  const isFavorited = () => {
    const videoKey = `${currentVideoId}-${currentVideoTitle}`;
    return favorites.includes(videoKey);
  };

  if (!playlist) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-3xl">
        <p className="text-slate-500 font-medium tracking-wide">Select a mood to get a recommendation</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlist.playlistId}${autoplay ? '&autoplay=1' : ''}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg"
    >
      {/* Hidden YouTube Player Container - Always controls the actual playback */}
      <div style={{ display: 'none' }} ref={playerContainerRef} id="youtube-player"></div>
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

      {/* Media Area */}
      {showVideo ? (
        /* Aspect ratio 16:9 for YouTube when video is ON */
        <div className="relative w-full bg-slate-900" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={embedUrl}
            title="YouTube Playlist Player"
            className="absolute w-full h-full inset-0 border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        /* Audio Player UI - Let it size naturally */
        <div className="w-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-12">
          {/* Album Art - Current Video Thumbnail */}
          <div className="mb-6 md:mb-8 w-40 h-40 md:w-48 md:h-48 rounded-3xl shadow-2xl overflow-hidden border-4 border-slate-700 mx-auto">
            <img 
              src={thumbnailUrl || `https://img.youtube.com/vi/${currentVideoId}/maxresdefault.jpg`}
              alt={playlist.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://img.youtube.com/vi/${currentVideoId}/hqdefault.jpg`;
              }}
            />
          </div>

          {/* Song Info */}
          <div className="relative flex items-center justify-center mb-2 w-full px-8">
            <h3 className="text-xl md:text-2xl font-bold text-white text-center truncate">{currentVideoTitle || playlist.name}</h3>
            {currentVideoTitle && (
              <button
                onClick={toggleFavorite}
                className="absolute right-0 p-2 hover:scale-110 transition-transform"
              >
                <Heart
                  size={24}
                  className={isFavorited() ? 'fill-red-500 text-red-500' : 'text-white/50'}
                />
              </button>
            )}
          </div>
          <p className="text-sm md:text-base text-slate-400 text-center mb-6 md:mb-8 px-4">{playlist.description}</p>

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
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8 w-full mt-2">
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
              title="Previous video"
            >
              <SkipBack size={26} />
            </button>
            <button 
              onClick={handlePlayPause}
              className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 mx-2"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={28} fill="white" />
              ) : (
                <Play size={28} fill="white" className="ml-1" />
              )}
            </button>
            <button 
              onClick={handleSkipForward}
              className="text-slate-400 hover:text-white transition-all hover:scale-110 active:scale-95"
              title="Next video"
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
          <div className="w-full max-w-xs mb-6 px-4">
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
          <div className="mt-2 mb-2 px-4 py-2 rounded-full bg-slate-700/50 border border-slate-600">
            <p className="text-[10px] md:text-xs text-slate-300 tracking-wider font-medium">MOOD-ENERGY MATCH: <span className="font-bold text-teal-400">{playlist.mood.toUpperCase()}</span></p>
          </div>
        </div>
      )}
      
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
