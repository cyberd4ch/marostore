'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, XCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!reference) {
                setStatus('failed');
                return;
            }

            try {
                const response = await fetch(`/api/payment/verify?reference=${reference}`);
                const data = await response.json();

                if (data.verified) {
                    setStatus('success');
                    // Optional: You could dispatch a clearCart() action here
                } else {
                    setStatus('failed');
                }
            } catch (error) {
                setStatus('failed');
            }
        };

        verifyPayment();
    }, [reference]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 text-slate-900 animate-spin mb-4" />
                <p className="font-bold tracking-tighter uppercase text-slate-500">Verifying Payment...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-black mb-2">VERIFICATION FAILED</h1>
                <p className="text-slate-500 mb-8 text-center">We couldn't verify your payment. If you were charged, please contact support.</p>
                <Link href="/shop" className="bg-black text-white px-8 py-3 rounded-xl font-bold">Return to Shop</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
             {/* ... Your "Thank You" UI from the previous step ... */}
             <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
                <div className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 uppercase">Order Confirmed</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">Ref: {reference}</p>
                    <p className="text-slate-500 font-medium">Your payment was verified. Maro Store is preparing your drop.</p>
                </div>
                {/* ... Continue with Summary and Buttons ... */}
                <div className="p-8">
                    <Link href="/shop" className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                        <ShoppingBag size={18} /> Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;