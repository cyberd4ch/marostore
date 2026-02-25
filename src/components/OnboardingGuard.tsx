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

            // Check both the flag and the existence of a username
            const hasFinishedOnboarding = user.onboardingCompleted === true || !!user.username;

            // Step A: If NOT onboarded and NOT on the onboarding page, send them there
            if (!hasFinishedOnboarding && pathname !== '/onboarding') {
                router.replace('/onboarding');
            }

            // Step B: If ALREADY onboarded and trying to access /onboarding, kick them to profile
            if (hasFinishedOnboarding && pathname === '/onboarding') {
                router.replace(`/u/${user.username}`);
            }
        }
    }, [currentUser, isRehydrated, pathname, router]);

    return <>{children}</>;
}