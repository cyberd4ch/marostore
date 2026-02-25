"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
    // In a real app, you'd fetch these from Firestore or a specialized API route
    const stats = [
        { title: "Total Revenue", value: "$12,450", icon: DollarSign, color: "text-emerald-600" },
        { title: "New Users", value: "+48", icon: Users, color: "text-blue-600" },
        { title: "Active Orders", value: "12", icon: ShoppingBag, color: "text-orange-600" },
        { title: "Conversion Rate", value: "3.2%", icon: TrendingUp, color: "text-purple-600" },
    ];

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-2 mb-8">
                <LayoutDashboard className="h-8 w-8 text-slate-900" />
                <h1 className="text-3xl font-bold text-slate-900">Analytics Overview</h1>
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
                            <p className="text-[10px] text-slate-400 mt-1">+12% from last month</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Placeholder for Charts */}
            <div className="mt-8 h-96 w-full bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-center text-slate-400 font-medium italic shadow-sm">
                Sales Velocity Chart Placeholder
            </div>
        </div>
    );
};

export default AdminDashboard;