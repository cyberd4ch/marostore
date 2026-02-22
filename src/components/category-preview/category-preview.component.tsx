'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { CategoryItem } from '../../store/categories/category.types';

type CategoryPreviewProps = {
    title: string;
    products: CategoryItem[];
};

const CategoryPreview: FC<CategoryPreviewProps> = ({ title, products }) => {
    // 1. THE FIX: Ensure products is always an array before manipulating it
    const safeProducts = Array.isArray(products) ? products : [];

    return (
        <div className="flex flex-col w-full group mb-12">
            {/* 2. Premium Header Layout */}
            <div className="flex items-end justify-between mb-8 md:mb-10 border-b border-slate-100 pb-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black tracking-tighter text-slate-900 md:text-4xl uppercase">
                        {title}
                    </h2>
                    {/* Visual Anchor Line */}
                    <div className="h-1.5 w-12 bg-slate-900 rounded-full" />
                </div>
                
                {/* Desktop "View All" Link */}
                <Link
                    href={`/shop/${title.toLowerCase()}`}
                    className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-500 transition-all hover:text-slate-900"
                >
                    <span className="uppercase tracking-wider text-[11px]">View All</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            {/* 3. Upgraded Grid matching your individual category page */}
            {safeProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-y-16">
                    {/* .slice(0,4) is cleaner and faster than .filter() for limiting arrays */}
                    {safeProducts.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product as any} />
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center text-slate-400 font-medium bg-slate-50/50 rounded-3xl border border-slate-100 border-dashed">
                    No products currently available in this category.
                </div>
            )}

            {/* Mobile "View All" Button (shows under the grid on small screens) */}
            <div className="mt-10 flex sm:hidden">
                <Link
                    href={`/shop/${title.toLowerCase()}`}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-100 py-4 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200 active:scale-[0.98]"
                >
                    <span className="uppercase tracking-widest text-[11px]">View All {title}</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
};

export default CategoryPreview;