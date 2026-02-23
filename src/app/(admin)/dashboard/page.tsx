import React from 'react';

const AdminDashboardHome = () => {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">Monthly Revenue</p>
                    <h2 className="text-2xl font-bold">₵0.00</h2>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">Total Orders</p>
                    <h2 className="text-2xl font-bold">0</h2>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">New Customers</p>
                    <h2 className="text-2xl font-bold">0</h2>
                </div>
            </div>
            
            {/* The Sales Analytics Chart we discussed earlier would go here */}
            <div className="mt-8 p-6 bg-white rounded-3xl shadow-sm border border-slate-100 h-64 flex items-center justify-center">
                <p className="text-slate-400 italic">Sales Chart Loading...</p>
            </div>
        </div>
    );
};

export default AdminDashboardHome;