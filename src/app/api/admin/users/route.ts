import { NextResponse } from 'next/server';
import { db } from '@/app/utils/firebase/firebase.utils';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';

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

// PATCH: Toggle admin status
export async function PATCH(req: Request) {
    try {
        const { uid, isAdmin } = await req.json();

        if (!uid) return NextResponse.json({ error: "UID required" }, { status: 400 });

        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, { isAdmin });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}