'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { 
    Package, Eye, MapPin, Mail, ShoppingBag, 
    AlertTriangle, CheckCircle2, Phone, ClipboardList, 
    Badge, Search, Download, Trash2, Edit3, Loader2, X
} from 'lucide-react';
import { auth } from "@/lib/utils/firebase/firebase.utils";
import Image from 'next/image';

const OrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchOrders = async () => {
        try {
            const token = await auth.currentUser?.getIdToken(true);
            const res = await fetch(`/api/admin/orders/?t=${Date.now()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
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

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = 
                order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.orderReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "all" || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

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

    const exportToCSV = () => {
        if (filteredOrders.length === 0) return toast.error("No data to export");
        const headers = ["Order ID", "Date", "Customer Name", "Email", "Phone", "Amount", "Status", "Address"];
        const csvRows = filteredOrders.map(order => [
            `#${order.orderReference?.slice(-8) || 'N/A'}`,
            new Date(order.createdAt).toLocaleDateString('en-GB'),
            `"${order.customerName || 'Guest'}"`,
            order.customerEmail,
            order.customerPhone || 'N/A',
            order.totalAmount,
            order.status,
            `"${order.shippingAddress?.replace(/\n/g, ' ') || ''}"`
        ]);
        const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("CSV Exported successfully");
    };

    return (
        <div className="p-4 md:p-8 space-y-6 bg-[#F9FAFB] min-h-screen pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <p className="text-blue-600 font-bold text-xs tracking-widest uppercase">Fulfillment Center</p>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Operations</h1>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:w-64 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                            placeholder="Search Customer or Ref..." 
                            className="pl-10 h-10 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Button 
                        onClick={exportToCSV}
                        variant="outline" 
                        className="h-10 rounded-xl border-slate-200 bg-white gap-2 font-bold text-[10px] uppercase hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                    >
                        <Download size={14} /> Export CSV
                    </Button>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32 h-10 rounded-xl border-slate-200 bg-white shadow-sm font-bold text-[10px] uppercase">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                <CardHeader className="bg-slate-900 text-white p-6">
                    <CardTitle className="flex items-center gap-3 text-xl font-black italic tracking-tighter uppercase">
                        <ClipboardList className="w-6 h-6 text-blue-400" />
                        Order Logistics
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-transparent">
                                <TableHead className="pl-8 py-4 text-[11px] uppercase font-bold text-slate-400">Order Info</TableHead>
                                <TableHead className="text-[11px] uppercase font-bold text-slate-400">Payment</TableHead>
                                <TableHead className="text-[11px] uppercase font-bold text-slate-400">Status</TableHead>
                                <TableHead className="text-[11px] uppercase font-bold text-slate-400">Amount</TableHead>
                                <TableHead className="text-right pr-8 text-[11px] uppercase font-bold text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-32">
                                        <Loader2 className="animate-spin mx-auto text-slate-300 w-10 h-10" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredOrders.map((order) => (
                                <TableRow key={order._id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                    <TableCell className="pl-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                            </span>
                                            <div className="font-black text-slate-900 text-sm italic uppercase">#{order.orderReference?.slice(-8)}</div>
                                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">{order.customerEmail}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full border ${order.paymentStatus === 'success' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                                            {order.paymentStatus === 'success' ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                                            <span className="text-[9px] font-black uppercase italic">{order.paymentStatus === 'success' ? 'Paid' : 'Failed'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <select
                                            className={`text-[9px] font-black uppercase tracking-widest border-2 rounded-lg px-2 py-1.5 cursor-pointer transition-all ${order.status === 'Delivered' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : order.status === 'Shipped' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50'}`}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            value={order.status}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </TableCell>
                                    <TableCell className="font-black text-slate-900 text-md">₵{order.totalAmount?.toLocaleString()}</TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            <OrderDetailsDialog order={order} />
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
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

/* --- ORDER DETAILS DIALOG COMPONENT --- */
function OrderDetailsDialog({ order }: { order: any }) {
    const isOutOfStock = order.items?.some((item: any) => item.quantity > (item.currentInventoryStock || 0));

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Eye size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-slate-900 p-8 text-white relative">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Order Manifest</h2>
                            <p className="text-blue-400 font-mono text-xs mt-1 uppercase tracking-widest">Paystack Ref: {order.paystackRef || 'N/A'}</p>
                        </div>
                        <Badge className={order.paymentStatus === 'success' ? "bg-emerald-500 text-white font-black" : "bg-rose-500 text-white font-black"}>
                            {order.paymentStatus === 'success' ? 'TRANSACTION VERIFIED' : 'UNPAID / FAILED'}
                        </Badge>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-5 gap-8 bg-white">
                    {/* Customer & Shipping Section */}
                    <div className="md:col-span-2 space-y-6">
                        <section>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <MapPin size={12} /> Shipping Destination
                            </h4>
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <p className="text-sm font-black text-slate-900 mb-1">{order.customerName || 'Customer'}</p>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                    {order.shippingAddress || "Digital Address not provided"}
                                </p>
                                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-blue-600">
                                    <Phone size={14} />
                                    <span className="text-sm font-bold">{order.customerPhone || 'No Phone provided'}</span>
                                </div>
                            </div>
                        </section>

                        {isOutOfStock && (
                            <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                                <AlertTriangle className="text-rose-600 shrink-0" size={20} />
                                <div>
                                    <p className="text-[10px] font-black text-rose-700 uppercase">Inventory Conflict</p>
                                    <p className="text-[9px] text-rose-600 font-medium leading-tight">Quantities in this order exceed current warehouse stock levels.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart Items Section */}
                    <div className="md:col-span-3 space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <ShoppingBag size={12} /> Items for Dispatch
                        </h4>
                        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {order.items?.map((item: any, idx: number) => {
                                const outOfStock = item.quantity > (item.currentInventoryStock || 0);
                                return (
                                    <div key={idx} className={`flex gap-4 p-3 rounded-2xl border-2 transition-all ${outOfStock ? 'border-rose-200 bg-rose-50/30' : 'border-slate-50 bg-slate-50/50'}`}>
                                        <div className="h-14 w-14 bg-white rounded-xl border relative overflow-hidden shrink-0">
                                            {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="font-black text-xs text-slate-900 uppercase italic leading-none">{item.name}</p>
                                                <p className="font-black text-xs text-blue-600">₵{item.price?.toLocaleString()}</p>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">
                                                    Size: {item.size || 'N/A'} | Qty: {item.quantity}
                                                </p>
                                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${outOfStock ? 'text-rose-600 bg-rose-100' : 'text-emerald-600 bg-emerald-100'}`}>
                                                    {outOfStock ? 'Shortage' : 'In Stock'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-slate-900 rounded-2xl p-6 text-white mt-4">
                            <div className="flex justify-between items-center text-xl font-black italic tracking-tighter uppercase">
                                <span>Grand Total</span>
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