'use client';

import { Star } from 'lucide-react';

export default function ProductInfo({ product }: { product: any }) {
    return (
        <div className="flex flex-col mb-8">
            {/* Breadcrumb */}
            <nav className="flex text-sm text-slate-500 mb-6">
                <ol className="flex items-center space-x-2">
                    <li>Fashion</li>
                    <li><span className="mx-2">›</span></li>
                    <li>{product.category || 'Menswear'}</li>
                    <li><span className="mx-2">›</span></li>
                    <li className="text-slate-900 font-medium">{product.title}</li>
                </ol>
            </nav>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                {product.title}
            </h1>

            {/* Rating Badge */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 border border-slate-200 rounded-md px-2 py-1 text-sm font-medium">
                    {product.rating.rate}
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                </div>
                <span className="text-slate-500 text-sm">{product.rating.count} Reviews</span>
            </div>

            {/* Price Block */}
            <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl font-bold text-slate-900">₵{Number(product.price).toFixed(2)}</span>
                <span className="text-lg text-slate-400 line-through mb-1">MRP ₵{product.mrp}</span>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full mb-2">
                    {product.discount}
                </span>
            </div>

            {/* Description */}
            <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
                {product.description || `Elevate your style with our ${product.title}! Crafted from premium materials, this timeless piece combines durability with a sleek design, perfect for any occasion.`}
            </p>
            
            <hr className="mt-8 border-slate-200" />
        </div>
    );
}