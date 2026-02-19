'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Elements } from '@stripe/react-stripe-js';
import { store, persistor } from '@/app/store/store';
import { stripePromise } from '@/app/utils/stripe/stripe.utils';
import SessionChecker from '@/app/session-checker'; // create this
import ServiceWorkerRegistrar from '@/app/service-worker-registrar'; // create this

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Elements stripe={stripePromise}>
                    <SessionChecker />
                    <ServiceWorkerRegistrar />
                    {children}
                </Elements>
            </PersistGate>
        </Provider>
    );
}