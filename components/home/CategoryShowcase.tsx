'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';
import { CategoryItem } from '../../app/store/categories/category.types';

// We define a Map for the background colors based on category names
const CATEGORY_STYLES: Record<string, string> = {
    mens: "bg-blue-50",
    womens: "bg-pink-50",
    hats: "bg-gray-100",
    sneakers: "bg-green-50",
    jackets: "bg-orange-50",
};

type CategoryShowcaseProps = {
    // This matches the structure of your SHOP_DATA (Object.entries)
    categories: {
        title: string;
        items: CategoryItem[];
    }[];
};

const CategoryShowcase: FC<CategoryShowcaseProps> = ({ categories }) => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            {/* Header Navigation (Search/Filter Bar) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-gray-100 pb-6">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium hover:bg-gray-50">
                    <span className="w-4 h-4 grid grid-cols-2 gap-0.5">
                        {[...Array(4)].map((_, i) => <div key={i} className="bg-current rounded-sm" />)}
                    </span>
                    All Blocks
                </button>
                
                <div className="flex flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search Blocks..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                </div>
            </div>

            {/* Hero Text Section */}
            <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
                <div>
                    <span className="px-3 py-1 rounded-full border border-gray-200 text-xs font-medium uppercase tracking-wider">
                        Shop by category
                    </span>
                    <h2 className="text-5xl md:text-7xl font-bold mt-6 leading-tight">
                        Fresh Arrivals <span className="text-gray-400">and</span> <br /> New Selections
                    </h2>
                </div>
                <div className="max-w-md">
                    <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                        Explore our latest offerings with Fresh Arrivals and New Selections, featuring the trendiest products and unique finds to elevate your collection.
                    </p>
                    <Link href="/shop" className="inline-block bg-zinc-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-black transition-all">
                        See All Category
                    </Link>
                </div>
            </div>

            {/* Pill Category Grid - Derived from Props */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.slice(0, 4).map(({ title, items }) => {
                    const firstProduct = items[0];
                    const bgStyle = CATEGORY_STYLES[title.toLowerCase()] || "bg-slate-50";

                    return (
                        <Link 
                            key={title}
                            href={`/shop/${title.toLowerCase()}`}
                            className={`${bgStyle} rounded-[500px] aspect-[1/1.8] flex flex-col items-center justify-start p-10 text-center transition-transform hover:-translate-y-2 duration-500 group`}
                        >
                            <div className="mt-8">
                                <h3 className="text-2xl font-bold text-gray-900 capitalize">{title}</h3>
                                <p className="text-gray-500 text-xs mt-2 px-4 uppercase tracking-widest">
                                    {items.length} Products
                                </p>
                                
                                <div className="relative w-48 h-64 mt-12 transition-transform duration-500 group-hover:scale-110">
                                    {firstProduct && (
                                        <Image 
                                            src={firstProduct.imageUrl} 
                                            alt={title} 
                                            fill 
                                            className="object-contain drop-shadow-2xl"
                                        />
                                    )}
                                </div>
                                
                                <div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryShowcase;