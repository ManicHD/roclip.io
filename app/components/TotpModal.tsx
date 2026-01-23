"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";

interface TotpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: (code: string) => Promise<void>;
    title?: string;
    message?: string;
    loading?: boolean;
    error?: string | null;
}

export default function TotpModal({
    isOpen,
    onClose,
    onVerify,
    title = "Security Verification",
    message = "Enter your 6-digit code from Google Authenticator to proceed with the payout.",
    loading = false,
    error = null,
}: TotpModalProps) {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen) {
            setCode(["", "", "", "", "", ""]);
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [isOpen]);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter" && code.every(c => c)) {
            handleSubmit();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 6) {
            const newCode = pasted.split("");
            setCode(newCode);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async () => {
        const fullCode = code.join("");
        if (fullCode.length === 6) {
            await onVerify(fullCode);
        }
    };

    const isComplete = code.every(c => c);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-sm text-gray-300">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 6-Digit Code Input */}
                        <div className="flex justify-center gap-2 mb-4">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    disabled={loading}
                                    className={`w-12 h-14 text-center text-2xl font-bold bg-white/5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${error
                                        ? "border-red-500/50 focus:ring-red-500"
                                        : "border-white/10 focus:ring-emerald-500 focus:border-emerald-500"
                                        } text-white placeholder-gray-500 disabled:opacity-50`}
                                />
                            ))}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm text-center mb-4"
                            >
                                {error}
                            </motion.p>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!isComplete || loading}
                                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${isComplete && !loading
                                    ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white"
                                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify & Continue"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
