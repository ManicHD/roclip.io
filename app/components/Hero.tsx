"use client";

import { ArrowRight, ArrowDown, Play, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { YouTubeIcon, TikTokIcon } from './PlatformIcons';
import BackgroundParticles from './BackgroundParticles';

export default function Hero() {
    return (
        <div
            className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col justify-center items-center text-center group"
        >
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                {/* Radial Gradient Blob */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen"
                />



                {/* Particles */}
                <BackgroundParticles />
            </div>

            {/* Floating Elements (Absolute Positioned around the center) */}
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                {/* Left Floating Card - YouTube Analytics */}
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, y: [0, -15, 0] }}
                    transition={{
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        opacity: { duration: 1 }
                    }}
                    className="absolute top-[15%] left-[5%] md:left-[10%] lg:left-[15%] rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl rotate-[-6deg] hidden sm:block overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                    <div className="relative p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/20">
                            <YouTubeIcon className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-xs text-red-200 font-medium mb-0.5">Total Views</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xl font-bold text-white">100M+</p>
                                <TrendingUp className="h-4 w-4 text-green-400" />
                            </div>
                        </div>
                    </div>
                </motion.div>








                {/* Right Floating Icon - Play */}
                <motion.div
                    initial={{ opacity: 0, x: 50, rotate: 20 }}
                    animate={{ opacity: 1, x: 0, rotate: 10, y: [0, 20, 0] }}
                    transition={{
                        opacity: { duration: 1, delay: 0.7 },
                        x: { duration: 1, delay: 0.7 },
                        y: { duration: 7, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute top-[30%] right-[10%] hidden lg:flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 backdrop-blur-md"
                >
                    <Play className="w-10 h-10 text-purple-400 fill-purple-400/50" />
                </motion.div>


            </div>

            {/* Main Content */}
            <div className="relative z-20 max-w-5xl mx-auto px-4 flex flex-col items-center justify-center">

                <motion.h1
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-none mb-6 p-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    CLIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_auto] animate-gradient pr-2">ROBLOX</span>
                    <br />
                    <span className="relative inline-block mt-2">
                        GAMES
                        <motion.div
                            className="absolute -bottom-2 left-0 right-0 h-4 bg-blue-600/20 -skew-x-12 -z-10"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        />
                    </span>
                </motion.h1>

                <motion.p
                    className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    The #1 platform bridging the gap between <span className="text-white font-semibold">Developers</span> and <span className="text-white font-semibold">Content Creators</span>.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <a
                        href="https://discord.gg/q5Ew3bQnB5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:bg-blue-500 hover:scale-[1.02] hover:shadow-blue-500/50"
                    >
                        <span>Join Discord</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>

                    <a
                        href="#how-it-works"
                        className="group relative flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-8 text-base font-bold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
                    >
                        <span>How it Works</span>
                        <ArrowDown className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
                >
                    <span className="text-xs uppercase tracking-widest text-gray-500">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
                </motion.div>
            </div>
        </div >
    );
}
