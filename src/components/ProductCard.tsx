"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Firestore Imports
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/app/utils/firebase/firebase.utils";

import { addItemToCart } from "@/store/cart/cart.action";
import { selectCartItems } from "@/store/cart/cart.selector";
import { toggleItemInWishlist } from "@/store/wishlist/wishlist.action";
import { selectWishlistItems } from "@/store/wishlist/wishlist.selector";
import { selectCurrentUser } from "@/store/user/user.selector"; // Added selector
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
    const currentUser = useSelector(selectCurrentUser); // Get the logged-in user

    const isFavorite = wishlistItems.some((item: any) => item.id === product.id);
    const displayImage = product.imageUrl || product.image || "/placeholder.png";

    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const productLink = `/shop/products/${product.id}`;

    // --- FIRESTORE SYNC HELPER ---
    const toggleWishlistInFirestore = async (userUid: string, productData: any, isCurrentlyLiked: boolean) => {
        const userDocRef = doc(db, "users", userUid);
        try {
            if (isCurrentlyLiked) {
                await updateDoc(userDocRef, {
                    wishlist: arrayRemove(productData)
                });
            } else {
                await updateDoc(userDocRef, {
                    wishlist: arrayUnion(productData)
                });
            }
        } catch (error) {
            console.error("Error syncing wishlist to Firestore:", error);
        }
    };

    // --- HANDLERS ---
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addItemToCart(cartItems, product as any));
        toast.success(`${product.name} added to cart`);
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 1. Update local Redux state immediately for a snappy UI
        dispatch(toggleItemInWishlist(wishlistItems, product as any));
        toast(isFavorite ? "Removed from wishlist" : "Added to wishlist");

        // 2. If user is logged in, sync with Firestore database
        if (currentUser?.uid) {
            await toggleWishlistInFirestore(currentUser.uid, product, isFavorite);
        } else {
            toast.info("Log in to save your wishlist permanently!");
        }
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsQuickViewOpen(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                className={`group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-xl ${compact ? "p-2" : ""}`}
            >
                <Link href={productLink} className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 rounded-lg block">
                    <Image
                        src={displayImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        <button
                            onClick={handleToggleFavorite}
                            className="rounded-full bg-white p-2 text-gray-900 shadow-md hover:bg-red-50"
                        >
                            <Heart size={18} className={cn(isFavorite ? "fill-red-500 text-red-500" : "")} />
                        </button>
                        <button
                            onClick={handleQuickView}
                            className="rounded-full bg-white p-2 text-gray-900 shadow-md hover:bg-slate-100"
                        >
                            <Eye size={18} />
                        </button>
                    </div>
                </Link>

                <div className={compact ? "p-2" : "flex flex-col p-4"}>
                    {!compact && (
                        <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {product.category}
                        </span>
                    )}

                    <Link href={productLink}>
                        <h3 className={`font-bold text-slate-900 line-clamp-1 hover:underline decoration-slate-300 underline-offset-4 ${compact ? "text-xs" : "text-lg"}`}>
                            {product.name}
                        </h3>
                    </Link>

                    <div className={`flex items-center justify-between ${compact ? "mt-1" : "mt-4"}`}>
                        <p className={`font-sans font-semibold text-slate-900 ${compact ? "text-sm" : "text-xl"}`}>
                            ₵{Number(product.price).toLocaleString()}
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
            <AnimatePresence>
                {isQuickViewOpen && (
                    <QuickViewModal
                        product={product}
                        onClose={() => setIsQuickViewOpen(false)}
                        onAddToCart={() => dispatch(addItemToCart(cartItems, product as any))}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductCard;