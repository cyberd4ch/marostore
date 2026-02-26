import { takeLatest, put, all, call } from 'typed-redux-saga';
import { User } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore'; // Added doc

import { USER_ACTION_TYPES } from './user.types';
import { db } from '../../app/utils/firebase/firebase.utils'; // Ensure db is imported

import {
    signInSuccess,
    signInFailed,
    signOutSuccess,
    signOutFailed,
} from './user.action';

import {
    createUserDocumentFromAuth,
    signOutUser,
    AdditionalInformation,
} from '../../app/utils/firebase/firebase.utils';

export function* getSnapshotFromUserAuth(
    userAuth: User,
    additionalDetails?: AdditionalInformation
) {
    try {
        // 1. Sync/Create Firestore Document
        // This utility ensures the user exists in your 'users' collection
        yield* call(createUserDocumentFromAuth, userAuth, additionalDetails);

        // 2. Fetch the fresh document from Firestore
        const userDocRef = doc(db, "users", userAuth.uid);
        const updatedSnapshot = yield* call(getDoc, userDocRef);

        if (updatedSnapshot.exists()) {
            const userData = {
                id: updatedSnapshot.id,
                ...updatedSnapshot.data(),
            } as any;

            // 3. BULLETPROOF COOKIE SYNC
            // This allows your Next.js Middleware to read the session & onboarding status
            if (typeof window !== 'undefined') {
                // Get the cryptographically signed JWT from Firebase
                const token = yield* call([userAuth, "getIdToken"]);
                
                // Check if onboarding is complete (matching your Firestore field name)
                const onboardingStr = String(userData.onboardingCompleted === true || userData.username !== undefined);
                
                document.cookie = `__session=${token}; path=/; SameSite=Strict; Secure`;
                document.cookie = `onboardingCompleted=${onboardingStr}; path=/; SameSite=Strict; Secure`;
            }

            yield* put(signInSuccess(userData));
        }
    } catch (error) {
        console.error("Auth Saga Error:", error);
        yield* put(signInFailed(error as Error));
    }
}

export function* signOut() {
    try {
        yield* call(signOutUser);

        // Clear cookies so Middleware blocks access immediately
        if (typeof window !== 'undefined') {
            document.cookie = "__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
            document.cookie = "onboardingCompleted=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
        }

        yield* put(signOutSuccess());
    } catch (error) {
        yield* put(signOutFailed(error as Error));
    }
}