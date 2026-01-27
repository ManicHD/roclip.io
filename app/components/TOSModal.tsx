"use client";

import { useState } from "react";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TOSModalProps {
    onAccept: () => Promise<void>;
}

export default function TOSModal({ onAccept }: TOSModalProps) {
    const [accepting, setAccepting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAccept = async () => {
        setAccepting(true);
        setError(null);
        try {
            await onAccept();
        } catch (e) {
            setError("Failed to accept TOS. Please try again.");
            setAccepting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-gray-500/10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <Shield className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Terms of Service Update</h2>
                            <p className="text-sm text-gray-400">Please review and accept our updated terms to continue to the dashboard.</p>
                        </div>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-300">
                    <div className="space-y-4">
                        <section>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
                                <CheckCircle className="h-5 w-5 text-blue-400" />
                                1. Content Standards & Quality
                            </h3>
                            <ul className="list-disc pl-9 space-y-1 text-sm text-gray-400">
                                <li><strong>No Low-Effort Content:</strong> Uploads must meet reasonable quality standards. Blurry, unedited, or low-effort clips may be rejected.</li>
                                <li><strong>No Spamming:</strong> Do not flood the system with excessive or repetitive uploads.</li>
                                <li><strong>No Reposts:</strong> Never resubmit the same video or re-apply with a video that has already been submitted or rejected.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
                                <CheckCircle className="h-5 w-5 text-blue-400" />
                                2. Prohibited Conduct
                            </h3>
                            <ul className="list-disc pl-9 space-y-1 text-sm text-gray-400">
                                <li><strong>No View-Botting:</strong> Any use of bots, scripts, or engagement manipulation services to artificially inflate views or likes is strictly prohibited and will result in an immediate permanent ban.</li>
                                <li><strong>Follow Campaign Rules:</strong> You must adhere strictly to each campaign's specific requirements (hashtags, sounds, captions, etc.).</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
                                <CheckCircle className="h-5 w-5 text-blue-400" />
                                3. Payments & Fees
                            </h3>
                            <ul className="list-disc pl-9 space-y-1 text-sm text-gray-400">
                                <li><strong>Transaction Fees:</strong> BloxClips does not cover payment processor fees (e.g., PayPal or Stripe fees). These are standard processing costs and will be deducted from your final payout amount.</li>
                                <li><strong>Payout Verification:</strong> All payouts are subject to verification. We reserve the right to withhold payment for suspicious activity.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
                                <CheckCircle className="h-5 w-5 text-blue-400" />
                                4. Rights & Usage
                            </h3>
                            <ul className="list-disc pl-9 space-y-1 text-sm text-gray-400">
                                <li><strong>Marketing Permissions:</strong> By using BloxClips, you grant us the non-exclusive right to use your username, profile picture, and submitted content to display on the BloxClips website and for general marketing or promotional purposes.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
                                <CheckCircle className="h-5 w-5 text-blue-400" />
                                5. Account Termination
                            </h3>
                            <ul className="list-disc pl-9 space-y-1 text-sm text-gray-400">
                                <li>BloxClips reserves the right to suspend or terminate your account at our sole discretion for any violation of these terms.</li>
                            </ul>
                        </section>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-yellow-200/80">
                            By clicking "Accept & Continue", you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-black/50">
                    {error && (
                        <div className="mb-4 text-center text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <button
                        onClick={handleAccept}
                        disabled={accepting}
                        className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                    >
                        {accepting ? (
                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Accept & Continue"
                        )}
                    </button>
                    <p className="mt-4 text-center text-xs text-gray-600">
                        BloxClips Marketing LLC &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
