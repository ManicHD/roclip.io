import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
    Img,
    staticFile,
} from "remotion";
import { COLORS } from "../colors";

export const LogoIntro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Logo scale animation
    const logoScale = spring({
        frame,
        fps,
        config: {
            damping: 12,
            stiffness: 100,
        },
    });

    // Logo opacity
    const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Glow pulse
    const glowIntensity = interpolate(
        Math.sin(frame / 10),
        [-1, 1],
        [0.3, 0.8]
    );

    // Fade out at end
    const fadeOut = interpolate(frame, [75, 90], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Particle effects
    const particles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i / 12) * Math.PI * 2,
        delay: i * 3,
    }));

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: "center",
                opacity: fadeOut,
            }}
        >
            {/* Particles radiating from center */}
            {particles.map((particle) => {
                const particleProgress = interpolate(
                    frame - particle.delay,
                    [0, 60],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const x = Math.cos(particle.angle) * particleProgress * 300;
                const y = Math.sin(particle.angle) * particleProgress * 300;
                const particleOpacity = interpolate(
                    particleProgress,
                    [0, 0.3, 1],
                    [0, 1, 0]
                );

                return (
                    <div
                        key={particle.id}
                        style={{
                            position: "absolute",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
                            boxShadow: `0 0 20px ${COLORS.primary}`,
                            transform: `translate(${x}px, ${y}px)`,
                            opacity: particleOpacity,
                        }}
                    />
                );
            })}

            {/* Glow behind logo */}
            <div
                style={{
                    position: "absolute",
                    width: 400,
                    height: 400,
                    background: `radial-gradient(circle, ${COLORS.primary}${Math.round(glowIntensity * 60).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
                    filter: "blur(40px)",
                }}
            />

            {/* Logo text (fallback since we can't use the actual logo file) */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: `scale(${logoScale})`,
                    opacity: logoOpacity,
                }}
            >
                {/* Logo icon placeholder - stylized BC */}
                <div
                    style={{
                        width: 180,
                        height: 180,
                        borderRadius: 40,
                        background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: `0 0 60px ${COLORS.primary}80`,
                        marginBottom: 30,
                    }}
                >
                    <span
                        style={{
                            fontSize: 80,
                            fontWeight: 900,
                            color: COLORS.text,
                            letterSpacing: -4,
                        }}
                    >
                        BC
                    </span>
                </div>

                {/* BloxClips text */}
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 900,
                        letterSpacing: -2,
                        background: `linear-gradient(90deg, ${COLORS.text}, ${COLORS.primaryLight})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    BloxClips
                </div>
            </div>
        </AbsoluteFill>
    );
};
