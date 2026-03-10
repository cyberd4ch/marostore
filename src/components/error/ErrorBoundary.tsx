'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = { hasError: false };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-red-100 rounded-3xl bg-red-50/30">
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
                    <p className="text-slate-500 mb-6 max-w-xs">We couldn't load the product data from our servers.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-black transition-all"
                    >
                        <RotateCcw className="w-4 h-4" /> Retry
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}