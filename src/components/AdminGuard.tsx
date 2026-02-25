"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { selectCurrentUser } from "@/store/user/user.selector";
import { Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const currentUser = useSelector(selectCurrentUser);
    const isRehydrated = useSelector((state: any) => state._persist?.rehydrated);

    useEffect(() => {
        // Wait for Redux to finish loading from local storage
        if (isRehydrated) {
            if (!currentUser || !currentUser.isAdmin) {
                // If not logged in OR logged in but not an admin, kick them out
                router.replace("/");
            }
        }
    }, [currentUser, isRehydrated, router]);

    // Show a loader while checking permissions
    if (!isRehydrated || (currentUser && !currentUser.isAdmin === undefined)) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
            </div>
        );
    }

    // Only render children if user is verified as Admin
    return currentUser?.isAdmin ? <>{children}</> : null;
}