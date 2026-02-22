import {
    AbsoluteFill,
    useCurrentFrame,
    interpolate,
    spring,
    useVideoConfig,
} from "remotion";
import { COLORS } from "../colors";

interface HowItWorksProps {
    isVertical: boolean;
}

const steps = [
    {
        number: "01",
        title: "Start a Campaign",
        description: "Set your budget and RPM",
        icon: "📣",
        color: COLORS.primary,
    },
    {
        number: "02",
        title: "Creators Get to Work",
        description: "Authentic clips on TikTok & YouTube",
        icon: "🎬",
        color: COLORS.secondary,
    },
    {
        number: "03",
        title: "Pay for Results",
        description: "Only pay for verified views",
        icon: "💰",
        color: "#22c55e",
    },
];

export const HowItWorks: React.FC<HowItWorksProps> = ({ isVertical }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Title animation
    const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Fade out
    const fadeOut = interpolate(frame, [160, 180], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Connecting line animation
    const lineProgress = interpolate(frame, [40, 120], [0, 100], {
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
            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: isVertical ? "10%" : "15%",
                    opacity: titleOpacity,
                    textAlign: "center",
                }}
            >
                <h2
                    style={{
                        fontSize: isVertical ? 52 : 72,
                        fontWeight: 800,
                        color: COLORS.text,
                        letterSpacing: -2,
                        margin: 0,
                    }}
                >
                    How It Works
                </h2>
                <p
                    style={{
                        fontSize: isVertical ? 22 : 28,
                        color: COLORS.textMuted,
                        marginTop: 15,
                    }}
                >
                    Simple. Transparent. Effective.
                </p>
            </div>

            {/* Steps */}
            <div
                style={{
                    display: "flex",
                    flexDirection: isVertical ? "column" : "row",
                    gap: isVertical ? 60 : 100,
                    marginTop: isVertical ? 140 : 80,
                    position: "relative",
                }}
            >
                {/* Connecting line (horizontal layout) */}
                {!isVertical && (
                    <div
                        style={{
                            position: "absolute",
                            top: 50,
                            left: 100,
                            right: 100,
                            height: 2,
                            background: `linear-gradient(90deg, 
                ${COLORS.primary} 0%, 
                ${COLORS.secondary} 50%, 
                #22c55e 100%)`,
                            opacity: 0.3,
                            clipPath: `inset(0 ${100 - lineProgress}% 0 0)`,
                        }}
                    />
                )}

                {/* Connecting line (vertical layout) */}
                {isVertical && (
                    <div
                        style={{
                            position: "absolute",
                            top: 50,
                            bottom: 50,
                            left: "50%",
                            width: 2,
                            transform: "translateX(-50%)",
                            background: `linear-gradient(180deg, 
                ${COLORS.primary} 0%, 
                ${COLORS.secondary} 50%, 
                #22c55e 100%)`,
                            opacity: 0.3,
                            clipPath: `inset(0 0 ${100 - lineProgress}% 0)`,
                        }}
                    />
                )}

                {steps.map((step, index) => (
                    <StepCard
                        key={index}
                        step={step}
                        index={index}
                        isVertical={isVertical}
                    />
                ))}
            </div>
        </AbsoluteFill>
    );
};

interface StepCardProps {
    step: (typeof steps)[0];
    index: number;
    isVertical: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ step, index, isVertical }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const delay = 20 + index * 25;

    // Card entrance
    const cardScale = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, stiffness: 80 },
    });

    const cardOpacity = interpolate(frame - delay, [0, 15], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Icon bounce
    const iconBounce = spring({
        frame: frame - delay - 10,
        fps,
        config: { damping: 8, stiffness: 150 },
    });

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `scale(${cardScale})`,
                opacity: cardOpacity,
                width: isVertical ? "auto" : 240,
            }}
        >
            {/* Icon container */}
            <div
                style={{
                    width: 100,
                    height: 100,
                    borderRadius: 28,
                    background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                    border: `2px solid ${step.color}40`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 48,
                    transform: `scale(${iconBounce})`,
                    boxShadow: `0 0 40px ${step.color}30`,
                    marginBottom: 20,
                }}
            >
                {step.icon}
            </div>

            {/* Step number */}
            <div
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: step.color,
                    letterSpacing: 3,
                    marginBottom: 8,
                }}
            >
                STEP {step.number}
            </div>

            {/* Title */}
            <div
                style={{
                    fontSize: isVertical ? 26 : 24,
                    fontWeight: 700,
                    color: COLORS.text,
                    textAlign: "center",
                    marginBottom: 8,
                }}
            >
                {step.title}
            </div>

            {/* Description */}
            <div
                style={{
                    fontSize: isVertical ? 18 : 16,
                    color: COLORS.textMuted,
                    textAlign: "center",
                }}
            >
                {step.description}
            </div>
        </div>
    );
};
