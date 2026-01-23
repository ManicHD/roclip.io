"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrendingUp,
    DollarSign,
    CheckCircle,
    ChevronDown,
    Calendar,
    Eye,
    Link2,
    Upload,
    Video,
    MousePointer2,
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

import DashboardChart, { ChartData, MetricType } from "../components/DashboardChart";

type TimePeriod = 7 | 28;

const periodLabels: Record<TimePeriod, string> = {
    7: "Past 7 days",
    28: "Past 28 days",
};

const metricConfig: Record<MetricType, { label: string; color: string; icon: any; format: (v: number) => string }> = {
    views: {
        label: "Views",
        color: "#60A5FA", // blue-400
        icon: Eye,
        format: (num: number) => {
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
            return num.toString();
        }
    },
    earnings: {
        label: "Earnings",
        color: "#4ADE80", // green-400
        icon: DollarSign,
        format: (num: number) => `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    submissions: {
        label: "Uploads",
        color: "#C084FC", // purple-400
        icon: Upload,
        format: (num: number) => num.toString()
    }
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

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(7);
    const [selectedMetric, setSelectedMetric] = useState<MetricType>("views");
    const [showPeriodSelector, setShowPeriodSelector] = useState(false);
    const [showSocialsModal, setShowSocialsModal] = useState(false);
    const { user } = useAuth();

    const fetchData = async (period: TimePeriod) => {
        try {
            setLoading(true);
            const periodDays = period;
            const [statsData, chartDataRes] = await Promise.all([
                fetch(`${API_URL}/api/stats/overview`, { credentials: "include" }).then((r) => r.json()),
                fetch(`${API_URL}/api/stats/chart?period=${periodDays}`, { credentials: "include" }).then((r) => r.json()),
            ]);
            setStats(statsData.stats);
            setChartData(chartDataRes.chartData || []);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(selectedPeriod);
    }, [selectedPeriod]);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatMoney = (num: number) => `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (loading && !stats) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                </div>
                <div className="h-96 rounded-2xl bg-white/5 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-sm text-gray-400 mt-1">Overview of your performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSocialsModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium transition-colors border border-blue-500/20"
                    >
                        <Link2 className="h-4 w-4" />
                        Connect Socials
                    </button>
                </div>
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

            {/* Main Chart Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8"
            >
                {/* Header Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    {/* Metric Selector */}
                    <div className="flex p-1 rounded-xl bg-black/40 border border-white/5 w-fit">
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
                                            layoutId="activeMetric"
                                            className="absolute inset-0 bg-white/10 rounded-lg shadow-sm"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <Icon className={`h-4 w-4 relative z-10 ${isActive ? "" : "opacity-70"}`} />
                                    <span className="relative z-10">{metricConfig[metric].label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Period Selector */}
                    <div className="relative">
                        <button
                            onClick={() => setShowPeriodSelector(!showPeriodSelector)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white hover:bg-white/10 transition-colors input-focus-ring"
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
                                    className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-xl overflow-hidden"
                                >
                                    {([7, 28] as TimePeriod[]).map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => {
                                                setSelectedPeriod(period);
                                                setShowPeriodSelector(false);
                                            }}
                                            className={`w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors flex items-center justify-between ${selectedPeriod === period ? "text-white bg-white/10 font-medium" : "text-gray-300"
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
                </div>

                {/* Total Counter for Selected Metric */}
                <div className="mb-8">
                    <p className="text-sm text-gray-400 mb-1">Total {metricConfig[selectedMetric].label}</p>
                    <h3 className="text-4xl font-bold text-white tracking-tight">
                        {metricConfig[selectedMetric].format(
                            chartData.reduce((acc, curr) => acc + curr[selectedMetric], 0)
                        )}
                    </h3>
                </div>

                {/* The Chart */}
                <DashboardChart
                    data={chartData}
                    metric={selectedMetric}
                    metricConfig={metricConfig}
                />
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
