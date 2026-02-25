import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        await dbConnect();
        
        // 1. Destructure everything from the request body
        const body = await req.json();
        const { email, username } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // 2. Use findOneAndUpdate with 'upsert'
        // This finds the user by email and updates them with ALL provided data,
        // or creates a new one if they don't exist.
        const user = await User.findOneAndUpdate(
            { email }, 
            { 
                $set: { 
                    ...body, // Spread all incoming fields (displayName, photoURL, etc)
                    username: username || email.split('@')[0],
                },
                $setOnInsert: { isAdmin: false } // Only set isAdmin if creating new
            },
            { 
                new: true,      // Return the updated document
                upsert: true,   // Create if not found
                runValidators: true // Ensure it follows your Schema
            }
        );

        return NextResponse.json(user);
    } catch (error: any) {
        console.error("User Sync Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" }, 
            { status: 500 }
        );
    }
}