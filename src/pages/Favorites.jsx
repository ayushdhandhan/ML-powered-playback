import React from 'react';
import { useAppContext } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const { favorites } = useAppContext();

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
          <Heart className="text-pink-500" size={36} fill="currentColor" />
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
            Saved Preferences
          </h1>
        </div>
        <p className="text-slate-600 text-lg">Playlists bookmarked from your behavioral listening profile. These selections reflect your established mood preferences.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border border-pink-100 border-dashed">
          <Heart className="text-pink-300 mb-4" size={48} />
          <p className="text-slate-600 text-lg font-medium mb-2">No preferences saved yet</p>
          <p className="text-slate-500 text-sm">Heart playlists while browsing to save them to your collection</p>
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
