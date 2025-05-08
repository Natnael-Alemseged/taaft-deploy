"use client"
// components/ShareButtonWithPopover.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Share2, Copy, Twitter, Facebook } from 'lucide-react'; // Import Lucide icons

interface ShareButtonWithPopoverProps {
    itemLink: string; // The URL to share
}

// Define the ShareButtonWithPopover component OUTSIDE of ToolCard
export function ShareButtonWithPopover({ itemLink }: ShareButtonWithPopoverProps) {
    const [isShareOptionsOpen, setIsShareOptionsOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state for success message
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleShareClick = (event: React.MouseEvent) => {
        console.log("handleShareClick")
        event.stopPropagation();
        // Close success message if open when clicking share button
        if (showSuccessMessage) setShowSuccessMessage(false);
        setIsShareOptionsOpen(!isShareOptionsOpen);
    };

    const handleCopyLink = () => {
        if (itemLink) {
            const fullLink = `${process.env.NEXT_PUBLIC_APP_URL}${itemLink}`;
            navigator.clipboard.writeText(fullLink).then(() => {
                console.log('Link copied to clipboard!');
                setIsShareOptionsOpen(false); // Close the share options popover
                setShowSuccessMessage(true); // Show the success message

                // Hide the success message after 3 seconds
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 1000); // 3000 milliseconds = 3 seconds

            }).catch(err => {
                console.error('Failed to copy link: ', err);
                 // Optionally show an error message here
            });
        }
    };

    const shareOnTwitter = () => {
        if (itemLink) {
             const fullLink = `${process.env.NEXT_PUBLIC_APP_URL}${itemLink}`;
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullLink)}`, '_blank');
            setIsShareOptionsOpen(false);
        }
    };

    const shareOnFacebook = () => {
        if (itemLink) {
             const fullLink = `${process.env.NEXT_PUBLIC_APP_URL}${itemLink}`;
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullLink)}`, '_blank');
            setIsShareOptionsOpen(false);
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setIsShareOptionsOpen(false);
                 // Also hide success message if clicking outside
                if (showSuccessMessage) setShowSuccessMessage(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoverRef, showSuccessMessage]); // Add showSuccessMessage to dependencies

    // Hide success message when the share options popover is closed
    useEffect(() => {
        if (!isShareOptionsOpen && showSuccessMessage) {
             // Allow the timeout to handle hiding if it was triggered by a copy
             // If closed by clicking outside *after* copy, the timeout is already running.
             // If closed by clicking share button again *after* copy, we hide immediately in handleShareClick.
        }
         // If popover is opened, hide the success message
        if (isShareOptionsOpen && showSuccessMessage) {
            setShowSuccessMessage(false);
        }
    }, [isShareOptionsOpen, showSuccessMessage]);


    return (
        <div className="relative inline-block" ref={popoverRef}>
            <button
                className="p-1 border rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={handleShareClick}
                aria-expanded={isShareOptionsOpen}
                aria-haspopup="true"
                aria-label="Share content"
            >
                <Share2 className="w-4 h-4" />
            </button>

            {/* Success Message */}
            {showSuccessMessage && (
                 // Position this message above the button, similar to the popover but maybe simpler
                 <div className="absolute z-20 bottom-full left-1/2 transform -translate-x-1/2 translate-x-1 mb-2 px-3 py-1 bg-blue-500 text-white text-xs rounded shadow-lg">
                    Link copied!
                 </div>
            )}


            {isShareOptionsOpen && (
                <div
                    className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 translate-x-1 mb-2 w-40 bg-white dark:bg-gray-700 rounded shadow-lg ring-1 ring-black ring-opacity-5 message-like-popover"
                    role="menu"
                >
                     {/* Arrow element */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-x-1 -mt-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-700"></div>
                    <div className="py-1">
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                        >
                            <Copy className="mr-2 h-4 w-4" /> Copy Link
                        </button>
                        <button
                            onClick={shareOnTwitter}
                            className="flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                        >
                            <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" /> Twitter
                        </button>
                        <button
                            onClick={shareOnFacebook}
                            className="flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                        >
                            <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" /> Facebook
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}