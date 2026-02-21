"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import SHOP_DATA from "@/app/utils/shop/shop-data"; 

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface SearchCommandProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
    const router = useRouter();

    // Flatten products once. No need for manual state/filtering, Command handles it instantly.
    const allProducts = React.useMemo(() => {
        return SHOP_DATA.flatMap((category) =>
            category.items.map((item) => ({
                ...item,
                categoryTitle: category.title,
                categoryRoute: category.routeName,
            }))
        );
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, [setOpen]);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <DialogTitle className="sr-only">Search Store</DialogTitle>
            <DialogDescription className="sr-only">
                Search our catalog of clothing and accessories.
            </DialogDescription>

            {/* Single, built-in input for a native, smooth experience */}
            <CommandInput placeholder="Search for clothes, shoes, hats..." />
            
            <CommandList className="max-h-[60vh] overflow-y-auto">
                <CommandEmpty className="py-10 text-center text-sm text-slate-500">
                    No products found.
                </CommandEmpty>

                <CommandGroup heading="Products">
                    {allProducts.map((product) => (
                        <CommandItem
                            key={`${product.categoryRoute}-${product.id}`}
                            value={product.name} // Native fuzzy search uses this value
                            onSelect={() =>
                                runCommand(() => router.push(`/shop/${product.categoryRoute}`))
                            }
                            className="flex items-center gap-4 p-3 cursor-pointer transition-colors hover:bg-slate-50 aria-selected:bg-slate-50"
                        >
                            <div className="relative h-12 w-12 overflow-hidden rounded-md bg-slate-100 shrink-0">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="object-cover h-full w-full"
                                />
                            </div>
                            
                            <div className="flex flex-col flex-1">
                                <span className="font-medium text-slate-900">{product.name}</span>
                                <span className="text-xs uppercase tracking-wider text-slate-500">
                                    {product.categoryTitle}
                                </span>
                            </div>

                            <div className="font-semibold text-slate-900 pr-2">
                                ₵{product.price}
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandGroup heading="Quick Categories">
                    {SHOP_DATA.map((category) => (
                        <CommandItem
                            key={category.id}
                            value={`category ${category.title}`}
                            onSelect={() => runCommand(() => router.push(`/shop/${category.routeName}`))}
                            className="py-3 cursor-pointer"
                        >
                            View all {category.title}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}