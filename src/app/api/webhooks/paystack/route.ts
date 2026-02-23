import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(body)
            .digest('hex');

        // Verify the request comes from Paystack
        if (hash !== req.headers.get('x-paystack-signature')) {
            return new NextResponse('Invalid signature', { status: 401 });
        }

        const event = JSON.parse(body);

        if (event.event === 'charge.success') {
            await dbConnect();
            const { reference, customer, amount, metadata } = event.data;

            // Update or Create the order in MongoDB
            await Order.findOneAndUpdate(
                { orderReference: reference },
                {
                    orderReference: reference,
                    customerEmail: customer.email,
                    totalAmount: amount / 100, // Paystack sends in pesewas/kobo
                    paymentStatus: 'Paid',
                    status: 'Processing',
                    // Note: items are usually passed via metadata if using Webhooks primarily
                },
                { upsert: true }
            );
        }

        return new NextResponse('OK', { status: 200 });
    } catch (error) {
        return new NextResponse('Webhook Error', { status: 500 });
    }
}