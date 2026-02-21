"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { selectCurrentUser } from "@/app/store/user/user.selector"; // Adjust path as needed
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "@/components/sign-in-form/sign-in-form.component";
import SignUpForm from "@/components/sign-up-form/sign-up-form.component";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentUser = useSelector(selectCurrentUser);
    
    const initialTab = searchParams.get("mode") === "signup" ? "signup" : "signin";
    const [activeTab, setActiveTab] = useState(initialTab);

    // NAVIGATION LOGIC: Watch for successful login
    useEffect(() => {
        if (currentUser) {
            // Check if user has completed profile (optional check)
            // If you have a 'profileCompleted' flag in Redux, use it here
            router.push("/onboarding"); 
        }
    }, [currentUser, router]);

    // If user is already logged in, show a loader while redirecting
    if (currentUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Redirecting to onboarding...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <SignInForm onSwitchToSignUp={() => setActiveTab("signup")} />
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignUpForm onSwitchToSignIn={() => setActiveTab("signin")} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}