"use client";

import { useMotionValue, useMotionTemplate, motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function GlobalSpotlight() {
    const [mounted, setMounted] = useState(false);
    const mouseX = useMotionValue(-100); // Start off-screen
    const mouseY = useMotionValue(-100);

    // Smooth springs for that "fluid" feel
    const springX = useSpring(mouseX, { stiffness: 50, damping: 25 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 25 });

    // Must call useMotionTemplate before any conditional returns (Rules of Hooks)
    const background = useMotionTemplate`
        radial-gradient(
            600px circle at ${springX}px ${springY}px,
            rgba(37, 99, 235, 0.15),
            transparent 80%
        )
    `;

    useEffect(() => {
        setMounted(true);

        function handleMouseMove({ clientX, clientY }: MouseEvent) {
            mouseX.set(clientX);
            mouseY.set(clientY);
        }

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // Don't render on server to avoid hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-[9999] opacity-100 mix-blend-screen"
            style={{ background }}
        />
    );
}

