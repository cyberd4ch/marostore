'use client';

import { Star } from 'lucide-react';

export default function ProductInfo({ product }: { product: any }) {
    return (
        // Added top breathing space and deep right-side defensive padding tracks
        <div className="flex flex-col mb-4 pt-4 md:pt-6 pr-4 sm:pr-6 md:pr-10">
            {/* Breadcrumb */}
            <nav className="flex text-xs sm:text-sm text-slate-500 mb-6">
                <ol className="flex items-center space-x-2 whitespace-nowrap overflow-x-auto scrollbar-none">
                    <li className="uppercase tracking-wider font-medium text-[11px]">Fashion</li>
                    <li><span className="mx-1 text-slate-300">/</span></li>
                    <li className="uppercase tracking-wider font-medium text-[11px]">{product.category || 'Menswear'}</li>
                    <li><span className="mx-1 text-slate-300">/</span></li>
                    <li className="text-slate-900 font-bold truncate max-w-[180px] sm:max-w-xs uppercase tracking-wider text-[11px]">
                        {product.title}
                    </li>
                </ol>
            </nav>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">
                {product.title}
            </h1>

            {/* Rating Badge */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 border-2 border-slate-900 rounded-md px-2 py-0.5 text-xs font-black">
                    {product.rating?.rate || '4.5'}
                    <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                </div>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    {product.rating?.count || '120'} Reviews
                </span>
            </div>

            {/* Price Block */}
            <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl font-black text-slate-900 tracking-tight">₵{Number(product.price).toFixed(2)}</span>
                <span className="text-sm font-bold text-slate-400 line-through mb-1">MRP ₵{product.mrp}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full mb-1">
                    {product.discount}
                </span>
            </div>

            {/* Description */}
            <p className="text-slate-500 leading-relaxed text-sm font-medium">
                {product.description || `Elevate your style with our ${product.title}! Crafted from premium materials, this timeless piece combines durability with a sleek design, perfect for any occasion.`}
            </p>
            
            <hr className="mt-8 border-slate-100" />
        </div>
    );
}
