// Generate teleprompter speaking drills.
//
//   npm run auto                               -> 3 random videos into out/<today>/
//   npm run all                                -> every prompt in src/prompts.json
//   npm run generate                           -> same as above
//   npm run generate -- coffee-shop            -> only prompts with these ids
//   npm run generate -- --random 5             -> 5 random prompts
//   npm run generate -- --theme midnight       -> force one theme  (default: random per video)
//   npm run generate -- --font poppins         -> force one font   (default: random per video)
//   npm run generate -- --speed-wpm 130 --title "READ IT FAST"
//   npm run generate -- --no-intro             -> silent intro (no public/intro.mp3)
//   npm run generate -- --out out/batch-1      -> custom output folder
//
// Themes: src/themes.json   Fonts: src/fonts.json   Defaults: src/SpeakingChallenge/theme.ts
// Every run writes a manifest.json next to the videos, and out/history.json remembers
// which prompts were already used so random picks favor the least-used ones.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  // lastIndexOf so `npm run auto -- --random 5` overrides the script's --random 3
  const i = args.lastIndexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const titleOverride = flag("title", null);
// Output file name: "<FILE_PREFIX> — <prompt title>.mp4"
const FILE_PREFIX = "Speak fast and clear";
const speedWpm = flag("speed-wpm", null);
const introSrc = args.includes("--no-intro") ? null : "intro.mp3";
const themeId = flag("theme", null);
const fontId = flag("font", null);
const randomCount = flag("random", null);
const today = new Date().toISOString().slice(0, 10);
const outDir = flag("out", path.join("out", today));

const valueFlags = ["--title", "--speed-wpm", "--theme", "--font", "--random", "--out"];
const ids = args.filter((a, i) => !a.startsWith("--") && !valueFlags.includes(args[i - 1]));

const readJson = (file, fallback) =>
  existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : fallback;

const prompts = readJson("src/prompts.json");
const themes = readJson("src/themes.json");
const fonts = readJson("src/fonts.json").map((f) => f.id);
const historyFile = "out/history.json";
const history = readJson(historyFile, {});

const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// Deal from a shuffled deck so back-to-back videos don't repeat
const deck = (list) => {
  let cards = [];
  return () => {
    if (cards.length === 0) cards = shuffle(list);
    return cards.pop();
  };
};

let selected = ids.length ? prompts.filter((p) => ids.includes(p.id)) : prompts;
if (randomCount) {
  // Least-used prompts first, random order among equals
  selected = shuffle(selected)
    .sort((a, b) => (history[a.id] ?? 0) - (history[b.id] ?? 0))
    .slice(0, Number(randomCount));
}

if (selected.length === 0) {
  console.error(`No prompts matched: ${ids.join(", ")}`);
  process.exit(1);
}
if (themeId && !themes.some((t) => t.id === themeId)) {
  console.error(`Unknown theme "${themeId}". Available: ${themes.map((t) => t.id).join(", ")}`);
  process.exit(1);
}
if (fontId && !fonts.includes(fontId)) {
  console.error(`Unknown font "${fontId}". Available: ${fonts.join(", ")}`);
  process.exit(1);
}

// Texts are written for 120-170 words (~50-70s at 150 wpm). Warn, but still render.
const MIN_WORDS = 120;
const MAX_WORDS = 170;
for (const p of selected) {
  if (!p.text?.trim()) {
    console.error(`Prompt "${p.id}" has no text.`);
    process.exit(1);
  }
  const words = p.text.trim().split(/\s+/).length;
  if (words < MIN_WORDS || words > MAX_WORDS) {
    console.warn(`⚠️  ${p.id}: ${words} words (expected ${MIN_WORDS}-${MAX_WORDS})`);
  }
}

const nextTheme = themeId ? () => themes.find((t) => t.id === themeId) : deck(themes);
const nextFont = fontId ? () => fontId : deck(fonts);

// Strip characters that aren't allowed in file names (macOS / Windows)
const safeFileName = (value) =>
  value
    .replace(/[\\/:]/g, "-")
    .replace(/[*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Don't overwrite an existing video with the same title: add " (2)", " (3)", ...
const uniqueName = (base) => {
  let name = base;
  for (let n = 2; existsSync(path.join(outDir, `${name}.mp4`)); n++) {
    name = `${base} (${n})`;
  }
  return name;
};

const propsDir = path.join(outDir, "props");
mkdirSync(propsDir, { recursive: true });
const manifestFile = path.join(outDir, "manifest.json");
const manifest = readJson(manifestFile, []);

for (const prompt of selected) {
  const { id: theme, titleColors, ...colors } = nextTheme();
  const font = nextFont();

  // Anything not set here falls back to DEFAULT_STYLE in src/SpeakingChallenge/theme.ts.
  // A prompt can override style per video, e.g. { "speedWpm": 130, "accentColor": "#38BDF8" }.
  // `title` in prompts.json is the story title (used for the file name), not the on-screen title
  const { id, category, topic, level, title: promptTitle, ...promptStyle } = prompt;
  const props = { ...colors, titleColor: pick(titleColors), font, ...promptStyle, introSrc };
  if (titleOverride) props.title = titleOverride;
  if (speedWpm) props.speedWpm = Number(speedWpm);

  const name = uniqueName(`${FILE_PREFIX} — ${safeFileName(promptTitle ?? topic ?? id)}`);
  const propsFile = path.join(propsDir, `${name}.json`);
  const outFile = path.join(outDir, `${name}.mp4`);
  writeFileSync(propsFile, JSON.stringify(props, null, 2));

  console.log(`\n🎬 ${outFile}  (theme: ${theme}, font: ${font}, title: ${props.titleColor})`);
  execFileSync(
    "npx",
    ["remotion", "render", "SpeakingChallenge", outFile, `--props=${propsFile}`],
    { stdio: "inherit" },
  );

  manifest.push({
    file: path.basename(outFile),
    prompt: id,
    category: category ?? topic,
    level,
    theme,
    font,
    titleColor: props.titleColor,
    createdAt: new Date().toISOString(),
  });
  writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  history[id] = (history[id] ?? 0) + 1;
  writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

console.log(`\n✅ Done. ${selected.length} video(s) in ${outDir}/`);
