// src/lib/api-client.ts
import {
    LoginRequest,
    LoginResponse,
    ProfileResponse,
    ValidateTokenResponse,
    AuthApiEndpoints,
    getAuthApiUrl
} from '@marostore/shared';

// Custom fetch wrapper for Next.js App Router
export async function apiFetch<T>(
    endpoint: AuthApiEndpoints,
    options?: RequestInit
): Promise<T> {
    const url = getAuthApiUrl(endpoint);

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error (${endpoint}): ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

// Type-safe API methods
export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        return apiFetch<LoginResponse>('LOGIN', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    getProfile: async (token: string): Promise<ProfileResponse> => {
        return apiFetch<ProfileResponse>('PROFILE', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    validateToken: async (token: string): Promise<ValidateTokenResponse> => {
        return apiFetch<ValidateTokenResponse>('VALIDATE', {
            method: 'POST',
            body: JSON.stringify({ token }),
        });
    },
};