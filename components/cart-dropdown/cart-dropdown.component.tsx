'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component'; // updated import
import CartItem from '../cart-item/cart-item.component';
import { selectCartItems } from '../../app/store/cart/cart.selector';
import {
    setIsCartOpen,
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
} from '../../app/store/cart/cart.action';
import { CartItem as TCartItem } from '../../app/store/cart/cart.types';

const CartDropdown = () => {
    const cartItems = useSelector(selectCartItems);
    const router = useRouter();
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const goToCheckoutHandler = useCallback(async () => {
        setIsCheckingOut(true);
        try {
            // Simulate a short delay (or actual navigation)
            await router.push('/checkout');
            dispatch(setIsCartOpen(false));
        } finally {
            setIsCheckingOut(false);
        }
    }, [router, dispatch]);

    const closeDropdown = useCallback(() => {
        dispatch(setIsCartOpen(false));
    }, [dispatch]);

    const incrementItem = useCallback((item: TCartItem) => {
        const productToAdd = {
            id: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
        };
        dispatch(addItemToCart(cartItems, productToAdd));
        toast.success(`Increased quantity of ${item.name}`);
    }, [dispatch, cartItems]);

    const decrementItem = useCallback((item: TCartItem) => {
        dispatch(removeItemFromCart(cartItems, item));
        toast.info(`Decreased quantity of ${item.name}`);
    }, [dispatch, cartItems]);

    const removeItem = useCallback((item: TCartItem) => {
        dispatch(clearItemFromCart(cartItems, item));
        toast.error(`Removed ${item.name} from cart`);
    }, [dispatch, cartItems]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                dispatch(setIsCartOpen(false));
            }
        };
        document.addEventListener('click', handleClickOutside, true);
        return () => document.removeEventListener('click', handleClickOutside, true);
    }, [dispatch]);

    return (
        <div
            ref={ref}
            className="absolute top-12 right-0 bg-card border border-border shadow-lg rounded-lg w-80 z-50 flex flex-col"
        >
            {/* Header with close button - using new Button component */}
            <div className="flex justify-end p-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeDropdown}
                    aria-label="Close cart"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="px-4 pb-4 flex flex-col gap-4">
                <div className="flex flex-col gap-1 overflow-y-auto max-h-80">
                    {cartItems.length ? (
                        cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                cartItem={item}
                                onIncrement={incrementItem}
                                onDecrement={decrementItem}
                                onRemove={removeItem}
                            />
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-4">
                            Your cart is empty
                        </p>
                    )}
                </div>
                {/* Checkout button - using new Button component */}
                <Button onClick={goToCheckoutHandler} isLoading={isCheckingOut}>GO TO CHECKOUT</Button>
            </div>
        </div>
    );
};

export default CartDropdown;