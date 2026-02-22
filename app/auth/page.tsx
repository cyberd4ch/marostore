"use client";

import { useEffect, useState, Suspense } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { selectCurrentUser } from "@/app/store/user/user.selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "@/components/sign-in-form/sign-in-form.component";
import SignUpForm from "@/components/sign-up-form/sign-up-form.component";
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
                    <SignUpForm onSwitchToSignIn={() => setActiveTab("signin")} />
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
}