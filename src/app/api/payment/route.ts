import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, amount } = await request.json();

        // 1. Validation
        if (!email || !amount) {
            return NextResponse.json(
                { message: 'Email and amount are required' },
                { status: 400 }
            );
        }

        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        if (!secretKey) {
            console.error("PAYSTACK_SECRET_KEY is missing in production environment");
            return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
        }

        // 2. Prepare Paystack params
        // Paystack expects amount in pesewas (amount * 100)
        const body = JSON.stringify({
            email,
            amount: Math.round(amount * 100),
            // Optional: add channels to restrict to mobile_money
            channels: ['card', 'mobile_money'],
            currency: 'GHS',
            callback_url: '/order-success',
        });

        // 3. Initialize transaction
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
            console.error('Paystack API Rejected Request:', data);
            return NextResponse.json(
                { message: data.message || 'Payment initialization failed' },
                { status: response.status }
            );
        }

        if (!data.status) {
            // THIS LOG IS CRUCIAL: Check this in Vercel Function Logs
            console.error('Paystack Error Details:', data);
            return NextResponse.json(
                { message: data.message || 'Paystack initialization failed' },
                { status: 400 }
            );
        }

        // 4. Return the authorization_url to the frontend
        return NextResponse.json(data.data);

    } catch (error) {
        console.error('PAYMENT_ROUTE_ERROR:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}