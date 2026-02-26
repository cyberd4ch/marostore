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
export const adminAuth = admin.auth();

export async function verifyAdminStatus(token: string): Promise<boolean> {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        console.log("Checking Admin for UID:", decodedToken.uid);
        const uid = decodedToken.uid;

        // Check Firestore for the isAdmin flag
        const userDoc = await adminDb.collection('users').doc(uid).get();
        console.log("User Data Found:", userDoc.data());
        if (!userDoc.exists) return false;

        return userDoc.data()?.isAdmin === true;
    } catch (error) {
        console.error('Error verifying admin:', error);
        return false;
    }
}