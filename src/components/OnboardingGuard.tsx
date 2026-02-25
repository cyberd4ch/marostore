"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { selectCurrentUser } from "@/store/user/user.selector";

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const currentUser = useSelector(selectCurrentUser);
    const isRehydrated = useSelector((state: any) => state._persist?.rehydrated);

    useEffect(() => {
        if (isRehydrated && currentUser) {
            // Force onboarding if they don't have a username and aren't already there
            if (!currentUser.username && pathname !== '/onboarding') {
                router.replace('/onboarding');
            }
        }
    }, [currentUser, isRehydrated, pathname, router]);

    return <>{children}</>;
}