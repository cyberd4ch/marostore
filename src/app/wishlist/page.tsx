'use client';

import { useSelector } from 'react-redux';
import { selectWishlistItems } from '@/store/wishlist/wishlist.selector';
import ProductCard from '@/components/ProductCard';
// 1. Import the correct type
import { CategoryItem } from '@/store/categories/category.types'; 
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
    const wishlistItems = useSelector(selectWishlistItems);

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
                    <p className="mt-2 text-slate-500">
                        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
                    </p>
                </div>
                <Heart className="h-8 w-8 text-red-500 fill-red-500" />
            </div>

            {wishlistItems.length > 0 ? (
                <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {/* 2. Use CategoryItem instead of the local Product type */}
                    {wishlistItems.map((product: CategoryItem) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="mt-20 flex flex-col items-center text-center">
                    <div className="rounded-full bg-slate-100 p-6">
                        <Heart className="h-12 w-12 text-slate-400" />
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-slate-900">Your wishlist is empty</h2>
                    <p className="mt-2 text-slate-500 text-sm max-w-xs">
                        Start hearting items you love and they'll appear here so you can find them later.
                    </p>
                    <Link href="/shop" className="mt-8">
                        <Button className="rounded-full px-8">Continue Shopping</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}