'use client';

import { useState, useEffect } from 'react';
import CategoryPreview from '@/components/category-preview/category-preview.component';
import Spinner from '@/components/spinner/spinner.component';
import { toast } from 'sonner';

export default function ShopPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLiveProducts = async () => {
            try {
                // 1. Call your bulletproof API route
                const response = await fetch('/api/products');
                const allProducts = await response.json();

                if (!response.ok) throw new Error(allProducts.error || "Failed to fetch");

                // 2. Group products by Category (Normalizing case sensitivity)
                const grouped = allProducts.reduce((acc: any, product: any) => {
                    const categoryName = (product.category || 'New Arrivals').toUpperCase();
                    
                    if (!acc[categoryName]) {
                        acc[categoryName] = { title: categoryName, items: [] };
                    }
                    
                    acc[categoryName].items.push(product);
                    return acc;
                }, {});

                setCategories(Object.values(grouped));
            } catch (error: any) {
                console.error("Shop Load Error:", error);
                toast.error(`Shop offline: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLiveProducts();
    }, []);

    if (isLoading) return <Spinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-16 md:gap-24">
            {categories.length > 0 ? (
                categories.map((category: any) => (
                    <CategoryPreview 
                        key={category.title} 
                        title={category.title} 
                        products={category.items} 
                    />
                ))
            ) : (
                <div className="text-center py-40">
                    <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest">
                        Inventory Empty
                    </h2>
                    <p className="text-slate-400 mt-2">Check back soon for new drops.</p>
                </div>
            )}
        </div>
    );
}