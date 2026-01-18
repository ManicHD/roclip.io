"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
            <div className="w-full px-8 py-4">
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
                        <span className="text-lg font-bold text-white">BloxClips</span>
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
                            href="/login"
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/20"
                        >
                            Login
                        </Link>
                        <Link
                            href="https://discord.gg/SGf2ADYjb8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40"
                        >
                            Join Discord
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

