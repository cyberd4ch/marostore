// src/app/shop/page.tsx
'use client';

import { useSelector } from 'react-redux';
import { selectCategoriesIsLoading } from '@/store/categories/category.selector';
import SHOP_DATA from '@/app/utils/shop/shop-data';
import CategoryPreview from '@/components/category-preview/category-preview.component';
import Spinner from '@/components/spinner/spinner.component';

export default function ShopPage() {
    // 1. Explicitly type the data source
    const categoriesMap = SHOP_DATA as Record<string, any>;
    const isLoading = useSelector(selectCategoriesIsLoading);

    if (isLoading) return <Spinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-16 md:gap-24">
            {Object.keys(categoriesMap).map((title) => {
                // 2. Access the category object safely
                const categoryObject = categoriesMap[title];
                
                // 3. Extract items (handling the structure SHOP_DATA uses)
                const products = categoryObject?.items || [];
                
                return (
                    <CategoryPreview 
                        key={title} 
                        title={title} 
                        products={products} 
                    />
                );
            })}
        </div>
    );
}