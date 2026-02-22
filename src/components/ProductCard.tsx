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
    imageUrl?: string; // Handling both common naming conventions
    category?: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    // Safe Check for image source
    const displayImage = product.imageUrl || product.image || "/placeholder.png";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            className="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-xl"
        >
            {/* Image Container with 4:5 Aspect Ratio */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={false}
                />

                {/* Overlay Actions */}
                <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button className="rounded-full bg-white p-2 text-gray-900 shadow-md hover:bg-red-50 hover:text-red-500">
                        <Heart size={18} />
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col p-4">
                {product.category && (
                    <span className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-400">
                        {product.category}
                    </span>
                )}
                <h3 className="line-clamp-1 text-lg font-semibold text-gray-800">
                    {product.name}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                    </p>
                    <button className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700">
                        <ShoppingCart size={16} />
                        Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;