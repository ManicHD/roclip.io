import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import { LogoIntro } from "./scenes/LogoIntro";
import { Headline } from "./scenes/Headline";
import { Stats } from "./scenes/Stats";
import { HowItWorks } from "./scenes/HowItWorks";
import { CTA } from "./scenes/CTA";
import { COLORS } from "./colors";

export const BloxClipsAd: React.FC = () => {
    const { fps, width, height } = useVideoConfig();
    const isVertical = height > width;

    // Scene timing (in frames at 30fps)
    const INTRO_START = 0;
    const INTRO_DURATION = 90; // 3 seconds

    const HEADLINE_START = 75; // Slight overlap for smooth transition
    const HEADLINE_DURATION = 120; // 4 seconds

    const STATS_START = 180;
    const STATS_DURATION = 150; // 5 seconds

    const HOW_IT_WORKS_START = 315;
    const HOW_IT_WORKS_DURATION = 180; // 6 seconds

    const CTA_START = 480;
    const CTA_DURATION = 240; // 8 seconds (until end)

    return (
        <AbsoluteFill
            style={{
                backgroundColor: COLORS.background,
                fontFamily:
                    '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
            }}
        >
            {/* Animated background gradient */}
            <BackgroundGradient />

            {/* Scene sequences */}
            <Sequence from={INTRO_START} durationInFrames={INTRO_DURATION}>
                <LogoIntro />
            </Sequence>

            <Sequence from={HEADLINE_START} durationInFrames={HEADLINE_DURATION}>
                <Headline isVertical={isVertical} />
            </Sequence>

            <Sequence from={STATS_START} durationInFrames={STATS_DURATION}>
                <Stats isVertical={isVertical} />
            </Sequence>

            <Sequence from={HOW_IT_WORKS_START} durationInFrames={HOW_IT_WORKS_DURATION}>
                <HowItWorks isVertical={isVertical} />
            </Sequence>

            <Sequence from={CTA_START} durationInFrames={CTA_DURATION}>
                <CTA isVertical={isVertical} />
            </Sequence>
        </AbsoluteFill>
    );
};

// Animated background with gradient blobs
const BackgroundGradient: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const blob1X = interpolate(frame, [0, fps * 8], [20, 30], {
        extrapolateRight: "extend",
    });
    const blob1Y = interpolate(frame, [0, fps * 8], [-20, -10], {
        extrapolateRight: "extend",
    });
    const blob1Scale = interpolate(
        Math.sin(frame / 30),
        [-1, 1],
        [1, 1.2]
    );

    const blob2X = interpolate(frame, [0, fps * 10], [70, 80], {
        extrapolateRight: "extend",
    });
    const blob2Y = interpolate(frame, [0, fps * 10], [60, 70], {
        extrapolateRight: "extend",
    });

    return (
        <AbsoluteFill>
            {/* Blue blob */}
            <div
                style={{
                    position: "absolute",
                    top: `${blob1Y}%`,
                    left: `${blob1X}%`,
                    width: 600,
                    height: 600,
                    background: `radial-gradient(circle, ${COLORS.primary}40 0%, transparent 70%)`,
                    borderRadius: "50%",
                    filter: "blur(80px)",
                    transform: `scale(${blob1Scale})`,
                }}
            />
            {/* Purple blob */}
            <div
                style={{
                    position: "absolute",
                    top: `${blob2Y}%`,
                    left: `${blob2X}%`,
                    width: 500,
                    height: 500,
                    background: `radial-gradient(circle, ${COLORS.secondary}30 0%, transparent 70%)`,
                    borderRadius: "50%",
                    filter: "blur(100px)",
                }}
            />
            {/* Grid overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
            linear-gradient(to right, rgba(128,128,128,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(128,128,128,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                    maskImage:
                        "radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%)",
                }}
            />
        </AbsoluteFill>
    );
};
