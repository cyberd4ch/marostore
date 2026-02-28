import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/utils/firebase/firebase.utils';

export async function GET(request: Request, { params }: { params: { uid: string } }) {
    try {
        const { uid } = params;

        if (!uid) {
            return NextResponse.json(
                { success: false, message: "User ID is required" },
                { status: 400 }
            );
        }

        // Query Firestore for orders matching this user's ID
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

        // If it's a Firestore index error, we format it so your frontend can read the link
        if (error.message.includes("failed: prefetch_ref_check")) {
            return NextResponse.json({
                success: false,
                errorType: "MISSING_INDEX",
                message: "Database requires an index.",
                link: error.message
            }, { status: 400 });
        }

        return NextResponse.json(
            { success: false, message: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}