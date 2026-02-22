'use client';

import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { toast } from 'sonner';
import {
    Trash2, Minus, Plus, ChevronDown,
    Package, ShieldCheck, Truck, CreditCard, Box
} from "lucide-react";

import { selectCartItems } from '../../store/cart/cart.selector';
import {
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
} from '../../store/cart/cart.action';
import { CartItem as TCartItem } from '../../store/cart/cart.types';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
    const cartItems = useSelector(selectCartItems);
    const router = useRouter();
    const dispatch = useDispatch();

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    // Dynamic calculations based on your Redux state
    const cartTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const shippingCost = cartTotal > 200 ? 0 : 20;
    const finalTotal = cartTotal + shippingCost;

    const goToCheckoutHandler = useCallback(async () => {
        if (cartItems.length === 0) return;
        setIsCheckingOut(true);
        try {
            await router.push('/checkout');
        } finally {
            setIsCheckingOut(false);
        }
    }, [router, cartItems.length]);

    const incrementItem = useCallback((item: TCartItem) => {
        dispatch(addItemToCart(cartItems, item));
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

    return (
        <div className="container mx-auto max-w-6xl p-6 py-12">
            {/* Page Header */}
            <div className="mb-8 space-y-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shopping Cart</h1>
                <p className="text-base text-slate-500">
                    {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
                {/* Left Column: Cart Items List */}
                <div className="space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-24 bg-slate-50">
                            <Box className="h-16 w-16 text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-900">Your cart is empty</h3>
                            <p className="text-slate-500 mt-2 mb-6">Looks like you haven't added anything yet.</p>
                            <Button onClick={() => router.push('/shop')} className="rounded-xl px-8 h-12">
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-sm"
                            >
                                {/* Product Image Area */}
                                <div className="relative h-48 sm:h-auto sm:w-[180px] shrink-0 bg-[#EFEFEF] p-4 flex items-center justify-center">
                                    <Image
                                        src={item.imageUrl} // Using your existing property name
                                        alt={item.name}
                                        width={120}
                                        height={120}
                                        className="object-contain"
                                    />
                                </div>

                                {/* Product Details Area */}
                                <div className="flex flex-1 flex-col justify-between p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                                            {/* Note: If you have a variant property in your Redux state, add it here */}
                                            <p className="text-sm font-medium text-slate-500">Standard</p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item)}
                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        {/* Quantity Toggle */}
                                        <div className="flex items-center rounded-xl border border-slate-200 p-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => decrementItem(item)}
                                                className="h-8 w-8 rounded-lg hover:bg-slate-100"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => incrementItem(item)}
                                                className="h-8 w-8 rounded-lg hover:bg-slate-100"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Pricing using your currency symbol */}
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-slate-900">₵{item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Right Column: Order Summary */}
                <div>
                    <Card className="rounded-2xl border-slate-200 shadow-sm sticky top-6">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
                                <p className="text-sm text-slate-500">
                                    Review your order details and shipping information
                                </p>
                            </div>

                            {/* Shipping Method */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Shipping Method</label>
                                <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left bg-slate-50">
                                    <div>
                                        <p className="font-semibold text-slate-900">Standard Shipping</p>
                                        <p className="text-sm text-slate-500">
                                            {shippingCost === 0 ? 'Free (over ₵200)' : 'Flat Rate'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-slate-900">
                                            {shippingCost === 0 ? 'Free' : `₵${shippingCost.toFixed(2)}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-900">Promo Code</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter promo code"
                                        className="h-12 rounded-xl border-slate-200 px-4"
                                    />
                                    <Button variant="outline" className="h-12 rounded-xl border-slate-200 px-6 font-bold hover:bg-slate-50">
                                        Apply
                                    </Button>
                                </div>
                            </div>

                            <Separator className="bg-slate-100" />

                            {/* Totals */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-900">₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="font-medium text-slate-900">
                                        {shippingCost === 0 ? 'Free' : `₵${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
                                    <span>Total</span>
                                    <span>₵{finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <Separator className="bg-slate-100" />

                            {/* Trust Badges */}
                            <div className="space-y-3 pb-2 text-sm font-medium text-slate-700">
                                <div className="flex items-center gap-3">
                                    <Package className="h-5 w-5 text-slate-400" />
                                    Free returns within 30 days
                                </div>
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-5 w-5 text-slate-400" />
                                    Secure payment
                                </div>
                                <div className="flex items-center gap-3">
                                    <Truck className="h-5 w-5 text-slate-400" />
                                    Fast delivery
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                onClick={goToCheckoutHandler}
                                disabled={cartItems.length === 0 || isCheckingOut}
                                className="h-14 w-full rounded-xl bg-[#141414] text-base font-bold text-white hover:bg-black disabled:opacity-50"
                            >
                                <CreditCard className="mr-2 h-5 w-5" />
                                {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}