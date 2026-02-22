'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Plus } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectWishlistItems } from '@/store/wishlist/wishlist.selector';
import { toggleItemInWishlist } from '@/store/wishlist/wishlist.action';
import { selectCartItems } from '@/store/cart/cart.selector'; // Changed to @
import { addItemToCart } from '@/store/cart/cart.action';      // Changed to @
import { CategoryItem } from '@/store/categories/category.types'; // Changed to @

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from "@/lib/utils";

type ProductCardProps = {
    product: CategoryItem;
    compact?: boolean;
};

const ProductCard: FC<ProductCardProps> = ({ product, compact = false }) => {
    const router = useRouter();
    const { id, name, price, imageUrl } = product;
    const dispatch = useDispatch();

    const wishlistItems = useSelector(selectWishlistItems);
    const cartItems = useSelector(selectCartItems);

    // ✅ FIXED: Only one declaration of isFavorite
    const isFavorite = wishlistItems.some((item: CategoryItem) => item.id === id);

    const handleNavigateToDetails = () => {
        router.push(`/product/${id}`);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevents navigating to product page
        dispatch(toggleItemInWishlist(wishlistItems, product));

        if (!isFavorite) {
            toast.success(`${name} added to wishlist`);
        } else {
            toast.info(`${name} removed from wishlist`);
        }
    };

    const addProductToCart = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents navigating to product page
        dispatch(addItemToCart(cartItems, product));
        toast.success(`${name} added to cart`);
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevents navigating to product page
        dispatch(addItemToCart(cartItems, product));
        router.push('/checkout');
    };

    return (
        <Card 
            onClick={handleNavigateToDetails} 
            className={cn(
                "group cursor-pointer overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-all hover:shadow-md",
                compact && "shadow-none border-slate-100"
            )}
        >
            <div className="relative aspect-[4/3] bg-[#E5E5E5] overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-90"
                    priority
                />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFavorite}
                    className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white z-10 transition-colors"
                >
                    <Heart
                        className={cn(
                            "h-5 w-5 transition-colors",
                            isFavorite ? "fill-red-500 text-red-500" : "text-slate-900"
                        )}
                    />
                </Button>
            </div>

            <CardContent className="p-5">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{name}</h3>
                    <p className="text-xl font-extrabold text-slate-900">₵{price}</p>
                </div>
            </CardContent>

            {!compact && (
                <CardFooter 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-5 pt-0 grid grid-cols-2 gap-3"
                >
                    <Button onClick={handleBuyNow}>Buy Now</Button>
                    <Button onClick={addProductToCart} variant="outline">
                        <Plus className="mr-1 h-4 w-4 stroke-[3]" /> Cart
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
};

export default ProductCard;