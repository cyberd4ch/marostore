'use client';

import { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import {
    CreditCard, ChevronRight, MapPin,
    User, ShieldCheck, Lock, ArrowLeft
} from "lucide-react";

import { selectCartItems } from '../../store/cart/cart.selector';
import { CartItem as TCartItem } from '../../store/cart/cart.types';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";

export default function CheckoutPage() {
    const cartItems = useSelector(selectCartItems);
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    // Pricing Logic from your Redux store reference
    const cartTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const shippingCost = cartTotal > 200 ? 0 : 20.00;
    const discount = 9.00; // Example static discount
    const totalPayable = cartTotal + shippingCost - discount;

    const handlePlaceOrder = useCallback(async () => {
        setIsProcessing(true);
        try {
            // Your payment gateway logic here
            toast.success("Order placed successfully!");
            router.push('/order-confirmation');
        } catch (error) {
            toast.error("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="container mx-auto max-w-7xl px-6">
                {/* Header with Navigation Back */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="mb-2 -ml-4 text-slate-500 hover:text-slate-900"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Cart
                        </Button>
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Checkout</h1>
                    </div>
                    <div className="hidden items-center gap-2 text-sm font-medium text-slate-500 md:flex">
                        <Lock className="h-4 w-4 text-green-500" />
                        Secure Checkout
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_450px]">
                    {/* LEFT COLUMN: FORMS */}
                    <div className="space-y-6">
                        {/* Coupon Code Section */}
                        <Card className="rounded-[2rem] border-none bg-white shadow-sm">
                            <CardHeader className="px-8 pt-8">
                                <CardTitle className="text-xl">Coupon Code</CardTitle>
                                <p className="text-sm text-slate-500">Enter code to get discount instantly</p>
                            </CardHeader>
                            <CardContent className="flex gap-3 px-8 pb-8 pt-4">
                                <Input
                                    placeholder="Add discount code"
                                    className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                                />
                                <Button className="h-12 rounded-xl bg-[#141414] px-8 font-bold text-white">
                                    Apply
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Accordion for Personal, Shipping, and Payment Details */}
                        <Accordion type="single" defaultValue="personal" className="space-y-4">
                            <AccordionItem value="personal" className="rounded-[2rem] border-none bg-white px-8 shadow-sm">
                                <AccordionTrigger className="py-6 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                            <User className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <span className="text-lg font-bold">Your Personal Details</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8 pt-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">First Name</label>
                                            <Input placeholder="Enter first name" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Last Name</label>
                                            <Input placeholder="Enter last name" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Email Address</label>
                                            <Input placeholder="Email address" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Phone Number</label>
                                            <Input placeholder="Phone number" className="h-12 rounded-xl" />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="shipping" className="rounded-[2rem] border-none bg-white px-8 shadow-sm">
                                <AccordionTrigger className="py-6 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                            <MapPin className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <span className="text-lg font-bold">Shipping Address</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8 pt-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold">Mailing Address</label>
                                            <Input placeholder="Mailing Address" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input placeholder="City" className="h-12 rounded-xl" />
                                            <Input placeholder="Post Code" className="h-12 rounded-xl" />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* RIGHT COLUMN: ORDER SUMMARY */}
                    <div className="lg:sticky lg:top-8">
                        <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-2xl">
                            <CardHeader className="px-8 pt-8">
                                <CardTitle className="text-2xl font-bold text-slate-900">Order Summary</CardTitle>
                                <p className="text-slate-500">You have {cartItems.length} items in your cart</p>
                            </CardHeader>

                            <CardContent className="px-8 pt-4">
                                {/* Item List */}
                                <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100 p-2">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                                                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-bold">₵{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-6 bg-slate-100" />

                                {/* Financials */}
                                <div className="space-y-3">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-slate-900">₵{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Shipping Cost (+)</span>
                                        <span className="font-bold text-slate-900">₵{shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Discount (-)</span>
                                        <span className="font-bold text-red-500">₵{discount.toFixed(2)}</span>
                                    </div>
                                    <Separator className="bg-slate-100" />
                                    <div className="flex justify-between text-2xl font-bold text-slate-900 pt-2">
                                        <span>Total Payable</span>
                                        <span>₵{totalPayable.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 px-8 pb-10 pt-6">
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || cartItems.length === 0}
                                    className="h-16 w-full rounded-2xl bg-[#141414] text-xl font-bold text-white hover:bg-black"
                                >
                                    {isProcessing ? "Processing..." : "Place Order"}
                                </Button>
                                <p className="text-center text-xs text-slate-400">
                                    By placing your order, you agree to our company <span className="font-bold underline">Privacy Policy</span> and <span className="font-bold underline">Conditions of use</span>.
                                </p>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}