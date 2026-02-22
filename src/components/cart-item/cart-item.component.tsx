// cart-item.component.tsx
'use client';

import Image from 'next/image';
import { FC } from 'react';
import { CartItem as TCartItem } from '../../store/cart/cart.types';
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
        <div className="flex items-center gap-4 py-4 border-b border-slate-50 last:border-0">
            {/* Image Section */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <Image src={imageUrl} alt={name} width={80} height={80} className="h-full w-full object-cover" />
            </div>

            {/* Info Section */}
            <div className="flex flex-1 flex-col min-w-0">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate uppercase tracking-tight">{name}</h4>
                    <button onClick={() => onRemove(cartItem)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
                
                <p className="text-xs font-medium text-slate-500 mb-2">₵{price.toFixed(2)}</p>

                <div className="flex items-center justify-between">
                    {/* Custom Quantity Controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button onClick={() => onDecrement(cartItem)} className="p-1 hover:bg-slate-50 transition-colors">
                            <Minus className="h-3 w-3 text-slate-600" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                        <button onClick={() => onIncrement(cartItem)} className="p-1 hover:bg-slate-50 transition-colors">
                            <Plus className="h-3 w-3 text-slate-600" />
                        </button>
                    </div>
                    <p className="text-sm font-black text-slate-900">₵{(price * quantity).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;