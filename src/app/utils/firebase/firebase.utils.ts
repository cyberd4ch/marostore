import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    NextOrObserver,
    User,
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    query,
    getDocs,
    QueryDocumentSnapshot,
    initializeFirestore // Import this
} from "firebase/firestore";

import { Category } from "../../../store/categories/category.types";

const firebaseConfig = {
    apiKey: "AIzaSyBDVHNvtx_cO9HeF95vI9U5RHr4rvucwkc",
    authDomain: "maros-8d7b1.firebaseapp.com",
    projectId: "maros-8d7b1",
    storageBucket: "maros-8d7b1.firebasestorage.app",
    messagingSenderId: "312394954094",
    appId: "1:312394954094:web:a38f7def7c607512a93d7f",
    measurementId: "G-8E2RJ2Z255"
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true,
});



export const storage = getStorage(firebaseApp); // Added export
export const auth = getAuth(firebaseApp);
// const config = {
//   databaseURL: 'https://crwn-fashion-clothing-db.firebaseio.com',
//   measurementId: 'G-V6BJ556WCR',
// };


const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });


export const signInWithGooglePopup = () =>
    signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
    signInWithRedirect(auth, googleProvider);


export type ObjectToAdd = {
    title: string;
};

export const addCollectionAndDocuments = async <T extends ObjectToAdd>(
    collectionKey: string,
    objectsToAdd: T[]
): Promise<void> => {
    const collectionRef = collection(db, collectionKey);
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef, object.title.toLowerCase());
        batch.set(docRef, object);
    });

    await batch.commit();
    console.log("done");
};

export const getCategoriesAndDocuments = async (): Promise<Category[]> => {
    const collectionRef = collection(db, "categories");
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
        (docSnapshot) => docSnapshot.data() as Category
    );
};

export type AdditionalInformation = {
    displayName?: string;
};

export type UserData = {
    createdAt: Date;
    displayName: string;
    email: string;
};

export const createUserDocumentFromAuth = async (
    userAuth: User,
    additionalInformation = {} as AdditionalInformation
) => {
    if (!userAuth) return;

    const userDocRef = doc(db, "users", userAuth.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        // Check if the user should be an admin based on email
        const adminEmails = ['lewisrodney21@yahoo.com']; 
        const isAdmin = adminEmails.includes(email || '');

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                isAdmin,
                uid: userAuth.uid, // Storing UID in the doc helps the sync route
                ...additionalInformation,
            });
        } catch (error) {
            console.log("error creating the user", error);
        }
    }

    return userSnapshot;
};

export const createAuthUserWithEmailAndPassword = async (
    email: string,
    password: string
) => {
    if (!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (
    email: string,
    password: string
) => {
    if (!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback: NextOrObserver<User>) =>
    onAuthStateChanged(auth, callback);

export const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (userAuth) => {
                unsubscribe();
                resolve(userAuth);
            },
            reject
        );
    });
};

export const getUserDocument = async (uid: string) => {
    if (!uid) return null;
    try {
        const userDocRef = doc(db, "users", uid);
        const userSnapshot = await getDoc(userDocRef);
        
        if (userSnapshot.exists()) {
            return userSnapshot.data(); 
        }
    } catch (error) {
        console.error("Error fetching user document:", error);
    }
    return null;
};