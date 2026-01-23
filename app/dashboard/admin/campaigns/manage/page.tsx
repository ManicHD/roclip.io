"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Megaphone,
    Plus,
    Edit3,
    Trash2,
    Save,
    X,
    Calendar,
    DollarSign,
    Eye,
    Link as LinkIcon,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Pause,
    Play,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Campaign {
    id: number;
    name: string;
    game: string;
    budget: string;
    payout: string;
    payoutLong?: string;
    description: string;
    infoLink?: string;
    allowedPlatforms: string;
    viewCap?: number;
    longViewCap?: number;
    minViewsShorts?: number;
    minViewsLong?: number;
    requireNewUploads: boolean;
    deadline?: string;
    active: boolean;
    paused?: boolean;
    createdAt: string;
}

interface CampaignFormData {
    name: string;
    game: string;
    budget: string;
    payout: string;
    payoutLong: string;
    description: string;
    infoLink: string;
    allowedPlatforms: string[];
    viewCap: string;
    longViewCap: string;
    minViewsShorts: string;
    minViewsLong: string;
    requireNewUploads: boolean;
    deadline: string;
}

const initialFormData: CampaignFormData = {
    name: "",
    game: "",
    budget: "",
    payout: "",
    payoutLong: "",
    description: "",
    infoLink: "",
    allowedPlatforms: ["youtube"],
    viewCap: "",
    longViewCap: "",
    minViewsShorts: "",
    minViewsLong: "",
    requireNewUploads: true,
    deadline: "",
};

