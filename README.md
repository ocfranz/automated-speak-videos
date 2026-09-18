# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
bun install
```

**Start Preview**

```console
bun run dev
```

**Render video**

```console
bunx remotion render
```

**Upgrade Remotion**

```console
bunx remotion upgrade
```

## English Speaking Challenge videos

Vertical (1080x1920) practice videos for TikTok / YouTube Shorts / Reels, at least 45s long.
Each video: Intro -> Round 1 LISTEN (model voice + synced highlight) -> Round 2 YOUR TURN (read aloud) -> Round 3 SPEED ROUND -> Outro.

1. Add prompts to `src/prompts.json` (`id`, `topic`, `level`, `text`). 60-90 words works best.
2. Render:

```console
node scripts/generate.mjs                       # all prompts -> out/<id>.mp4
node scripts/generate.mjs coffee-shop           # only one prompt
node scripts/generate.mjs --handle @myenglish --voice Daniel --speed-wpm 240
node scripts/generate.mjs --no-voice            # no model voice
```

The voice uses the built-in macOS `say` command (list voices: `say -v '?' | grep en_`).

## Captioning

Replace the `sample-video.mp4` with your video file.
Caption all the videos in you `public` by running the following command:

```console
node sub.mjs
```

Only caption a specific video:

```console
node sub.mjs <path-to-video-file>
```

Only caption a specific folder:

```console
node sub.mjs <path-to-folder>
```

## Configure Whisper.cpp

Captioning will download Whisper.cpp and the 1.5GB big `medium.en` model. To configure which model is being used, you can configure the variables in `whisper-config.mjs`.

### Non-English languages

To support non-English languages, you need to change the `WHISPER_MODEL` variable in `whisper-config.mjs` to a model that does not have a `.en` sufix.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://remotion.dev/discord).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
