"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, ShoppingBag, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { auth } from "../../utils/firebase/firebase.utils";

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        { title: "Total Revenue", value: "₵0.00", icon: DollarSign, color: "text-emerald-600" },
        { title: "Total Products", value: "0", icon: ShoppingBag, color: "text-blue-600" },
        { title: "Active Orders", value: "0", icon: Users, color: "text-orange-600" },
        { title: "Avg. Order Value", value: "₵0.00", icon: TrendingUp, color: "text-purple-600" },
    ]);
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);

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