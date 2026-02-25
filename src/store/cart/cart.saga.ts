import { all, call, takeLatest, put, select } from 'typed-redux-saga';
import { USER_ACTION_TYPES } from '../user/user.types';
import { selectCurrentUser } from '../user/user.selector';
import { selectCartItems } from './cart.selector';
import { setCartItems } from './cart.action';

// 1. Worker Saga: Sync local cart to MongoDB
export function* syncCartOnLogin() {
    try {
        const currentUser = yield* select(selectCurrentUser);
        const localCartItems = yield* select(selectCartItems);

        if (currentUser && localCartItems.length > 0) {
            // Call your MongoDB sync endpoint
            const response = yield* call(fetch, '/api/cart/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    userId: currentUser.id, 
                    items: localCartItems 
                }),
            });

            const mergedCart = yield* call([response, response.json]);
            
            // Update Redux with the merged cart from the server
            yield* put(setCartItems(mergedCart.items));
        } else if (currentUser) {
            // If local cart is empty, fetch the user's existing cart from DB
            const response = yield* call(fetch, `/api/cart?userId=${currentUser.id}`);
            const userCart = yield* call([response, response.json]);
            yield* put(setCartItems(userCart.items || []));
        }
    } catch (error) {
        console.error("Cart sync failed", error);
    }
}

// 2. Watcher Sagas
export function* onSignInSuccess() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_IN_SUCCESS, syncCartOnLogin);
}

export function* cartSagas() {
    yield* all([call(onSignInSuccess)]);
}