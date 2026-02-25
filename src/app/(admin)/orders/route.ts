import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminDb, verifyAdmin } from '../../../lib/firebaseAdmin';

// GET: Fetch all orders for the Admin Logistics page
export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split('Bearer ')[1];

        // Security: Ensure only admins can fetch the order list
        if (!token || !(await verifyAdmin(token))) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!adminDb) {
            return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
        }

        // Fetch from Firestore 'orders' collection
        const snapshot = await adminDb
            .collection('orders')
            .orderBy('createdAt', 'desc')
            .get();

        const orders = snapshot.docs.map(doc => ({
            _id: doc.id, // Map Firestore ID to _id to keep your frontend working
            ...doc.data()
        }));

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error('Orders GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Update order status (Pending -> Shipped, etc.)
export async function PATCH(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split('Bearer ')[1];

        if (!token || !(await verifyAdmin(token))) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing Order ID or Status' }, { status: 400 });
        }

        // Update document in Firestore
        await adminDb!.collection('orders').doc(id).update({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({ success: true, message: 'Order status updated' });
    } catch (error: any) {
        console.error('Orders PATCH Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}