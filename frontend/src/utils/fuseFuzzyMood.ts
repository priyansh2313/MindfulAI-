export type Mood = "happy" | "neutral" | "sad" | "angry" | "anxious" | "calm";
export type FusedMood = "stable" | "low" | "crisis" | "irritated" | "elevated";
//moods available in the system
interface MoodInput {
  sad: number;
  angry: number;
  anxious: number;
  happy: number;
  neutral: number;
  calm: number;
}
//fused moods 
interface FusedMoodOutput {
  stable: number;
  low: number;
  crisis: number;
  irritated: number;
  elevated: number;
}

// Fuzzy logic function
export function fuseFuzzyMood(
  face: MoodInput,
  voice: MoodInput,
  text: MoodInput
): FusedMood {
  // Initialize fused mood membership values
  const fusedMood: FusedMoodOutput = {
    stable: 0,
    low: 0,
    crisis: 0,
    irritated: 0,
    elevated: 0,
  };

  // Fuzzy rules
  fusedMood.crisis = Math.min(
    Math.max(face.sad, face.angry),
    voice.anxious,
    Math.max(text.angry, text.sad)
  );

  fusedMood.low = Math.min(
    Math.max(face.sad, voice.sad),
    1 - text.happy
  );

  fusedMood.irritated = Math.min(
    Math.max(face.angry, voice.angry),
    1 - text.calm
  );

  fusedMood.elevated = Math.min(
    voice.anxious,
    Math.max(face.neutral, text.neutral)
  );

  fusedMood.stable = Math.max(
    1 - fusedMood.crisis,
    1 - fusedMood.low,
    1 - fusedMood.irritated,
    1 - fusedMood.elevated
  );

  // Defuzzification: Return the mood with the highest membership value
  const maxMood = Object.keys(fusedMood).reduce((a, b) =>
    fusedMood[a as keyof FusedMoodOutput] >
    fusedMood[b as keyof FusedMoodOutput]
      ? a
      : b
  ) as FusedMood;

  return maxMood;
}