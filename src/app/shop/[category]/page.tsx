// src/app/[category]/page.tsx
'use client';

import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';

import ProductCard from '@/components/ProductCard';
import Spinner from '@/components/spinner/spinner.component';
import {
    selectCategoriesMap,
    selectCategoriesIsLoading,
} from '@/store/categories/category.selector';

export default function CategoryPage() {
    const { category } = useParams<{ category: string }>();
    const categoriesMap = useSelector(selectCategoriesMap);
    const isLoading = useSelector(selectCategoriesIsLoading);
    const [products, setProducts] = useState(categoriesMap[category] || []);

    useEffect(() => {
        setProducts(categoriesMap[category] || []);
    }, [category, categoriesMap]);

    return (
        <Fragment>
            {/* Upgraded Header Typography */}
            <div className="mb-12 flex flex-col items-center justify-center space-y-4">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl lg:text-6xl uppercase">
                    {category}
                </h1>
                <div className="h-1.5 w-16 bg-slate-900 rounded-full" />
            </div>

            {isLoading ? (
                <Spinner />
            ) : (
                /* Upgraded Grid: 
                  - gap-x-6 for horizontal spacing
                  - gap-y-12 or gap-y-16 for vertical spacing (gives the cards room below)
                */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-y-16">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </Fragment>
    );
}