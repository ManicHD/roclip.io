"use client";

import { motion } from "framer-motion";
import { AlertCircle, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function NotInServerPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-red-950/50 via-black to-black flex flex-col justify-center items-center text-center">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#6b728020_1px,transparent_1px),linear-gradient(to_bottom,#6b728020_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            </div>

            {/* Back to Home */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-50 text-gray-400 hover:text-white transition-colors text-sm"
            >
                ← Back to Home
            </Link>

            {/* Error Card */}
            <motion.div
                className="relative z-10 max-w-md w-full mx-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-8">
                    {/* Error Icon */}
                    <motion.div
                        className="mb-6 flex justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <div className="rounded-full bg-red-500/10 p-4">
                            <AlertCircle className="h-12 w-12 text-red-400" />
                        </div>
                    </motion.div>

                    <h1 className="text-2xl font-bold text-white mb-2">
                        Access Denied
                    </h1>

                    <p className="text-gray-400 mb-6">
                        You need to be a member of our Discord server to access the dashboard.
                    </p>

                    {/* Info Box */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-6 text-left">
                        <p className="text-sm text-gray-300">
                            <span className="font-semibold text-white">Need access?</span>
                            <br />
                            Contact <span className="text-blue-400 font-medium">@Manic.YT</span> on Discord to request dashboard access.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <a
                            href="https://discord.gg/q5Ew3bQnB5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5865F2] px-6 font-semibold text-white shadow-lg shadow-[#5865F2]/25 transition-all duration-200 hover:bg-[#4752C4] hover:shadow-xl hover:shadow-[#5865F2]/40 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <MessageCircle className="h-5 w-5" />
                            <span>Join Our Discord</span>
                        </a>

                        <Link
                            href="/login"
                            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 font-medium text-white transition-all duration-200 hover:bg-white/10 hover:border-white/20"
                        >
                            Try Again
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
