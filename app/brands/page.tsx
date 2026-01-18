"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2, Wallet, Video, Clock, BarChart3, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const steps = [
    {
        number: "1",
        title: "Create a Campaign",
        emoji: "📢",
        description: "Set your game link, platforms, rules, campaign length, and RPM (rate per 1,000 views).",
        icon: Gamepad2,
        color: "from-blue-500 to-cyan-500",
    },
    {
        number: "2",
        title: "Fund Your Budget",
        emoji: "💰",
        description: "Deposit your campaign budget (USD or Robux). You only pay for approved views.",
        icon: Wallet,
        color: "from-green-500 to-emerald-500",
    },
    {
        number: "3",
        title: "Creators Post Content",
        emoji: "🎥",
        description: "Creators choose your campaign, make short-form videos, and upload publicly to YouTube, TikTok, or Instagram.",
        icon: Video,
        color: "from-purple-500 to-pink-500",
    },
    {
        number: "4",
        title: "Review Process",
        emoji: "⏳",
        description: "All submissions are manually reviewed for rule compliance, quality, and brand safety. Only approved videos count.",
        icon: Clock,
        color: "from-orange-500 to-yellow-500",
    },
    {
        number: "5",
        title: "Get Results",
        emoji: "📈",
        description: "Views are tracked and spend is calculated by RPM. You receive a clear breakdown of views, clips, and budget usage.",
        icon: BarChart3,
        color: "from-red-500 to-rose-500",
    },
];

const benefits = [
    "Only pay for approved, quality content",
    "Reach millions of Roblox players",
    "Full control over campaign rules",
    "Real-time view tracking",
    "Transparent budget spending",
    "Manual quality review",
];

export default function BrandsPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Home</span>
                    </Link>

                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            For Game Developers & Brands
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Promote Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Roblox Game</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Connect with thousands of content creators who will promote your game through engaging short-form videos.
                        </p>
                    </motion.div>

                    {/* How It Works */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-20"
                    >
                        <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
                            <Gamepad2 className="h-8 w-8 text-blue-400" />
                            How It Works
                        </h2>

                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.1 }}
                                    className="relative"
                                >
                                    <div className="flex items-start gap-6 p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/[0.07] transition-colors">
                                        {/* Step Number */}
                                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                                            <span className="text-2xl font-bold text-white">{step.number}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                                                <span>{step.emoji}</span>
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-400">{step.description}</p>
                                        </div>

                                        {/* Icon */}
                                        <step.icon className="h-8 w-8 text-gray-600 hidden md:block" />
                                    </div>

                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-[2.25rem] top-full w-0.5 h-6 bg-gradient-to-b from-white/20 to-transparent" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Benefits */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-16"
                    >
                        <h2 className="text-2xl font-bold text-center mb-8">Why Choose BloxClips?</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5"
                                >
                                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                                    <span className="text-gray-300">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center p-8 md:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10"
                    >
                        <h2 className="text-3xl font-bold mb-4">Ready to Promote Your Game?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Join our Discord server to get started. Our team will help you set up your first campaign.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="https://discord.gg/SGf2ADYjb8"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl transition-all"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                                Join Discord
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </>
    );
}
