'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom'; // Import Portal
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
    const [mounted, setMounted] = useState(false); // To handle SSR

    // Handle hydration to prevent SSR errors with Portals
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const closeDropdown = useCallback(() => dispatch(setIsCartOpen(false)), [dispatch]);

    // Click outside logic
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };
        if (isCartOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCartOpen, closeDropdown]);

    // Prevent scrolling when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isCartOpen]);

    if (!mounted) return null;

    // Use createPortal to attach this to the document body
    return createPortal(
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[9999] flex justify-end">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeDropdown}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    
                    {/* Drawer Content */}
                    <motion.div
                        ref={ref}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative h-full w-[85vw] max-w-[400px] bg-white shadow-2xl flex flex-col sm:m-4 sm:h-[calc(100vh-2rem)] sm:rounded-[2.5rem] overflow-hidden"
                    >
                        <CardHeader className="shrink-0 pb-4 pt-10 px-6 sm:px-8">
                            <button onClick={closeDropdown} className="absolute right-6 top-8 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-slate-900">Your Cart</h2>
                                <Badge className="bg-slate-100 text-slate-900 rounded-full px-3">{cartItems.length}</Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-grow overflow-y-auto px-6 sm:px-8">
                            {cartItems.length ? (
                                <div className="divide-y divide-slate-100">
                                    {cartItems.map((item) => (
                                        <CartItem
                                            key={item.id}
                                            cartItem={item}
                                            onIncrement={() => dispatch(addItemToCart(cartItems, item))}
                                            onDecrement={() => dispatch(removeItemFromCart(cartItems, item))}
                                            onRemove={() => dispatch(clearItemFromCart(cartItems, item))}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-slate-400">
                                    <Box className="h-12 w-12 mb-4 opacity-20" />
                                    <p className="font-medium">Your cart is empty</p>
                                </div>
                            )}
                        </CardContent>

                        {cartItems.length > 0 && (
                            <CardFooter className="shrink-0 bg-slate-50 p-6 sm:p-8 flex flex-col gap-4">
                                <div className="flex justify-between items-end w-full">
                                    <span className="text-slate-500 font-medium">Total Amount</span>
                                    <span className="text-2xl font-black text-slate-900">
                                        ₵{cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0).toFixed(2)}
                                    </span>
                                </div>
                                <Button
                                    onClick={() => { router.push('/checkout'); closeDropdown(); }}
                                    className="h-14 w-full rounded-2xl bg-black text-white text-lg font-bold hover:opacity-90 transition-all"
                                >
                                    Proceed to Checkout
                                </Button>
                            </CardFooter>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default CartDropdown;