"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { AuthError, AuthErrorCodes } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/button/button.component";
import { signUpStart } from "@/app/store/user/user.action";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const defaultFormFields = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

interface SignUpFormProps {
    onSwitchToSignIn?: () => void;
}

const SignUpForm = ({ onSwitchToSignIn }: SignUpFormProps) => {
    const dispatch = useDispatch();
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [isLoading, setIsLoading] = useState(false);
    const { displayName, email, password, confirmPassword } = formFields;

    const resetFormFields = () => setFormFields(defaultFormFields);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        const signupToast = toast.loading("Creating your account...");

        try {
            dispatch(signUpStart(email, password, displayName));
            resetFormFields();
            setTimeout(() => {
                toast.dismiss(signupToast);
                setIsLoading(false);
            }, 2000);
        } catch (error) {
            toast.dismiss(signupToast);
            setIsLoading(false);
            if ((error as AuthError).code === AuthErrorCodes.EMAIL_EXISTS) {
                toast.error("This email is already in use");
            } else {
                toast.error("Sign up failed. Please try again.");
                console.error("Sign up failed", error);
            }
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormFields((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col items-center gap-2 text-center mb-8">
                <span className="px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Join The Club
                </span>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                    Create Account
                </h1>
                <p className="text-slate-500 font-medium text-sm">
                    Unlock exclusive fashion drops and fast checkout.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Full Name
                    </Label>
                    <Input
                        id="displayName"
                        name="displayName"
                        type="text"
                        placeholder="e.g. John Doe"
                        required
                        disabled={isLoading}
                        value={displayName}
                        onChange={handleChange}
                        className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-900 rounded-xl px-4"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        disabled={isLoading}
                        value={email}
                        onChange={handleChange}
                        className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-900 rounded-xl px-4"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            disabled={isLoading}
                            value={password}
                            onChange={handleChange}
                            className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-900 rounded-xl px-4"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Confirm
                        </Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            disabled={isLoading}
                            value={confirmPassword}
                            onChange={handleChange}
                            className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-slate-900 rounded-xl px-4"
                        />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-all mt-6"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating Account...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            JOIN MARO STORE <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500 font-medium">
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitchToSignIn}
                    disabled={isLoading}
                    className="font-bold text-slate-900 hover:underline underline-offset-4 transition-all"
                >
                    Sign in here
                </button>
            </div>
        </div>
    );
};

export default SignUpForm;