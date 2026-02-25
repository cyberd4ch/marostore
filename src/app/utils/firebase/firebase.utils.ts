import { initializeApp } from "firebase/app";
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
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    query,
    getDocs,
    QueryDocumentSnapshot,
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

// const config = {
//   databaseURL: 'https://crwn-fashion-clothing-db.firebaseio.com',
//   measurementId: 'G-V6BJ556WCR',
// };

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
    prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
    signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
    signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

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
): Promise<QueryDocumentSnapshot<UserData> | undefined> => {
    if (!userAuth) return;

    const userDocRef = doc(db, "users", userAuth.uid);
    let userSnapshot = await getDoc(userDocRef);

    // If user doesn't exist, create it
    if (!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        const adminEmails = ['lewisrodney21@yahoo.com']; // add others as needed
        const isAdmin = adminEmails.includes(email || '');

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                isAdmin,
                ...additionalInformation,
            });

            // RE-FETCH: After creating the doc, fetch the new snapshot
            userSnapshot = await getDoc(userDocRef);
        } catch (error) {
            console.log("error creating the user", error);
        }
    }

    // Always return the most current snapshot available
    return userSnapshot as QueryDocumentSnapshot<UserData>;
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
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
        return userSnapshot.data(); // This contains the isAdmin field
    }
    return null;
};