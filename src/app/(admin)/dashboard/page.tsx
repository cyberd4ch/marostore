"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LayoutDashboard, Users, ShoppingBag, DollarSign,
    TrendingUp, Loader2, ShoppingCart, UserCircleIcon,
    AlertTriangle, ArrowRight, CheckCircle, Percent
} from "lucide-react";
import { auth } from "@/app/utils/firebase/firebase.utils"; // Fixed path alias
import { SalesChart } from '@/components/admin/SalesChart';
import Link from 'next/link';
import { toast } from "sonner";

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [usersData, setUsersData] = useState<any[]>([]);
    
    const [stats, setStats] = useState([
        { title: "Total Revenue", value: "₵0.00", icon: DollarSign, color: "text-emerald-600" },
        { title: "Total Products", value: "0", icon: ShoppingBag, color: "text-blue-600" },
        { title: "Active Orders", value: "0", icon: Users, color: "text-orange-600" },
        { title: "Avg. Order Value", value: "₵0.00", icon: TrendingUp, color: "text-purple-600" },
    ]);

    const totals = useMemo(() => {
        const totalRevenue = orders.reduce((acc, order) => {
            // Only count completed/paid orders for revenue to keep stats honest
            const amount = Number(order.totalAmount) || 0;
            return order.status !== 'Cancelled' ? acc + amount : acc;
        }, 0);

        const activeOrdersCount = orders.filter(o => 
            !['Delivered', 'Cancelled', 'Returned'].includes(o.status)
        ).length;

        const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

        return {
            revenue: totalRevenue,
            active: activeOrdersCount,
            avg: avgOrderValue,
            products: inventory.length
        };
    }, [orders, inventory]);

    // 1. IMPROVED PRODUCT MAPPING (The Core Association)
const topProducts = useMemo(() => {
        const productMap: Record<string, { name: string, quantity: number, revenue: number }> = {};
        
        orders.forEach((order) => {
            order.items?.forEach((item: any) => {
                const id = item._id || item.id || 'unknown';
                if (!productMap[id]) {
                    productMap[id] = { name: item.name || "Deleted Product", quantity: 0, revenue: 0 };
                }
                productMap[id].quantity += (Number(item.quantity) || 1);
                productMap[id].revenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
            });
        });

        return Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    }, [orders]);

    // 2. LIVE INVENTORY ALERTS
    const lowStockItems = useMemo(() =>
        inventory.filter((item: any) => item.stock !== undefined && Number(item.stock) < 5),
        [inventory]);

    useEffect(() => {
        let isMounted = true;

        const fetchDashboardData = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;
                
                const token = await user.getIdToken(true);
                const headers = { 'Authorization': `Bearer ${token}` };

                // Fetch individually so one failure doesn't kill the dashboard
                const [prodRes, orderRes, userRes] = await Promise.allSettled([
                    fetch('/api/products', { headers }),
                    fetch('/api/orders', { headers }),
                    fetch('/api/users', { headers })
                ]);

                if (!isMounted) return;

                if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
                    const data = await prodRes.value.json();
                    setInventory(Array.isArray(data) ? data : []);
                }

                if (orderRes.status === 'fulfilled' && orderRes.value.ok) {
                    const data = await orderRes.value.json();
                    setOrders(Array.isArray(data) ? data : []);
                }

                if (userRes.status === 'fulfilled' && userRes.value.ok) {
                    const data = await userRes.value.json();
                    setUsersData(Array.isArray(data) ? data : []);
                }

            } catch (err) {
                console.error("Critical Dashboard Failure:", err);
                toast.error("Real-time sync interrupted");
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) fetchDashboardData();
            else setLoading(false);
        });

        return () => { isMounted = false; unsubscribe(); };
    }, []);

    const displayStats = [
        { title: "Total Revenue", value: `₵${totals.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600" },
        { title: "Total Products", value: totals.products.toString(), icon: ShoppingBag, color: "text-blue-600" },
        { title: "Active Orders", value: totals.active.toString(), icon: Users, color: "text-orange-600" },
        { title: "Avg. Order Value", value: `₵${totals.avg.toFixed(2)}`, icon: TrendingUp, color: "text-purple-600" },
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen space-y-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="h-8 w-8 text-slate-900" />
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Maro Analytics</h1>
                </div>
                {loading && <Loader2 className="animate-spin text-blue-600" />}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayStats.map((stat, idx) => (
                    <Card key={idx} className="border-none shadow-sm rounded-3xl bg-white hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Performance */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-6 h-full">
                         <div className="flex justify-between items-center mb-6 px-4">
                            <h2 className="text-lg font-bold uppercase tracking-tight">Revenue Stream</h2>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+12% vs last month</span>
                        </div>
                        <SalesChart orders={orders} />
                    </Card>
                </div>

                {/* Users and CRM */}
                <div className="lg:col-span-1">
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white h-full overflow-hidden flex flex-col">
                        <CardHeader className="border-b border-slate-50 bg-white sticky top-0">
                            <CardTitle className="text-lg font-bold uppercase">Customer Flow</CardTitle>
                        </CardHeader>
                        <div className="divide-y divide-slate-50 overflow-y-auto flex-grow">
                            {usersData.length > 0 ? usersData.slice(0, 8).map((user: any) => (
                                <div key={user.uid} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <UserCircleIcon className="h-6 w-6 text-slate-400" />
                                        </div>
                                        <div className="max-w-[140px]">
                                            <p className="font-bold text-sm truncate text-slate-900">{user.displayName || "Guest Customer"}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded-full ${user.isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {user.isAdmin ? 'Staff' : 'Client'}
                                    </span>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-400 text-xs">No customer data found</div>
                            )}
                        </div>
                        <Link href="/dashboard/users" className="p-4 bg-slate-50 text-center text-[10px] font-black text-blue-600 hover:bg-blue-50 transition-colors uppercase tracking-widest">
                            Audience Insights
                        </Link>
                    </Card>
                </div>

                {/* Best Sellers (Product-Order Association Table) */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-50 pb-6">
                            <div className="p-2 bg-blue-50 rounded-xl">
                                <ShoppingCart className="h-5 w-5 text-blue-600" />
                            </div>
                            <CardTitle className="text-xl font-black uppercase tracking-tight">High Velocity Products</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Name</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest">Volume</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase text-right tracking-widest">Gross Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {topProducts.length > 0 ? topProducts.map((product, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                            <td className="px-8 py-4 font-bold text-sm text-slate-900">{product.name}</td>
                                            <td className="px-8 py-4 text-center text-sm font-medium">
                                                <span className="bg-slate-100 px-3 py-1 rounded-lg">{product.quantity}</span>
                                            </td>
                                            <td className="px-8 py-4 text-right font-black text-sm text-emerald-600">₵{product.revenue.toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="text-center py-10 text-slate-400 text-xs uppercase font-bold tracking-widest">No Sales Recorded Yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* Stock Watch (Inventory Alerts) */}
                <div className="lg:col-span-1">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-xl">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                            </div>
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Stock Watch</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 flex-grow">
                            {lowStockItems.length > 0 ? (
                                lowStockItems.map((item: any) => (
                                    <div key={item._id} className="flex items-center justify-between p-4 bg-amber-50/30 rounded-3xl border border-amber-100 group hover:border-amber-300 transition-colors">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-black uppercase text-slate-900 truncate max-w-[140px]">{item.name}</p>
                                            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-tighter mt-1">Critical: {item.stock} Units Left</p>
                                        </div>
                                        <Link href="/dashboard/products" className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-all">
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-14 flex flex-col items-center">
                                    <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="h-8 w-8 text-emerald-500" />
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Inventory Healthy</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;