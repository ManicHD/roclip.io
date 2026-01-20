"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FolderOpen,
    Upload,
    History,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Wallet,
    Shield,
} from "lucide-react";
import NotificationCenter from "../components/NotificationCenter";
import CampaignLaunchPopup from "../components/CampaignLaunchPopup";
import EmailSetupPopup from "../components/EmailSetupPopup";

interface User {
    discordId: string;
    username: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", href: "/dashboard/campaigns", icon: FolderOpen },
    { name: "History", href: "/dashboard/history", icon: History },
    { name: "Payment", href: "/dashboard/payment", icon: Wallet },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const { user, logout, isAdmin } = useAuth();

    // Build nav items dynamically based on admin status
    const allNavItems = [
        ...navItems,
        ...(isAdmin ? [{ name: "Admin", href: "/dashboard/admin", icon: Shield }] : []),
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-black border-r border-white/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="BloxClips" className="h-8 w-8 object-contain" />
                        <span className="text-lg font-bold text-white">BloxClips</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {allNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${item.name === "Admin"
                                    ? isActive
                                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                        : "text-purple-400 hover:text-purple-300 hover:bg-purple-500/5"
                                    : isActive
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                        {user?.avatar ? (
                            <img
                                src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`}
                                alt={user.username}
                                className="h-10 w-10 rounded-full"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <span className="text-blue-400 font-medium">
                                    {user?.username?.[0]?.toUpperCase() || "?"}
                                </span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.username || "Loading..."}
                            </p>
                            <p className="text-xs text-gray-500">Dashboard</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
    const pathname = usePathname();
    const currentPage = navItems.find((item) => item.href === pathname);

    return (
        <header className="sticky top-0 z-30 h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 lg:pl-64">
            <div className="flex items-center justify-between h-full px-4 lg:px-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-semibold text-white">
                            {currentPage?.name || "Dashboard"}
                        </h1>
                    </div>
                </div>
                {/* Notification Center */}
                <NotificationCenter />
            </div>
        </header>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [emailPopupActive, setEmailPopupActive] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch current user
        fetch(`${API_URL}/api/auth/me`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Not authenticated");
                return res.json();
            })
            .then(async (data) => {
                setUser(data.user);
                // Check if admin
                try {
                    const adminRes = await fetch(`${API_URL}/api/admin/check`, {
                        credentials: "include",
                    });
                    if (adminRes.ok) {
                        const adminData = await adminRes.json();
                        setIsAdmin(adminData.isAdmin || false);
                    }
                } catch (e) {
                    // Not admin
                }
                setLoading(false);
            })
            .catch(() => {
                // Not authenticated, redirect to login
                router.push("/login");
            });
    }, [router]);

    const logout = async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            // Ignore errors
        }
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-500/20" />
                    <div className="h-4 w-32 rounded bg-white/10" />
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
            <div className="min-h-screen bg-black">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="lg:pl-64">
                    <div className="p-4 lg:p-8">{children}</div>
                </main>
                {/* Email Setup Popup - Priority over campaign popup */}
                <EmailSetupPopup onActiveChange={setEmailPopupActive} />
                {/* Campaign Launch Popup - Disabled when email popup is active */}
                <CampaignLaunchPopup disabled={emailPopupActive} />
            </div>
        </AuthContext.Provider>
    );
}

