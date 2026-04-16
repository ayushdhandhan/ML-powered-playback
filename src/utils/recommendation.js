import playlists from '../data/playlists.json';

/**
 * Mood-energy feature mapping for adaptive recommendations
 * Uses valence, energy, tempo, and danceability metrics
 * for behavioral pattern analysis
 */
export function getPlaylistFromMood(mood) {
  if (!mood) return null;

  const normalizedMood = mood.toLowerCase();
  let match = playlists.find(p => p.mood.toLowerCase() === normalizedMood);

  if (match) {
    const reason = generateAIFriendlyReason(normalizedMood, match);
    return {
      ...match,
      reason
    };
  }
  
  return null;
}

/**
 * Generate ML-style explanations for recommendations
 * Using mood-energy feature mapping language
 */
function generateAIFriendlyReason(mood, playlist) {
  const explanations = {
    happy: [
      `Adaptive recommendation engine detected high-valence preference (valence: ${(playlist.valence * 100).toFixed(0)}%). Positive emotional indicators suggest uplifting track selection.`,
      `Behavioral pattern analysis indicates preference for high-energy content. Your mood profile matches high-arousal, positive-sentiment listening patterns.`,
      `Feature mapping complete: Energy level ${(playlist.energy * 100).toFixed(0)}% correlates with your joyful mood selection. Temporal trend prediction: sustained positive engagement.`
    ],
    sad: [
      `Emotional intelligence algorithm detected low-valence listening preference (valence: ${(playlist.valence * 100).toFixed(0)}%). Temporal analysis suggests introspective session.`,
      `Behavioral prediction: Your current mood maps to low-energy, contemplative tracks. Listening history shows pattern alignment with reflective content.`,
      `Mood-energy feature extraction complete. Recommended tracks feature low danceability (${(playlist.danceability * 100).toFixed(0)}%) for emotional processing optimization.`
    ],
    energetic: [
      `High-arousal detection: Your energy level requires high-tempo acceleration. Tempo analysis: ${playlist.tempo} BPM matches movement-oriented listening behavior.`,
      `Danceability coefficient at ${(playlist.danceability * 100).toFixed(0)}% detected. Behavioral pattern analysis suggests active engagement profile activation.`,
      `Feature mapping indicates kinetic preference. Energy level ${(playlist.energy * 100).toFixed(0)}% optimized for high-performance cognitive state.`
    ],
    chill: [
      `Relaxation mode detected. Low-energy algorithm engaged (energy: ${(playlist.energy * 100).toFixed(0)}%). Temporal trend predicts sustained calm listening session.`,
      `Behavioral analysis shows preference for steady-state listening. Tempo signature (${playlist.tempo} BPM) matches your deceleration pattern.`,
      `Wind-down session optimization: Mid-range valence (${(playlist.valence * 100).toFixed(0)}%) provides balanced mood stabilization for relaxation state.`
    ],
    focus: [
      `Cognitive focus mode activated. Instrumental algorithm engaged for concentration optimization. Tempo analysis (${playlist.tempo} BPM) supports focus-state maintenance.`,
      `Behavioral productivity pattern detected. Low lyrical distraction rate ensures optimal working memory allocation. Energy profile: ${(playlist.energy * 100).toFixed(0)}% - ideal for cognitive tasks.`,
      `Feature mapping indicates flow-state prerequisites met. Your focus listening profile aligns with established concentration metrics. Session duration prediction: sustained engagement.`
    ],
    party: [
      `Social engagement mode activated. High-danceability coefficient (${(playlist.danceability * 100).toFixed(0)}%) detected for group listening optimization.`,
      `Energy level at peak activation (${(playlist.energy * 100).toFixed(0)}%). Behavioral analysis suggests celebratory listening pattern alignment. Temporal trend: sustained high-arousal preference.`,
      `Party mode feature extraction complete. Valence and danceability synergy (${(playlist.valence * 100).toFixed(0)}% + ${(playlist.danceability * 100).toFixed(0)}%) optimizes social listening experience.`
    ]
  };

  const moodExplanations = explanations[mood] || explanations.happy;
  return moodExplanations[Math.floor(Math.random() * moodExplanations.length)];
}

/**
 * Helper to get most common mood from recent history
 */
export function getMostFrequentMood(interactions) {
  if (!interactions || interactions.length === 0) return null;
  
  const frequencies = {};
  interactions.forEach(interaction => {
    frequencies[interaction.mood] = (frequencies[interaction.mood] || 0) + 1;
  });
  
  return Object.keys(frequencies).reduce((a, b) => 
    frequencies[a] > frequencies[b] ? a : b
  );
}
