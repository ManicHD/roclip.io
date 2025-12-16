"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const isContactPage = pathname === '/contact';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo or Back Arrow */}
                    <Link href="/" className="flex items-center text-white hover:text-blue-400 transition-colors">
                        {isContactPage ? (
                            <ArrowLeft suppressHydrationWarning className="h-6 w-6" />
                        ) : (
                            <img
                                src="/logo.svg"
                                alt="ClipRoblox Logo"
                                className="h-10 w-auto"
                                loading="eager"
                                decoding="async"
                            />
                        )}
                    </Link>

                    {/* Navigation Links - Hidden on Contact Page */}
                    {!isContactPage && (
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">
                                Features
                            </Link>
                            <Link href="/privacy" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">
                                Terms
                            </Link>
                        </div>
                    )}

                    {/* CTA Button */}
                    <div className="flex items-center gap-4">
                        {!isContactPage && (
                            <Link
                                href="/contact"
                                className="relative z-50 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10 hover:border-white/20"
                            >
                                Contact Us
                            </Link>
                        )}
                        <Link
                            href="https://discord.gg/q5Ew3bQnB5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40"
                        >
                            Join Discord
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
