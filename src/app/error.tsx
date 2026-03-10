'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service like Sentry or LogRocket
        console.error('App Crash:', error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-red-600" />
            </div>

            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                Something went wrong!
            </h1>

            <p className="text-slate-500 max-w-md mb-8">
                We encountered an unexpected error. This might be due to a connection issue or a temporary glitch in our system.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95"
                >
                    <RefreshCcw className="w-4 h-4" /> Try Again
                </button>

                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-900 px-8 py-3 rounded-none font-bold uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
                >
                    <Home className="w-4 h-4" /> Back to Home
                </Link>
            </div>

            {error.digest && (
                <p className="mt-8 text-[10px] font-mono text-slate-400">
                    Error ID: {error.digest}
                </p>
            )}
        </div>
    );
}