'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LinkItem = {
    id: string;
    title: string;
    href: string;
};

type SiteNavLinksProps = {
    links?: LinkItem[];
    device?: 'mobile' | 'desktop';
};

const defaultLinks: LinkItem[] = [
    { id: '1', title: 'Collections', href: '/shop' },
    { id: '2', title: 'Men', href: '/shop/men' },
    { id: '3', title: 'Women', href: '/shop/women' },
    { id: '4', title: 'About', href: '/about' },
    { id: '5', title: 'Contact', href: '/contact' },
];

export default function SiteNavLinks({
    links = defaultLinks,
    device = 'desktop',
}: SiteNavLinksProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') return pathname === href;
        return pathname.startsWith(href);
    };

    const linkClass = (href: string) => {
        // Base classes for desktop: relative, text color uses foreground,
        // hover uses primary, and an underline that appears on hover using primary.
        const desktopBase = `relative font-space-grotesk text-[var(--foreground)] hover:text-[var(--primary)] 
      before:content-[''] before:absolute before:block before:w-full 
      before:h-[3px] before:bg-[var(--primary)] before:bottom-[-8px] 
      before:transition-transform before:duration-300 before:scale-x-0 
      hover:before:scale-x-100 before:origin-left tracking-tighter`;

        const mobileBase = 'text-[var(--foreground)]';

        const base = device === 'mobile' ? mobileBase : desktopBase;

        // Active state: use primary color and force underline visible
        if (isActive(href)) {
            return `${base} text-[var(--primary)] font-space-grotesk font-semibold before:scale-x-100`;
        }

        return base;
    };

    return (
        <nav className="flex">
            <ul
                className={
                    device === 'mobile'
                        ? 'flex flex-col items-start gap-4 font-space-grotesk font-bold text-[var(--foreground)] text-lg'
                        : 'flex md:gap-6 lg:gap-8 items-center'
                }
            >
                {links.map((item) => (
                    <li key={item.id}>
                        <Link href={item.href} className={linkClass(item.href)}>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}