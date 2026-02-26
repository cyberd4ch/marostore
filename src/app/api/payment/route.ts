import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, amount } = await request.json();

        if (!email || !amount) {
            return NextResponse.json({ message: 'Email and amount are required' }, { status: 400 });
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        // Generate base URL dynamically based on environment
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
            (process.env.NODE_ENV === 'production' ? 'https://marostore-nine.vercel.app' : 'http://localhost:3000');

        const body = JSON.stringify({
            email,
            amount: Math.round(amount * 100), // Paystack needs pesewas
            channels: ['card', 'mobile_money'],
            currency: 'GHS',
            callback_url: `${baseUrl}/shop/checkout/success`,
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

        return NextResponse.json(data.data); // Returns { authorization_url, access_code, reference }

    } catch (error) {
        console.error('PAYMENT_ROUTE_ERROR:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}