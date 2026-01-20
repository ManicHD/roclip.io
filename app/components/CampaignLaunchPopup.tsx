"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface CampaignNotification {
    id: string;
    type: string;
    campaignId: number;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface Campaign {
    id: number;
    name: string;
    game: string;
    budget: string;
    payout: string;
    description: string;
    allowedPlatforms: string;
}

interface CampaignLaunchPopupProps {
    disabled?: boolean;
}

export default function CampaignLaunchPopup({ disabled = false }: CampaignLaunchPopupProps) {
    const [notification, setNotification] = useState<CampaignNotification | null>(null);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [gameImage, setGameImage] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [dataReady, setDataReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkForNewCampaign();
    }, []);

    // Only show popup when data is ready AND not disabled
    useEffect(() => {
        if (dataReady && !disabled) {
            setTimeout(() => setIsVisible(true), 500);
        } else if (disabled) {
            setIsVisible(false);
        }
    }, [dataReady, disabled]);

    const checkForNewCampaign = async () => {
        try {
            // Get unread campaign launch notifications
            const res = await fetch(`${API_URL}/api/notifications/user`, {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                const campaignNotifs = data.notifications.filter(
                    (n: CampaignNotification) => n.type === "CAMPAIGN_LAUNCH" && !n.isRead
                );

                if (campaignNotifs.length > 0) {
                    const latest = campaignNotifs[0];
                    setNotification(latest);

                    // Fetch campaign details
                    if (latest.campaignId) {
                        const campaignRes = await fetch(
                            `${API_URL}/api/campaigns/${latest.campaignId}`,
                            { credentials: "include" }
                        );
                        if (campaignRes.ok) {
                            const campaignData = await campaignRes.json();
                            setCampaign(campaignData.campaign || campaignData);

                            // Try to get game image
                            const gameUrl = campaignData.campaign?.game || campaignData.game;
                            if (gameUrl) {
                                fetchGameImage(gameUrl);
                            }
                        }
                    }

                    // Mark data as ready - visibility controlled by useEffect based on disabled prop
                    setDataReady(true);
                }
            }
        } catch (error) {
            console.error("Failed to check for new campaigns:", error);
        }
    };

    const fetchGameImage = async (gameUrl: string) => {
        try {
            // Extract place ID from Roblox URL
            const match = gameUrl.match(/games\/(\d+)/);
            if (match) {
                const placeId = match[1];
                const res = await fetch(`${API_URL}/api/roblox/thumbnail/${placeId}`);
                if (res.ok) {
                    const data = await res.json();
                    setGameImage(data.imageUrl);
                }
            }
        } catch (error) {
            console.error("Failed to fetch game image:", error);
        }
    };

    const handleClose = async () => {
        setIsVisible(false);
        setTimeout(() => setNotification(null), 300);

        // Mark as read
        if (notification) {
            try {
                await fetch(`${API_URL}/api/notifications/mark-read`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notificationIds: [notification.id] }),
                });
            } catch (error) {
                console.error("Failed to mark notification as read:", error);
            }
        }
    };

    const handleViewCampaign = () => {
        handleClose();
        router.push("/dashboard/campaigns");
    };

    if (!notification || !campaign) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={handleClose}
            />

            {/* Popup */}
            <div
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md transition-all duration-300 px-4 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
            >
                <div className="bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="relative border-b border-white/10 p-5">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-3 pr-10">
                            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <Sparkles className="h-6 w-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">New Campaign Available</h2>
                                <p className="text-sm text-gray-500">Start earning now</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                        {/* Game Image */}
                        {gameImage && (
                            <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video">
                                <img
                                    src={gameImage}
                                    alt={campaign.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Campaign Info */}
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1.5">{campaign.name}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{campaign.description}</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                                <p className="text-xs text-gray-500 mb-1.5 font-medium">Total Budget</p>
                                <p className="text-lg font-bold text-white">{campaign.budget}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5">
                                <p className="text-xs text-gray-500 mb-1.5 font-medium">Payout Rate</p>
                                <p className="text-lg font-bold text-green-400">{campaign.payout}</p>
                            </div>
                        </div>

                        {/* Platforms */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-gray-500 font-medium">Platforms:</span>
                            {campaign.allowedPlatforms.split(",").map((platform) => {
                                const platformMap: Record<string, { icon: string; color: string }> = {
                                    youtube: { icon: "📺", color: "bg-red-500/10 text-red-400 border-red-500/20" },
                                    tiktok: { icon: "🎵", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
                                    instagram: { icon: "📸", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
                                };
                                const info = platformMap[platform.trim().toLowerCase()] || {
                                    icon: "🎬",
                                    color: "bg-gray-500/10 text-gray-400 border-gray-500/20",
                                };
                                return (
                                    <span
                                        key={platform}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${info.color}`}
                                    >
                                        {info.icon} {platform.trim()}
                                    </span>
                                );
                            })}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleViewCampaign}
                                className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                View Campaign
                            </button>
                            <button
                                onClick={handleClose}
                                className="px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-medium rounded-xl hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200"
                            >
                                Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
