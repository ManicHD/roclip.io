"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "info",
}: ConfirmModalProps) {
    const colors = {
        danger: {
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            icon: "text-red-400",
            button: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400",
        },
        warning: {
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
            icon: "text-yellow-400",
            button: "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400",
        },
        info: {
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            icon: "text-blue-400",
            button: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400",
        },
    };

    const color = colors[variant];

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
                        <div className={`p-3 rounded-xl ${color.bg} ${color.border} border mb-4`}>
                            <div className="flex items-start gap-3">
                                <AlertCircle className={`h-5 w-5 ${color.icon} flex-shrink-0 mt-0.5`} />
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
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className={`flex-1 px-4 py-2.5 rounded-xl ${color.button} text-white font-semibold transition-all shadow-lg`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
