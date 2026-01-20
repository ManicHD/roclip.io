"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2, Wallet, Video, Clock, BarChart3, CheckCircle, TrendingUp, Users, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const steps = [
    {
        number: "01",
        title: "Create a Campaign",
        description: "Set your game link, platforms, rules, campaign length, and RPM (rate per 1,000 views).",
        icon: Gamepad2,
        color: "blue",
    },
    {
        number: "02",
        title: "Fund & Launch",
        description: "Deposit your campaign budget. You only pay for valid, approved views.",
        icon: Wallet,
        color: "green",
    },
    {
        number: "03",
        title: "Creators Post Content",
        description: "Creators choose your campaign, make short-form videos, and upload publicly.",
        icon: Video,
        color: "purple",
    },
];

const benefits = [
    {
        title: "Zero Bot Traffic",
        desc: "Every single video is manually reviewed by our team. No bots, only real engagement.",
        icon: Shield
    },
    {
        title: "Massive Reach",
        desc: "Access a network of creators with over 50M+ combined subscribers ready to promote.",
        icon: Users
    },
    {
        title: "Pay for Performance",
        desc: "Set your own RPM and budget. You control exactly how much you spend per view.",
        icon: TrendingUp
    }
];

export default function BrandsPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-blue-500/30">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 min-h-screen flex items-center justify-center pt-32 pb-24 px-6">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="text-center mb-32 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Home
                            </Link>

                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight">
                                Scale Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 animate-gradient">
                                    ROBLOX GAME
                                </span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                                The most effective way to reach millions of players. <br className="hidden md:block" />
                                Real creators. Real views. Real players.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="https://discord.gg/q5Ew3bQnB5"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-500/25"
                                >
                                    Start Campaign
                                </Link>
                                <Link
                                    href="#how-it-works"
                                    className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
                        {benefits.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:bg-white/[0.07] transition-all"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* How It Works Steps */}
                    <div id="how-it-works" className="mb-32">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-3xl md:text-5xl font-bold text-center mb-20"
                        >
                            Launch in 3 Steps
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Connecting Line */}
                            <div className="absolute top-[3rem] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent hidden md:block" />

                            {steps.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    className="relative flex flex-col items-center text-center group"
                                >
                                    <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:border-blue-500/50 transition-colors shadow-2xl">
                                        <step.icon className="w-10 h-10 text-white group-hover:text-blue-400 transition-colors" />
                                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                                            {step.number}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                    <p className="text-gray-400 max-w-xs">{step.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="relative rounded-3xl p-12 md:p-24 text-center overflow-hidden border border-white/10"
                    >
                        <div className="absolute inset-0 bg-blue-600/10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black mb-8">
                                Ready to go viral?
                            </h2>
                            <Link
                                href="https://discord.gg/q5Ew3bQnB5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex px-10 py-5 rounded-2xl bg-white text-black font-bold text-xl hover:scale-105 transition-transform"
                            >
                                Create Campaign
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
