export enum CATEGORIES_ACTION_TYPES {
    FETCH_CATEGORIES_START = 'category/FETCH_CATEGORIES_START',
    FETCH_CATEGORIES_SUCCESS = 'category/FETCH_CATEGORIES_SUCCESS',
    FETCH_CATEGORIES_FAILED = 'category/FETCH_CATEGORIES_FAILED',
}

export type CategoryItem = {
    id: number;
    _id?: string; // Firebase Document ID
    imageUrl: string;
    name: string;
    price: number;
    category?: string; // Injected during flattening
    status?: 'published' | 'draft';
    description?: string;
    stock?: number;
    rating?: {
        rate: number;
        count: number;
    };
    discountPrice?: number | null;
    createdAt?: any;
    updatedAt?: any;
};

export type Category = {
    title: string;
    imageUrl: string;
    items: CategoryItem[];
};

export type CategoryMap = {
    [key: string]: CategoryItem[];
};