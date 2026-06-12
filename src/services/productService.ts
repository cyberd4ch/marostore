import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ---------- UPDATED DJANGO TYPES ----------
export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
}

export interface ProductVariantColors {
    name: string;
    hex: string;
}

export interface VariantsMetadata {
    sizes?: string[];
    colors?: ProductVariantColors[];
}

export interface ProductImage {
    image_url: string;
    is_feature: boolean;
    alt_text: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    category: string; // Serializer converts this to category name string for lists
    price: string;    // Decimals typically transmit as string primitives via JSON streams
    compare_at_price: string | null;
    is_trending: boolean;
    feature_image: string | null; // Unified grid display image url string
    
    // Detailed fields (Available when fetching a single object details view)
    description?: string;
    base_stock?: number;
    variants_metadata?: VariantsMetadata;
    images?: ProductImage[];
}

// ---------- API CONTROLLER MAPPINGS ----------
export const productService = {
    // GET all products (Grid View)
    getAllProducts: async (): Promise<Product[]> => {
        const response: AxiosResponse<Product[]> = await apiClient.get('/products/');
        return response.data;
    },

    // GET trending products -> Powers your home Next.js layout row
    getTrendingProducts: async (): Promise<Product[]> => {
        const response: AxiosResponse<Product[]> = await apiClient.get('/products/trending/');
        return response.data;
    },

    // GET a single product by slug (Using your custom slug lookup field!)
    getProductBySlug: async (slug: string): Promise<Product> => {
        const response: AxiosResponse<Product> = await apiClient.get(`/products/${slug}/`);
        return response.data;
    },

    // GET all categories
    getCategories: async (): Promise<Category[]> => {
        const response: AxiosResponse<Category[]> = await apiClient.get('/categories/');
        return response.data;
    },

    // GET items filtered by a parent category slug
    getProductsByCategory: async (categorySlug: string): Promise<Product[]> => {
        // Utilizing Django REST framework filtering or custom parameters if configured
        const response: AxiosResponse<Product[]> = await apiClient.get(`/products/?category=${categorySlug}`);
        return response.data;
    },

    // ---------- NEW SECURE CHECKOUT ACTIONS ----------
    createCheckoutIntent: async (payload: {
        email: string;
        name: string;
        phone: string;
        shipping_address: string;
        paystack_reference: string;
        items: Array<{ id: number; qty: number; size?: string; color?: string }>;
    }): Promise<{ success: string; order_id: number }> => {
        const response: AxiosResponse<{ success: string; order_id: number }> = await apiClient.post(
            '/checkout/create-intent/',
            payload
        );
        return response.data;
    }
};
