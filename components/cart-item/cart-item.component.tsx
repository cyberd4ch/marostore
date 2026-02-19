// cart-item.component.tsx
'use client';

import Image from 'next/image';
import { FC } from 'react';
import { CartItem as TCartItem } from '../../app/store/cart/cart.types';
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
        <div className="flex items-start gap-2 p-2 border-b border-gray-200 last:border-0">
            <Image
                src={imageUrl}
                alt={name}
                width={60}
                height={60}
                className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate">{name}</h4>
                <p className="text-sm text-gray-600">${price.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                    <button
                        onClick={() => onDecrement(cartItem)}
                        className="p-1 rounded-full hover:bg-gray-200"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center text-sm">{quantity}</span>
                    <button
                        onClick={() => onIncrement(cartItem)}
                        className="p-1 rounded-full hover:bg-gray-200"
                        aria-label="Increase quantity"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onRemove(cartItem)}
                        className="p-1 ml-2 rounded-full hover:bg-red-100 text-red-600"
                        aria-label="Remove item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;