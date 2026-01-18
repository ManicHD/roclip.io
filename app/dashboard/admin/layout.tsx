"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../layout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            // Non-admins get redirected
            router.push("/dashboard");
        }
    }, [isAdmin, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-500/20" />
                    <div className="h-4 w-32 rounded bg-white/10" />
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-gray-400">Access denied</p>
            </div>
        );
    }

    return <>{children}</>;
}
