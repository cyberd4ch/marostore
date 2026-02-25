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

// GET: Fetch all products
export async function GET() {
    try {
        const productsRef = collection(db, 'products');
        // Ordering by createdAt so newest items appear first
        const q = query(productsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const products = querySnapshot.docs.map(doc => ({
            _id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(products);
    } catch (error: any) {
        console.error("GET Products Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(req: Request) {
    try {
        const data = await req.json();
        const productsRef = collection(db, 'products');
        
        const newProduct = {
            name: data.name,
            price: Number(data.price),
            imageUrl: data.imageUrl,
            category: data.category || '',
            createdAt: serverTimestamp(), // Use Firestore server time
        };

        const docRef = await addDoc(productsRef, newProduct);
        return NextResponse.json({ _id: docRef.id, ...newProduct });
    } catch (error: any) {
        console.error("POST Product Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

// PUT: Update an existing product
export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const { id, ...updateData } = data;

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const productDocRef = doc(db, 'products', id);
        
        // Ensure price is saved as a number
        if (updateData.price) {
            updateData.price = Number(updateData.price);
        }

        await updateDoc(productDocRef, {
            ...updateData,
            updatedAt: serverTimestamp()
        });

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error("PUT Product Error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}

// DELETE: Remove a product
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const productDocRef = doc(db, 'products', id);
        await deleteDoc(productDocRef);

        return NextResponse.json({ success: true, message: "Product deleted" });
    } catch (error: any) {
        console.error("DELETE Product Error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}