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
                setStatus('unauthorized');
                return;
            }

            // 1. Force permissions if it's your email
            if (user.email === 'lewisrodney21@yahoo.com') {
                try {
                    const { doc, setDoc } = await import('firebase/firestore');
                    const { db } = await import('@/app/utils/firebase/firebase.utils');
                    await setDoc(doc(db, "users", user.uid), {
                        isAdmin: true,
                        email: user.email,
                    }, { merge: true });
                    console.log("👑 Permissions Forced.");
                } catch (err) {
                    console.error("Auto-fix failed:", err);
                }
            }

            // 2. NOW fetch the document to update the UI status
            try {
                const userDoc = await getUserDocument(user.uid);
                if (userDoc?.isAdmin === true) {
                    setStatus('authorized');
                } else {
                    setStatus('unauthorized');
                }
            } catch (error) {
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