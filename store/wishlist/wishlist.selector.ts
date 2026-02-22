import { createSelector } from 'reselect';
import { RootState } from '../store';

const selectWishlistReducer = (state: RootState) => state.wishlist || { wishlistItems: [] };

export const selectWishlistItems = createSelector(
    [selectWishlistReducer],
    (wishlist) => wishlist.wishlistItems
);

// This calculates the number of items for the badge
export const selectWishlistCount = createSelector(
    [selectWishlistItems],
    (wishlistItems) => wishlistItems.length
);