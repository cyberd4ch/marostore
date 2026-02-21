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

        // 2. Prepare Paystack params
        // Paystack expects amount in pesewas (amount * 100)
        const body = JSON.stringify({
            email,
            amount: Math.round(amount * 100),
            // Optional: add channels to restrict to mobile_money
            channels: ['card', 'mobile_money'],
            currency: 'GHS',
        });

        // 3. Initialize transaction
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}`,
                'Content-Type': 'application/json',
            },
            body,
        });

        const data = await response.json();

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
        console.error('PAYMENT_ERROR:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}