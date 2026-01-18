"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Megaphone,
    Users,
    Eye,
    DollarSign,
    Calendar,
    CheckCircle,
    XCircle,
    Trash2,
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
                        className="h-32 rounded-2xl bg-white/5 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Campaigns</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Manage all platform campaigns
                </p>
            </div>

            <div className="grid gap-4">
                {campaigns.map((campaign, index) => (
                    <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="rounded-xl bg-blue-500/10 p-3">
                                    <Megaphone className="h-6 w-6 text-blue-400" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-white">
                                            {campaign.name}
                                        </h3>
                                        {campaign.active ? (
                                            <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-lg bg-gray-500/10 text-gray-400 text-xs font-medium">
                                                Inactive
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-400 mb-4">
                                        {campaign.game}
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">
                                                Submissions
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-blue-400" />
                                                <p className="text-sm font-medium text-white">
                                                    {campaign._count?.submissions || 0}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">
                                                Total Views
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <Eye className="h-4 w-4 text-purple-400" />
                                                <p className="text-sm font-medium text-white">
                                                    {(campaign.totalViews || 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">
                                                Budget
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-green-400" />
                                                <p className="text-sm font-medium text-white">
                                                    ${campaign.budget}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">
                                                Spent
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-4 w-4 text-yellow-400" />
                                                <p className="text-sm font-medium text-white">
                                                    ${(campaign.totalSpent || 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {campaign.deadline && (
                                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>
                                                Deadline:{" "}
                                                {new Date(campaign.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {campaigns.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No campaigns found
                    </div>
                )}
            </div>
        </div>
    );
}
