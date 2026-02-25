/* "use client";

import { useEffect, useState, Suspense } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { selectCurrentUser } from "@/store/user/user.selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "@/components/SignInForm/sign-in-form.component";
import SignUpForm from "@/components/SignUpForm/sign-up-form.component";
import { Loader2 } from "lucide-react";

// Move the logic into a sub-component to wrap it in Suspense
function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentUser = useSelector(selectCurrentUser);
    
    // Default to 'signin', but check search params
    const mode = searchParams.get("mode");
    const [activeTab, setActiveTab] = useState(mode === "signup" ? "signup" : "signin");

    useEffect(() => {
        if (currentUser) {
            router.push("/onboarding"); 
        }
    }, [currentUser, router]);

    if (currentUser) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-slate-900" />
                <p className="text-slate-500 animate-pulse">Redirecting...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-xl p-1 mb-8">
                    <TabsTrigger 
                        value="signin" 
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase text-xs tracking-widest"
                    >
                        Sign In
                    </TabsTrigger>
                    <TabsTrigger 
                        value="signup"
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold uppercase text-xs tracking-widest"
                    >
                        Sign Up
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="border-none p-0 outline-none">
                    <SignInForm onSwitchToSignUp={() => setActiveTab("signup")} />
                </TabsContent>
                <TabsContent value="signup" className="border-none p-0 outline-none">
                    <SignUpForm onSwitchToSignIn={() => router.push("/auth/register")} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Main Page Export with Suspense Boundary
export default function AuthPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/50 p-6">
            <Suspense fallback={
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            }>
                <AuthContent />
            </Suspense>
        </div>
    );
} */

"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "@/components/SignInForm/sign-in-form.component"; // Adjust path if needed
import { GalleryVerticalEnd, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();

    return (
        <main className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden p-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden md:block hidden">
                <div className="absolute -right-[10%] -top-[10%] h-[1000px] w-[1000px] rounded-full bg-slate-50" />
                <div className="absolute -left-[5%] bottom-0 h-[600px] w-[600px] rounded-full bg-slate-50/50" />
            </div>

            <div className="relative z-10 w-full max-w-[450px] space-y-8">
                <Link href="/" className="flex items-center gap-3 self-center font-black text-xl tracking-tighter justify-center">
                    <div className="bg-slate-900 text-white flex size-8 items-center justify-center rounded-lg">
                        <GalleryVerticalEnd className="size-5" />
                    </div>
                    MARO STORE
                </Link>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
                    <Suspense fallback={<Loader2 className="animate-spin mx-auto h-8 w-8 text-slate-200" />}>
                        <SignInForm onSwitchToSignUp={() => router.push("/auth/register")} />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}