import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./theme";

export const Outro: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Outro"
      style={{
        fontFamily,
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 90px",
        gap: 56,
        textAlign: "center",
      }}
    >
      <Interactive.Div
        name="Question"
        style={{
          fontSize: 110,
          fontWeight: 900,
          lineHeight: 1.05,
          scale: interpolate(frame, [0, 0.6 * fps], [0.85, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
          }),
        }}
      >
        How did you do? 🔥
      </Interactive.Div>
      <Interactive.Div
        name="Call to action"
        style={{
          fontSize: 54,
          fontWeight: 600,
          lineHeight: 1.3,
          opacity: interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Comment “DONE” if you finished the speed round without mistakes
      </Interactive.Div>
      <Interactive.Div
        name="Follow"
        style={{
          fontSize: 46,
          fontWeight: 800,
          color: "#0F172A",
          backgroundColor: "#FACC15",
          padding: "20px 44px",
          borderRadius: 40,
          opacity: interpolate(frame, [0.9 * fps, 1.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Follow {handle} for daily practice
      </Interactive.Div>
    </AbsoluteFill>
  );
};
