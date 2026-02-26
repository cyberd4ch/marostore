import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { reference, customerEmail, customerPhone, shippingAddress, customerName, items } = body;

        if (!reference) {
            return NextResponse.json({ message: 'Transaction reference is required' }, { status: 400 });
        }

        // 1. VERIFY WITH PAYSTACK SECURELY
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${secretKey?.trim()}`,
                'Content-Type': 'application/json',
            },
        });

        const paystackData = await paystackRes.json();

        if (!paystackData.status || paystackData.data.status !== 'success') {
            return NextResponse.json({ verified: false, message: 'Payment verification failed' }, { status: 400 });
        }

        // 2. CHECK IF ORDER ALREADY EXISTS (Handles page refreshes perfectly)
        const orderRef = adminDb.collection('orders').doc(reference);
        const orderDoc = await orderRef.get();

        if (orderDoc.exists) {
            // If it exists, return the existing data to show the receipt again
            return NextResponse.json({ success: true, message: 'Order already verified', data: orderDoc.data() }, { status: 200 });
        }

        // 3. BULLETPROOF DATA VALIDATION
        // If the user cleared their cache mid-transaction, items might be missing.
        if (!items || items.length === 0) {
            console.error("Critical: Order verified but items missing from payload");
        }

        const totalAmount = paystackData.data.amount / 100; // Trust Paystack's ledger!

        // 4. SAVE TO FIREBASE
        const newOrder = {
            orderReference: reference,
            paystackRef: reference,
            customerEmail: customerEmail || paystackData.data.customer.email,
            customerName: customerName || 'N/A',
            customerPhone: customerPhone || 'N/A',
            shippingAddress: shippingAddress || 'N/A',
            items: items || [], 
            totalAmount: totalAmount, 
            paymentStatus: 'success',
            status: 'Pending', 
            createdAt: new Date().toISOString(),
        };

        await orderRef.set(newOrder);

        // 5. FIRE OFF THE RESEND EMAIL (Ironclad: Backend driven)
        try {
            await resend.emails.send({
                from: 'Maro Store <orders@yourdomain.com>', // Update with your verified Resend domain
                to: newOrder.customerEmail,
                subject: `Receipt for Order #${reference.slice(-8)}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #0f172a;">Payment Successful!</h1>
                        <p>Hi ${newOrder.customerName !== 'N/A' ? newOrder.customerName : 'there'},</p>
                        <p>We've received your order <strong>#${reference.slice(-8)}</strong> and are getting it ready for shipment.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin:0; font-weight: bold;">Total Paid: ₵${totalAmount.toLocaleString()}</p>
                            <p style="margin:5px 0 0 0; font-size: 14px; color: #64748b;">Shipping to: ${newOrder.shippingAddress}</p>
                        </div>
                        <p>Thank you for shopping with Maro Store!</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Resend Email Failed:", emailError);
            // We do NOT fail the order if the email fails. The transaction still counts.
        }

        return NextResponse.json({ success: true, verified: true, data: newOrder }, { status: 201 });

    } catch (error: any) {
        console.error('VERIFY_AND_CREATE_ERROR:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}