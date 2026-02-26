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
        // 1. IMPROVED REFERENCE GRABBER (Ironclad Fallback)
        const getRef = () => {
            // Try Next.js searchParams first
            if (reference) return reference;
            
            // Fallback: Manual Parse (Works if Next.js hasn't hydrated yet)
            if (typeof window !== 'undefined') {
                const params = new URLSearchParams(window.location.search);
                return params.get('reference') || params.get('trxref');
            }
            return null;
        };

        const activeRef = getRef();

        if (!activeRef) {
            // If still no ref, wait 1.5s and try one last time before erroring
            const timeout = setTimeout(() => {
                const retryRef = getRef();
                if (!retryRef) {
                    setStatus('error');
                    setErrorMessage("We couldn't find your transaction reference. If you were charged, please contact support with your mobile money receipt.");
                } else {
                    // If retry finds it, trigger the verification
                    verifyTransaction(retryRef);
                }
            }, 1500);
            return () => clearTimeout(timeout);
        }

        if (hasVerified.current) return;
        
        // Internal helper to keep useEffect clean
        const verifyTransaction = async (refToVerify: string) => {
            hasVerified.current = true;
            try {
                // 2. PULL DATA FROM LOCAL STORAGE
                const savedCheckoutData = JSON.parse(localStorage.getItem('pendingCheckout') || '{}');
                const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');

                // 3. FIRE TO BACKEND
                const response = await fetch('/api/orders/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        reference: refToVerify, 
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
                    
                    // 4. CLEANUP
                    localStorage.removeItem('cart');
                    localStorage.removeItem('pendingCheckout');
                } else {
                    setStatus('error');
                    setErrorMessage(data.message || "Verification failed");
                }
            } catch (error) {
                setStatus('error');
                setErrorMessage("Connection issue. Your payment was likely successful, but we couldn't sync the receipt. Refresh the page to try again.");
            }
        };

        verifyTransaction(activeRef);
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
                <p className="text-slate-500 mb-8 max-w-md text-center font-medium leading-relaxed">{errorMessage}</p>
                <Button onClick={() => router.push('/shop')} className="rounded-full font-bold px-8 h-12">
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
                    <div className="absolute top-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgNSwxMCAxMCwwIiBmaWxsPSIjZjhmYWZjIiAvPjwvc3ZnPg==')] bg-repeat-x z-10"></div>
                    
                    <CardHeader className="bg-slate-900 text-white p-8 pt-12">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-xl font-black italic tracking-tighter">
                                    <Receipt className="text-blue-400" />
                                    MARO STORE
                                </CardTitle>
                                <p className="text-slate-400 text-[10px] font-mono mt-2 uppercase tracking-widest">
                                    REF: {orderData?.orderReference || reference}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Paid</p>
                                <p className="text-2xl font-black text-emerald-400">₵{orderData?.totalAmount?.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Order Summary</h3>
                            {orderData?.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center font-medium">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md font-black">x{item.quantity}</span>
                                        <span className="uppercase text-sm">{item.name}</span>
                                    </div>
                                    <span className="text-slate-900 font-bold">₵{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Delivery Details</h3>
                            <p className="font-bold text-slate-900">{orderData?.customerName}</p>
                            <p className="text-sm text-slate-600 mt-1">{orderData?.shippingAddress}</p>
                            <p className="text-sm text-slate-600 mt-1 font-mono">{orderData?.customerPhone}</p>
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

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
                <p className="font-black italic uppercase tracking-tighter animate-pulse">Initializing...</p>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}