'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Star, ShoppingCart, Zap } from 'lucide-react';
import SHOP_DATA from '@/app/utils/shop/shop-data';

interface ShopItem {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
}

export default function TrendingWearSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // State to track favorited items (using IDs)
    const [favorites, setFavorites] = useState<number[]>([]);

    // Flatten and filter products
    const categories = Object.values(SHOP_DATA as any);
    const trendingProducts = categories
        .flatMap((cat: any) => cat.items)
        .filter((item: ShopItem) => item.price < 100)
        .slice(0, 12);

    const toggleFavorite = (id: number) => {
        setFavorites(prev => 
            prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
        );
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending Wear</h2>
                    <p className="text-slate-500 text-sm mt-1">Our most popular picks this week</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="p-2 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Area */}
            <div 
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {trendingProducts.map((product: any) => {
                    const isLiked = favorites.includes(product.id);
                    
                    return (
                        <div key={product.id} className="min-w-[280px] lg:min-w-[320px] snap-start group">
                            {/* Image Container */}
                            <div className="relative aspect-[4/5] bg-[#F8F8F8] rounded-2xl overflow-hidden mb-4">
                                {product.price > 70 && (
                                    <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                                        TRENDING
                                    </div>
                                )}
                                
                                <Image 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />

                                {/* Favorite Button */}
                                <button 
                                    onClick={() => toggleFavorite(product.id)}
                                    className="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all z-10"
                                >
                                    <Heart 
                                        className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-900'}`} 
                                    />
                                </button>

                                {/* Action Overlay (Add to Cart / Buy Now) */}
                                <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-white text-slate-900 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 shadow-lg">
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            Add to Cart
                                        </button>
                                        <button className="bg-black text-white p-2.5 rounded-lg hover:bg-slate-800 shadow-lg">
                                            <Zap className="w-4 h-4 fill-current" />
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>

                            {/* Details */}
                            <div className="px-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-slate-800 font-semibold text-lg">{product.name}</h3>
                                    <div className="flex items-center gap-1 text-orange-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs font-bold">4.8</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-black text-slate-900">
                                        ₵{product.price}.00
                                    </span>
                                    {product.price > 70 && (
                                        <span className="text-sm text-slate-400 line-through font-medium">
                                            ₵{product.price + 35}.00
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}