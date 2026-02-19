'use client';

import { useSelector } from 'react-redux';
import {
    selectCategoriesMap,
    selectCategoriesIsLoading,
} from '@/app/store/categories/category.selector';
import CategoryPreview from '@/components/category-preview/category-preview.component';
import Spinner from '@/components/spinner/spinner.component';

export default function ShopPage() {
    const categoriesMap = useSelector(selectCategoriesMap);
    const isLoading = useSelector(selectCategoriesIsLoading);

    if (isLoading) return <Spinner />;

    return (
        <>
            {Object.keys(categoriesMap).map((title) => {
                const products = categoriesMap[title];
                return (
                    <CategoryPreview key={title} title={title} products={products} />
                );
            })}
        </>
    );
}