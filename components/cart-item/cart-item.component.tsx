// cart-item.component.tsx
'use client';

import Image from 'next/image';
import { FC } from 'react';
import { CartItem as TCartItem } from '../../app/store/cart/cart.types';
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from 'lucide-react';

type CartItemProps = {
    cartItem: TCartItem;
    onIncrement: (item: TCartItem) => void;
    onDecrement: (item: TCartItem) => void;
    onRemove: (item: TCartItem) => void;
};

const CartItem: FC<CartItemProps> = ({ cartItem, onIncrement, onDecrement, onRemove }) => {
    const { name, imageUrl, price, quantity } = cartItem;

    return (
        <div className="relative flex items-start gap-4 p-2 border-b border-gray-200 last:border-0">
            <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 p-2">
                <Image
                    src={imageUrl}
                    alt={name}
                    width={80}
                    height={80}
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-sm font-medium truncate">{name}</h4>
                        <p className="text-sm text-gray-600">₵{price.toFixed(2)}</p>
                    </div>
                                        <Button
                        onClick={() => onRemove(cartItem)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center rounded-lg border border-slate-200 px-1 py-1">
                                            <Button
                        onClick={() => onDecrement(cartItem)}
                        variant="ghost" size="icon" className="h-7 w-7 rounded-md"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                        onClick={() => onIncrement(cartItem)}
                        variant="ghost" size="icon" className="h-7 w-7 rounded-md"
                        aria-label="Increase quantity"
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium">₵{(price * quantity).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;