'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { selectCategoriesMap, selectCategoriesIsLoading } from '@/store/categories/category.selector';
import { CategoryItem } from "@/store/categories/category.types";

interface CategoryShowcaseProps {
    categories: {
        title: string;
        items: CategoryItem[];
    }[];
}

const CATEGORY_STYLES: Record<string, string> = {
    mens: "bg-blue-50",
    womens: "bg-pink-50",
    hats: "bg-gray-100",
    sneakers: "bg-green-50",
    jackets: "bg-orange-50",
};

export const CategoryShowcase = () => {
    // 1. Pull live data from Redux
    const categoriesMap = useSelector(selectCategoriesMap);
    const isLoading = useSelector(selectCategoriesIsLoading);

    // 2. Convert Map to Array for rendering
    const formattedCategories = Object.keys(categoriesMap).map((title) => ({
        title,
        items: categoriesMap[title],
    }));

    if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            {/* Header / Search UI (Kept from your original) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-gray-100 pb-6">
                <h2 className="text-xl font-bold uppercase tracking-tighter">Live Collection</h2>
                <div className="flex flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search live products..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg" />
                </div>
            </div>

            {/* Title Section */}
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                <h2 className="text-5xl md:text-7xl font-bold leading-tight">
                    Real-time <span className="text-gray-400">Inventory</span>
                </h2>
                <p className="text-gray-500 text-lg">
                    Everything you see here is pulled directly from the Maro Inventory console.
                </p>
            </div>

            {/* Dynamic Pill Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {formattedCategories.slice(0, 4).map(({ title, items }) => {
                    // This picks the most recently added product as the category cover
                    const latestProduct = items[items.length - 1]; 
                    const bgStyle = CATEGORY_STYLES[title.toLowerCase()] || "bg-slate-50";

                    return (
                        <Link 
                            key={title}
                            href={`/shop/${title.toLowerCase()}`}
                            className={`${bgStyle} rounded-[500px] aspect-[1/1.8] flex flex-col items-center p-10 text-center transition-all hover:-translate-y-2 duration-500 group`}
                        >
                            <div className="mt-8">
                                <h3 className="text-2xl font-bold text-gray-900 capitalize">{title}</h3>
                                <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest">
                                    {items.length} Items Available
                                </p>
                                
                                <div className="relative w-48 h-64 mt-12 transition-transform duration-500 group-hover:scale-110">
                                    {latestProduct?.imageUrl ? (
                                        <Image 
                                            src={latestProduct.imageUrl} 
                                            alt={title} 
                                            fill 
                                            className="object-contain drop-shadow-2xl"
                                            unoptimized // Useful if using Cloudinary/external URLs
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-400">No Image</div>
                                    )}
                                </div>
                                
                                <div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View {title} <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};