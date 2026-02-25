"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LayoutDashboard, Users, ShoppingBag, DollarSign,
    TrendingUp, Loader2, ShoppingCart, UserCircleIcon,
    AlertTriangle, ArrowRight, CheckCircle
} from "lucide-react";
import { auth } from "../../utils/firebase/firebase.utils";
import { SalesChart } from '@/components/admin/SalesChart';
import Link from 'next/link';

interface User {
    uid: string;
    displayName: string | null;
    email: string;
    isAdmin: boolean;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { title: "Total Revenue", value: "₵0.00", icon: DollarSign, color: "text-emerald-600" },
        { title: "Total Products", value: "0", icon: ShoppingBag, color: "text-blue-600" },
        { title: "Active Orders", value: "0", icon: Users, color: "text-orange-600" },
        { title: "Avg. Order Value", value: "₵0.00", icon: TrendingUp, color: "text-purple-600" },
    ]);
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [usersData, setUsersData] = useState<any[]>([]);

    // Memoized Top Products calculation
    const topProducts = useMemo(() => {
        const productMap: Record<string, { name: string, quantity: number, revenue: number }> = {};
        orders.forEach((order: any) => {
            order.items?.forEach((item: any) => {
                const id = item._id || item.name;
                if (!productMap[id]) {
                    productMap[id] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productMap[id].quantity += (item.quantity || 1);
                productMap[id].revenue += (Number(item.price) * (item.quantity || 1));
            });
        });
        return Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    }, [orders]);

    const lowStockItems = useMemo(() =>
        inventory.filter((item: any) => item.stock !== undefined && item.stock < 5),
        [inventory]);

    useEffect(() => {
        const fetchAllData = async (user: any) => {
            try {
                setLoading(true);
                const token = await user.getIdToken(true);

                const [prodRes, orderRes, usersRes] = await Promise.all([
                    fetch('/api/admin/products', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }),
                ]);

                if (!prodRes.ok || !orderRes.ok) throw new Error("Failed to fetch");

                const products = await prodRes.json();
                const fetchedOrders = await orderRes.json();
                const fetchedUsers = usersRes.ok ? await usersRes.json() : [];

                setInventory(products);
                setOrders(fetchedOrders);
                setUsersData(fetchedUsers);

                const totalRevenue = fetchedOrders.reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0);
                const activeOrders = fetchedOrders.filter((o: any) => o.status !== 'Delivered').length;
                const avgValue = fetchedOrders.length > 0 ? totalRevenue / fetchedOrders.length : 0;

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

        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) fetchAllData(user);
            else setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="p-8 bg-slate-50 min-h-screen space-y-8">
            <div className="flex items-center gap-2 mb-4">
                <LayoutDashboard className="h-8 w-8 text-slate-900" />
                <h1 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase">Maro Analytics</h1>
                {loading && <Loader2 className="animate-spin ml-4 text-slate-400" />}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border-none shadow-sm rounded-3xl bg-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold uppercase text-slate-400 tracking-widest">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white p-6 h-full">
                        <SalesChart orders={orders} />
                    </Card>
                </div>

                {/* Team Access Quick View */}
                <div className="lg:col-span-1">
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white h-full overflow-hidden">
                        <CardHeader className="border-b border-slate-50">
                            <CardTitle className="text-lg">Recent Users</CardTitle>
                        </CardHeader>
                        <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                            {usersData.slice(0, 6).map((user: any) => (
                                <div key={user.uid} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <UserCircleIcon className="h-8 w-8 text-slate-300" />
                                        <div className="max-w-[120px]">
                                            <p className="font-bold text-sm truncate">{user.displayName || "User"}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-full ${user.isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {user.isAdmin ? 'Admin' : 'Client'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-slate-50 text-center">
                            <Link href="/dashboard/users" className="text-xs font-bold text-blue-600 hover:underline">MANAGE ALL USERS</Link>
                        </div>
                    </Card>
                </div>

                {/* Top Products */}
                <div className="lg:col-span-2">
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-3 border-b border-slate-50 pb-6">
                            <ShoppingCart className="h-5 w-5 text-blue-600" />
                            <CardTitle className="text-xl font-bold">Best Sellers</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase">Product</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase text-center">Sold</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase text-right">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {topProducts.map((product, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/30">
                                            <td className="px-8 py-4 font-bold text-sm">{product.name}</td>
                                            <td className="px-8 py-4 text-center text-sm">{product.quantity}</td>
                                            <td className="px-8 py-4 text-right font-black text-sm">₵{product.revenue.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* Stock Alerts */}
                <div className="lg:col-span-1">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white h-full">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            <CardTitle className="text-xl font-bold">Inventory Alerts</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {lowStockItems.length > 0 ? (
                                lowStockItems.map((item: any) => (
                                    <div key={item._id} className="flex items-center justify-between p-3 bg-amber-50/50 rounded-2xl border border-amber-100">
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-bold truncate max-w-[100px]">{item.name}</p>
                                            <p className="text-[10px] text-amber-700 font-black px-2 py-0.5 bg-white rounded-full border border-amber-200">{item.stock} left</p>
                                        </div>
                                        <Link href="/dashboard/products" className="text-amber-600 hover:scale-110 transition-transform"><ArrowRight size={18} /></Link>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <CheckCircle className="mx-auto h-10 w-10 text-emerald-500 mb-2" />
                                    <p className="text-xs text-slate-400 font-bold uppercase">All Stock Healthy</p>
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