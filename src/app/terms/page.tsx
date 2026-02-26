import React from 'react';

// This ensures TypeScript recognizes the file as a module
export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-24">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-12">
                Store terms and conditions
            </h1>
            <div className="space-y-12 text-slate-600">
                <section>
                    <h2 className="text-slate-900 font-bold uppercase mb-4">1. Information</h2>
                    <p>
                        Welcome to Maro. This page contains our general operating policies. 
                        Please review our specific terms for shipping, returns, and privacy.
                    </p>
                </section>
                <section>
                    <h2 className="text-slate-900 font-bold uppercase mb-4">2. Usage</h2>
                    <p>
                        By using our inventory system and storefront, you agree to our 
                        standard terms of service.
                    </p>
                </section>
            </div>
        </div>
    );
}