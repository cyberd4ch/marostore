'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Shipped': return <Truck className="w-4 h-4 text-blue-500" />;
            default: return <Clock className="w-4 h-4 text-yellow-500" />;
        }
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <h1 className="text-4xl font-black tracking-tighter">ORDER LOGISTICS</h1>
            
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-8">
                    <CardTitle className="flex items-center gap-3">
                        <Package className="w-6 h-6" />
                        Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={6} className="text-center py-20">Syncing with Paystack & DB...</TableCell></TableRow>
                            ) : orders.map((order: any) => (
                                <TableRow key={order._id}>
                                    <TableCell className="text-xs text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-slate-900">{order.customerEmail}</div>
                                        <div className="text-xs text-slate-400">{order.orderReference}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{order.items.length} Product(s)</Badge>
                                    </TableCell>
                                    <TableCell className="font-bold text-slate-900">₵{order.totalAmount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span className="text-sm font-medium">{order.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <select 
                                            className="text-xs bg-slate-100 border-none rounded-lg p-2 focus:ring-0"
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            value={order.status}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
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

export default OrdersPage;