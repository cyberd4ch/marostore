'use client';

import { useState } from 'react';
import { auth } from '@/app/utils/firebase/firebase.utils';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

import { sendPasswordResetEmail } from 'firebase/auth';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setStatus('success');

            // Short delay so they can actually see the success state
            setTimeout(() => {
                router.push('/dashboard');
            }, 1500);
        } catch (error: any) {
            setStatus('idle');
            toast.error("Invalid credentials. Please check your email and password.");
        }
    };

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="animate-in zoom-in duration-500 flex flex-col items-center">
                    <CheckCircle2 className="text-green-500 w-16 h-16 mb-4" />
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back, Admin</h2>
                    <p className="text-slate-500">Preparing your dashboard...</p>
                </div>
            </div>
        );
    }

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error("Please enter your email address first so we know where to send the link.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset link sent! Please check your inbox (and spam folder).");
        } catch (error: any) {
            toast.error("Could not send reset email. Please verify the address.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md rounded-[2.5rem] shadow-2xl border-none p-8 bg-white">
                <CardHeader className="flex flex-col items-center space-y-2">
                    <div className="bg-black p-3 rounded-2xl mb-2">
                        <Lock className="text-white w-6 h-6" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter italic">MARO STORE</CardTitle>
                    <p className="text-slate-400 text-sm">Secure Merchant Access</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                className="rounded-xl bg-slate-50 border-none h-12"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                className="rounded-xl bg-slate-50 border-none h-12"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end pr-1">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-xs text-slate-400 hover:text-black transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <Button
                            disabled={status === 'loading'}
                            className="w-full rounded-xl bg-black hover:bg-slate-800 h-12 transition-all"
                        >
                            {status === 'loading' ? (
                                <Loader2 className="animate-spin mr-2" />
                            ) : "Enter Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}