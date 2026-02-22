// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, ...data } = body;

        // Map action to specific backend endpoints
        const endpointMap: Record<string, string> = {
            login: '/auth/login',
            validate: '/auth/validate',
            profile: '/auth/profile',
        };

        const path = endpointMap[action];
        if (!path) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Use an environment variable for the backend URL
        // Make sure to add NEXT_PUBLIC_API_URL to your Vercel Dashboard
       const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://marostore.vercel.app';
        const targetUrl = `${baseUrl}${path}`;

        const response = await fetch(targetUrl, {
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