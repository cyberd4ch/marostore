// components/AdminPanel/handle-promote.ts

import { auth } from '@/app/utils/firebase/firebase.utils';

export const handlePromote = async (uid: string) => {
    try {
        // 1. Tell Server to set the claim
        const response = await fetch('/api/admin/promote', { 
            method: 'POST', 
            body: JSON.stringify({ uid }) 
        });

        if (!response.ok) throw new Error('Promotion failed');

        // 2. Force-refresh the Firebase Token
        const user = auth.currentUser;
        if (user) {
            const newToken = await user.getIdToken(true); 

            // 3. CRITICAL: Update the cookie so Middleware sees the change!
            // Without this, the Middleware is still reading the OLD token from the cookie.
            document.cookie = `__session=${newToken}; path=/; Secure; SameSite=Strict`;
            
            // 4. Reload to trigger Middleware check
            window.location.reload();
        }
    } catch (error) {
        console.error("Failed to promote user:", error);
    }
};