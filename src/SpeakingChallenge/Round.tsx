import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily, ROUND_STYLE } from "./theme";
import { ROUND_LEAD_IN_SECONDS, RoundPlan } from "./timing";

const getFontSize = (text: string) => {
  // Fit the paragraph in a ~900x1000px box. Montserrat averages ~0.6em per char.
  const size = Math.sqrt((900 * 1000) / (text.length * 0.6 * 1.45));
  return Math.floor(Math.min(80, Math.max(40, size)));
};

export const Round: React.FC<{
  round: RoundPlan;
  roundNumber: number;
  roundCount: number;
  text: string;
  words: string[];
  wordStarts: number[];
  voiceSrc: string | null;
}> = ({ round, roundNumber, roundCount, text, words, wordStarts, voiceSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const style = ROUND_STYLE[round.kind];

  const leadIn = ROUND_LEAD_IN_SECONDS * fps;
  const readFrames = round.readSeconds * fps;
  const progress = (frame - leadIn) / readFrames;

  let current = -1;
  if (progress >= 1) {
    current = words.length;
  } else if (progress >= 0) {
    current = wordStarts.findIndex((s, i) => progress >= s && progress < wordStarts[i + 1]);
  }

  const countdown = Math.ceil((leadIn - frame) / (leadIn / 3));
  const fontSize = getFontSize(text);

  return (
    <AbsoluteFill
      name="Round"
      style={{
        fontFamily,
        color: "white",
        alignItems: "center",
        padding: "150px 80px 0",
      }}
    >
      {voiceSrc && round.kind === "listen" ? (
        <Sequence from={leadIn} name="Voice" layout="none">
          <Audio src={staticFile(voiceSrc)} />
        </Sequence>
      ) : null}

      <div
        style={{
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: 4,
          color: style.accent,
        }}
      >
        ROUND {roundNumber}/{roundCount}
      </div>
      <Interactive.Div
        name="Round title"
        style={{
          fontSize: 96,
          fontWeight: 900,
          marginTop: 8,
          scale: interpolate(frame, [0, 0.5 * fps], [0.8, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {style.title}
      </Interactive.Div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 600,
          marginTop: 12,
          opacity: 0.85,
          textAlign: "center",
        }}
      >
        {style.instruction}
      </div>

      <div
        style={{
          marginTop: 56,
          width: "100%",
          flex: 1,
          maxHeight: 1080,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          borderRadius: 44,
          backgroundColor: "rgba(255,255,255,0.06)",
          border: `3px solid ${style.accent}55`,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize,
            fontWeight: 800,
            lineHeight: 1.45,
            textAlign: "left",
          }}
        >
          {words.map((word, i) => {
            const isCurrent = i === current;
            return (
              <span key={i}>
                <span
                  style={{
                    padding: "2px 10px",
                    margin: "0 -10px",
                    borderRadius: 14,
                    backgroundColor: isCurrent ? style.accent : "transparent",
                    color: isCurrent ? "#0F172A" : "white",
                    opacity: isCurrent || i < current ? 1 : 0.38,
                    boxDecorationBreak: "clone",
                    WebkitBoxDecorationBreak: "clone",
                  }}
                >
                  {word}
                </span>{" "}
              </span>
            );
          })}
        </p>
      </div>

      <div
        style={{
          width: "100%",
          height: 260,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
        }}
      >
        {frame < leadIn ? (
          <div style={{ fontSize: 88, fontWeight: 900, color: style.accent }}>
            {countdown}
          </div>
        ) : (
          <>
            <div
              style={{
                width: "100%",
                height: 18,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.15)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
                  backgroundColor: style.accent,
                }}
              />
            </div>
            <div style={{ fontSize: 44, fontWeight: 800 }}>⚡ {round.wpm} words / min</div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
