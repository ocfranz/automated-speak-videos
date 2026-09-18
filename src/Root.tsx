import "./index.css";
import { Composition } from "remotion";
import {
  calculateSpeakingChallengeMetadata,
  SpeakingChallenge,
  speakingChallengeSchema,
} from "./SpeakingChallenge";
import { DEFAULT_STYLE } from "./SpeakingChallenge/theme";
import prompts from "./prompts.json";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SpeakingChallenge"
        component={SpeakingChallenge}
        calculateMetadata={calculateSpeakingChallengeMetadata}
        schema={speakingChallengeSchema}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={20 * 30}
        defaultProps={{
          ...DEFAULT_STYLE,
          text: prompts[0].text,
          introSrc: "intro.mp3",
        }}
      />
    </>
  );
};
