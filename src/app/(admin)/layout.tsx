'use client';

import { useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, ListOrdered, Home, Loader2 } from 'lucide-react';

import { selectIsAdmin, selectCurrentUser } from '@/store/user/user.selector';

const sidebarLinks = [
    { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: ShoppingBag },
    { name: 'Orders', href: '/dashboard/orders', icon: ListOrdered },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    
    // Selectors to check auth state
    const isAdmin = useSelector(selectIsAdmin);
    const currentUser = useSelector(selectCurrentUser);
    
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        // We use a small delay or check to allow Redux-Saga to finish the MongoDB sync
        const checkAuth = () => {
            if (currentUser) {
                if (isAdmin) {
                    setIsVerifying(false);
                } else {
                    // Logged in but NOT an admin? Kick to home.
                    router.push('/');
                }
            } else {
                // No user at all? Redirect to login or home
                // Change this to '/login' if you want them to sign in first
                router.push('/');
            }
        };

        // If Redux has loaded the user, check them. 
        // If it's still null, we wait a moment for the Saga to finish.
        if (currentUser !== undefined) {
            checkAuth();
        }
    }, [currentUser, isAdmin, router]);

    // Show a high-end loading screen while checking credentials
    if (isVerifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 text-black animate-spin mb-4" />
                <h2 className="text-xs font-black tracking-[0.2em] text-slate-400 uppercase">
                    Authenticating Admin Session
                </h2>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6 sticky top-0 h-screen">
                <div className="mb-10 px-2">
                    <h2 className="text-2xl font-black tracking-tighter text-black">MARO ADMIN</h2>
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

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}