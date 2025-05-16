// components/ui/BackLink.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BackLinkProps {
    href?: string;
    defaultHref?: string;
    label?: string;
    onClick?: () => void;
    className?: string;
    useRouterBack?: boolean;
}

export const BackLink = ({
                             href,
                             defaultHref = "/",
                             label = "Back",
                             onClick,
                             className = "",
                             useRouterBack = false,
                         }: BackLinkProps) => {
    const router = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) onClick();
        if (useRouterBack) {
            e.preventDefault();
            router.back();
        }
    };

    return (
        <Link
            href={useRouterBack ? "#" : href || defaultHref}
            onClick={handleClick}
            className={`inline-flex items-center text-[#a855f7] dark:text-purple-400 hover:text-[#9333ea] dark:hover:text-purple-300 transition-colors duration-200 ${className}`}
        >
            <ArrowLeft className="mr-2 h-5 w-5" />
            {label}
        </Link>
    );
};