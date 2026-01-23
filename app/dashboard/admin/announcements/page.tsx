"use client";

import { useState, useEffect } from "react";
import { Bell, Send, Trash2, Eye, EyeOff, Loader, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Announcement {
    id: string;
    title: string;
    message: string;
    type: string;
    createdBy: string;
    createdAt: string;
    isActive: boolean;
    _count?: {
        notifications: number;
    };
}

const ANNOUNCEMENT_TYPES = [
    { value: "INFO", label: "Info", icon: Info, color: "blue" },
    { value: "SUCCESS", label: "Success", icon: CheckCircle, color: "green" },
    { value: "WARNING", label: "Warning", icon: AlertTriangle, color: "yellow" },
    { value: "ALERT", label: "Alert", icon: AlertCircle, color: "red" },
];

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("INFO");
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await fetch(`${API_URL}/api/notifications/announcements`, {
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    const createAnnouncement = async () => {
        if (!title || !message) {
            alert("Please fill in all fields");
            return;
        }

        try {
            setCreating(true);
            const res = await fetch(`${API_URL}/api/notifications/announcement`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, message, type }),
            });

            if (res.ok) {
                const data = await res.json();
                alert(`✅ Announcement sent to ${data.notificationCount} users!`);
                setTitle("");
                setMessage("");
                setType("INFO");
                setShowForm(false);
                fetchAnnouncements();
            } else {
                alert("Failed to create announcement");
            }
        } catch (error) {
            console.error("Failed to create announcement:", error);
            alert("An error occurred");
        } finally {
            setCreating(false);
        }
    };

    const toggleAnnouncement = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/api/notifications/announcement/${id}/toggle`, {
                method: "PATCH",
                credentials: "include",
            });

            if (res.ok) {
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Failed to toggle announcement:", error);
        }
    };

    const deleteAnnouncement = async (id: string) => {
        if (!confirm("Are you sure you want to delete this announcement? This will remove it from all users.")) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/notifications/announcement/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                fetchAnnouncements();
            }
        } catch (error) {
            console.error("Failed to delete announcement:", error);
        }
    };

    const getTypeInfo = (typeName: string) => {
        return ANNOUNCEMENT_TYPES.find((t) => t.value === typeName) || ANNOUNCEMENT_TYPES[0];
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Announcements</h1>
                    <p className="text-gray-400">Send notifications to all users on the platform</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2"
                >
                    <Send className="h-5 w-5" />
                    New Announcement
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 animate-in slide-in-from-top-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Create Announcement</h2>

                    <div className="space-y-4">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Announcement Type
                            </label>
                            <div className="grid grid-cols-4 gap-3">
                                {ANNOUNCEMENT_TYPES.map((annoType) => {
                                    const Icon = annoType.icon;
                                    const isSelected = type === annoType.value;
                                    const colors = {
                                        blue: "border-blue-500/20 bg-blue-500/10 text-blue-400",
                                        green: "border-green-500/20 bg-green-500/10 text-green-400",
                                        yellow: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
                                        red: "border-red-500/20 bg-red-500/10 text-red-400",
                                    };
                                    return (
                                        <button
                                            key={annoType.value}
                                            onClick={() => setType(annoType.value)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                ? colors[annoType.color as keyof typeof colors]
                                                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                                                }`}
                                        >
                                            <Icon className="h-6 w-6 mx-auto mb-2" />
                                            <p className="text-sm font-medium">{annoType.label}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., New Feature Released!"
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                                maxLength={100}
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your announcement message..."
                                rows={4}
                                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">{message.length}/500 characters</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={createAnnouncement}
                                disabled={creating || !title || !message}
                                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {creating ? (
                                    <>
                                        <Loader className="h-5 w-5 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-5 w-5" />
                                        Send to All Users
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setTitle("");
                                    setMessage("");
                                    setType("INFO");
                                }}
                                className="px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-medium rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Recent Announcements</h2>

                {loading ? (
                    <div className="text-center py-12">
                        <Loader className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">No announcements yet</p>
                        <p className="text-gray-600 text-sm mt-2">Create one to notify all users</p>
                    </div>
                ) : (
                    announcements.map((announcement) => {
                        const typeInfo = getTypeInfo(announcement.type);
                        const Icon = typeInfo.icon;
                        const colors = {
                            blue: "border-blue-500/20 bg-blue-500/5 text-blue-400",
                            green: "border-green-500/20 bg-green-500/5 text-green-400",
                            yellow: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
                            red: "border-red-500/20 bg-red-500/5 text-red-400",
                        };

                        return (
                            <div
                                key={announcement.id}
                                className={`bg-white/5 border rounded-2xl p-6 transition-all duration-200 ${announcement.isActive
                                    ? "border-white/10"
                                    : "border-white/5 opacity-60"
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`p-3 rounded-xl border ${colors[typeInfo.color as keyof typeof colors]
                                            }`}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {announcement.title}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => toggleAnnouncement(announcement.id)}
                                                    className={`p-2 rounded-lg transition-colors ${announcement.isActive
                                                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                                        : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                                                        }`}
                                                    title={announcement.isActive ? "Active" : "Inactive"}
                                                >
                                                    {announcement.isActive ? (
                                                        <Eye className="h-4 w-4" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => deleteAnnouncement(announcement.id)}
                                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 mb-3">{announcement.message}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>
                                                {new Date(announcement.createdAt).toLocaleDateString()} at{" "}
                                                {new Date(announcement.createdAt).toLocaleTimeString()}
                                            </span>
                                            {announcement._count && (
                                                <span className="flex items-center gap-1">
                                                    <Bell className="h-3 w-3" />
                                                    {announcement._count.notifications} notifications sent
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
