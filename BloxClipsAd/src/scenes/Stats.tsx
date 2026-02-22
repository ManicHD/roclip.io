import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
} from "remotion";
import { COLORS } from "../colors";

interface StatsProps {
    isVertical: boolean;
}

const stats = [
    { value: 50, suffix: "M+", label: "Creator Subscribers" },
    { value: 100, suffix: "M+", label: "Views Generated" },
    { value: 1000, suffix: "+", label: "Active Creators" },
];

export const Stats: React.FC<StatsProps> = ({ isVertical }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
    });
    const titleY = interpolate(frame, [0, 20], [40, 0], {
        extrapolateRight: "clamp",
    });

    // Fade out
    const fadeOut = interpolate(frame, [130, 150], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                justifyContent: "center",
                alignItems: "center",
                opacity: fadeOut,
                padding: isVertical ? 40 : 80,
            }}
        >
            {/* Section title */}
            <div
                style={{
                    position: "absolute",
                    top: isVertical ? "15%" : "20%",
                    opacity: titleOpacity,
                    transform: `translateY(${titleY}px)`,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        padding: "10px 24px",
                        borderRadius: 30,
                        background: `${COLORS.primary}15`,
                        border: `1px solid ${COLORS.primary}30`,
                        marginBottom: 20,
                    }}
                >
                    <span
                        style={{
                            fontSize: isVertical ? 16 : 20,
                            fontWeight: 600,
                            color: COLORS.primary,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                        }}
                    >
                        The BloxClips Advantage
                    </span>
                </div>
                <h2
                    style={{
                        fontSize: isVertical ? 48 : 64,
                        fontWeight: 800,
                        color: COLORS.text,
                        letterSpacing: -2,
                        margin: 0,
                    }}
                >
                    Real{" "}
                    <span
                        style={{
                            background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.secondary})`,
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Results
                    </span>
                </h2>
            </div>

            {/* Stats grid */}
            <div
                style={{
                    display: "flex",
                    flexDirection: isVertical ? "column" : "row",
                    gap: isVertical ? 50 : 80,
                    marginTop: isVertical ? 100 : 0,
                }}
            >
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        value={stat.value}
                        suffix={stat.suffix}
                        label={stat.label}
                        delay={index * 15}
                        isVertical={isVertical}
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
};

interface StatCardProps {
    value: number;
    suffix: string;
    label: string;
    delay: number;
    isVertical: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
    value,
    suffix,
    label,
    delay,
    isVertical,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Card entrance
    const cardScale = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, stiffness: 80 },
    });

    // Number counting animation
    const countProgress = interpolate(frame - delay, [0, 60], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
    const displayValue = Math.floor(value * countProgress);

    // Glow intensity
    const glowPulse = interpolate(
        Math.sin((frame - delay) / 15),
        [-1, 1],
        [0.3, 0.6]
    );

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `scale(${cardScale})`,
                opacity: cardScale,
            }}
        >
            {/* Value */}
            <div
                style={{
                    fontSize: isVertical ? 80 : 100,
                    fontWeight: 900,
                    letterSpacing: -4,
                    background: `linear-gradient(180deg, ${COLORS.text}, ${COLORS.textMuted})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: `0 0 60px ${COLORS.primary}${Math.round(glowPulse * 255).toString(16).padStart(2, '0')}`,
                    lineHeight: 1,
                }}
            >
                {displayValue.toLocaleString()}
                <span
                    style={{
                        background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {suffix}
                </span>
            </div>

            {/* Label */}
            <div
                style={{
                    fontSize: isVertical ? 20 : 24,
                    fontWeight: 500,
                    color: COLORS.primary,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginTop: 10,
                }}
            >
                {label}
            </div>
        </div>
    );
};
