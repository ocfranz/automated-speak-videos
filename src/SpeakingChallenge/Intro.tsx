import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./theme";

export const Intro: React.FC<{
  topic: string;
  level: string;
  speedWpm: number;
}> = ({ topic, level, speedWpm }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Intro"
      style={{
        fontFamily,
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 90px",
        gap: 48,
        textAlign: "center",
      }}
    >
      <Interactive.Div
        name="Level badge"
        style={{
          fontSize: 44,
          fontWeight: 800,
          color: "#0F172A",
          backgroundColor: "#FACC15",
          padding: "14px 36px",
          borderRadius: 999,
        }}
      >
        {level}
      </Interactive.Div>
      <Interactive.Div
        name="Headline"
        style={{
          fontSize: 118,
          fontWeight: 900,
          lineHeight: 1.02,
          letterSpacing: -2,
          scale: interpolate(frame, [0, 0.6 * fps], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        ENGLISH SPEAKING CHALLENGE
      </Interactive.Div>
      <Interactive.Div
        name="Topic"
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: "#38BDF8",
          lineHeight: 1.15,
        }}
      >
        {topic}
      </Interactive.Div>
      <Interactive.Div
        name="Hook"
        style={{
          fontSize: 50,
          fontWeight: 600,
        }}
      >
        Can you read it at {speedWpm} WPM? 👀
      </Interactive.Div>
    </AbsoluteFill>
  );
};
