"use client";

import { useState, FormEvent, ChangeEvent, FC } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button from "@/components/button/button.component";
import { googleSignInStart, emailSignInStart } from "@/store/user/user.action";
import { Apple, Chromium, Facebook, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner as used in your Cart component

const defaultFormFields = {
    email: "",
    password: "",
};

interface SignInFormProps {
    onSwitchToSignUp?: () => void;
}

const SignInForm: FC<SignInFormProps> = ({ onSwitchToSignUp }) => {
    const dispatch = useDispatch();
    const [formFields, setFormFields] = useState(defaultFormFields);
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const { email, password } = formFields;

    const resetFormFields = () => setFormFields(defaultFormFields);

    const signInWithGoogle = () => {
        setIsLoading(true);
        toast.info("Opening Google Sign-In...");
        dispatch(googleSignInStart());
        // Note: Sagas handle the redirect, so we don't manually set isLoading(false) here
        // as the page will usually redirect or refresh.
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(emailSignInStart(email, password));
        setIsLoading(true);

        // We fire the toast immediately to give feedback
        const loginToast = toast.loading("Verifying credentials...");

        try {
            dispatch(emailSignInStart(email, password));
            // We clear the loading toast after a brief delay 
            // Sagas will handle the actual navigation/error state globally
            setTimeout(() => {
                toast.dismiss(loginToast);
                setIsLoading(false);
            }, 2000);
        } catch (error) {
            toast.error("Sign in failed. Please check your credentials.");
            toast.dismiss(loginToast);
            setIsLoading(false);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormFields((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your account details below to login
                </p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        disabled={isLoading}
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="ml-auto text-sm text-muted-foreground hover:underline">
                            Forgot your password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        disabled={isLoading}
                        value={password}
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        "Login"
                    )}
                </Button>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <Button variant="inverted" className="w-full" type="button" disabled={isLoading}>
                        <Apple className="h-4 w-4" />
                        <span className="sr-only">Login with Apple</span>
                    </Button>

                    <Button variant="google" className="w-full" type="button" onClick={signInWithGoogle} disabled={isLoading}>
                        <Chromium className="h-4 w-4" />
                        <span className="sr-only">Login with Google</span>
                    </Button>

                    <Button variant="inverted" className="w-full" type="button" disabled={isLoading}>
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Login with Meta</span>
                    </Button>
                </div>
            </form>

            {onSwitchToSignUp && (
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToSignUp}
                        className="underline underline-offset-4 hover:text-primary"
                        disabled={isLoading}
                    >
                        Sign up
                    </button>
                </div>
            )}
        </div>
    );
};

export default SignInForm;