// src/app/actions/auth.ts
'use server';

import { authApi } from '@/lib/api-client';
import { LoginRequestSchema } from '@/lib/schemas';
import { cookies } from 'next/headers';

export async function loginAction(formData: FormData) {
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    // Validate with Zod
    const validatedData = LoginRequestSchema.parse(rawData);

    try {
        // Call your API
        const response = await authApi.login(validatedData);

        // Store token in cookies
        const cookieStore = await cookies();
        cookieStore.set('auth_token', response.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return { success: true, token: response.token };
    } catch (error) {
        console.error('Login failed:', error);
        return { success: false, error: 'Invalid credentials' };
    }
}

export async function getProfileAction() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) {
            throw new Error('No authentication token');
        }

        const profile = await authApi.getProfile(token);
        return { success: true, profile };
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        return { success: false, error: 'Authentication required' };
    }
}