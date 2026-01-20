"use client";

import { useState, useEffect } from "react";
import { X, Mail, Bell, Check, Loader } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type PromptType = "initial" | "reminder" | null;

interface EmailSetupPopupProps {
    onComplete?: () => void;
    onActiveChange?: (isActive: boolean) => void;
}

export default function EmailSetupPopup({ onComplete, onActiveChange }: EmailSetupPopupProps) {
    const [promptType, setPromptType] = useState<PromptType>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkEmailPromptStatus();
    }, []);

    // Report active state changes
    useEffect(() => {
        onActiveChange?.(isVisible);
    }, [isVisible, onActiveChange]);

    const checkEmailPromptStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/api/notifications/email-prompt-status`, {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                if (data.showPrompt && data.type) {
                    setPromptType(data.type);
                    // Small delay for smooth animation
                    setTimeout(() => setIsVisible(true), 300);
                }
            }
        } catch (error) {
            console.error("Failed to check email prompt status:", error);
        }
    };

    const handleSaveEmail = async () => {
        if (!email.trim() || !email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/api/notifications/email-prompt-save`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (res.ok) {
                handleClose();
                onComplete?.();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to save email");
            }
        } catch (error) {
            setError("Failed to save email. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleLater = async () => {
        try {
            if (promptType === "initial") {
                // Mark initial prompt as seen
                await fetch(`${API_URL}/api/notifications/email-prompt-seen`, {
                    method: "POST",
                    credentials: "include",
                });
            } else if (promptType === "reminder") {
                // Record reminder shown timestamp
                await fetch(`${API_URL}/api/notifications/email-reminder-shown`, {
                    method: "POST",
                    credentials: "include",
                });
            }
        } catch (error) {
            console.error("Failed to update prompt status:", error);
        }
        handleClose();
    };

    const handleDontRemind = async () => {
        try {
            await fetch(`${API_URL}/api/notifications/email-reminder-dismiss`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Failed to dismiss reminder:", error);
        }
        handleClose();
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setPromptType(null), 300);
    };

    if (!promptType) return null;

    const isInitial = promptType === "initial";

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={handleLater}
            />

            {/* Popup */}
            <div
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm transition-all duration-300 px-4 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
            >
                <div className="bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="relative border-b border-white/10 p-5">
                        <button
                            onClick={handleLater}
                            className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-3 pr-8">
                            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <Mail className="h-5 w-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white">
                                    {isInitial ? "Stay Updated!" : "Set Up Email Notifications"}
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {isInitial ? "Get notified about new campaigns" : "Don't miss new opportunities"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                        {/* Benefits */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Bell className="h-4 w-4 text-blue-400" />
                                <span>New campaign launches</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Check className="h-4 w-4 text-green-400" />
                                <span>Important announcements</span>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(null);
                                }}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all text-sm"
                                autoFocus
                            />
                            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                        </div>

                        {/* CTA Buttons */}
                        <div className="space-y-2">
                            <button
                                onClick={handleSaveEmail}
                                disabled={saving || !email.trim()}
                                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {saving ? (
                                    <>
                                        <Loader className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        Enable Notifications
                                    </>
                                )}
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleLater}
                                    className="flex-1 py-2.5 text-gray-500 text-xs font-medium hover:text-gray-300 transition-colors"
                                >
                                    Later
                                </button>
                                {!isInitial && (
                                    <button
                                        onClick={handleDontRemind}
                                        className="flex-1 py-2.5 text-gray-600 text-xs font-medium hover:text-gray-400 transition-colors"
                                    >
                                        Don't remind me
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
