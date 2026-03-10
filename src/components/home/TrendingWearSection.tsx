'use client';

import { useRef, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Heart, Star, ShoppingCart, Zap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

import { addItemToCart } from '@/store/cart/cart.action';
import { selectCartItems } from '@/store/cart/cart.selector';
import { selectWishlistItems } from '@/store/wishlist/wishlist.selector';
import { toggleItemInWishlist } from '@/store/wishlist/wishlist.action';
import { selectCategoriesMap, selectCategoriesIsLoading } from '@/store/categories/category.selector';
import { cn } from '@/lib/utils';

export default function TrendingWearSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const router = useRouter();

    const categoriesMap = useSelector(selectCategoriesMap);
    const isLoading = useSelector(selectCategoriesIsLoading);
    const cartItems = useSelector(selectCartItems);
    const wishlistItems = useSelector(selectWishlistItems);

    const trendingProducts = useMemo(() => {
        const allProducts = Object.values(categoriesMap).flat();
        return allProducts
            .filter((product: any) => product.price < 100)
            .slice(0, 12);
    }, [categoriesMap]);

    // ... scroll and handlers remain same ...
    const handleAddToCart = (product: any) => {
        dispatch(addItemToCart(cartItems, product));
        toast.success(`${product.name} added to cart`);
    };

    const handleBuyNow = (product: any) => {
        dispatch(addItemToCart(cartItems, product));
        router.push('/checkout');
    };

    const handleToggleFavorite = (product: any) => {
        dispatch(toggleItemInWishlist(wishlistItems, product));
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (isLoading) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header stays same, but trendingProducts.map is now dynamic */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trending Wear</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-slate-500 text-sm">A curated mix from all our collections</p>
                        <span className="hidden md:block w-1 h-1 bg-slate-300 rounded-full" />
                        <Link href="/shop" className="group flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
                            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="p-2.5 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={() => scroll('right')} className="p-2.5 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>

            <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6">
                {trendingProducts.map((product: any) => {
                    const isFavorite = wishlistItems.some((item: any) => item.id === product.id);
                    return (
                        <div key={product.id} className="min-w-[280px] lg:min-w-[320px] snap-start group">
                            <div className="relative aspect-[4/5] bg-[#F8F8F8] rounded-2xl overflow-hidden mb-4 shadow-sm">
                                <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                <button onClick={() => handleToggleFavorite(product)} className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full z-10">
                                    <Heart className={cn("w-4 h-4", isFavorite ? "fill-red-500 text-red-500" : "text-slate-900")} />
                                </button>
                                <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all z-20">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAddToCart(product)} className="flex-1 bg-white text-slate-900 py-2.5 rounded-lg font-semibold text-xs flex items-center justify-center gap-2">
                                            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                                        </button>
                                        <button onClick={() => handleBuyNow(product)} className="bg-black text-white p-2.5 rounded-lg">
                                            <Zap className="w-4 h-4 fill-current" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-slate-800 font-semibold text-lg line-clamp-1">{product.name}</h3>
                            <p className="text-xl font-black text-slate-900">₵{product.price}.00</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}