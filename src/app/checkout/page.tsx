'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { 
    User, MapPin, ArrowLeft, Loader2, ShieldCheck, Lock 
} from "lucide-react";

import { selectCartItems } from '@/store/cart/cart.selector';
import { selectCurrentUser } from '@/store/user/user.selector';
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
    const currentUser = useSelector(selectCurrentUser);
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    // 1. FORM STATE - Initialized with Redux data if available
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postCode: ''
    });

    // Auto-fill form when user is loaded
    useEffect(() => {
        if (currentUser) {
            const nameParts = (currentUser.displayName || '').split(' ');
            setFormData(prev => ({
                ...prev,
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: currentUser.email || '',
                phone: currentUser.phoneNumber || '',
                address: currentUser.address || '',
                city: currentUser.city || '',
            }));
        }
    }, [currentUser]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // 2. PRICING LOGIC
    const cartTotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
    const shippingCost = cartTotal > 200 ? 0 : 20.00;
    const totalPayable = cartTotal + shippingCost;

    // 3. PAYMENT LOGIC
    const handlePlaceOrder = async () => {
        // Strict Validation
        const requiredFields = ['firstName', 'email', 'address', 'city', 'phone'];
        const missing = requiredFields.filter(field => !formData[field as keyof typeof formData]);

        if (missing.length > 0) {
            return toast.error(`Please provide your ${missing.join(', ')}`);
        }

        if (cartItems.length === 0) {
            return toast.error("Your cart is empty!");
        }

        setIsProcessing(true);
        
        try {
            const checkoutData = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                address: `${formData.address}, ${formData.city}`,
            };
            
            // Temporary storage for success page
            localStorage.setItem('pendingCheckout', JSON.stringify(checkoutData));

            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    amount: totalPayable,
                    cart: cartItems,
                    customerDetails: checkoutData
                }),
            });

            const data = await response.json();

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error(data.message || "Payment initialization failed");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12">
            <div className="container mx-auto max-w-7xl px-6">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4 text-slate-500">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
                </Button>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic mb-8">Checkout</h1>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_450px]">
                    {/* LEFT: FORM */}
                    <div className="space-y-6">
                        <Accordion type="multiple" defaultValue={["personal", "shipping"]} className="space-y-4">
                            <AccordionItem value="personal" className="rounded-[2rem] border-none bg-white px-8 shadow-sm">
                                <AccordionTrigger className="hover:no-underline font-black uppercase italic">
                                    <User className="mr-2 h-5 w-5 text-blue-600" /> Personal Info
                                </AccordionTrigger>
                                <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="h-12 rounded-xl" />
                                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="h-12 rounded-xl" />
                                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="h-12 rounded-xl" />
                                    <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="h-12 rounded-xl" />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="shipping" className="rounded-[2rem] border-none bg-white px-8 shadow-sm">
                                <AccordionTrigger className="hover:no-underline font-black uppercase italic">
                                    <MapPin className="mr-2 h-5 w-5 text-blue-600" /> Shipping Details
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Street / Digital Address" className="h-12 rounded-xl" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="h-12 rounded-xl" />
                                        <Input id="postCode" value={formData.postCode} onChange={handleInputChange} placeholder="Post Code" className="h-12 rounded-xl" />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="lg:sticky lg:top-24">
                        <Card className="rounded-[2.5rem] border-none bg-white p-2 shadow-2xl">
                            <CardHeader className="px-8 pt-8">
                                <CardTitle className="text-2xl font-black italic uppercase italic">Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded-lg border object-contain" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold uppercase">{item.name}</p>
                                            <p className="text-[10px] font-black text-blue-600">QTY: {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-black">₵{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                                <Separator />
                                <div className="space-y-2 text-xs font-bold uppercase">
                                    <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>₵{cartTotal.toLocaleString()}</span></div>
                                    <div className="flex justify-between text-slate-400"><span>Shipping</span><span>₵{shippingCost.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-2xl font-black text-slate-900 pt-2"><span>Total</span><span className="text-blue-600">₵{totalPayable.toLocaleString()}</span></div>
                                </div>
                            </CardContent>
                            <CardFooter className="px-8 pb-10">
                                <Button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full h-16 rounded-2xl bg-slate-900 text-xl font-black italic uppercase text-white hover:bg-black transition-all shadow-xl">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : "Secure Checkout"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}