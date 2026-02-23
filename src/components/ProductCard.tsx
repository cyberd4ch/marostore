"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";

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
    const displayImage = product.imageUrl || product.image || "/placeholder.png";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className={`group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-xl ${compact ? "p-2" : ""
                }`}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 rounded-lg">
                <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={false}
                />
                <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button className="rounded-full bg-white p-2 text-gray-900 shadow-md hover:bg-red-50 hover:text-red-500">
                        <Heart size={compact ? 14 : 18} />
                    </button>
                </div>
            </div>

            {/* ONE SINGLE CONTENT SECTION */}
            <div className={compact ? "p-2" : "flex flex-col p-4"}>
                {!compact && product.category && (
                    <span className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                        {product.category}
                    </span>
                )}

                <h3 className={`font-semibold text-gray-800 line-clamp-1 ${compact ? "text-xs" : "text-lg"}`}>
                    {product.name}
                </h3>

                <div className={`flex items-center justify-between ${compact ? "mt-1" : "mt-4"}`}>
                    <p className={`font-bold text-gray-900 ${compact ? "text-sm" : "text-xl"}`}>
                        ${product.price.toFixed(2)}
                    </p>

                    {!compact && (
                        <button className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700">
                            <ShoppingCart size={16} />
                            Add
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;