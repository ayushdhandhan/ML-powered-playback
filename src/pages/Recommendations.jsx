import React from 'react';
import playlists from '../data/playlists.json';
import PlaylistCard from '../components/PlaylistCard';
import { useAppContext } from '../context/AppContext';

export default function Recommendations() {
  const { moodHistory } = useAppContext();

  // If the user hasn't clicked any mood yet, moodHistory will be an empty object
  const hasHistory = Object.keys(moodHistory).length > 0;

  let sortedPlaylists = [];
  
  if (hasHistory) {
    // Sort the moods by frequency (highest clicked first)
    const sortedMoods = Object.entries(moodHistory)
      .sort((a, b) => b[1] - a[1]) // b[1] is count of b, a[1] is count of a
      .map(entry => entry[0]); // array of mood names

    // Map sorted moods to their respective playlists from the dataset
    sortedPlaylists = sortedMoods.map(moodName => {
      return playlists.find(p => p.mood === moodName);
    }).filter(Boolean); // Filter out any undefined just in case
  } else {
    // Fallback if no history
    sortedPlaylists = playlists;
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
          {hasHistory ? "Your Custom Recommendations" : "All Recommendations"}
        </h1>
        <p className="text-slate-600 text-lg">
          {hasHistory 
            ? "Curated playlists based on your most frequent mood selections. Recommendations are generated using mood-energy feature mapping and recent listening patterns." 
            : "Browse our full catalog. Select moods to generate custom recommendations!"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlaylists.map((playlist, idx) => {
           let reason = "";
           const normalizedMood = playlist.mood.toLowerCase();
           switch(normalizedMood) {
             case "happy": reason = `High valence (>0.6) & positive energy (${playlist.energy})`; break;
             case "sad": reason = `Low valence (<0.4) for reflection`; break;
             case "energetic": reason = `High energy (>0.7) for action`; break;
             case "chill": reason = `Low energy (<0.4) & steady vibe`; break;
             case "focus": reason = `Moderate tempo (${playlist.tempo} BPM) & instrumental design`; break;
             case "party": reason = `High danceability (${playlist.danceability}) & energy`; break;
             default: reason = "Based on our AI logic matching your mood";
           }

           const clicks = moodHistory[playlist.mood] || 0;
           const clickReason = hasHistory 
             ? `Recommended because you frequently listen to ${playlist.mood} music. (${clicks} recent interactions)`
             : reason;

           const enhancedPlaylist = { ...playlist, reason: clickReason };
           return <PlaylistCard key={playlist.playlistId} playlist={enhancedPlaylist} />;
        })}
      </div>
    </div>
  );
}
