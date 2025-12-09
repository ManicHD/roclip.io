"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Server Error Details:", errorData);
                const detailedError = errorData.details?.message || errorData.error || "Failed to send message";
                setErrorMessage(detailedError);
                throw new Error(detailedError);
            }

            setStatus("success");
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error(error);
            setStatus("error");
            setErrorMessage("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm p-6 sm:p-8 md:p-10"
            >
                <div className="absolute inset-0 bg-blue-500/5 z-0" />

                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-400">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            placeholder="Your name"
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-400">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            placeholder="your@email.com"
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="message" className="text-sm font-medium text-gray-400">
                            Message
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            required
                            rows={5}
                            placeholder="How can we help you?"
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || status === "success"}
                        className="group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-500/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 suppressHydrationWarning className="h-4 w-4 animate-spin" />
                        ) : status === "success" ? (
                            <>
                                <CheckCircle suppressHydrationWarning className="h-4 w-4" />
                                <span>Sent Successfully</span>
                            </>
                        ) : (
                            <>
                                <span>Send Message</span>
                                <Send suppressHydrationWarning className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>

                    {status === "error" && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-400 text-sm justify-center bg-red-500/10 p-3 rounded-lg border border-red-500/20"
                        >
                            <AlertCircle suppressHydrationWarning className="h-4 w-4" />
                            <span>{errorMessage}</span>
                        </motion.div>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
