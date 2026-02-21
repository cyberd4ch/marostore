'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { Search, User as UserIcon } from 'lucide-react';

import CartIcon from '@/components/cart-icon/cart-icon.component';
import CartDropdown from '@/components/cart-dropdown/cart-dropdown.component';
import { NavMenu } from '@/components/nav-menu/nav-menu';
import { NavigationSheet } from '@/components/navigation-sheet/navigation-sheet';

import { selectIsCartOpen } from '@/app/store/cart/cart.selector';
import { selectCurrentUser } from '@/app/store/user/user.selector';
import { signOutStart } from '@/app/store/user/user.action';
import { Button } from '@/components/ui/button';

export default function Navigation({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const isCartOpen = useSelector(selectIsCartOpen);

    const signOutUser = () => dispatch(signOutStart());

    return (
        <Fragment>
            {/* Floating Navbar Aesthetic: 
              fixed, inset-x-4 (margin on sides), top-6 (margin from top), 
              rounded-full, glassmorphism (bg-white/90 + backdrop-blur)
            */}
            <header className="fixed inset-x-4 top-4 z-50 mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-md md:px-8">
                
                {/* Left: Logo */}
                <Link href="/" className="flex shrink-0 items-center">
                    <Image
                        src="/logo.png" // Keep your existing logo
                        alt="Marostore Logo"
                        width={140}
                        height={40}
                        priority
                        className="object-contain"
                    />
                </Link>

                {/* Center: Desktop Navigation Links (shadcn) */}
                <div className="hidden md:flex flex-1 justify-center">
                    <NavMenu />
                </div>

                {/* Right: Icons & Actions */}
                <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                    
                    {/* Optional: Search Icon to match reference images */}
                    <button className="hidden md:block text-slate-600 hover:text-slate-900 transition-colors">
                        <Search className="h-5 w-5" />
                    </button>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <Link href={`/u/${(currentUser as any).username || 'profile'}`}>
                                    <UserIcon className="h-5 w-5 text-slate-600 hover:text-slate-900 transition-colors" />
                                </Link>
                                <Button onClick={signOutUser} variant="ghost" className="rounded-full text-slate-600">
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button asChild variant="outline" className="rounded-full font-semibold">
                                <Link href="/auth">Sign In</Link>
                            </Button>
                        )}
                    </div>

                    {/* Cart Icon & Dropdown Container */}
                    <div className="relative flex items-center">
                        <CartIcon />
                        {/* Position dropdown directly below the floating pill */}
                        {isCartOpen && (
                            <div className="absolute right-0 top-[calc(100%+1.5rem)] w-[320px]">
                                <CartDropdown />
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Trigger (shadcn Sheet) */}
                    <div className="md:hidden flex items-center">
                        <NavigationSheet currentUser={currentUser} signOutUser={signOutUser} />
                    </div>
                </div>
            </header>

            {/* Content Wrapper: Added pt-28 (padding-top) so the floating navbar doesn't cover page content */}
            <main className="pt-28 min-h-screen bg-slate-50/50">
                {children}
            </main>
        </Fragment>
    );
}