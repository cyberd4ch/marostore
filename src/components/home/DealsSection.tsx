'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { addItemToCart } from '@/store/cart/cart.action';
import { selectCartItems } from '@/store/cart/cart.selector';
import { selectWishlistItems } from '@/store/wishlist/wishlist.selector';
import { toggleItemInWishlist } from '@/store/wishlist/wishlist.action';
import { selectCategoriesMap, selectCategoriesIsLoading } from '@/store/categories/category.selector';
import { EasterCountdown } from '@/components/countdown/EasterCountdown';

export default function DealsSection() {
    const dispatch = useDispatch();
    const router = useRouter();
    
    // Live Data Selectors
    const categoriesMap = useSelector(selectCategoriesMap);
    const isLoading = useSelector(selectCategoriesIsLoading);
    const cartItems = useSelector(selectCartItems);
    const wishlistItems = useSelector(selectWishlistItems);

    // Flatten map to items and filter for Deals (Price > 200)
    const allProducts = Object.values(categoriesMap).flat();
    const deals = allProducts
        .filter((item) => item.price > 200)
        .slice(0, 4);

    const handleAddToCart = (product: any) => {
        dispatch(addItemToCart(cartItems, product));
        toast.success(`${product.name} added to cart`);
    };

    const handleBuyNow = (product: any) => {
        dispatch(addItemToCart(cartItems, product));
        router.push('/checkout');
    };

    const handleToggleFavorite = (product: any) => {
        const isFavorite = wishlistItems.some((item: any) => item.id === product.id);
        dispatch(toggleItemInWishlist(wishlistItems, product));
        if (!isFavorite) toast.success(`${product.name} added to wishlist`);
        else toast.info(`${product.name} removed from wishlist`);
    };

    if (isLoading) return null;

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                        Countdown to Easter Promo
                    </h3>
                    <div className="bg-red-600 text-white font-mono px-3 py-1 rounded-sm text-xs flex gap-2">
                        <EasterCountdown />
                    </div>
                </div>
                <Link href="/shop" className="text-xs font-bold underline underline-offset-4 uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                    View All Deals
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {deals.map((product) => {
                    const isFavorite = wishlistItems.some((item: any) => item.id === product.id);
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

                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4 gap-2">
                                    <button onClick={() => handleBuyNow(product)} className="w-full bg-white text-slate-900 text-[10px] font-black uppercase py-3 tracking-widest hover:bg-slate-900 hover:text-white transition-colors flex items-center justify-center gap-2">
                                        <Zap className="w-3 h-3 fill-current" /> Buy It Now
                                    </button>
                                    <button onClick={() => handleAddToCart(product)} className="w-full bg-slate-900 text-white text-[10px] font-black uppercase py-3 tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2">
                                        <ShoppingBag className="w-3 h-3" /> Add To Cart
                                    </button>
                                </div>

                                <button onClick={() => handleToggleFavorite(product)} className="absolute top-4 right-4 h-9 w-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all z-10">
                                    <Heart className={cn("w-4 h-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-slate-900")} />
                                </button>
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