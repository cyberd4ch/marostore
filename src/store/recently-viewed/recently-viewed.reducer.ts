import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryItem } from '../categories/category.types';

interface RecentlyViewedState {
  items: CategoryItem[];
}

const INITIAL_STATE: RecentlyViewedState = {
  items: [],
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: INITIAL_STATE,
  reducers: {
    addViewedItem(state, action: PayloadAction<CategoryItem>) {
      // 1. Filter out if the item already exists (to move it to the front)
      const filtered = state.items.filter(item => item.id !== action.payload.id);
      // 2. Add to the front and limit to the last 4 items
      state.items = [action.payload, ...filtered].slice(0, 4);
    },
    clearRecentlyViewed(state) {
      state.items = [];
    }
  },
});

export const { addViewedItem, clearRecentlyViewed } = recentlyViewedSlice.actions;
export const recentlyViewedReducer = recentlyViewedSlice.reducer;