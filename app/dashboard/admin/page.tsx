"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";

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
    pendingBalance: number;
    stripeConnected: boolean;
    stripeReady: boolean;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [eligibleUsers, setEligibleUsers] = useState<EligibleUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, eligibleRes] = await Promise.all([
                    fetch(`${API_URL}/api/admin/stats`, { credentials: "include" }),
                    fetch(`${API_URL}/api/admin/payouts/eligible`, { credentials: "include" }),
                ]);

                if (!statsRes.ok || !eligibleRes.ok) {
                    throw new Error("Failed to fetch admin data");
                }

                const [statsData, eligibleData] = await Promise.all([
                    statsRes.json(),
                    eligibleRes.json(),
                ]);

                setStats(statsData);
                setEligibleUsers(eligibleData.eligibleUsers || []);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                setError("Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
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
            suffix: `($${eligibleUsers.reduce((sum, u) => sum + u.pendingBalance, 0).toFixed(0)})`,
            icon: DollarSign,
            color: "yellow",
            href: "/dashboard/admin/users",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Platform overview and management
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        {stat.href ? (
                            <Link href={stat.href}>
                                <div className={`p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all group cursor-pointer`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-xl bg-${stat.color}-500/10`}>
                                            <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        {stat.value}
                                        {stat.suffix && (
                                            <span className="text-sm font-normal text-gray-400 ml-1">
                                                {stat.suffix}
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">{stat.title}</p>
                                </div>
                            </Link>
                        ) : (
                            <div className={`p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-xl bg-${stat.color}-500/10`}>
                                        <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-sm text-gray-400 mt-1">{stat.title}</p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Announcements Quick Access */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
            >
                <Link href="/dashboard/admin/announcements">
                    <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 backdrop-blur-xl transition-all group cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                                    <Bell className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white mb-1">
                                        📢 Send Announcement
                                    </h2>
                                    <p className="text-sm text-gray-400">
                                        Broadcast messages to all website users
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            </motion.div>

            {/* Eligible for Payout */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Ready for Payout
                        </h2>
                        <p className="text-sm text-gray-400">
                            Users with ${stats?.minimumPayout || 100}+ balance
                        </p>
                    </div>
                    <Link
                        href="/dashboard/admin/users"
                        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                        View all <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {eligibleUsers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No users currently eligible for payout
                    </div>
                ) : (
                    <div className="space-y-2">
                        {eligibleUsers.slice(0, 5).map((user) => (
                            <Link
                                key={user.discordId}
                                href={`/dashboard/admin/users/${user.discordId}`}
                            >
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <span className="text-sm font-medium text-purple-400">
                                                {user.username?.[0]?.toUpperCase() || "?"}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{user.username}</p>
                                            <p className="text-xs text-gray-500">{user.discordId}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-semibold text-green-400">
                                                ${user.pendingBalance.toFixed(2)}
                                            </p>
                                        </div>
                                        {user.stripeReady ? (
                                            <CheckCircle className="h-5 w-5 text-green-400" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        <span className="text-sm text-gray-400">Total Submissions</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {stats?.totalSubmissions || 0}
                    </p>
                    <p className="text-sm text-green-400 mt-1">
                        {stats?.acceptedSubmissions || 0} accepted
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-gray-400">Minimum Payout</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        ${stats?.minimumPayout || 100}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        Required balance for payout
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                    className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-sm text-gray-400">Stripe Ready</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {eligibleUsers.filter((u) => u.stripeReady).length}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        of {eligibleUsers.length} eligible
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
