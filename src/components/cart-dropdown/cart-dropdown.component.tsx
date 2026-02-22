'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { X, CreditCard, Box, Trash2 } from "lucide-react";

import Button from '../button/button.component';
import CartItem from '../cart-item/cart-item.component';
import { selectCartItems, selectIsCartOpen } from '../../store/cart/cart.selector';
import {
    setIsCartOpen,
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
    clearAllItemsFromCart
} from '../../store/cart/cart.action';
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { toast } from 'sonner';

const CartDropdown = () => {
    const cartItems = useSelector(selectCartItems);
    const isCartOpen = useSelector(selectIsCartOpen);
    const router = useRouter();
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [showClearAll, setShowClearAll] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const closeDropdown = useCallback(() => {
        dispatch(setIsCartOpen(false));
        setShowClearAll(false);
    }, [dispatch]);

    // FIXED: Clear All Logic
    const clearAllHandler = () => {
        dispatch(clearAllItemsFromCart()); // Single action, no loop, no stale state
        toast.error("Cart cleared successfully", {
            icon: <Trash2 className="h-4 w-4" />,
        });
        setShowClearAll(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };
        if (isCartOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCartOpen, closeDropdown]);

    if (!mounted) return null;

    const cartTotal = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    return createPortal(
        <AnimatePresence shadow-xl>
            {isCartOpen && (
                <div className="fixed inset-0 z-[9999] flex justify-end items-start sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeDropdown}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                    />

                    <motion.div
                        ref={ref}
                        initial={{ x: '100%', opacity: 0.5 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        className="relative bg-white shadow-2xl flex flex-col w-[85vw] max-w-[420px] h-full sm:h-auto sm:max-h-[90vh] sm:rounded-[2.5rem] overflow-hidden"
                    >
                        <CardHeader className="shrink-0 pb-4 pt-10 px-6 sm:px-8">
                            <button onClick={closeDropdown} className="absolute right-6 top-8 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>

                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Your Cart</h2>

                                {/* REFINED: Clear All Animation */}
                                <div className="relative h-8 flex items-center">
                                    <AnimatePresence mode="wait">
                                        {!showClearAll ? (
                                            <motion.div
                                                key="badge"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                                                onClick={() => setShowClearAll(true)}
                                            >
                                                <Badge className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-3 py-1 font-bold cursor-pointer transition-transform active:scale-95">
                                                    {cartItems.length}
                                                </Badge>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                key="clear-btn"
                                                initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                onClick={(e) => { e.stopPropagation(); clearAllHandler(); }}
                                                className="flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                <span>Confirm Clear</span>
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className={`flex-grow overflow-y-auto px-6 sm:px-8 custom-scrollbar ${cartItems.length === 0 ? 'py-12' : 'py-2'}`}>
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
                                <div className="flex flex-col items-center justify-center text-slate-400 py-10">
                                    <Box className="h-16 w-16 mb-4 opacity-10" />
                                    <p className="font-bold uppercase tracking-widest text-[10px]">Your collection is empty</p>
                                </div>
                            )}
                        </CardContent>

                        {cartItems.length > 0 && (
                            <CardFooter className="shrink-0 bg-slate-50/80 p-6 sm:p-8 flex flex-col gap-4 border-t border-slate-100">
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Total Amount</span>
                                    <span className="text-2xl font-black text-slate-900">₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <Button
                                    onClick={() => { router.push('/checkout'); closeDropdown(); }}
                                    className="h-14 w-full rounded-2xl bg-[#141414] text-white text-lg font-bold hover:bg-black transition-all shadow-xl shadow-slate-200"
                                >
                                    <CreditCard className="mr-2 h-5 w-5" />
                                    Checkout Now
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