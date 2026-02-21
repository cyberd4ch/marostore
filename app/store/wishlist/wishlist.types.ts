import { CategoryItem } from '../categories/category.types';

export enum WISHLIST_ACTION_TYPES {
    SET_WISHLIST_ITEMS = 'wishlist/SET_WISHLIST_ITEMS',
}

export type WishlistState = {
    readonly wishlistItems: CategoryItem[];
};