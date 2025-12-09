"use client";

import { cn } from "@/app/lib/utils";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Share2, BarChart3 } from "lucide-react";

const features = [
    {
        title: "Creator Network",
        description: "Leverage a network of 50M+ subscribers. Your clips are automatically distributed to top creators, reaching millions of potential players.",
        icon: Zap,
        className: "",
        gradient: "from-blue-500/20 to-blue-600/20",
    },
    {
        title: "Millions of Views",
        description: "Get millions of views and tens of creators promoting your game.",
        icon: TrendingUp,
        className: "",
        gradient: "from-blue-400/20 to-blue-500/20",
    },
    {
        title: "One-Click Distribution",
        description: "Distribute to TikTok, YouTube Shorts, and Instagram Reels simultaneously. Maximize reach across all platforms.",
        icon: Share2,
        className: "",
        gradient: "from-blue-500/20 to-blue-700/20",
    },
    {
        title: "Grow Your Player Base",
        description: "Convert views into active players. Track conversions and engagement with real-time analytics.",
        icon: BarChart3,
        className: "",
        gradient: "from-blue-600/20 to-blue-800/20",
    },
];

export default function BentoGrid() {
    return (
        <section id="features" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 bg-black relative overflow-hidden">
            <div className="max-w-[95vw] lg:max-w-[90vw] xl:max-w-[85vw] 2xl:max-w-[1400px] mx-auto">
                <motion.div
                    className="text-center mb-12 sm:mb-16 md:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.h2
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 md:mb-5 bg-clip-text text-transparent bg-gradient-to-b from-white via-blue-100 to-blue-400 leading-tight px-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Built for Roblox Developers
                    </motion.h2>
                    <motion.p
                        className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        Transform gameplay moments into viral content that drives millions of views and grows your player base.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 auto-rows-fr">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.1,
                                ease: [0.16, 1, 0.3, 1],
                                opacity: { duration: 0.5 },
                                scale: { duration: 0.5 }
                            }}
                            viewport={{ once: true, margin: "-50px" }}
                            whileHover={{
                                y: -4,
                                scale: 1.01,
                                transition: { duration: 0.2, ease: "easeOut" }
                            }}
                            className={cn(
                                "group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] via-white/[0.05] to-white/[0.03] p-4 sm:p-6 md:p-8 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/[0.05] hover:via-white/[0.08] hover:to-white/[0.05] transition-all duration-200 h-full",
                                feature.className
                            )}
                        >

                            <div className="relative z-10 flex flex-col h-full text-left">
                                <motion.div
                                    className="p-2.5 sm:p-3.5 bg-white/5 w-fit rounded-xl backdrop-blur-sm group-hover:bg-white/10 transition-all duration-200 border border-white/5 group-hover:border-white/15 mb-3 sm:mb-4"
                                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.12 + 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{
                                        scale: 1.1,
                                        rotate: [0, -5, 5, -5, 0],
                                        transition: { duration: 0.5 }
                                    }}
                                >
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <feature.icon suppressHydrationWarning className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-gray-100 transition-colors duration-200" />
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: i * 0.12 + 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <motion.h3
                                        className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-gray-100 transition-colors duration-200 leading-tight"
                                        whileHover={{ x: 4, transition: { duration: 0.2 } }}
                                    >
                                        {feature.title}
                                    </motion.h3>
                                    <motion.p
                                        className="text-xs sm:text-sm md:text-sm lg:text-base text-white/80 group-hover:text-white leading-relaxed transition-colors duration-200"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: i * 0.12 + 0.5 }}
                                    >
                                        {feature.description}
                                    </motion.p>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
