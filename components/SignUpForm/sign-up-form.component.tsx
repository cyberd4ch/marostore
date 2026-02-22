"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { AuthError, AuthErrorCodes } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signUpStart, googleSignInStart } from "@/store/user/user.action";
import { ArrowRight, Loader2, Chrome, Github } from "lucide-react";
import { toast } from "sonner";

const defaultFormFields = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export interface SignUpFormProps {
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
            // Sagas handle navigation; cleanup locally
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
            }
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormFields((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="text-center p-0 mb-8">
                <div className="flex flex-col gap-2">
                    <CardTitle className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                        Join Maro Store
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium">
                        Create your account to start your premium experience
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Button 
                            variant="outline" 
                            type="button" 
                            onClick={() => dispatch(googleSignInStart())}
                            className="rounded-xl border-slate-200 h-11 font-bold text-xs uppercase tracking-widest"
                        >
                            <Chrome className="mr-2 h-4 w-4" /> Google
                        </Button>
                        <Button 
                            variant="outline" 
                            type="button" 
                            className="rounded-xl border-slate-200 h-11 font-bold text-xs uppercase tracking-widest"
                        >
                            <Github className="mr-2 h-4 w-4" /> Github
                        </Button>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
                        <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                            <span className="bg-white px-4 text-slate-400">or use email</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</Label>
                            <Input name="displayName" placeholder="John Doe" required value={displayName} onChange={handleChange} className="bg-slate-50/50 border-slate-200 rounded-xl h-11 focus-visible:ring-slate-900" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</Label>
                            <Input name="email" type="email" placeholder="m@example.com" required value={email} onChange={handleChange} className="bg-slate-50/50 border-slate-200 rounded-xl h-11 focus-visible:ring-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Password</Label>
                                <Input name="password" type="password" required value={password} onChange={handleChange} className="bg-slate-50/50 border-slate-200 rounded-xl h-11 focus-visible:ring-slate-900" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm</Label>
                                <Input name="confirmPassword" type="password" required value={confirmPassword} onChange={handleChange} className="bg-slate-50/50 border-slate-200 rounded-xl h-11 focus-visible:ring-slate-900" />
                            </div>
                        </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-black tracking-widest mt-4">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="flex items-center">CREATE ACCOUNT <ArrowRight className="ml-2 h-4 w-4" /></span>}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <span className="text-slate-500 font-medium">Already a member? </span>
                    <button onClick={onSwitchToSignIn} className="font-bold text-slate-900 hover:underline underline-offset-4">Sign In</button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SignUpForm;