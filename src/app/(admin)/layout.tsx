'use client';

import { useSelector } from 'react-redux';
import { selectIsAdmin } from '@/store/user/user.selector';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const isAdmin = useSelector(selectIsAdmin);

    // In a real app, you'd also check if the user is logged in
    // For now, if not admin, kick them to the home page
    if (!isAdmin) {
        redirect('/'); 
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <aside className="w-64 bg-black text-white p-6">
                <h2 className="font-bold tracking-widest uppercase mb-10">Maro Admin</h2>
                <nav className="space-y-4">
                    <p className="text-slate-400 text-xs font-bold uppercase">Management</p>
                    <div className="flex flex-col gap-2">
                        {/* Add NavLinks here */}
                    </div>
                </nav>
            </aside>
            <main className="flex-1">{children}</main>
        </div>
    );
}