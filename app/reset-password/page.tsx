// app/reset-password/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ResetPasswordModal } from "@/components/home/reset-password-modal";
import FeaturedTools from "@/components/home/featured-tools";
import SponsoredTools from "@/components/home/sponsored-tools";
import BrowseCategories from "@/components/home/browse-categories";
import AIAutomation from "@/components/home/ai-automation";
import Hero from "@/components/home/hero";
import Header from "@/components/header";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const handleClose = () => {
        router.push("/");
    };

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Invalid Reset Link</h2>
                    <p className="text-gray-600 text-center">
                        The password reset link is invalid or has expired. Please request a new password reset link.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <Header />
            <Hero />
            <FeaturedTools />
            <SponsoredTools />
            <BrowseCategories />
            <AIAutomation />
            <ResetPasswordModal isOpen={true} onClose={handleClose} token={token} />
        </div>
    );
}