import { supabase } from './supabase';

/**
 * Track user mood selection interaction in real-time
 * Inserts a record into user_interactions table with timestamp
 */
export async function trackUserInteraction(userId, mood) {
  if (!userId) return;
  
  try {
    const { error } = await supabase
      .from('user_interactions')
      .insert({
        user_id: userId,
        mood: mood,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error tracking interaction:', error);
    }
  } catch (err) {
    console.error('Failed to track interaction:', err);
  }
}

/**
 * Fetch user's recent interactions from Supabase
 * Used for analytics and recommendation personalization
 */
export async function fetchUserInteractions(userId, limit = 50) {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('user_interactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching interactions:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to fetch interactions:', err);
    return [];
  }
}

/**
 * Analyze user mood patterns for recommendation personalization
 * Returns most frequent mood and recent mood selections
 */
export function analyzeMoodPatterns(interactions) {
  if (!interactions || interactions.length === 0) {
    return {
      mostFrequentMood: null,
      moodDistribution: {},
      lastMood: null,
      totalInteractions: 0
    };
  }

  const distribution = {};
  let lastMood = null;

  interactions.forEach((interaction, index) => {
    if (index === 0) lastMood = interaction.mood;
    distribution[interaction.mood] = (distribution[interaction.mood] || 0) + 1;
  });

  const mostFrequentMood = Object.keys(distribution).reduce((a, b) =>
    distribution[a] > distribution[b] ? a : b
  );

  return {
    mostFrequentMood,
    moodDistribution: distribution,
    lastMood,
    totalInteractions: interactions.length
  };
}

/**
 * Generate AI-sounding explanation for recommendation
 * Based on user's behavioral patterns
 */
export function generateRecommendationReason(moodPatterns, currentMood) {
  const { mostFrequentMood, moodDistribution, lastMood, totalInteractions } = moodPatterns;

  const reasons = {
    Happy: [
      `Based on your recent high-valence listening pattern (${(moodDistribution.Happy / totalInteractions * 100).toFixed(0)}% preference)`,
      `Adaptive recommendation engine detected your positive sentiment indicators`,
      `Your behavioral analysis shows consistent high-energy selection bias`,
      `Mood-energy feature mapping indicates preference for uplifting tracks`
    ],
    Sad: [
      `Detected emotional reflection pattern in your listening history`,
      `Behavioral analysis shows preference for introspective, low-valence content`,
      `Your temporal trends indicate vulnerability for deep listening sessions`,
      `Low-energy listening pattern recognized - selecting contemplative tracks`
    ],
    Energetic: [
      `High-danceability signal detected in your recent activity`,
      `Your interaction frequency suggests active lifestyle preference`,
      `Behavioral pattern analysis detected movement-oriented listening bias`,
      `Energy-level temporal trend indicates high-arousal preference`
    ],
    Chill: [
      `Relaxation listening mode detected from your interaction history`,
      `Behavioral pattern shows preference for steady, moderate-tempo selections`,
      `Your listening profile indicates low-arousal relaxation preference`,
      `Temporal trend analysis suggests wind-down session pattern`
    ],
    Focus: [
      `Instrumental focus pattern recognized in your recent interactions`,
      `Your behavioral data indicates cognitive-task listening preference`,
      `Concentration-mode session detected - selecting productivity tracks`,
      `Temporal analysis shows consistent focus-time listening behavior`
    ],
    Party: [
      `High danceability and energy preference detected in your pattern`,
      `Social engagement indicators suggest celebratory mood preference`,
      `Behavioral analysis shows high-tempo, high-arousal listening bias`,
      `Your interaction pattern indicates dynamic, high-energy selection preference`
    ]
  };

  const moodReasons = reasons[currentMood] || reasons.Happy;
  return moodReasons[Math.floor(Math.random() * moodReasons.length)];
}
