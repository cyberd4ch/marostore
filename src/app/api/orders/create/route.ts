import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const { orderReference, customerEmail, items, totalAmount, momoNumber } = body;

        // Check if order already exists to prevent duplicates on page refresh
        const existingOrder = await Order.findOne({ orderReference });
        if (existingOrder) {
            return NextResponse.json({ message: 'Order already recorded' }, { status: 200 });
        }

        const newOrder = await Order.create({
            orderReference,
            customerEmail,
            items,
            totalAmount,
            momoNumber,
            paymentStatus: 'Paid', // Verified via Success Page logic
            status: 'Processing'
        });

        return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}