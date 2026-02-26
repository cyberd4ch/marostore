// app/auth/page.tsx
'use client';

import SignInForm from '@/components/SignInForm/sign-in-form.component';
import { Card } from "@/components/ui/card";

export default function AuthPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md rounded-[2.5rem] shadow-2xl border-none p-8 bg-white">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-black p-3 rounded-2xl mb-4">
                        <span className="text-white font-bold">M</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter italic">MARO STORE</h1>
                </div>

                {/* Single point of entry for ALL users */}
                <SignInForm onSwitchToSignUp={() => { }} />
            </Card>
        </div>
    );
}