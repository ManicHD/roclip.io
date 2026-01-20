"use client";

import { motion } from "framer-motion";
import { Megaphone, Video, Banknote, ArrowRight, CheckCircle2 } from "lucide-react";

const steps = [
    {
        step: "01",
        title: "Start a Campaign",
        description: "Choose your budget and RPM. Your campaign instantly goes live to our network of creators.",
        icon: Megaphone,
        color: "blue",
    },
    {
        step: "02",
        title: "Creators Get to Work",
        description: "Creators make authentic, high-quality clips promoting your game on TikTok and YouTube Shorts.",
        icon: Video,
        color: "purple",
    },
    {
        step: "03",
        title: "Pay for Results",
        description: "You only pay for verifiable views. Watch your concurrents soar as the views roll in.",
        icon: Banknote,
        color: "green",
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/5 to-black pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    className="flex flex-col md:flex-row items-start md:items-end justify-between mb-24 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-400 max-w-xl leading-relaxed">
                            A simple, transparent process designed for speed and scale.
                        </p>
                    </div>
                </motion.div>

                <div className="relative">
                    {/* Desktop Connecting Line */}
                    <div className="hidden md:block absolute top-[2.5rem] left-0 right-0 h-px bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0" />
                    <motion.div
                        className="hidden md:block absolute top-[2.5rem] left-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-1/3 blur-sm"
                        animate={{
                            x: ["-100%", "300%"],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {steps.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="relative group"
                            >
                                {/* Step Indicator */}
                                <div className="flex items-center gap-4 mb-8 relative">
                                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-500/5 border border-${item.color}-500/20 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300 backdrop-blur-md`}>
                                        <item.icon className="w-8 h-8 text-white" />
                                        <div className={`absolute inset-0 bg-${item.color}-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                                    </div>
                                    <span className="text-8xl font-black text-white/5 absolute -top-4 -right-4 select-none pointer-events-none">
                                        {item.step}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                                    {item.title}
                                </h3>

                                <p className="text-gray-400 leading-relaxed text-lg border-l-2 border-white/5 pl-4 group-hover:border-blue-500/50 transition-colors duration-300">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
