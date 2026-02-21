'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import SHOP_DATA from '@/app/utils/shop/shop-data'; 

interface ShopItem {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
}

interface ShopCategory {
    id: number;
    title: string;
    routeName: string;
    items: ShopItem[];
}

export default function DealsSection() {
    // 1. Flatten the data structure safely
    const categories = Object.values(SHOP_DATA as unknown as Record<string, ShopCategory>);

    const allProducts = categories.flatMap((category) => 
        Array.isArray(category.items) ? category.items : []
    );

    // 2. Algorithm: Filter for "Deals" (Price > 200)
    const deals = allProducts
        .filter((item) => item.price > 200)
        .slice(0, 4);

    // 3. The Actual UI Return
    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                        Deals Of The Day
                    </h3>
                    <div className="bg-red-600 text-white font-mono px-3 py-1 rounded-sm text-xs flex gap-2">
                        <span>1D</span> : <span>12H</span> : <span>11M</span> : <span>53S</span>
                    </div>
                </div>
                <Link href="/shop" className="text-xs font-bold underline underline-offset-4 uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                    View All Deals
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {deals.map((product) => {
                    const totalInventory = 50; 
                    const soldCount = Math.floor((product.id % 10) * 4) + 10;
                    const availableCount = totalInventory - soldCount;
                    const percentage = (soldCount / totalInventory) * 100;

                    return (
                        <div key={product.id} className="group cursor-pointer">
                            <div className="relative aspect-[3/4] rounded-none overflow-hidden mb-5 bg-slate-50">
                                <Image 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-black px-2 py-1 uppercase">
                                    -20% OFF
                                </div>
                                <button className="absolute top-4 right-4 h-9 w-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all">
                                    <Heart className="w-4 h-4 text-slate-900" />
                                </button>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="h-[2px] w-full bg-slate-100 overflow-hidden">
                                    <div 
                                        className="h-full bg-slate-900 transition-all duration-1000" 
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Sold: {soldCount}</span>
                                    <span>Available: {availableCount}</span>
                                </div>
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-tight mb-1">{product.name}</h4>
                            <div className="flex items-center gap-3">
                                <span className="text-base font-black text-slate-900">₵{product.price}</span>
                                <span className="text-xs text-slate-300 line-through font-medium">₵{Math.floor(product.price * 1.2)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}