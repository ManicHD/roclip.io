"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    TrendingUp,
    DollarSign,
    Video,
    Clock,
    CheckCircle,
    XCircle,
    ChevronDown,
    Calendar,
    Upload,
    Eye,
    Link2,
    ChevronRight,
} from "lucide-react";
import { useAuth } from "./layout";
import ConnectSocialsModal from "../components/ConnectSocialsModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Stats {
    totalViews: number;
    totalEarnings: number;
    pendingBalance: number;
    acceptedVideos: number;
    pendingVideos: number;
    deniedVideos: number;
    activeCampaigns: number;
}

interface ChartData {
    date: string;
    views: number;
    earnings: number;
    submissions: number;
}

type TimePeriod = 7 | 28;

const periodLabels: Record<TimePeriod, string> = {
    7: "Past 7 days",
    28: "Past 28 days",
};

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    delay,
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    color: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </motion.div>
    );
}

// Mini chart component for the overview cards
function MiniChart({
    data,
    color,
    dataKey,
}: {
    data: ChartData[];
    color: string;
    dataKey: "views" | "earnings" | "submissions";
}) {
    if (!data || data.length === 0) return null;

    const values = data.map((d) => d[dataKey]);
    const max = Math.max(...values, 1);
    const chartData = data.slice(-7);

    return (
        <div className="flex items-end gap-0.5 h-12">
            {chartData.map((d, i) => {
                const height = (d[dataKey] / max) * 100;
                return (
                    <motion.div
                        key={d.date}
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(height, 8)}%` }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className={`flex-1 rounded-t ${color} opacity-60 hover:opacity-100 transition-opacity`}
                    />
                );
            })}
        </div>
    );
}

// Full chart component
function FullChart({
    data,
    color,
    gradientFrom,
    gradientTo,
    dataKey,
    label,
    formatValue,
}: {
    data: ChartData[];
    color: string;
    gradientFrom: string;
    gradientTo: string;
    dataKey: "views" | "earnings" | "submissions";
    label: string;
    formatValue: (val: number) => string;
}) {
    if (!data || data.length === 0) {
        return (
            <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                No data available
            </div>
        );
    }

    const values = data.map((d) => d[dataKey]);
    const max = Math.max(...values, 1);
    const total = values.reduce((a, b) => a + b, 0);
    const hasData = values.some((v) => v > 0);

    if (!hasData) {
        return (
            <div className="h-48 flex flex-col items-center justify-center text-gray-500 text-sm">
                <p>No {label.toLowerCase()} recorded</p>
            </div>
        );
    }

    // Calculate how many labels to show based on data length
    const showEvery = data.length <= 7 ? 1 : data.length <= 14 ? 2 : Math.ceil(data.length / 7);

    return (
        <div className="space-y-2">
            {/* Chart header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${gradientFrom}`} />
                    <span className="text-sm font-medium text-white">{label}</span>
                </div>
                <span className="text-sm text-gray-400">
                    Total: {formatValue(total)}
                </span>
            </div>

            {/* Chart */}
            <div className="h-40 relative">
                <div className="absolute inset-0 flex items-end gap-[2px] pb-6">
                    {data.map((d, i) => {
                        const height = (d[dataKey] / max) * 100;
                        const dateLabel = new Date(d.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        });

                        return (
                            <div
                                key={d.date}
                                className="flex-1 flex flex-col items-center group relative h-full justify-end"
                            >
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                    <div className="bg-gray-900/95 border border-white/10 rounded-xl px-3 py-2 text-xs whitespace-nowrap shadow-xl backdrop-blur-sm">
                                        <p className={`font-semibold ${color}`}>{formatValue(d[dataKey])}</p>
                                        <p className="text-gray-400">{dateLabel}</p>
                                    </div>
                                </div>

                                {/* Bar */}
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: d[dataKey] > 0 ? `${Math.max(height, 4)}%` : "2px" }}
                                    transition={{ duration: 0.5, delay: i * 0.02 }}
                                    className={`w-full rounded-t cursor-pointer transition-all ${d[dataKey] > 0
                                        ? `bg-gradient-to-t ${gradientFrom} ${gradientTo} hover:brightness-110`
                                        : "bg-gray-800"
                                        }`}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 right-0 flex gap-[2px]">
                    {data.map((d, i) => {
                        if (i % showEvery !== 0) return <div key={d.date} className="flex-1" />;
                        const dateLabel = new Date(d.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        });
                        return (
                            <div key={d.date} className="flex-1 text-center">
                                <span className="text-[10px] text-gray-500">{dateLabel}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(7);
    const [showPeriodSelector, setShowPeriodSelector] = useState(false);
    const [showDetailedStats, setShowDetailedStats] = useState(false);
    const [showSocialsModal, setShowSocialsModal] = useState(false);
    const { user } = useAuth();

    const fetchData = async (period: TimePeriod) => {
        try {
            const periodDays = period;
            const [statsData, chartDataRes] = await Promise.all([
                fetch(`${API_URL}/api/stats/overview`, { credentials: "include" }).then((r) => r.json()),
                fetch(`${API_URL}/api/stats/chart?period=${periodDays}`, { credentials: "include" }).then((r) => r.json()),
            ]);
            setStats(statsData.stats);
            setChartData(chartDataRes.chartData || []);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    useEffect(() => {
        fetchData(selectedPeriod).then(() => setLoading(false));
    }, [selectedPeriod]);

    const handlePeriodChange = (period: TimePeriod) => {
        setSelectedPeriod(period);
        setShowPeriodSelector(false);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                </div>
                <div className="h-80 rounded-2xl bg-white/5 animate-pulse" />
            </div>
        );
    }

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatMoney = (num: number) => `$${num.toFixed(2)}`;

    // Calculate period totals from chart data
    const periodViews = chartData.reduce((sum, d) => sum + d.views, 0);
    const periodEarnings = chartData.reduce((sum, d) => sum + d.earnings, 0);
    const periodSubmissions = chartData.reduce((sum, d) => sum + d.submissions, 0);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-sm text-gray-400 mt-1">Overview of your performance</p>
                </div>
                <button
                    onClick={() => setShowSocialsModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium transition-colors border border-blue-500/20"
                >
                    <Link2 className="h-4 w-4" />
                    Connect Socials
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Views"
                    value={formatNumber(stats?.totalViews || 0)}
                    subtitle="All time"
                    icon={TrendingUp}
                    color="bg-blue-500/10 text-blue-400"
                    delay={0}
                />
                <StatCard
                    title="Est. Earnings"
                    value={formatMoney(stats?.totalEarnings || 0)}
                    subtitle="Past 28 days"
                    icon={DollarSign}
                    color="bg-green-500/10 text-green-400"
                    delay={0.1}
                />
                <StatCard
                    title="Outstanding Payment"
                    value={formatMoney(stats?.pendingBalance || 0)}
                    subtitle="Awaiting payout"
                    icon={DollarSign}
                    color="bg-purple-500/10 text-purple-400"
                    delay={0.2}
                />
                <StatCard
                    title="Accepted Videos"
                    value={stats?.acceptedVideos || 0}
                    icon={CheckCircle}
                    color="bg-emerald-500/10 text-emerald-400"
                    delay={0.3}
                />
            </div>

            {/* Report Issue / Socials */}
            <div className="flex justify-end mb-4">
                {/* (Optional: moved logic if needed, but keeping consistent with request) */}
            </div>

            {/* Chart Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
                {/* Chart Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-500/10 p-2">
                            <Eye className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Performance Overview</h2>
                            <p className="text-sm text-gray-400">{periodLabels[selectedPeriod]}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Period Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowPeriodSelector(!showPeriodSelector)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white hover:bg-white/10 transition-colors"
                            >
                                <Calendar className="h-4 w-4 text-gray-400" />
                                {periodLabels[selectedPeriod]}
                                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showPeriodSelector ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {showPeriodSelector && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-xl overflow-hidden"
                                    >
                                        {([7, 28] as TimePeriod[]).map((period) => (
                                            <button
                                                key={period}
                                                onClick={() => handlePeriodChange(period)}
                                                className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${selectedPeriod === period ? "text-blue-400 bg-blue-500/10" : "text-white"
                                                    }`}
                                            >
                                                {periodLabels[period]}
                                                {selectedPeriod === period && (
                                                    <CheckCircle className="h-4 w-4" />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* See More Button */}
                        <button
                            onClick={() => setShowDetailedStats(!showDetailedStats)}
                            className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors"
                        >
                            {showDetailedStats ? "Show Less" : "See More"}
                        </button>
                    </div>
                </div>

                {/* Main Charts */}
                <div className="space-y-8">
                    {/* Views Chart */}
                    <FullChart
                        data={chartData}
                        color="text-blue-400"
                        gradientFrom="from-blue-600"
                        gradientTo="to-blue-400"
                        dataKey="views"
                        label="Views"
                        formatValue={formatNumber}
                    />

                    {/* Earnings Chart */}
                    <FullChart
                        data={chartData}
                        color="text-green-400"
                        gradientFrom="from-green-600"
                        gradientTo="to-green-400"
                        dataKey="earnings"
                        label="Earnings"
                        formatValue={formatMoney}
                    />

                    {/* Detailed Stats (expandable) */}
                    <AnimatePresence>
                        {showDetailedStats && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {/* Uploads Chart */}
                                <FullChart
                                    data={chartData}
                                    color="text-purple-400"
                                    gradientFrom="from-purple-600"
                                    gradientTo="to-purple-400"
                                    dataKey="submissions"
                                    label="Uploads"
                                    formatValue={(v) => v.toString()}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Connect Socials Modal */}
            {user && (
                <ConnectSocialsModal
                    isOpen={showSocialsModal}
                    onClose={() => setShowSocialsModal(false)}
                    discordId={user.discordId}
                />
            )}
        </div>
    );
}
