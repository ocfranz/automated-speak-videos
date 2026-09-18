export const FPS = 30;

// Title + intro.mp3 before the text starts moving (used if the audio length can't be read)
export const DEFAULT_INTRO_SECONDS = 1.7;
// Hold on the last lines once the scroll ends
export const HOLD_SECONDS = 1.5;
// Fade back to the first frame so the video loops cleanly
export const LOOP_FADE_SECONDS = 0.8;

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const readSeconds = (text: string, wpm: number): number => {
  return (countWords(text) / wpm) * 60;
};
