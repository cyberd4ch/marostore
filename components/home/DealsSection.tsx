'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

import SHOP_DATA from '@/app/utils/shop/shop-data'; 
import { addItemToCart } from '@/app/store/cart/cart.action';
import { selectCartItems } from '@/app/store/cart/cart.selector';

// --- ADD THESE INTERFACES BACK AT THE TOP ---
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
    const dispatch = useDispatch();
    const router = useRouter();
    const cartItems = useSelector(selectCartItems);

    // 1. Flatten the data structure safely using the interfaces above
    const categories = Object.values(SHOP_DATA as unknown as Record<string, ShopCategory>);
    
    const allProducts = categories.flatMap((category) => 
        Array.isArray(category.items) ? category.items : []
    );

    const deals = allProducts
        .filter((item) => item.price > 200)
        .slice(0, 4);

    // Handlers
    const handleAddToCart = (product: ShopItem) => {
        // We cast product to any here if your Redux action expects a slightly different item type
        dispatch(addItemToCart(cartItems, product as any));
    };

    const handleBuyNow = (product: ShopItem) => {
        dispatch(addItemToCart(cartItems, product as any));
        router.push('/checkout');
    };

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
                    const percentage = (soldCount / totalInventory) * 100;

                    return (
                        <div key={product.id} className="group relative">
                            <div className="relative aspect-[3/4] rounded-none overflow-hidden mb-5 bg-slate-50">
                                <Image 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    fill 
                                    className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                />
                                
                                <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-black px-2 py-1 uppercase z-10">
                                    -20% OFF
                                </div>

                                {/* HOVER OVERLAY */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4 gap-2">
                                    <button 
                                        onClick={() => handleBuyNow(product)}
                                        className="w-full bg-white text-slate-900 text-[10px] font-black uppercase py-3 tracking-widest hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Zap className="w-3 h-3 fill-current" /> Buy It Now
                                    </button>
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        className="w-full bg-slate-900 text-white text-[10px] font-black uppercase py-3 tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ShoppingBag className="w-3 h-3" /> Add To Cart
                                    </button>
                                </div>

                                <button className="absolute top-4 right-4 h-9 w-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all z-10">
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
                                    <span>Available: {totalInventory - soldCount}</span>
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