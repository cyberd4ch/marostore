import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/products/ProductGallery';
import ProductInfo from '@/components/products/ProductInfo';
import AddToCart from '@/components/products/AddToCart';


import SHOP_DATA from '@/app/utils/shop/shop-data';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const allProducts = SHOP_DATA.reduce((acc: any[], category: any) => {
        const itemsWithCategory = category.items.map((item: any) => ({
            ...item,
            category: category.title 
        }));
        return [...acc, ...itemsWithCategory];
    }, []);

    const productData = allProducts.find((item: any) => String(item.id) === id);

    if (!productData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
        );
    }

    const relatedProducts = allProducts
        .filter((item) => item.category === productData.category && String(item.id) !== id)
        .slice(0, 4);

    // Map data and add some mock data to match the Shadcn UI screenshot
    const displayProduct = {
        ...productData,
        title: productData.name,
        image: productData.imageUrl,
        category: productData.category,
        rating: productData.rating || { rate: 4.3, count: 210 },
        // Mocking an Original Price (MRP) to show a discount like the screenshot
        mrp: (productData.price * 1.25).toFixed(2), 
        discount: "20% Off"
    };

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
            {/* The main 2-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                
                {/* Left Side: Images */}
                {/* Note: Ensure your ProductGallery is updated to show thumbnails below the main image */}
                <div className="sticky top-24">
                    <ProductGallery images={[displayProduct.image, displayProduct.image, displayProduct.image, displayProduct.image]} title={displayProduct.title} />
                </div>

                {/* Right Side: Details & Actions */}
                <div className="flex flex-col w-full">
                    <ProductInfo product={displayProduct} />
                    <AddToCart product={displayProduct} />
                </div>
            </div>
            {relatedProducts.length > 0 && (
                <div className="pt-16 border-t border-slate-100">
                    <div className="flex flex-col gap-2 mb-10">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                            You Might Also Like
                        </h3>
                        <div className="h-1 w-12 bg-slate-900 rounded-full" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}