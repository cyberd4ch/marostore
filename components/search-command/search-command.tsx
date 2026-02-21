"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Package } from "lucide-react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/app/utils/firebase/firebase.utils";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

interface Product {
    id: string;
    name: string;
    category: string;
}

// We export the Dialog logic so we can trigger it from anywhere
export function SearchCommand({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
    const router = useRouter();
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(false);

    // Fetch initial products/catalog when component mounts
    React.useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "products"), limit(20));
                const querySnapshot = await getDocs(q);
                const items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setProducts(items);
            } catch (e) {
                console.error("Error fetching search results:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type to search products..." />
            <CommandList>
                <CommandEmpty>{loading ? "Loading..." : "No results found."}</CommandEmpty>
                
                {products.length > 0 && (
                    <CommandGroup heading="Products">
                        {products.map((product) => (
                            <CommandItem 
                                key={product.id} 
                                value={product.name}
                                onSelect={() => runCommand(() => router.push(`/shop/${product.category.toLowerCase()}/${product.id}`))}
                            >
                                <Package className="mr-2 h-4 w-4" />
                                <span>{product.name}</span>
                                <span className="ml-auto text-xs text-muted-foreground uppercase">{product.category}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}

                <CommandGroup heading="Quick Categories">
                    <CommandItem onSelect={() => runCommand(() => router.push("/shop/mens"))}>Men's Clothing</CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push("/shop/womens"))}>Women's Clothing</CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}