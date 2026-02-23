"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { addItemToCart } from "@/store/cart/cart.action";
import { selectCartItems } from "@/store/cart/cart.selector";
import { toggleItemInWishlist } from "@/store/wishlist/wishlist.action";
import { selectWishlistItems } from "@/store/wishlist/wishlist.selector";
import { cn } from "@/lib/utils";

import QuickViewModal from "./QuickViewModal";

interface Product {
    id: string | number;
    name: string;
    price: number;
    image?: string;
    imageUrl?: string;
    category?: string;
}

interface ProductCardProps {
    product: Product;
    compact?: boolean;
}

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const wishlistItems = useSelector(selectWishlistItems);

    const isFavorite = wishlistItems.some((item: any) => item.id === product.id);
    const displayImage = product.imageUrl || product.image || "/placeholder.png";

    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Create the dynamic link path
    const productLink = `/shop/products/${product.id}`;

    // --- HANDLERS ---
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Stops the Link from triggering
        dispatch(addItemToCart(cartItems, product as any));
        toast.success(`${product.name} added to cart`);
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleItemInWishlist(wishlistItems, product as any));
        toast(isFavorite ? "Removed from wishlist" : "Added to wishlist");
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toast.info("Opening Quick View...");
        setIsQuickViewOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className={`group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-xl ${compact ? "p-2" : ""
                }`}
        >
            {/* Wrap Image in Link for Navigation */}
            <Link href={productLink} className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 rounded-lg block">
                <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Floating Actions Overlay */}
                <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <button
                        onClick={handleToggleFavorite}
                        className="rounded-full bg-white p-2 text-gray-900 shadow-md hover:bg-red-50"
                    >
                        <Heart size={18} className={cn(isFavorite ? "fill-red-500 text-red-500" : "")} />
                    </button>

                    {/* NEW: Quick View Button */}
                    <button
                        onClick={handleQuickView}
                        className="rounded-full bg-white p-2 text-gray-900 shadow-md hover:bg-slate-100"
                    >
                        <Eye size={18} />
                    </button>
                </div>
            </Link>
            <AnimatePresence>
                {isQuickViewOpen && (
                    <QuickViewModal
                        product={product}
                        onClose={() => setIsQuickViewOpen(false)}
                        onAddToCart={() => dispatch(addItemToCart(cartItems, product as any))}
                    />
                )}
            </AnimatePresence>

            {/* Content Section */}
            <div className={compact ? "p-2" : "flex flex-col p-4"}>
                {!compact && (
                    <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {product.category}
                    </span>
                )}

                <Link href={productLink}>
                    <h3 className={`font-bold text-slate-900 line-clamp-1 hover:underline decoration-slate-300 underline-offset-4 ${compact ? "text-xs" : "text-lg"
                        }`}>
                        {product.name}
                    </h3>
                </Link>

                <div className={`flex items-center justify-between ${compact ? "mt-1" : "mt-4"}`}>
                    <p className={`font-black text-slate-900 ${compact ? "text-sm" : "text-xl"}`}>
                        ${product.price.toFixed(2)}
                    </p>

                    {!compact && (
                        <button
                            onClick={handleAddToCart}
                            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-slate-700 active:scale-95"
                        >
                            <ShoppingCart size={14} />
                            Add
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;