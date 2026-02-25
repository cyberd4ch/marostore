'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Mail, Lock, Loader2 } from 'lucide-react';

// Make sure these paths match your actual Redux action files
import { emailSignInStart, googleSignInStart } from '@/store/user/user.action';

type SignInFormProps = {
    onSwitchToSignUp: () => void;
};

const defaultFormFields = {
    email: '',
    password: '',
};

export default function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
    const dispatch = useDispatch();
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;
    const [isLoading, setIsLoading] = useState(false);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    };

    // Trigger Email/Password Saga
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            dispatch(emailSignInStart(email, password));
            resetFormFields();
        } catch (error) {
            console.error('User sign in failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Trigger Google Popup Saga
    const signInWithGoogle = () => {
        dispatch(googleSignInStart());
    };

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-2xl font-black tracking-tighter mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm mb-8">Sign in with your email and password or use your Google account.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                            type="email"
                            required
                            name="email"
                            value={email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input
                            type="password"
                            required
                            name="password"
                            value={password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
                    </button>

                    <button
                        type="button"
                        onClick={signInWithGoogle}
                        className="w-full bg-white text-black border-2 border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignUp} className="font-bold text-black hover:underline">
                    Sign up
                </button>
            </p>
        </div>
    );
}