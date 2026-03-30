"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Gamepad2, Wallet, Video, Users, TrendingUp, Shield, CheckCircle, Zap, BarChart3 } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlobalSpotlight from '../components/GlobalSpotlight';

import { AnimatePresence } from 'framer-motion';

const WORDS = ["GAME", "SERVICES", "BRANDS"];
const GRADIENT = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-[length:200%_auto] animate-gradient";

function CyclingWord() {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIdx((i) => (i + 1) % WORDS.length), 2500);
        return () => clearInterval(t);
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`inline-block ${GRADIENT}`}
            >
                {WORDS[idx]}
            </motion.span>
        </AnimatePresence>
    );
}

const steps = [
    {
        number: "01",
        title: "Create a Campaign",
        description: "Set your game link, platforms, rules, campaign length, and RPM (rate per 1,000 views).",
        icon: Gamepad2,
    },
    {
        number: "02",
        title: "Fund & Launch",
        description: "Deposit your campaign budget. You only pay for valid, approved views — nothing more.",
        icon: Wallet,
    },
    {
        number: "03",
        title: "Creators Post Content",
        description: "Creators choose your campaign, make videos, post publicly, and the views roll in.",
        icon: Video,
    },
];

const benefits = [
    {
        title: "Massive Reach",
        desc: "Access a network of creators with 50M+ combined subscribers ready to promote your game.",
        icon: Users,
        glow: "from-blue-500/20 to-cyan-500/10",
        border: "hover:border-blue-500/30",
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/10",
    },
    {
        title: "Pay for Performance",
        desc: "Set your own RPM and budget. You control exactly how much you spend per real view.",
        icon: TrendingUp,
        glow: "from-purple-500/20 to-pink-500/10",
        border: "hover:border-purple-500/30",
        iconColor: "text-purple-400",
        iconBg: "bg-purple-500/10",
    },
    {
        title: "Zero Bot Traffic",
        desc: "Every video is manually reviewed. No bots, only verified real engagement.",
        icon: Shield,
        glow: "from-green-500/20 to-emerald-500/10",
        border: "hover:border-green-500/30",
        iconColor: "text-green-400",
        iconBg: "bg-green-500/10",
    },
    {
        title: "Real-time Dashboard",
        desc: "Track views, spending, and ROI live. Full transparency at every stage of your campaign.",
        icon: BarChart3,
        glow: "from-orange-500/20 to-yellow-500/10",
        border: "hover:border-orange-500/30",
        iconColor: "text-orange-400",
        iconBg: "bg-orange-500/10",
    },
    {
        title: "Instant Setup",
        desc: "Go from signup to live campaign in minutes. No lengthy approval queues.",
        icon: Zap,
        glow: "from-cyan-500/20 to-blue-500/10",
        border: "hover:border-cyan-500/30",
        iconColor: "text-cyan-400",
        iconBg: "bg-cyan-500/10",
    },
    {
        title: "Vetted Creators",
        desc: "Every creator on the platform is verified. Quality content, guaranteed.",
        icon: CheckCircle,
        glow: "from-indigo-500/20 to-purple-500/10",
        border: "hover:border-indigo-500/30",
        iconColor: "text-indigo-400",
        iconBg: "bg-indigo-500/10",
    },
];

const stats = [
    { value: "100M+", label: "Views Generated" },
    { value: "500+", label: "Active Creators" },
    { value: "$0", label: "Wasted on Bots" },
    { value: "24h", label: "Avg. Approval Time" },
];

export default function BrandsPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-blue-500/30 font-sans">
            <GlobalSpotlight />
            <Navbar />

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/25 rounded-full blur-[130px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black opacity-60" />
            </div>

            <main className="relative z-10 pt-36 pb-32 px-6">
                <div className="max-w-7xl mx-auto w-full">

                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-28"
                    >

                        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                            Scale Your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-[length:200%_auto] animate-gradient">ROBLOX </span><CyclingWord />
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                            The most effective way to reach millions of players.<br className="hidden md:block" />
                            <span className="text-white font-semibold">Real creators. Real views. Real players.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="https://discord.gg/q5Ew3bQnB5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                            >
                                Start a Campaign <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all backdrop-blur-sm"
                            >
                                How It Works
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/10 mb-28"
                    >
                        {stats.map((s, i) => (
                            <div key={i} className="flex flex-col items-center justify-center py-10 px-4 bg-black/60 backdrop-blur-sm hover:bg-white/[0.04] transition-colors">
                                <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{s.value}</span>
                                <span className="text-sm text-gray-500 font-semibold uppercase tracking-widest">{s.label}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Benefits Grid */}
                    <div className="mb-28">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-center mb-4 tracking-tight"
                        >
                            Why Brands Choose BloxClips
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-gray-500 text-center text-lg mb-16"
                        >
                            Everything you need. Nothing you don't.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {benefits.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.07 }}
                                    className={`group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${item.border}`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                                    <div className={`relative w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                                    </div>
                                    <h3 className="relative text-xl font-bold mb-3">{item.title}</h3>
                                    <p className="relative text-gray-400 leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div id="how-it-works" className="mb-28">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-center mb-4 tracking-tight"
                        >
                            Launch in 3 Steps
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-gray-500 text-center text-lg mb-20"
                        >
                            Simple by design. Powerful by result.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            <div className="absolute top-[3.5rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent hidden md:block" />
                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-blue-500/40 transition-colors shadow-xl group-hover:shadow-blue-500/10">
                                            <step.icon className="w-9 h-9 text-white group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black shadow-lg shadow-blue-500/30">
                                            {step.number}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-900/40 via-blue-950/20 to-black p-12 md:p-16 text-center overflow-hidden"
                    >
                        <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                                Ready to grow your game?
                            </h2>
                            <p className="text-gray-400 text-xl mb-10 max-w-xl mx-auto">
                                Join the brands already driving massive player growth with BloxClips.
                            </p>
                            <Link
                                href="https://discord.gg/q5Ew3bQnB5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 hover:scale-[1.02] transition-all shadow-xl shadow-blue-500/30"
                            >
                                Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
}
