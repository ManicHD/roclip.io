"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Megaphone,
    Users,
    Eye,
    DollarSign,
    Clock,
    ArrowRight,
    TrendingUp,
    Zap,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Campaign {
    id: number;
    name: string;
    game: string;
    budget: string;
    payout: string;
    active: boolean;
    deadline: string | null;
    createdAt: string;
    _count: {
        submissions: number;
    };
    totalViews?: number;
    totalSpent?: number;
}

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

// Helper to format large numbers
const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
};

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/campaigns`, {
                credentials: "include",
            });
            const data = await res.json();
            setCampaigns(data.campaigns || []);
        } catch (err) {
            console.error("Failed to fetch campaigns:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="h-44 rounded-2xl bg-white/5 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    // Separate active and inactive campaigns
    const activeCampaigns = campaigns.filter(c => c.active);
    const inactiveCampaigns = campaigns.filter(c => !c.active);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Campaigns</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Manage all platform campaigns
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <span className="text-blue-400 font-medium">{activeCampaigns.length} Active</span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                        <span className="text-gray-400 font-medium">{inactiveCampaigns.length} Inactive</span>
                    </div>
                </div>
            </div>

            {/* Active Campaigns */}
            {activeCampaigns.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-400" />
                        Active Campaigns
                    </h2>
                    <div className="grid gap-4">
                        {activeCampaigns.map((campaign, index) => {
                            const budgetNum = parseFloat(campaign.budget) || 0;
                            const spentNum = campaign.totalSpent || 0;
                            const budgetProgress = budgetNum > 0 ? Math.min((spentNum / budgetNum) * 100, 100) : 0;

                            return (
                                <Link key={campaign.id} href={`/dashboard/admin/campaigns/${campaign.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
                                    >
                                        {/* Glow effect on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative p-6">
                                            <div className="flex items-start justify-between gap-6">
                                                {/* Left: Campaign info */}
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="rounded-2xl bg-blue-500/10 p-4 border border-blue-500/20">
                                                        <Megaphone className="h-7 w-7 text-blue-400" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        {/* Title row */}
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="text-xl font-bold text-white truncate">
                                                                {campaign.name}
                                                            </h3>
                                                            <span className="shrink-0 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold border border-blue-500/30 flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                                                Active
                                                            </span>
                                                        </div>

                                                        {/* Game & Time */}
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <p className="text-sm text-gray-400">
                                                                {campaign.game}
                                                            </p>
                                                            <span className="text-gray-600">•</span>
                                                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                Started {getRelativeTime(campaign.createdAt)}
                                                            </div>
                                                        </div>

                                                        {/* Stats Grid */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                                <p className="text-xs text-gray-500 mb-1">Submissions</p>
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="h-4 w-4 text-blue-400" />
                                                                    <p className="text-lg font-semibold text-white">
                                                                        {campaign._count?.submissions || 0}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                                <p className="text-xs text-gray-500 mb-1">Total Views</p>
                                                                <div className="flex items-center gap-2">
                                                                    <Eye className="h-4 w-4 text-purple-400" />
                                                                    <p className="text-lg font-semibold text-white">
                                                                        {formatNumber(campaign.totalViews || 0)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                                <p className="text-xs text-gray-500 mb-1">Budget</p>
                                                                <div className="flex items-center gap-2">
                                                                    <DollarSign className="h-4 w-4 text-green-400" />
                                                                    <p className="text-lg font-semibold text-white">
                                                                        ${parseFloat(campaign.budget).toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                                <p className="text-xs text-gray-500 mb-1">Spent</p>
                                                                <div className="flex items-center gap-2">
                                                                    <TrendingUp className="h-4 w-4 text-yellow-400" />
                                                                    <p className="text-lg font-semibold text-white">
                                                                        ${spentNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Budget Progress Bar */}
                                                        <div className="space-y-1.5">
                                                            <div className="flex justify-between text-xs">
                                                                <span className="text-gray-500">Budget Usage</span>
                                                                <span className={`font-medium ${budgetProgress >= 90 ? 'text-red-400' : budgetProgress >= 70 ? 'text-yellow-400' : 'text-green-400'}`}>
                                                                    {budgetProgress.toFixed(1)}%
                                                                </span>
                                                            </div>
                                                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all duration-500 ${budgetProgress >= 90 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                                                                        budgetProgress >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                                                            'bg-gradient-to-r from-green-500 to-emerald-400'
                                                                        }`}
                                                                    style={{ width: `${budgetProgress}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: View Details Button */}
                                                <div className="shrink-0 flex flex-col items-end justify-between h-full">
                                                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all duration-300">
                                                        View Details
                                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Inactive Campaigns */}
            {inactiveCampaigns.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-400 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        Inactive Campaigns
                    </h2>
                    <div className="grid gap-3">
                        {inactiveCampaigns.map((campaign, index) => {
                            const budgetNum = parseFloat(campaign.budget) || 0;
                            const spentNum = campaign.totalSpent || 0;
                            const budgetProgress = budgetNum > 0 ? Math.min((spentNum / budgetNum) * 100, 100) : 0;

                            return (
                                <Link key={campaign.id} href={`/dashboard/admin/campaigns/${campaign.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: (activeCampaigns.length + index) * 0.05 }}
                                        className="group relative rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                                    >
                                        <div className="relative p-5">
                                            <div className="flex items-center justify-between gap-4">
                                                {/* Left: Campaign info */}
                                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                                    <div className="rounded-xl bg-gray-500/10 p-3 border border-gray-500/10">
                                                        <Megaphone className="h-5 w-5 text-gray-500" />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="text-lg font-semibold text-gray-300 truncate">
                                                                {campaign.name}
                                                            </h3>
                                                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-500 text-xs font-medium border border-gray-500/20">
                                                                Inactive
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <span className="text-gray-500">{campaign.game}</span>
                                                            <span className="text-gray-700">•</span>
                                                            <span className="text-gray-600">Started {getRelativeTime(campaign.createdAt)}</span>
                                                            <span className="text-gray-700">•</span>
                                                            <span className="text-gray-500">{campaign._count?.submissions || 0} submissions</span>
                                                            <span className="text-gray-700">•</span>
                                                            <span className="text-gray-500">${spentNum.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} / ${budgetNum.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right: View Details */}
                                                <div className="shrink-0">
                                                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-medium text-sm group-hover:bg-white/10 group-hover:text-white transition-all duration-300">
                                                        View
                                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {campaigns.length === 0 && (
                <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-500/10 border border-gray-500/20 mb-4">
                        <Megaphone className="h-8 w-8 text-gray-500" />
                    </div>
                    <p className="text-gray-500 text-lg">No campaigns found</p>
                    <p className="text-gray-600 text-sm mt-1">Create a campaign via Discord to get started</p>
                </div>
            )}
        </div>
    );
}
