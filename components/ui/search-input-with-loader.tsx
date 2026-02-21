"use client";

import * as React from "react";
import { LoaderCircleIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn utility

export interface SearchInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    isLoading?: boolean;
}

const SearchInputWithLoader = React.forwardRef<HTMLInputElement, SearchInputProps>(
    ({ className, isLoading, ...props }, ref) => {
        return (
            <div className="relative w-full border-b border-slate-100">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center justify-center text-slate-400">
                    <SearchIcon className="size-4" />
                </div>

                <input
                    type="search"
                    className={cn(
                        "flex h-12 w-full bg-transparent py-3 pl-10 pr-10 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    ref={ref}
                    {...props}
                />

                {isLoading && (
                    <div className="absolute inset-y-0 right-3 flex items-center justify-center text-slate-400">
                        <LoaderCircleIcon className="size-4 animate-spin" />
                    </div>
                )}
            </div>
        );
    }
);

SearchInputWithLoader.displayName = "SearchInputWithLoader";

export { SearchInputWithLoader };