import { NextResponse } from 'next/server';
import { db } from '@/app/utils/firebase/firebase.utils';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';

import { adminAuth, adminDb, verifyAdminStatus } from '@/lib/firebaseAdmin';

import { revalidatePath } from 'next/cache';


async function checkAdminStatus(req: Request) {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return null;
    try {
        // USE adminAuth HERE, not the function name!
        const decoded = await adminAuth.verifyIdToken(token);
        return decoded.admin ? decoded : null;
    } catch (error) {
        console.error("Auth Error:", error);
        return null;
    }
}

async function isAuthorized(req: Request) {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return false;
    return await verifyAdminStatus(token);
}

export async function GET() {
    try {
        // Use Admin SDK to bypass all client-side security rules
        const querySnapshot = await adminDb.collection('products').orderBy('createdAt', 'desc').get();

        const products = querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // 1. CHECK SECURITY
        const authorized = await isAuthorized(req);
        if (!authorized) {
            return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
        }

        const data = await req.json();

        // 2. FORMAT DATA
        const newProduct = {
            name: data.name,
            price: Number(data.price),
            stock: Number(data.stock) || 0,
            imageUrl: data.imageUrl,
            category: data.category || '',
            status: data.status || 'published',
            activationDate: data.activationDate || null,
            createdAt: new Date(), // Admin SDK uses standard JS Dates
        };

        // 3. SAVE TO FIRESTORE
        const docRef = await adminDb.collection('products').add(newProduct);
        revalidatePath('/shop');
        revalidatePath('/');
        
        return NextResponse.json({ _id: docRef.id, ...newProduct, message: "Success" });

    } catch (error: any) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        // 1. CHECK SECURITY
        const authorized = await isAuthorized(req);
        if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const data = await req.json();
        const { id, ...updateData } = data;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        // 2. FORMAT DATA
        const cleanedData = {
            ...updateData,
            price: Number(updateData.price),
            stock: Number(updateData.stock) || 0,
            updatedAt: new Date()
        };

        // Remove the id from the actual data payload
        delete cleanedData.id;

        // 3. UPDATE FIRESTORE
        await adminDb.collection('products').doc(id).update(cleanedData);

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        // 1. CHECK SECURITY
        const authorized = await isAuthorized(req);
        if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        // 2. DELETE FROM FIRESTORE
        await adminDb.collection('products').doc(id).delete();
        
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}