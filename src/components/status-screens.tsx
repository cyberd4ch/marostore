import { Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// 1. LOADING UI (Shown while checking Auth/Admin status)
export const LoadingScreen = ({ message = "Verifying Access..." }) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="relative flex items-center justify-center">
            <div className="h-20 w-20 rounded-full border-t-2 border-b-2 border-slate-900 animate-spin" />
            <Loader2 className="absolute h-8 w-8 text-slate-900 animate-pulse" />
        </div>
        <h2 className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-slate-900">
            {message}
        </h2>
        <p className="mt-2 text-xs text-slate-400 font-medium">Please hold while we secure your session.</p>
    </div>
);

// 2. UNAUTHORIZED UI (Shown if user is not an admin)
export const UnauthorizedScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl max-w-md border border-slate-100">
            <div className="bg-red-50 h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">RESTRICTED AREA</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
                Your account does not have the administrative privileges required to access the Maro Dashboard.
            </p>
            <Link
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-bold text-sm tracking-widest uppercase hover:bg-black transition-all rounded-full"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Store
            </Link>
        </div>
    </div>
);