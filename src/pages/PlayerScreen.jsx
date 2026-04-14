import React from 'react';
import Player from '../components/Player';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PlayerScreen() {
  const { playlist, settings } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto py-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Moods
      </button>

      <Player playlist={playlist} autoplay={settings.autoplay} />
    </div>
  );
}
