"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    User,
    DollarSign,
    Eye,
    Video,
    CheckCircle,
    AlertCircle,
    ExternalLink,
    Loader2,
    Clock,
    Calendar,
    XCircle,
    Trash2,
    Edit3,
    Save,
    X,
    RotateCcw,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import ConfirmModal from "@/app/components/ConfirmModal";
import TotpModal from "@/app/components/TotpModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface EarningsByCampaign {
    campaignId: number;
    campaignName: string;
    active: boolean;
    submissions: number;
    views: number;
    earnings: number;
}

interface Submission {
    id: number;
    videoLink: string;
    platform: string;
    videoType: string;
    videoTitle?: string;
    currentViews: number;
    manualViewCount?: number;
    status: string;
    earnings: number;
    customRate?: number | null; // Custom RPM override
    campaignRate: number; // Default campaign rate
    campaignName: string;
    createdAt: string;
}

interface Payout {
    id: string;
    amount: number;
    status: string;
    periodStart: string;
    periodEnd: string;
    createdAt: string;
    completedAt?: string;
}

interface UserDetail {
    discordId: string;
    username: string;
    avatar: string | null;
    totalEarnings: number;
    totalPaid: number;
    pendingBalance: number;
    totalViews: number;
    submissionCount: number;
    earningsByCampaign: EarningsByCampaign[];
    eligible: boolean;
    minimumPayout: number;
    stripeConnected: boolean;
    stripeOnboardingComplete: boolean;
    stripeEmail?: string;
    paypalConnected: boolean;
    paypalEmail?: string;
    preferredPaymentMethod?: string;
    submissions: Submission[];
    payoutHistory: Payout[];
}

