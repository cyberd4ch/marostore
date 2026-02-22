'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store';
import SessionChecker from '@/app/session-checker'; // create this
import ServiceWorkerRegistrar from '@/app/service-worker-registrar'; // create this

export function Providers({ children }: { children: React.ReactNode }) {
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