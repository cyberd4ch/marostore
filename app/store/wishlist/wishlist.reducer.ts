import { WISHLIST_ACTION_TYPES, WishlistState } from './wishlist.types';
import { AnyAction } from 'redux';

const INITIAL_STATE: WishlistState = {
    wishlistItems: [],
};

export const wishlistReducer = (state = INITIAL_STATE, action: AnyAction): WishlistState => {
    switch (action.type) {
        case WISHLIST_ACTION_TYPES.SET_WISHLIST_ITEMS:
            return { ...state, wishlistItems: action.payload };
        default:
            return state;
    }
};