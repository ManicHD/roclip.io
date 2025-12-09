"use client";

import { motion } from "framer-motion";
import { Megaphone, Video, Send, Banknote, ArrowRight } from "lucide-react";

const steps = [
    {
        step: "01",
        title: "Choose a Campaign",
        description: "Pick any active campaign you want to make a video for.",
        icon: Megaphone,
    },
    {
        step: "02",
        title: "Create & Upload",
        description: "Make your short/video, follow the campaign rules, and upload it publicly.",
        icon: Video,
    },
    {
        step: "03",
        title: "Submit Your Video",
        description: "Go to the submission channel, click Submit Video, and paste your link.",
        icon: Send,
    },
    {
        step: "04",
        title: "Earn From Your Views",
        description: "For every 1,000 approved views, you get paid.",
        icon: Banknote,
    },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        How It Works
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Start earning from your existing content in 5 simple steps.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connection Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-900/20 via-blue-500/20 to-violet-900/20 -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((item, index) => (
                            <motion.div
                                key={index}
                                className="group relative"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {/* Desktop Arrow */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 transform text-blue-500/20 z-0">
                                        <ArrowRight suppressHydrationWarning className="w-6 h-6" />
                                    </div>
                                )}

                                <div className="relative flex flex-col items-center text-center p-6 h-full rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-white/10">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                                        <item.icon suppressHydrationWarning className="w-6 h-6 text-blue-400" />
                                    </div>

                                    <span className="text-xs font-bold text-blue-600 mb-2 px-2 py-1 rounded-full bg-blue-950/30 border border-blue-900/50">
                                        STEP {item.step}
                                    </span>

                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
