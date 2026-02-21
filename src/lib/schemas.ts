// src/lib/schemas.ts
import { z } from 'zod';

// Define the missing type locally
export type AuthApiEndpoints = 'LOGIN' | 'VALIDATE' | 'PROFILE';

export const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const LoginResponseSchema = z.object({
    token: z.string(),
});

export const ProfileResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
});

/**
 * Basic internal fetcher to replace the missing @marostore/shared version
 */
async function apiFetch<T>(endpoint: AuthApiEndpoints, options?: RequestInit): Promise<T> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    
    // Simple mapping to your API routes
    const pathMap: Record<AuthApiEndpoints, string> = {
        LOGIN: '/api/auth/login',
        VALIDATE: '/api/auth/validate',
        PROFILE: '/api/auth/profile',
    };

    const response = await fetch(`${baseUrl}${pathMap[endpoint]}`, options);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

// Use in your API client with validation
export async function validatedApiFetch<T>(
    endpoint: AuthApiEndpoints,
    schema: z.Schema<T>,
    options?: RequestInit
): Promise<T> {
    const data = await apiFetch<T>(endpoint, options);
    return schema.parse(data);
}