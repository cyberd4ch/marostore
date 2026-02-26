import { NextResponse } from 'next/server';
import { adminAuth, adminDb, verifyAdminStatus } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

async function isAuthorized(req: Request) {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) return false;
    return await verifyAdminStatus(token);
}

export async function GET(req: Request) {
    try {
        const authorized = await isAuthorized(req);
        let querySnapshot;

        if (authorized) {
            // Admin View: Get everything
            querySnapshot = await adminDb.collection('products')
                .orderBy('createdAt', 'desc')
                .get();
        } else {
            // Public View: Only get published. 
            // ⚠️ WARNING: If this crashes, you need a Firestore Index!
            querySnapshot = await adminDb.collection('products')
                .where('status', '==', 'published')
                .orderBy('createdAt', 'desc')
                .get();
        }

        const products = querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("GET Error details:", error.message);
        // Expose the actual error to the client so you know if it's an Index issue
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const authorized = await isAuthorized(req);
        if (!authorized) {
            return NextResponse.json({ error: "Unauthorized: Admins only" }, { status: 403 });
        }

        const data = await req.json();

        // BULLETPROOF DATA PARSING: Prevent crashes if fields are missing
        const newProduct = {
            name: data.name || 'Unnamed Product',
            price: Number(data.price) || 0,
            discountPrice: data.discountPrice ? Number(data.discountPrice) : null,
            stock: Number(data.stock) || 0,
            imageUrl: data.imageUrl || '',
            category: typeof data.category === 'string' ? data.category.trim().toLowerCase() : 'uncategorized',
            status: data.status === 'draft' ? 'draft' : 'published',
            brand: data.brand || '',
            sku: data.sku || '',
            colors: Array.isArray(data.colors) ? data.colors : [],
            sizes: Array.isArray(data.sizes) ? data.sizes : [],
            description: data.description || '',
            activationDate: data.activationDate || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const docRef = await adminDb.collection('products').add(newProduct);

        // Safely attempt to revalidate the shop page
        try {
            revalidatePath('/shop');
            revalidatePath('/');
        } catch (revalError) {
            console.warn("Revalidation skipped, path might not be static.");
        }
        
        return NextResponse.json({ _id: docRef.id, ...newProduct, message: "Success" });

    } catch (error: any) {
        console.error("POST Error details:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
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

        // Safely attempt to revalidate so edits appear instantly
        try {
            revalidatePath('/shop');
            revalidatePath('/');
        } catch (revalError) {
            console.warn("Revalidation skipped.");
        }

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
        
        // Safely attempt to revalidate so deleted items vanish instantly
        try {
            revalidatePath('/shop');
            revalidatePath('/');
        } catch (revalError) {
            console.warn("Revalidation skipped.");
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}