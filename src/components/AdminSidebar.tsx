'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserCircleIcon, LayoutDashboard, ShoppingBag, ListOrdered, Home } from 'lucide-react';

const sidebarLinks = [
    { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
    { name: 'Orders', href: '/dashboard/orders', icon: ListOrdered },
    { name: 'Users', href: '/dashboard/users', icon: UserCircleIcon },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 sticky top-0 h-screen">
            <div className="mb-10 px-2">
                <h2 className="text-2xl font-black tracking-tighter text-black uppercase">Maro Admin</h2>
            </div>
            
            <nav className="flex-1 space-y-2">
                {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link 
                            key={link.href} 
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                                isActive ? 'bg-black text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
                            }`}
                        >
                            <Icon size={20} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 font-medium hover:text-black transition-colors border-t mt-auto">
                <Home size={20} /> Back to Store
            </Link>
        </aside>
    );
}