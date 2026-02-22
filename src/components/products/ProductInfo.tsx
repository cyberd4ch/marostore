'use client';

import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryItem } from '@/app/store/categories/category.types';
import { selectWishlistItems } from '@/app/store/wishlist/wishlist.selector';
import { toggleItemInWishlist } from '@/app/store/wishlist/wishlist.action';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
    product: any; // Using any to handle the mapped displayProduct
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const dispatch = useDispatch();
    const wishlistItems = useSelector(selectWishlistItems);
    
    const isFavorite = wishlistItems.some((item: CategoryItem) => item.id === product.id);

    const onToggleWishlist = () => {
        // Ensure we pass the expected CategoryItem structure to the action
        const wishlistProduct = {
            id: product.id,
            name: product.name || product.title,
            price: product.price,
            imageUrl: product.imageUrl || product.image
        };
        
        dispatch(toggleItemInWishlist(wishlistItems, wishlistProduct));
        isFavorite ? toast.info("Removed from wishlist") : toast.success("Added to wishlist");
    };

    return (
        <div className="space-y-4">
            {/* Category and Wishlist Row */}
            <div className="flex justify-between items-center">
                <Badge className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 border-none px-3 py-1">
                    {product.category}
                </Badge>
                <button 
                    onClick={onToggleWishlist}
                    className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-all active:scale-90"
                    aria-label="Toggle Wishlist"
                >
                    <Heart className={cn("h-6 w-6 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-slate-400")} />
                </button>
            </div>

            {/* Title and Rating */}
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                    {product.name || product.title}
                </h1>
                
                <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                                key={i}
                                className={cn(
                                    'w-5 h-5',
                                    i < Math.round(product.rating?.rate || 0)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                )}
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-sm font-medium text-slate-500">
                        {product.rating?.rate || 0} ({product.rating?.count || 0} reviews)
                    </span>
                </div>
            </div>

            {/* Price */}
            <div className="pt-2">
                <p className="text-4xl font-black text-slate-900">
                    ₵{Number(product.price).toFixed(2)}
                </p>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-lg leading-relaxed border-t pt-4">
                {product.description || "Experience premium quality and timeless style with this MaroStore exclusive piece."}
            </p>
        </div>
    );
}