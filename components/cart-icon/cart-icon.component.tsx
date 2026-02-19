'use client';

import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart } from 'lucide-react';
import { setIsCartOpen } from '@/app/store/cart/cart.action';
import { selectCartCount, selectIsCartOpen } from '@/app/store/cart/cart.selector';

export default function CartIcon() {
    const dispatch = useDispatch();
    const isCartOpen = useSelector(selectIsCartOpen);
    const cartCount = useSelector(selectCartCount);

    const toggleCart = () => dispatch(setIsCartOpen(!isCartOpen));

    return (
        <button
            onClick={toggleCart}
            className="relative p-2 bg-transparent hover:opacity-80 transition-opacity"
            aria-label="Toggle cart"
        >
            <ShoppingCart
                className={`w-5 h-5 ${cartCount > 0 ? 'text-foreground' : 'text-foreground/50'
                    }`}
            />
            {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[0.65rem] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                </span>
            )}
        </button>
    );
}