import { NextResponse } from 'next/server';
import { auth, db } from '@/app/utils/firebase/firebase.utils';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// GET: Fetch all registered users
export async function GET(req: Request) {
    try {
        // 1. Verify the requester is actually an Admin
        const token = req.headers.get('Authorization')?.split('Bearer ')[1];
        const decoded = await adminAuth.verifyIdToken(token!);
        if (!decoded.admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        // 2. Fetch from Firestore
        const snapshot = await adminDb.collection('users').orderBy('email').get();
        const users = snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

export async function PATCH(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        const token = authHeader?.split('Bearer ')[1];

        if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

        // Verify the token using the ADMIN SDK
        const decodedToken = await adminAuth.verifyIdToken(token);

        if (!decodedToken.admin) {
            return NextResponse.json({ error: "Not an admin" }, { status: 403 });
        }

        const { uid, isAdmin } = await req.json();

        // 1. Update the Auth Token (The actual permission)
        await adminAuth.setCustomUserClaims(uid, { admin: isAdmin });

        // 2. Update Firestore (So your GET list reflects the change)
        await adminDb.collection('users').doc(uid).update({ isAdmin });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Fruit cake collapse" }, { status: 500 });
    }
}