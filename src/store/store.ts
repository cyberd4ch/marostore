import { configureStore, Middleware } from '@reduxjs/toolkit';
import { persistStore, persistCombineReducers } from 'redux-persist';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

// --- NEW STORAGE HANDLING ---
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
    return {
        getItem(_key: any) { return Promise.resolve(null); },
        setItem(_key: any, value: any) { return Promise.resolve(value); },
        removeItem(_key: any) { return Promise.resolve(); },
    };
};

const storage = typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();
// ----------------------------

import { rootSaga } from './root-saga';
import { userReducer } from './user/user.reducer';
import { categoriesReducer } from './categories/category.reducer';
import { cartReducer } from './cart/cart.reducer';
import { wishlistReducer } from './wishlist/wishlist.reducer';

// 1. Persist configuration (only 'cart' is persisted)
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart', 'wishlist'],
};

// 2. Combine reducers with persistence
const persistedReducer = persistCombineReducers<any, any>(persistConfig, {
    user: userReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
});



// 3. Create saga middleware instance
const sagaMiddlewareInstance = createSagaMiddleware();
// Cast to Redux Toolkit's Middleware type for the middleware array
const sagaMiddleware = sagaMiddlewareInstance as unknown as Middleware;

// 4. Build middleware array – now all are type Middleware
const middlewares: Middleware[] = [sagaMiddleware];

if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger);
}

// 5. Configure store with Redux Toolkit
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: false,
            serializableCheck: false,
        }).concat(...middlewares),
    devTools: process.env.NODE_ENV !== 'production',
});

// 6. Run saga using the original instance
sagaMiddlewareInstance.run(rootSaga);

// 7. Create persistor
export const persistor = persistStore(store);

// 8. Infer RootState
export type RootState = ReturnType<typeof store.getState>;