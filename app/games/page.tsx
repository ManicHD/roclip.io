"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Play } from "lucide-react";
import GlobalSpotlight from "../components/GlobalSpotlight";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface FeaturedGame {
    id: number;
    gameId: string;
    title: string;
    thumbnail: string;
    playing: number;
    visits: number;
}

export default function GamesPage() {
    const [games, setGames] = useState<FeaturedGame[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await fetch(`${API_URL}/api/games`);
                if (!res.ok) throw new Error("Failed to fetch games");
                const data = await res.json();
                setGames(data.games || []);
            } catch (error) {
                console.error("Error fetching games:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const totalPlayers = games.reduce((acc, game) => acc + game.playing, 0);
    const totalVisits = games.reduce((acc, game) => acc + game.visits, 0);

    return (
        <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <GlobalSpotlight />
            <Navbar />

            {/* Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/5 to-black pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black opacity-40 pointer-events-none z-0" />

            <div className="relative z-10 pt-36 pb-32 px-6 max-w-[1300px] mx-auto">
                {!loading && games.length > 0 && (
                    <div className="mb-16 bg-gradient-to-br from-blue-900/40 via-blue-950/20 to-black border border-blue-500/20 rounded-[2rem] p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)]">
                        {/* Subtle glow */}
                        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay" />
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 text-center md:text-left">
                            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3">
                                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Network</span>
                            </h1>
                            <p className="text-gray-400 text-xl font-medium">Real-time stats across partner experiences.</p>
                        </div>

                        <div className="relative z-10 flex flex-wrap justify-center md:justify-end gap-x-16 gap-y-8">
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-gray-500 text-base font-bold uppercase tracking-widest mb-2 flex items-center gap-3">
                                    <div className="relative flex h-3.5 w-3.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
                                    </div>
                                    Live Players
                                </span>
                                <span className="text-5xl font-black text-white tracking-tight">{formatNumber(totalPlayers)}</span>
                            </div>
                            <div className="hidden md:block w-px h-20 bg-white/10" />
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-gray-500 text-base font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-purple-400" /> Total Plays
                                </span>
                                <span className="text-5xl font-black text-white tracking-tight">{formatNumber(totalVisits)}+</span>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-24">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-[spin_1s_cubic-bezier(0.5,0,0.5,1)_infinite]" />
                        </div>
                    </div>
                ) : games.length === 0 ? (
                    <div className="text-center p-24 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl shadow-2xl">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                            <Play className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Games Yet</h3>
                        <p className="text-lg text-gray-500 font-medium max-w-md mx-auto">We're curating to bring you the best experiences. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {games.map((game) => (
                            <a
                                key={game.id}
                                href={`https://www.roblox.com/games/${game.gameId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden hover:bg-[#111] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_15px_40px_-10px_rgba(255,255,255,0.05)]"
                            >
                                <div className="w-full aspect-[16/9] bg-neutral-900">
                                    <img
                                        src={game.thumbnail}
                                        alt={game.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-white font-bold text-xl leading-tight mb-3 truncate" title={game.title}>
                                        {game.title}
                                    </h3>
                                    <div className="flex items-center gap-5 text-sm text-[#A3A3A3] font-medium">
                                        <div className="flex items-center gap-3" title={`${game.playing} active players`}>
                                            <div className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                            </div>
                                            <span>{formatNumber(game.playing)} playing</span>
                                        </div>
                                        <div className="flex items-center gap-2" title={`${game.visits} total visits`}>
                                            <Play className="w-4 h-4" />
                                            <span>{formatNumber(game.visits)}+ visits</span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}

                        {/* Start Campaign CTA */}
                        <a href="/brands" className="block rounded-[2rem] bg-[#0a0a0a] border border-white/5 overflow-hidden transition-all duration-300 hover:border-blue-500/30 group relative cursor-pointer shadow-none hover:shadow-[0_0_50px_-15px_rgba(59,130,246,0.3)]">
                            {/* Animated Background Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

                            <div className="w-full aspect-[16/9] bg-[#050505] border-b border-white/5 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                                {/* Sleek lightning bolt icon instead of emoji */}
                                <div className="w-20 h-20 rounded-[1.25rem] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-[1.05] group-hover:border-blue-400/40 transition-all duration-500 z-10 shadow-lg group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] backdrop-blur-xl">
                                    <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-blue-400 transform group-hover:-translate-y-1 transition-transform duration-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                </div>

                                <h4 className="text-white font-black text-3xl tracking-tight mb-3 z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-indigo-300 transition-all duration-500 leading-none">
                                    Scale Your Game
                                </h4>
                                <p className="text-[#888] text-base font-medium z-10 max-w-[280px] leading-relaxed group-hover:text-gray-300 transition-colors">
                                    Join the network of top experiences driving massive player growth.
                                </p>
                            </div>

                            <div className="p-6 flex items-center justify-between bg-[#0a0a0a] relative z-20">
                                <div>
                                    <h3 className="text-white font-bold text-xl leading-tight mb-1.5 transition-colors flex items-center gap-2 group-hover:text-blue-400">
                                        Start a Campaign
                                    </h3>
                                    <p className="text-sm text-[#7A7A7A] flex items-center gap-1.5 font-medium group-hover:text-[#A3A3A3] transition-colors">
                                        View our options
                                    </p>
                                </div>

                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:border-blue-400 transition-all duration-300">
                                    <span className="text-blue-400 font-medium leading-none text-2xl group-hover:text-white transition-all duration-300">→</span>
                                </div>
                            </div>
                        </a>
                    </div>
                )}
            </div>
        </main>
    );
}
