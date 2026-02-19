// src/components/debug/ApiDebug.tsx
'use client';

import { useState } from 'react';
import { authApi } from '@/src/lib/api-client';

export function ApiDebug() {
    const [status, setStatus] = useState<string>('Ready');
    const [response, setResponse] = useState<any>(null);

    const testApi = async () => {
        setStatus('Testing...');
        try {
            // Test token validation with a dummy token
            const result = await authApi.validateToken('test-token');
            setResponse(result);
            setStatus('Success');
        } catch (error: any) {
            setResponse({ error: error.message });
            setStatus('Failed');
        }
    };

    return (
        <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-md">
            <h3 className="font-bold mb-2">API Debug</h3>
            <p className="text-sm mb-2">Status: <span className={status === 'Success' ? 'text-green-400' : 'text-yellow-400'}>{status}</span></p>
            <button
                onClick={testApi}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm mb-2"
            >
                Test API Connection
            </button>
            {response && (
                <pre className="text-xs bg-gray-900 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(response, null, 2)}
                </pre>
            )}
        </div>
    );
}