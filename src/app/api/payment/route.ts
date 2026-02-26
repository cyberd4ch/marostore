import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, amount, cart, customerDetails } = await request.json();

        if (!email || !amount) {
            return NextResponse.json({ message: 'Email and amount are required' }, { status: 400 });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            console.error("PAYSTACK_SECRET_KEY missing");
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        // 1. DYNAMIC BASE URL (No trailing slash)
        const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 
            (process.env.NODE_ENV === 'production' 
                ? 'https://marostore-nine.vercel.app' 
                : 'http://localhost:3000')).replace(/\/$/, ""); // Force remove trailing slash

        // 2. PREPARE PAYSTACK BODY
        const body = JSON.stringify({
            email,
            amount: Math.round(amount * 100), // GHS to Pesewas
            currency: 'GHS',
            channels: ['card', 'mobile_money'],
            // EXACT CALLBACK: Next.js is case-sensitive and slash-sensitive
            callback_url: `${baseUrl}/shop/checkout/success`,
            // 3. BACKUP METADATA: Storing order info inside Paystack itself
            metadata: {
                cart: cart || [],
                customerDetails: customerDetails || {},
                custom_fields: [
                    {
                        display_name: "Customer Phone",
                        variable_name: "customer_phone",
                        value: customerDetails?.phone || "N/A"
                    }
                ]
            }
        });

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secretKey.trim()}`,
                'Content-Type': 'application/json',
            },
            body,
        });

        const data = await response.json();

        if (!response.ok || !data.status) {
            return NextResponse.json({ message: data.message || 'Initialization failed' }, { status: 400 });
        }

        // Returns { authorization_url, access_code, reference }
        return NextResponse.json(data.data);

    } catch (error: any) {
        console.error('PAYMENT_ROUTE_ERROR:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}