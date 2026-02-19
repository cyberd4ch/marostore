// src/lib/schemas.ts
import { z } from 'zod';

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

// Use in your API client with validation
export async function validatedApiFetch<T>(
    endpoint: AuthApiEndpoints,
    schema: z.Schema<T>,
    options?: RequestInit
): Promise<T> {
    const data = await apiFetch<T>(endpoint, options);
    return schema.parse(data);
}