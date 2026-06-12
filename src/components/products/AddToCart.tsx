'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '@/store/cart/cart.action';
import { selectCartItems } from '@/store/cart/cart.selector';
import { toggleItemInWishlist } from '@/store/wishlist/wishlist.action';
import { selectWishlistItems } from '@/store/wishlist/wishlist.selector';

import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Truck, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AddToCart({ product }: { product: any }) {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const wishlistItems = useSelector(selectWishlistItems);
    
    const getLabelPrefix = () => {
        const categoryLower = product.category?.toLowerCase() || '';
        if (categoryLower.includes('jacket')) return 'Jacket';
        if (categoryLower.includes('slide') || categoryLower.includes('sneaker') || categoryLower.includes('shoe')) return 'Footwear';
        if (categoryLower.includes('hat') || categoryLower.includes('cap')) return 'Headwear';
        return 'Product';
    };

    const labelPrefix = getLabelPrefix();
    
    const sizes = labelPrefix === 'Footwear' 
        ? ['39', '40', '41', '42', '43', '44'] 
        : ['XS', 'S', 'M', 'L', 'XL'];
        
    const colors = ['#000000', '#16a34a', '#f97316', '#e2e8f0', '#3b82f6'];
    
    const [selectedSize, setSelectedSize] = useState<string>(sizes[2] || 'M');
    const [selectedColor, setSelectedColor] = useState<string>(colors[0]);

    const isFavorite = wishlistItems.some((item: any) => item.id === product.id);

    const itemToAdd = {
        id: product.id,
        name: product.title,
        price: product.price,
        imageUrl: product.image
    };

    const handleAddToCart = () => {
        dispatch(addItemToCart(cartItems, itemToAdd));
        toast.success(`${product.title} added to cart!`, { description: `Size: ${selectedSize}` });
    };

    const handleToggleWishlist = () => {
        dispatch(toggleItemInWishlist(wishlistItems, itemToAdd));
        isFavorite ? toast.info("Removed from wishlist") : toast.success("Added to wishlist");
    };

    return (
        // Synchronized the exact structural right padding buffer (pr-4 sm:pr-6 md:pr-10) here
        <div className="flex flex-col space-y-8 pr-4 sm:pr-6 md:pr-10">
            {/* Color Selection */}
            <div className="flex items-center gap-4">
                <span className="font-bold uppercase text-[11px] tracking-wider text-slate-400 min-w-[120px]">
                    {labelPrefix} Color :
                </span>
                <div className="flex gap-3">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                                "w-6 h-6 rounded-full ring-2 ring-offset-2 transition-all",
                                selectedColor === color ? "ring-slate-900" : "ring-transparent hover:scale-110"
                            )}
                            style={{ backgroundColor: color }}
                            aria-label={`Select color ${color}`}
                        />
                    ))}
                </div>
            </div>

            {/* Size Selection */}
            <div className="flex items-center gap-4">
                <span className="font-bold uppercase text-[11px] tracking-wider text-slate-400 min-w-[120px]">
                    {labelPrefix} Size :
                </span>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                                "h-10 w-10 rounded-md border-2 text-xs font-black transition-all flex items-center justify-center",
                                selectedSize === size 
                                    ? "bg-slate-900 text-white border-slate-900" 
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-900"
                            )}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-2">
                <Button 
                    className="h-14 bg-slate-900 hover:bg-black text-white rounded-xl font-bold uppercase tracking-widest text-[11px] border-2 border-slate-900 transition-all shadow-sm"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                </Button>
                
                <Button 
                    variant="outline" 
                    className="h-14 bg-white hover:bg-slate-900 hover:text-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all"
                    onClick={handleToggleWishlist}
                >
                    <Heart className={cn("w-4 h-4 mr-2 transition-colors", isFavorite && "fill-current")} />
                    Wish List
                </Button>
            </div>

            {/* Premium Delivery Info Box */}
            <div className="border-2 border-slate-100 rounded-2xl flex flex-col mt-6 bg-slate-50/30 overflow-hidden">
                <div className="flex items-start gap-4 p-5 border-b border-slate-100">
                    <Truck className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Free Delivery</span>
                        <span className="text-xs text-slate-400 mt-1 underline cursor-pointer hover:text-slate-900 transition-colors">
                            Enter your postal code for delivery Availability
                        </span>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-5">
                    <RefreshCcw className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                        <span className="font-black text-slate-900 uppercase tracking-wider text-[11px]">Return Delivery</span>
                        <span className="text-xs text-slate-400 mt-1 leading-normal">
                            Free 30 Days Delivery Returns. <span className="underline font-black text-slate-600 hover:text-black transition-colors">Details</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
