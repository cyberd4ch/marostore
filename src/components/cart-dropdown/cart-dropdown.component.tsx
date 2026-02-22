'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion
import { X, Trash2, Minus, Plus, CreditCard, ChevronRight, Box } from "lucide-react";
import { toast } from 'sonner';

import Button from '../button/button.component';
import CartItem from '../cart-item/cart-item.component';
import { selectCartItems } from '../../store/cart/cart.selector';
import { setIsCartOpen, addItemToCart, removeItemFromCart, clearItemFromCart } from '../../store/cart/cart.action';
import { CartItem as TCartItem } from '../../store/cart/cart.types';
import { Badge } from "../ui/badge";
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

    const closeDropdown = useCallback(() => dispatch(setIsCartOpen(false)), [dispatch]);

    // Click outside logic
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeDropdown]);

    return (
        /* BACKDROP: Dims the background on mobile to focus on the cart */
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none sm:absolute sm:inset-auto sm:right-0 sm:top-full">
            
            <motion.div
                ref={ref}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 h-full w-[85vw] sm:w-[450px] sm:h-auto sm:mt-4 sm:mr-4"
            >
                <Card className="flex h-full flex-col border-none bg-white shadow-2xl sm:rounded-[2.5rem] overflow-hidden">
                    
                    {/* HEADER WITH CLOSE BUTTON */}
                    <CardHeader className="relative space-y-1 pb-4 pt-10 px-6 sm:px-8">
                        <button 
                            onClick={closeDropdown}
                            className="absolute right-4 top-4 p-2 rounded-full hover:bg-slate-100 transition-colors sm:right-6 sm:top-8"
                        >
                            <X className="h-6 w-6 text-slate-400" />
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Your Cart</h2>
                            {cartCount > 0 && (
                                <Badge className="bg-slate-100 text-slate-900 hover:bg-slate-100 border-none rounded-full px-3">
                                    {cartCount}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm sm:text-base text-slate-500">Premium selection</p>
                    </CardHeader>

                    {/* SCROLLABLE CONTENT AREA */}
                    <CardContent className="flex-grow overflow-y-auto px-6 sm:px-8 space-y-6">
                        {cartItems.length ? (
                            <div className="divide-y divide-slate-50">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="py-4">
                                        <CartItem
                                            cartItem={item}
                                            onIncrement={() => dispatch(addItemToCart(cartItems, item))}
                                            onDecrement={() => dispatch(removeItemFromCart(cartItems, item))}
                                            onRemove={() => dispatch(clearItemFromCart(cartItems, item))}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-60 flex-col items-center justify-center opacity-70">
                                <Box className="h-12 w-12 text-slate-200 mb-4" />
                                <p className="text-slate-400 font-medium">Your cart is empty</p>
                            </div>
                        )}
                    </CardContent>

                    {/* FOOTER: Fixed at bottom */}
                    {cartItems.length > 0 && (
                        <CardFooter className="flex flex-col gap-4 bg-slate-50/50 px-6 sm:px-8 py-8">
                            <div className="w-full space-y-3">
                                <div className="flex justify-between text-sm sm:text-base font-medium text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl sm:text-2xl font-black text-slate-900 pt-2 border-t border-slate-200">
                                    <span>Total</span>
                                    <span>₵{(cartTotal > 200 ? cartTotal : cartTotal + 20).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex flex-col w-full gap-3 mt-2">
                                <Button
                                    onClick={() => {
                                        setIsCheckingOut(true);
                                        router.push('/checkout');
                                        closeDropdown();
                                    }}
                                    className="h-14 w-full rounded-2xl bg-black text-white hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 text-lg font-bold"
                                >
                                    <CreditCard className="h-5 w-5" />
                                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        closeDropdown();
                                        router.push('/cart');
                                    }}
                                    className="h-14 w-full rounded-2xl border-slate-200 bg-white text-slate-900 font-bold hover:bg-slate-50 transition-colors"
                                >
                                    View Detailed Cart
                                </Button>
                            </div>
                        </CardFooter>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default CartDropdown;