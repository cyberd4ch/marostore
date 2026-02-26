import { adminAuth } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { uid } = await request.json();

    try {
        // Set custom user claims on an existing user
        await adminAuth.setCustomUserClaims(uid, { admin: true });

        return NextResponse.json({ message: `Success! User ${uid} is now an admin.` });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to set claims' }, { status: 500 });
    }
}