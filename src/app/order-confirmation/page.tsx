'use client';

import { useCallback, useState, useEffect } from 'react'; // Added useEffect
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import {
    CreditCard, ChevronRight, MapPin,
    User, ShieldCheck, Lock, ArrowLeft, Loader2
} from "lucide-react";

import { selectCartItems } from '../../store/cart/cart.selector';
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

    // 1. FORM STATE (Hooking up the inputs)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postCode: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // 2. PRICING LOGIC
    const cartTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const shippingCost = cartTotal > 200 ? 0 : 20.00;
    const discount = 0.00; // Resetting to 0 for logic sake, adjust as needed
    const totalPayable = cartTotal + shippingCost - discount;

    // 3. THE ACTUAL PAYMENT LOGIC
    const handlePlaceOrder = async () => {
        // Validation
        if (!formData.email || !formData.firstName || !formData.address) {
            return toast.error("Please fill in your details first!");
        }

        if (cartItems.length === 0) {
            return toast.error("Your cart is empty!");
        }

        setIsProcessing(true);
        
        try {
            // A. Save Backup to LocalStorage (For the Success Page to read)
            const checkoutData = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                address: `${formData.address}, ${formData.city}`,
            };
            
            localStorage.setItem('pendingCheckout', JSON.stringify(checkoutData));
            localStorage.setItem('cart', JSON.stringify(cartItems));

            // B. Call Paystack API
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    amount: totalPayable,
                    cart: cartItems, // Metadata backup
                    customerDetails: checkoutData // Metadata backup
                }),
            });

            const data = await response.json();

            if (data.authorization_url) {
                // C. REDIRECT TO PAYSTACK
                window.location.href = data.authorization_url;
            } else {
                throw new Error(data.message || "Initialization failed");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="container mx-auto max-w-7xl px-6">
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
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 uppercase italic">Checkout</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_450px]">
                    <div className="space-y-6">
                        <Accordion type="single" defaultValue="personal" className="space-y-4">
                            <AccordionItem value="personal" className="rounded-[2rem] border-none bg-white px-8 shadow-sm">
                                <AccordionTrigger className="py-6 hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                                            <User className="h-5 w-5 text-slate-600" />
                                        </div>
                                        <span className="text-lg font-bold uppercase italic tracking-tighter">Your Personal Details</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8 pt-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase">First Name</label>
                                            <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase">Last Name</label>
                                            <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase">Email Address</label>
                                            <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase">Phone Number</label>
                                            <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="054XXXXXXX" className="h-12 rounded-xl" />
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
                                        <span className="text-lg font-bold uppercase italic tracking-tighter">Shipping Address</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8 pt-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase">Street / Digital Address</label>
                                            <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="GA-123-4567" className="h-12 rounded-xl" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="h-12 rounded-xl" />
                                            <Input id="postCode" value={formData.postCode} onChange={handleInputChange} placeholder="Post Code" className="h-12 rounded-xl" />
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
                                <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Summary</CardTitle>
                                <p className="text-slate-500 font-medium">You have {cartItems.length} items</p>
                            </CardHeader>

                            <CardContent className="px-8 pt-4">
                                <div className="max-h-[300px] space-y-4 overflow-y-auto pr-2">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-50 border p-2">
                                                <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="object-contain" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-xs font-bold uppercase text-slate-900">{item.name}</h4>
                                                <p className="text-[10px] font-black text-blue-600 uppercase">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-black">₵{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-6 bg-slate-100" />

                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">₵{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase text-slate-400">
                                        <span>Shipping</span>
                                        <span className="text-slate-900">₵{shippingCost.toFixed(2)}</span>
                                    </div>
                                    <Separator className="bg-slate-100" />
                                    <div className="flex justify-between text-3xl font-black italic uppercase tracking-tighter text-slate-900 pt-2">
                                        <span>Total</span>
                                        <span className="text-blue-600">₵{totalPayable.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 px-8 pb-10 pt-6">
                                <Button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || cartItems.length === 0}
                                    className="h-16 w-full rounded-2xl bg-slate-900 text-xl font-black italic uppercase tracking-tighter text-white hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" /> SECURING...
                                        </div>
                                    ) : (
                                        "Pay with Paystack"
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}