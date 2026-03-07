'use client';

import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Firebase & Redux Imports
import { auth } from '@/app/utils/firebase/firebase.utils';
import { emailSignInStart, googleSignInStart } from '@/store/user/user.action';
import { selectCurrentUser } from '@/store/user/user.selector';
import { selectCartItems } from '@/store/cart/cart.selector';
import { selectWishlistItems } from '@/store/wishlist/wishlist.selector';

type SignInFormProps = {
    onSwitchToSignUp: () => void;
    redirectPath?: string;       // New: Allows specific redirects for shoppers
    isMerchantContext?: boolean; // New: Toggles between Merchant and Shop UI
};

const defaultFormFields = {
    email: '',
    password: '',
};

export default function SignInForm({ 
    onSwitchToSignUp, 
    redirectPath, 
    isMerchantContext = false 
}: SignInFormProps) {
    const dispatch = useDispatch();
    const router = useRouter();

    const currentUser = useSelector(selectCurrentUser);
    const cartItems = useSelector(selectCartItems);
    const favoriteItems = useSelector(selectWishlistItems);

    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;
    const [isLoading, setIsLoading] = useState(false);

    /**
     * ROLE-BASED & CONTEXT-AWARE ROUTING
     * Handles where the user goes after a successful login.
     */
    useEffect(() => {
        const syncAndRedirect = async () => {
            if (currentUser) {
                const userProfile = currentUser as any;

                // 1. SECURITY: Check if account is disabled
                if (userProfile.isLocked) {
                    toast.error("Account suspended. Please contact support.");
                    return;
                }

                try {
                    // 2. SESSION SYNC: Store token in cookie for Middleware verification
                    const firebaseUser = auth.currentUser;
                    if (firebaseUser) {
                        const token = await firebaseUser.getIdToken();
                        document.cookie = `__session=${token}; path=/; SameSite=Strict; Secure`;
                        document.cookie = `onboardingCompleted=${userProfile.onboardingCompleted}; path=/; SameSite=Strict; Secure`;
                    }

                    // 3. ADMIN OVERRIDE: Admins always go to dashboard
                    if (userProfile.role === 'admin' || userProfile.role === 'super-admin') {
                        router.replace('/dashboard');
                        return;
                    }

                    // 4. SHOPPER/USER ROUTING LOGIC
                    if (!userProfile.onboardingCompleted) {
                        router.replace('/onboarding');
                    } else if (cartItems.length > 0) {
                        // If they have items in cart, prioritize checkout
                        router.replace('/checkout');
                    } else if (redirectPath) {
                        // If a specific redirect was passed (like "/" for the shop)
                        router.replace(redirectPath);
                    } else if (favoriteItems.length > 0) {
                        // If they have favorites, show them their wishlist
                        router.replace(`/u/${userProfile.username}?view=wishlist`);
                    } else {
                        // Default to personal profile
                        router.replace(`/u/${userProfile.username}`);
                    }
                } catch (error) {
                    console.error("Session sync failed:", error);
                    toast.error("Authentication error. Please try again.");
                }
            }
        };

        syncAndRedirect();
    }, [currentUser, cartItems.length, favoriteItems.length, router, redirectPath]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            dispatch(emailSignInStart(email, password));
        } catch (error) {
            toast.error("Invalid credentials.");
            setIsLoading(false);
        }
    };

    const signInWithGoogle = () => {
        dispatch(googleSignInStart());
    };

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-2xl font-black tracking-tighter mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm mb-8">
                {isMerchantContext 
                    ? "Sign in to access your merchant dashboard." 
                    : "Sign in to manage your orders and profile."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
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
                            placeholder={isMerchantContext ? "merchant@marostore.com" : "you@example.com"}
                        />
                    </div>
                </div>

                {/* Password Field */}
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

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin h-5 w-5" />
                        ) : (
                            isMerchantContext ? 'Enter Dashboard' : 'Sign In'
                        )}
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
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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