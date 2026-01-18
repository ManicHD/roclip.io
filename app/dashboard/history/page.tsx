"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    TrendingUp,
    DollarSign,
    Filter,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Submission {
    id: number;
    videoLink: string;
    platform: string;
    status: string;
    currentViews: number;
    initialViews: number;
    manualViewCount?: number;
    frozenViewCount?: number;
    videoType: string;
    estimatedEarnings: number;
    createdAt: string;
    campaign: {
        id: number;
        name: string;
        game: string;
    };
}

const statusConfig: Record<
    string,
    { icon: any; color: string; bg: string; label: string }
> = {
    ACCEPTED: {
        icon: CheckCircle,
        color: "text-green-400",
        bg: "bg-green-500/10",
        label: "Accepted",
    },
    PENDING: {
        icon: Clock,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        label: "Pending",
    },
    DENIED: {
        icon: XCircle,
        color: "text-red-400",
        bg: "bg-red-500/10",
        label: "Denied",
    },
    FLAGGED: {
        icon: XCircle,
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        label: "Flagged",
    },
};

function SubmissionRow({
    submission,
    delay,
}: {
    submission: Submission;
    delay: number;
}) {
    const config = statusConfig[submission.status] || statusConfig.PENDING;
    const StatusIcon = config.icon;
    const viewsGained = submission.currentViews - submission.initialViews;

    // Extract video ID for thumbnail
    const getVideoThumbnail = (url: string, platform: string) => {
        if (platform === "youtube") {
            const match = url.match(
                /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
            );
            if (match) {
                return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
            }
        }
        return null;
    };

    const thumbnail = getVideoThumbnail(submission.videoLink, submission.platform);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay }}
            className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
        >
            {/* Thumbnail */}
            <div className="hidden sm:block w-24 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        {submission.platform}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">
                        {submission.campaign.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        {submission.campaign.game}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span className="capitalize">{submission.platform}</span>
                    <span>•</span>
                    <span className="capitalize">{submission.videoType}</span>
                    <span>•</span>
                    <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" />
                    <div className="text-right">
                        <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-white">
                                {(submission.frozenViewCount ?? submission.manualViewCount ?? submission.currentViews).toLocaleString()}
                            </p>
                            {(submission.manualViewCount || submission.frozenViewCount) && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-medium">
                                    MANUAL
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">views</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <div className="text-right">
                        <p className="text-sm font-medium text-white">
                            ${submission.status === 'ACCEPTED' ? submission.estimatedEarnings.toFixed(2) : '0.00'}
                        </p>
                        <p className="text-xs text-gray-500">earned</p>
                    </div>
                </div>
            </div>

            {/* Status */}
            <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg}`}
            >
                <StatusIcon className={`h-3.5 w-3.5 ${config.color}`} />
                <span className={`text-xs font-medium ${config.color}`}>
                    {config.label}
                </span>
            </div>

            {/* Link */}
            <a
                href={submission.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
                <ExternalLink className="h-4 w-4" />
            </a>
        </motion.div>
    );
}

export default function HistoryPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        const params = filter !== "all" ? `?status=${filter}` : "";
        fetch(`${API_URL}/api/submissions${params}`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                setSubmissions(data.submissions || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch submissions:", err);
                setLoading(false);
            });
    }, [filter]);

    const filters = [
        { value: "all", label: "All" },
        { value: "accepted", label: "Accepted" },
        { value: "pending", label: "Pending" },
        { value: "denied", label: "Denied" },
    ];

    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-white">Submission History</h2>
                    <p className="text-sm text-gray-400">
                        {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f.value
                                ? "bg-blue-500 text-white"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Submissions List */}
            {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="rounded-full bg-white/5 p-6 mb-4">
                        <Clock className="h-12 w-12 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">
                        No submissions yet
                    </h3>
                    <p className="text-gray-400 text-center max-w-md">
                        Submit your first video to a campaign to start earning.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {submissions.map((submission, i) => (
                        <SubmissionRow
                            key={submission.id}
                            submission={submission}
                            delay={i * 0.03}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
