'use client';

import { Product } from '@/services/productService';
import { Badge } from '@/components/ui/badge';

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    return (
        <div>
            <Badge className="mb-2 bg-accent text-accent-foreground">
                {product.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {product.title}
            </h1>
            <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                            key={i}
                            className={cn(
                                'w-5 h-5',
                                i < Math.round(product.rating.rate)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                            )}
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
                <span className="text-sm text-muted-foreground">
                    {product.rating.rate} ({product.rating.count} reviews)
                </span>
            </div>
            <p className="text-4xl font-bold text-primary mb-4">
                ${product.price.toFixed(2)}
            </p>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}