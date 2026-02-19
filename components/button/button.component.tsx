import { FC, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define button variants using CVA with your theme colors
const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 button-text",
    {
        variants: {
            variant: {
                // Primary action – deep slate background, cream text, inverts on hover
                default:
                    "bg-primary text-primary-foreground hover:bg-background hover:text-foreground border border-transparent hover:border-border",
                // Google Sign-In – keep brand colors (can be overridden if needed)
                google:
                    "bg-[#4285f4] text-white hover:bg-[#357ae8] border border-transparent",
                // Inverted – cream background, navy text, inverts to primary on hover
                inverted:
                    "bg-background text-foreground border border-border hover:bg-primary hover:text-primary-foreground hover:border-transparent",
                // Ghost – transparent, uses accent on hover
                ghost:
                    "hover:bg-accent hover:text-accent-foreground bg-transparent",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // new outline variant
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// Export the variant enum for compatibility
export enum BUTTON_TYPE_CLASSES {
    base = "default",
    google = "google",
    inverted = "inverted",
    ghost = "ghost",
    outline = "outline",
}

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

// Spinner component (Lucide loader style)
const Spinner = ({ className }: { className?: string }) => (
    <svg
        className={cn("animate-spin", className)}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const Button: FC<ButtonProps> = ({
    className,
    variant,
    size,
    isLoading,
    children,
    disabled,
    ...props
}) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Spinner className="mr-2 h-4 w-4" />}
            {children}
        </button>
    );
};

export default Button;
export { buttonVariants };