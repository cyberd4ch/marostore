'use client';

import { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { ImagePlus, Trash2, Loader2, Edit3, X } from 'lucide-react';
import Image from 'next/image';

const ProductManager = () => {
    const [product, setProduct] = useState({ name: '', price: '', imageUrl: '', category: '' });
    // Initialize as empty array to ensure .length and .map don't crash initially
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchInventory = async () => {
        setIsFetching(true);
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            
            // SAFETY CHECK: Only set inventory if the data is actually an array
            if (Array.isArray(data)) {
                setInventory(data);
            } else {
                console.error("Received non-array data:", data);
                setInventory([]); // Reset to empty array on error
                toast.error(data.error || "Failed to load products");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setInventory([]);
            toast.error("Network error: Failed to load inventory");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => { fetchInventory(); }, []);

    // Load product into form for editing
    const startEdit = (item: any) => {
        setEditingId(item._id);
        setProduct({
            name: item.name,
            price: item.price.toString(),
            imageUrl: item.imageUrl,
            category: item.category || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setProduct({ name: '', price: '', imageUrl: '', category: '' });
    };

    const handleAction = async () => {
        if (!product.imageUrl) return toast.error("Please upload an image first");
        setIsLoading(true);

        const method = editingId ? 'PUT' : 'POST';
        const body = editingId 
            ? { ...product, id: editingId, price: Number(product.price) }
            : { ...product, price: Number(product.price) };

        try {
            const response = await fetch('/api/admin/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                toast.success(editingId ? "Product updated!" : "Product published!");
                cancelEdit();
                fetchInventory();
            }
        } catch (error) {
            toast.error("Action failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success("Removed");
                setInventory((prev) => prev.filter((item: any) => item._id !== id));
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="p-8 space-y-12 bg-slate-50 min-h-screen">
            <h1 className="text-4xl font-black tracking-tighter">MARO INVENTORY</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
                {/* Product Form Card (Add/Edit) */}
                <Card className="rounded-[2rem] border-none shadow-xl h-fit sticky top-8">
                    {/* ... keep content same ... */}
                </Card>

                {/* Live Inventory Table */}
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                    <CardHeader>
                        <CardTitle>
                            Live Inventory ({Array.isArray(inventory) ? inventory.length : 0})
                        </CardTitle>
                    </CardHeader>
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetching ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-10">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="animate-spin" /> Loading Inventory...
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : Array.isArray(inventory) && inventory.length > 0 ? (
                                inventory.map((item: any) => (
                                    <TableRow key={item._id} className={editingId === item._id ? "bg-blue-50/50" : ""}>
                                        <TableCell className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 rounded overflow-hidden border">
                                                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <span className="font-bold">{item.name}</span>
                                        </TableCell>
                                        <TableCell>₵{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="text-blue-500 hover:bg-blue-50"><Edit3 size={18} /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)} className="text-red-500 hover:bg-red-50"><Trash2 size={18} /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-10 text-slate-400">
                                        No products found or access restricted.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
};

export default ProductManager;