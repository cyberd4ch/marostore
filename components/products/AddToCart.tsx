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
    
    // Mock sizes and colors for UI (you can map this to your actual data if available)
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const colors = ['#000000', '#16a34a', '#f97316', '#e2e8f0', '#3b82f6']; // Black, Green, Orange, Light Gray, Blue
    
    const [selectedSize, setSelectedSize] = useState<string>('L');
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
        <div className="flex flex-col space-y-8">
            {/* Color Selection */}
            <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-900 min-w-[100px]">Jacket Color :</span>
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
                <span className="font-semibold text-slate-900 min-w-[100px]">Jacket Size :</span>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                                "h-10 w-10 sm:h-12 sm:w-12 rounded-md border text-sm font-medium transition-all flex items-center justify-center",
                                selectedSize === size 
                                    ? "bg-slate-900 text-white border-slate-900" 
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
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
                    className="h-14 bg-[#111111] hover:bg-black text-white rounded-md font-medium text-base"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                </Button>
                
                <Button 
                    variant="outline" 
                    className="h-14 bg-[#F5F5F5] hover:bg-[#E5E5E5] border-none text-slate-900 rounded-md font-medium text-base"
                    onClick={handleToggleWishlist}
                >
                    <Heart className={cn("w-5 h-5 mr-2 transition-colors", isFavorite && "fill-slate-900")} />
                    Wish List
                </Button>
            </div>

            {/* Delivery Info Box */}
            <div className="border border-slate-200 rounded-md flex flex-col mt-4">
                <div className="flex items-start gap-4 p-4 sm:p-5 border-b border-slate-200">
                    <Truck className="w-6 h-6 text-slate-700 shrink-0 mt-1" />
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">Free Delivery</span>
                        <span className="text-sm text-slate-500 mt-1 underline cursor-pointer hover:text-slate-800">Enter your postal code for delivery Availability</span>
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 sm:p-5">
                    <RefreshCcw className="w-6 h-6 text-slate-700 shrink-0 mt-1" />
                    <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">Return Delivery</span>
                        <span className="text-sm text-slate-500 mt-1">
                            Free 30 Days Delivery Returns. <span className="underline font-medium cursor-pointer text-slate-900 hover:text-black">Details</span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}