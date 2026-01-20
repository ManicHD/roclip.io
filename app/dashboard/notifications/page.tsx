"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, Check, X, Loader, Save } from "lucide-react";

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
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Notification Settings</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Manage how you receive notifications about campaigns and announcements
                </p>
            </div>

            {/* Message */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
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
                </motion.div>
            )}

            {/* Main Settings Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
            >
                <div className="flex items-center gap-3 mb-6">
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

                <div className="space-y-6">
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
                    <div className="space-y-4 pt-4 border-t border-white/10">
                        <p className="text-sm font-medium text-gray-300">
                            Send me emails about:
                        </p>

                        <div className="space-y-2">
                            {[
                                {
                                    key: 'emailOnCampaignLaunch',
                                    title: '🚀 New Campaign Launches',
                                    desc: 'Get notified when new campaigns are available'
                                },
                                {
                                    key: 'emailOnAnnouncement',
                                    title: '📢 Important Announcements',
                                    desc: 'Stay updated with platform news and updates'
                                },
                                {
                                    key: 'emailOnCampaignUpdate',
                                    title: '📝 Campaign Updates',
                                    desc: "Alerts about changes to campaigns you've joined"
                                }
                            ].map((item) => (
                                <label key={item.key} className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <div className="relative flex items-center flex-shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={preferences[item.key as keyof NotificationPreferences] as boolean}
                                            onChange={(e) =>
                                                setPreferences({
                                                    ...preferences,
                                                    [item.key]: e.target.checked,
                                                })
                                            }
                                            className="w-5 h-5 rounded border-2 border-white/20 bg-black/50 checked:bg-blue-500 checked:border-blue-500 cursor-pointer transition-colors appearance-none"
                                        />
                                        <Check className={`h-3.5 w-3.5 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity ${preferences[item.key as keyof NotificationPreferences] ? 'opacity-100' : 'opacity-0'
                                            }`} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white font-medium group-hover:text-blue-400 transition-colors truncate">
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {item.desc}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Save Button (Inside Card) */}
                    <div className="pt-2">
                        <button
                            onClick={savePreferences}
                            disabled={saving}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            {saving ? (
                                <>
                                    <Loader className="h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    Save Preferences
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
