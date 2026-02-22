import { WISHLIST_ACTION_TYPES } from './wishlist.types';
import { CategoryItem } from '../categories/category.types';

const toggleWishlistItem = (wishlistItems: CategoryItem[], product: CategoryItem) => {
    const existingItem = wishlistItems.find((item) => item.id === product.id);

    if (existingItem) {
        return wishlistItems.filter((item) => item.id !== product.id);
    }

    return [...wishlistItems, product];
};

export const toggleItemInWishlist = (wishlistItems: CategoryItem[], product: CategoryItem) => ({
    type: WISHLIST_ACTION_TYPES.SET_WISHLIST_ITEMS,
    payload: toggleWishlistItem(wishlistItems, product),
});