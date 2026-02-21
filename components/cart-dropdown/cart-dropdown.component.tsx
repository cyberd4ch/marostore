'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Trash2, Minus, Plus, CreditCard, ChevronRight, Box } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const CartDropdown = () => {
    const cartItems = useSelector(selectCartItems);
    const router = useRouter();
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const cartTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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
        <div className="absolute right-0 top-full z-50 mt-4 w-screen max-w-[450px] px-4 sm:px-0 origin-top-right transition-all">
            <Card className="absolute top-16 right-4 w-full max-w-[450px] rounded-[2.5rem] border-none bg-white p-2 shadow-2xl">
                <CardHeader className="space-y-1 pb-4 pt-8 px-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight text-primary">Your Cart</h2>
                        {cartCount > 0 && (
                            <Badge variant="outline" className="rounded-full px-3 py-0.5 font-medium text-slate-600">
                                {cartCount} items
                            </Badge>
                        )}
                    </div>
                    <p className="text-base text-slate-500">Review your items before checkout</p>
                </CardHeader>
                <CardContent className="px-8 space-y-6">
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
                        <div className="flex flex-col items-center justify-center py-8 opacity-70">
                            <Box className="h-12 w-12 text-slate-300 mb-3" />
                            <p className="text-center text-muted-foreground py-4">
                                Your cart is empty
                            </p>
                        </div>
                    )}
                    {cartItems.length > 0 && (
                        <>
                            <Separator className="my-6 bg-slate-100" />
                            <div className="space-y-4">
                                <div className="flex justify-between text-lg font-medium text-slate-900">
                                    <span>Subtotal</span>
                                    <span>₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-medium text-slate-900">
                                    <span>Shipping</span>
                                    <span>{cartTotal > 200 ? 'Free' : '₵20.00'}</span>
                                </div>
                                <Separator className="bg-slate-100" />
                                <div className="flex justify-between text-2xl font-bold text-slate-900">
                                    <span>Total</span>
                                    <span>₵{(cartTotal > 200 ? cartTotal : cartTotal + 20).toFixed(2)}</span>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3 px-8 pb-10 pt-8">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 mb-2">
                        <Box className="h-4 w-4" />
                        Free shipping on orders over ₵200
                    </div>

                    <Button
                        onClick={goToCheckoutHandler}
                        disabled={cartItems.length === 0 || isCheckingOut}
                        className="h-14 w-full rounded-2xl bg-[#141414] text-lg font-bold text-white hover:bg-black disabled:opacity-50"
                    >
                        <CreditCard className="mr-3 h-5 w-5" />
                        {isCheckingOut ? 'Processing...' : 'Checkout'}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => {
                            dispatch(setIsCartOpen(false));
                            router.push('/cart');
                        }}
                        className="h-14 w-full rounded-2xl border-slate-200 text-lg font-bold text-slate-900 hover:bg-slate-50"
                    >
                        View Cart
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CartDropdown;