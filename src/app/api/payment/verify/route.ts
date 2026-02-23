import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
        return NextResponse.json({ message: 'Reference is required' }, { status: 400 });
    }

    try {
        const secretKey = process.env.PAYSTACK_SECRET_KEY;

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${secretKey?.trim()}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        // Check if transaction was successful
        if (data.status && data.data.status === 'success') {
            return NextResponse.json({ verified: true, data: data.data });
        }

        return NextResponse.json({ verified: false, message: data.message }, { status: 400 });
    } catch (error) {
        console.error('VERIFICATION_ERROR:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}