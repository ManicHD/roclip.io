"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, DollarSign, Wallet, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
    {
        title: "Monetize Your Clips",
        desc: "Turn your views into real cash. We pay per 1,000 views on approved submissions.",
        icon: DollarSign,
        color: "text-green-400",
        bg: "bg-green-500/10"
    },
    {
        title: "Instant Payouts",
        desc: "Cash out via PayPal or Stripe. Fast, reliable, and secure.",
        icon: Wallet,
        color: "text-blue-400",
        bg: "bg-blue-500/10"
    },
    {
        title: "Viral Opportunities",
        desc: "Work with top games that give you the best chance of going viral.",
        icon: TrendingUp,
        color: "text-purple-400",
        bg: "bg-purple-500/10"
    }
];

export default function CreatorsPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-green-500/30">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-green-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
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
                                Get Paid to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 animate-gradient">
                                    CLIP ROBLOX
                                </span>
                            </h1>

                            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                                The easiest way for creators to earn money. Pick a game, record a clip, post it, and get paid.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="https://discord.gg/SGf2ADYjb8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
                                >
                                    <Play className="w-5 h-5 fill-current" /> Start Creating
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Feature Cards with Glassmorphism */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
                        {features.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden hover:bg-white/[0.08] transition-colors"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className={`w-7 h-7 ${item.color}`} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>





                </div>
            </main>
        </div>
    );
}
