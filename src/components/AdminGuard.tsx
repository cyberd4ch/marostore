'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, getUserDocument } from '../app/utils/firebase/firebase.utils';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                // No user logged in, send to auth page
                router.push('/auth');
                setStatus('unauthorized');
                return;
            }

            try {
                // Fetch the user document to check isAdmin
                const userDoc = await getUserDocument(user.uid);

                if (userDoc && userDoc.isAdmin) {
                    setStatus('authorized');
                } else {
                    // Logged in but NOT an admin
                    console.warn("Access denied: User is not an admin");
                    router.push('/');
                    setStatus('unauthorized');
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
                router.push('/');
                setStatus('unauthorized');
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (status === 'loading') {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
                    <p className="font-bold text-slate-500 animate-pulse">Verifying Admin Access...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthorized') {
        return null; // Prevents flashing of admin content while redirecting
    }

    return <>{children}</>;
}