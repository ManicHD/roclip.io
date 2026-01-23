"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Upload,
    Link as LinkIcon,
    CheckCircle,
    AlertCircle,
    Loader2,
    ChevronDown,
    Plus,
    X,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const MAX_VIDEOS = 4;

interface Campaign {
    id: number;
    name: string;
    game: string;
    payout: string;
    payoutLong?: string;
    allowedPlatforms: string;
    minViewsShorts?: number;
    minViewsLong?: number;
    requireNewUploads: boolean;
    canSubmit?: boolean;
    budgetStatus?: 'available' | 'almost_full' | 'full';
}

// Format payout to always show 2 decimal places
function formatPayout(payout: string | null | undefined): string {
    if (!payout || payout === "null") return "N/A";
    const match = payout.match(/[\d.]+/);
    if (!match) return payout;
    const num = parseFloat(match[0]);
    return `$${num.toFixed(2)} per 1k`;
}

export default function SubmitPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const preselectedCampaign = searchParams.get("campaign");

    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaign, setSelectedCampaign] = useState<string>("");
    const [videoUrls, setVideoUrls] = useState<string[]>([""]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [submittedCount, setSubmittedCount] = useState(0);

    useEffect(() => {
        fetch(`${API_URL}/api/campaigns`, { credentials: "include" })
            .then((r) => r.json())
            .then((data) => {
                setCampaigns(data.campaigns || []);
                if (preselectedCampaign) {
                    setSelectedCampaign(preselectedCampaign);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch campaigns:", err);
                setLoading(false);
            });
    }, [preselectedCampaign]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        setSubmittedCount(0);

        // Filter out empty URLs
        const validUrls = videoUrls.filter(url => url.trim() !== "");

        if (validUrls.length === 0) {
            setError("Please enter at least one video URL");
            setSubmitting(false);
            return;
        }

        try {
            let successCount = 0;
            const errors: string[] = [];

            for (const url of validUrls) {
                try {
                    const response = await fetch(`${API_URL}/api/submissions`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                        body: JSON.stringify({
                            videoUrl: url,
                            campaignId: parseInt(selectedCampaign, 10),
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        errors.push(`${url}: ${data.error || "Failed"}`);
                    } else {
                        successCount++;
                        setSubmittedCount(prev => prev + 1);
                    }
                } catch (err: any) {
                    errors.push(`${url}: ${err.message}`);
                }
            }

            if (successCount === validUrls.length) {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/dashboard/history");
                }, 2000);
            } else if (successCount > 0) {
                // Some succeeded, some failed
                setError(`${successCount}/${validUrls.length} videos submitted. Errors: ${errors.join("; ")}`);
            } else {
                // All failed
                throw new Error(errors.join("; "));
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Helper functions for managing video URLs
    const addVideoUrl = () => {
        if (videoUrls.length < MAX_VIDEOS) {
            setVideoUrls([...videoUrls, ""]);
        }
    };

    const removeVideoUrl = (index: number) => {
        if (videoUrls.length > 1) {
            setVideoUrls(videoUrls.filter((_, i) => i !== index));
        }
    };

    const updateVideoUrl = (index: number, value: string) => {
        const newUrls = [...videoUrls];
        newUrls[index] = value;
        setVideoUrls(newUrls);
    };

    const selectedCampaignData = campaigns.find(
        (c) => c.id.toString() === selectedCampaign
    );

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="h-96 rounded-2xl bg-white/5 animate-pulse" />
            </div>
        );
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto text-center py-16"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6"
                >
                    <CheckCircle className="h-10 w-10 text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Video Submitted!
                </h2>
                <p className="text-gray-400 mb-4">
                    Your video has been submitted for review. You'll be notified once it's
                    approved.
                </p>
                <p className="text-sm text-gray-500">Redirecting to history...</p>
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="rounded-xl bg-blue-500/10 p-3">
                        <Upload className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Submit Video</h2>
                        <p className="text-sm text-gray-400">
                            Submit your video to an active campaign
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Campaign Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select Campaign
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full flex items-center justify-between gap-2 px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-left text-white hover:border-blue-500/30 hover:bg-white/[0.07] transition-all duration-200"
                            >
                                {selectedCampaignData ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        <div>
                                            <span className="font-medium">
                                                {selectedCampaignData.name}
                                            </span>
                                            <span className="text-gray-400 text-sm ml-2">
                                                • {formatPayout(selectedCampaignData.payout)}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-gray-400">Choose a campaign</span>
                                )}
                                <ChevronDown
                                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute z-20 w-full mt-2 rounded-xl border border-white/10 bg-black shadow-2xl max-h-72 overflow-y-auto"
                                >
                                    {campaigns.length === 0 ? (
                                        <div className="px-4 py-6 text-center text-gray-400 text-sm">
                                            No active campaigns available
                                        </div>
                                    ) : (
                                        campaigns
                                            .filter(c => c.canSubmit !== false) // Filter out full campaigns
                                            .map((campaign, i) => (
                                                <button
                                                    key={campaign.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCampaign(campaign.id.toString());
                                                        setDropdownOpen(false);
                                                    }}
                                                    className={`w-full px-4 py-3.5 text-left transition-all duration-150 flex items-start gap-3 ${selectedCampaign === campaign.id.toString()
                                                        ? "bg-white/10 border-l-2 border-white"
                                                        : "hover:bg-white/5 border-l-2 border-transparent"
                                                        } ${i !== campaigns.filter(c => c.canSubmit !== false).length - 1 ? "border-b border-white/5" : ""}`}
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-white truncate">
                                                            {campaign.name}
                                                        </div>
                                                        <div className="text-sm text-gray-400 truncate">
                                                            {formatPayout(campaign.payout)}
                                                        </div>
                                                    </div>
                                                    {selectedCampaign === campaign.id.toString() && (
                                                        <CheckCircle className="h-4 w-4 text-white flex-shrink-0 mt-1" />
                                                    )}
                                                </button>
                                            ))
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Campaign Info */}
                    {selectedCampaignData && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2"
                        >
                            <div className="text-sm">
                                <span className="text-gray-400">Rate:</span>
                                <span className="text-white ml-2">
                                    {formatPayout(selectedCampaignData.payout)}
                                    {selectedCampaignData.payoutLong && (
                                        <span className="text-gray-500">
                                            {" "}({formatPayout(selectedCampaignData.payoutLong)} for long form)
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="text-sm flex items-center gap-2">
                                <span className="text-gray-400">Platforms:</span>
                                <div className="flex items-center gap-2">
                                    {selectedCampaignData.allowedPlatforms.split(",").map((p) => {
                                        const platform = p.trim().toLowerCase();
                                        return (
                                            <div key={platform} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5">
                                                {platform === "youtube" && (
                                                    <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                    </svg>
                                                )}
                                                {platform === "tiktok" && (
                                                    <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                                                    </svg>
                                                )}
                                                {platform === "instagram" && (
                                                    <svg className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                                                    </svg>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {(selectedCampaignData.minViewsShorts ||
                                selectedCampaignData.minViewsLong) && (
                                    <div className="text-sm">
                                        <span className="text-gray-400">Min Views:</span>
                                        <span className="text-white ml-2">
                                            {selectedCampaignData.minViewsShorts?.toLocaleString() ||
                                                "None"}{" "}
                                            (Shorts)
                                            {selectedCampaignData.minViewsLong &&
                                                ` / ${selectedCampaignData.minViewsLong.toLocaleString()} (Long)`}
                                        </span>
                                    </div>
                                )}
                            {selectedCampaignData.requireNewUploads && (
                                <div className="text-xs text-yellow-400 mt-2">
                                    ⚠️ Only videos uploaded after campaign start date are accepted
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Video URLs */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Video URL{videoUrls.length > 1 ? "s" : ""}
                            </label>
                            <span className="text-xs text-gray-500">
                                {videoUrls.length}/{MAX_VIDEOS} videos
                            </span>
                        </div>

                        <div className="space-y-3">
                            {videoUrls.map((url, index) => (
                                <div key={index} className="relative flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="url"
                                            value={url}
                                            onChange={(e) => updateVideoUrl(index, e.target.value)}
                                            placeholder={`https://youtube.com/shorts/... or https://tiktok.com/...`}
                                            className="w-full h-12 pl-12 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                                        />
                                    </div>
                                    {videoUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeVideoUrl(index)}
                                            className="flex-shrink-0 p-3 rounded-xl border border-white/10 bg-white/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add More Button */}
                        {videoUrls.length < MAX_VIDEOS && (
                            <button
                                type="button"
                                onClick={addVideoUrl}
                                className="mt-3 w-full h-10 rounded-xl border border-dashed border-white/20 text-gray-400 text-sm font-medium hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Another Video ({videoUrls.length}/{MAX_VIDEOS})
                            </button>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                            Paste your YouTube, TikTok, or Instagram video URL. You can submit up to {MAX_VIDEOS} videos at once.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                        >
                            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-red-400">{error}</span>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={!selectedCampaign || videoUrls.every(url => url.trim() === "") || submitting}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Submitting {submittedCount > 0 ? `(${submittedCount}/${videoUrls.filter(u => u.trim()).length})` : "..."}
                            </>
                        ) : (
                            <>
                                <Upload className="h-5 w-5" />
                                Submit {videoUrls.filter(u => u.trim()).length > 1 ? `${videoUrls.filter(u => u.trim()).length} Videos` : "Video"}
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
