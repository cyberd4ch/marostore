"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import SignUpForm from "@/components/SignUpForm/sign-up-form.component";
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();

    return (
        <main className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden p-6">
            {/* Decorative Circles (Maro Aesthetic) */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden md:block hidden">
                <div className="absolute -right-[10%] -top-[10%] h-[1000px] w-[1000px] rounded-full bg-slate-50" />
                <div className="absolute -left-[5%] bottom-0 h-[600px] w-[600px] rounded-full bg-slate-50/50" />
            </div>

            <div className="relative z-10 w-full max-w-[450px] space-y-8">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 self-center font-black text-xl tracking-tighter justify-center">
                    <div className="bg-slate-900 text-white flex size-8 items-center justify-center rounded-lg">
                        <GalleryVerticalEnd className="size-5" />
                    </div>
                    MARO STORE
                </Link>

                {/* Form Container */}
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                    <Suspense fallback={<Loader2 className="animate-spin mx-auto h-8 w-8 text-slate-200" />}>
                        <SignUpForm onSwitchToSignIn={() => router.push("/auth")} />
                    </Suspense>
                </div>

                {/* Footer info */}
                <p className="px-8 text-center text-xs text-slate-400 leading-relaxed">
                    By joining, you agree to our <a href="#" className="underline font-bold text-slate-900">Terms of Service</a> and <a href="#" className="underline font-bold text-slate-900">Privacy Policy</a>.
                </p>
            </div>
        </main>
    );
}