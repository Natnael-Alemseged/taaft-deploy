"use client"
// components/ShareButtonWithPopover.tsx (or keep it in ToolCard.tsx, but outside the main function)
import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Twitter, Facebook } from 'lucide-react'; // Import Lucide icons

interface ShareButtonWithPopoverProps {
    itemLink: string; // The URL to share
}

// Define the ShareButtonWithPopover component OUTSIDE of ToolCard
export function ShareButtonWithPopover({ itemLink }: ShareButtonWithPopoverProps) {
    const [isShareOptionsOpen, setIsShareOptionsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null); // Add type to ref

    const handleShareClick = (event: React.MouseEvent) => { // Add type to event
        console.log("handleShareClick")
        event.stopPropagation();
        setIsShareOptionsOpen(!isShareOptionsOpen);
    };

    const handleCopyLink = () => {
        if (itemLink) {
            navigator.clipboard.writeText(process.env.NEXT_PUBLIC_APP_URL + itemLink).then(() => {
                console.log('Link copied to clipboard!');
                setIsShareOptionsOpen(false);
            }).catch(err => {
                console.error('Failed to copy link: ', err);
            });
        }
    };

    const shareOnTwitter = () => {
        if (itemLink) {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(itemLink)}`, '_blank');
            setIsShareOptionsOpen(false);
        }
    };

    const shareOnFacebook = () => {
        if (itemLink) {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(itemLink)}`, '_blank');
            setIsShareOptionsOpen(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) { // Add type to event
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) { // Cast target
                setIsShareOptionsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoverRef]);


    return (
        <div className="relative inline-block" ref={popoverRef}>
            <button
                className="p-1.5 border border-[#e5e7eb] dark:border-gray-700 rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={handleShareClick}
                // onClick={() => console.log('Simple button click test!')} // TEMPORARY TEST
                aria-expanded={isShareOptionsOpen}
                aria-haspopup="true"
                aria-label="Share content"
            >
                <Share2 className="w-4 h-4" />
            </button>

            {isShareOptionsOpen && (
                <div
                    className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="share-options-button"
                >
                    <div className="py-1">
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-100"
                            role="menuitem"
                        >
                            <Copy className="mr-2 h-4 w-4" /> Copy Link
                        </button>
                        <button
                            onClick={shareOnTwitter}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-100"
                            role="menuitem"
                        >
                            <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" /> Share on Twitter
                        </button>
                         <button
                            onClick={shareOnFacebook}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-100"
                            role="menuitem"
                        >
                            <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" /> Share on Facebook
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
