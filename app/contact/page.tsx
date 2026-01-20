"use client";

import Navbar from "../components/Navbar";
import ContactForm from "../components/ContactForm";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-hidden">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 pt-32 pb-24 px-6 min-h-screen flex flex-col justify-center">
                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Column: Text & Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                            Let's <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-gradient">
                                COLLABORATE
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg">
                            Have questions about a campaign, payout, or partnership?
                            Our team is ready to help you scale.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold">Discord Support</h3>
                                    <p className="text-sm text-gray-400">Join our dev server for support</p>
                                    <Link href="https://discord.gg/q5Ew3bQnB5" target="_blank" className="text-blue-400 text-sm font-medium hover:underline mt-1 block">
                                        Join Server &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Form */}
                    <div className="relative">
                        {/* Form Glow */}
                        <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                        <ContactForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
