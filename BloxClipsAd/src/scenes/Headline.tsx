import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
} from "remotion";
import { COLORS } from "../colors";

interface HeadlineProps {
    isVertical: boolean;
}

export const Headline: React.FC<HeadlineProps> = ({ isVertical }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Staggered word animations
    const clipEnter = spring({
        frame: frame - 10,
        fps,
        config: { damping: 12, stiffness: 80 },
    });

    const robloxEnter = spring({
        frame: frame - 25,
        fps,
        config: { damping: 12, stiffness: 80 },
    });

    const gamesEnter = spring({
        frame: frame - 40,
        fps,
        config: { damping: 12, stiffness: 80 },
    });

    // Gradient animation for ROBLOX text
    const gradientPosition = interpolate(frame, [0, 120], [0, 200], {
        extrapolateRight: "extend",
    });

    // Subtitle fade in
    const subtitleOpacity = interpolate(frame, [55, 70], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const subtitleY = interpolate(frame, [55, 70], [30, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Badge animation
    const badgeScale = spring({
        frame: frame - 5,
        fps,
        config: { damping: 15, stiffness: 100 },
    });

    // Fade out
    const fadeOut = interpolate(frame, [100, 120], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const fontSize = isVertical ? 100 : 140;
    const subtitleSize = isVertical ? 32 : 40;

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: "center",
                opacity: fadeOut,
                padding: isVertical ? 40 : 80,
            }}
        >
            {/* Trusted badge */}
            <div
                style={{
                    position: "absolute",
                    top: isVertical ? "20%" : "25%",
                    transform: `scale(${badgeScale})`,
                    padding: "12px 28px",
                    borderRadius: 50,
                    border: `1px solid ${COLORS.primary}50`,
                    background: `${COLORS.primary}15`,
                    backdropFilter: "blur(10px)",
                    boxShadow: `0 0 30px ${COLORS.primary}30`,
                }}
            >
                <span
                    style={{
                        fontSize: isVertical ? 18 : 22,
                        fontWeight: 600,
                        color: COLORS.primaryLight,
                        letterSpacing: 1,
                    }}
                >
                    ✦ TRUSTED BY 1,000+ CREATORS
                </span>
            </div>

            {/* Main headline */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                {/* CLIP */}
                <div
                    style={{
                        fontSize,
                        fontWeight: 900,
                        color: COLORS.text,
                        letterSpacing: -4,
                        lineHeight: 0.9,
                        transform: `translateY(${(1 - clipEnter) * 100}px)`,
                        opacity: clipEnter,
                    }}
                >
                    CLIP
                </div>

                {/* ROBLOX - with animated gradient */}
                <div
                    style={{
                        fontSize,
                        fontWeight: 900,
                        letterSpacing: -4,
                        lineHeight: 0.9,
                        background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight}, ${COLORS.primary})`,
                        backgroundSize: "200% 100%",
                        backgroundPosition: `${gradientPosition}% 0`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        transform: `translateY(${(1 - robloxEnter) * 100}px)`,
                        opacity: robloxEnter,
                    }}
                >
                    ROBLOX
                </div>

                {/* GAMES */}
                <div
                    style={{
                        fontSize,
                        fontWeight: 900,
                        color: COLORS.text,
                        letterSpacing: -4,
                        lineHeight: 0.9,
                        transform: `translateY(${(1 - gamesEnter) * 100}px)`,
                        opacity: gamesEnter,
                        position: "relative",
                    }}
                >
                    GAMES
                    {/* Underline accent */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: -5,
                            left: 0,
                            right: 0,
                            height: 20,
                            background: `${COLORS.primary}30`,
                            transform: `skewX(-12deg) scaleX(${gamesEnter})`,
                            transformOrigin: "left",
                        }}
                    />
                </div>
            </div>

            {/* Subtitle */}
            <div
                style={{
                    position: "absolute",
                    bottom: isVertical ? "25%" : "20%",
                    opacity: subtitleOpacity,
                    transform: `translateY(${subtitleY}px)`,
                    textAlign: "center",
                    maxWidth: isVertical ? "90%" : "70%",
                }}
            >
                <span
                    style={{
                        fontSize: subtitleSize,
                        color: COLORS.textMuted,
                        lineHeight: 1.4,
                    }}
                >
                    The #1 platform bridging{" "}
                    <span style={{ color: COLORS.text, fontWeight: 600 }}>
                        Developers
                    </span>{" "}
                    and{" "}
                    <span style={{ color: COLORS.text, fontWeight: 600 }}>
                        Content Creators
                    </span>
                </span>
            </div>
        </AbsoluteFill>
    );
};
