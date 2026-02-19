'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';

import CartIcon from '@/components/cart-icon/cart-icon.component';
import CartDropdown from '@/components/cart-dropdown/cart-dropdown.component';
import SiteNavLinks from '@/components/store-navigation-links/site-nav-links';
import MobileMenu from '@/components/mobile-menu/mobile-menu.component'; // we'll create this
import { selectIsCartOpen } from '@/app/store/cart/cart.selector';
import { selectCurrentUser } from '@/app/store/user/user.selector';
import { signOutStart } from '@/app/store/user/user.action';

export default function Navigation({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const isCartOpen = useSelector(selectIsCartOpen);
    const pathname = usePathname();
    const [menuVisible, setMenuVisible] = useState(false);

    const signOutUser = () => dispatch(signOutStart());

    return (
        <Fragment>
            <header className="mb-8">
                <MobileMenu visible={menuVisible} setMenuVisibility={setMenuVisible} />
                <div className="flex justify-between bg-white p-4 md:border-b md:border-gray-300 relative">
                    {/* Left section */}
                    <div className="flex items-center">
                        {/* Hamburger menu button (mobile only) */}
                        <button
                            className="bg-transparent p-2 md:hidden"
                            onClick={() => setMenuVisible(true)}
                        >
                            <Image
                                src="/hamburger-menu.svg"
                                alt="Open menu"
                                width={20}
                                height={20}
                            />
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/logo.png" // replace with your logo
                                alt="Marostore Logo"
                                width={240}
                                height={60}
                                className="pb-1"
                            />
                        </Link>

                        {/* Desktop navigation */}
                        <div className="hidden md:flex pl-12">
                            <SiteNavLinks device="desktop" />
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center md:gap-4">
                        {/* Cart */}
                        <div className="relative">
                            <CartIcon />
                            {isCartOpen && <CartDropdown />}
                        </div>

                        {currentUser ? (
                            <button
                                onClick={signOutUser}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                            >
                                SIGN OUT
                            </button>
                        ) : (
                            <Link
                                href="/auth"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                            >
                                SIGN IN
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            {children}
        </Fragment>
    );
}