export default function ManageCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [formData, setFormData] = useState<CampaignFormData>(initialFormData);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

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

    const handleCreateNew = () => {
        setEditingCampaign(null);
        setFormData(initialFormData);
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const handleEdit = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        setFormData({
            name: campaign.name,
            game: campaign.game,
            budget: campaign.budget,
            payout: campaign.payout,
            payoutLong: campaign.payoutLong || "",
            description: campaign.description,
            infoLink: campaign.infoLink || "",
            allowedPlatforms: campaign.allowedPlatforms.split(","),
            viewCap: campaign.viewCap?.toString() || "",
            longViewCap: campaign.longViewCap?.toString() || "",
            minViewsShorts: campaign.minViewsShorts?.toString() || "",
            minViewsLong: campaign.minViewsLong?.toString() || "",
            requireNewUploads: campaign.requireNewUploads,
            deadline: campaign.deadline ? new Date(campaign.deadline).toISOString().split('T')[0] : "",
        });
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/admin/campaigns/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                setSuccess("Campaign deleted successfully");
                fetchCampaigns();
                setTimeout(() => setSuccess(""), 3000);
            } else {
                const data = await res.json();
                setError(data.error || "Failed to delete campaign");
            }
        } catch (err) {
            setError("Failed to delete campaign");
        }
    };

    const handleTogglePause = async (campaign: Campaign) => {
        const action = campaign.paused ? "resume" : "pause";
        if (!confirm(`Are you sure you want to ${action} "${campaign.name}"?${!campaign.paused ? "\n\nUsers will not be able to submit videos while paused." : ""}`)) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/admin/campaigns/${campaign.id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paused: !campaign.paused }),
            });

            if (res.ok) {
                setSuccess(`Campaign ${action}d successfully`);
                fetchCampaigns();
                setTimeout(() => setSuccess(""), 3000);
            } else {
                const data = await res.json();
                setError(data.error || `Failed to ${action} campaign`);
            }
        } catch (err) {
            setError(`Failed to ${action} campaign`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess("");

        try {
            // Format payout strings to match Discord bot format: "$X per 1k views"
            const formatPayout = (value: string) => {
                const cleaned = value.replace(/[^0-9.]/g, '');
                const num = parseFloat(cleaned);
                if (isNaN(num)) return '';
                return `$${num} per 1k views`;
            };

            // Format budget to ensure it has $ prefix
            const formatBudget = (value: string) => {
                const cleaned = value.replace(/[^0-9.]/g, '');
                return `$${cleaned}`;
            };

            // Prepare data for submission
            const submitData: any = {
                name: formData.name.trim(),
                game: formData.game.trim(),
                budget: formatBudget(formData.budget),
                payout: formatPayout(formData.payout),
                description: formData.description.trim(),
                allowedPlatforms: formData.allowedPlatforms.join(","),
                requireNewUploads: formData.requireNewUploads,
            };

            // Add optional fields
            if (formData.payoutLong) submitData.payoutLong = formatPayout(formData.payoutLong);
            if (formData.infoLink) submitData.infoLink = formData.infoLink.trim();
            if (formData.viewCap) submitData.viewCap = parseInt(formData.viewCap);
            if (formData.longViewCap) submitData.longViewCap = parseInt(formData.longViewCap);
            if (formData.minViewsShorts) submitData.minViewsShorts = parseInt(formData.minViewsShorts);
            if (formData.minViewsLong) submitData.minViewsLong = parseInt(formData.minViewsLong);
            if (formData.deadline) submitData.deadline = new Date(formData.deadline).toISOString();

            const url = editingCampaign
                ? `${API_URL}/api/admin/campaigns/${editingCampaign.id}`
                : `${API_URL}/api/admin/campaigns`;

            const res = await fetch(url, {
                method: editingCampaign ? "PUT" : "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(editingCampaign ? "Campaign updated successfully!" : "Campaign created successfully!");
                setShowForm(false);
                fetchCampaigns();
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(data.error || "Failed to save campaign");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setSubmitting(false);
        }
    };

    const togglePlatform = (platform: string) => {
        setFormData(prev => ({
            ...prev,
            allowedPlatforms: prev.allowedPlatforms.includes(platform)
                ? prev.allowedPlatforms.filter(p => p !== platform)
                : [...prev.allowedPlatforms, platform],
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Campaigns</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Create, edit, and delete campaigns
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/20"
                >
                    <Plus className="h-5 w-5" />
                    Create Campaign
                </motion.button>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
                {!showForm && success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20"
                    >
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <p className="text-green-400 font-medium">{success}</p>
                    </motion.div>
                )}
                {!showForm && error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                        <AlertCircle className="h-5 w-5 text-red-400" />
                        <p className="text-red-400 font-medium">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Campaign Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onMouseDown={(e) => {
                            if (e.target === e.currentTarget) setShowForm(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl p-8"
                        >
                            {/* Form Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Megaphone className="h-6 w-6 text-purple-400" />
                                    {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
                                </h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="rounded-full p-2 hover:bg-white/5 transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error/Success Messages within Modal */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                                                <AlertCircle className="h-5 w-5 shrink-0" />
                                                <p className="font-medium text-sm">{error}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Basic Information</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Campaign Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={100}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="e.g., Winter 2024 Campaign"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Roblox Game URL *
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.game}
                                            onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="https://www.roblox.com/games/..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Description *
                                        </label>
                                        <textarea
                                            required
                                            minLength={10}
                                            maxLength={2000}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                                            placeholder="Describe the campaign requirements, goals, and any special instructions..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Info Link (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.infoLink}
                                            onChange={(e) => setFormData({ ...formData, infoLink: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                {/* Budget & Payouts */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Budget & Payouts</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Total Budget *
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.budget}
                                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                    placeholder="1000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Payout (Short Videos) *
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.payout}
                                                    onChange={(e) => setFormData({ ...formData, payout: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                    placeholder="5.00 per 1K views"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Payout (Long Videos)
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={formData.payoutLong}
                                                    onChange={(e) => setFormData({ ...formData, payoutLong: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                    placeholder="Optional, defaults to short payout"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Deadline (Optional)
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="date"
                                                    value={formData.deadline}
                                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* View Caps & Minimums */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">View Limits</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                View Cap (Short Videos)
                                            </label>
                                            <div className="relative">
                                                <Eye className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.viewCap}
                                                    onChange={(e) => setFormData({ ...formData, viewCap: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                    placeholder="e.g., 50000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                View Cap (Long Videos)
                                            </label>
                                            <div className="relative">
                                                <Eye className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={formData.longViewCap}
                                                    onChange={(e) => setFormData({ ...formData, longViewCap: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                    placeholder="e.g., 100000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Min Views (Short Videos)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.minViewsShorts}
                                                onChange={(e) => setFormData({ ...formData, minViewsShorts: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                placeholder="e.g., 1000"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Min Views (Long Videos)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.minViewsLong}
                                                onChange={(e) => setFormData({ ...formData, minViewsLong: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                                placeholder="e.g., 2000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Platforms & Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Platforms & Settings</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-3">
                                            Allowed Platforms *
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {["youtube", "tiktok", "instagram"].map((platform) => (
                                                <button
                                                    key={platform}
                                                    type="button"
                                                    onClick={() => togglePlatform(platform)}
                                                    className={`px-4 py-2 rounded-xl font-medium transition-all ${formData.allowedPlatforms.includes(platform)
                                                        ? "bg-purple-500 text-white"
                                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                        }`}
                                                >
                                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="requireNewUploads"
                                            checked={formData.requireNewUploads}
                                            onChange={(e) => setFormData({ ...formData, requireNewUploads: e.target.checked })}
                                            className="w-5 h-5 rounded bg-white/5 border-white/10 text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                                        />
                                        <label htmlFor="requireNewUploads" className="text-sm text-gray-300">
                                            Require new uploads (videos must be uploaded after campaign creation)
                                        </label>
                                    </div>
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting || formData.allowedPlatforms.length === 0}
                                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-5 w-5" />
                                                {editingCampaign ? "Update Campaign" : "Create Campaign"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Campaigns List */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">All Campaigns ({campaigns.length})</h2>

                {campaigns.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/[0.02]">
                        <Megaphone className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No campaigns yet. Create your first one!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {campaigns.map((campaign) => (
                            <motion.div
                                key={campaign.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`group relative rounded-2xl border p-6 transition-all hover:border-opacity-50 ${campaign.active
                                    ? "border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent"
                                    : "border-white/10 bg-white/[0.02]"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${campaign.active
                                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                                }`}>
                                                {campaign.active ? "Active" : "Inactive"}
                                            </span>
                                            {campaign.paused && (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                                    Paused
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{campaign.description}</p>

                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <DollarSign className="h-4 w-4" />
                                                <span>Budget: ${parseFloat(campaign.budget).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <DollarSign className="h-4 w-4" />
                                                <span>Payout: ${campaign.payout}/1K</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Clock className="h-4 w-4" />
                                                <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleTogglePause(campaign)}
                                            className={`p-2.5 rounded-xl transition-colors ${campaign.paused
                                                ? "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                                                : "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400"
                                                }`}
                                            title={campaign.paused ? "Resume Campaign" : "Pause Campaign"}
                                        >
                                            {campaign.paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleEdit(campaign)}
                                            className="p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                                        >
                                            <Edit3 className="h-5 w-5" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleDelete(campaign.id, campaign.name)}
                                            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
