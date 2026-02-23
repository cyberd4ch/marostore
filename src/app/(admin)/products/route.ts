import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Basic validation
        if (!body.name || !body.price) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const newProduct = await Product.create(body);
        return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        await Product.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const { id, ...updateData } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json({ success: true, data: updatedProduct });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}