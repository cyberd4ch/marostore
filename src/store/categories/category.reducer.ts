import { AnyAction } from 'redux';
import { Category, CategoryItem, CategoryMap } from './category.types'; // Added imports
import {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailed,
} from './category.action';

// 1. ADD THE TRANSFORMATION UTILITY
// This converts the flat product list from your API into the Category array format
export const transformProductsToCategories = (products: any[]): Category[] => {
    if (!products || !Array.isArray(products)) return [];

    const grouped = products.reduce((acc, product) => {
        if (!product.category) return acc;
        
        const categoryTitle = product.category.toLowerCase();
        // Fallback or map the Django 'feature_image' property cleanly 
        const productImg = product.feature_image || product.imageUrl || '';
        
        if (!acc[categoryTitle]) {
            acc[categoryTitle] = {
                title: categoryTitle,
                imageUrl: productImg, 
                items: []
            };
        }
        
        acc[categoryTitle].items.push({
            id: product.id,
            name: product.name,
            imageUrl: productImg, // Injects the Django feature_image string
            price: Number(product.price)
        });
        
        return acc;
    }, {} as Record<string, Category>);

    return Object.values(grouped);
};

export type CategoriesState = {
    readonly categories: Category[];
    readonly isLoading: boolean;
    readonly error: Error | null;
};

export const CATEGORIES_INITIAL_STATE: CategoriesState = {
    categories: [],
    isLoading: false,
    error: null,
};

export const categoriesReducer = (
    state = CATEGORIES_INITIAL_STATE,
    action: AnyAction
): CategoriesState => {
    if (fetchCategoriesStart.match(action)) {
        return { ...state, isLoading: true };
    }

    if (fetchCategoriesSuccess.match(action)) {
        // The payload here is now the processed array of categories
        return { ...state, categories: action.payload, isLoading: false };
    }

    if (fetchCategoriesFailed.match(action)) {
        return { ...state, error: action.payload, isLoading: false };
    }

    return state;
};