'use client';

import { Fragment } from 'react';
import SiteNavLinks from '@/components/store-navigation-links/site-nav-links'; // new component

type MobileMenuProps = {
    visible: boolean;
    setMenuVisibility: (visible: boolean) => void;
};

export default function MobileMenu({ visible, setMenuVisibility }: MobileMenuProps) {
    if (!visible) return null;

    return (
        <Fragment>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setMenuVisibility(false)}
            />
            {/* Sliding menu */}
            <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 p-6 shadow-lg">
                <button
                    className="mb-6 text-xl"
                    onClick={() => setMenuVisibility(false)}
                >
                    ✕
                </button>
                <SiteNavLinks device="mobile" />
            </div>
        </Fragment>
    );
}