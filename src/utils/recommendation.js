import playlists from '../data/playlists.json';

export function getPlaylistFromMood(mood) {
  if (!mood) return null;

  const normalizedMood = mood.toLowerCase();
  
  // Rule-based logic simulating dataset filtering
  // We'll iterate over the playlists and find the one that best matches the mood logic.
  
  let match = playlists.find(p => p.mood.toLowerCase() === normalizedMood);

  // In a real scenario, we might use energy / valence thresholds:
  // e.g. "Happy" -> high valence (>0.6), medium-high energy
  // "Sad" -> low valence (<0.4)
  // "Energetic" -> high energy (>0.7)
  // "Chill" -> low energy (<0.4), medium valence
  // "Focus" -> low valence + low tempo
  // "Party" -> high energy + high danceability

  if (match) {
    let reason = "";
    switch(normalizedMood) {
      case "happy":
        reason = `Recommended because of high valence (${match.valence}) and positive energy (${match.energy}).`;
        break;
      case "sad":
        reason = `Recommended because of low valence (${match.valence}) for emotional reflection.`;
        break;
      case "energetic":
        reason = `Recommended because of high energy (${match.energy}) to keep you moving.`;
        break;
      case "chill":
        reason = `Recommended because of low energy (${match.energy}) and steady vibe.`;
        break;
      case "focus":
        reason = `Recommended because of moderate tempo (${match.tempo} BPM) and instrumental focus.`;
        break;
      case "party":
        reason = `Recommended because of high danceability (${match.danceability}) and energy (${match.energy}).`;
        break;
      default:
        reason = "Recommended based on your current mood selection.";
    }

    return {
      ...match,
      reason
    };
  }
  
  return null;
}
