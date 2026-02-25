import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

// 1. Process the private key to handle Vercel's environment variable formatting
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1') 
    : undefined;

// 2. Initialize the Admin SDK using the processed key
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: privateKey,
        }),
    });
}

export const adminDb = getFirestore();

export async function verifyAdmin(token: string): Promise<boolean> {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Fetch user document from Firestore to check the isAdmin flag
        const userDoc = await adminDb.collection('users').doc(uid).get();
        if (!userDoc.exists) return false;

        const userData = userDoc.data();
        return userData?.isAdmin === true;
    } catch (error) {
        console.error('Error verifying admin:', error);
        return false;
    }
}