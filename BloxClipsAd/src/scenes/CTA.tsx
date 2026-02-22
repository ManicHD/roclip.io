import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
} from "remotion";
import { COLORS } from "../colors";

interface CTAProps {
    isVertical: boolean;
}

export const CTA: React.FC<CTAProps> = ({ isVertical }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Background pulse
    const bgPulse = interpolate(
        Math.sin(frame / 20),
        [-1, 1],
        [0.8, 1]
    );

    // Main content entrance
    const contentScale = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 80 },
    });

    const contentOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Taglines stagger
    const tagline1 = spring({
        frame: frame - 30,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    const tagline2 = spring({
        frame: frame - 45,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    // Button animation
    const buttonScale = spring({
        frame: frame - 60,
        fps,
        config: { damping: 10, stiffness: 120 },
    });

    // URL reveal
    const urlOpacity = interpolate(frame, [80, 100], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Floating particles behind
    const particles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: (i % 4) * 25 + 12.5,
        y: Math.floor(i / 4) * 50 + 25,
        delay: i * 10,
    }));

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: "center",
                padding: isVertical ? 40 : 80,
            }}
        >
            {/* Background glow */}
            <div
                style={{
                    position: "absolute",
                    width: "140%",
                    height: "140%",
                    background: `radial-gradient(ellipse at center, ${COLORS.primary}20 0%, transparent 60%)`,
                    transform: `scale(${bgPulse})`,
                }}
            />

            {/* Floating particles */}
            {particles.map((p) => {
                const particleY = interpolate(
                    (frame + p.delay) % 120,
                    [0, 120],
                    [100, -10],
                    { extrapolateRight: "clamp" }
                );
                const particleOpacity = interpolate(
                    (frame + p.delay) % 120,
                    [0, 30, 90, 120],
                    [0, 0.5, 0.5, 0]
                );

                return (
                    <div
                        key={p.id}
                        style={{
                            position: "absolute",
                            left: `${p.x}%`,
                            top: `${particleY}%`,
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: COLORS.primary,
                            opacity: particleOpacity,
                            boxShadow: `0 0 10px ${COLORS.primary}`,
                        }}
                    />
                );
            })}

            {/* Main content */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: `scale(${contentScale})`,
                    opacity: contentOpacity,
                    zIndex: 10,
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        width: 120,
                        height: 120,
                        borderRadius: 32,
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: `0 0 80px ${COLORS.primary}60`,
                        marginBottom: 40,
                    }}
                >
                    <span
                        style={{
                            fontSize: 56,
                            fontWeight: 900,
                            color: COLORS.text,
                            letterSpacing: -2,
                        }}
                    >
                        BC
                    </span>
                </div>

                {/* For Developers tagline */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                        marginBottom: 15,
                        transform: `translateY(${(1 - tagline1) * 30}px)`,
                        opacity: tagline1,
                    }}
                >
                    <span style={{ fontSize: 32 }}>🎮</span>
                    <span
                        style={{
                            fontSize: isVertical ? 28 : 36,
                            fontWeight: 700,
                            color: COLORS.text,
                        }}
                    >
                        Developers:
                    </span>
                    <span
                        style={{
                            fontSize: isVertical ? 28 : 36,
                            fontWeight: 400,
                            color: COLORS.primaryLight,
                        }}
                    >
                        Get your game viral
                    </span>
                </div>

                {/* For Creators tagline */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 15,
                        marginBottom: 50,
                        transform: `translateY(${(1 - tagline2) * 30}px)`,
                        opacity: tagline2,
                    }}
                >
                    <span style={{ fontSize: 32 }}>🎬</span>
                    <span
                        style={{
                            fontSize: isVertical ? 28 : 36,
                            fontWeight: 700,
                            color: COLORS.text,
                        }}
                    >
                        Creators:
                    </span>
                    <span
                        style={{
                            fontSize: isVertical ? 28 : 36,
                            fontWeight: 400,
                            color: COLORS.secondary,
                        }}
                    >
                        Get paid to clip
                    </span>
                </div>

                {/* Join button */}
                <div
                    style={{
                        transform: `scale(${buttonScale})`,
                        opacity: buttonScale,
                        marginBottom: 30,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 15,
                            padding: "20px 50px",
                            borderRadius: 20,
                            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
                            boxShadow: `0 0 40px ${COLORS.primary}50, 0 10px 40px rgba(0,0,0,0.3)`,
                            cursor: "pointer",
                        }}
                    >
                        {/* Discord icon placeholder */}
                        <span style={{ fontSize: 32 }}>💬</span>
                        <span
                            style={{
                                fontSize: isVertical ? 28 : 32,
                                fontWeight: 800,
                                color: COLORS.text,
                                letterSpacing: 1,
                            }}
                        >
                            JOIN DISCORD
                        </span>
                    </div>
                </div>

                {/* Website URL */}
                <div
                    style={{
                        opacity: urlOpacity,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <div
                        style={{
                            fontSize: isVertical ? 20 : 24,
                            color: COLORS.textMuted,
                            letterSpacing: 2,
                        }}
                    >
                        or visit
                    </div>
                    <div
                        style={{
                            fontSize: isVertical ? 44 : 56,
                            fontWeight: 900,
                            letterSpacing: -1,
                            background: `linear-gradient(90deg, ${COLORS.text}, ${COLORS.primaryLight})`,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        roclip.io
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
