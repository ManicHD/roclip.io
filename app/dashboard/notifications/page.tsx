"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, Check, X, Loader } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface NotificationPreferences {
    email?: string;
    emailVerified: boolean;
    emailOnCampaignLaunch: boolean;
    emailOnAnnouncement: boolean;
    emailOnCampaignUpdate: boolean;
}

export default function NotificationsPage() {
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        emailVerified: false,
        emailOnCampaignLaunch: false,
        emailOnAnnouncement: false,
        emailOnCampaignUpdate: false,
    });
    const [emailInput, setEmailInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Fetch preferences
    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const res = await fetch(`${API_URL}/api/notifications/preferences`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setPreferences(data);
                    setEmailInput(data.email || "");
                }
            } catch (error) {
                console.error("Failed to fetch preferences:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPreferences();
    }, []);

    // Save preferences
    const savePreferences = async () => {
        try {
            setSaving(true);
            setMessage(null);

            const res = await fetch(`${API_URL}/api/notifications/preferences`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: emailInput || null,
                    emailOnCampaignLaunch: preferences.emailOnCampaignLaunch,
                    emailOnAnnouncement: preferences.emailOnAnnouncement,
                    emailOnCampaignUpdate: preferences.emailOnCampaignUpdate,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setPreferences(data);
                setMessage({ type: "success", text: "Preferences saved successfully!" });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: "error", text: "Failed to save preferences" });
            }
        } catch (error) {
            console.error("Failed to save preferences:", error);
            setMessage({ type: "error", text: "An error occurred" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Notification Settings</h1>
                <p className="text-gray-400">
                    Manage how you receive notifications about campaigns and announcements
                </p>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${message.type === "success"
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}
                >
                    {message.type === "success" ? (
                        <Check className="h-5 w-5 flex-shrink-0" />
                    ) : (
                        <X className="h-5 w-5 flex-shrink-0" />
                    )}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            {/* Email Settings */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Email Notifications</h2>
                        <p className="text-sm text-gray-400">
                            Receive updates via email (optional)
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                        {preferences.email && !preferences.emailVerified && (
                            <p className="text-yellow-500 text-sm mt-2 flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Email verification coming soon
                            </p>
                        )}
                    </div>

                    {/* Email Preferences */}
                    <div className="space-y-3 pt-4 border-t border-white/10">
                        <p className="text-sm font-medium text-gray-300">
                            Send me emails about:
                        </p>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={preferences.emailOnCampaignLaunch}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        emailOnCampaignLaunch: e.target.checked,
                                    })
                                }
                                className="w-5 h-5 rounded border-2 border-white/20 bg-black/50 checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-colors"
                            />
                            <div className="flex-1">
                                <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                    🚀 New Campaign Launches
                                </p>
                                <p className="text-sm text-gray-500">
                                    Get notified when new campaigns are available
                                </p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={preferences.emailOnAnnouncement}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        emailOnAnnouncement: e.target.checked,
                                    })
                                }
                                className="w-5 h-5 rounded border-2 border-white/20 bg-black/50 checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-colors"
                            />
                            <div className="flex-1">
                                <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                    📢 Important Announcements
                                </p>
                                <p className="text-sm text-gray-500">
                                    Stay updated with platform news and updates
                                </p>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={preferences.emailOnCampaignUpdate}
                                onChange={(e) =>
                                    setPreferences({
                                        ...preferences,
                                        emailOnCampaignUpdate: e.target.checked,
                                    })
                                }
                                className="w-5 h-5 rounded border-2 border-white/20 bg-black/50 checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-colors"
                            />
                            <div className="flex-1">
                                <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                                    📝 Campaign Updates
                                </p>
                                <p className="text-sm text-gray-500">
                                    Alerts about changes to campaigns you've joined
                                </p>
                            </div>
                        </label>
                    </div>
                </div>
            </div>

            {/* In-App Notifications Info */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Bell className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">In-App Notifications</h2>
                        <p className="text-sm text-gray-400">
                            Always enabled - You'll see notifications in the dashboard
                        </p>
                    </div>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                    <p className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        New campaign launch popups
                    </p>
                    <p className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        Notification bell with unread counter
                    </p>
                    <p className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-400" />
                        Real-time updates on campaign changes
                    </p>
                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={savePreferences}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {saving ? (
                    <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Check className="h-5 w-5" />
                        Save Preferences
                    </>
                )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
                Changes are saved automatically to your account
            </p>
        </div>
    );
}
