'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { signUpStart } from '@/store/user/user.action';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
};

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            // This triggers the Saga: 1. Firebase Auth -> 2. MongoDB Sync
            dispatch(signUpStart(email, password, displayName));
        } catch (error) {
            console.error('User creation encountered an error', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormFields({ ...formFields, [name]: value });
    };

    return (
        <div className="flex flex-col w-full">
            <h2 className="text-2xl font-black tracking-tighter mb-2">Create Account</h2>
            <p className="text-slate-500 text-sm mb-8">Join Maro Store to start your fashion journey.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                               type='text' required name='displayName' value={displayName} onChange={handleChange} placeholder="John Doe"/>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <input className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                               type='email' required name='email' value={email} onChange={handleChange} placeholder="name@example.com"/>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                        <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                               type='password' required name='password' value={password} onChange={handleChange} placeholder="••••••••"/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Confirm</label>
                        <input className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                               type='password' required name='confirmPassword' value={confirmPassword} onChange={handleChange} placeholder="••••••••"/>
                    </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
                </button>
            </form>
            <button onClick={onSwitchToSignIn} className="mt-6 text-sm font-bold text-slate-500 hover:text-black transition-colors">
                Already have an account? Sign In
            </button>
        </div>
    );
}