"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { Check, Loader2, ShoppingBag, Download, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { selectCartItems, selectCartTotal } from '@/store/cart/cart.selector';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { clearAllItemsFromCart } from '@/store/cart/cart.action';
import { selectCurrentUser, selectGuestEmail } from '@/store/user/user.selector';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference');
    const dispatch = useDispatch();
    const hasFinalized = useRef(false);

    const cartItems = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const currentUser = useSelector(selectCurrentUser);
    const guestEmail = useSelector(selectGuestEmail);

    const [isVerifying, setIsVerifying] = useState(true);
    const [shippingDetails, setShippingDetails] = useState<any>(null);
    // Backup state to keep items visible after cart is cleared
    const [purchasedItems, setPurchasedItems] = useState<any[]>([]);
    const [finalTotal, setFinalTotal] = useState(0);

    useEffect(() => {
        const savedData = localStorage.getItem('pendingCheckout');
        if (savedData) setShippingDetails(JSON.parse(savedData));

        // Capture current cart state before it gets cleared
        if (cartItems.length > 0 && purchasedItems.length === 0) {
            setPurchasedItems(cartItems);
            setFinalTotal(total);
        }

        const finalizeOrder = async () => {
            if (!reference || hasFinalized.current) {
                setIsVerifying(false);
                return;
            }

            hasFinalized.current = true;
            const userEmail = currentUser?.email || guestEmail;

            try {
                // 1. SAVE TO MONGODB
                await fetch('/api/orders/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderReference: reference,
                        customerEmail: userEmail || 'Guest',
                        items: cartItems,
                        totalAmount: total,
                        shippingAddress: savedData ? JSON.parse(savedData).address : "N/A"
                    }),
                });

                // 2. SEND EMAIL
                await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userEmail,
                        orderId: reference,
                        cartItems: cartItems,
                        total: total,
                    }),
                });

                toast.success("Order secured!");
                dispatch(clearAllItemsFromCart());
            } catch (error) {
                console.error("Finalization error:", error);
            } finally {
                setIsVerifying(false);
            }
        };

        const timer = setTimeout(finalizeOrder, 1500);
        return () => clearTimeout(timer);
    }, [reference, cartItems, currentUser, guestEmail, total, dispatch, purchasedItems.length]);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("MARO STORE RECEIPT", 14, 20);
        doc.setFontSize(10);
        doc.text(`Ref: ${reference}`, 14, 30);
        
        const tableRows = purchasedItems.map(item => [
            item.name,
            item.quantity,
            `₵${item.price.toFixed(2)}`,
            `₵${(item.price * item.quantity).toFixed(2)}`
        ]);

        autoTable(doc, {
            startY: 40,
            head: [['Product', 'Qty', 'Price', 'Subtotal']],
            body: tableRows,
        });

        doc.text(`Total Paid: ₵${finalTotal.toFixed(2)}`, 14, (doc as any).lastAutoTable.finalY + 10);
        doc.save(`Receipt_${reference}.pdf`);
    };

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
            <div className="max-w-[450px] w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                        <Check className="h-6 w-6 text-[#4CAF50]" />
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter">Order Success!</h1>
                    <p className="text-slate-500 text-sm">Thank you {shippingDetails?.name || 'Customer'}</p>
                </div>

                <div className="mb-6 p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-slate-400">Shipping To</p>
                        <p className="text-xs font-bold text-slate-700">{shippingDetails?.address || 'Standard Delivery'}</p>
                    </div>
                </div>

                {/* PRODUCT LISTING */}
                <div className="space-y-4 mb-6 max-h-[200px] overflow-y-auto pr-2">
                    {purchasedItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-xl overflow-hidden border bg-white shrink-0">
                                <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate uppercase">{item.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold">QTY: {item.quantity}</p>
                            </div>
                            <p className="text-xs font-black">₵{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <Separator className="mb-6" />

                <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-slate-500 font-bold uppercase text-xs">Total Paid</span>
                    <span className="text-xl font-black text-blue-600">₵{finalTotal.toFixed(2)}</span>
                </div>

                <div className="space-y-3">
                    <Button variant="outline" onClick={generatePDF} className="w-full h-12 rounded-2xl font-bold flex gap-2">
                        <Download size={18} /> Receipt (PDF)
                    </Button>

                    <Link href="/shop" className="w-full">
                        <Button className="w-full h-14 bg-black text-white rounded-2xl font-bold italic uppercase tracking-widest shadow-lg">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                <p className="mt-6 text-center text-[10px] text-slate-300 font-bold uppercase">
                    Ref: {reference}
                </p>
            </div>
        </div>
    );
};

export default SuccessPage;