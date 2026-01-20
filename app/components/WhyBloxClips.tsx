"use client";

import { motion } from "framer-motion";
import { Target, Users, TrendingUp, Shield, DollarSign, Zap } from "lucide-react";

const reasons = [
    {
        icon: Target,
        title: "Beyond Traditional Sponsors",
        description: "Roblox sponsors reach players in-game. We reach them everywhere else - YouTube, TikTok, Instagram.",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        icon: Users,
        title: "Largest Creator Network",
        description: "Access 50M+ combined subscribers across our creator network. Real creators making authentic content that converts.",
        gradient: "from-purple-500 to-pink-500",
    },
    {
        icon: TrendingUp,
        title: "Viral Potential",
        description: "Short-form content goes viral. One clip can generate millions of views and thousands of new players overnight.",
        gradient: "from-green-500 to-emerald-500",
    },
    {
        icon: Shield,
        title: "Quality Controlled",
        description: "Every submission is manually reviewed. No bots, no fake views - only real engagement from real creators.",
        gradient: "from-orange-500 to-yellow-500",
    },
    {
        icon: DollarSign,
        title: "Pay Per Performance",
        description: "Only pay for approved views. Set your RPM, your budget, your rules. Full transparency on every dollar spent.",
        gradient: "from-red-500 to-rose-500",
    },
    {
        icon: Zap,
        title: "Launch in Minutes",
        description: "Create a campaign, fund it, and watch creators start promoting fast.",
        gradient: "from-indigo-500 to-blue-500",
    },
];

export default function WhyBloxClips() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black opacity-40 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 tracking-wide uppercase">
                        The BloxClips Advantage
                    </span>
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
                        What Roblox Sponsors{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
                            Can&apos;t Do
                        </span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                        Traditional ads only reach players <span className="text-white font-medium">already on Roblox</span>.
                        We reach the millions <span className="text-white font-medium">who haven&apos;t discovered you yet</span>.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative h-full"
                        >
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative h-full p-8 rounded-3xl border border-white/5 bg-neutral-900/50 backdrop-blur-sm group-hover:border-white/10 transition-all duration-300">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                        <reason.icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-4">
                                        {reason.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed font-light">
                                        {reason.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-20 p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md w-full max-w-3xl mx-auto relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-blue-500/10 blur-[100px] group-hover:bg-blue-500/20 transition-colors duration-700" />

                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                        <div className="text-center border-b sm:border-b-0 sm:border-r border-white/10 pb-8 sm:pb-0">
                            <div className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-2">
                                50M+
                            </div>
                            <div className="text-blue-300 font-medium tracking-widest uppercase text-sm">
                                Creator Subscribers
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-2">
                                100M+
                            </div>
                            <div className="text-blue-300 font-medium tracking-widest uppercase text-sm">
                                Views Generated
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
