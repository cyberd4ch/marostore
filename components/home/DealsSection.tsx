'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DealsSection() {
    // Mock Data based on your screenshot
    const deals = [
        { id: 1, name: "Fitted jacket", price: 225, oldPrice: 249, discount: "-32%", sold: 20, available: 30, color: "bg-blue-100", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600" },
        { id: 2, name: "Patterned resort shirt", price: 135, oldPrice: 299, discount: "-52%", sold: 10, available: 19, color: "bg-orange-100", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600" },
        { id: 3, name: "Flared dress", price: 130, oldPrice: 149, discount: "-55%", sold: 25, available: 35, color: "bg-green-100", img: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=600" },
        { id: 4, name: "Black t shirt", price: 210, oldPrice: 229, discount: "-26%", sold: 23, available: 12, color: "bg-blue-50", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600" }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-black text-slate-900">Deals Of The Day</h3>
                    <div className="bg-red-600 text-white font-mono px-3 py-1 rounded-sm text-sm flex gap-2">
                        <span>1D</span> : <span>12H</span> : <span>11M</span> : <span>53S</span>
                    </div>
                </div>
                <Link href="/shop" className="text-sm font-bold underline underline-offset-4">View All Deals</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {deals.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                        <div className={cn("relative aspect-[3/4] rounded-xl overflow-hidden mb-4", product.color)}>
                            <Image 
                                src={product.img} 
                                alt={product.name} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm">
                                {product.discount}
                            </div>
                            <button className="absolute top-3 right-3 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:text-red-500 transition-colors">
                                <Heart className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Inventory Progress Bar */}
                        <div className="space-y-1 mb-3">
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-slate-900 rounded-full" 
                                    style={{ width: `${(product.sold / (product.sold + product.available)) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                <span>Sold : {product.sold}</span>
                                <span>Available : {product.available}</span>
                            </div>
                        </div>

                        <h4 className="font-bold text-slate-900 truncate">{product.name}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-slate-900">₵{product.price}</span>
                            <span className="text-sm text-slate-400 line-through font-medium">₵{product.oldPrice}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}