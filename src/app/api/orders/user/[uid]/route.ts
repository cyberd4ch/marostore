import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ uid: string }> }
) {
    try {
        const { uid } = await params;
        const authHeader = request.headers.get('Authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);

        // Security: Ensure users only request their own orders
        if (decodedToken.uid !== uid) {
            return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
        }

        // NOTE: If this fails with a 'FAILED_PRECONDITION' error in logs, 
        // click the link in the error message to create the Firestore Index.
        const ordersSnapshot = await adminDb
            .collection('orders')
            .where('userId', '==', uid) 
            .orderBy('createdAt', 'desc')
            .get();

        const orders = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore Timestamp to ISO string for the frontend
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
        }));

        return NextResponse.json({ success: true, orders }, { status: 200 });

    } catch (error: any) {
        console.error("ORDER_API_ERROR:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}