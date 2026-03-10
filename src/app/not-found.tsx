'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { selectCategoriesMap } from '@/store/categories/category.selector';
import { ArrowLeft, Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function NotFound() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const categoriesMap = useSelector(selectCategoriesMap);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirects to your shop page with a search query parameter
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Flatten products and pick 4 random items for recommendations
    const recommendedProducts = Object.values(categoriesMap)
        .flat()
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

    return (
        <div className="min-h-screen flex flex-col items-center pt-20 px-4">
            {/* 404 Visual Section */}
            <div className="relative mb-8">
                <h1 className="text-[10rem] md:text-[15rem] font-black leading-none select-none text-transparent stroke-slate-200" 
                    style={{ WebkitTextStroke: '2px #e2e8f0' }}>
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white px-6 py-2 text-xs font-black uppercase tracking-[0.3em] rotate-[-5deg] shadow-xl">
                        LOST IN THE SOURCE
                    </div>
                </div>
            </div>

            <div className="text-center max-w-md mb-12">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                    That link is out of stock.
                </h2>
                
                {/* Search Bar Integration */}
                <form onSubmit={handleSearch} className="relative w-full mb-8">
                    <input 
                        type="text"
                        placeholder="SEARCH MAROSTORE..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-100 border-2 border-transparent focus:border-slate-900 focus:bg-white px-6 py-4 outline-none font-bold uppercase tracking-widest text-xs transition-all"
                    />
                    <button 
                        type="submit" 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </form>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                        href="/"
                        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Home
                    </Link>
                </div>
            </div>

            {/* Recommended Products Slider/Grid */}
            {recommendedProducts.length > 0 && (
                <div className="w-full max-w-[1200px] border-t border-slate-100 pt-16 pb-20">
                    <div className="flex justify-between items-end mb-10">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                                While You're Here...
                            </h3>
                            <div className="h-1 w-12 bg-red-600" />
                        </div>
                        <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest border-b-2 border-slate-900 pb-1">
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {recommendedProducts.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* Subtle Brand Watermark */}
            <div className="mt-auto py-10 opacity-10 flex gap-8 select-none grayscale">
                <span className="font-black italic text-2xl">MAROSTORE</span>
                <span className="font-black italic text-2xl">2026</span>
            </div>
        </div>
    );
}