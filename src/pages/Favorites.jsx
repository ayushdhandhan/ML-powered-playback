import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import PlaylistCard from '../components/PlaylistCard';
import { Heart, Play } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function Favorites() {
  const { user, favorites } = useContext(AppContext);
  const [songFavorites, setSongFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorited songs
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchSongFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .not('video_id', 'is', null) // Get records with video_id (individual songs)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setSongFavorites(data);
        }
      } catch (err) {
        console.error('Error fetching song favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSongFavorites();

    // Listen for real-time updates
    const subscription = supabase
      .channel(`favorites:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'favorites',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        // Re-fetch when changes occur
        fetchSongFavorites();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 text-center">
        <p className="text-slate-500">Loading your favorites...</p>
      </div>
    );
  }

  const hasPlaylistFavorites = favorites && favorites.length > 0;
  const hasSongFavorites = songFavorites.length > 0;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
          <Heart className="text-pink-500" size={36} fill="currentColor" />
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
            Your Favorites
          </h1>
        </div>
        <p className="text-slate-600 text-lg">Your personalized collection of saved songs and playlists</p>
      </div>

      {/* Favorited Songs Section */}
      {hasSongFavorites && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Favorited Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songFavorites.map((song) => (
              <div
                key={`${song.video_id}-${song.created_at}`}
                className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="relative mb-3">
                  <img
                    src={song.thumbnail_url || `https://img.youtube.com/vi/${song.video_id}/hqdefault.jpg`}
                    alt={song.video_title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = `https://img.youtube.com/vi/${song.video_id}/hqdefault.jpg`;
                    }}
                  />
                  <a
                    href={`https://youtube.com/watch?v=${song.video_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-lg"
                  >
                    <Play className="text-white fill-white" size={32} />
                  </a>
                </div>
                <h3 className="font-semibold text-slate-800 truncate text-sm">{song.video_title}</h3>
                <p className="text-xs text-slate-500 mt-1">From: {song.playlist_id}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorited Playlists Section */}
      {hasPlaylistFavorites && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Favorited Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((playlist) => (
              <PlaylistCard key={playlist.playlistId} playlist={playlist} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasSongFavorites && !hasPlaylistFavorites && (
        <div className="w-full py-20 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border border-pink-100 border-dashed">
          <Heart className="text-pink-300 mb-4" size={48} />
          <p className="text-slate-600 text-lg font-medium mb-2">No favorites yet</p>
          <p className="text-slate-500 text-sm">Heart songs or playlists to save them to your collection</p>
        </div>
      )}
    </div>
  );
}
