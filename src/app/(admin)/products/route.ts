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