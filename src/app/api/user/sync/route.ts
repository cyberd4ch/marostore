import dbConnect from '@/lib/mongodb';
import User from '@/models/User'; // Ensure you have a User model
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email, username } = await req.json();

        // Find user or create them if they are new
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                username: username || email.split('@')[0],
                isAdmin: false // Default to false
            });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}