import { takeLatest, all, call, put } from 'typed-redux-saga';
import { productService } from '../../services/productService'; // Import your updated client layer

import {
  fetchCategoriesSuccess,
  fetchCategoriesFailed,
} from './category.action';

import { CATEGORIES_ACTION_TYPES } from './category.types';
import { transformProductsToCategories } from './category.reducer';

export function* fetchCategoriesAsync() {
  try {
    // 1. Yield the call straight to your Axios Django client wrapper
    const products = yield* call(productService.getAllProducts);

    console.log("RAW PRODUCTS FROM DJANGO:", products);
    
    // 2. Filter for active items coming from your SQL tables
    const liveProducts = products.filter(
      (p: any) => p.is_active === true && p.category
    );

    // 3. Transform the flat Django DB rows into the UI expected structure
    const categoriesArray = transformProductsToCategories(liveProducts);

    console.log("TRANSFORMED CATEGORIES FOR REDUX:", categoriesArray);

    // 4. Send the structured array to Redux
    yield* put(fetchCategoriesSuccess(categoriesArray));
    
  } catch (error) {
    console.error("SAGA FETCH ERROR:", error);
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
