'use client';

import { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { ImagePlus, Trash2, Loader2, Edit3, X, Box } from 'lucide-react'; // Added Box icon
import Image from 'next/image';

const ProductManager = () => {
    // 1. Updated state to include stock
    const [product, setProduct] = useState({ name: '', price: '', imageUrl: '', category: '', stock: '' });
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchInventory = async () => {
        setIsFetching(true);
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            if (Array.isArray(data)) {
                setInventory(data);
            } else {
                setInventory([]);
                toast.error(data.error || "Failed to load products");
            }
        } catch (error) {
            setInventory([]);
            toast.error("Network error");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => { fetchInventory(); }, []);

    const startEdit = (item: any) => {
        setEditingId(item._id);
        setProduct({
            name: item.name,
            price: item.price.toString(),
            imageUrl: item.imageUrl,
            category: item.category || '',
            stock: (item.stock ?? 0).toString() // Load stock into form
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setProduct({ name: '', price: '', imageUrl: '', category: '', stock: '' });
    };

    const handleAction = async () => {
        if (!product.imageUrl) return toast.error("Please upload an image first");
        setIsLoading(true);

        const method = editingId ? 'PUT' : 'POST';
        // 2. Ensure price and stock are sent as Numbers
        const body = {
            ...product,
            id: editingId, 
            price: Number(product.price),
            stock: Number(product.stock) 
        };

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
            <h1 className="text-4xl font-black tracking-tighter uppercase">Maro Inventory</h1>

            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
                <Card className="rounded-[2rem] border-none shadow-xl h-fit sticky top-8 bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{editingId ? "Edit Product" : "Add New Drop"}</CardTitle>
                        {editingId && <Button variant="ghost" size="sm" onClick={cancelEdit}><X size={16}/></Button>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Basic Info</label>
                            <Input placeholder="Product Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="Price (₵)" type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
                                {/* 3. NEW: Stock Input */}
                                <Input placeholder="Stock Qty" type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Visuals</label>
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                onSuccess={(result: any) => setProduct({ ...product, imageUrl: result.info.secure_url })}
                            >
                                {({ open }) => (
                                    <Button type="button" variant="outline" onClick={() => open()} className="w-full border-dashed border-2 h-24 rounded-2xl flex flex-col gap-2 overflow-hidden bg-slate-50">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt="preview" width={100} height={100} className="object-cover h-full w-full rounded-xl" />
                                        ) : (
                                            <><ImagePlus size={20} className="text-slate-400"/> <span className="text-[10px] font-bold text-slate-400 uppercase">Upload Image</span></>
                                        )}
                                    </Button>
                                )}
                            </CldUploadWidget>
                        </div>

                        <Button onClick={handleAction} disabled={isLoading} className={`w-full rounded-2xl h-14 font-bold ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black'} text-white transition-all`}>
                            {isLoading ? <Loader2 className="animate-spin" /> : (editingId ? "UPDATE PRODUCT" : "PUBLISH TO STORE")}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                    <CardHeader><CardTitle>Live Inventory ({inventory.length})</CardTitle></CardHeader>
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="pl-8">Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetching ? (
                                <TableRow><TableCell colSpan={4} className="text-center py-20"><Loader2 className="animate-spin mx-auto text-slate-300" /></TableCell></TableRow>
                            ) : inventory.map((item: any) => (
                                <TableRow key={item._id} className={editingId === item._id ? "bg-blue-50/50" : ""}>
                                    <TableCell className="flex items-center gap-3 pl-8">
                                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border bg-slate-100">
                                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-medium">{item.category || 'General'}</p>
                                        </div>
                                    </TableCell>
                                    <td className="px-4 py-4 font-medium text-slate-700">₵{Number(item.price).toFixed(2)}</td>
                                    {/* 4. Display stock in table with conditional colors */}
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {item.stock ?? 0}
                                        </span>
                                    </td>
                                    <TableCell className="text-right space-x-2 pr-8">
                                        <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="text-blue-500 hover:bg-blue-50 rounded-full"><Edit3 size={18} /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)} className="text-red-500 hover:bg-red-50 rounded-full"><Trash2 size={18} /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
};

export default ProductManager;