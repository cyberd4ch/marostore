'use client';
'use client';

import { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { auth } from '@/app/utils/firebase/firebase.utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this shadcn component
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { ImagePlus, Trash2, Loader2, Edit3, X, Clock, Tag, Ruler, Palette, Percent } from 'lucide-react';
import Image from 'next/image';

const ProductManager = () => {
    // 2. NEW STATE: Added status and activationDate
    // 1. EXPANDED STATE SCHEMA
    const initialState = {
        name: '',
        price: '',
        discountPrice: '', // New
        imageUrl: '',
        gallery: [] as string[], // New: Multiple photos
        category: '',
        brand: '', // New
        stock: '',
        status: 'published',
        activationDate: '',
        sex: 'unisex', // New
        colors: '', // Will be stored as array, handled as string in input
        sizes: '', // Will be stored as array, handled as string in input
        weight: '', // New
        sku: '', // New
        tag: '', // New (e.g., 'New Arrival', 'Limited')
        description: '' // New (The "Write up")
    };
    const [product, setProduct] = useState(initialState);
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchInventory = async () => {
        setIsFetching(true);
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            if (Array.isArray(data)) setInventory(data);
        } catch (error) {
            toast.error("Network error");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => { fetchInventory(); }, []);

    const startEdit = (item: any) => {
        setEditingId(item._id);
        const formattedDate = item.activationDate ? new Date(item.activationDate).toISOString().slice(0, 16) : '';

        setProduct({
            ...item,
            price: item.price.toString(),
            discountPrice: item.discountPrice?.toString() || '',
            stock: (item.stock ?? 0).toString(),
            activationDate: formattedDate,
            colors: Array.isArray(item.colors) ? item.colors.join(', ') : '',
            sizes: Array.isArray(item.sizes) ? item.sizes.join(', ') : '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setProduct(initialState);
    };

    // ... (keep state and other functions)

const handleAction = async () => {
    if (!product.imageUrl) return toast.error("Main image is required");
    if (!product.name || !product.price) return toast.error("Name and Price are required");

    setIsLoading(true);
    const method = editingId ? 'PUT' : 'POST';
    
    let token;
    try {
        token = await auth.currentUser?.getIdToken(true);
        if (!token) throw new Error("No session found");
    } catch (authError) {
        toast.error("Security session expired. Please refresh.");
        setIsLoading(false);
        return;
    }

    const body = {
        ...product,
        id: editingId,
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        stock: Number(product.stock),
        colors: typeof product.colors === 'string' 
            ? product.colors.split(',').map(c => c.trim()).filter(c => c !== "") 
            : product.colors,
        sizes: typeof product.sizes === 'string' 
            ? product.sizes.split(',').map(s => s.trim()).filter(s => s !== "") 
            : product.sizes,
        status: product.status,
    };

    try {
        // ENSURE THIS URL STARTS WITH /
        const response = await fetch('/api/products', {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        // --- BULLETPROOF PARSING ---
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
            const errorData = await response.text(); // Read as text if not JSON
            console.error("Server Error Response:", errorData);
            throw new Error(`Server Error: ${response.status}`);
        }

        const result = await response.json();
        // ---------------------------

        toast.success(editingId ? "Product updated!" : "Success! Item is live.");
        cancelEdit();
        fetchInventory();
        
    } catch (error: any) {
        console.error("Submission error:", error);
        toast.error(error.message || "Network error. Check console.");
    } finally {
        setIsLoading(false);
    }
};

const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    
    try {
        const token = await auth.currentUser?.getIdToken();
        
        // FIX: Changed /api/admin/products to /api/products
        const response = await fetch(`/api/products?id=${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Delete failed");
        }

        toast.success("Removed");
        setInventory((prev) => prev.filter((item: any) => item._id !== id));
    } catch (error: any) {
        console.error("Delete error:", error);
        toast.error(error.message);
    }
};

    return (
        <div className="p-4 md:p-8 space-y-12 bg-slate-50 min-h-screen pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-blue-600 font-bold text-sm tracking-widest uppercase">Console</p>
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">Maro Inventory</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-8">
                {/* --- FORM SECTION --- */}
                <Card className="rounded-[2rem] border-none shadow-2xl h-fit sticky top-8 bg-white overflow-hidden">
                    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                        <CardTitle className="text-lg font-bold uppercase tracking-tight">
                            {editingId ? "Modify Product" : "New Drop Entry"}
                        </CardTitle>
                        {editingId && <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={cancelEdit}><X size={18} /></Button>}
                    </div>

                    <CardContent className="p-6 space-y-6">
                        {/* Publishing & Identity */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                                <select
                                    className="w-full rounded-xl border-slate-200 text-sm p-2 bg-slate-50 border"
                                    value={product.status}
                                    onChange={(e) => setProduct({ ...product, status: e.target.value })}
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Scheduled</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">SKU / ID</label>
                                <Input className="rounded-xl" placeholder="MS-001" value={product.sku} onChange={(e) => setProduct({ ...product, sku: e.target.value })} />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                                <Tag size={12} /> Essential Details
                            </label>
                            <Input placeholder="Product Name (e.g. Jordan 1 Retro)" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-400">Regular Price</label>
                                    <Input type="number" placeholder="₵ 0.00" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-400">Discount Price (Optional)</label>
                                    <Input type="number" placeholder="₵ 0.00" value={product.discountPrice} onChange={(e) => setProduct({ ...product, discountPrice: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Variants (Sizes & Colors) */}
                        <div className="space-y-3 pt-2 border-t">
                            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                <Palette size={12} /> Variants & Logistics
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="Colors (Red, Blue...)" value={product.colors} onChange={(e) => setProduct({ ...product, colors: e.target.value })} />
                                <Input placeholder="Sizes (42, 44, XL...)" value={product.sizes} onChange={(e) => setProduct({ ...product, sizes: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    className="rounded-xl border-slate-200 text-sm p-2 bg-slate-50 border"
                                    value={product.sex}
                                    onChange={(e) => setProduct({ ...product, sex: e.target.value })}
                                >
                                    <option value="unisex">Unisex</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <Input placeholder="Stock Qty" type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
                            </div>
                        </div>

                        {/* Brand & Write up */}
                        <div className="space-y-3 pt-2 border-t">
                            <Input placeholder="Brand (e.g. Nike, Adidas)" value={product.brand} onChange={(e) => setProduct({ ...product, brand: e.target.value })} />
                            <Textarea
                                placeholder="The Product Story (Write up about the item...)"
                                className="min-h-[100px] rounded-2xl resize-none"
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            />
                        </div>

                        {/* Media Upload */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Photo</label>
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                options={{ clientAllowedFormats: ["png", "jpeg", "jpg"], maxFiles: 1 }}
                                onSuccess={(result: any) => {
                                    if (result.event === "success") {
                                        setProduct(prev => ({ ...prev, imageUrl: result.info.secure_url }));
                                        toast.success("Main image set");
                                    }
                                }}
                            >
                                {({ open }) => (
                                    <Button type="button" variant="outline" onClick={() => open()} className="w-full border-dashed border-2 h-40 rounded-3xl flex flex-col gap-2 overflow-hidden bg-slate-50 relative group">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt="preview" fill className="object-cover transition-transform group-hover:scale-105" unoptimized />
                                        ) : (
                                            <><ImagePlus size={32} className="text-slate-300" /> <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image</span></>
                                        )}
                                    </Button>
                                )}
                            </CldUploadWidget>
                        </div>

                        <Button onClick={handleAction} disabled={isLoading} className={`w-full rounded-2xl h-16 font-black tracking-widest ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-black'} text-white transition-all shadow-lg`}>
                            {isLoading ? <Loader2 className="animate-spin" /> : (editingId ? "CONFIRM UPDATES" : "DEPOSIT TO INVENTORY")}
                        </Button>
                    </CardContent>
                </Card>

                {/* --- TABLE SECTION --- */}
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-8 border-b bg-white">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-black uppercase">Live Catalog</CardTitle>
                            <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-xs font-bold">{inventory.length} ITEMS</span>
                        </div>
                    </CardHeader>
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="pl-8 py-5">Product Details</TableHead>
                                <TableHead>Metrics</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-8">Management</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetching ? (
                                <TableRow><TableCell colSpan={4} className="text-center py-32"><Loader2 className="animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                            ) : inventory.map((item: any) => (
                                <TableRow key={item._id} className={`group ${editingId === item._id ? "bg-blue-50/50" : "hover:bg-slate-50/50"}`}>
                                    <TableCell className="pl-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-slate-100">
                                                {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" unoptimized />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-base uppercase leading-tight">{item.name}</p>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[9px] font-bold text-blue-500 uppercase">{item.brand || 'No Brand'}</span>
                                                    <span className="text-[9px] font-bold text-slate-300 uppercase">•</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{item.sku || 'No SKU'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-700">₵{Number(item.price).toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">Qty: {item.stock}</p>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {item.status === 'draft' ? (
                                                <span className="w-fit px-2 py-0.5 rounded text-[9px] font-black bg-orange-100 text-orange-600 uppercase">Draft</span>
                                            ) : (
                                                <span className="w-fit px-2 py-0.5 rounded text-[9px] font-black bg-green-100 text-green-600 uppercase">Live</span>
                                            )}
                                            {item.discountPrice && (
                                                <span className="w-fit px-2 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white uppercase flex items-center gap-1">
                                                    <Percent size={8} /> Sale
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item._id)} className="h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></Button>
                                        </div>
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