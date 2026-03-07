'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
    UserCircleIcon, LayoutDashboard, ShoppingBag, 
    ListOrdered, Home, Menu, X, LogOut, Loader2,
    Package, MapPin, Warehouse, ShoppingCart, 
    Lock, Bell, Settings, Truck, ClipboardList,
    Activity
} from 'lucide-react';
import { auth } from '@/app/utils/firebase/firebase.utils';
import { signOut } from 'firebase/auth';
import { clearSessionCookie } from '@/app/actions/logout';
import { toast } from 'sonner';

// Grouped links based on the Logistics UI screenshots
const mainNav = [
    { name: 'Analytics', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', href: '/dashboard/products', icon: Package },
    { name: 'Tracking', href: '/dashboard/tracking', icon: MapPin },
    { name: 'Warehouse', href: '/dashboard/warehouse', icon: Warehouse },
    { name: 'Order', href: '/dashboard/orders', icon: ShoppingCart },
];

const settingsNav = [
    { name: 'User Profile', href: '/dashboard/users', icon: UserCircleIcon },
    { name: 'Change Password', href: '/dashboard/security', icon: Lock },
    { name: 'Notification Settings', href: '/dashboard/notifications', icon: Bell },
    { name: 'App Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Create Shipment', href: '/dashboard/shipments', icon: Truck },
    { name: 'Fleet Status Overview', href: '/dashboard/fleet', icon: ClipboardList },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut(auth);
            await clearSessionCookie();
            toast.success("Logged out of Maro Admin");
            router.push('/auth');
            router.refresh();
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
            <div className="md:hidden flex items-center justify-between p-4 bg-background border-b sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <Activity className="text-primary" size={24} />
                    <h2 className="font-funnel font-bold tracking-tighter text-foreground uppercase">Logistics</h2>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-muted/20 rounded-lg">
                    <Menu size={24} />
                </button>
            </div>

            {/* MOBILE OVERLAY */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            )}

            {/* SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-[60] w-72 bg-background flex flex-col p-4 transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static md:w-64 md:border-r md:border-border/50 md:flex
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* BRAND HEADER */}
                <div className="flex items-center gap-3 mb-8 px-2 py-4">
                    <Activity className="text-primary" size={28} />
                    <h2 className="font-funnel text-2xl font-bold tracking-tighter text-foreground">Logistics</h2>
                    <button className="md:hidden ml-auto p-2 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-8">
                    {/* MAIN NAVIGATION */}
                    <nav className="space-y-1">
                        {mainNav.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    onClick={handleLinkClick}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg caption transition-all ${
                                        isActive 
                                        ? 'bg-primary text-primary-foreground shadow-sm' 
                                        : 'text-foreground/70 hover:bg-muted/30 hover:text-foreground'
                                    }`}
                                >
                                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* SETTINGS & PROFILE SECTION */}
                    <div>
                        <h3 className="px-3 mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                            Settings & Profile
                        </h3>
                        <nav className="space-y-1">
                            {settingsNav.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link 
                                        key={link.href} 
                                        href={link.href}
                                        onClick={handleLinkClick}
                                        className="flex items-center gap-3 px-3 py-2 text-foreground/70 hover:text-foreground transition-colors group"
                                    >
                                        <Icon size={18} className="group-hover:text-primary transition-colors" />
                                        <span className="caption font-normal">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="mt-auto pt-4 border-t border-border/40">
                    <Link 
                        href="/" 
                        className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground caption transition-all mb-1"
                    >
                        <Home size={18} /> Back to Store
                    </Link>
                    
                    <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-destructive font-medium hover:bg-destructive/10 rounded-lg transition-all disabled:opacity-50"
                    >
                        {isLoggingOut ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <LogOut size={18} />
                        )}
                        <span className="caption">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
}