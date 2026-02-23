import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmation';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Fix: Add a fallback empty string or check to prevent the constructor error during build
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(request: Request) {
    // 1. Check for the real key at runtime
    if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY");
        return NextResponse.json({ error: "Email configuration error" }, { status: 500 });
    }

    try {
        const { email, orderId, cartItems, total } = await request.json();

        const data = await resend.emails.send({
            from: 'Maro Store <onboarding@resend.dev>', // Change this once domain is verified
            to: [email],
            subject: `Order Confirmation - ${orderId}`,
            react: OrderConfirmationEmail({ orderId, cartItems, total }),
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}