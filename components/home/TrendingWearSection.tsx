'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import SHOP_DATA from '@/app/utils/shop/shop-data';

interface ShopItem {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
}

export default function TrendingWearSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Flatten and filter for "affordable" (e.g., < 100)
    const categories = Object.values(SHOP_DATA as any);
    const trendingProducts = categories
        .flatMap((cat: any) => cat.items)
        .filter((item: ShopItem) => item.price < 100)
        .slice(0, 12); // Get a good amount for scrolling

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth 
                : scrollLeft + clientWidth;
            
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
                    Trending Wear
                </h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="p-2 bg-black text-white rounded-md hover:bg-slate-800 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="p-2 bg-black text-white rounded-md hover:bg-slate-800 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Area */}
            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {trendingProducts.map((product: any) => (
                    <div 
                        key={product.id} 
                        className="min-w-[280px] lg:min-w-[300px] snap-start group"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-[4/5] bg-[#F3F3F3] rounded-xl overflow-hidden mb-4">
                            {/* Sale Tag Logic */}
                            {product.price > 70 && (
                                <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">
                                    SALE
                                </div>
                            )}
                            
                            <Image 
                                src={product.imageUrl} 
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            {/* Wishlist Button */}
                            <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors z-10">
                                <Heart className="w-4 h-4 text-slate-900" />
                            </button>
                        </div>

                        {/* Details */}
                        <div className="space-y-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-slate-500 font-medium text-base">{product.name}</h3>
                                {/* Star Rating */}
                                <div className="flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded text-orange-600">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-[10px] font-bold">4.5</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-slate-900">
                                    ${product.price}.00
                                </span>
                                {product.price > 70 && (
                                    <span className="text-sm text-slate-400 line-through">
                                        ${product.price + 20}.00
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}