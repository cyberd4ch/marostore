'use client';
import { useEffect } from 'react';
import { register } from '@/app/utils/serviceWorkerRegistration';

export default function ServiceWorkerRegistrar() {
    useEffect(() => {
        register();
    }, []);
    return null;
}