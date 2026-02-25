'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { Package, Truck, CheckCircle, Clock, Eye, MapPin, Mail, ShoppingBag } from 'lucide-react';
import { auth } from "@/app/utils/firebase/firebase.utils";

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
            // Safety check for array
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
                toast.success(`Order marked as ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <h1 className="text-4xl font-black tracking-tighter uppercase">Order Logistics</h1>

            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                    <CardTitle className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-blue-400" />
                        Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead className="pl-8">Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-20">Syncing database...</TableCell></TableRow>
                            ) : orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell className="pl-8 text-xs font-medium text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-slate-900">{order.customerEmail}</div>
                                        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{order.orderReference}</div>
                                    </TableCell>
                                    <TableCell>
                                        <select
                                            className="text-xs font-bold bg-slate-100 border-none rounded-full px-4 py-1.5 focus:ring-2 focus:ring-black cursor-pointer appearance-none"
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            value={order.status}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </TableCell>
                                    <TableCell className="font-black text-slate-900">₵{order.totalAmount?.toFixed(2)}</TableCell>
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

// Sub-component for the Order Details Modal
function OrderDetailsDialog({ order }: { order: any }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                    <Eye size={14} /> Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black">ORDER #{order.orderReference?.slice(-6)}</DialogTitle>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Customer Info */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
                            <MapPin className="text-blue-500 mt-1" size={18} />
                            <div>
                                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-tighter">Shipping Address</h4>
                                <p className="text-sm font-medium">{order.shippingAddress || "No address provided"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl">
                            <Mail className="text-blue-500 mt-1" size={18} />
                            <div>
                                <h4 className="font-bold text-sm text-slate-400 uppercase tracking-tighter">Contact</h4>
                                <p className="text-sm font-medium">{order.customerEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-slate-50 p-6 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4 border-b pb-2">
                            <ShoppingBag size={18} />
                            <h4 className="font-bold uppercase tracking-tighter">Cart Summary</h4>
                        </div>
                        <div className="space-y-3">
                            {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                    <span className="font-medium">{item.name} <span className="text-slate-400 text-xs">x{item.quantity || 1}</span></span>
                                    <span className="font-bold">₵{item.price?.toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between pt-2">
                                <span className="font-black">TOTAL</span>
                                <span className="font-black text-blue-600">₵{order.totalAmount?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default OrdersPage;