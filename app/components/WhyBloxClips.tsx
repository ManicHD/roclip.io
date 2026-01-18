"use client";

import { motion } from "framer-motion";
import { Target, Users, TrendingUp, Shield, DollarSign, Zap } from "lucide-react";

const reasons = [
    {
        icon: Target,
        title: "Beyond Traditional Sponsors",
        description: "Roblox sponsors reach players in-game. We reach them everywhere else — YouTube, TikTok, Instagram. Digital influence drives real downloads.",
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
        description: "Every submission is manually reviewed. No bots, no fake views — only real engagement from real creators.",
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
        description: "Create a campaign, fund it, and watch creators start promoting within hours. No minimums.",
        gradient: "from-indigo-500 to-blue-500",
    },
];

export default function WhyBloxClips() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-black to-black" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                        Why Choose BloxClips
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        What Roblox Sponsors{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            Can&apos;t Do
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        In-game sponsors reach players already playing. We reach millions who haven&apos;t discovered your game yet — through the content they actually watch.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((reason, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${reason.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <reason.icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-semibold text-white mb-2">
                                {reason.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {reason.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 grid grid-cols-2 gap-8 max-w-md mx-auto"
                >
                    {[
                        { value: "50M+", label: "Creator Subscribers" },
                        { value: "1B+", label: "Views Generated" },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
