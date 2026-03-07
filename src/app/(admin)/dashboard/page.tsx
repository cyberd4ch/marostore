"use client";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LayoutDashboard, Users, ShoppingBag, DollarSign,
    TrendingUp, Loader2, ShoppingCart, UserCircleIcon,
    AlertTriangle, ArrowRight, CheckCircle, Percent,
    Package, Truck, Warehouse, Activity, Globe, ShieldCheck, 
    Calendar, Clock, TruckIcon, TriangleAlertIcon, CalendarX2Icon, Clock8Icon
} from "lucide-react";
import { auth } from "@/app/utils/firebase/firebase.utils";
import { SalesChart } from '@/components/admin/SalesChart';
import StatisticsCard from "@/components/admin/StatisticsCard"; // Assuming this is where it's saved
import Link from 'next/link';
import { toast } from "sonner";

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [usersData, setUsersData] = useState<any[]>([]);
    
    // 1. Core Financial/Inventory Totals
    const totals = useMemo(() => {
        const totalRevenue = orders.reduce((acc, order) => {
            const amount = Number(order.totalAmount) || 0;
            return order.status !== 'Cancelled' ? acc + amount : acc;
        }, 0);

        const activeOrdersCount = orders.filter(o => 
            !['Delivered', 'Cancelled', 'Returned'].includes(o.status)
        ).length;

        return {
            revenue: totalRevenue,
            active: activeOrdersCount,
            products: inventory.length
        };
    }, [orders, inventory]);

    // 2. NEW: Logistics Statistics Matrix (Dynamic Data)
    const logisticsStats = useMemo(() => {
        const shippedCount = orders.filter(o => o.status === 'Shipped' || o.status === 'Delivered').length;
        const returnedCount = orders.filter(o => o.status === 'Returned').length;

        return [
            {
                icon: <TruckIcon className='size-5' />,
                value: shippedCount.toString(),
                title: 'Shipped Orders',
                changePercentage: '+18.2%' // Mocked trend
            },
            {
                icon: <TriangleAlertIcon className='size-5' />,
                value: returnedCount.toString(),
                title: 'Damaged Returns',
                changePercentage: '-8.7%'
            },
            {
                icon: <CalendarX2Icon className='size-5' />,
                value: '27', // Logic could be added here for specific delivery windows
                title: 'Missed Delivery Slots',
                changePercentage: '+4.3%'
            },
            {
                icon: <Clock8Icon className='size-5' />,
                value: '13',
                title: 'Late Deliveries',
                changePercentage: '-2.5%'
            }
        ];
    }, [orders]);

    // 3. Top-level KPIs
    const displayStats = [
        { title: "Net Throughput", value: `₵${totals.revenue.toLocaleString()}`, icon: Activity, color: "text-primary" },
        { title: "Manifest Count", value: totals.products.toString(), icon: Package, color: "text-secondary" },
        { title: "Active Logistics", value: totals.active.toString(), icon: Truck, color: "text-accent" },
        { title: "Fulfillment Rate", value: "98.2%", icon: ShieldCheck, color: "text-emerald-600" },
    ];

    useEffect(() => {
        let isMounted = true;
        const fetchDashboardData = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;
                const token = await user.getIdToken(true);
                const headers = { 'Authorization': `Bearer ${token}` };

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
                toast.error("Real-time telemetry interrupted");
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

    const lowStockItems = useMemo(() =>
        inventory.filter((item: any) => item.stock !== undefined && Number(item.stock) < 5),
        [inventory]);

    return (
        <div className="p-6 md:p-10 bg-background min-h-screen space-y-10 font-space-grotesk">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="caption uppercase tracking-widest text-muted-foreground/60 font-black">System Online</span>
                    </div>
                    <h1 className="display-medium tracking-tighter text-foreground">Operational Overview</h1>
                    <p className="subtitle text-muted-foreground/80 mt-1">Real-time telemetry for Maro Store logistics.</p>
                </div>
                <div className="flex items-center gap-3 bg-muted/20 p-2 rounded-2xl border border-border/20">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Globe className="text-primary" size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Region</p>
                        <p className="text-sm font-bold">West Africa / GH</p>
                    </div>
                </div>
            </div>

            {/* NEW: Logistics Statistics Matrix Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {logisticsStats.map((card, index) => (
                    <StatisticsCard
                        key={index}
                        icon={card.icon}
                        title={card.title}
                        value={card.value}
                        changePercentage={card.changePercentage}
                    />
                ))}
            </div>

            {/* KPI Grid (Secondary Metrics) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayStats.map((stat, idx) => (
                    <Card key={idx} className="border border-border/30 shadow-none rounded-[2rem] bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/50 transition-all">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="caption text-[11px] font-black uppercase text-muted-foreground tracking-widest">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-funnel font-bold text-foreground">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid (Chart, Users, Table) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Revenue Flow Chart */}
                <Card className="lg:col-span-8 border-none shadow-none rounded-[3rem] bg-card/40 p-6 md:p-8 border border-border/20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
                        <div>
                            <h2 className="h3 tracking-tight text-foreground">Revenue Flow</h2>
                            <p className="caption text-muted-foreground">Historical throughput across all channels</p>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-500/20">
                            <TrendingUp size={16} />
                            <span className="text-sm font-bold">+12.5% Performance</span>
                        </div>
                    </div>
                    <div className="h-[350px] w-full">
                        <SalesChart orders={orders} />
                    </div>
                </Card>

                {/* Stakeholder Matrix */}
                <Card className="lg:col-span-4 border border-border/30 shadow-none rounded-[3rem] bg-background h-full flex flex-col">
                    <CardHeader className="border-b border-border/20 py-6">
                        <CardTitle className="h4 text-foreground flex items-center gap-2">
                            <Users size={20} className="text-secondary" />
                            Stakeholder Matrix
                        </CardTitle>
                    </CardHeader>
                    <div className="divide-y divide-border/20 overflow-y-auto flex-grow scrollbar-hide">
                        {usersData.length > 0 ? usersData.slice(0, 6).map((user: any) => (
                            <div key={user.uid} className="flex items-center justify-between p-5 hover:bg-muted/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-muted/30 border border-border/20 flex items-center justify-center text-foreground font-bold">
                                        {user.displayName?.[0] || "G"}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{user.displayName || "Unidentified User"}</p>
                                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{user.email?.split('@')[0]}</p>
                                    </div>
                                </div>
                                <div className={`h-2 w-2 rounded-full ${user.isAdmin ? 'bg-primary shadow-[0_0_8px_rgba(29,45,68,0.5)]' : 'bg-muted-foreground/30'}`} />
                            </div>
                        )) : (
                            <div className="p-10 text-center text-muted-foreground caption">No network data detected</div>
                        )}
                    </div>
                    <Link href="/dashboard/users" className="m-4 p-4 bg-foreground text-background text-center caption font-bold rounded-2xl hover:opacity-90 transition-opacity uppercase tracking-widest">
                        Verify Permissions
                    </Link>
                </Card>

                {/* Inventory Velocity Table */}
                <Card className="lg:col-span-8 border border-border/20 shadow-none rounded-[3rem] bg-card/40 overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/20 p-8">
                        <div className="flex items-center gap-3">
                            <Warehouse className="text-primary" size={24} />
                            <CardTitle className="h3 tracking-tight">Inventory Velocity</CardTitle>
                        </div>
                        <span className="caption text-xs font-black text-muted-foreground uppercase tracking-widest">Top 5 SKU</span>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-muted/20">
                                    <tr>
                                        <th className="px-8 py-5 caption text-[10px] font-black text-muted-foreground uppercase tracking-widest">Asset Name</th>
                                        <th className="px-8 py-5 caption text-[10px] font-black text-muted-foreground uppercase text-center tracking-widest">Units Moved</th>
                                        <th className="px-8 py-5 caption text-[10px] font-black text-muted-foreground uppercase text-right tracking-widest">Revenue (GHS)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/10">
                                    {topProducts.length > 0 ? topProducts.map((product, idx) => (
                                        <tr key={idx} className="hover:bg-muted/5 transition-colors group">
                                            <td className="px-8 py-5 font-bold text-sm text-foreground group-hover:text-primary transition-colors">{product.name}</td>
                                            <td className="px-8 py-5 text-center">
                                                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl font-bold text-xs">{product.quantity}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-funnel font-bold text-lg text-foreground">₵{product.revenue.toLocaleString()}</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={3} className="text-center py-16 caption text-muted-foreground uppercase">Zero Asset Movement Data</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Warehouse Integrity */}
                <Card className="lg:col-span-4 border-none shadow-none rounded-[3.5rem] bg-primary text-primary-foreground p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-3 bg-primary-foreground/10 rounded-2xl">
                                <AlertTriangle className="text-primary-foreground" size={24} />
                            </div>
                            <span className="caption font-black uppercase text-[10px] tracking-widest bg-destructive text-destructive-foreground px-3 py-1 rounded-full">Alerts Active</span>
                        </div>
                        <h2 className="h2 font-normal text-primary-foreground">Warehouse Integrity</h2>
                        <p className="caption text-primary-foreground/70 mt-2">Assets requiring immediate restocking or rotation.</p>
                    </div>

                    <div className="space-y-3 my-8">
                        {lowStockItems.length > 0 ? (
                            lowStockItems.slice(0, 3).map((item: any) => (
                                <div key={item._id} className="flex items-center justify-between p-4 bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10 group">
                                    <div className="flex flex-col overflow-hidden">
                                        <p className="text-sm font-bold truncate pr-2">{item.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-primary-foreground/50">Units: {item.stock}</p>
                                    </div>
                                    <Link href="/dashboard/products" className="h-8 w-8 flex items-center justify-center bg-primary-foreground text-primary rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="py-6 text-center border-2 border-dashed border-primary-foreground/20 rounded-[2.5rem]">
                                <CheckCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                                <p className="caption text-[10px] font-black uppercase tracking-widest">Integrity Nominal</p>
                            </div>
                        )}
                    </div>

                    <Link href="/dashboard/products" className="w-full py-4 text-center bg-primary-foreground text-primary caption font-black uppercase tracking-widest rounded-2xl hover:bg-secondary transition-colors">
                        Asset Log
                    </Link>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;