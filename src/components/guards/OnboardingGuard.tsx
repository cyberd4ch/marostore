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
            const user = currentUser as any;
            const hasFinishedOnboarding = user.onboardingCompleted === true && !!user.username;

            // If they are logged in but haven't finished onboarding
            if (!hasFinishedOnboarding) {
                // Stop them from going anywhere EXCEPT onboarding
                if (pathname !== '/onboarding') {
                    router.replace('/onboarding');
                }
            } else {
                // If they HAVE finished onboarding, stop them from going BACK to /onboarding
                if (pathname === '/onboarding') {
                    router.replace(`/u/${user.username}`);
                }
            }
        }
    }, [currentUser, isRehydrated, pathname, router]);

    return <>{children}</>;
}