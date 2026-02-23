'use client';

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { selectCartItems, selectCartTotal } from '@/store/cart/cart.selector';
import { Separator } from "@/components/ui/separator";

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference');
    const cartItems = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        // Simulate a brief verification delay for UX
        const timer = setTimeout(() => setIsVerifying(false), 1500);
        return () => clearTimeout(timer);
    }, [reference]);

    if (isVerifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 text-slate-200 animate-spin mb-4" />
                <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Verifying Payment...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
            <div className="max-w-[450px] w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
                {/* Success Icon */}
                <div className="flex justify-center mb-8">
                    <div className="h-12 w-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                        <Check className="h-6 w-6 text-[#4CAF50]" />
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
                        Thank you for your purchase!
                    </h1>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        We've sent you an email with your order details to <br />
                        <span className="font-semibold text-slate-900">order@example.com</span>
                    </p>
                </div>

                {/* Item List */}
                <div className="space-y-6 mb-8">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                                <p className="text-xs text-slate-500 line-clamp-1">Premium curated selection</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-slate-900">₵{(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-xs text-slate-400">×{item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator className="bg-slate-100 mb-6" />

                {/* Total */}
                <div className="flex justify-between items-center px-2">
                    <span className="text-slate-500 font-medium">Total</span>
                    <span className="text-2xl font-bold text-slate-900">₵{total.toFixed(2)}</span>
                </div>
                
                {/* Footer Reference */}
                <p className="mt-10 text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">
                    Ref: {reference || 'N/A'}
                </p>
            </div>
        </div>
    );
};

export default SuccessPage;