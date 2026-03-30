"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, DollarSign, Wallet, TrendingUp, Star, Clock, Users, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlobalSpotlight from '../components/GlobalSpotlight';

const features = [
    {
        title: "Monetize Your Clips",
        desc: "Turn your views into real cash. We pay per 1,000 views on every approved submission.",
        icon: DollarSign,
        iconColor: "text-green-400",
        iconBg: "bg-green-500/10",
        glow: "from-green-500/20 to-emerald-500/10",
        border: "hover:border-green-500/30",
    },
    {
        title: "Quick Payouts",
        desc: "Get paid reliably and on time. Our payout system is fast, secure, and built for creators.",
        icon: Wallet,
        iconColor: "text-blue-400",
        iconBg: "bg-blue-500/10",
        glow: "from-blue-500/20 to-cyan-500/10",
        border: "hover:border-blue-500/30",
    },
    {
        title: "Viral Opportunities",
        desc: "Work with top games that give you the best shot at going viral on YouTube and TikTok.",
        icon: TrendingUp,
        iconColor: "text-purple-400",
        iconBg: "bg-purple-500/10",
        glow: "from-purple-500/20 to-pink-500/10",
        border: "hover:border-purple-500/30",
    },
    {
        title: "Top Creator Ratings",
        desc: "Build your reputation. High-rated creators unlock exclusive campaigns and higher RPMs.",
        icon: Star,
        iconColor: "text-yellow-400",
        iconBg: "bg-yellow-500/10",
        glow: "from-yellow-500/20 to-orange-500/10",
        border: "hover:border-yellow-500/30",
    },
    {
        title: "Quick Approvals",
        desc: "Our team reviews submissions fast so you get paid without unnecessary waiting.",
        icon: Clock,
        iconColor: "text-cyan-400",
        iconBg: "bg-cyan-500/10",
        glow: "from-cyan-500/20 to-blue-500/10",
        border: "hover:border-cyan-500/30",
    },
    {
        title: "Growing Community",
        desc: "Join 3,000+ creators already earning. Share tips, get support, and grow together.",
        icon: Users,
        iconColor: "text-indigo-400",
        iconBg: "bg-indigo-500/10",
        glow: "from-indigo-500/20 to-purple-500/10",
        border: "hover:border-indigo-500/30",
    },
];

const steps = [
    { number: "01", title: "Join the Discord", desc: "Sign up and access available campaigns instantly through our Discord server." },
    { number: "02", title: "Record & Post", desc: "Pick a campaign, create your clip, post it publicly on YouTube or TikTok." },
    { number: "03", title: "Get Paid", desc: "Submit your link, get approved, and cash out directly to PayPal or Stripe." },
];

const stats = [
    { value: "3K+", label: "Active Creators" },
    { value: "100M+", label: "Views Paid Out" },
    { value: "24h", label: "Avg. Approval" },
    { value: "$0", label: "Hidden Fees" },
];

export default function CreatorsPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-green-500/30 font-sans">
            <GlobalSpotlight />
            <Navbar />

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] bg-green-600/25 rounded-full blur-[130px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.28, 0.15] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-[5%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black opacity-60" />
            </div>

            <main className="relative z-10 pt-36 pb-32 px-6">
                <div className="max-w-7xl mx-auto w-full">

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-28"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 text-sm font-semibold mb-8 backdrop-blur-sm">
                            <Play className="w-3.5 h-3.5 fill-current" /> For Content Creators
                        </div>

                        <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                            Get Paid to<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-[length:200%_auto] animate-gradient">
                                CLIP ROBLOX
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                            The easiest way for creators to earn money.<br className="hidden md:block" />
                            <span className="text-white font-semibold">Pick a campaign. Record. Post. Get paid.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://whop.com/bloxclips/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-500 hover:scale-[1.02] transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                            >
                                <Play className="w-5 h-5 fill-current" /> Start Creating
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="https://discord.com/invite/SGf2ADYjb8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#5865F2] text-white font-bold text-lg hover:bg-[#4752C4] hover:scale-[1.02] transition-all shadow-lg shadow-[#5865F2]/25 hover:shadow-[#5865F2]/40"
                            >
                                <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                                </svg>
                                Join Discord
                            </a>
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

                    {/* Features Grid */}
                    <div className="mb-28">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-center mb-4 tracking-tight"
                        >
                            Why Creators Love BloxClips
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-gray-500 text-center text-lg mb-16"
                        >
                            Simple to join. Real money. No catch.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((item, i) => (
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
                            3 Steps to Getting Paid
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-gray-500 text-center text-lg mb-20"
                        >
                            Start earning today — no experience needed.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            <div className="absolute top-[3.5rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent hidden md:block" />
                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/30 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-green-500/40 transition-colors shadow-xl text-3xl font-black text-white group-hover:text-green-400">
                                            {step.number}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
