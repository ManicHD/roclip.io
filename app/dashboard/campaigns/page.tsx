"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Calendar,
    Users,
    DollarSign,
    Video,
    ChevronRight,
    ExternalLink,
    X,
    Eye,
    Clock,
    Gamepad2,
    ArrowRight,
    Zap,
    Pause,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Platform icon components
const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-red-500">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-white">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-pink-500">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
);

// Helper function to get relative time
const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
};

// Format payout to always show 2 decimal places
function formatPayout(payout: string | null | undefined): string {
    if (!payout || payout === "null") return "N/A";
    // Extract the number from the string
    const match = payout.match(/[\d.]+/);
    if (!match) return payout;
    const num = parseFloat(match[0]);
    return `$${num.toFixed(2)}/1k`;
}

// Get platform icon component
function PlatformBadge({ platform }: { platform: string }) {
    const p = platform.toLowerCase().trim();

    const getIcon = () => {
        if (p === "youtube") return <YouTubeIcon />;
        if (p === "tiktok") return <TikTokIcon />;
        if (p === "instagram") return <InstagramIcon />;
        return null;
    };

    return (
        <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400">
            {getIcon()}
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </span>
    );
}

interface Campaign {
    id: number;
    name: string;
    game: string;
    budget: string;
    payout: string;
    payoutLong?: string;
    description: string;
    deadline?: string;
    allowedPlatforms: string;
    viewCap?: number;
    longViewCap?: number;
    minViewsShorts?: number;
    minViewsLong?: number;
    createdAt: string;
    thumbnail?: string;
    totalSpent?: number;
    totalViews?: number;
    infoLink?: string;
    acceptingSubmissions?: boolean;
    budgetStatus?: 'available' | 'almost_full' | 'full';
    canSubmit?: boolean;
    percentageUsed?: number;
    paused?: boolean;
    _count: {
        submissions: number;
    };
}

