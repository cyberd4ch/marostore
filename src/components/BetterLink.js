import Link from 'next/link';

const BetterLink = ({ href, children, ...props }) => {
    return (
        <Link href={href} {...props} legacyBehavior>
            <a>{children}</a>
        </Link>
    );
};

export default BetterLink;