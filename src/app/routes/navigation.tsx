'use client';

import { Fragment, useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
// Removed 'next/image' import since we are using text now
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User as UserIcon } from 'lucide-react';
import { SearchCommand } from '@/components/search-command/search-command';

import CartIcon from '@/components/cart-icon/cart-icon.component';
import CartDropdown from '@/components/cart-dropdown/cart-dropdown.component';
import { NavMenu } from '@/components/nav-menu/nav-menu';
import { NavigationSheet } from '@/components/navigation-sheet/navigation-sheet';

import { selectWishlistCount } from '@/store/wishlist/wishlist.selector';
import { selectIsCartOpen } from '@/store/cart/cart.selector';
import { selectCurrentUser } from '@/store/user/user.selector';
import { signOutStart } from '@/store/user/user.action';
import { Button } from '@/components/ui/button';

import { selectCartItems } from '@/store/cart/cart.selector'; // Add this
import { selectWishlistItems } from '@/store/wishlist/wishlist.selector'; // Add this

export default function Navigation({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const currentUser = useSelector(selectCurrentUser);
    const cartItems = useSelector(selectCartItems);
    const favoriteItems = useSelector(selectWishlistItems);
    const isCartOpen = useSelector(selectIsCartOpen);
    const wishlistCount = useSelector(selectWishlistCount);
    const [isSearchOpen, setIsSearchOpen] = useState(false);


    const signOutUser = () => dispatch(signOutStart());

    useEffect(() => {
        // Only trigger if user is on Login or Signup page
        const isAuthPage = pathname === '/auth' || pathname === '/login' || pathname === '/signup';

        if (currentUser && isAuthPage) {
            const user = currentUser as any;

            // 1. Force Onboarding if incomplete
            if (!user.onboardingCompleted || !user.username) {
                router.replace('/onboarding');
                return;
            }

            // 2. Cart has items? Go to checkout
            if (cartItems.length > 0) {
                router.replace('/checkout');
            }
            // 3. No cart but has favorites? Go to profile wishlist view
            else if (favoriteItems.length > 0) {
                router.replace(`/u/${user.username}?view=wishlist`);
            }
            // 4. Default profile
            else {
                router.replace(`/u/${user.username}`);
            }
        }
    }, [currentUser, cartItems, favoriteItems, pathname, router]);

    return (
        <Fragment>
            {/* Floating Navbar Aesthetic */}
            <header className="fixed inset-x-4 top-4 z-50 mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur-md md:px-8">

                {/* Left: Text Logo */}
                <Link href="/" className="flex shrink-0 items-center">
                    <span className="text-2xl font-extrabold tracking-tighter text-slate-900 transition-colors hover:text-slate-700 md:text-3xl">
                        marostore
                    </span>
                </Link>

                {/* Center: Desktop Navigation Links (shadcn) */}
                <div className="hidden md:flex flex-1 justify-center">
                    <NavMenu />
                </div>

                {/* Right: Icons & Actions */}
                <div className="flex items-center gap-4 lg:gap-6 shrink-0">

                    {/* Search Icon */}
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

            {/* Content Wrapper */}
            <main className="pt-28 min-h-screen bg-slate-50/50">
                {children}
            </main>
        </Fragment>
    );
}