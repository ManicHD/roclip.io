"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Eye,
    DollarSign,
    Users,
    Video,
    ExternalLink,
    Edit3,
    Save,
    X,
    RotateCcw,
    Filter,
    CheckCircle,
    Clock,
    XCircle,
    AlertTriangle,
    SortAsc,
    SortDesc,
} from "lucide-react";
import ConfirmModal from "@/app/components/ConfirmModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Submission {
    id: number;
    userId: string;
    username: string;
    videoLink: string;
    videoTitle?: string;
    platform: string;
    videoType: string;
    status: string;
    currentViews: number;
    manualViewCount?: number;
    frozenViewCount?: number;
    initialViews: number;
    earnings: number;
    createdAt: string;
}

interface Campaign {
    id: number;
    name: string;
    game: string;
    budget: string;
    payout: string;
    payoutLong?: string;
    active: boolean;
    viewCap?: number;
    longViewCap?: number;
}

interface Stats {
    totalViews: number;
    totalSpent: number;
    statusCounts: {
        all: number;
        accepted: number;
        pending: number;
        denied: number;
        flagged: number;
    };
    platformCounts: {
        all: number;
        youtube: number;
        tiktok: number;
        instagram: number;
    };
}

export default function CampaignDetailPage({ params }: { params: Promise<{ campaignId: string }> }) {
    const resolvedParams = use(params);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [platformFilter, setPlatformFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Sorting
    type SortOption = 'date' | 'views' | 'earnings';
    type SortDirection = 'asc' | 'desc';
    const [sortBy, setSortBy] = useState<SortOption>('date');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    // Edit state
    const [editingViews, setEditingViews] = useState<{ [key: number]: number }>({});
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: "danger" | "warning" | "info";
    }>({ isOpen: false, title: "", message: "", onConfirm: () => { } });

    const fetchCampaign = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (platformFilter !== "all") queryParams.set("platform", platformFilter);
            if (statusFilter !== "all") queryParams.set("status", statusFilter);

            const res = await fetch(
                `${API_URL}/api/admin/campaigns/${resolvedParams.campaignId}?${queryParams}`,
                { credentials: "include" }
            );
            if (!res.ok) throw new Error("Failed to fetch campaign");
            const data = await res.json();
            setCampaign(data.campaign);
            setSubmissions(data.submissions);
            setStats(data.stats);
        } catch (err) {
            console.error("Error fetching campaign:", err);
            setError("Failed to load campaign details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaign();
    }, [resolvedParams.campaignId, platformFilter, statusFilter]);

    const handleUpdateViews = async (submissionId: number, newViews: number) => {
        setConfirmModal({
            isOpen: true,
            title: "Update View Count",
            message: `Set view count to ${newViews.toLocaleString()}?`,
            variant: "warning",
            onConfirm: () => updateViewsConfirmed(submissionId, newViews),
        });
    };

    const updateViewsConfirmed = async (submissionId: number, newViews: number) => {
        try {
            const res = await fetch(
                `${API_URL}/api/admin/submissions/${submissionId}/views`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ manualViewCount: newViews }),
                }
            );
            if (!res.ok) throw new Error("Failed to update views");
            setEditingViews(prev => {
                const updated = { ...prev };
                delete updated[submissionId];
                return updated;
            });
            fetchCampaign();
        } catch (err) {
            setError("Failed to update view count");
        }
    };

    const handleRevertToLive = async (submissionId: number) => {
        setConfirmModal({
            isOpen: true,
            title: "Revert to Live Views",
            message: "Remove manual override and use live view count?",
            variant: "warning",
            onConfirm: () => revertToLiveConfirmed(submissionId),
        });
    };

    const revertToLiveConfirmed = async (submissionId: number) => {
        try {
            const res = await fetch(
                `${API_URL}/api/admin/submissions/${submissionId}/views`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ manualViewCount: null }),
                }
            );
            if (!res.ok) throw new Error("Failed to revert views");
            fetchCampaign();
        } catch (err) {
            setError("Failed to revert to live views");
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACCEPTED":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-green-500/10 text-green-400">
                        <CheckCircle className="h-3 w-3" /> Accepted
                    </span>
                );
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-yellow-500/10 text-yellow-400">
                        <Clock className="h-3 w-3" /> Pending
                    </span>
                );
            case "DENIED":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-red-500/10 text-red-400">
                        <XCircle className="h-3 w-3" /> Denied
                    </span>
                );
            case "FLAGGED":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-orange-500/10 text-orange-400">
                        <AlertTriangle className="h-3 w-3" /> Flagged
                    </span>
                );
            default:
                return <span className="text-xs text-gray-400">{status}</span>;
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case "youtube": return (
                <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            );
            case "tiktok": return (
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
            );
            case "instagram": return (
                <svg className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
            );
            default: return (
                <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            );
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-32 rounded bg-white/5 animate-pulse" />
                <div className="h-32 rounded-2xl bg-white/5 animate-pulse" />
                <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="space-y-4">
                <Link href="/dashboard/admin/campaigns" className="inline-flex items-center gap-2 text-gray-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" /> Back to Campaigns
                </Link>
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400">{error || "Campaign not found"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* Back Button */}
            <Link href="/dashboard/admin/campaigns" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Campaigns
            </Link>

            {/* Campaign Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
                            {campaign.active ? (
                                <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium">Active</span>
                            ) : (
                                <span className="px-2 py-1 rounded-lg bg-gray-500/10 text-gray-400 text-xs font-medium">Inactive</span>
                            )}
                        </div>
                        <p className="text-gray-400">{campaign.game}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                            <p className="text-gray-400">Budget</p>
                            <p className="text-white font-semibold">{campaign.budget}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400">Payout</p>
                            <p className="text-white font-semibold">{campaign.payout}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Video className="h-4 w-4" /> Submissions
                        </div>
                        <p className="text-xl font-bold text-white">{stats?.statusCounts.all || 0}</p>
                        <p className="text-xs text-green-400">{stats?.statusCounts.accepted || 0} accepted</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Eye className="h-4 w-4" /> Total Views
                        </div>
                        <p className="text-xl font-bold text-white">{formatNumber(stats?.totalViews || 0)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <DollarSign className="h-4 w-4" /> Spent
                        </div>
                        <p className="text-xl font-bold text-white">${stats?.totalSpent.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Users className="h-4 w-4" /> Platforms
                        </div>
                        <div className="flex gap-3 text-xs items-center">
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <span className="text-white">{stats?.platformCounts.youtube || 0}</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                </svg>
                                <span className="text-white">{stats?.platformCounts.tiktok || 0}</span>
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="h-3.5 w-3.5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                                </svg>
                                <span className="text-white">{stats?.platformCounts.instagram || 0}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-4"
            >
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Filters:</span>
                </div>

                {/* Platform Filter */}
                <div className="flex rounded-xl overflow-hidden border border-white/10">
                    {["all", "youtube", "tiktok", "instagram"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPlatformFilter(p)}
                            className={`px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5 ${platformFilter === p
                                ? "bg-blue-500 text-white"
                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            {p === "all" ? "All" : p === "youtube" ? (
                                <>
                                    <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    YouTube
                                </>
                            ) : p === "tiktok" ? (
                                <>
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                    </svg>
                                    TikTok
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                                    </svg>
                                    Instagram
                                </>
                            )}
                        </button>
                    ))}
                </div>

                {/* Status Filter */}
                <div className="flex rounded-xl overflow-hidden border border-white/10">
                    {["all", "accepted", "pending", "denied", "flagged"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 text-sm capitalize transition-colors ${statusFilter === s
                                ? "bg-blue-500 text-white"
                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            {s} {s !== "all" && `(${stats?.statusCounts[s as keyof typeof stats.statusCounts] || 0})`}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-white/10 hidden sm:block" />

                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Sort:</span>
                    <div className="flex rounded-xl overflow-hidden border border-white/10">
                        {[
                            { value: 'date', label: 'Date' },
                            { value: 'views', label: 'Views' },
                            { value: 'earnings', label: 'Earnings' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSortBy(option.value as SortOption)}
                                className={`px-3 py-1.5 text-sm transition-colors ${sortBy === option.value
                                    ? "bg-purple-500 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        title={sortDirection === 'desc' ? 'Highest first' : 'Lowest first'}
                    >
                        {sortDirection === 'desc' ? (
                            <SortDesc className="h-4 w-4 text-purple-400" />
                        ) : (
                            <SortAsc className="h-4 w-4 text-purple-400" />
                        )}
                        <span className="text-sm text-gray-400">
                            {sortDirection === 'desc' ? 'High→Low' : 'Low→High'}
                        </span>
                    </button>
                </div>
            </motion.div>

            {/* Submissions List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
            >
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-semibold text-white">Submissions</h2>
                </div>

                {submissions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No submissions found
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {[...submissions].sort((a, b) => {
                            let aValue: number = 0;
                            let bValue: number = 0;

                            switch (sortBy) {
                                case 'views':
                                    aValue = a.manualViewCount ?? a.frozenViewCount ?? a.currentViews;
                                    bValue = b.manualViewCount ?? b.frozenViewCount ?? b.currentViews;
                                    break;
                                case 'earnings':
                                    aValue = a.earnings;
                                    bValue = b.earnings;
                                    break;
                                case 'date':
                                default:
                                    aValue = new Date(a.createdAt).getTime();
                                    bValue = new Date(b.createdAt).getTime();
                                    break;
                            }

                            return sortDirection === 'asc'
                                ? aValue - bValue
                                : bValue - aValue;
                        }).map((sub) => (
                            <div key={sub.id} className="p-4 hover:bg-white/5 transition-colors">
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    {/* Left: Video Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span>{getPlatformIcon(sub.platform)}</span>
                                            <span className="text-sm font-medium text-white truncate">
                                                {sub.videoTitle || "Untitled Video"}
                                            </span>
                                            {getStatusBadge(sub.status)}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <Link href={`/dashboard/admin/users/${sub.userId}`} className="hover:text-blue-400 transition-colors">
                                                @{sub.username}
                                            </Link>
                                            <span>•</span>
                                            <span className="capitalize">{sub.videoType}</span>
                                            <span>•</span>
                                            <span>{formatDate(sub.createdAt)}</span>
                                            <a
                                                href={sub.videoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-400 transition-colors inline-flex items-center gap-1"
                                            >
                                                <ExternalLink className="h-3 w-3" /> View
                                            </a>
                                        </div>
                                    </div>

                                    {/* Right: Views & Earnings */}
                                    <div className="flex items-center gap-6">
                                        {/* Views Editor */}
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 mb-1">Views</p>
                                            <div className="flex items-center gap-2">
                                                {editingViews[sub.id] !== undefined ? (
                                                    <>
                                                        <input
                                                            type="number"
                                                            value={editingViews[sub.id]}
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value) || 0;
                                                                setEditingViews(prev => ({ ...prev, [sub.id]: val }));
                                                            }}
                                                            className="w-24 px-2 py-1 text-sm text-white bg-white/5 border border-blue-500 rounded-lg focus:outline-none"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => handleUpdateViews(sub.id, editingViews[sub.id])}
                                                            className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                                            title="Save"
                                                        >
                                                            <Save className="h-3.5 w-3.5 text-green-400" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingViews(prev => {
                                                                    const updated = { ...prev };
                                                                    delete updated[sub.id];
                                                                    return updated;
                                                                });
                                                            }}
                                                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X className="h-3.5 w-3.5 text-red-400" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-sm font-medium text-white">
                                                            {(sub.manualViewCount ?? sub.frozenViewCount ?? sub.currentViews).toLocaleString()}
                                                        </span>
                                                        <button
                                                            onClick={() => {
                                                                setEditingViews(prev => ({
                                                                    ...prev,
                                                                    [sub.id]: sub.manualViewCount ?? sub.currentViews
                                                                }));
                                                            }}
                                                            className="p-1 rounded hover:bg-white/10 transition-colors"
                                                            title="Edit views"
                                                        >
                                                            <Edit3 className="h-3.5 w-3.5 text-gray-400" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            {sub.manualViewCount && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-yellow-400">
                                                        Manual ({sub.currentViews.toLocaleString()} actual)
                                                    </span>
                                                    <button
                                                        onClick={() => handleRevertToLive(sub.id)}
                                                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                                        title="Revert to live views"
                                                    >
                                                        <RotateCcw className="h-2.5 w-2.5" />
                                                        Live
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Earnings */}
                                        <div className="text-right min-w-[70px]">
                                            <p className="text-xs text-gray-400 mb-1">Earnings</p>
                                            <p className="text-sm font-medium text-green-400">
                                                ${sub.earnings.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
