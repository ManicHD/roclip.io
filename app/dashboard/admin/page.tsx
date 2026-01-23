"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    DollarSign,
    TrendingUp,
    Megaphone,
    Eye,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Bell,
    ChevronDown,
    Calendar,
    Upload,
    Filter,
} from "lucide-react";
import DashboardChart, { ChartData, MetricType } from "../../components/DashboardChart";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Stats {
    totalUsers: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    activeCampaigns: number;
    pendingPayouts: number;
    totalViews: number;
    acceptedViews: number;
    minimumPayout: number;
}

interface EligibleUser {
    discordId: string;
    username: string;
    avatar: string | null;
    pendingBalance: number;
    stripeConnected: boolean;
    stripeReady: boolean;
}

interface Campaign {
    id: number;
    name: string;
}

type TimePeriod = 7 | 28;

const periodLabels: Record<TimePeriod, string> = {
    7: "Past 7 days",
    28: "Past 28 days",
};

const metricConfig: Record<MetricType, { label: string; color: string; icon: any; format: (v: number) => string }> = {
    views: {
        label: "Views",
        color: "#60A5FA",
        icon: Eye,
        format: (num: number) => {
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
            return num.toString();
        }
    },
    earnings: {
        label: "Earnings",
        color: "#4ADE80",
        icon: DollarSign,
        format: (num: number) => `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    submissions: {
        label: "Uploads",
        color: "#C084FC",
        icon: Upload,
        format: (num: number) => num.toString()
    }
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [eligibleUsers, setEligibleUsers] = useState<EligibleUser[]>([]);
    const [totalPending, setTotalPending] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Chart State
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(7);
    const [selectedCampaign, setSelectedCampaign] = useState<number | "all">("all");
    const [selectedMetric, setSelectedMetric] = useState<MetricType>("views");
    const [showPeriodSelector, setShowPeriodSelector] = useState(false);
    const [showCampaignSelector, setShowCampaignSelector] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Initial data fetch
                const [statsRes, eligibleRes, campaignsRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/stats`, { credentials: "include" }),
                    fetch(`${API_URL}/api/admin/payouts/eligible`, { credentials: "include" }),
                    fetch(`${API_URL}/api/admin/campaigns`, { credentials: "include" }),
                ]);

                if (!statsRes.ok || !eligibleRes.ok) {
                    throw new Error("Failed to fetch admin data");
                }

                const [statsData, eligibleData, campaignsData] = await Promise.all([
                    statsRes.json(),
                    eligibleRes.json(),
                    campaignsRes.json(),
                ]);

                setStats(statsData);
                setEligibleUsers(eligibleData.eligibleUsers || []);
                setTotalPending(eligibleData.totalPending || 0);
                setCampaigns(campaignsData.campaigns || []);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                setError("Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch chart data when filters change
    useEffect(() => {
        const fetchChart = async () => {
            try {
                const campaignQuery = selectedCampaign !== "all" ? `&campaignId=${selectedCampaign}` : "";
                const res = await fetch(
                    `${API_URL}/api/admin/chart?period=${selectedPeriod}${campaignQuery}`,
                    { credentials: "include" }
                );
                const data = await res.json();
                setChartData(data.chartData || []);
            } catch (err) {
                console.error("Error fetching chart data:", err);
            }
        };
        fetchChart();
    }, [selectedPeriod, selectedCampaign]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    // Color style mapping for stat cards (fixes Tailwind dynamic class issue)
    const colorStyles: Record<string, { bg: string; text: string; border?: string }> = {
        blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
        green: { bg: "bg-green-500/10", text: "text-green-400" },
        purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
        cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
        yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
        emerald: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                </div>
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

    const statCards = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "blue",
            href: "/dashboard/admin/users",
        },
        {
            title: "Active Campaigns",
            value: stats?.activeCampaigns || 0,
            icon: Megaphone,
            color: "green",
            href: "/dashboard/admin/campaigns",
        },
        {
            title: "Total Views",
            value: formatNumber(stats?.totalViews || 0),
            suffix: "(raw)",
            icon: Eye,
            color: "purple",
        },
        {
            title: "Accepted Views",
            value: formatNumber(stats?.acceptedViews || 0),
            suffix: "(capped)",
            icon: Eye,
            color: "cyan",
        },
        {
            title: "Pending Payouts",
            value: eligibleUsers.length,
            suffix: `($${eligibleUsers.reduce((sum, u) => sum + u.pendingBalance, 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })})`,
            icon: DollarSign,
            color: "yellow",
            href: "/dashboard/admin/users",
        },
        {
            title: "Ready for Payout",
            value: `$${totalPending.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            suffix: `(${eligibleUsers.filter(u => u.stripeReady).length} ready)`,
            icon: TrendingUp,
            color: "emerald",
            href: "/dashboard/admin/users",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                <p className="text-gray-400 mt-2">
                    Overview of platform performance and management
                </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <Users className="h-5 w-5" />
                        </div>
                        <span className="text-sm text-gray-400 font-medium">Total Users</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
                    <Link href="/dashboard/admin/users" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-2">
                        View all users <ArrowRight className="h-3 w-3" />
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        <span className="text-sm text-gray-400 font-medium">Active Campaigns</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats?.activeCampaigns || 0}</p>
                    <Link href="/dashboard/admin/campaigns" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-2">
                        Manage campaigns <ArrowRight className="h-3 w-3" />
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <span className="text-sm text-gray-400 font-medium">Total Views</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatNumber(stats?.totalViews || 0)}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatNumber(stats?.acceptedViews || 0)} capped</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <span className="text-sm text-gray-400 font-medium">Pending Payouts</span>
                    </div>
                    <p className="text-3xl font-bold text-emerald-400">
                        ${totalPending.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </p>
                    <Link href="/dashboard/admin/users" className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-2">
                        {eligibleUsers.filter(u => u.stripeReady).length} payment ready <ArrowRight className="h-3 w-3" />
                    </Link>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Action Area & Chart */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Performance Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl"
                    >
                        {/* Chart Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                            <div className="flex p-1 rounded-xl bg-white/5 border border-white/5 w-fit">
                                {(Object.keys(metricConfig) as MetricType[]).map((metric) => {
                                    const isActive = selectedMetric === metric;
                                    const Icon = metricConfig[metric].icon;
                                    return (
                                        <button
                                            key={metric}
                                            onClick={() => setSelectedMetric(metric)}
                                            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeMetricAdmin"
                                                    className="absolute inset-0 bg-white/10 rounded-lg"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                />
                                            )}
                                            <Icon className={`h-4 w-4 relative z-10 ${isActive ? "" : "opacity-70"}`} />
                                            <span className="relative z-10">{metricConfig[metric].label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex gap-3">
                                {/* Campaign Filter */}
                                <div className="relative z-20">
                                    <button
                                        onClick={() => setShowCampaignSelector(!showCampaignSelector)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm md:text-xs lg:text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"
                                    >
                                        <Filter className="h-4 w-4 text-gray-500" />
                                        <span className="max-w-[100px] truncate">
                                            {selectedCampaign === "all" ? "All Campaigns" : campaigns.find(c => c.id === selectedCampaign)?.name}
                                        </span>
                                        <ChevronDown className="h-4 w-4 text-gray-500" />
                                    </button>
                                    <AnimatePresence>
                                        {showCampaignSelector && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="absolute right-0 top-full mt-2 w-64 max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-gray-900 shadow-xl p-1"
                                            >
                                                <button
                                                    onClick={() => { setSelectedCampaign("all"); setShowCampaignSelector(false); }}
                                                    className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
                                                >
                                                    All Campaigns
                                                </button>
                                                {campaigns.map(c => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => { setSelectedCampaign(c.id); setShowCampaignSelector(false); }}
                                                        className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-white/5 text-gray-300 transition-colors truncate"
                                                    >
                                                        {c.name}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Period Filter */}
                                <div className="relative z-20">
                                    <button
                                        onClick={() => setShowPeriodSelector(!showPeriodSelector)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm md:text-xs lg:text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"
                                    >
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        {periodLabels[selectedPeriod]}
                                    </button>
                                    <AnimatePresence>
                                        {showPeriodSelector && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-white/10 bg-gray-900 shadow-xl p-1"
                                            >
                                                {([7, 28] as TimePeriod[]).map((p) => (
                                                    <button
                                                        key={p}
                                                        onClick={() => { setSelectedPeriod(p); setShowPeriodSelector(false); }}
                                                        className="w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-white/5 text-gray-300 transition-colors"
                                                    >
                                                        {periodLabels[p]}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="mb-6">
                            <h3 className="text-4xl font-bold text-white tracking-tight">
                                {metricConfig[selectedMetric].format(
                                    chartData.reduce((acc, curr) => acc + curr[selectedMetric], 0)
                                )}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Total {metricConfig[selectedMetric].label.toLowerCase()} in selected period
                            </p>
                        </div>

                        <DashboardChart
                            data={chartData}
                            metric={selectedMetric}
                            metricConfig={metricConfig}
                            height={320}
                        />
                    </motion.div>

                    {/* Action Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Manage Campaigns Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <Link href="/dashboard/admin/campaigns/manage">
                                <div className="group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-6 transition-all hover:border-purple-500/30">
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-xl bg-purple-500/20 p-3 text-purple-400">
                                                <Megaphone className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">Manage Campaigns</h3>
                                                <p className="text-sm text-purple-200/60">Create, edit, and view all campaigns</p>
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-purple-500/10 p-2 text-purple-400 transition-transform group-hover:translate-x-1">
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Announcement Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.55 }}
                        >
                            <Link href="/dashboard/admin/announcements">
                                <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6 transition-all hover:border-blue-500/30">
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-xl bg-blue-500/20 p-3 text-blue-400">
                                                <Bell className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">Make an Announcement</h3>
                                                <p className="text-sm text-blue-200/60">Broadcast updates to all users</p>
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-blue-500/10 p-2 text-blue-400 transition-transform group-hover:translate-x-1">
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Sidebar / Secondary Actions */}
                <div className="space-y-6">
                    {/* Eligible for Payout List */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 h-full min-h-[400px]"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-white">Ready for Payout</h3>
                            <Link href="/dashboard/admin/users" className="text-xs text-blue-400 hover:text-blue-300">View All</Link>
                        </div>

                        {eligibleUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="p-4 rounded-full bg-white/5 mb-3">
                                    <CheckCircle className="h-6 w-6 text-gray-500" />
                                </div>
                                <p className="text-gray-500 text-sm">No users ready for payout</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {eligibleUsers.slice(0, 6).map((user) => (
                                    <Link key={user.discordId} href={`/dashboard/admin/users/${user.discordId}`}>
                                        <div className="group flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/5 overflow-hidden">
                                                    {user.avatar ? (
                                                        <img
                                                            src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                                                            alt={user.username}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs font-bold text-white">
                                                            {user.username?.[0]?.toUpperCase() || "?"}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-sm font-medium text-white truncate max-w-[100px]">{user.username}</p>
                                                    <div className="flex items-center gap-1">
                                                        {user.stripeReady && <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                                                        <p className="text-[10px] text-gray-500">
                                                            {user.stripeReady ? 'Ready' : 'Not Setup'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-green-400 font-mono">
                                                ${user.pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                                {eligibleUsers.length > 6 && (
                                    <div className="pt-2 text-center">
                                        <span className="text-xs text-gray-500">+{eligibleUsers.length - 6} more users</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
