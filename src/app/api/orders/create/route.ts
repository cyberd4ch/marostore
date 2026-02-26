import { adminDb } from '@/lib/firebaseAdmin'; // Ensure you have firebase-admin initialized
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            orderReference, 
            customerEmail, 
            items, 
            totalAmount, 
            userId, // Pass the UID from the frontend
            shippingAddress 
        } = body;

        // 1. Check if order already exists (Firestore query)
        const orderRef = adminDb.collection('orders').doc(orderReference);
        const doc = await orderRef.get();

        if (doc.exists) {
            return NextResponse.json({ message: 'Order already recorded' }, { status: 200 });
        }

        // 2. Create the Order object
        const newOrder = {
            orderReference,
            customerEmail,
            userId: userId || 'guest', // Associate with Firebase Auth UID
            items,
            totalAmount,
            shippingAddress: shippingAddress || 'N/A',
            paymentStatus: 'Paid',
            orderStatus: 'Processing',
            createdAt: new Date().toISOString(),
        };

        // 3. Save to Firestore
        await orderRef.set(newOrder);

        return NextResponse.json({ success: true, id: orderReference }, { status: 201 });
    } catch (error: any) {
        console.error("FIRESTORE_ORDER_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}