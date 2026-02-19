'use client';

import { useState } from 'react';
import { Product } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

interface AddToCartProps {
    product: Product;
}

// Mock color options based on category
const getColorOptions = (category: string) => {
    if (category.includes('women')) {
        return ['Black', 'White', 'Red', 'Blue', 'Pink'];
    }
    return ['Black', 'Navy', 'Gray', 'Olive'];
};

export default function AddToCart({ product }: AddToCartProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const colorOptions = getColorOptions(product.category);

    const increment = () => setQuantity((q) => q + 1);
    const decrement = () => setQuantity((q) => Math.max(1, q - 1));

    const handleAddToCart = () => {
        // Here you would dispatch to cart store / context
        console.log('Added to cart:', {
            product,
            quantity,
            color: selectedColor || 'Default',
        });
        // Show toast notification (use sonner or similar)
        alert(`Added ${quantity} item(s) to cart`);
    };

    return (
        <div className="space-y-6">
            {/* Color selection */}
            <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger id="color" className="w-full">
                        <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                        {colorOptions.map((color) => (
                            <SelectItem key={color} value={color}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-4 h-4 rounded-full border"
                                        style={{ backgroundColor: color.toLowerCase() }}
                                    />
                                    {color}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Quantity selector */}
            <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={decrement}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                        id="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center"
                    />
                    <Button variant="outline" size="icon" onClick={increment}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Add to cart button */}
            <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAddToCart}
                disabled={!selectedColor}
            >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart – ${(product.price * quantity).toFixed(2)}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
                Free shipping on orders over $50
            </p>
        </div>
    );
}