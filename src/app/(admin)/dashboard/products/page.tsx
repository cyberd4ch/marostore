'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';

const ProductManager = () => {
    const [product, setProduct] = useState({ name: '', price: '', imageUrl: '', category: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...product,
                    price: Number(product.price) // Convert string "200" to number 200
                }),
            });

            if (response.ok) {
                toast.success("Product published to MongoDB!");
                // Optional: reset form or redirect
            }
        } catch (error) {
            toast.error("Failed to upload product");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-black tracking-tighter">INVENTORY CONTROL</h1>
            <Card className="rounded-[2.5rem] border-none shadow-xl">
                <CardHeader>
                    <CardTitle>Add New Drop</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input placeholder="Product Name" onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                    <Input placeholder="Price (GHS)" type="number" onChange={(e) => setProduct({ ...product, price: e.target.value })} />
                    <Input placeholder="Image URL" onChange={(e) => setProduct({ ...product, imageUrl: e.target.value })} />
                    <Button onClick={handleUpload} className="w-full bg-black text-white rounded-2xl h-14">
                        PUBLISH TO STORE
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};