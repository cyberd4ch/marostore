import { AnyAction } from 'redux';
import { setCartItems, setIsCartOpen, clearAllItemsFromCart } from './cart.action';

import { CartItem } from './cart.types';

export type CartState = {
    readonly isCartOpen: boolean;
    readonly cartItems: CartItem[];
};

export const CART_INITIAL_STATE: CartState = {
    isCartOpen: false,
    cartItems: [],
};

export const cartReducer = (
    state = CART_INITIAL_STATE,
    action: AnyAction
): CartState => {
    if (setIsCartOpen.match(action)) {
        return { ...state, isCartOpen: action.payload };
    }

    if (setCartItems.match(action)) {
        return { ...state, cartItems: action.payload };
    }
    
    // Reset cart on logout to prevent data leakage between users
    if (clearAllItemsFromCart.match(action)) {
        return { ...state, cartItems: [] };
    }

    return state;
};