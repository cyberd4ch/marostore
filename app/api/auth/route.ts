// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuthApiUrl } from '@marostore/shared';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        // Map action to endpoint
        const endpointMap: Record<string, string> = {
            login: 'LOGIN',
            validate: 'VALIDATE',
            profile: 'PROFILE',
        };

        const endpoint = endpointMap[action];
        if (!endpoint) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Proxy to your backend
        const response = await fetch(getAuthApiUrl(endpoint as any), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': request.headers.get('Authorization') || '',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        return NextResponse.json(result, {
            status: response.status,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },
        });
    } catch (error) {
        console.error('API proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}