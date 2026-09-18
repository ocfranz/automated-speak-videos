import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      name="Background"
      style={{
        background: `radial-gradient(circle at ${interpolate(frame, [0, durationInFrames], [20, 80])}% 15%, #312E81 0%, #0F172A 55%, #020617 100%)`,
      }}
    />
  );
};
