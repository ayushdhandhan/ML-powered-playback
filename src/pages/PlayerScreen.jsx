import React, { useEffect, useState } from 'react';
import Player from '../components/Player';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPlaylistFromMood } from '../utils/recommendation';

export default function PlayerScreen() {
  const { playlist: contextPlaylist, settings } = useAppContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [activePlaylist, setActivePlaylist] = useState(contextPlaylist);

  useEffect(() => {
    const moodParam = searchParams.get('mood');
    if (moodParam) {
      const match = getPlaylistFromMood(moodParam.charAt(0).toUpperCase() + moodParam.slice(1).toLowerCase());
      if (match) setActivePlaylist(match);
    } else {
      setActivePlaylist(contextPlaylist);
    }
  }, [searchParams, contextPlaylist]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back
      </button>

      <Player playlist={activePlaylist} autoplay={settings?.autoplay ?? true} />
    </div>
  );
}
