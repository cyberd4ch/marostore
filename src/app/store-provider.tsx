"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { onAuthStateChangedListener } from "@/app/utils/firebase/firebase.utils";
import { checkUserSession } from "@/store/user/user.action";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <AuthListener>
                    {children}
                </AuthListener>
            </PersistGate>
        </Provider>
    );
};

// Internal component to handle the side effect
const AuthListener = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            if (user) {
                // When Firebase detects a user session, tell Redux to sync
                dispatch(checkUserSession());
            }
        });

        return unsubscribe; // Clean up the listener on unmount
    }, [dispatch]);

    return <>{children}</>;
};