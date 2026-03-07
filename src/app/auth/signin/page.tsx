'use client';

import SignInForm from '@/components/SignInForm/sign-in-form.component';
import { Card } from "@/components/ui/card";
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function ShopSignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md rounded-[2.5rem] shadow-2xl border-none p-8 bg-white">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-black p-3 rounded-2xl mb-4">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter italic">MARO STORE</h1>
                    <p className="text-slate-400 text-sm mt-1">Shop Member Sign In</p>
                </div>

                {/* This component should handle standard user login/redirect to home */}
                <SignInForm redirectPath="/" onSwitchToSignUp={() => {}} />

                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center space-y-3">
                    <p className="text-xs text-slate-400">
                        Not a member? <Link href="/auth/signup" className="text-black font-bold hover:underline">Join us</Link>
                    </p>
                    <Link 
                        href="/auth" 
                        className="flex items-center text-[10px] text-slate-300 hover:text-slate-500 transition-colors"
                    >
                        <Lock className="w-3 h-3 mr-1" />
                        Merchant Access
                    </Link>
                </div>
            </Card>
        </div>
    );
}