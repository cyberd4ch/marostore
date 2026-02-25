'use client';

import { useEffect, useState } from 'react';
// We no longer need useRouter since we are showing the UnauthorizedScreen instead of redirecting
import { auth, getUserDocument } from '@/app/utils/firebase/firebase.utils';
import { onAuthStateChanged } from 'firebase/auth';
import { LoadingScreen, UnauthorizedScreen } from './status-screens';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                console.log("GUARD: No user found");
                setStatus('unauthorized');
                return;
            }

            try {
                const userDoc = await getUserDocument(user.uid);
                console.log("GUARD: User Document Data ->", userDoc); // CHECK THIS IN CONSOLE

                if (userDoc && userDoc.isAdmin === true) {
                    console.log("GUARD: Access Granted");
                    setStatus('authorized');
                } else {
                    console.log("GUARD: Access Denied. isAdmin is:", userDoc?.isAdmin);
                    setStatus('unauthorized');
                }
            } catch (error) {
                console.error("GUARD: Error ->", error);
                setStatus('unauthorized');
            }
        });
        return () => unsubscribe();
    }, []);

    // 1. Show the branded loading state during checks
    if (status === 'loading') {
        return <LoadingScreen message="Verifying Admin Privileges..." />;
    }

    // 2. Show the "Restricted Area" UI if not authorized
    // This replaces the router.push logic to prevent the "Redirect Loop"
    if (status === 'unauthorized') {
        return <UnauthorizedScreen />;
    }

    // 3. Show the Dashboard if authorized
    return <>{children}</>;
}