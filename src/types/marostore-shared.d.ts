// src/types/marostore-shared.d.ts
declare module '@marostore/shared' {
    export interface LoginRequest { email: string; password: string; }
    export interface LoginResponse { token: string; }
    export interface ProfileResponse { id: string; name: string; email: string; }
    export interface ValidateTokenResponse { valid: boolean; }
    export type AuthApiEndpoints = 'LOGIN' | 'VALIDATE' | 'PROFILE';

    // Updated to use environment variable
    export function getAuthApiUrl(endpoint: AuthApiEndpoints): string;
}