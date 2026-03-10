'use client';

import { useParams, notFound } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCategoriesMap, selectCategoriesIsLoading } from '@/store/categories/category.selector';

import ProductSkeleton from '@/components/loaders/ProductSkeleton';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { CategoryItem, CategoryMap } from '@/store/categories/category.types';

import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import AddToCart from '@/components/products/AddToCart';
import RecentlyViewedTracker from '@/components/products/RecentlyViewedTracker';

export default function ProductPage() {
    const params = useParams();
    const id = params?.id;

    const categoriesMap = useSelector(selectCategoriesMap);
    const isLoading = useSelector(selectCategoriesIsLoading);

    if (isLoading) return <ProductSkeleton />;

    return (
        <ErrorBoundary>
            <ProductContent id={id} categoriesMap={categoriesMap} />
        </ErrorBoundary>
    );
}

function ProductContent({ id, categoriesMap }: { id: string | string[] | undefined, categoriesMap: CategoryMap }) {
    // 1. Flatten and inject category title
    const allProducts: CategoryItem[] = Object.keys(categoriesMap).reduce((acc: CategoryItem[], categoryTitle) => {
        const categoryItems = categoriesMap[categoryTitle].map((item: CategoryItem) => ({
            ...item,
            category: categoryTitle
        }));
        return [...acc, ...categoryItems];
    }, []);

    const productData = allProducts.find((item) => String(item._id || item.id) === id);

    if (!productData) {
        notFound();
    }

    // 2. Filter Related Products
    const relatedProducts = allProducts
        .filter((item) => 
            item.category === productData.category && 
            String(item._id || item.id) !== id
        )
        .slice(0, 4);

    // 3. Prepare display format
    const displayProduct = {
        ...productData,
        id: productData._id || String(productData.id),
        title: productData.name,
        image: productData.imageUrl,
        rating: productData.rating || { rate: 4.5, count: 120 },
        mrp: (productData.price * 1.25).toFixed(2), 
        discount: "20% Off"
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
            <RecentlyViewedTracker product={displayProduct} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                <div className="sticky top-24">
                    <ProductGallery 
                        images={[displayProduct.image, displayProduct.image, displayProduct.image]} 
                        title={displayProduct.title} 
                    />
                </div>

                <div className="flex flex-col w-full">
                    <ProductInfo product={displayProduct} />
                    <AddToCart product={displayProduct} />
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="pt-16 border-t border-slate-100 mt-16">
                    <div className="flex flex-col gap-2 mb-10">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                            You Might Also Like
                        </h3>
                        <div className="h-1 w-12 bg-slate-900 rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}