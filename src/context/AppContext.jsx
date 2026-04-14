import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [mood, setMood] = useState(null);
  const [playlist, setPlaylist] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : { autoplay: true, recommendations: true, theme: 'dark' };
  });

  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem('moodHistory');
    return saved ? JSON.parse(saved) : {};
  });

  // Persist user
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  // Persist mood history
  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
  }, [moodHistory]);

  const toggleFavorite = (playlistItem) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.playlistId === playlistItem.playlistId);
      if (exists) {
        return prev.filter(p => p.playlistId !== playlistItem.playlistId);
      }
      return [...prev, playlistItem];
    });
  };

  const isFavorite = (playlistId) => {
    return favorites.some(p => p.playlistId === playlistId);
  };

  const trackMoodSelection = (moodName) => {
    setMoodHistory(prev => ({
      ...prev,
      [moodName]: (prev[moodName] || 0) + 1
    }));
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      mood, setMood,
      playlist, setPlaylist,
      favorites, toggleFavorite, isFavorite,
      settings, setSettings,
      moodHistory, trackMoodSelection
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
