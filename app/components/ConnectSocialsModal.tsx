"use client";

import { useState } from "react";
import { X, Link2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InstagramConnect from "./InstagramConnect";

export default function ConnectSocialsModal({
    isOpen,
    onClose,
    discordId
}: {
    isOpen: boolean;
    onClose: () => void;
    discordId: string;
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl"
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-black/95 backdrop-blur-xl">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-blue-500/10 p-2.5">
                                        <Link2 className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">Connect Social Accounts</h2>
                                        <p className="text-sm text-gray-400">Link your accounts to submit content</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="rounded-xl p-2 hover:bg-white/5 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <InstagramConnect discordId={discordId} />

                                {/* Future: Add more social connections here */}
                                {/* <YouTubeConnect discordId={discordId} /> */}
                                {/* <TikTokConnect discordId={discordId} /> */}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
