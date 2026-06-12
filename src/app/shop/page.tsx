'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCategoriesMap, selectCategoriesIsLoading } from '@/store/categories/category.selector';
import CategoryPreview from '@/components/category-preview/category-preview.component';
import Spinner from '@/components/spinner/spinner.component';
import { ChevronDown } from 'lucide-react';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

function ShopContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('search')?.toLowerCase() || '';

    const categoriesMap = useSelector(selectCategoriesMap);
    const isLoading = useSelector(selectCategoriesIsLoading);
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    // Process collection transforms dynamically using useMemo
    const processedCategories = useMemo(() => {
        if (!categoriesMap) return [];

        // 1. Flatten all categories out to sort/filter uniformly
        let allProducts: any[] = Object.keys(categoriesMap).reduce((acc: any[], categoryTitle) => {
            const items = categoriesMap[categoryTitle].map((item: any) => ({
                ...item,
                categoryName: categoryTitle,
                // Ensure uniform fields mapping safely
                id: item._id || item.id,
                imageUrl: item.imageUrl || item.image
            }));
            return [...acc, ...items];
        }, []);

        // 2. Apply active Search Queries
        if (query) {
            allProducts = allProducts.filter((product: any) => 
                product.name?.toLowerCase().includes(query) || 
                product.categoryName?.toLowerCase().includes(query) ||
                product.brand?.toLowerCase().includes(query)
            );
        }

        // 3. Process Sort orders
        allProducts.sort((a: any, b: any) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'name':
                    return (a.name || '').localeCompare(b.name || '');
                case 'newest':
default:
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
            }
        });

        // 4. Group back by category smoothly
        const grouped = allProducts.reduce((acc: any, product: any) => {
            const title = product.categoryName.toUpperCase();
            if (!acc[title]) {
                acc[title] = { title, items: [] };
            }
            acc[title].items.push(product);
            return acc;
        }, {});

        return Object.values(grouped);
    }, [categoriesMap, query, sortBy]);

    if (isLoading) return <Spinner />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col gap-10 md:gap-16">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
                <div>
                    {query ? (
                        <>
                            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-red-600 mb-2">Search Results</h1>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">"{query}"</h2>
                        </>
                    ) : (
                        <>
                            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Collection</h1>
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">All Drops</h2>
                        </>
                    )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative inline-flex flex-col items-start md:items-end">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Sort By</label>
                    <div className="relative w-full md:w-48 group">
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="w-full appearance-none bg-white border-2 border-slate-900 px-4 py-2 pr-10 font-bold uppercase tracking-widest text-[11px] outline-none cursor-pointer hover:bg-slate-900 hover:text-white transition-all"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>

            {/* Product Feed */}
            {processedCategories.length > 0 ? (
                processedCategories.map((category: any) => (
                    <CategoryPreview 
                        key={category.title} 
                        title={category.title} 
                        products={category.items} 
                    />
                ))
            ) : (
                <div className="text-center py-40">
                    <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest">
                        {query ? "No Results Found" : "Inventory Empty"}
                    </h2>
                    <p className="text-slate-400 mt-2">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<Spinner />}>
            <ShopContent />
        </Suspense>
    );
}
