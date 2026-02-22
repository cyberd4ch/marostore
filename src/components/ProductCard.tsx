'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '../../services/productService';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
                <div className="relative w-full h-48 mb-2">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-2"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <CardTitle className="text-base font-medium line-clamp-2">
                    {product.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                        ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                        {product.category}
                    </span>
                </div>
            </CardContent>

            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/products/${product.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}