"use client";

import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import GlobalSpotlight from "../components/GlobalSpotlight";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check authentication via API call
        fetch(`${API_URL}/api/auth/me`, {
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) {
                    setIsAuthenticated(true);
                }
            })
            .catch(() => {
                // Not authenticated
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [API_URL]);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black flex flex-col justify-center items-center text-center font-sans tracking-wide">
            <GlobalSpotlight />

            {/* Background Grid */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

                {/* Floating Orbs - Matching Hero */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen"
                />
            </div>

            {/* Back to Home */}
            <Link
                href="/"
                className="absolute top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
            >
                <ArrowRight className="h-4 w-4 rotate-180" /> Back to Home
            </Link>

            {/* Login Card - Simplified & Minimalist */}
            <motion.div
                className="relative z-10 w-full max-w-sm"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 p-8 backdrop-blur-md">

                    <div className="mb-6 flex justify-center">
                        <img
                            src="/logo.png"
                            alt="BloxClips"
                            className="h-10 w-10 object-contain"
                        />
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {isAuthenticated ? 'Welcome Back' : 'Log in to BloxClips'}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {isAuthenticated ? 'You are already logged in' : 'Manage your campaigns & track earnings'}
                        </p>
                    </div>

                    {isAuthenticated ? (
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-200 shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Go to Dashboard</span>
                        </button>
                    ) : (
                        /* Discord Login Button */
                        <a
                            href={`${API_URL}/api/auth/discord`}
                            className="group relative flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition-all duration-200 shadow-lg shadow-[#5865F2]/20 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 71 55"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                            >
                                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1099 30.1693C30.1099 34.1136 27.2680 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.7018 30.1693C53.7018 34.1136 50.9 37.3253 47.3178 37.3253Z" />
                            </svg>
                            <span>Continue with Discord</span>
                        </a>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-[10px] text-gray-500">
                            By clicking continue, you agree to our <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
