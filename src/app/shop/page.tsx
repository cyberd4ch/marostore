// src/app/shop/page.tsx
'use client';

import { useSelector } from 'react-redux';
import { selectCategoriesIsLoading } from '@/store/categories/category.selector';
import SHOP_DATA from '@/app/utils/shop/shop-data';
import CategoryPreview from '@/components/category-preview/category-preview.component';
import Spinner from '@/components/spinner/spinner.component';

export default function ShopPage() {
    // If SHOP_DATA is an array, we map directly. If it's an object, we use Object.values
    const categories = Array.isArray(SHOP_DATA) ? SHOP_DATA : Object.values(SHOP_DATA);
    const isLoading = useSelector(selectCategoriesIsLoading);

    if (isLoading) return <Spinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-16 md:gap-24">
            {categories.map((category: any) => (
                <CategoryPreview 
                    key={category.id || category.title} 
                    title={category.title} // PASS THE ACTUAL TITLE HERE
                    products={category.items || []} 
                />
            ))}
        </div>
    );
}