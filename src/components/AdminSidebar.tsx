'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
    UserCircleIcon, LayoutDashboard, ShoppingBag, 
    ListOrdered, Home, Menu, X, LogOut, Loader2 
} from 'lucide-react';
import { auth } from '@/app/utils/firebase/firebase.utils';
import { signOut } from 'firebase/auth';
import { clearSessionCookie } from '@/app/actions/logout'; // Import the action
import { toast } from 'sonner';

const sidebarLinks = [
    { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
    { name: 'Orders', href: '/dashboard/orders', icon: ListOrdered },
    { name: 'Users', href: '/dashboard/users', icon: UserCircleIcon },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            // 1. Sign out from Firebase Client
            await signOut(auth);
            
            // 2. Clear the __session cookie on the server
            await clearSessionCookie();

            toast.success("Logged out of Admin Dashboard");
            
            // 3. Redirect to auth page
            router.push('/auth');
            router.refresh(); // Ensure the layout re-verifies the missing cookie
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to sign out");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleLinkClick = () => setIsOpen(false);

    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    return (
        <>
            {/* MOBILE TOP BAR */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
                <h2 className="text-xl font-black tracking-tighter text-black uppercase">Maro</h2>
                <button onClick={() => setIsOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Menu size={24} />
                </button>
            </div>

            {/* MOBILE OVERLAY */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            )}

            {/* SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-[60] w-72 bg-white flex flex-col p-6 shadow-2xl transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:w-64 md:border-r md:border-slate-200 md:shadow-none md:flex
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between mb-10 px-2">
                    <h2 className="text-2xl font-black tracking-tighter text-black uppercase">Maro Admin</h2>
                    <button className="md:hidden p-2 text-slate-400 hover:text-black" onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                
                <nav className="flex-1 space-y-2">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.href} 
                                href={link.href}
                                onClick={handleLinkClick}
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

                {/* BOTTOM ACTIONS */}
                <div className="space-y-1 mt-auto pt-4 border-t border-slate-100">
                    <Link 
                        href="/" 
                        onClick={handleLinkClick}
                        className="flex items-center gap-3 px-4 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <Home size={20} /> Storefront
                    </Link>
                    
                    <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                    >
                        {isLoggingOut ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <LogOut size={20} />
                        )}
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}