import { useState, useEffect } from 'react';
import {robotSvg} from "@/lib/reusable_assets";


interface LogoAvatarProps {
    logoUrl?: string | null;
    name?: string;
    size?: 'sm' | 'md' | 'lg'; // Optional size variants
    className?: string; // Additional className
}

export const LogoAvatar = ({
                               logoUrl,
                               name = 'Tool',
                               size = 'md',
                               className = '',
                           }: LogoAvatarProps) => {
    const [logoError, setLogoError] = useState(false);

    // Reset error state when logoUrl changes
    useEffect(() => {
        setLogoError(false);
    }, [logoUrl]);

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-9 h-9',
        lg: 'w-12 h-12'
    };

    return (
        <div
            className={`flex items-center justify-center rounded-full bg-gray-100 overflow-hidden ${sizeClasses[size]} ${className}`}
        >
            {logoUrl && !logoError ? (
                <img
                    src={logoUrl}
                    alt={`${name} logo`}
                    className="w-full h-full object-contain"
                    onError={() => setLogoError(true)}
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full">
                    {robotSvg}
                </div>
            )}
        </div>
    );
};