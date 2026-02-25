"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, ShoppingBag, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { auth } from "../../utils/firebase/firebase.utils";
import { SalesChart } from '@/components/admin/SalesChart';
import { ShoppingCart } from "lucide-react";
import { AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";
import Link from 'next/link';

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { title: "Total Revenue", value: "₵0.00", icon: DollarSign, color: "text-emerald-600" },
        { title: "Total Products", value: "0", icon: ShoppingBag, color: "text-blue-600" },
        { title: "Active Orders", value: "0", icon: Users, color: "text-orange-600" },
        { title: "Avg. Order Value", value: "₵0.00", icon: TrendingUp, color: "text-purple-600" },
    ]);
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);
    const [orders, setOrders] = useState([]);

    const getTopProducts = () => {
        const productMap: Record<string, { name: string, quantity: number, revenue: number }> = {};

        orders.forEach((order: any) => {
            order.items?.forEach((item: any) => {
                const id = item._id || item.name; // Fallback to name if id is missing
                if (!productMap[id]) {
                    productMap[id] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productMap[id].quantity += (item.quantity || 1);
                productMap[id].revenue += (item.price * (item.quantity || 1));
            });
        });

        // Convert to array and sort by revenue descending
        return Object.values(productMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5); // Take top 5
    };

    const topProducts = getTopProducts();

    const lowStockItems = inventory.filter((item: any) => (item.stock !== undefined && item.stock < 5));

    useEffect(() => {
        // 1. Define the unified fetcher
        const fetchAllData = async (user: any) => {
            try {
                setLoading(true);
                const token = await user.getIdToken(true); // Force refresh to catch isAdmin claim

                const [prodRes, orderRes] = await Promise.all([
                    fetch('/api/admin/products', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                if (!prodRes.ok || !orderRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const products = await prodRes.json();
                const orders = await orderRes.json();

                // Set Inventory state
                setInventory(products);
                setOrders(orders);

                // Calculate Stats
                const totalRevenue = orders.reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0);
                const activeOrders = orders.filter((o: any) => o.status !== 'Delivered').length;
                const avgValue = orders.length > 0 ? totalRevenue / orders.length : 0;

                setStats([
                    { title: "Total Revenue", value: `₵${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600" },
                    { title: "Total Products", value: products.length.toString(), icon: ShoppingBag, color: "text-blue-600" },
                    { title: "Active Orders", value: activeOrders.toString(), icon: Users, color: "text-orange-600" },
                    { title: "Avg. Order Value", value: `₵${avgValue.toFixed(2)}`, icon: TrendingUp, color: "text-purple-600" },
                ]);
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        // 2. Listen for Auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchAllData(user);
            } else {
                // Optional: redirect to login if no user is found
                setLoading(false);
            }
        });

        // 3. Cleanup listener on unmount
        return () => unsubscribe();
    }, []);

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-2 mb-8">
                <LayoutDashboard className="h-8 w-8 text-slate-900" />
                <h1 className="text-3xl font-bold text-slate-900">Analytics Overview</h1>
                {loading && <Loader2 className="animate-spin ml-4 text-slate-400" />}
            </div>

            {/* The Sales Chart Stats */}
            <div className="grid grid-cols-1 gap-8">
                {orders.length > 0 && <SalesChart orders={orders} />}
            </div>

            <div className="lg:col-span-2">
                <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white">
                    <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-50 pb-6">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold text-slate-900">Top Performing Products</CardTitle>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Best sellers by revenue</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Product Name</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Units Sold</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Total Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {topProducts.length > 0 ? (
                                        topProducts.map((product, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-5">
                                                    <span className="font-bold text-slate-900">{product.name}</span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {product.quantity} sold
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right font-black text-slate-900">
                                                    ₵{product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-10 text-center text-slate-400 italic">
                                                No sales data available yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white h-full">
                    <CardHeader className="flex flex-row items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                        <CardTitle className="text-xl font-bold">Stock Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {lowStockItems.length > 0 ? (
                            lowStockItems.map((item: any) => (
                                <div key={item._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        {item.imageUrl && (
                                            <div className="relative h-10 w-10 rounded-lg overflow-hidden border bg-white">
                                                <img src={item.imageUrl} alt={item.name} className="object-cover h-full w-full" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 truncate max-w-[120px]">{item.name}</p>
                                            <p className="text-[10px] text-amber-600 font-black uppercase">Only {item.stock} left</p>
                                        </div>
                                    </div>
                                    <Link href="/dashboard/products" className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-black">
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 mb-3">
                                    <CheckCircle size={24} />
                                </div>
                                <p className="text-sm text-slate-500 font-medium">All products are<br />well stocked!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border-none shadow-sm rounded-3xl overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                            <p className="text-[10px] text-slate-400 mt-1">Live from Firestore</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 h-96 w-full bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-center text-slate-400 font-medium italic shadow-sm">
                Sales Velocity Chart Placeholder
            </div>
        </div>
    );
};

export default AdminDashboard;