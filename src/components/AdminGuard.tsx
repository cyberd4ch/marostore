"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectCurrentUser } from "@/store/user/user.selector";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const currentUser = useSelector(selectCurrentUser);
    // Explicitly check if redux-persist has finished rehydrating
    const isRehydrated = useSelector((state: any) => state._persist?.rehydrated);

    useEffect(() => {
        if (isRehydrated) {
            // If rehydration is done and user is definitely not an admin
            if (!currentUser || currentUser.isAdmin !== true) {
                router.replace("/");
            }
        }
    }, [currentUser, isRehydrated, router]);

    // Show loader while rehydrating OR while we don't have user data yet
    if (!isRehydrated) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
            </div>
        );
    }

    // Only render children if user is verified as Admin in the store
    return currentUser?.isAdmin ? <>{children}</> : null;
}