import { combineReducers } from 'redux';
import { wishlistReducer } from './wishlist/wishlist.reducer';

import { userReducer } from './user/user.reducer';
import { categoriesReducer } from './categories/category.reducer';
import { cartReducer } from './cart/cart.reducer';
import { recentlyViewedReducer } from './recently-viewed/recently-viewed.reducer';

export const rootReducer = combineReducers({
    wishlist: wishlistReducer,
    user: userReducer,
    categories: categoriesReducer,
    cart: cartReducer,
    recentlyViewed: recentlyViewedReducer,
});