import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
    try {
        // 1. Get user data from request body
        const body = await req.json();
        console.log("SYNC ATTEMPT BODY:", body);
        console.log("DEBUG SYNC BODY:", JSON.stringify(body));
        const { email, uid, displayName, photoURL } = body;

        if (!uid || !email) {
            return NextResponse.json(
                { error: "UID and Email are required for sync" }, 
                { status: 400 }
            );
        }

        const userRef = adminDb.collection('users').doc(uid);
        const userDoc = await userRef.get();

        // 2. Prepare update data
        const userData = {
            email,
            displayName: displayName || email.split('@')[0],
            photoURL: photoURL || '',
            lastLogin: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        if (!userDoc.exists) {
            // Create new user if they don't exist
            await userRef.set({
                ...userData,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                isAdmin: false, // Default to false for new users
            });
        } else {
            // Update existing user (don't overwrite isAdmin or createdAt)
            await userRef.update(userData);
        }

        return NextResponse.json({ success: true, message: "User synced to Firestore" });
    } catch (error: any) {
        console.error("User Sync Error (Firestore):", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" }, 
            { status: 500 }
        );
    }
}