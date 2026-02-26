'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Package, Truck, Eye, MapPin, Mail, ShoppingBag, CreditCard, AlertTriangle, CheckCircle2, Phone, ClipboardList, Badge } from 'lucide-react';
import { auth } from "@/app/utils/firebase/firebase.utils";
import Image from 'next/image';

const OrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const token = await auth.currentUser?.getIdToken(true);
            const res = await fetch('/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.ok) {
                toast.success(`Order moved to ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 bg-slate-50 min-h-screen pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <p className="text-blue-600 font-bold text-sm tracking-widest uppercase">Fullfillment Center</p>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">Operations</h1>
                </div>
                {/* Quick Filters */}
                <div className="flex gap-2">
                    <div className="bg-white p-1 rounded-xl shadow-sm border flex">
                        <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase h-8 px-4 rounded-lg">All</Button>
                        <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase h-8 px-4 rounded-lg bg-orange-50 text-orange-600">Paid/Unshipped</Button>
                    </div>
                </div>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-3 text-2xl font-black italic tracking-tighter">
                            <ClipboardList className="w-8 h-8 text-blue-400" />
                            ORDER LOGISTICS
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50">
                                <TableHead className="pl-8 py-5">Order Info</TableHead>
                                <TableHead>Payment & Paystack</TableHead>
                                <TableHead>Fullfillment Status</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-32"><Package className="animate-bounce mx-auto text-slate-300" /></TableCell></TableRow>
                            ) : orders.map((order) => (
                                <TableRow key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="pl-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <div className="font-black text-slate-900 text-base italic uppercase">#{order.orderReference?.slice(-8)}</div>
                                            <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1">
                                                <Mail size={12}/> {order.customerEmail}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            {/* PAYSTACK INDICATOR */}
                                            {order.paymentStatus === 'success' ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                                                    <CheckCircle2 size={12}/>
                                                    <span className="text-[10px] font-black uppercase italic">Paid via Paystack</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 w-fit px-3 py-1 rounded-full border border-rose-100">
                                                    <AlertTriangle size={12}/>
                                                    <span className="text-[10px] font-black uppercase italic">Payment Failed</span>
                                                </div>
                                            )}
                                            <span className="text-[10px] font-mono text-slate-400 ml-1">{order.paystackRef || 'No Reference'}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            <select
                                                className={`text-[10px] font-black uppercase tracking-widest border-2 rounded-xl px-3 py-2 cursor-pointer transition-all ${
                                                    order.status === 'Delivered' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' :
                                                    order.status === 'Shipped' ? 'border-blue-500 bg-blue-50 text-blue-700' :
                                                    'border-slate-200 bg-slate-50'
                                                }`}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                value={order.status}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </TableCell>

                                    <TableCell className="font-black text-slate-900 text-lg">
                                        ₵{order.totalAmount?.toLocaleString()}
                                    </TableCell>

                                    <TableCell className="text-right pr-8">
                                        <OrderDetailsDialog order={order} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

function OrderDetailsDialog({ order }: { order: any }) {
    // Inventory Guard Check
    const isOutOfStock = order.items?.some((item: any) => item.quantity > (item.currentInventoryStock || 0));

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl border-2 font-bold uppercase text-[10px] hover:bg-slate-900 hover:text-white transition-all">
                    <Eye size={14} /> View Manifest
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none">
                <div className="bg-slate-900 p-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black italic tracking-tighter">ORDER DETAILS</h2>
                            <p className="text-blue-400 font-mono text-xs mt-1">REF: {order.paystackRef}</p>
                        </div>
                        <Badge className={order.paymentStatus === 'success' ? "bg-emerald-500" : "bg-rose-500"}>
                            {order.paymentStatus === 'success' ? 'TRANSACTION VERIFIED' : 'UNPAID'}
                        </Badge>
                    </div>
                </div>
                
                <div className="p-8 grid grid-cols-1 md:grid-cols-5 gap-8 bg-white">
                    {/* Customer & Shipping */}
                    <div className="md:col-span-2 space-y-6">
                        <section>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <MapPin size={12}/> Shipping Destination
                            </h4>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <p className="text-sm font-black text-slate-900 mb-1">{order.customerName || 'Customer'}</p>
                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                    {order.shippingAddress || "Digital Address/Location not specified"}
                                </p>
                                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-blue-600">
                                    <Phone size={14}/>
                                    <span className="text-sm font-bold">{order.customerPhone || 'No Phone'}</span>
                                </div>
                            </div>
                        </section>

                        {/* Inventory Alert */}
                        {isOutOfStock && (
                            <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                                <AlertTriangle className="text-rose-600 shrink-0" size={20}/>
                                <div>
                                    <p className="text-xs font-black text-rose-700 uppercase">Inventory Conflict</p>
                                    <p className="text-[10px] text-rose-600 font-medium">One or more items in this order exceed current stock levels.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div className="md:col-span-3 space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <ShoppingBag size={12}/> Cart Contents
                        </h4>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {order.items?.map((item: any, idx: number) => {
                                const outOfStock = item.quantity > (item.currentInventoryStock || 0);
                                return (
                                    <div key={idx} className={`flex gap-4 p-3 rounded-2xl border-2 transition-all ${outOfStock ? 'border-rose-200 bg-rose-50/30' : 'border-slate-50 bg-slate-50/50'}`}>
                                        <div className="h-16 w-16 bg-white rounded-xl border relative overflow-hidden shrink-0">
                                            {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized/>}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-black text-sm text-slate-900 uppercase italic">{item.name}</p>
                                                <p className="font-black text-sm text-blue-600">₵{item.price?.toLocaleString()}</p>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase">
                                                    Size: {item.size || 'N/A'} | Qty: {item.quantity}
                                                </p>
                                                {outOfStock ? (
                                                    <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded uppercase">Out of Stock</span>
                                                ) : (
                                                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase">In Stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-6 text-white mt-6">
                            <div className="flex justify-between items-center opacity-60 text-xs font-bold mb-2">
                                <span>SUBTOTAL</span>
                                <span>₵{order.totalAmount?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl font-black italic tracking-tighter">
                                <span>TOTAL PAID</span>
                                <span className="text-blue-400">₵{order.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default OrdersPage;