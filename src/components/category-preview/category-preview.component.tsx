'use client';

import { FC } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { CategoryItem } from '../../store/categories/category.types';

type CategoryPreviewProps = {
    title: string;
    products: CategoryItem[];
};

const CategoryPreview: FC<CategoryPreviewProps> = ({ title, products }) => {
    return (
        <div className="flex flex-col mb-8 md:mb-12 md:items-center">
            <h2 className="mb-6">
                <Link
                    href={`/shop/${title.toLowerCase()}`}
                    className="text-3xl font-bold hover:underline cursor-pointer"
                >
                    {title.toUpperCase()}
                </Link>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products
                    .filter((_, idx) => idx < 4)
                    .map((product) => (
                        <ProductCard key={product.id} product={product as any} />
                    ))}
            </div>
        </div>
    );
};

export default CategoryPreview;