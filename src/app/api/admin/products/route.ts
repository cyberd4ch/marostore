import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminDb, verifyAdmin } from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    // 1. Verify Admin Status via Firebase Token
    if (!token || !(await verifyAdmin(token))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Inside GET function in app/api/admin/products/route.ts
    try {
        const snapshot = await adminDb.collection('products').orderBy('createdAt', 'desc').get();

        // CHANGED: Ensure 'id' is mapped to '_id' for frontend compatibility
        const products = snapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token || !(await verifyAdmin(token))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        // 3. Save to Firestore
        const docRef = await adminDb.collection('products').add({
            ...body,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ id: docRef.id, success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token || !(await verifyAdmin(token))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await adminDb.collection('products').doc(id).delete();
    return NextResponse.json({ success: true });
}