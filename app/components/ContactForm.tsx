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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl p-8 md:p-10 shadow-2xl"
        >
            <div className="absolute top-0 right-0 p-12 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-400 ml-1">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        placeholder="John Doe"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-600 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-400 ml-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        placeholder="john@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-600 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-gray-400 ml-1">
                        Message
                    </label>
                    <textarea
                        name="message"
                        id="message"
                        required
                        rows={4}
                        placeholder="Tell us more about your inquiry..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-600 focus:border-blue-500/50 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || status === "success"}
                    className="mt-2 group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 hover:shadow-blue-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : status === "success" ? (
                        <>
                            <CheckCircle className="h-5 w-5" />
                            <span>Message Sent</span>
                        </>
                    ) : (
                        <>
                            <span>Send Message</span>
                            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </button>

                {status === "error" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-300 text-sm justify-center bg-red-500/10 p-3 rounded-xl border border-red-500/20"
                    >
                        <AlertCircle className="h-4 w-4" />
                        <span>{errorMessage}</span>
                    </motion.div>
                )}
            </form>
        </motion.div>
    );
}
