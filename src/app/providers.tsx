'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';

// Firebase imports
import { auth } from '@/app/utils/firebase/firebase.utils';
import { onAuthStateChanged } from 'firebase/auth';

import SessionChecker from '@/app/session-checker'; 
import ServiceWorkerRegistrar from '@/app/service-worker-registrar'; 

export function Providers({ children }: { children: React.ReactNode }) {
    
    // Auth Sync Logic
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                    };

                    await fetch('/api/user/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData),
                    });
                    
                    console.log('User synced successfully to Firestore');
                } catch (error) {
                    console.error('Network error during user sync:', error);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SessionChecker />
                <ServiceWorkerRegistrar />
                {children}
            </PersistGate>
        </Provider>
    );
}