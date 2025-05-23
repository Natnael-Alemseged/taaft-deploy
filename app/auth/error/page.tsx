// app/auth/error/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import {useAuth} from "@/contexts/auth-context";


export default function AuthErrorPage() {
    const {user, logout, isAuthenticated} = useAuth()


    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message');

    useEffect(() => {
        logout()
        const timer = setTimeout(() => {
            router.push('/');
        }, 2000); // Redirect after 3 seconds
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-6">
            <div className="bg-red-100 border border-red-300 rounded-2xl p-6 shadow-md max-w-md">
                <div className="flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-xl font-bold text-red-700">Login Failed</h1>
                <p className="mt-2 text-gray-800">
                    {message || 'There was a problem signing in.'}
                </p>
                <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Redirecting to home...
                </div>
            </div>
        </div>
    );
}
