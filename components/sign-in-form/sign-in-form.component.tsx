"use client";

import { useState, FormEvent, ChangeEvent, FC } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Button, { BUTTON_TYPE_CLASSES } from "@/components/button/button.component";
import { googleSignInStart, emailSignInStart } from "@/app/store/user/user.action";
import { Apple, Chromium, Facebook } from "lucide-react"; // Import icons

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
    const { email, password } = formFields;

    const resetFormFields = () => setFormFields(defaultFormFields);

    const signInWithGoogle = () => {
        dispatch(googleSignInStart());
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            dispatch(emailSignInStart(email, password));
            resetFormFields();
        } catch (error) {
            console.error("Sign in failed", error);
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
                {/* email and password fields */}
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                            href="#"
                            className="ml-auto text-sm underline-offset-4 hover:underline text-muted-foreground"
                        >
                            Forgot your password?
                        </a>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={handleChange}
                    />
                </div>
                <Button type="submit" className="w-full">
                    Login
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {/* Apple */}
                    <Button
                        variant="inverted"
                        className="w-full"
                        type="button"
                        onClick={() => { }}
                    >
                        <Apple className="h-4 w-4" />
                        <span className="sr-only">Login with Apple</span>
                    </Button>

                    {/* Google */}
                    <Button
                        variant="google"
                        className="w-full"
                        type="button"
                        onClick={signInWithGoogle}
                    >
                        <Chromium className="h-4 w-4" />
                        <span className="sr-only">Login with Google</span>
                    </Button>

                    {/* Meta */}
                    <Button
                        variant="inverted"
                        className="w-full"
                        type="button"
                        onClick={() => { }}
                    >
                        <Facebook className="h-4 w-4" />
                        <span className="sr-only">Login with Meta</span>
                    </Button>
                </div>
            </form>

            {/* Toggle link */}
            {onSwitchToSignUp && (
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToSignUp}
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Sign up
                    </button>
                </div>
            )}
        </div>
    );
};

export default SignInForm;