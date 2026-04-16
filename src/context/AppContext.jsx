import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);

  const [mood, setMood] = useState(null);
  const [playlist, setPlaylist] = useState(null);

  const [favorites, setFavorites] = useState([]);
  const [settings, setSettings] = useState(() => {
    try {
       const saved = localStorage.getItem('appSettings');
       return saved ? JSON.parse(saved) : { autoplay: true, recommendations: true, theme: 'light' };
    } catch {
       return { autoplay: true, recommendations: true, theme: 'light' };
    }
  });
  const [moodHistory, setMoodHistory] = useState({});

  // 1. Listen for Supabase Auth changes
  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) setLoadingApp(false);
    });

    // Listen for auth changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch User Profile Data (Settings, Mood History, Favorites) when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setFavorites([]);
        setMoodHistory({});
        return;
      }
      
      try {
        // Fetch Profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('settings, mood_history')
          .eq('id', user.id)
          .single();

        if (profile) {
          if (profile.settings) setSettings(profile.settings);
          if (profile.mood_history) setMoodHistory(profile.mood_history);
        }

        // Fetch Favorites
        const { data: favs } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);

        if (favs) {
          // Format it to match our frontend expectation (extract playlist_data)
          setFavorites(favs.map(f => f.playlist_data));
        }

      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoadingApp(false);
      }
    };

    if (user) {
      setLoadingApp(true);
      fetchUserData();
    }
  }, [user]);


  // Helper: Persist Settings to Supabase and localStorage
  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    if (user) {
      await supabase.from('profiles').update({ settings: newSettings }).eq('id', user.id);
    }
  };

  const toggleFavorite = async (playlistItem) => {
    if (!user) return; // User must be logged in

    const exists = isFavorite(playlistItem.playlistId);

    if (exists) {
      // Optimistic update
      setFavorites(prev => prev.filter(p => p.playlistId !== playlistItem.playlistId));
      // Delete from DB
      await supabase.from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('playlist_id', playlistItem.playlistId);
    } else {
      // Optimistic update
      setFavorites(prev => [...prev, playlistItem]);
      // Insert to DB
      await supabase.from('favorites').insert({
        user_id: user.id,
        playlist_id: playlistItem.playlistId,
        playlist_data: playlistItem
      });
    }
  };

  const isFavorite = (playlistId) => {
    return favorites.some(p => p.playlistId === playlistId);
  };

  const trackMoodSelection = async (moodName) => {
    const newHistory = {
      ...moodHistory,
      [moodName]: (moodHistory[moodName] || 0) + 1
    };
    setMoodHistory(newHistory);

    if (user) {
      // Update historical frequency mapping
      await supabase.from('profiles').update({ mood_history: newHistory }).eq('id', user.id);
      
      // Store real-time timestamped interaction 
      await supabase.from('interactions').insert({
        user_id: user.id,
        selected_mood: moodName,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <AppContext.Provider value={{
      user, setUser, loadingApp,
      mood, setMood,
      playlist, setPlaylist,
      favorites, toggleFavorite, isFavorite,
      settings, setSettings: updateSettings,
      moodHistory, trackMoodSelection
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
