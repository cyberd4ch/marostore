import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmation';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { email, orderId, cartItems, total } = await request.json();

        const data = await resend.emails.send({
            from: 'marostore <onboarding@resend.dev>', // Use 'onboarding@resend.dev' for testing
            to: [email],
            subject: `Order Confirmation - ${orderId}`,
            react: OrderConfirmationEmail({ orderId, cartItems, total }),
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error });
    }
}