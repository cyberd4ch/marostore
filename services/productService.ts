import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ---------- TYPES ----------
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

export type ProductCategory = string; // e.g. "electronics", "jewelery", etc.

// ---------- API FUNCTIONS ----------
export const productService = {
    // GET all products
    getAllProducts: async (): Promise<Product[]> => {
        const response: AxiosResponse<Product[]> = await apiClient.get('/products');
        return response.data;
    },

    // GET a single product by ID
    getProductById: async (id: number | string): Promise<Product> => {
        const response: AxiosResponse<Product> = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    // GET all categories
    getCategories: async (): Promise<ProductCategory[]> => {
        const response: AxiosResponse<ProductCategory[]> = await apiClient.get('/products/categories');
        return response.data;
    },

    // GET products by category
    getProductsByCategory: async (category: string): Promise<Product[]> => {
        const response: AxiosResponse<Product[]> = await apiClient.get(`/products/category/${encodeURIComponent(category)}`);
        return response.data;
    },

    getAllFashionProducts: async (): Promise<Product[]> => {
        const [men, women] = await Promise.all([
            productService.getProductsByCategory("men's clothing"),
            productService.getProductsByCategory("women's clothing"),
        ]);
        return [...men, ...women];
    },

    // ---------- MUTATIONS (example – extend as needed) ----------
    // POST – add new product (admin only)
    createProduct: async (product: Omit<Product, 'id' | 'rating'>): Promise<Product> => {
        const response: AxiosResponse<Product> = await apiClient.post('/products', product);
        return response.data;
    },

    // PUT – update product
    updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
        const response: AxiosResponse<Product> = await apiClient.put(`/products/${id}`, product);
        return response.data;
    },

    // DELETE – remove product
    deleteProduct: async (id: number): Promise<void> => {
        await apiClient.delete(`/products/${id}`);
    },
};