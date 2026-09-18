import { Audio } from "@remotion/media";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { zColor } from "@remotion/zod-types";
import { z } from "zod";
import { FONT_IDS, getFontFamily } from "./fonts";
import {
  countWords,
  DEFAULT_INTRO_SECONDS,
  FPS,
  HOLD_SECONDS,
  LOOP_FADE_SECONDS,
  readSeconds,
} from "./timing";

export const speakingChallengeSchema = z.object({
  title: z.string(),
  text: z.string(),
  footer: z.string(),
  // Scroll speed of the teleprompter (words per minute)
  speedWpm: z.number().min(40).max(400),
  fontSize: z.number().min(30).max(140),
  backgroundColor: zColor(),
  glowColor: zColor(),
  textColor: zColor(),
  accentColor: zColor(),
  titleColor: zColor(),
  font: z.enum(FONT_IDS),
  // Path inside public/, played while the title is on screen. null = silent intro.
  introSrc: z.string().nullable(),
  // Filled in by calculateMetadata
  introSeconds: z.number().optional(),
});

type Props = z.infer<typeof speakingChallengeSchema>;

export const calculateSpeakingChallengeMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const introSeconds = props.introSrc
    ? await getAudioDurationInSeconds(staticFile(props.introSrc))
    : DEFAULT_INTRO_SECONDS;

  const total =
    introSeconds + readSeconds(props.text, props.speedWpm) + HOLD_SECONDS + LOOP_FADE_SECONDS;

  return {
    fps: FPS,
    durationInFrames: Math.round(total * FPS),
    props: { ...props, introSeconds },
  };
};

// Layout (1080x1920)
const SIDE = 84;
const TEXT_START_Y = 830; // top of the paragraph before scrolling
const TEXT_END_Y = 700; // bottom of the paragraph after scrolling

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const SpeakingChallenge: React.FC<Props> = ({
  title,
  text,
  footer,
  speedWpm,
  fontSize,
  backgroundColor,
  glowColor,
  textColor,
  accentColor,
  titleColor,
  font,
  introSrc,
  introSeconds = DEFAULT_INTRO_SECONDS,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fontFamily = getFontFamily(font);

  const introEnd = introSeconds * fps;
  const scrollEnd = introEnd + readSeconds(text, speedWpm) * fps;
  const loopStart = durationInFrames - LOOP_FADE_SECONDS * fps;

  // 0 -> 1 while the text scrolls, linear so the reading pace stays constant
  const progress = interpolate(frame, [introEnd, scrollEnd], [0, 1], clamp);

  // At the very end, cross-fade back to the first frame so it loops
  const loop = interpolate(frame, [loopStart, durationInFrames - 1], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const scroll = progress * (1 - loop);

  const titleOpacity = Math.max(
    interpolate(frame, [introEnd - 0.3 * fps, introEnd], [1, 0], clamp),
    loop,
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily,
        backgroundColor,
        backgroundImage: `radial-gradient(circle at 50% 38%, ${glowColor} 0%, transparent 70%)`,
      }}
    >
      {introSrc ? <Audio src={staticFile(introSrc)} /> : null}

      <AbsoluteFill
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 250px, black 440px, black 1480px, transparent 1720px)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 250px, black 440px, black 1480px, transparent 1720px)",
        }}
      >
        <p
          style={{
            position: "absolute",
            top: TEXT_START_Y,
            left: SIDE,
            width: 830,
            margin: 0,
            fontSize,
            fontWeight: 800,
            lineHeight: 1.85,
            letterSpacing: -0.5,
            color: textColor,
            // translate3d + willChange keep the text on its own GPU layer, so it moves by
            // sub-pixel amounts instead of snapping to whole pixels (which looks like shaking)
            transform: `translate3d(0, calc(${-scroll * 100}% - ${scroll * (TEXT_START_Y - TEXT_END_Y)}px), 0)`,
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {text}
        </p>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          top: 110,
          width: "100%",
          textAlign: "center",
          fontSize: 54,
          fontWeight: 800,
          letterSpacing: 2,
          color: titleColor,
          opacity: titleOpacity,
        }}
      >
        {title}
      </div>

      <div
        style={{
          position: "absolute",
          left: SIDE,
          right: SIDE,
          top: 1750,
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        <div style={{ fontSize: 32, fontWeight: 700, color: textColor, opacity: 0.45 }}>
          {countWords(text)} words · {footer}
        </div>
        <div style={{ height: 6, borderRadius: 3, backgroundColor: `${textColor}1F` }}>
          <div
            style={{
              height: "100%",
              width: `${scroll * 100}%`,
              borderRadius: 3,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
