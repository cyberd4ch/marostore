import { NextResponse } from 'next/server';
import { auth, db } from '@/app/utils/firebase/firebase.utils';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// GET: Fetch all registered users
export async function GET() {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('email', 'asc'));
        const querySnapshot = await getDocs(q);
        
        const users = querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        }));

        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
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