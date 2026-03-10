'use client';

import { AlertOctagon } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-white text-slate-900 flex items-center justify-center min-h-screen">
                <div className="p-8 max-w-lg text-center">
                    <AlertOctagon className="w-16 h-16 text-red-600 mx-auto mb-6" />
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Critical System Error</h1>
                    <p className="text-slate-600 mb-8">
                        A critical error occurred at the root of the application. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="bg-red-600 text-white px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-all"
                    >
                        Recover Application
                    </button>
                </div>
            </body>
        </html>
    );
}