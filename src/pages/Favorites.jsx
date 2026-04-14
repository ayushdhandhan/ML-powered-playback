import React from 'react';
import { useAppContext } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';

export default function Favorites() {
  const { favorites } = useAppContext();

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
          Your Favorites
        </h1>
        <p className="text-slate-400 text-lg">Playlists you've saved for later listening.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
          <p className="text-slate-500 text-lg">You haven't saved any playlists yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((playlist) => (
             <PlaylistCard key={playlist.playlistId} playlist={playlist} />
          ))}
        </div>
      )}
    </div>
  );
}
