import React, { useEffect, useState } from 'react';
import playlists from '../data/playlists.json';
import PlaylistCard from '../components/PlaylistCard';
import { useAppContext } from '../context/AppContext';
import { fetchUserInteractions, analyzeMoodPatterns, generateRecommendationReason } from '../utils/tracking';

export default function Recommendations() {
  const { user, moodHistory } = useAppContext();
  const [enhancedPlaylists, setEnhancedPlaylists] = useState(playlists);

  useEffect(() => {
    const generatePersonalizedRecommendations = async () => {
      let sortedPlaylists = [...playlists];

      // Fetch real interaction data if user is logged in
      if (user) {
        try {
          const interactions = await fetchUserInteractions(user.id, 100);
          const patterns = analyzeMoodPatterns(interactions);

          // Sort based on most frequent mood
          if (patterns.mostFrequentMood) {
            const favoredIndex = playlists.findIndex(p => p.mood.toLowerCase() === patterns.mostFrequentMood.toLowerCase());
            if (favoredIndex !== -1) {
              const favored = playlists[favoredIndex];
              sortedPlaylists = [favored, ...playlists.filter((_, i) => i !== favoredIndex)];
            }
          }

          // Add personalized reasons
          const withReasons = sortedPlaylists.map(playlist => {
            const reason = generateRecommendationReason(patterns, playlist.mood);
            return {
              ...playlist,
              reason,
              frequency: patterns.moodDistribution[playlist.mood] || 0
            };
          });

          setEnhancedPlaylists(withReasons);
          return;
        } catch (err) {
          console.error('Error generating personalized recommendations:', err);
        }
      }

      // Fallback to local history
      const hasHistory = Object.keys(moodHistory).length > 0;
      if (hasHistory) {
        const sortedMoods = Object.entries(moodHistory)
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0]);

        sortedPlaylists = sortedMoods.map(moodName =>
          playlists.find(p => p.mood === moodName)
        ).filter(Boolean);
      }

      const withReasons = sortedPlaylists.map(playlist => ({
        ...playlist,
        reason: `Ranked by your preference for ${playlist.mood} listening patterns. (${moodHistory[playlist.mood] || 0} interactions)`
      }));

      setEnhancedPlaylists(withReasons);
    };

    generatePersonalizedRecommendations();
  }, [user, moodHistory]);

  const hasHistory = Object.keys(moodHistory).length > 0;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
          {hasHistory || user ? "Personalized Recommendations" : "All Recommendations"}
        </h1>
        <p className="text-slate-600 text-lg">
          {hasHistory || user
            ? "Your listening patterns analyzed: Using mood-energy feature mapping, temporal trends, and behavioral analysis to deliver optimized recommendations."
            : "Browse our full acoustic catalog. Select moods to activate the adaptive recommendation engine!"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enhancedPlaylists.map((playlist) => (
          <PlaylistCard key={playlist.playlistId} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}
