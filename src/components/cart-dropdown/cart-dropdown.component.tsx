'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Box } from "lucide-react";

import Button from '../button/button.component';
import CartItem from '../cart-item/cart-item.component';
import { selectCartItems, selectIsCartOpen } from '../../store/cart/cart.selector';
import { setIsCartOpen, addItemToCart, removeItemFromCart, clearItemFromCart } from '../../store/cart/cart.action';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "../ui/badge";

const CartDropdown = () => {
    const cartItems = useSelector(selectCartItems);
    const isCartOpen = useSelector(selectIsCartOpen);
    const router = useRouter();
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const cartTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const closeDropdown = useCallback(() => dispatch(setIsCartOpen(false)), [dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };
        if (isCartOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCartOpen, closeDropdown]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                /* Wrapper: Fixed on all to prevent "cutting off" at top */
                <div className="fixed inset-0 z-[999] flex justify-end">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeDropdown}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm sm:bg-black/20"
                    />
                    
                    <motion.div
                        ref={ref}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        /* Mobile: Full height, Desktop: Right-aligned Floating Card */
                        className="relative h-full w-[85vw] max-w-[450px] bg-white shadow-2xl sm:h-[calc(100vh-2rem)] sm:m-4 sm:rounded-[2.5rem] overflow-hidden flex flex-col"
                    >
                        <CardHeader className="relative shrink-0 pb-4 pt-10 px-6 sm:px-8">
                            <button onClick={closeDropdown} className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900">Your Cart</h2>
                                <Badge className="bg-slate-100 text-slate-900 rounded-full px-3">{cartCount}</Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-grow overflow-y-auto px-6 sm:px-8 custom-scrollbar">
                            {cartItems.length ? (
                                cartItems.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        cartItem={item}
                                        onIncrement={() => dispatch(addItemToCart(cartItems, item))}
                                        onDecrement={() => dispatch(removeItemFromCart(cartItems, item))}
                                        onRemove={() => dispatch(clearItemFromCart(cartItems, item))}
                                    />
                                ))
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center opacity-50">
                                    <Box className="h-12 w-12 mb-2" />
                                    <p>Cart is empty</p>
                                </div>
                            )}
                        </CardContent>

                        {cartItems.length > 0 && (
                            <CardFooter className="shrink-0 flex flex-col gap-3 bg-slate-50 p-6 sm:p-8">
                                <div className="w-full space-y-2">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Total</span>
                                        <span className="text-xl font-black text-slate-900">₵{cartTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Button
                                    onClick={() => { setIsCheckingOut(true); router.push('/checkout'); closeDropdown(); }}
                                    className="h-14 w-full rounded-2xl bg-black text-white font-bold"
                                >
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                                </Button>
                            </CardFooter>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartDropdown;