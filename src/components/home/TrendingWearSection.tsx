'use client';

import { useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Added Link for navigation
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Heart, Star, ShoppingCart, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import SHOP_DATA from '@/app/utils/shop/shop-data';
import { addItemToCart } from '@/store/cart/cart.action';
import { selectCartItems } from '@/store/cart/cart.selector';
import { selectWishlistItems } from '@/store/wishlist/wishlist.selector';
import { toggleItemInWishlist } from '@/store/wishlist/wishlist.action';
import { cn } from '@/lib/utils';

interface ShopItem {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
}

export default function TrendingWearSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const router = useRouter();

    const cartItems = useSelector(selectCartItems);
    const wishlistItems = useSelector(selectWishlistItems);

    const trendingProducts = useMemo(() => {
        const categories = Object.values(SHOP_DATA as any).map((cat: any) => cat.items);
        const result: ShopItem[] = [];
        const maxItems = 12;
        let itemIndex = 0;

        while (result.length < maxItems) {
            let foundInThisRound = false;
            for (const items of categories) {
                if (items[itemIndex]) {
                    const product = items[itemIndex];
                    if (product.price < 100) {
                        result.push(product);
                    }
                    foundInThisRound = true;
                }
                if (result.length >= maxItems) break;
            }
            if (!foundInThisRound) break; 
            itemIndex++;
        }
        return result;
    }, []);

    const handleAddToCart = (product: ShopItem) => {
        dispatch(addItemToCart(cartItems, product as any));
        toast.success(`${product.name} added to cart`);
    };

    const handleBuyNow = (product: ShopItem) => {
        dispatch(addItemToCart(cartItems, product as any));
        router.push('/checkout');
    };

    const handleToggleFavorite = (product: ShopItem) => {
        const isCurrentlyFavorite = wishlistItems.some((item: any) => item.id === product.id);
        dispatch(toggleItemInWishlist(wishlistItems, product as any));
        
        if (!isCurrentlyFavorite) {
            toast.success(`${product.name} added to wishlist`);
        } else {
            toast.info(`${product.name} removed from wishlist`);
        }
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
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending Wear</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-slate-500 text-sm">A curated mix from all our collections</p>
                        <span className="hidden md:block w-1 h-1 bg-slate-300 rounded-full" />
                        <Link 
                            href="/shop" 
                            className="group flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                        >
                            View All
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2 self-end md:self-auto">
                    <button 
                        onClick={() => scroll('left')} 
                        className="p-2.5 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors active:scale-95"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => scroll('right')} 
                        className="p-2.5 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors active:scale-95"
                    >
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
                {trendingProducts.map((product: ShopItem) => {
                    const isFavorite = wishlistItems.some((item: any) => item.id === product.id);
                    
                    return (
                        <div key={product.id} className="min-w-[280px] lg:min-w-[320px] snap-start group">
                            <div className="relative aspect-[4/5] bg-[#F8F8F8] rounded-2xl overflow-hidden mb-4 shadow-sm">
                                {product.price > 70 && (
                                    <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
                                        TRENDING
                                    </div>
                                )}
                                
                                <Image 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 280px, 320px"
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />

                                <button 
                                    onClick={() => handleToggleFavorite(product)}
                                    className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all z-10 active:scale-90"
                                >
                                    <Heart 
                                        className={cn(
                                            "w-4 h-4 transition-colors",
                                            isFavorite ? "fill-red-500 text-red-500" : "text-slate-900"
                                        )} 
                                    />
                                </button>

                                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 bg-white text-slate-900 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 shadow-xl transition-transform active:scale-95"
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            Add to Cart
                                        </button>
                                        <button 
                                            onClick={() => handleBuyNow(product)}
                                            className="bg-black text-white p-2.5 rounded-lg hover:bg-slate-800 shadow-xl transition-transform active:scale-95"
                                        >
                                            <Zap className="w-4 h-4 fill-current" />
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </div>

                            <div className="px-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-slate-800 font-semibold text-lg line-clamp-1">{product.name}</h3>
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