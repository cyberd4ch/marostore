'use client';

import { useState, useEffect, Fragment } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Spinner from '@/components/spinner/spinner.component';
import { toast } from 'sonner';

export default function CategoryPage() {
    // 1. Get the category from the URL (e.g., /shop/sneakers)
    const params = useParams();
    const categoryName = params?.category as string;
    
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            if (!categoryName) return;
            
            setIsLoading(true);
            try {
                // 2. Fetch all live products
                const response = await fetch('/api/products');
                const allProducts = await response.json();

                if (!response.ok) throw new Error(allProducts.error || "Failed to load");

                // 3. FILTER: Match products to the current category 
                // Using .toLowerCase() on both sides makes it bulletproof
                const filteredProducts = allProducts.filter(
                    (product: any) => 
                        product.category?.toLowerCase() === categoryName.toLowerCase() &&
                        product.status === 'published'
                );

                // 4. NORMALIZE: Ensure ProductCard gets the right ID/Image
                const normalized = filteredProducts.map((p: any) => ({
                    ...p,
                    id: p._id || p.id,
                    imageUrl: p.imageUrl || p.image
                }));

                setProducts(normalized);
            } catch (error: any) {
                console.error("Category Fetch Error:", error);
                toast.error("Could not load category items");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [categoryName]);

    return (
        <Fragment>
            {/* Header Section */}
            <div className="mb-12 flex flex-col items-center justify-center space-y-4">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl lg:text-6xl uppercase">
                    {categoryName}
                </h1>
                <div className="h-1.5 w-16 bg-slate-900 rounded-full" />
            </div>

            {isLoading ? (
                <Spinner />
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-y-16">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No items found in {categoryName}.</p>
                </div>
            )}
        </Fragment>
    );
}