"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { Play, Globe, Gamepad2 } from "lucide-react";
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

interface Service {
    id: number;
    name: string;
    url: string;
    imageUrl: string | null;
}

type Tab = "all" | "games" | "services";

export default function GamesPage() {
    const [games, setGames] = useState<FeaturedGame[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("all");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [gamesRes, servicesRes] = await Promise.all([
                    fetch(`${API_URL}/api/games`),
                    fetch(`${API_URL}/api/services`),
                ]);
                if (gamesRes.ok) {
                    const data = await gamesRes.json();
                    setGames(data.games || []);
                }
                if (servicesRes.ok) {
                    const data = await servicesRes.json();
                    setServices(data.services || []);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const totalPlayers = games.reduce((acc, game) => acc + game.playing, 0);
    const totalVisits = games.reduce((acc, game) => acc + game.visits, 0);

    const showGames = activeTab === "all" || activeTab === "games";
    const showServices = activeTab === "all" || activeTab === "services";
    const hasContent = games.length > 0 || services.length > 0;

    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: "all", label: "All", icon: null },
        { key: "games", label: "Games", icon: <Gamepad2 className="w-3.5 h-3.5" /> },
        { key: "services", label: "Services", icon: <Globe className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <GlobalSpotlight />
            <Navbar />

            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[130px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.22, 0.1] }}
                    transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/8 via-black to-black" />
            </div>

            <main className="relative z-10 pt-36 pb-32 px-6">
                <div className="max-w-[1300px] mx-auto">

                    {/* Page Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-16"
                    >

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-[length:200%_auto] animate-gradient">Campaigns</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-xl mx-auto leading-relaxed">
                            Browse active partner games and services. Click any card to visit.
                        </p>
                    </motion.div>

                    {/* Live Stats Banner (games only) */}
                    {!loading && games.length > 0 && (activeTab === "all" || activeTab === "games") && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mb-10 relative rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-blue-900/30 via-blue-950/15 to-black p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden shadow-[0_0_60px_-20px_rgba(59,130,246,0.15)]"
                        >
                            <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                            <div className="relative z-10">
                                <p className="text-sm font-bold uppercase tracking-widest text-blue-400 mb-1">Live Network Stats</p>
                                <p className="text-gray-400">Real-time data across all partner experiences.</p>
                            </div>
                            <div className="relative z-10 flex flex-wrap justify-center md:justify-end gap-x-12 gap-y-4">
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                                        </span>
                                        Live Players
                                    </span>
                                    <span className="text-4xl font-black text-white tracking-tight">{formatNumber(totalPlayers)}</span>
                                </div>
                                <div className="hidden md:block w-px h-14 bg-white/10" />
                                <div className="flex flex-col items-center">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <Play className="w-3.5 h-3.5 text-purple-400" /> Total Plays
                                    </span>
                                    <span className="text-4xl font-black text-white tracking-tight">{formatNumber(totalVisits)}+</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Tab Selector */}
                    {!loading && hasContent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 mb-10"
                        >
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                                        activeTab === tab.key
                                            ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {tab.key === "games" && games.length > 0 && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-black/20 text-black" : "bg-white/10 text-gray-500"}`}>
                                            {games.length}
                                        </span>
                                    )}
                                    {tab.key === "services" && services.length > 0 && (
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-black/20 text-black" : "bg-white/10 text-gray-500"}`}>
                                            {services.length}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center p-24">
                            <div className="relative w-14 h-14">
                                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-[spin_1s_cubic-bezier(0.5,0,0.5,1)_infinite]" />
                            </div>
                        </div>
                    ) : !hasContent ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center p-24 rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-2xl"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                <Play className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Nothing Here Yet</h3>
                            <p className="text-lg text-gray-500 max-w-md mx-auto">We're curating to bring you the best experiences. Check back soon!</p>
                        </motion.div>
                    ) : (
                        <div className="space-y-14">
                            {/* Games */}
                            {showGames && games.length > 0 && (
                                <div>
                                    {activeTab === "all" && (
                                        <motion.h2
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2"
                                        >
                                            <Gamepad2 className="w-4 h-4" /> Games
                                        </motion.h2>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {games.map((game, i) => (
                                            <motion.a
                                                key={game.id}
                                                href={`https://www.roblox.com/games/${game.gameId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.06 }}
                                                className="block rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] hover:border-white/15 group"
                                            >
                                                <div className="w-full aspect-[16/9] bg-neutral-900 overflow-hidden">
                                                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-white font-bold text-lg leading-tight mb-3 truncate" title={game.title}>{game.title}</h3>
                                                    <div className="flex items-center gap-5 text-sm text-gray-500 font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <span className="relative flex h-2 w-2">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                                            </span>
                                                            <span>{formatNumber(game.playing)} playing</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Play className="w-3.5 h-3.5" />
                                                            <span>{formatNumber(game.visits)}+ visits</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.a>
                                        ))}
                                        {/* Campaign CTA Card */}
                                        <motion.a
                                            href="/brands"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: games.length * 0.06 }}
                                            className="block rounded-2xl bg-white/[0.02] border border-white/8 overflow-hidden transition-all duration-300 hover:border-blue-500/30 group hover:shadow-[0_0_60px_-15px_rgba(59,130,246,0.25)] hover:-translate-y-1.5"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 rounded-2xl" />
                                            <div className="w-full aspect-[16/9] bg-[#050505] border-b border-white/5 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/15 to-indigo-500/15 flex items-center justify-center mb-5 border border-white/10 group-hover:scale-110 group-hover:border-blue-400/40 transition-all duration-500 shadow-lg group-hover:shadow-blue-500/20">
                                                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-blue-400" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                                    </svg>
                                                </div>
                                                <h4 className="text-white font-black text-2xl tracking-tight mb-2 group-hover:text-blue-400 transition-colors duration-300">Scale Your Game</h4>
                                                <p className="text-gray-500 text-sm max-w-[240px] group-hover:text-gray-300 transition-colors">Join the network driving massive player growth.</p>
                                            </div>
                                            <div className="p-5 flex items-center justify-between relative z-10">
                                                <div>
                                                    <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">Start a Campaign</h3>
                                                    <p className="text-sm text-gray-600 group-hover:text-gray-400 transition-colors">View our options</p>
                                                </div>
                                                <div className="w-9 h-9 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:border-blue-400 transition-all duration-300 text-blue-400 group-hover:text-white text-xl leading-none">
                                                    →
                                                </div>
                                            </div>
                                        </motion.a>
                                    </div>
                                </div>
                            )}

                            {/* Services */}
                            {showServices && services.length > 0 && (
                                <div>
                                    {activeTab === "all" && (
                                        <motion.h2
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2"
                                        >
                                            <Globe className="w-4 h-4" /> Services
                                        </motion.h2>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {services.map((service, i) => (
                                            <motion.a
                                                key={service.id}
                                                href={service.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.06 }}
                                                className="block rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] hover:border-white/15 group"
                                            >
                                                <div className="w-full aspect-[16/9] bg-[#0d0d0d] relative overflow-hidden">
                                                    {service.imageUrl ? (
                                                        <img
                                                            src={service.imageUrl}
                                                            alt={`${service.name}`}
                                                            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Globe className="w-10 h-10 text-gray-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-white font-bold text-lg leading-tight mb-2 truncate" title={service.name}>{service.name}</h3>
                                                    <p className="text-sm text-gray-500 truncate flex items-center gap-1.5">
                                                        <Globe className="w-3.5 h-3.5 shrink-0" />
                                                        {(() => { try { return new URL(service.url).hostname; } catch { return service.url; } })()}
                                                    </p>
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
