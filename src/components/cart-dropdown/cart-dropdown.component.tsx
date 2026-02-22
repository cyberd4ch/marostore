'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Box, Trash2, RotateCcw } from "lucide-react";

import Button from '../button/button.component';
import CartItem from '../cart-item/cart-item.component';
import { selectCartItems, selectIsCartOpen } from '../../store/cart/cart.selector';
import { setIsCartOpen, clearItemFromCart } from '../../store/cart/cart.action';
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
    
    // Toggle state for the Badge -> Delete All button
    const [showClearAll, setShowClearAll] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const closeDropdown = useCallback(() => {
        dispatch(setIsCartOpen(false));
        setShowClearAll(false); // Reset toggle on close
    }, [dispatch]);

    const clearAllHandler = () => {
        cartItems.forEach(item => dispatch(clearItemFromCart(cartItems, item)));
        toast.error("Cart cleared");
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
        <AnimatePresence>
            {isCartOpen && (
                <div className="fixed inset-0 z-[9999] flex justify-end items-start sm:p-4">
                    {/* Backdrop - Lowered opacity on desktop for a cleaner look */}
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
                        /* KEY CHANGE: 
                           Mobile: h-full (Full drawer)
                           Desktop: max-h-[85vh] h-auto (Grows with items)
                        */
                        className="relative bg-white shadow-2xl flex flex-col w-[85vw] max-w-[420px] h-full sm:h-auto sm:max-h-[90vh] sm:rounded-[2.5rem] overflow-hidden"
                    >
                        <CardHeader className="shrink-0 pb-4 pt-10 px-6 sm:px-8">
                            <button onClick={closeDropdown} className="absolute right-6 top-8 p-2 rounded-full hover:bg-slate-100 transition-colors">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                            
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Your Cart</h2>
                                
                                {/* Dynamic Badge/Button Toggle */}
                                <div className="relative overflow-hidden cursor-pointer" onClick={() => setShowClearAll(!showClearAll)}>
                                    <AnimatePresence mode="wait">
                                        {!showClearAll ? (
                                            <motion.div
                                                key="count"
                                                initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                                            >
                                                <Badge className="bg-slate-100 text-slate-900 hover:bg-slate-200 rounded-full px-3 py-1 font-bold">
                                                    {cartItems.length}
                                                </Badge>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                key="clear"
                                                initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}
                                                onClick={(e) => { e.stopPropagation(); clearAllHandler(); }}
                                                className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="h-3 w-3" /> CLEAR ALL
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
                                        <CartItem key={item.id} cartItem={item} 
                                            onIncrement={() => {}} // Connect your dispatch logic
                                            onDecrement={() => {}} 
                                            onRemove={() => {}} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-400 py-10">
                                    <Box className="h-16 w-16 mb-4 opacity-10" />
                                    <p className="font-bold uppercase tracking-widest text-xs">Cart Empty</p>
                                </div>
                            )}
                        </CardContent>

                        {cartItems.length > 0 && (
                            <CardFooter className="shrink-0 bg-slate-50/50 p-6 sm:p-8 flex flex-col gap-4 border-t border-slate-100">
                                <div className="flex justify-between items-end w-full">
                                    <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Subtotal</span>
                                    <span className="text-2xl font-black text-slate-900">₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <Button
                                    onClick={() => { router.push('/checkout'); closeDropdown(); }}
                                    className="h-14 w-full rounded-2xl bg-black text-white text-lg font-bold hover:scale-[1.01] transition-all active:scale-[0.98]"
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