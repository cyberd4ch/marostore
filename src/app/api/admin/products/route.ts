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

export async function GET(req: Request) {
    try {
        // 1. Check if the user is an admin
        const authorized = await isAuthorized(req);

        let query;
        if (authorized) {
            // ADMIN VIEW: Fetch everything
            query = adminDb.collection('products').orderBy('createdAt', 'desc');
        } else {
            // PUBLIC VIEW: Only fetch 'published' items
            query = adminDb.collection('products')
                .where('status', '==', 'published')
                .orderBy('createdAt', 'desc');
        }

        const querySnapshot = await query.get();

        const products = querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // 1. SECURITY CHECK
        const authorized = await isAuthorized(req);
        if (!authorized) {
            return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
        }

        const data = await req.json();

        // 2. DATA SANITIZATION (The critical part for your Shop Page)
        const newProduct = {
            name: data.name,
            price: Number(data.price),
            discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
            stock: Number(data.stock) || 0,
            imageUrl: data.imageUrl,
            // FIX: Trim and Lowercase category to prevent "Shoes" vs "shoes" duplicates
            category: data.category ? data.category.trim().toLowerCase() : 'uncategorized',
            // FIX: Ensure status is strictly 'published' or 'draft'
            status: data.status === 'draft' ? 'draft' : 'published',
            // Extra metadata for the Shop Page
            brand: data.brand || '',
            sku: data.sku || '',
            colors: Array.isArray(data.colors) ? data.colors : [],
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
            description: data.description || '',
            activationDate: data.activationDate || null,
            createdAt: new Date(), 
            updatedAt: new Date(),
        };

        // 3. SAVE TO FIRESTORE
        const docRef = await adminDb.collection('products').add(newProduct);

        // 4. CACHE CLEARING
        // This forces Next.js to show the new product immediately on the live site
        revalidatePath('/shop');
        revalidatePath('/');
        
        return NextResponse.json({ 
            _id: docRef.id, 
            ...newProduct, 
            message: "Product successfully live." 
        });

    } catch (error: any) {
        console.error("POST Error:", error);
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