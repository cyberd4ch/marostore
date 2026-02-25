export enum USER_ACTION_TYPES {
    SET_CURRENT_USER = 'user/SET_CURRENT_USER',
    SET_GUEST_EMAIL = 'user/SET_GUEST_EMAIL',
    CHECK_USER_SESSION = 'user/CHECK_USER_SESSION',
    GOOGLE_SIGN_IN_START = 'user/GOOGLE_SIGN_IN_START',
    EMAIL_SIGN_IN_START = 'user/EMAIL_SIGN_IN_START',
    SIGN_IN_SUCCESS = 'user/SIGN_IN_SUCCESS',
    SIGN_IN_FAILED = 'user/SIGN_IN_FAILED',
    SIGN_UP_START = 'user/SIGN_UP_START',
    SIGN_UP_SUCCESS = 'user/SIGN_UP_SUCCESS',
    SIGN_UP_FAILED = 'user/SIGN_UP_FAILED',
    SIGN_OUT_START = 'user/SIGN_OUT_START',
    SIGN_OUT_SUCCESS = 'user/SIGN_OUT_SUCCESS',
    SIGN_OUT_FAILED = 'user/SIGN_OUT_FAILED',
};

// Add this interface
export type UserData = {
    id: string;
    email: string;
    displayName: string;
    createdAt: any;
    // Add these fields to match MongoDB + Onboarding
    username?: string;
    isAdmin?: boolean;
    onboardingCompleted?: boolean;
    phoneNumber?: string;
    address?: string;
    city?: string;
};