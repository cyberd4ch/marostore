import { takeLatest, all, call, put } from 'typed-redux-saga';

// 1. Import the transformation function from your reducer
import { transformProductsToCategories } from './category.reducer';

import {
  fetchCategoriesSuccess,
  fetchCategoriesFailed,
} from './category.action';

import { CATEGORIES_ACTION_TYPES, CategoryItem } from './category.types';

export function* fetchCategoriesAsync() {
  try {
    // 2. Fetch from your internal API route
    // In typed-redux-saga, use yield* for calls to ensure type inference
    const response = yield* call(fetch, '/api/products');
    
    // We need to call .json() on the response
    const products: any[] = yield* call([response, response.json]);

    // 3. Filter for 'published' items and valid categories
    const liveProducts = products.filter(
      (p: any) => p.status === 'published' && p.category
    );

    // 4. Transform the flat DB array into the Category[] structure expected by Redux
    const categoriesArray = transformProductsToCategories(liveProducts);

    // 5. Send the structured array to Redux
    yield* put(fetchCategoriesSuccess(categoriesArray));
    
  } catch (error) {
    yield* put(fetchCategoriesFailed(error as Error));
  }
}

export function* onFetchCategories() {
  yield* takeLatest(
    CATEGORIES_ACTION_TYPES.FETCH_CATEGORIES_START,
    fetchCategoriesAsync
  );
}

export function* categoriesSaga() {
  yield* all([call(onFetchCategories)]);
}