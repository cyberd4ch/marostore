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

export async function GET() {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, orderBy('createdAt', 'desc'));
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
        const adminUser = await checkAdminStatus(req);
        if (!adminUser) {
            return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
        }
        const data = await req.json();
        const productsRef = collection(db, 'products');

        const newProduct = {
            name: data.name,
            price: Number(data.price),
            stock: Number(data.stock) || 0, // Ensure stock is a Number
            imageUrl: data.imageUrl,
            category: data.category || '',
            createdAt: new Date(),
        };

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
        const data = await req.json();
        const { id, ...updateData } = data;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const productDocRef = doc(db, 'products', id);

        // Clean up data before saving
        const cleanedData = {
            ...updateData,
            price: Number(updateData.price),
            stock: Number(updateData.stock) || 0, // Ensure stock is a Number
            updatedAt: serverTimestamp()
        };

        // Remove the id from the actual data payload to avoid self-reference in document
        delete cleanedData.id;

        await updateDoc(productDocRef, cleanedData);

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await deleteDoc(doc(db, 'products', id));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}