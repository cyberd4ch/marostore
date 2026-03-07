import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email, displayName } = await req.json();

    try {
        const data = await resend.emails.send({
            from: 'marostore <onboarding@yourdomain.com>', // Replace with your verified domain
            to: [email],
            subject: 'Welcome to marostore!',
            html: `<h1>Hi ${displayName}!</h1><p>Thanks for joining us. Your fashion profile is officially ready.</p>`,
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}