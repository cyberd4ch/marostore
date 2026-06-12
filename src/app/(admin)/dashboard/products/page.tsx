'use client';

import { useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { auth } from '@/lib/utils/firebase/firebase.utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'sonner';
import { ImagePlus, Trash2, Loader2, Edit3, X, Tag, Palette, Percent } from 'lucide-react';
import Image from 'next/image';

const ProductManager = () => {
    const initialState = {
        name: '',
        price: '',
        compare_at_price: '', 
        imageUrl: '',
        category_id: '', // Saved as Foreign Key Target string ID
        stock: '',
        is_active: true,
        is_trending: false,
        colors: '', 
        sizes: '', 
        description: '' 
    };

    const [product, setProduct] = useState(initialState);
    const [inventory, setInventory] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]); // New Track for DB relationships
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Fetch dynamic products and categories arrays from Django
    const fetchDependencies = async () => {
        setIsFetching(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products/'),
                fetch('/api/categories/')
            ]);
            
            const prodData = await prodRes.json();
            const catData = await catRes.json();

            if (Array.isArray(prodData)) setInventory(prodData);
            if (Array.isArray(catData)) setCategories(catData);
        } catch (error) {
            toast.error("Network error sync failed");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => { fetchDependencies(); }, []);

    const startEdit = (item: any) => {
        setEditingId(item.id);
        setProduct({
            name: item.name,
            price: item.price.toString(),
            compare_at_price: item.compare_at_price?.toString() || '',
            imageUrl: item.feature_image || '',
            category_id: categories.find(c => c.name === item.category)?.id || '',
            stock: (item.base_stock ?? 0).toString(),
            is_active: item.is_active ?? true,
            is_trending: item.is_trending ?? false,
            colors: '', // Extracted via nested model variations metadata if applicable
            sizes: '',
            description: item.description || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setProduct(initialState);
    };

    const handleAction = async () => {
        if (!product.imageUrl) return toast.error("Main image required via Cloudinary widget");
        if (!product.name || !product.price || !product.category_id) return toast.error("Name, Price, and Category are required");

        setIsLoading(true);
        
        let token;
        try {
            token = await auth.currentUser?.getIdToken(true);
            if (!token) throw new Error("No secure token found");
        } catch (authError) {
            toast.error("Security session expired. Please re-authenticate.");
            setIsLoading(false);
            return;
        }

        // Setup the exact structure your Django ProductCreateSerializer expects
        const body = {
            name: product.name,
            category_id: parseInt(product.category_id),
            description: product.description,
            price: parseFloat(product.price),
            compare_at_price: product.compare_at_price ? parseFloat(product.compare_at_price) : null,
            is_trending: product.is_trending,
            is_active: product.is_active,
            base_stock: parseInt(product.stock) || 0,
            image_urls: [product.imageUrl], // Solution 1: URL structural strings parsed by custom upload view
            feature_image_index: 0
        };

        const targetUrl = editingId ? `/api/products/${editingId}/` : '/api/admin/products/upload/';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const response = await fetch(targetUrl, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Execution error context: ${errorData}`);
            }

            toast.success(editingId ? "Product updated successfully!" : "Success! Item synced with inventory logs.");
            cancelEdit();
            fetchDependencies();
        } catch (error: any) {
            console.error("Submission crash log:", error);
            toast.error("Operation failed. Verify console outputs.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Purge asset entirely from inventory database?")) return;
        
        try {
            const token = await auth.currentUser?.getIdToken();
            const response = await fetch(`/api/products/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Purge request rejected by core API");

            toast.success("Asset profile removed");
            setInventory((prev) => prev.filter((item: any) => item.id !== id));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-12 bg-slate-50 min-h-screen pb-20 font-space-grotesk">
            <div>
                <p className="text-blue-600 font-bold text-sm tracking-widest uppercase">Console</p>
                <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">Maro Inventory</h1>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-8">
                {/* --- FORM PANEL SECTION --- */}
                <Card className="rounded-[2rem] border-none shadow-2xl h-fit sticky top-8 bg-white overflow-hidden">
                    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                        <CardTitle className="text-lg font-bold uppercase tracking-tight">
                            {editingId ? "Modify Product" : "New Drop Entry"}
                        </CardTitle>
                        {editingId && <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={cancelEdit}><X size={18} /></Button>}
                    </div>

                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Visibility Status</label>
                                <select
                                    className="w-full rounded-xl border-slate-200 text-sm p-2 bg-slate-50 border"
                                    value={product.is_active ? "true" : "false"}
                                    onChange={(e) => setProduct({ ...product, is_active: e.target.value === "true" })}
                                >
                                    <option value="true">Live / Published</option>
                                    <option value="false">Hidden / Draft</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Target Category</label>
                                <select
                                    className="w-full rounded-xl border-slate-200 text-sm p-2 bg-slate-50 border"
                                    value={product.category_id}
                                    onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                                <Tag size={12} /> Essential Details
                            </label>
                            <Input placeholder="Product Name" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-400">Regular Price (GHS)</label>
                                    <Input type="number" placeholder="₵ 0.00" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-medium text-slate-400">Compare At Price</label>
                                    <Input type="number" placeholder="₵ 0.00" value={product.compare_at_price} onChange={(e) => setProduct({ ...product, compare_at_price: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 border-t">
                            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                <Palette size={12} /> Logistics & Placement
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="Stock Units" type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
                                <select
                                    className="rounded-xl border-slate-200 text-sm p-2 bg-slate-50 border"
                                    value={product.is_trending ? "true" : "false"}
                                    onChange={(e) => setProduct({ ...product, is_trending: e.target.value === "true" })}
                                >
                                    <option value="false">Standard Catalog Placement</option>
                                    <option value="true">Elevate to TrendingWear</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2 border-t">
                            <Textarea
                                placeholder="The Product Story write up..."
                                className="min-h-[100px] rounded-2xl resize-none"
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Asset Preview</label>
                            <CldUploadWidget
                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                options={{ clientAllowedFormats: ["png", "jpeg", "jpg"], maxFiles: 1 }}
                                onSuccess={(result: any) => {
                                    if (result.event === "success") {
                                        setProduct(prev => ({ ...prev, imageUrl: result.info.secure_url }));
                                        toast.success("Remote asset mapped cleanly");
                                    }
                                }}
                            >
                                {({ open }) => (
                                    <Button type="button" variant="outline" onClick={() => open()} className="w-full border-dashed border-2 h-40 rounded-3xl flex flex-col gap-2 overflow-hidden bg-slate-50 relative group">
                                        {product.imageUrl ? (
                                            <Image src={product.imageUrl} alt="preview" fill className="object-cover transition-transform group-hover:scale-105" unoptimized />
                                        ) : (
                                            <><ImagePlus size={32} className="text-slate-300" /> <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execute Asset Upload</span></>
                                        )}
                                    </Button>
                                )}
                            </CldUploadWidget>
                        </div>

                        <Button onClick={handleAction} disabled={isLoading} className={`w-full rounded-2xl h-16 font-black tracking-widest ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-black'} text-white transition-all shadow-lg`}>
                            {isLoading ? <Loader2 className="animate-spin" /> : (editingId ? "CONFIRM METADATA UPDATES" : "DEPOSIT TO TELEMETRY MATRIX")}
                        </Button>
                    </CardContent>
                </Card>

                {/* --- DATA TABLE STORAGE TRACKS --- */}
                <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                    <CardHeader className="p-8 border-b bg-white">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-black uppercase">Live Repository</CardTitle>
                            <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-xs font-bold">{inventory.length} SKUs TRACKED</span>
                        </div>
                    </CardHeader>
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="pl-8 py-5">Product Matrix</TableHead>
                                <TableHead>Valuation</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isFetching ? (
                                <TableRow><TableCell colSpan={4} className="text-center py-32"><Loader2 className="animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                            ) : inventory.map((item: any) => (
                                <TableRow key={item.id} className={`group ${editingId === item.id ? "bg-blue-50/50" : "hover:bg-slate-50/50"}`}>
                                    <TableCell className="pl-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0 bg-slate-100">
                                                {item.feature_image && <Image src={item.feature_image} alt={item.name} fill className="object-cover" unoptimized />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-base uppercase leading-tight">{item.name}</p>
                                                <span className="text-[9px] font-bold text-blue-500 uppercase">{item.category}</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-700">₵{Number(item.price).toLocaleString()}</p>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {item.is_active ? (
                                                <span className="w-fit px-2 py-0.5 rounded text-[9px] font-black bg-green-100 text-green-600 uppercase">Live</span>
                                            ) : (
                                                <span className="w-fit px-2 py-0.5 rounded text-[9px] font-black bg-orange-100 text-orange-600 uppercase">Hidden</span>
                                            )}
                                            {item.is_trending && (
                                                <span className="w-fit px-2 py-0.5 rounded text-[9px] font-black bg-blue-600 text-white uppercase flex items-center gap-1">
                                                    <Percent size={8} /> Trending
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => startEdit(item)} className="h-10 w-10 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></Button>
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
