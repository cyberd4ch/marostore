// src/app/shop/layout.tsx
import { ReactNode } from 'react';

export default function ShopLayout({ children }: { children: ReactNode }) {
    return (
        // Added a max-width, centered it, and gave it premium padding
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            {children}
        </div>
    );
}