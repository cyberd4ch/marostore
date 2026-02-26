import { takeLatest, put, all, call } from 'typed-redux-saga';
import { User } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';

import { USER_ACTION_TYPES } from './user.types';
import { db } from '../../app/utils/firebase/firebase.utils';

import {
    signInSuccess,
    signInFailed,
    signUpSuccess,
    signUpFailed,
    signOutSuccess,
    signOutFailed,
    EmailSignInStart,
    SignUpStart,
    SignUpSuccess,
} from './user.action';

import {
    getCurrentUser,
    createUserDocumentFromAuth,
    signInWithGooglePopup,
    signInAuthUserWithEmailAndPassword,
    createAuthUserWithEmailAndPassword,
    signOutUser,
    AdditionalInformation,
} from '../../app/utils/firebase/firebase.utils';

/* --- WORKERS --- */

export function* getSnapshotFromUserAuth(
    userAuth: User,
    additionalDetails?: AdditionalInformation
) {
    try {
        yield* call(createUserDocumentFromAuth, userAuth, additionalDetails);
        const userDocRef = doc(db, "users", userAuth.uid);
        const updatedSnapshot = yield* call(getDoc, userDocRef);

        if (updatedSnapshot.exists()) {
            const userData = {
                id: updatedSnapshot.id,
                ...updatedSnapshot.data(),
            } as any;

            if (typeof window !== 'undefined') {
                const token = yield* call([userAuth, "getIdToken"]);
                const onboardingStr = String(userData.onboardingCompleted === true || userData.username !== undefined);
                
                document.cookie = `__session=${token}; path=/; SameSite=Strict; Secure`;
                document.cookie = `onboardingCompleted=${onboardingStr}; path=/; SameSite=Strict; Secure`;
            }

            yield* put(signInSuccess(userData));
        }
    } catch (error) {
        yield* put(signInFailed(error as Error));
    }
}

export function* signInWithGoogle() {
    try {
        const { user } = yield* call(signInWithGooglePopup);
        yield* call(getSnapshotFromUserAuth, user);
    } catch (error) {
        yield* put(signInFailed(error as Error));
    }
}

export function* signInWithEmail({ payload: { email, password } }: EmailSignInStart) {
    try {
        const userCredential = yield* call(signInAuthUserWithEmailAndPassword, email, password);
        if (userCredential) {
            yield* call(getSnapshotFromUserAuth, userCredential.user);
        }
    } catch (error) {
        yield* put(signInFailed(error as Error));
    }
}

// NEW: Sign Up Worker
export function* signUp({ payload: { email, password, displayName } }: SignUpStart) {
    try {
        const userCredential = yield* call(createAuthUserWithEmailAndPassword, email, password);
        if (userCredential) {
            const { user } = userCredential;
            // Dispatch success to trigger the auto-login watcher
            yield* put(signUpSuccess(user, { displayName }));
        }
    } catch (error) {
        yield* put(signUpFailed(error as Error));
    }
}

// NEW: Sign In After Sign Up Worker
export function* signInAfterSignUp({ payload: { user, additionalDetails } }: SignUpSuccess) {
    yield* call(getSnapshotFromUserAuth, user, additionalDetails);
}

export function* isUserAuthenticated() {
    try {
        const userAuth = yield* call(getCurrentUser);
        if (!userAuth) return;
        yield* call(getSnapshotFromUserAuth, userAuth);
    } catch (error) {
        yield* put(signInFailed(error as Error));
    }
}

export function* signOut() {
    try {
        yield* call(signOutUser);
        if (typeof window !== 'undefined') {
            document.cookie = "__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
            document.cookie = "onboardingCompleted=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure";
        }
        yield* put(signOutSuccess());
    } catch (error) {
        yield* put(signOutFailed(error as Error));
    }
}

/* --- WATCHERS --- */

export function* onGoogleSignInStart() {
    yield* takeLatest(USER_ACTION_TYPES.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
    yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onSignUpStart() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onCheckUserSession() {
    yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignOutStart() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

/* --- ROOT USER SAGA --- */

export function* userSagas() {
    yield* all([
        call(onCheckUserSession),
        call(onGoogleSignInStart),
        call(onEmailSignInStart),
        call(onSignUpStart),    // Added to root
        call(onSignUpSuccess),  // Added to root
        call(onSignOutStart),
    ]);
}