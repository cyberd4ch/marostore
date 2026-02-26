import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

// Add NextRequest to the import list
import { NextRequest } from 'next/server';

export async function GET(
    request: NextRequest,
    // In Next.js 15+, context must be the second argument and params is a Promise
    { params }: { params: Promise<{ uid: string }> }
) {
    try {
        // 1. Properly await the params
        const { uid } = await params;

        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Missing Auth Token" }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Security check
        if (decodedToken.uid !== uid) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        // 2. Query Firestore
        const ordersSnapshot = await adminDb
            .collection('orders')
            .where('userId', '==', uid)
            .orderBy('createdAt', 'desc')
            .get();

        const orders = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, orders }, { status: 200 });

    } catch (error: any) {
        console.error("FETCH_USER_ORDERS_ERROR:", error);

        // Error code 9 is specifically for missing indexes in Firebase Admin
        if (error.code === 9 || error.message?.includes('FAILED_PRECONDITION')) {
            return NextResponse.json({
                success: false,
                errorType: "MISSING_INDEX",
                message: "Database index is being built. Please try again in a few minutes.",
                link: error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)?.[0]
            }, { status: 500 });
        }

        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}