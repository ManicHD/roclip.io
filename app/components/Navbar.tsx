"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
            });
    }, [API_URL]);

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl shadow-black/50 transition-all duration-300">
            <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo Left */}
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/logo.png"
                            alt="BloxClips"
                            className="h-10 w-10 object-contain"
                            loading="eager"
                            decoding="async"
                        />
                        <span className="text-xl font-bold tracking-tight text-white">BloxClips</span>
                    </Link>

                    {/* Center Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/brands"
                            className={`text-sm font-medium transition-colors ${pathname === '/brands' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Brands
                        </Link>
                        <Link
                            href="/creators"
                            className={`text-sm font-medium transition-colors ${pathname === '/creators' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Creators
                        </Link>
                    </div>

                    {/* Right CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={isAuthenticated ? "/dashboard" : "/login"}
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-105"
                        >
                            {isAuthenticated ? "Dashboard" : "Login"}
                        </Link>
                        <Link
                            href="/contact"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