// Campaign Detail Modal
// Campaign Detail Modal
function CampaignModal({ campaign, onClose }: { campaign: Campaign; onClose: () => void }) {
    const platforms = campaign.allowedPlatforms.split(",").map((p) => p.trim());

    // Calculate stats
    const budgetMatch = campaign.budget?.match(/[\d,]+/);
    const budgetAmount = budgetMatch ? parseFloat(budgetMatch[0].replace(/,/g, '')) : 0;
    const spent = Math.min(campaign.totalSpent || 0, budgetAmount);
    const percentUsed = budgetAmount > 0 ? Math.min(100, (spent / budgetAmount) * 100) : 0;
    const isFull = campaign.canSubmit === false;
    const isPaused = campaign.paused === true;

    const [thumbnail, setThumbnail] = useState<string | null>(campaign.thumbnail || null);

    useEffect(() => {
        if (campaign.thumbnail) return;
        const match = campaign.game.match(/games\/(\d+)/);
        if (!match) return;
        const placeId = match[1];
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        fetch(`${API_URL}/api/roblox/thumbnail/${placeId}`)
            .then(res => res.json())
            .then(data => { if (data.imageUrl) setThumbnail(data.imageUrl); })
            .catch(err => console.error('Failed to fetch game thumbnail:', err));
    }, [campaign.game, campaign.thumbnail]);

    // Description Parser (Discord-like)
    const renderDescription = (text: string) => {
        return text.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={i} className="h-4" />;

            const parseContent = (content: string) => {
                const parts = content.split(/(\*\*.*?\*\*)/g);
                return parts.map((part, index) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                });
            };

            if (trimmed.startsWith('-')) {
                return (
                    <div key={i} className="flex items-start gap-3 mb-1 pl-1">
                        <span className="text-blue-400 mt-1.5 text-[10px]">●</span>
                        <span className="text-gray-300 flex-1 leading-relaxed">{parseContent(trimmed.substring(1).trim())}</span>
                    </div>
                );
            }

            return <p key={i} className="text-gray-300 mb-2 leading-relaxed">{parseContent(trimmed)}</p>;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-7xl w-full shadow-2xl relative overflow-hidden"
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/[0.02]">
                    <div className="flex items-center gap-5">
                        <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                            {thumbnail ? (
                                <img src={thumbnail} alt={campaign.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Gamepad2 className="h-8 w-8 text-gray-600" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{campaign.name}</h2>
                            <a
                                href={campaign.game}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5 mt-0.5"
                            >
                                Play on Roblox <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/5"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {/* Key Stats Row - Styled like Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Total Budget */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start justify-between group hover:bg-white/[0.07] transition-colors">
                            <div>
                                <p className="text-sm text-gray-400 mb-1 font-medium">Total Budget</p>
                                <p className="text-2xl font-bold text-white">{campaign.budget}</p>
                            </div>
                            <div className="rounded-xl p-2.5 bg-green-500/10 text-green-400 border border-green-500/20">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Total Views */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start justify-between group hover:bg-white/[0.07] transition-colors">
                            <div>
                                <p className="text-sm text-gray-400 mb-1 font-medium">Total Views</p>
                                <p className="text-2xl font-bold text-white">{(campaign.totalViews || 0).toLocaleString()}</p>
                            </div>
                            <div className="rounded-xl p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <Eye className="h-5 w-5" />
                            </div>
                        </div>

                        {/* Submissions */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-start justify-between group hover:bg-white/[0.07] transition-colors">
                            <div>
                                <p className="text-sm text-gray-400 mb-1 font-medium">Submissions</p>
                                <p className="text-2xl font-bold text-white">{campaign._count?.submissions || 0}</p>
                            </div>
                            <div className="rounded-xl p-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                <Video className="h-5 w-5" />
                            </div>
                        </div>
                    </div>

                    {/* Main Grid: Description + Requirements */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Description */}
                        <div className="lg:col-span-1 flex flex-col h-full">
                            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                Description
                            </h3>
                            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex-1 overflow-y-auto max-h-[400px] text-sm text-gray-300 leading-relaxed shadow-inner">
                                {renderDescription(campaign.description)}
                            </div>
                        </div>

                        {/* Short Videos Requirements */}
                        <div className="lg:col-span-1">
                            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                                Short Videos
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group hover:bg-white/[0.07] transition-colors">
                                    <span className="text-sm text-gray-400">Payout Rate</span>
                                    <span className="text-lg font-bold text-green-400">{formatPayout(campaign.payout)}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group hover:bg-white/[0.07] transition-colors">
                                    <span className="text-sm text-gray-400">View Cap</span>
                                    <span className="text-base font-semibold text-white">{campaign.viewCap ? campaign.viewCap.toLocaleString() : "No limit"}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group hover:bg-white/[0.07] transition-colors">
                                    <span className="text-sm text-gray-400">Min Views</span>
                                    <span className="text-base font-semibold text-white">{campaign.minViewsShorts ? campaign.minViewsShorts.toLocaleString() : "None"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Long Videos Requirements */}
                        <div className="lg:col-span-1">
                            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                                Long Videos
                            </h3>
                            <div className="space-y-3">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group hover:bg-white/[0.07] transition-colors">
                                    <span className="text-sm text-gray-400">Payout Rate</span>
                                    <span className="text-lg font-bold text-purple-400">{campaign.payoutLong ? formatPayout(campaign.payoutLong) : "N/A"}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group hover:bg-white/[0.07] transition-colors">
                                    <span className="text-sm text-gray-400">View Cap</span>
                                    <span className="text-base font-semibold text-white">{campaign.longViewCap ? campaign.longViewCap.toLocaleString() : "No limit"}</span>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center group hover:bg-white/[0.07] transition-colors">
                                    <span className="text-sm text-gray-400">Min Views</span>
                                    <span className="text-base font-semibold text-white">{campaign.minViewsLong ? campaign.minViewsLong.toLocaleString() : "None"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Progress */}
                    {budgetAmount > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <p className="text-sm text-gray-400 font-medium mb-1">Budget Progress</p>
                                    <p className="text-2xl font-bold text-white">${spent.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-gray-500 text-lg font-normal">/ ${budgetAmount.toLocaleString()}</span></p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xl font-bold ${percentUsed >= 90 ? 'text-red-400' : percentUsed >= 70 ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {percentUsed.toFixed(1)}%
                                    </span>
                                    <p className="text-xs text-gray-500">claimed</p>
                                </div>
                            </div>
                            <div className="h-4 rounded-full bg-white/[0.05] overflow-hidden border border-white/5">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${percentUsed >= 90 ? 'bg-gradient-to-r from-red-600 to-red-400' : percentUsed >= 70 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-gradient-to-r from-green-600 to-green-400'}`}
                                    style={{ width: `${percentUsed}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Footer: Platforms + Actions */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Available on:</span>
                            <div className="flex gap-2">
                                {platforms.map((p) => <PlatformBadge key={p} platform={p} />)}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {campaign.infoLink && (
                                <a
                                    href={campaign.infoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-3 rounded-xl bg-white/5 text-gray-300 text-sm font-medium hover:text-white hover:bg-white/10 transition-all border border-white/5 flex items-center gap-2"
                                >
                                    Read Guidelines <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            )}
                            <Link
                                href={(isFull || isPaused) ? "#" : `/dashboard/submit?campaign=${campaign.id}`}
                                onClick={(e) => {
                                    if (isFull || isPaused) e.preventDefault();
                                    e.stopPropagation();
                                }}
                                className={`flex-1 md:flex-none px-10 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${(isFull || isPaused)
                                    ? "bg-[#151515] border border-white/5 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white hover:scale-[1.02] hover:shadow-blue-500/20 active:scale-[0.98]"
                                    }`}
                            >
                                {isPaused ? (
                                    <><Pause className="h-4 w-4" /> Paused</>
                                ) : isFull ? "Campaign Full" : "Submit Video"}
                                {!isFull && !isPaused && <ChevronRight className="h-4 w-4" />}
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}


function CampaignCard({ campaign, delay, onClick }: { campaign: Campaign; delay: number; onClick: () => void }) {
    const platforms = campaign.allowedPlatforms.split(",").map((p) => p.trim());
    const deadline = campaign.deadline ? new Date(campaign.deadline) : null;
    const isExpiringSoon =
        deadline && deadline.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;
    const [thumbnail, setThumbnail] = useState<string | null>(campaign.thumbnail || null);

    // Calculate if campaign is full
    const budgetMatch = campaign.budget?.match(/[\d,]+/);
    const budgetAmount = budgetMatch ? parseFloat(budgetMatch[0].replace(/,/g, '')) : 0;
    const spent = Math.min(campaign.totalSpent || 0, budgetAmount);
    const percentUsed = budgetAmount > 0 ? Math.min(100, (spent / budgetAmount) * 100) : 0;
    // Trust backend's canSubmit calculation which checks budget, acceptingSubmissions, active status, and paused
    const isFull = campaign.canSubmit === false && !campaign.paused;
    const isPaused = campaign.paused === true;

    useEffect(() => {
        // If already have thumbnail, don't fetch
        if (campaign.thumbnail) return;

        // Try to extract universe ID from URL for Roblox games
        const match = campaign.game.match(/games\/(\d+)/);
        if (!match) return;

        const placeId = match[1];
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        // Fetch thumbnail via our backend proxy
        fetch(`${API_URL}/api/roblox/thumbnail/${placeId}`)
            .then(res => res.json())
            .then(data => {
                if (data.imageUrl) {
                    setThumbnail(data.imageUrl);
                }
            })
            .catch(err => console.error('Failed to fetch game thumbnail:', err));
    }, [campaign.game, campaign.thumbnail]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            onClick={onClick}
            className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer"
        >
            {/* Header with thumbnail */}
            <div className="flex items-start gap-4 mb-4">
                {/* Game Thumbnail */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                    {thumbnail ? (
                        <img
                            src={thumbnail}
                            alt={campaign.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Gamepad2 className="h-7 w-7 text-gray-400" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                            {campaign.name}
                        </h3>
                        {!isFull && !isPaused && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold border border-green-500/30 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                Active
                            </span>
                        )}
                        {isPaused && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold border border-yellow-500/30 flex items-center gap-1">
                                <Pause className="w-3 h-3" />
                                Paused
                            </span>
                        )}
                        {isFull && (
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                                Full
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <a
                            href={campaign.game}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-500 hover:text-blue-400 transition-colors"
                        >
                            View Game ↗
                        </a>
                        <span className="text-gray-700">•</span>
                        <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            Started {getRelativeTime(campaign.createdAt)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Short Form</p>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-semibold text-white">
                            {formatPayout(campaign.payout)}
                        </span>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-gray-500 mb-1">Long Form</p>
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-purple-400" />
                        <span className="text-sm font-semibold text-white">
                            {campaign.payoutLong ? formatPayout(campaign.payoutLong) : "N/A"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Budget Progress Bar */}
            {budgetAmount > 0 && (
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-500">Budget Usage</span>
                        <span className={`font-medium ${percentUsed >= 90 ? 'text-red-400' : percentUsed >= 70 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {percentUsed.toFixed(0)}%
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${percentUsed >= 90 ? 'bg-red-500' :
                                percentUsed >= 70 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                }`}
                            style={{ width: `${percentUsed}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>${spent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} spent</span>
                        <span>${budgetAmount.toLocaleString()} total</span>
                    </div>
                </div>
            )}

            {/* Platforms with icons */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {platforms.map((p) => (
                    <PlatformBadge key={p} platform={p} />
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-all duration-300 bg-white/5 border border-white/10 text-white hover:bg-white/10"
                >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                    href={(isFull || isPaused) ? "#" : `/dashboard/submit?campaign=${campaign.id}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isFull || isPaused) e.preventDefault();
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${(isFull || isPaused)
                        ? "bg-gray-500/10 text-gray-500 cursor-not-allowed border border-gray-500/10"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                >
                    {isPaused ? (
                        <><Pause className="h-4 w-4" /> Paused</>
                    ) : isFull ? "Campaign Full" : "Submit Video"}
                    {!isFull && !isPaused && <ChevronRight className="h-4 w-4" />}
                </Link>
            </div>
        </motion.div>
    );
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    useEffect(() => {
        fetch(`${API_URL}/api/campaigns`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                setCampaigns(data.campaigns || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch campaigns:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    if (campaigns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <div className="rounded-full bg-white/5 p-6 mb-4">
                    <Calendar className="h-12 w-12 text-gray-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                    No Active Campaigns
                </h2>
                <p className="text-gray-400 text-center max-w-md">
                    There are no active campaigns at the moment. Check back later or watch
                    the Discord announcements for new opportunities.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Green pulsing dot */}
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Active Campaigns</h2>
                        <p className="text-sm text-gray-400">
                            {campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}{" "}
                            available
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign, i) => (
                    <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        delay={i * 0.05}
                        onClick={() => setSelectedCampaign(campaign)}
                    />
                ))}
            </div>

            {/* Campaign Detail Modal */}
            <AnimatePresence>
                {selectedCampaign && (
                    <CampaignModal
                        campaign={selectedCampaign}
                        onClose={() => setSelectedCampaign(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
