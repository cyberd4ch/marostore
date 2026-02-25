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
            // Case 1: No user is logged in
            if (!user) {
                setStatus('unauthorized');
                return;
            }

            try {
                // Case 2: Check Firestore for isAdmin flag
                const userDoc = await getUserDocument(user.uid);

                if (userDoc && userDoc.isAdmin) {
                    setStatus('authorized');
                } else {
                    // Logged in but NOT an admin
                    console.warn("Access denied: UID", user.uid, "is not an admin.");
                    setStatus('unauthorized');
                }
            } catch (error) {
                console.error("Admin verification error:", error);
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