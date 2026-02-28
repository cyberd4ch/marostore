import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/utils/firebase/firebase.utils';

// Define the context type for Next.js 16 (params is a Promise)
type RouteContext = {
    params: Promise<{ uid: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
    try {
        // 1. Await the params (Required in Next.js 15/16)
        const { uid } = await context.params;

        if (!uid) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        // 2. Query Firestore
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", uid));
        const snapshot = await getDocs(q);

        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, orders }, { status: 200 });

    } catch (error: any) {
        console.error("API Orders Error:", error);

        // Handle Firestore index errors
        if (error.message?.includes("index")) {
            return NextResponse.json({
                success: false,
                errorType: "MISSING_INDEX",
                message: "Database index required.",
                link: error.message
            }, { status: 400 });
        }

        return NextResponse.json(
            { success: false, message: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}