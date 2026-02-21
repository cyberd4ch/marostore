'use client';

import { Fragment, useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import { Search, User as UserIcon } from 'lucide-react';
import { SearchCommand } from '@/components/search-command/search-command';

import CartIcon from '@/components/cart-icon/cart-icon.component';
import CartDropdown from '@/components/cart-dropdown/cart-dropdown.component';
import { NavMenu } from '@/components/nav-menu/nav-menu';
import { NavigationSheet } from '@/components/navigation-sheet/navigation-sheet';

import { selectWishlistCount } from '@/app/store/wishlist/wishlist.selector';

import { selectIsCartOpen } from '@/app/store/cart/cart.selector';
import { selectCurrentUser } from '@/app/store/user/user.selector';
import { signOutStart } from '@/app/store/user/user.action';
import { Button } from '@/components/ui/button';

export default function Navigation({ children }: { children: React.ReactNode }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const isCartOpen = useSelector(selectIsCartOpen);

    const wishlistCount = useSelector(selectWishlistCount);

    const signOutUser = () => dispatch(signOutStart());

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <Fragment>
            {/* Floating Navbar Aesthetic: 
              fixed, inset-x-4 (margin on sides), top-6 (margin from top), 
              rounded-full, glassmorphism (bg-white/90 + backdrop-blur)
            */}
            <header className="fixed inset-x-4 top-4 z-50 mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-md md:px-8">

                {/* Left: Logo */}
                <Link href="/" className="flex shrink-0 items-center pl-2">
                    <div className="relative h-14 w-40 md:w-64 transition-transform hover:scale-[2.2] active:scale-[2.1]">
                        <Image
                            src="/logo.png"
                            alt="Marostore Logo"
                            fill
                            priority
                            sizes="(max-width: 768px) 160px, 208px"
                            className="object-contain object-left"
                        />
                    </div>
                </Link>

                {/* Center: Desktop Navigation Links (shadcn) */}
                <div className="hidden md:flex flex-1 justify-center">
                    <NavMenu />
                </div>

                {/* Right: Icons & Actions */}
                <div className="flex items-center gap-4 lg:gap-6 shrink-0">

                    {/* Optional: Search Icon to match reference images */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors bg-slate-100/50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/60"
                    >
                        <Search className="h-4 w-4" />
                        <span className="font-medium">Search...</span>
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-300 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
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

                    <Link href="/wishlist" className="relative group p-2">
                        <Heart className="h-6 w-6 text-slate-700 transition-colors group-hover:text-red-500" />

                        {wishlistCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-in zoom-in">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>

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

            <SearchCommand open={isSearchOpen} setOpen={setIsSearchOpen} />

            {/* Content Wrapper: Added pt-28 (padding-top) so the floating navbar doesn't cover page content */}
            <main className="pt-28 min-h-screen bg-slate-50/50">
                {children}
            </main>
        </Fragment>
    );
}