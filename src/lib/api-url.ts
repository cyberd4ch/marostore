// src/lib/api-urls.ts
import { AuthApiEndpoints } from '@marostore/shared';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const getAuthApiUrl = (endpoint: AuthApiEndpoints): string => {
    const endpointMap: Record<AuthApiEndpoints, string> = {
        LOGIN: `${API_BASE}/api/auth/login`,
        VALIDATE: `${API_BASE}/api/auth/validate`,
        PROFILE: `${API_BASE}/api/auth/profile`,
    };
    return endpointMap[endpoint];
};