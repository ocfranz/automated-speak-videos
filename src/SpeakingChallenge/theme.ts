import themes from "../themes.json";
import { FONT_IDS } from "./fonts";

export type Theme = (typeof themes)[number];

const toStyle = ({ id: _id, titleColors, ...colors }: Theme) => ({
  ...colors,
  titleColor: titleColors[0],
});

// Default look of every video. Change these values to restyle all renders,
// or override any of them per video in the Studio sidebar / props JSON.
export const DEFAULT_STYLE = {
  title: "Speak fast and clear!",
  footer: "read it clean",
  // Teleprompter scroll speed (words per minute). Lower = slower.
  speedWpm: 150,
  fontSize: 72,
  // Fonts are listed in src/fonts.json. The generator picks a random one per video.
  font: FONT_IDS[0],
  // Colors come from a theme in src/themes.json. The generator picks a random theme
  // per video, and a random title color from that theme's titleColors.
  ...toStyle(themes[0]),
};
