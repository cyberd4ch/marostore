import { adminAuth, adminDb } from '@/lib/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { uid: string } }
) {
    try {
        const { uid } = params; // Extract UID first
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Missing Auth Token" }, { status: 401 });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        
        // Ensure requested UID matches the token UID (Security)
        if (decodedToken.uid !== uid) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}