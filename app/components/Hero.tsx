"use client";

import { Play, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-950 via-black to-black flex flex-col justify-center items-center text-center py-12 sm:py-0">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#6b728020_1px,transparent_1px),linear-gradient(to_bottom,#6b728020_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem]" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center text-center">
                <motion.h1 
                    className="mb-3 sm:mb-4 text-6xl sm:text-7xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white leading-[1.1]"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    CLIP YOUR <br />
                    <motion.span 
                        className="inline-block"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">ROBLOX</span>{' '}
                        <span className="text-white">GAMES</span>
                    </motion.span>
                </motion.h1>

                <motion.p 
                    className="mb-8 sm:mb-10 text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl max-w-2xl mx-auto leading-relaxed px-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    Make money promoting Roblox games by just clipping.
                </motion.p>

                <motion.div 
                    className="flex flex-col items-center justify-center gap-3 w-full sm:w-auto sm:flex-row sm:gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <a
                        href="https://discord.gg/RJ5WuJVkc9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex h-10 sm:h-10 md:h-10 lg:h-12 items-center justify-center gap-2 rounded-full bg-gray-300 sm:bg-white px-4 sm:px-6 md:px-6 lg:px-8 text-sm sm:text-sm md:text-sm lg:text-base font-bold text-black transition-all duration-200 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] w-[180px] sm:w-auto"
                    >
                        <span>For Creators</span>
                        <ArrowRight className="h-4 w-4 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>

                    <a
                        href="https://discord.gg/EypmYEjyBf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex h-10 sm:h-10 md:h-10 lg:h-12 items-center justify-center gap-2 rounded-full bg-gray-900 px-4 sm:px-6 md:px-6 lg:px-8 text-sm sm:text-sm md:text-sm lg:text-base font-bold text-white transition-all duration-200 hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] w-[180px] sm:w-auto"
                    >
                        <Play className="h-4 w-4 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5 fill-current transition-colors duration-200" />
                        <span>For Developers</span>
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
