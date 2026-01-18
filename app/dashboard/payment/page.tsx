"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Wallet,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    Loader2,
    CreditCard,
    Building2,
    Shield,
    Zap,
    XCircle,
    DollarSign,
    Mail,
} from "lucide-react";
import ConfirmModal from "@/app/components/ConfirmModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface StripeStatus {
    connected: boolean;
    onboardingComplete: boolean;
    payoutsEnabled: boolean;
    email?: string;
}

interface PayPalStatus {
    connected: boolean;
    verified: boolean;
    email?: string;
}

interface Payout {
    id: string;
    amount: number;
    status: string;
    method: string;
    periodStart: string;
    periodEnd: string;
    createdAt: string;
    completedAt?: string;
}

type PaymentMethod = "stripe" | "paypal";

export default function PaymentPage() {
    const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
    const [paypalStatus, setPayPalStatus] = useState<PayPalStatus | null>(null);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [balance, setBalance] = useState<{
        pendingBalance: number;
        totalEarnings: number;
        minimumPayout: number;
    } | null>(null);
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
    const [disconnectMethod, setDisconnectMethod] = useState<PaymentMethod | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("stripe");
    const [paypalEmail, setPaypalEmail] = useState("");
    const [connectingPaypal, setConnectingPaypal] = useState(false);

    const fetchBalance = async () => {
        try {
            const res = await fetch(`${API_URL}/api/stats/overview`, {
                credentials: "include",
            });
            if (!res.ok) return;
            const data = await res.json();
            setBalance({
                pendingBalance: data.stats?.pendingBalance || 0,
                totalEarnings: data.stats?.totalEarnings || 0,
                minimumPayout: data.stats?.minimumPayout || 100,
            });
        } catch (err) {
            console.error("Error fetching balance:", err);
        }
    };

    const fetchStripeStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/api/stripe/status`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch status");
            const data = await res.json();
            setStripeStatus(data);
        } catch (err) {
            console.error("Error fetching Stripe status:", err);
            setError("Failed to load payment status");
        }
    };

    const fetchPayPalStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/api/paypal/status`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch PayPal status");
            const data = await res.json();
            setPayPalStatus(data);
            if (data.connected && data.email) {
                setPaypalEmail(data.email);
            }
        } catch (err) {
            console.error("Error fetching PayPal status:", err);
        }
    };

    const fetchPayouts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/stripe/payouts`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch payouts");
            const data = await res.json();
            setPayouts(data.payouts || []);
        } catch (err) {
            console.error("Error fetching payouts:", err);
        }
    };

    useEffect(() => {
        Promise.all([fetchStripeStatus(), fetchPayPalStatus(), fetchPayouts(), fetchBalance()]).finally(() =>
            setLoading(false)
        );
    }, []);

    const handleStripeConnect = async () => {
        setConnecting(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/stripe/connect`, {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to create Stripe account");
            }
            window.location.href = data.url;
        } catch (err: any) {
            console.error("Error connecting Stripe:", err);
            setError(err.message || "Failed to connect Stripe. Please try again.");
            setConnecting(false);
        }
    };

    const handlePayPalConnect = async () => {
        if (!paypalEmail || !paypalEmail.includes("@")) {
            setError("Please enter a valid PayPal email address");
            return;
        }

        setConnectingPaypal(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/paypal/connect`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email: paypalEmail }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to connect PayPal");
            }
            await fetchPayPalStatus();
        } catch (err: any) {
            console.error("Error connecting PayPal:", err);
            setError(err.message || "Failed to connect PayPal. Please try again.");
        } finally {
            setConnectingPaypal(false);
        }
    };

    const handleOpenDashboard = async () => {
        try {
            const res = await fetch(`${API_URL}/api/stripe/dashboard`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to get dashboard link");
            const data = await res.json();
            window.open(data.url, "_blank");
        } catch (err) {
            console.error("Error opening dashboard:", err);
            setError("Failed to open Stripe dashboard");
        }
    };

    const handleDisconnect = async () => {
        if (!disconnectMethod) return;

        setShowDisconnectConfirm(false);
        try {
            const endpoint = disconnectMethod === "stripe" ? "/api/stripe/disconnect" : "/api/paypal/disconnect";
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to disconnect");

            if (disconnectMethod === "stripe") {
                setStripeStatus({ connected: false, onboardingComplete: false, payoutsEnabled: false });
            } else {
                setPayPalStatus({ connected: false, verified: false });
                setPaypalEmail("");
            }

            setDisconnectMethod(null);
        } catch (err) {
            console.error("Error disconnecting:", err);
            setError("Failed to disconnect. Please try again.");
        }
    };

    const initiateDisconnect = (method: PaymentMethod) => {
        setDisconnectMethod(method);
        setShowDisconnectConfirm(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getStatusBadge = (payoutStatus: string) => {
        switch (payoutStatus) {
            case "COMPLETED":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                    </span>
                );
            case "PROCESSING":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Processing
                    </span>
                );
            case "FAILED":
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-400">
                        <XCircle className="h-3 w-3" />
                        Failed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/10 text-gray-400">
                        Pending
                    </span>
                );
        }
    };

    const hasAnyConnection = stripeStatus?.connected || paypalStatus?.connected;

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-8">
            <div className="w-full max-w-4xl space-y-6 px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8"
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3">
                            <Wallet className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Payment Settings</h2>
                            <p className="text-sm text-gray-400 mt-1">
                                Connect your preferred payment method to receive earnings
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Balance & Threshold */}
                    {balance && (
                        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-blue-500/20">
                                        <DollarSign className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Current Balance</p>
                                        <p className="text-3xl font-bold text-white">
                                            ${balance.pendingBalance.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">Payout Threshold</p>
                                    <p className="text-xl font-semibold text-white">
                                        ${balance.minimumPayout.toFixed(0)}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Progress to payout</span>
                                    <span>
                                        {Math.min(100, (balance.pendingBalance / balance.minimumPayout) * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${balance.pendingBalance >= balance.minimumPayout
                                            ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                            : "bg-gradient-to-r from-blue-500 to-purple-500"
                                            }`}
                                        style={{
                                            width: `${Math.min(100, (balance.pendingBalance / balance.minimumPayout) * 100)}%`,
                                        }}
                                    />
                                </div>
                                {balance.pendingBalance >= balance.minimumPayout ? (
                                    <p className="text-sm text-green-400 flex items-center gap-1">
                                        <CheckCircle className="h-4 w-4" />
                                        Eligible for payout! Payouts are processed monthly.
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        ${(balance.minimumPayout - balance.pendingBalance).toFixed(2)} more needed for payout
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Stripe Card */}
                        <button
                            onClick={() => setSelectedMethod("stripe")}
                            className={`relative p-5 rounded-xl border-2 transition-all text-left ${selectedMethod === "stripe"
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-white/10 bg-white/5 hover:border-white/20"
                                }`}
                        >
                            {stripeStatus?.connected && (
                                <div className="absolute top-3 right-3">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-2">
                                <CreditCard className="h-5 w-5 text-blue-400" />
                                <h3 className="font-semibold text-white">Stripe</h3>
                            </div>
                            <p className="text-xs text-gray-400">
                                Bank account or debit card • 3-7 days
                            </p>
                            {stripeStatus?.connected && stripeStatus.email && (
                                <p className="text-xs text-green-400 mt-2">{stripeStatus.email}</p>
                            )}
                        </button>

                        {/* PayPal Card */}
                        <button
                            onClick={() => setSelectedMethod("paypal")}
                            className={`relative p-5 rounded-xl border-2 transition-all text-left ${selectedMethod === "paypal"
                                ? "border-purple-500 bg-purple-500/10"
                                : "border-white/10 bg-white/5 hover:border-white/20"
                                }`}
                        >
                            {paypalStatus?.connected && (
                                <div className="absolute top-3 right-3">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                            )}
                            <div className="flex items-center gap-3 mb-2">
                                <Mail className="h-5 w-5 text-purple-400" />
                                <h3 className="font-semibold text-white">PayPal</h3>
                            </div>
                            <p className="text-xs text-gray-400">
                                Instant to PayPal • 2% fee (max $1)
                            </p>
                            {paypalStatus?.connected && paypalStatus.email && (
                                <p className="text-xs text-purple-400 mt-2">{paypalStatus.email}</p>
                            )}
                        </button>
                    </div>

                    {/* Connection Forms */}
                    {selectedMethod === "stripe" && (
                        <div className="space-y-4">
                            {stripeStatus?.connected ? (
                                <div className="space-y-4">
                                    {/* Connected Status */}
                                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                                                <div>
                                                    <p className="font-medium text-white">Connected to Stripe</p>
                                                    {stripeStatus.email && (
                                                        <p className="text-sm text-gray-400">{stripeStatus.email}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <CheckCircle className="h-6 w-6 text-green-400" />
                                        </div>
                                    </div>

                                    {/* Status Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <p className="text-sm text-gray-400 mb-1">Onboarding</p>
                                            <div className="flex items-center gap-2">
                                                {stripeStatus.onboardingComplete ? (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                        <span className="text-white font-medium">Complete</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                                                        <span className="text-yellow-400 font-medium">Incomplete</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <p className="text-sm text-gray-400 mb-1">Payouts</p>
                                            <div className="flex items-center gap-2">
                                                {stripeStatus.payoutsEnabled ? (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                        <span className="text-white font-medium">Enabled</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                                                        <span className="text-yellow-400 font-medium">Not Ready</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {!stripeStatus.onboardingComplete && (
                                            <button
                                                onClick={handleStripeConnect}
                                                disabled={connecting}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                                            >
                                                {connecting ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <ExternalLink className="h-4 w-4" />
                                                )}
                                                Complete Setup
                                            </button>
                                        )}
                                        <button
                                            onClick={handleOpenDashboard}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            Manage Details
                                        </button>
                                        <button
                                            onClick={() => initiateDisconnect("stripe")}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Benefits Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <Shield className="h-6 w-6 text-blue-400 mb-3" />
                                            <p className="font-medium text-white text-sm">Secure</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Stripe handles all sensitive data
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <Zap className="h-6 w-6 text-yellow-400 mb-3" />
                                            <p className="font-medium text-white text-sm">Fast Payouts</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Get paid in 3-7 business days
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                            <Building2 className="h-6 w-6 text-green-400 mb-3" />
                                            <p className="font-medium text-white text-sm">Flexible</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Bank account or debit card
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleStripeConnect}
                                        disabled={connecting}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold hover:from-blue-500 hover:to-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {connecting ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="h-5 w-5" />
                                                Connect with Stripe
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-gray-500">
                                        You'll be redirected to Stripe to securely add your payment details
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedMethod === "paypal" && (
                        <div className="space-y-4">
                            {paypalStatus?.connected ? (
                                <div className="space-y-4">
                                    {/* Connected Status */}
                                    <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                                                <div>
                                                    <p className="font-medium text-white">Connected to PayPal</p>
                                                    {paypalStatus.email && (
                                                        <p className="text-sm text-gray-400">{paypalStatus.email}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <CheckCircle className="h-6 w-6 text-purple-400" />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <button
                                            onClick={() => initiateDisconnect("paypal")}
                                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                        <div className="flex items-start gap-3 mb-4">
                                            <Mail className="h-5 w-5 text-purple-400 mt-0.5" />
                                            <div>
                                                <h4 className="font-medium text-white mb-1">PayPal Email</h4>
                                                <p className="text-xs text-gray-400">
                                                    Enter the email associated with your PayPal account
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            type="email"
                                            value={paypalEmail}
                                            onChange={(e) => setPaypalEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                        />
                                    </div>

                                    <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                                        <div className="flex gap-2">
                                            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <div className="text-xs text-yellow-400/90">
                                                <p className="font-medium mb-1">PayPal Fees</p>
                                                <p>PayPal charges a 2% fee per payout (capped at $1 for US accounts)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayPalConnect}
                                        disabled={connectingPaypal || !paypalEmail}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-500 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {connectingPaypal ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="h-5 w-5" />
                                                Connect PayPal
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Payout History */}
                {payouts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8"
                    >
                        <h3 className="text-xl font-bold text-white mb-6">Payout History</h3>
                        <div className="space-y-3">
                            {payouts.map((payout) => (
                                <div
                                    key={payout.id}
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                                >
                                    <div>
                                        <p className="font-semibold text-white text-lg">
                                            ${payout.amount.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                                            {payout.method === "paypal" ? (
                                                <Mail className="h-3 w-3 text-purple-400" />
                                            ) : (
                                                <CreditCard className="h-3 w-3 text-blue-400" />
                                            )}
                                            <span className="capitalize">{payout.method}</span>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(payout.status)}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDate(payout.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Disconnect Confirmation Modal */}
                <ConfirmModal
                    isOpen={showDisconnectConfirm}
                    onClose={() => {
                        setShowDisconnectConfirm(false);
                        setDisconnectMethod(null);
                    }}
                    onConfirm={handleDisconnect}
                    title={`Disconnect ${disconnectMethod === "stripe" ? "Stripe" : "PayPal"}?`}
                    message="Are you sure you want to disconnect this payment method? You won't be able to receive payouts until you reconnect."
                    variant="danger"
                />
            </div>
        </div>
    );
}
