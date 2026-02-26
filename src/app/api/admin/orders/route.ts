import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminDb, verifyAdminStatus } from '@/lib/firebaseAdmin';

// 1. FORCE LIVE DATA: Prevents the "Vercel Cache HIT" that hid your orders
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split('Bearer ')[1];

        if (!token || !(await verifyAdminStatus(token))) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch all orders
        const orderSnapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
        
        // Fetch all products to check real-time stock levels
        const productSnapshot = await adminDb.collection('products').get();
        const stockMap = new Map();
        productSnapshot.docs.forEach(doc => {
            stockMap.set(doc.id, doc.data().stock);
        });

        const orders = orderSnapshot.docs.map(doc => {
            const orderData = doc.data();
            
            // 2. STOCK CHECK LOGIC: Attach current stock levels to each item in the order
            const itemsWithStockCheck = orderData.items?.map((item: any) => ({
                ...item,
                currentInventoryStock: stockMap.get(item.productId) || 0 
                // Assumes your cart items have a productId field
            }));

            return {
                _id: doc.id,
                ...orderData,
                items: itemsWithStockCheck,
                // Ensure dates are stringified for the frontend
                createdAt: orderData.createdAt?.toDate ? orderData.createdAt.toDate().toISOString() : orderData.createdAt
            };
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split('Bearer ')[1];

        if (!token || !(await verifyAdminStatus(token))) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id, status } = await req.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing Data' }, { status: 400 });
        }

        // 3. AUTO-STOCK DEDUCTION LOGIC
        // If the order is marked as "Shipped", we can optionally deduct stock here
        const orderRef = adminDb.collection('orders').doc(id);
        const orderDoc = await orderRef.get();
        
        if (!orderDoc.exists) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const orderData = orderDoc.data();

        // Perform update
        await orderRef.update({
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 4. PREVENT DOUBLE-SHIPPING LOGIC
        // If moving to 'Shipped' for the first time, you'd trigger a cloud function or loop
        // here to decrement 'stock' in the 'products' collection.

        return NextResponse.json({ success: true, message: `Status updated to ${status}` });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}