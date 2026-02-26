'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ArrowLeft, Receipt, Mail } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reference = searchParams.get('reference');
    
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [orderData, setOrderData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');
    
    // React 18 StrictMode fires useEffect twice. This ref ensures we only verify once.
    const hasVerified = useRef(false);

    useEffect(() => {
        if (!reference) {
            setStatus('error');
            setErrorMessage("No transaction reference found.");
            return;
        }

        if (hasVerified.current) return;
        hasVerified.current = true;

        const verifyTransaction = async () => {
            try {
                // 1. PULL TEMPORARY DATA FROM LOCAL STORAGE
                // You must save this in your cart page right before redirecting to Paystack
                const savedCheckoutData = JSON.parse(localStorage.getItem('pendingCheckout') || '{}');
                const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');

                // 2. FIRE TO THE BACKEND
                const response = await fetch('/api/orders/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        reference,
                        items: savedCart,
                        customerEmail: savedCheckoutData.email,
                        customerName: savedCheckoutData.name,
                        customerPhone: savedCheckoutData.phone,
                        shippingAddress: savedCheckoutData.address,
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setOrderData(data.data);
                    setStatus('success');
                    
                    // 3. ANNIHILATE THE CART (Ironclad cleanup)
                    localStorage.removeItem('cart');
                    localStorage.removeItem('pendingCheckout');
                    
                    // Note: If you use a global state manager like Zustand or Context, 
                    // you should also trigger your clearCart() function here.
                    
                } else {
                    setStatus('error');
                    setErrorMessage(data.message || "Verification failed");
                }
            } catch (error) {
                setStatus('error');
                setErrorMessage("Network error during verification. Don't worry, if you were charged, your order is secure in our system.");
            }
        };

        verifyTransaction();
    }, [reference]);

    if (status === 'loading') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                <h2 className="text-2xl font-black uppercase tracking-tighter">Securing your order...</h2>
                <p className="text-slate-500 font-medium">Please do not close this tab.</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                <XCircle className="w-20 h-20 text-rose-500 mb-6" />
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Something went wrong</h2>
                <p className="text-slate-500 mb-8 max-w-md text-center">{errorMessage}</p>
                <Button onClick={() => router.push('/shop')} className="rounded-full font-bold">
                    Return to Shop
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
                
                {/* Success Header */}
                <div className="text-center space-y-4">
                    <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border-8 border-emerald-50">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900">
                        Payment Successful
                    </h1>
                    <p className="text-slate-500 font-medium flex items-center justify-center gap-2">
                        <Mail size={16}/> Receipt sent to {orderData?.customerEmail}
                    </p>
                </div>

                {/* Digital Receipt */}
                <Card className="rounded-[2.5rem] border-none shadow-xl overflow-hidden bg-white relative">
                    {/* Decorative Receipt Edge */}
                    <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZjhmYWZjIiAvPjwvc3ZnPg==')] bg-repeat-x z-10"></div>
                    
                    <CardHeader className="bg-slate-900 text-white p-8 pt-12">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-xl font-black italic tracking-tighter">
                                    <Receipt className="text-blue-400" />
                                    MARO STORE
                                </CardTitle>
                                <p className="text-slate-400 text-xs font-mono mt-2">REF: {reference}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Amount Paid</p>
                                <p className="text-2xl font-black text-emerald-400">₵{orderData?.totalAmount?.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-8 space-y-8">
                        {/* Items */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Order Summary</h3>
                            {orderData?.items?.length > 0 ? (
                                orderData.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center font-medium">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md font-black">x{item.quantity}</span>
                                            <span className="uppercase text-sm">{item.name}</span>
                                        </div>
                                        <span>₵{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 italic">Items secured. Awaiting fulfillment sync.</p>
                            )}
                        </div>

                        {/* Delivery */}
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Details</h3>
                            <p className="font-bold text-slate-900">{orderData?.customerName}</p>
                            <p className="text-sm text-slate-600 mt-1">{orderData?.shippingAddress}</p>
                            <p className="text-sm text-slate-600 mt-1">{orderData?.customerPhone}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center pt-6">
                    <Button onClick={() => router.push('/shop')} variant="outline" className="rounded-2xl h-14 px-8 font-bold border-2 hover:bg-slate-900 hover:text-white transition-all gap-2">
                        <ArrowLeft size={18} /> Continue Shopping
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Next.js 14 requires useSearchParams to be wrapped in a Suspense boundary
export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-blue-600" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}