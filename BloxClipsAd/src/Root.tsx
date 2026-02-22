import { Composition } from "remotion";
import { BloxClipsAd } from "./BloxClipsAd";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* Vertical (TikTok/Shorts) - 1080x1920 */}
            <Composition
                id="BloxClipsAd"
                component={BloxClipsAd}
                durationInFrames={720} // 24 seconds at 30fps
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{}}
            />
            {/* Horizontal (YouTube) - 1920x1080 */}
            <Composition
                id="BloxClipsAdHorizontal"
                component={BloxClipsAd}
                durationInFrames={720}
                fps={30}
                width={1920}
                height={1080}
                defaultProps={{}}
            />
        </>
    );
};
