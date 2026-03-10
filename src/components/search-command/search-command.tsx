"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useSelector } from "react-redux";
import { selectCategoriesMap } from "@/store/categories/category.selector";
import { CategoryItem } from "@/store/categories/category.types";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner"; // 1. Import toast

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
    const categoriesMap = useSelector(selectCategoriesMap);
    const [history, setHistory] = React.useState<CategoryItem[]>([]);

    React.useEffect(() => {
        if (open) {
            const saved = localStorage.getItem("marostore-history");
            if (saved) {
                const ids = JSON.parse(saved);
                const allProds = Object.values(categoriesMap).flat();
                const historyProds = ids
                    .map((id: string) => allProds.find((p: any) => (p._id || p.id) === id))
                    .filter(Boolean);
                setHistory(historyProds);
            }
        }
    }, [open, categoriesMap]);

    // 2. Clear history handler with toast notification
    const clearHistory = (e: React.MouseEvent) => {
        e.stopPropagation();
        localStorage.removeItem("marostore-history");
        setHistory([]);
        
        // 3. Trigger success toast
        toast.success("Search history cleared", {
            duration: 2000,
            position: "bottom-right"
        });
    };

    const addToHistory = (product: CategoryItem) => {
        const saved = localStorage.getItem("marostore-history");
        const ids = saved ? JSON.parse(saved) : [];
        const newId = product._id || product.id;
        const newIds = [newId, ...ids.filter((id: string) => id !== newId)].slice(0, 5);
        localStorage.setItem("marostore-history", JSON.stringify(newIds));
    };

    const allProducts = React.useMemo(() => {
        return Object.keys(categoriesMap).flatMap((title) =>
            categoriesMap[title].map((item: CategoryItem) => ({
                ...item,
                categoryTitle: title,
                categoryRoute: title.toLowerCase(),
            }))
        );
    }, [categoriesMap]);

    const runCommand = (product: CategoryItem) => {
        addToHistory(product);
        setOpen(false);
        router.push(`/shop/products/${product._id || product.id}`);
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search Marostore..." />
            
            <CommandList>
                <CommandEmpty>No products found.</CommandEmpty>

                {history.length > 0 && (
                    <CommandGroup 
                        heading={
                            <div className="flex items-center justify-between w-full">
                                <span>Recently Viewed</span>
                                <button 
                                    onClick={clearHistory}
                                    className="flex items-center gap-1 text-[10px] uppercase tracking-widest hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" /> Clear
                                </button>
                            </div>
                        }
                    >
                        {history.map((product) => (
                            <CommandItem key={`hist-${product.id}`} onSelect={() => runCommand(product)}>
                                <Clock className="w-3 h-3 mr-2 text-slate-400" />
                                {product.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                <CommandGroup heading="Live Catalog">
                    {allProducts.map((product) => (
                        <CommandItem
                            key={`${product.categoryRoute}-${product.id}`}
                            value={product.name} 
                            onSelect={() => runCommand(product)}
                            className="flex items-center gap-4 p-3"
                        >
                            <span className="font-bold">{product.name}</span>
                            <span className="ml-auto text-sm italic">₵{product.price}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}