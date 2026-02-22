'use client';

import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';

import ProductCard from '@/components/product-card/product-card.component';
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
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
                {category?.toUpperCase()}
            </h1>
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 px-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </Fragment>
    );
}