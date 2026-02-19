"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from "@/components/sign-in-form/sign-in-form.component";
import SignUpForm from "@/components/sign-up-form/sign-up-form.component";

export default function AuthPage() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get("mode") === "signup" ? "signup" : "signin";
    const [activeTab, setActiveTab] = useState(initialTab);

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