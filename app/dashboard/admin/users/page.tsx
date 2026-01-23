"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Users,
    Search,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    DollarSign,
    Eye,
    Filter,
    ChevronDown,
    Megaphone,
} from "lucide-react";
import TotpModal from "@/app/components/TotpModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface CampaignEarning {
    campaignId: number;
    campaignName: string;
    pendingEarnings: number;
}

interface User {
    discordId: string;
    username: string;
    avatar?: string | null;
    totalViews: number;
    submissionCount: number;
    pendingBalance: number;
    totalEarnings: number;
    totalPaid: number;
    eligible: boolean;
    stripeConnected: boolean;
    paypalConnected?: boolean;
    earningsByCampaign?: CampaignEarning[];
}

interface CampaignWithPending {
    id: number;
    name: string;
    pendingTotal: number;
}

type FilterType = "all" | "eligible" | "not-eligible" | "payment-ready";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [eligibleUsers, setEligibleUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterType>("all");
    const [sortBy, setSortBy] = useState<"pending-balance" | "views-desc" | "views-asc" | "earnings-desc" | "username">("pending-balance");
    const [campaignFilter, setCampaignFilter] = useState<number | null>(null);
    const [campaignsWithPending, setCampaignsWithPending] = useState<CampaignWithPending[]>([]);
    const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [minimumPayout, setMinimumPayout] = useState(100);
    const [totalPending, setTotalPending] = useState(0);
    const [bulkPayoutLoading, setBulkPayoutLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showResultsDialog, setShowResultsDialog] = useState(false);
    const [showTotpModal, setShowTotpModal] = useState(false);
    const [totpError, setTotpError] = useState<string | null>(null);
    const [confirmCountdown, setConfirmCountdown] = useState(5);
    const [payoutResults, setPayoutResults] = useState<{
        processed: number;
        successful: number;
        failed: number;
        totalAmount: number;
        results: Array<{ userId: string; username: string; success: boolean; amount?: number; error?: string }>;
    } | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, eligibleRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/users`, { credentials: "include" }),
                    fetch(`${API_URL}/api/admin/payouts/eligible`, { credentials: "include" }),
                ]);
                if (!usersRes.ok) throw new Error("Failed to fetch users");
                const usersData = await usersRes.json();
                setUsers(usersData.users || []);
                setMinimumPayout(usersData.minimumPayout || 100);

                if (eligibleRes.ok) {
                    const eligibleData = await eligibleRes.json();
                    setEligibleUsers(eligibleData.eligibleUsers || []);
                    setCampaignsWithPending(eligibleData.campaignsWithPending || []);
                    setTotalPending(eligibleData.totalPending || 0);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle countdown timer for bulk payout confirmation
    useEffect(() => {
        if (showConfirmDialog) {
            setConfirmCountdown(5); // Reset to 5 when dialog opens
            const timer = setInterval(() => {
                setConfirmCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showConfirmDialog]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const filteredUsers = users.filter((user) => {
        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            if (
                !user.username.toLowerCase().includes(searchLower) &&
                !user.discordId.includes(search)
            ) {
                return false;
            }
        }

        // Campaign filter - check if user has ANY earnings from this campaign
        let campaignPending = 0;
        if (campaignFilter !== null) {
            // Find this user in eligibleUsers to get their campaign breakdown
            const eligibleUser = eligibleUsers.find(eu => eu.discordId === user.discordId);
            if (!eligibleUser?.earningsByCampaign) return false;
            const campaignEarning = eligibleUser.earningsByCampaign.find(
                camp => camp.campaignId === campaignFilter
            );
            // Show users with any earnings from this campaign (including 0 pending)
            if (!campaignEarning) return false;
            campaignPending = campaignEarning.pendingEarnings;
        }

        // Determine eligibility based on context
        const isEligible = campaignFilter !== null
            ? campaignPending >= minimumPayout
            : user.eligible;

        // Check if user has any payment method ready
        const hasPaymentMethod = !!(user.stripeConnected || user.paypalConnected);

        // Status filter
        let passesStatusFilter = true;
        switch (filter) {
            case "eligible":
                passesStatusFilter = isEligible;
                break;
            case "not-eligible":
                passesStatusFilter = !isEligible;
                break;
            case "payment-ready":
                // Now checks for any payment method (Stripe OR PayPal)
                passesStatusFilter = isEligible && hasPaymentMethod;
                break;
        }
        if (!passesStatusFilter) return false;

        return true;
    }).sort((a, b) => {
        switch (sortBy) {
            case "views-desc":
                return b.totalViews - a.totalViews;
            case "views-asc":
                return a.totalViews - b.totalViews;
            case "earnings-desc":
                return b.totalEarnings - a.totalEarnings;
            case "username":
                return a.username.localeCompare(b.username);
            case "pending-balance":
            default:
                // If campaign filter is active, sort by campaign pending amount
                if (campaignFilter !== null) {
                    const getCampaignPending = (u: User) => {
                        const eu = eligibleUsers.find(e => e.discordId === u.discordId);
                        return eu?.earningsByCampaign?.find(c => c.campaignId === campaignFilter)?.pendingEarnings || 0;
                    };
                    return getCampaignPending(b) - getCampaignPending(a);
                }
                return b.pendingBalance - a.pendingBalance;
        }
    });

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-12 w-64 rounded-xl bg-white/5 animate-pulse" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    // Helper to get pending amount - either campaign-specific or total
    const getUserPendingAmount = (user: User): number => {
        if (campaignFilter !== null) {
            // Find this user in eligibleUsers to get their campaign breakdown
            const eligibleUser = eligibleUsers.find(eu => eu.discordId === user.discordId);
            if (eligibleUser?.earningsByCampaign) {
                const campaignEarning = eligibleUser.earningsByCampaign.find(
                    camp => camp.campaignId === campaignFilter
                );
                return campaignEarning?.pendingEarnings || 0;
            }
            return 0;
        }
        return user.pendingBalance;
    };

    // Helper to check eligibility - campaign-specific when filtering
    const isUserEligible = (user: User): boolean => {
        const pendingAmount = getUserPendingAmount(user);
        return pendingAmount >= minimumPayout;
    };

    // Get the selected campaign name for display
    const selectedCampaignName = campaignFilter !== null
        ? campaignsWithPending.find(c => c.id === campaignFilter)?.name
        : null;

    // Calculate counts based on current filter context
    const eligibleCount = campaignFilter !== null
        ? filteredUsers.filter((u) => isUserEligible(u)).length
        : users.filter((u) => u.eligible).length;
    const paymentReadyCount = campaignFilter !== null
        ? filteredUsers.filter((u) => isUserEligible(u) && (u.stripeConnected || u.paypalConnected)).length
        : users.filter((u) => u.eligible && (u.stripeConnected || u.paypalConnected)).length;
    const totalPendingCalc = users.reduce((sum, u) => sum + u.pendingBalance, 0);

    // Open TOTP modal after confirmation countdown
    const handleConfirmPayout = () => {
        setShowConfirmDialog(false);
        setTotpError(null);
        setShowTotpModal(true);
    };

    // Actually process payout after TOTP verification
    const handleBulkPayout = async (totpCode: string) => {
        setBulkPayoutLoading(true);
        setTotpError(null);
        try {
            const res = await fetch(`${API_URL}/api/admin/payouts/process-bulk`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filter,
                    search,
                    minimumPayout,
                    campaignFilter,
                    totpCode, // Include TOTP verification code
                }),
            });

            // Check if response is JSON
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server returned an invalid response. You may need to log in again.");
            }

            const data = await res.json();

            // Handle TOTP-specific errors
            if (!res.ok) {
                if (data.code === "TOTP_INVALID" || data.code === "TOTP_REQUIRED" || data.code === "TOTP_INVALID_FORMAT") {
                    setTotpError(data.error || "Invalid verification code");
                    return; // Keep TOTP modal open
                }
                throw new Error(data.error || "Failed to process bulk payouts");
            }

            // Success - close modal and show results
            setShowTotpModal(false);
            setPayoutResults(data);
            setShowResultsDialog(true);

            // Refresh users list
            const usersRes = await fetch(`${API_URL}/api/admin/users`, {
                credentials: "include",
            });
            if (usersRes.ok) {
                const usersData = await usersRes.json();
                setUsers(usersData.users || []);
                setMinimumPayout(usersData.minimumPayout || 100);
            }
        } catch (err: any) {
            console.error("Bulk payout error:", err);
            setShowTotpModal(false);
            setError(err.message || "Failed to process bulk payouts");
        } finally {
            setBulkPayoutLoading(false);
        }
    };



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

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="h-6 w-6 text-blue-400" />
                        All Users
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {users.length} total users · ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pending
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                        <Users className="h-4 w-4" /> Total Users
                    </div>
                    <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                    <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
                        <DollarSign className="h-4 w-4" /> Eligible for Payout
                    </div>
                    <p className="text-2xl font-bold text-green-400">{eligibleCount}</p>
                </div>
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                    <div className="flex items-center gap-2 text-blue-400 text-sm mb-1">
                        <CheckCircle className="h-4 w-4" /> Payment Ready
                    </div>
                    <p className="text-2xl font-bold text-blue-400">{paymentReadyCount}</p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-green-500/10">
                    <div className="flex items-center gap-2 text-emerald-300 text-sm mb-1">
                        <DollarSign className="h-4 w-4" /> Total Ready for Payout
                    </div>
                    <p className="text-2xl font-bold text-emerald-400">
                        ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by username or Discord ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                    />
                </div>

                {/* Status Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowStatusDropdown(!showStatusDropdown);
                            setShowCampaignDropdown(false);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter !== "all"
                            ? "bg-white/10 text-white border border-white/20 backdrop-blur-md shadow-lg"
                            : "bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:border-white/10"
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        {filter === "all" ? "All Users" :
                            filter === "eligible" ? "Eligible" :
                                filter === "payment-ready" ? "Payment Ready" :
                                    `< $${minimumPayout}`}
                        <ChevronDown className={`h-4 w-4 transition-transform ${showStatusDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {showStatusDropdown && (
                        <div className="absolute top-full left-0 mt-2 z-20 w-52 rounded-xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-xl overflow-hidden">
                            {[
                                { value: "all" as FilterType, label: "All Users" },
                                { value: "eligible" as FilterType, label: "Eligible (≥ $" + minimumPayout + ")" },
                                { value: "not-eligible" as FilterType, label: "Not Eligible (< $" + minimumPayout + ")" },
                                { value: "payment-ready" as FilterType, label: "Payment Ready" },
                            ].map((f, i) => (
                                <button
                                    key={f.value}
                                    onClick={() => {
                                        setFilter(f.value);
                                        setShowStatusDropdown(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${i > 0 ? "border-t border-white/5" : ""
                                        } ${filter === f.value ? "text-white bg-white/10 font-medium" : "text-gray-300"}`}
                                >
                                    {f.label}
                                    {filter === f.value && <CheckCircle className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowSortDropdown(!showSortDropdown);
                            setShowCampaignDropdown(false);
                            setShowStatusDropdown(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition-all"
                    >
                        {sortBy === "pending-balance" ? "Sort: Pending Balance" :
                            sortBy === "views-desc" ? "Sort: Views (High-Low)" :
                                sortBy === "views-asc" ? "Sort: Views (Low-High)" :
                                    sortBy === "earnings-desc" ? "Sort: Earnings" :
                                        "Sort: Username"}
                        <ChevronDown className={`h-4 w-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                    </button>

                    {showSortDropdown && (
                        <div className="absolute top-full left-0 mt-2 z-20 w-52 rounded-xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-xl overflow-hidden">
                            {[
                                { value: "pending-balance", label: "Pending Balance" },
                                { value: "views-desc", label: "Views (High → Low)" },
                                { value: "views-asc", label: "Views (Low → High)" },
                                { value: "earnings-desc", label: "Total Earnings" },
                                { value: "username", label: "Username" },
                            ].map((s, i) => (
                                <button
                                    key={s.value}
                                    onClick={() => {
                                        setSortBy(s.value as any);
                                        setShowSortDropdown(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${i > 0 ? "border-t border-white/5" : ""
                                        } ${sortBy === s.value ? "text-white bg-white/10 font-medium" : "text-gray-300"}`}
                                >
                                    {s.label}
                                    {sortBy === s.value && <CheckCircle className="h-4 w-4" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Campaign Filter Dropdown */}
                {campaignsWithPending.length > 0 ? (
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowCampaignDropdown(!showCampaignDropdown);
                                setShowStatusDropdown(false);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${campaignFilter !== null
                                ? "bg-purple-500 text-white"
                                : "bg-white/5 text-gray-400 hover:bg-white/10"
                                }`}
                        >
                            <Megaphone className="h-4 w-4" />
                            {campaignFilter !== null
                                ? campaignsWithPending.find(c => c.id === campaignFilter)?.name || "Campaign"
                                : "Filter by Campaign"}
                            <ChevronDown className={`h-4 w-4 transition-transform ${showCampaignDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {showCampaignDropdown && (
                            <div className="absolute top-full left-0 mt-2 z-20 w-72 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-xl">
                                <button
                                    onClick={() => {
                                        setCampaignFilter(null);
                                        setShowCampaignDropdown(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${campaignFilter === null ? "text-white bg-white/10 font-medium" : "text-gray-300"
                                        }`}
                                >
                                    All Campaigns
                                    {campaignFilter === null && <CheckCircle className="h-4 w-4" />}
                                </button>
                                {campaignsWithPending.map((campaign) => (
                                    <button
                                        key={campaign.id}
                                        onClick={() => {
                                            setCampaignFilter(campaign.id);
                                            setShowCampaignDropdown(false);
                                        }}
                                        className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors border-t border-white/5 ${campaignFilter === campaign.id ? "text-white bg-white/10 font-medium" : "text-gray-300"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="truncate">{campaign.name}</span>
                                            <span className="text-green-400 text-xs font-medium ml-2">
                                                ${campaign.pendingTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}

                {/* Bulk Payout Button */}
                {filteredUsers.filter((u) => isUserEligible(u) && (u.stripeConnected || u.paypalConnected)).length > 0 && (
                    <button
                        onClick={() => setShowConfirmDialog(true)}
                        disabled={bulkPayoutLoading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-medium hover:from-green-500 hover:to-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
                    >
                        <DollarSign className="h-4 w-4" />
                        Payout All Eligible
                        {bulkPayoutLoading && (
                            <span className="ml-1 text-xs">(Processing...)</span>
                        )}
                    </button>
                )}
            </div>

            {/* Users List */}
            <div className="space-y-2">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No users match your filters
                    </div>
                ) : (
                    filteredUsers.map((user, index) => (
                        <motion.div
                            key={user.discordId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                        >
                            <Link href={`/dashboard/admin/users/${user.discordId}`}>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                                            {user.avatar ? (
                                                <img
                                                    src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                                                    alt={user.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-white font-medium">
                                                    {user.username?.[0]?.toUpperCase() || "?"}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <p className="font-medium text-white">{user.username}</p>
                                            <p className="text-xs text-gray-500">{user.discordId}</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-6">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm text-gray-400">Views</p>
                                            <p className="font-medium text-white">
                                                {formatNumber(user.totalViews)}
                                            </p>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <p className="text-sm text-gray-400">Submissions</p>
                                            <p className="font-medium text-white">
                                                {user.submissionCount}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400">
                                                {campaignFilter !== null ? (
                                                    <span className="text-purple-400" title={selectedCampaignName || undefined}>
                                                        Campaign $
                                                    </span>
                                                ) : (
                                                    "Pending"
                                                )}
                                            </p>
                                            <p
                                                className={`font-semibold ${campaignFilter !== null
                                                    ? "text-purple-400"
                                                    : user.eligible
                                                        ? "text-green-400"
                                                        : "text-white"
                                                    }`}
                                            >
                                                ${getUserPendingAmount(user).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        {/* Status Indicators */}
                                        <div className="flex items-center gap-2">
                                            {isUserEligible(user) ? (
                                                <span className={`px-2 py-1 rounded-lg text-xs border ${campaignFilter !== null
                                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                    : "bg-green-500/10 text-green-400 border-green-500/20"
                                                    }`}>
                                                    Eligible
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-lg text-xs bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                                    ${(minimumPayout - getUserPendingAmount(user)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} needed
                                                </span>
                                            )}
                                            {/* Stripe Status */}
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${user.stripeConnected
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-gray-500/10 text-gray-500'
                                                }`} title={user.stripeConnected ? 'Stripe Connected' : 'No Stripe'}>
                                                S
                                            </span>
                                            {/* PayPal Status */}
                                            <span className={`text-xs px-1.5 py-0.5 rounded ${user.paypalConnected
                                                ? 'bg-purple-500/20 text-purple-400'
                                                : 'bg-gray-500/10 text-gray-500'
                                                }`} title={user.paypalConnected ? 'PayPal Connected' : 'No PayPal'}>
                                                P
                                            </span>
                                        </div>

                                        <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">
                            Confirm Bulk Payout
                            {campaignFilter !== null && (
                                <span className="text-purple-400 text-sm font-normal ml-2">
                                    (Campaign: {selectedCampaignName})
                                </span>
                            )}
                        </h3>
                        <div className="space-y-3 mb-6">
                            <p className="text-gray-300">
                                You are about to process payouts for{" "}
                                <span className="font-semibold text-green-400">
                                    {filteredUsers.filter((u) => isUserEligible(u) && (u.stripeConnected || u.paypalConnected)).length}
                                </span>{" "}
                                eligible users with payment methods ready.
                            </p>
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <p className="text-sm text-blue-300 font-medium mb-2">
                                    Current Filters:
                                </p>
                                <div className="text-xs text-gray-400 space-y-1">
                                    <div>Status: <span className="text-white">{filter === "all" ? "All" : filter === "eligible" ? "Eligible" : filter === "payment-ready" ? "Payment Ready" : `< $${minimumPayout}`}</span></div>
                                    {search && <div>Search: <span className="text-white">"{search}"</span></div>}
                                    {campaignFilter !== null && (
                                        <div>Campaign: <span className="text-purple-400 font-medium">{selectedCampaignName}</span></div>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-400">
                                Total amount:{" "}
                                <span className={`font-semibold ${campaignFilter !== null ? "text-purple-400" : "text-white"}`}>
                                    ${filteredUsers
                                        .filter((u) => isUserEligible(u) && u.stripeConnected)
                                        .reduce((sum, u) => sum + getUserPendingAmount(u), 0)
                                        .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                {campaignFilter !== null && (
                                    <span className="text-xs text-gray-500 ml-1">(campaign only)</span>
                                )}
                            </p>
                            <div className="max-h-32 overflow-y-auto p-2 rounded bg-white/5 border border-white/10">
                                <p className="text-xs text-gray-500 mb-1">Users to be paid:</p>
                                {filteredUsers
                                    .filter((u) => isUserEligible(u) && u.stripeConnected)
                                    .slice(0, 10)
                                    .map((u) => (
                                        <p key={u.discordId} className="text-xs text-gray-300">
                                            {u.username} - <span className={campaignFilter !== null ? "text-purple-400" : ""}>${getUserPendingAmount(u).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </p>
                                    ))}
                                {filteredUsers.filter((u) => isUserEligible(u) && u.stripeConnected).length > 10 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        and {filteredUsers.filter((u) => isUserEligible(u) && u.stripeConnected).length - 10} more...
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmPayout}
                                disabled={confirmCountdown > 0}
                                className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg ${confirmCountdown > 0
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 shadow-green-500/20'
                                    }`}
                            >
                                {confirmCountdown > 0 ? `Wait ${confirmCountdown}s...` : 'Continue to Verify'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Results Dialog */}
            {showResultsDialog && payoutResults && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-y-auto"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">
                            Bulk Payout Results
                        </h3>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <p className="text-xs text-blue-400 mb-1">Processed</p>
                                <p className="text-2xl font-bold text-white">
                                    {payoutResults.processed}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                <p className="text-xs text-green-400 mb-1">Successful</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {payoutResults.successful}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                <p className="text-xs text-red-400 mb-1">Failed</p>
                                <p className="text-2xl font-bold text-red-400">
                                    {payoutResults.failed}
                                </p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                            <p className="text-sm text-green-300">
                                Total Amount Transferred:{" "}
                                <span className="font-bold text-green-400">
                                    ${payoutResults.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </p>
                        </div>
                        <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                            {payoutResults.results.map((result) => (
                                <div
                                    key={result.userId}
                                    className={`p-3 rounded-xl border ${result.success
                                        ? "bg-green-500/5 border-green-500/20"
                                        : "bg-red-500/5 border-red-500/20"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {result.success ? (
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4 text-red-400" />
                                            )}
                                            <span className="text-sm text-white">
                                                {result.username}
                                            </span>
                                        </div>
                                        {result.success && result.amount && (
                                            <span className="text-sm font-medium text-green-400">
                                                ${result.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        )}
                                        {!result.success && result.error && (
                                            <span className="text-xs text-red-400">
                                                {result.error}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setShowResultsDialog(false);
                                setPayoutResults(null);
                            }}
                            className="w-full px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}

            {/* TOTP Verification Modal */}
            <TotpModal
                isOpen={showTotpModal}
                onClose={() => {
                    setShowTotpModal(false);
                    setTotpError(null);
                }}
                onVerify={handleBulkPayout}
                loading={bulkPayoutLoading}
                error={totpError}
                title="Payout Security Verification"
                message="Enter your 6-digit code from Google Authenticator to authorize this payout."
            />
        </div>
    );
}
