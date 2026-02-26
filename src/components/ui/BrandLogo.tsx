import Link from 'next/link';

export const BrandLogo = ({ className = "" }: { className?: string }) => {
    return (
        <span className={`text-2xl font-extrabold tracking-tighter text-slate-900 transition-colors hover:text-slate-700 md:text-3xl ${className}`}>
            marostore
        </span>
    );
};

// Optional: A clickable version for navbars
export const BrandLogoLink = ({ className = "" }: { className?: string }) => {
    return (
        <Link href="/" className="inline-block">
            <BrandLogo className={className} />
        </Link>
    );
};