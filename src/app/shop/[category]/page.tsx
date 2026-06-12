'use client';

import { useMemo, Fragment } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCategoriesMap, selectCategoriesIsLoading } from '@/store/categories/category.selector';
import ProductCard from '@/components/ProductCard';
import Spinner from '@/components/spinner/spinner.component';

export default function CategoryPage() {
    const params = useParams();
    const categoryName = (params?.category as string) || '';
    
    const categoriesMap = useSelector(selectCategoriesMap);
    const isLoading = useSelector(selectCategoriesIsLoading);

    // Read directly from Redux map using case-insensitive validation keys
    const products = useMemo(() => {
        if (!categoriesMap || !categoryName) return [];

        // Match exact keys (e.g., 'mens', 'womens', 'sneakers')
        const targetKey = Object.keys(categoriesMap).find(
            (key) => key.toLowerCase() === categoryName.toLowerCase()
        );

        const targetItems = targetKey ? categoriesMap[targetKey] : [];

        // Normalize indices to safeguard layout items downstream
        return targetItems.map((p: any) => ({
            ...p,
            id: p._id || p.id,
            imageUrl: p.imageUrl || p.image
        }));
    }, [categoriesMap, categoryName]);

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
