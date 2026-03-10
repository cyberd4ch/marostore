import { NextResponse } from 'next/server';
import { adminDb, verifyAdminStatus } from '@/lib/firebaseAdmin';
import { revalidatePath } from 'next/cache';

/**
 * IMPROVED AUTH HELPER
 * Wrapped in try/catch to ensure malformed tokens don't crash the route.
 */
async function isAuthorized(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!token) return false;
        return await verifyAdminStatus(token);
    } catch (error) {
        console.error("Auth verification failed:", error);
        return false;
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryFilter = searchParams.get('category');

        const authorized = await isAuthorized(req);
        let query;

        if (authorized) {
            // ADMIN VIEW: See everything (Drafts + Published)
            query = adminDb.collection('products').orderBy('createdAt', 'desc');
        } else {
            // PUBLIC VIEW: Only see published items
            // NOTE: This compound query requires a Composite Index in Firebase Console
            query = adminDb.collection('products')
                .where('status', '==', 'published');

            if (categoryFilter) {
                query = query.where('category', '==', categoryFilter.toLowerCase());
            }

            query = query.orderBy('createdAt', 'desc');
        }

        const querySnapshot = await query.get();
        const products = querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("GET Error details:", error.message);
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

        /**
         * EXPLICIT DATA MAPPING
         * We ignore any 'id' or extra junk sent by the frontend to keep the doc clean.
         */
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
            createdAt: new Date(), // Server-side timestamp
            updatedAt: new Date(),
        };

        const docRef = await adminDb.collection('products').add(newProduct);

        try {
            revalidatePath('/shop');
            revalidatePath('/');
        } catch (revalError) {
            console.warn("Revalidation skipped.");
        }
        
        return NextResponse.json({ _id: docRef.id, ...newProduct, message: "Success" });

    } catch (error: any) {
        console.error("POST Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const authorized = await isAuthorized(req);
        if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const data = await req.json();
        
        // Destructure 'id' out so it's not accidentally saved inside the document fields
        const { id, ...updateData } = data;

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        /**
         * SCHEMA-BASED UPDATE
         * We explicitly pick only the fields allowed to be updated.
         * This prevents UI-only state from being saved to your database.
         */
        const cleanedData = {
            name: updateData.name,
            price: Number(updateData.price),
            discountPrice: updateData.discountPrice ? Number(updateData.discountPrice) : null,
            category: updateData.category?.trim().toLowerCase(),
            stock: Number(updateData.stock) || 0,
            status: updateData.status,
            imageUrl: updateData.imageUrl,
            brand: updateData.brand || '',
            sku: updateData.sku || '',
            colors: Array.isArray(updateData.colors) ? updateData.colors : [],
            sizes: Array.isArray(updateData.sizes) ? updateData.sizes : [],
            description: updateData.description || '',
            activationDate: updateData.activationDate || null,
            updatedAt: new Date() // Always refresh the timestamp on the server
        };

        await adminDb.collection('products').doc(id).update(cleanedData);

        try {
            revalidatePath('/shop');
            revalidatePath('/');
        } catch (revalError) {
            console.warn("Revalidation skipped.");
        }

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error("PUT Error:", error.message);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const authorized = await isAuthorized(req);
        if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await adminDb.collection('products').doc(id).delete();
        
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