"use client";

import { useState, useEffect } from "react";
import { Instagram, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import ConfirmModal from "@/app/components/ConfirmModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface InstagramStatus {
    connected: boolean;
    username?: string;
    connectedAt?: string;
    expired?: boolean;
}

export default function InstagramConnect({ discordId }: { discordId: string }) {
    const [status, setStatus] = useState<InstagramStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/api/instagram/status/${discordId}`, {
                credentials: "include"
            });
            const data = await res.json();
            setStatus(data);
        } catch (err) {
            console.error("Failed to fetch Instagram status:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            setConnecting(true);
            const res = await fetch(`${API_URL}/api/instagram/connect?userId=${discordId}`, {
                credentials: "include"
            });
            const { authUrl } = await res.json();

            // Open OAuth popup
            const width = 600;
            const height = 700;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            const popup = window.open(
                authUrl,
                "Instagram OAuth",
                `width=${width},height=${height},left=${left},top=${top}`
            );

            // Listen for callback
            const checkClosed = setInterval(() => {
                if (popup?.closed) {
                    clearInterval(checkClosed);
                    setConnecting(false);
                    // Refresh status after popup closes
                    setTimeout(fetchStatus, 1000);
                }
            }, 500);

        } catch (err) {
            console.error("Failed to initiate OAuth:", err);
            setConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        setShowDisconnectConfirm(false);

        try {
            await fetch(`${API_URL}/api/instagram/disconnect/${discordId}`, {
                method: "POST",
                credentials: "include"
            });
            fetchStatus();
        } catch (err) {
            console.error("Failed to disconnect:", err);
        }
    };

    if (loading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl p-3 bg-pink-500/10">
                        <Instagram className="h-5 w-5 text-pink-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-white">Instagram</p>
                        <p className="text-xs text-gray-400">Loading status...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            {/* WARNING BANNER */}
            <div className="mb-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-yellow-400 mb-1">
                            ⚠️ Instagram Integration Not Yet Active
                        </p>
                        <p className="text-xs text-yellow-400/80">
                            This feature is pending Meta app review (1-2 weeks). Instagram submissions will not work until approved.
                            You can connect your account now, but view counting won't function yet.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl p-3 bg-pink-500/10">
                        <Instagram className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Instagram Business Account</p>
                        {status?.connected ? (
                            <div className="flex items-center gap-2 mt-1">
                                <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                                <p className="text-xs text-gray-400">
                                    Connected as <span className="text-white">@{status.username}</span>
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mt-1">
                                <XCircle className="h-3.5 w-3.5 text-gray-500" />
                                <p className="text-xs text-gray-400">Not connected</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    {status?.connected ? (
                        <button
                            onClick={() => setShowDisconnectConfirm(true)}
                            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors"
                        >
                            Disconnect
                        </button>
                    ) : (
                        <button
                            onClick={handleConnect}
                            disabled={connecting}
                            className="px-4 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {connecting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                "Connect Account"
                            )}
                        </button>
                    )}
                </div>
            </div>

            {status?.connected && status.expired && (
                <div className="mt-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-xs text-yellow-400">
                        ⚠️ Your Instagram token has expired. Please reconnect to continue submitting Reels.
                    </p>
                </div>
            )}

            {!status?.connected && (
                <div className="mt-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs text-blue-400">
                        💡 Requires Instagram Business/Creator account. Personal accounts cannot connect.
                    </p>
                </div>
            )}

            {/* Disconnect Confirmation Modal */}
            <ConfirmModal
                isOpen={showDisconnectConfirm}
                onClose={() => setShowDisconnectConfirm(false)}
                onConfirm={handleDisconnect}
                title="Disconnect Instagram"
                message="Disconnect your Instagram account? You won't be able to submit Instagram Reels until you reconnect."
                variant="danger"
            />
        </div>
    );
}
