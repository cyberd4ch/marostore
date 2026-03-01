import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/app/utils/firebase/firebase.utils';

type RouteContext = {
    params: Promise<{ uid: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const { uid } = await context.params;
        console.log(`📡 API received request for UID: ${uid}`);

        if (!uid) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const ordersRef = collection(db, "orders");
        
        // DEBUG: Let's check if the collection even exists/has data
        // We do a small "blind" fetch of 1 document to verify connection
        const testQuery = query(ordersRef, limit(1));
        const testSnap = await getDocs(testQuery);
        console.log(`connection check: ${testSnap.empty ? "Collection empty or unreachable" : "Connected to orders collection"}`);

        // 2. The Actual Query
        // IMPORTANT: Double-check if your field in Firestore is "userId" or "uid"
        const q = query(ordersRef, where("userId", "==", uid));
        const snapshot = await getDocs(q);

        console.log(`🔎 Found ${snapshot.docs.length} orders for UID: ${uid}`);

        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ 
            success: true, 
            orders,
            debug: { uidQueried: uid, count: orders.length } 
        }, { status: 200 });

    } catch (error: any) {
        console.error("🔥 API Orders Error:", error.message);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch orders" }, 
            { status: 500 }
        );
    }
}