export default function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
    const resolvedParams = use(params);
    const [user, setUser] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [payoutMessage, setPayoutMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [editingViews, setEditingViews] = useState<{ [key: number]: number }>({});
    const [editingRates, setEditingRates] = useState<{ [key: number]: string }>({});

    // TOTP modal state for payout security
    const [totpModal, setTotpModal] = useState<{ isOpen: boolean; error: string | null }>({
        isOpen: false,
        error: null,
    });

    // List expansion states
    const [showAllCampaigns, setShowAllCampaigns] = useState(false);
    const [showAllSubmissions, setShowAllSubmissions] = useState(false);
    const [showAllPayouts, setShowAllPayouts] = useState(false);

    // Initial display limits
    const CAMPAIGNS_LIMIT = 5;
    const SUBMISSIONS_LIMIT = 5;
    const PAYOUTS_LIMIT = 5;
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: "danger" | "warning" | "info";
    }>({ isOpen: false, title: "", message: "", onConfirm: () => { } });
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/api/admin/users/${resolvedParams.userId}`,
                    { credentials: "include" }
                );
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Error fetching user:", err);
                setError("Failed to load user details");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [resolvedParams.userId]);

    const handleProcessPayout = async () => {
        if (!user) return;
        // Open TOTP modal for security verification
        setPayoutMessage(null);
        setTotpModal({ isOpen: true, error: null });
    };

    const processPayoutConfirmed = async (totpCode: string) => {
        if (!user) return;

        setProcessing(true);
        setTotpModal(prev => ({ ...prev, error: null }));

        try {
            const res = await fetch(
                `${API_URL}/api/admin/payouts/process/${user.discordId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ totpCode }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                // Show error in TOTP modal if it's a TOTP error
                if (data.error?.includes('TOTP') || data.error?.includes('verification') || data.error?.includes('code')) {
                    setTotpModal(prev => ({ ...prev, error: data.error }));
                    setProcessing(false);
                    return;
                }
                throw new Error(data.error || "Failed to process payout");
            }

            // Success - close modal and show success message
            setTotpModal({ isOpen: false, error: null });
            setPayoutMessage({
                type: "success",
                text: `Payout of $${data.amount.toFixed(2)} processed successfully via ${data.method}!`,
            });

            // Refresh user data
            const refreshRes = await fetch(
                `${API_URL}/api/admin/users/${resolvedParams.userId}`,
                { credentials: "include" }
            );
            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                setUser(refreshData);
            }
        } catch (err: any) {
            setTotpModal({ isOpen: false, error: null });
            setPayoutMessage({
                type: "error",
                text: err.message || "Failed to process payout",
            });
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdateViews = async (submissionId: number, newViews: number) => {
        if (newViews < 0) {
            setEditingViews(prev => {
                const updated = { ...prev };
                delete updated[submissionId];
                return updated;
            });
            return;
        }

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

            // Clear editing state
            setEditingViews(prev => {
                const updated = { ...prev };
                delete updated[submissionId];
                return updated;
            });

            // Refresh user data
            const refreshRes = await fetch(
                `${API_URL}/api/admin/users/${resolvedParams.userId}`,
                { credentials: "include" }
            );
            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                setUser(refreshData);
            }
        } catch (err) {
            setError("Failed to update view count");
            setEditingViews(prev => {
                const updated = { ...prev };
                delete updated[submissionId];
                return updated;
            });
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

            // Refresh user data
            const refreshRes = await fetch(
                `${API_URL}/api/admin/users/${resolvedParams.userId}`,
                { credentials: "include" }
            );
            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                setUser(refreshData);
            }
        } catch (err) {
            setError("Failed to revert to live views");
        }
    };

    const handleUpdateRate = async (submissionId: number, newRate: string) => {
        const rateValue = newRate.trim() === '' ? null : parseFloat(newRate);
        if (rateValue !== null && (isNaN(rateValue) || rateValue < 0)) {
            setEditingRates(prev => {
                const updated = { ...prev };
                delete updated[submissionId];
                return updated;
            });
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: "Update Custom RPM",
            message: rateValue === null
                ? "Revert to campaign default rate?"
                : `Set custom rate to $${rateValue.toFixed(2)} per 1k views?`,
            variant: "warning",
            onConfirm: () => updateRateConfirmed(submissionId, rateValue),
        });
    };

    const updateRateConfirmed = async (submissionId: number, newRate: number | null) => {
        try {
            const res = await fetch(
                `${API_URL}/api/admin/submissions/${submissionId}/rate`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ customRate: newRate }),
                }
            );

            if (!res.ok) throw new Error("Failed to update rate");

            // Clear editing state
            setEditingRates(prev => {
                const updated = { ...prev };
                delete updated[submissionId];
                return updated;
            });

            // Refresh user data
            const refreshRes = await fetch(
                `${API_URL}/api/admin/users/${resolvedParams.userId}`,
                { credentials: "include" }
            );
            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                setUser(refreshData);
            }
        } catch (err) {
            setError("Failed to update custom rate");
            setEditingRates(prev => {
                const updated = { ...prev };
                delete updated[submissionId];
                return updated;
            });
        }
    };

    const handleRevertToDefaultRate = async (submissionId: number) => {
        setConfirmModal({
            isOpen: true,
            title: "Revert to Campaign Rate",
            message: "Remove custom rate and use campaign default?",
            variant: "warning",
            onConfirm: () => updateRateConfirmed(submissionId, null),
        });
    };

    const handleDeleteSubmission = async (submissionId: number, campaignName: string) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Submission",
            message: `Delete this submission from ${campaignName}? This cannot be undone.`,
            variant: "danger",
            onConfirm: () => deleteSubmissionConfirmed(submissionId),
        });
    };

    const deleteSubmissionConfirmed = async (submissionId: number) => {

        try {
            const res = await fetch(
                `${API_URL}/api/admin/submissions/${submissionId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Failed to delete submission");

            // Refresh user data
            const refreshRes = await fetch(
                `${API_URL}/api/admin/users/${resolvedParams.userId}`,
                { credentials: "include" }
            );
            if (refreshRes.ok) {
                const refreshData = await refreshRes.json();
                setUser(refreshData);
            }
        } catch (err) {
            setError("Failed to delete submission");
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

    const getPayoutStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                    </span>
                );
            case "PROCESSING":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing
                    </span>
                );
            case "FAILED":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-400">
                        <XCircle className="h-3 w-3" />
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/10 text-gray-400">
                        <Clock className="h-3 w-3" />
                        Pending
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-32 rounded bg-white/5 animate-pulse" />
                <div className="h-48 rounded-2xl bg-white/5 animate-pulse" />
                <div className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="space-y-4">
                <Link
                    href="/dashboard/admin/users"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Users
                </Link>
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400">{error || "User not found"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Error Notification */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                >
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-400">Error</p>
                        <p className="text-sm text-red-300 mt-1">{error}</p>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            )}

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                variant={confirmModal.variant}
            />

            {/* TOTP Modal for Payout Security */}
            <TotpModal
                isOpen={totpModal.isOpen}
                onClose={() => setTotpModal({ isOpen: false, error: null })}
                onVerify={processPayoutConfirmed}
                title="Payout Verification"
                message={`Enter your 6-digit code to process payout of $${user?.pendingBalance?.toFixed(2) || '0.00'} to ${user?.username || 'user'}.`}
                loading={processing}
                error={totpModal.error}
            />

            {/* Back Button */}
            <Link
                href="/dashboard/admin/users"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Users
            </Link>

            {/* User Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden border border-white/10">
                            {user.avatar ? (
                                <img
                                    src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-bold text-white">
                                    {user.username?.[0]?.toUpperCase() || "?"}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                            <p className="text-gray-400">{user.discordId}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Stripe Status */}
                        {user.stripeConnected ? (
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${user.preferredPaymentMethod === 'stripe'
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                : 'bg-green-500/10 text-green-400 border-green-500/20'
                                }`}>
                                <CheckCircle className="h-4 w-4" />
                                Stripe
                                {user.preferredPaymentMethod === 'stripe' && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20">PREFERRED</span>
                                )}
                                {user.stripeEmail && (
                                    <span className="text-xs text-gray-400 hidden sm:inline">({user.stripeEmail})</span>
                                )}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-gray-400 border border-white/10">
                                <AlertCircle className="h-4 w-4" />
                                No Stripe
                            </span>
                        )}

                        {/* PayPal Status */}
                        {user.paypalConnected ? (
                            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${user.preferredPaymentMethod === 'paypal'
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                : 'bg-green-500/10 text-green-400 border-green-500/20'
                                }`}>
                                <CheckCircle className="h-4 w-4" />
                                PayPal
                                {user.preferredPaymentMethod === 'paypal' && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20">PREFERRED</span>
                                )}
                                {user.paypalEmail && (
                                    <span className="text-xs text-gray-400 hidden sm:inline">({user.paypalEmail})</span>
                                )}
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 text-gray-400 border border-white/10">
                                <AlertCircle className="h-4 w-4" />
                                No PayPal
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <DollarSign className="h-4 w-4" /> Pending
                        </div>
                        <p className={`text-xl font-bold ${user.eligible ? "text-green-400" : "text-white"}`}>
                            ${user.pendingBalance.toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <DollarSign className="h-4 w-4" /> Total Earned
                        </div>
                        <p className="text-xl font-bold text-white">
                            ${user.totalEarnings.toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <CheckCircle className="h-4 w-4" /> Paid Out
                        </div>
                        <p className="text-xl font-bold text-white">
                            ${user.totalPaid.toFixed(2)}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Eye className="h-4 w-4" /> Total Views
                        </div>
                        <p className="text-xl font-bold text-white">
                            {formatNumber(user.totalViews)}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Video className="h-4 w-4" /> Submissions
                        </div>
                        <p className="text-xl font-bold text-white">{user.submissionCount}</p>
                    </div>
                </div>

                {/* Payout Button */}
                {payoutMessage && (
                    <div
                        className={`mt-4 p-4 rounded-xl ${payoutMessage.type === "success"
                            ? "bg-green-500/10 border border-green-500/20"
                            : "bg-red-500/10 border border-red-500/20"
                            }`}
                    >
                        <p className={payoutMessage.type === "success" ? "text-green-400" : "text-red-400"}>
                            {payoutMessage.text}
                        </p>
                    </div>
                )}

                <div className="mt-6 flex items-center gap-4 flex-wrap">
                    {user.eligible && (user.stripeConnected || user.paypalConnected) ? (
                        <>
                            <button
                                onClick={handleProcessPayout}
                                disabled={processing}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <DollarSign className="h-5 w-5" />
                                        Process Payout (${user.pendingBalance.toFixed(2)})
                                    </>
                                )}
                            </button>
                            <span className="text-sm text-gray-400">
                                via {user.preferredPaymentMethod === 'paypal'
                                    ? 'PayPal'
                                    : user.preferredPaymentMethod === 'stripe'
                                        ? 'Stripe'
                                        : user.stripeConnected
                                            ? 'Stripe'
                                            : 'PayPal'
                                }
                            </span>
                        </>
                    ) : (
                        <div className="text-gray-400 text-sm">
                            {!user.eligible && (
                                <p>Balance below ${user.minimumPayout} minimum (needs ${(user.minimumPayout - user.pendingBalance).toFixed(2)} more)</p>
                            )}
                            {user.eligible && !user.stripeConnected && !user.paypalConnected && (
                                <p>User needs to connect Stripe or PayPal before receiving payouts</p>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Earnings by Campaign */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
                <h2 className="text-lg font-semibold text-white mb-4">Earnings by Campaign</h2>
                {user.earningsByCampaign.length === 0 ? (
                    <p className="text-gray-500">No earnings yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                                    <th className="pb-3">Campaign</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3 text-right">Submissions</th>
                                    <th className="pb-3 text-right">Views</th>
                                    <th className="pb-3 text-right">Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(showAllCampaigns
                                    ? user.earningsByCampaign
                                    : user.earningsByCampaign.slice(0, CAMPAIGNS_LIMIT)
                                ).map((campaign) => (
                                    <tr
                                        key={campaign.campaignId}
                                        className="border-b border-white/5"
                                    >
                                        <td className="py-3 text-white font-medium">
                                            {campaign.campaignName}
                                        </td>
                                        <td className="py-3">
                                            {campaign.active ? (
                                                <span className="px-2 py-1 rounded-lg text-xs bg-green-500/10 text-green-400">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-lg text-xs bg-gray-500/10 text-gray-400">
                                                    Ended
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 text-right text-gray-300">
                                            {campaign.submissions}
                                        </td>
                                        <td className="py-3 text-right text-gray-300">
                                            {formatNumber(campaign.views)}
                                        </td>
                                        <td className="py-3 text-right text-green-400 font-medium">
                                            ${campaign.earnings.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-semibold">
                                    <td colSpan={4} className="pt-3 text-white">Total Pending</td>
                                    <td className="pt-3 text-right text-green-400">
                                        ${user.pendingBalance.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                        {user.earningsByCampaign.length > CAMPAIGNS_LIMIT && (
                            <button
                                onClick={() => setShowAllCampaigns(!showAllCampaigns)}
                                className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors mx-auto"
                            >
                                {showAllCampaigns ? (
                                    <>
                                        <ChevronUp className="h-4 w-4" />
                                        Show Less
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-4 w-4" />
                                        See More ({user.earningsByCampaign.length - CAMPAIGNS_LIMIT} more)
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </motion.div>

            {/* Submission History */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
            >
                {(() => {
                    const acceptedSubmissions = user.submissions.filter(sub => sub.status === 'ACCEPTED');
                    return (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">Accepted Submissions</h2>
                                {acceptedSubmissions.length > 0 && (
                                    <span className="text-sm text-gray-400">{acceptedSubmissions.length} total</span>
                                )}
                            </div>
                            {acceptedSubmissions.length === 0 ? (
                                <p className="text-gray-500">No submissions yet</p>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        {(showAllSubmissions
                                            ? acceptedSubmissions
                                            : acceptedSubmissions.slice(0, SUBMISSIONS_LIMIT)
                                        ).map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="flex flex-col flex-1">
                                                        <span className="text-sm font-medium text-white truncate max-w-xs" title={sub.videoTitle}>
                                                            {sub.videoTitle || sub.campaignName}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {sub.videoTitle ? `${sub.campaignName} · ` : ''}{sub.platform} · {sub.videoType} · {formatDate(sub.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    {/* View Count Editor */}
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center gap-2">
                                                            <Eye className="h-3.5 w-3.5 text-gray-400" />
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
                                                                    <span className="w-24 px-2 py-1 text-sm text-white">
                                                                        {(sub.manualViewCount ?? sub.currentViews).toLocaleString()}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingViews(prev => ({
                                                                                ...prev,
                                                                                [sub.id]: sub.manualViewCount ?? sub.currentViews
                                                                            }));
                                                                        }}
                                                                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
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
                                                                    className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                                                    title="Revert to live views"
                                                                >
                                                                    <RotateCcw className="h-3 w-3" />
                                                                    Live
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Custom RPM Editor */}
                                                    <div className="flex flex-col items-end">
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                                                            {editingRates[sub.id] !== undefined ? (
                                                                <>
                                                                    <div className="flex items-center">
                                                                        <span className="text-xs text-gray-500 mr-1">$</span>
                                                                        <input
                                                                            type="number"
                                                                            step="0.01"
                                                                            min="0"
                                                                            value={editingRates[sub.id]}
                                                                            onChange={(e) => {
                                                                                setEditingRates(prev => ({ ...prev, [sub.id]: e.target.value }));
                                                                            }}
                                                                            className="w-16 px-2 py-1 text-sm text-white bg-white/5 border border-purple-500 rounded-lg focus:outline-none"
                                                                            placeholder={sub.campaignRate?.toString() || "0"}
                                                                            autoFocus
                                                                        />
                                                                        <span className="text-xs text-gray-500 ml-1">/1k</span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleUpdateRate(sub.id, editingRates[sub.id])}
                                                                        className="p-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors"
                                                                        title="Save"
                                                                    >
                                                                        <Save className="h-3.5 w-3.5 text-green-400" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingRates(prev => {
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
                                                                    <span className={`text-sm ${sub.customRate ? 'text-purple-400 font-medium' : 'text-gray-400'}`}>
                                                                        ${(sub.customRate ?? sub.campaignRate)?.toFixed(2)}/1k
                                                                    </span>
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingRates(prev => ({
                                                                                ...prev,
                                                                                [sub.id]: (sub.customRate ?? sub.campaignRate)?.toString() || ''
                                                                            }));
                                                                        }}
                                                                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                                                                        title="Edit RPM"
                                                                    >
                                                                        <Edit3 className="h-3.5 w-3.5 text-gray-400" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                        {sub.customRate && (
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs text-purple-400">
                                                                    Custom (default: ${sub.campaignRate?.toFixed(2)})
                                                                </span>
                                                                <button
                                                                    onClick={() => handleRevertToDefaultRate(sub.id)}
                                                                    className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors"
                                                                    title="Revert to campaign rate"
                                                                >
                                                                    <RotateCcw className="h-3 w-3" />
                                                                    Default
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Earnings */}
                                                    <div className="text-right min-w-[80px]">
                                                        <p className="text-sm font-medium text-green-400">
                                                            ${sub.earnings.toFixed(2)}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={sub.videoLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                            title="Open video"
                                                        >
                                                            <ExternalLink className="h-4 w-4 text-gray-400" />
                                                        </a>
                                                        <button
                                                            onClick={() => handleDeleteSubmission(sub.id, sub.campaignName)}
                                                            className="p-2 rounded-lg hover:bg-red-500/10 transition-colors group"
                                                            title="Delete submission"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {acceptedSubmissions.length > SUBMISSIONS_LIMIT && (
                                        <button
                                            onClick={() => setShowAllSubmissions(!showAllSubmissions)}
                                            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors mx-auto"
                                        >
                                            {showAllSubmissions ? (
                                                <>
                                                    <ChevronUp className="h-4 w-4" />
                                                    Show Less
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="h-4 w-4" />
                                                    See More ({acceptedSubmissions.length - SUBMISSIONS_LIMIT} more)
                                                </>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    );
                })()}
            </motion.div>

            {/* Payout History */}
            {user.payoutHistory.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Payout History</h2>
                        <span className="text-sm text-gray-400">{user.payoutHistory.length} total</span>
                    </div>
                    <div className="space-y-2">
                        {(showAllPayouts
                            ? user.payoutHistory
                            : user.payoutHistory.slice(0, PAYOUTS_LIMIT)
                        ).map((payout) => (
                            <div
                                key={payout.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                            >
                                <div>
                                    <p className="font-medium text-white">
                                        ${payout.amount.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {payout.completedAt
                                            ? `Completed ${formatDate(payout.completedAt)}`
                                            : `Created ${formatDate(payout.createdAt)}`
                                        }
                                    </p>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    {getPayoutStatusBadge(payout.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                    {user.payoutHistory.length > PAYOUTS_LIMIT && (
                        <button
                            onClick={() => setShowAllPayouts(!showAllPayouts)}
                            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors mx-auto"
                        >
                            {showAllPayouts ? (
                                <>
                                    <ChevronUp className="h-4 w-4" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-4 w-4" />
                                    See More ({user.payoutHistory.length - PAYOUTS_LIMIT} more)
                                </>
                            )}
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
}
