'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import { auth } from '@/lib/utils/firebase/firebase.utils';
import { onAuthStateChanged } from 'firebase/auth';
import { checkUserSession } from '@/store/user/user.action';

// Internal component to handle auth side-effects that require Redux dispatch
const AuthSessionManager = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // 1. Tell Redux to check/sync the session via Saga
                dispatch(checkUserSession());
                
                // 2. Sync to Firestore via your API
                try {
                    await fetch('/api/user/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName || '',
                            photoURL: user.photoURL || '',
                        }),
                    });
                } catch (error) {
                    console.error('Network error during user sync:', error);
                }
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return <>{children}</>;
};

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthSessionManager>
                    {children}
                </AuthSessionManager>
            </PersistGate>
        </Provider>
    );
}