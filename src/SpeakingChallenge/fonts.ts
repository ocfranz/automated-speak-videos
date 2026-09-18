import * as Bricolage from "@remotion/google-fonts/BricolageGrotesque";
import * as Figtree from "@remotion/google-fonts/Figtree";
import * as Lexend from "@remotion/google-fonts/Lexend";
import * as Montserrat from "@remotion/google-fonts/Montserrat";
import * as Outfit from "@remotion/google-fonts/Outfit";
import * as PlusJakarta from "@remotion/google-fonts/PlusJakartaSans";
import * as Poppins from "@remotion/google-fonts/Poppins";
import * as Rubik from "@remotion/google-fonts/Rubik";
import * as Sora from "@remotion/google-fonts/Sora";
import fontList from "../fonts.json";

// To add a font: import it above, add it here, and add its id to src/fonts.json.
const opts = { weights: ["700" as const, "800" as const], subsets: ["latin" as const] };

const LOADERS = {
  bricolage: () => Bricolage.loadFont("normal", opts).fontFamily,
  montserrat: () => Montserrat.loadFont("normal", opts).fontFamily,
  poppins: () => Poppins.loadFont("normal", opts).fontFamily,
  outfit: () => Outfit.loadFont("normal", opts).fontFamily,
  "plus-jakarta": () => PlusJakarta.loadFont("normal", opts).fontFamily,
  sora: () => Sora.loadFont("normal", opts).fontFamily,
  lexend: () => Lexend.loadFont("normal", opts).fontFamily,
  figtree: () => Figtree.loadFont("normal", opts).fontFamily,
  rubik: () => Rubik.loadFont("normal", opts).fontFamily,
} satisfies Record<string, () => string>;

export type FontId = keyof typeof LOADERS;

export const FONT_IDS = fontList.map((f) => f.id) as [FontId, ...FontId[]];

// Only the selected font is downloaded, and only once per id
const loaded = new Map<FontId, string>();

export const getFontFamily = (id: FontId): string => {
  const cached = loaded.get(id);
  if (cached) {
    return cached;
  }
  const fontFamily = LOADERS[id]();
  loaded.set(id, fontFamily);
  return fontFamily;
};
