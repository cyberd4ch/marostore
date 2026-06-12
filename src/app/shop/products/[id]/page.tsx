'use client';

import { useParams, notFound } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectCategoriesMap, selectCategoriesIsLoading } from '@/store/categories/category.selector';

import ProductSkeleton from '@/components/loaders/ProductSkeleton';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import { CategoryMap } from '@/store/categories/category.types';

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
    // 1. Flatten items out and safely cast to generic objects to support hybrid models (Firebase + Django)
    const allProducts = Object.keys(categoriesMap).reduce((acc: any[], categoryTitle) => {
        const categoryItems = categoriesMap[categoryTitle].map((item: any) => ({
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

    // 3. Prepare display format with fallback values for various backend models
    const productPrice = Number(productData.price) || 0;
    const productImage = productData.imageUrl || productData.image || '/placeholder.png';

    const displayProduct = {
        ...productData,
        id: productData._id || String(productData.id),
        title: productData.name || 'Unnamed Product',
        image: productImage,
        price: productPrice,
        rating: productData.rating || { rate: 4.5, count: 120 },
        mrp: (productPrice * 1.25).toFixed(2), 
        discount: "20% Off"
    };

    // Safeguard gallery: safely handle optional images array from backend
    const galleryImages = Array.isArray(productData.images) && productData.images.length > 0 
        ? productData.images 
        : [displayProduct.image];

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12 clear-both">
            <RecentlyViewedTracker product={displayProduct} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start relative">
                
                {/* Visual Media Engine Container */}
                <div className="w-full lg:sticky lg:top-28 z-10 overflow-hidden block">
                    <ProductGallery 
                        images={galleryImages} 
                        title={displayProduct.title} 
                    />
                </div>

                {/* Operations & Interactive Info Grid Column */}
                <div className="flex flex-col w-full space-y-8 z-20 bg-white relative lg:pl-4">
                    <div className="pb-6 border-b border-slate-100">
                        <ProductInfo product={displayProduct} />
                    </div>
                    
                    <div className="pb-8 border-b border-slate-100">
                        <AddToCart product={displayProduct} />
                    </div>
                </div>
            </div>

            {/* Related Inventory Grid Section */}
            {relatedProducts.length > 0 && (
                <div className="pt-16 border-t border-slate-100 mt-16 clear-both">
                    <div className="flex flex-col gap-2 mb-10">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                            You Might Also Like
                        </h3>
                        <div className="h-1 w-12 bg-slate-900 rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((product: any) => (
                            <ProductCard 
                                key={product._id || product.id} 
                                product={{
                                    ...product,
                                    id: product._id || product.id,
                                    imageUrl: product.imageUrl || product.image
                                }} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
