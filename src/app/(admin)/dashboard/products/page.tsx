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
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    
    // NEW: Tracking edit state
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchInventory = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setInventory(data);
        } catch (error) {
            toast.error("Failed to load inventory");
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
                <Card className="rounded-[2rem] border-none shadow-xl h-fit sticky top-8">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>{editingId ? "Edit Product" : "Add New Drop"}</CardTitle>
                        {editingId && <Button variant="ghost" size="sm" onClick={cancelEdit}><X size={16}/></Button>}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input placeholder="Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                        <Input placeholder="Price (GHS)" type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />

                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            onSuccess={(result: any) => setProduct({ ...product, imageUrl: result.info.secure_url })}
                        >
                            {({ open }) => (
                                <Button type="button" variant="outline" onClick={() => open()} className="w-full border-dashed border-2 h-24 rounded-2xl flex flex-col gap-2 overflow-hidden">
                                    {product.imageUrl ? (
                                        <Image src={product.imageUrl} alt="preview" width={100} height={100} className="object-cover h-full w-full rounded-xl" />
                                    ) : (
                                        <><ImagePlus /> <span className="text-xs">Upload Image</span></>
                                    )}
                                </Button>
                            )}
                        </CldUploadWidget>

                        <Button onClick={handleAction} disabled={isLoading} className={`w-full rounded-2xl h-14 font-bold ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black'} text-white`}>
                            {isLoading ? <Loader2 className="animate-spin" /> : (editingId ? "UPDATE PRODUCT" : "PUBLISH TO STORE")}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                    <CardHeader><CardTitle>Live Inventory ({inventory.length})</CardTitle></CardHeader>
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
                                <TableRow><TableCell colSpan={3} className="text-center py-10">Loading...</TableCell></TableRow>
                            ) : inventory.map((item: any) => (
                                <TableRow key={item._id} className={editingId === item._id ? "bg-blue-50/50" : ""}>
                                    <TableCell className="flex items-center gap-3">
                                        <div className="relative h-10 w-10 rounded overflow-hidden border">
                                            <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <span className="font-bold">{item.name}</span>
                                    </TableCell>
                                    <TableCell>₵{item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="text-blue-500 hover:bg-blue-50"><Edit3 size={18} /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)} className="text-red-500 hover:bg-red-50"><Trash2 size={18} /></Button>
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