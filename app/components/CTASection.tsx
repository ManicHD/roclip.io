"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 via-black to-black" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#6b728010_1px,transparent_1px),linear-gradient(to_bottom,#6b728010_1px,transparent_1px)] bg-[size:4rem_4rem]" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/30 to-purple-950/20 backdrop-blur-sm"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Ready to Grow Your Game?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Join thousands of Roblox developers using BloxClips to reach millions of new players through creator content.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/brands"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl transition-all"
                        >
                            I&apos;m a Developer
                        </Link>
                        <Link
                            href="/creators"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold text-lg hover:bg-white/10 transition-all"
                        >
                            I&apos;m a Creator
                        </Link>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                        No minimums • Start in minutes
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
