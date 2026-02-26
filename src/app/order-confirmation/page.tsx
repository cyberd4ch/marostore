'use client';

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    ShieldCheck, Lock, ArrowLeft, Phone,
    Wallet, CheckCircle2, Info
} from "lucide-react";

import { selectCartItems } from '../../store/cart/cart.selector';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { Mail } from "lucide-react"; // Add Mail icon
import { setGuestEmail } from '../../store/user/user.action'; // Use your action creator





import { selectCurrentUser, selectGuestEmail } from '../../store/user/user.selector';
import { error } from 'console';

const PaymentPage = () => {
    const cartItems = useSelector(selectCartItems);
    const currentUser = useSelector(selectCurrentUser);
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [momoNumber, setMomoNumber] = useState('');

const guestEmail = useSelector(selectGuestEmail);
const dispatch = useDispatch();

const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch({ 
    type: 'user/SET_GUEST_EMAIL', 
    payload: e.target.value 
});

    const cartTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const shippingCost = cartTotal > 200 ? 0 : 20;
    const totalPayable = cartTotal + shippingCost;

    const handlePayment = useCallback(async () => {
        const userEmail = currentUser?.email || guestEmail;

        if (!userEmail) {
        return toast.error("Please fill in all delivery details first");
    }

        if (!userEmail || !userEmail.includes('@')) {
            toast.error("Please provide a valid email address for your receipt.");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

setIsProcessing(true);

    try {
        // --- THE IRONCLAD HANDOFF ---
        // Save everything to localStorage so it survives the Paystack redirect
        localStorage.setItem('cart', JSON.stringify(cartItems));
        localStorage.setItem('pendingCheckout', JSON.stringify({

            email: userEmail,

        }));
        // ----------------------------

        // 2. Initialize the transaction with your API
        const response = await fetch('/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userEmail,
                amount: totalPayable, // The total calculated in your cart
            }),
        });

        const data = await response.json();

        if (data.authorization_url) {
            // 3. Redirect the user to Paystack
            window.location.href = data.authorization_url;
        } else {
            throw new Error(data.message || "Payment initialization failed");
        }
    } catch (error: any) {
        toast.error(error.message || "Something went wrong");
        setIsProcessing(false);
    }
    }, [totalPayable, cartItems]);

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="container mx-auto max-w-6xl px-6">
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mb-2 -ml-4 text-slate-500 hover:text-slate-900"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Shipping
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Finalize Payment</h1>
                    </div>
                    <Badge variant="secondary" className="w-fit h-8 px-4 rounded-full bg-green-50 text-green-700 border-green-100 flex gap-2">
                        <Lock className="h-3.5 w-3.5" />
                        SECURE PAYSTACK GATEWAY
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
                    <div className="space-y-6">
                        {!currentUser && (
                            <Card className="rounded-[2.5rem] border-none bg-white shadow-sm overflow-hidden">
                                <CardHeader className="bg-slate-100 p-8">
                                    <CardTitle className="text-xl flex items-center gap-2 text-slate-900">
                                        <Mail className="h-5 w-5" />
                                        Contact Information
                                    </CardTitle>
                                    <p className="text-slate-500 text-sm">Where should we send your digital receipt?</p>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <Input
                                                type="email"
                                                value={guestEmail || ''}
                                                onChange={onEmailChange}
                                                placeholder="alex@example.com"
                                                className="h-14 pl-12 rounded-2xl border-slate-200 focus:ring-slate-900 focus:border-slate-900 text-lg"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <Card className="rounded-[2.5rem] border-none bg-white shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-900 text-white p-8">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Wallet className="h-5 w-5" />
                                    Select Payment Method
                                </CardTitle>
                                <p className="text-slate-400 text-sm">Securely processed by Paystack</p>
                            </CardHeader>

                            <CardContent className="p-8 space-y-8">
                                <div className="relative group cursor-pointer rounded-3xl border-2 border-yellow-400 bg-yellow-50/30 p-6 transition-all shadow-md">
                                    <div className="absolute top-4 right-6">
                                        <CheckCircle2 className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-12 w-12 rounded-xl bg-yellow-400 flex items-center justify-center font-bold text-slate-900 shadow-inner">
                                            MTN
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">MTN Mobile Money</h3>
                                            <p className="text-sm text-yellow-700">Instant MoMo Push Request</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Momo Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <Input
                                                value={momoNumber}
                                                onChange={(e) => setMomoNumber(e.target.value)}
                                                placeholder="024 XXX XXXX"
                                                className="h-14 pl-12 rounded-2xl border-slate-200 focus:ring-yellow-400 focus:border-yellow-400 text-lg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                        You will be redirected to the secure <strong>Paystack</strong> portal.
                                        Ensure your phone is nearby to approve the <strong>MTN Mobile Money</strong> prompt.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 text-slate-600 font-medium text-sm">
                                <ShieldCheck className="h-5 w-5 text-green-500" />
                                Encrypted SSL
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 text-slate-600 font-medium text-sm">
                                <ShieldCheck className="h-5 w-5 text-green-500" />
                                Fraud Protection
                            </div>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-8">
                        <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-2xl">
                            <CardHeader className="px-8 pt-8">
                                <CardTitle className="text-2xl font-bold text-slate-900">Total Payable</CardTitle>
                                <p className="text-slate-500">Incl. shipping and service fees</p>
                            </CardHeader>

                            <CardContent className="px-8 pt-4">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-slate-600 font-medium">
                                        <span>Order Subtotal</span>
                                        <span>₵{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 font-medium">
                                        <span>Standard Shipping</span>
                                        <span>₵{shippingCost.toFixed(2)}</span>
                                    </div>
                                    <Separator className="bg-slate-100" />
                                    <div className="flex justify-between text-3xl font-black text-slate-900 pt-2">
                                        <span>Total</span>
                                        <span>₵{totalPayable.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 px-8 pb-10 pt-8">
                                <Button
                                    onClick={handlePayment}
                                    disabled={isProcessing || cartItems.length === 0}
                                    className="h-16 w-full rounded-2xl bg-yellow-400 text-slate-900 hover:bg-yellow-500 text-xl font-black shadow-lg shadow-yellow-200 transition-all active:scale-[0.98]"
                                >
                                    {isProcessing ? "Redirecting to Paystack..." : "Pay with MTN Momo"}
                                </Button>
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-xs text-slate-400 font-medium">Securely processed by</p>
                                    <div className="flex items-center gap-1 opacity-50 grayscale hover:grayscale-0 transition-all">
                                        <span className="text-lg font-bold tracking-tighter text-slate-900">paystack</span>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;