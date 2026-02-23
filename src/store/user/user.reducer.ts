import { AnyAction } from 'redux';

import { UserData } from './user.types';

import {
    signInFailed,
    signUpFailed,
    signOutFailed,
    signOutSuccess,
    signInSuccess,
    setGuestEmail,
} from './user.action';


export type UserState = {
readonly currentUser: UserData | null;
readonly guestEmail: string | null;
    readonly isLoading: boolean;
    readonly error: Error | null;
};

const INITIAL_STATE: UserState = {
    currentUser: null,
    guestEmail: null,
    isLoading: false,
    error: null,
};

export const userReducer = (state = INITIAL_STATE, action: AnyAction): UserState => {
    if (signInSuccess.match(action)) {
        return { 
            ...state, 
            currentUser: action.payload as UserData 
        };
    }

    // Add this block for Guest Email
    if (setGuestEmail.match(action)) {
        return { ...state, guestEmail: action.payload };
    }

    if (signOutSuccess.match(action)) {
        return { ...state, currentUser: null, guestEmail: null }; // Optional: clear guest email on sign out
    }

    if (
        signInFailed.match(action) ||
        signUpFailed.match(action) ||
        signOutFailed.match(action)
    ) {
        return { ...state, error: action.payload };
    }

    return state;
};