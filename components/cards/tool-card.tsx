// components/tool-card.tsx
"use client"

import Link from "next/link"
import {ExternalLink, Bookmark} from "lucide-react" // Import Lucide icons
import {Button} from "@/components/ui/button" // Assuming you use this Button component
import {Card, CardContent} from "@/components/ui/card" // Assuming you use these Card components
import type {Tool} from "@/types/tool" // Import the updated Tool type
import {useAuth} from "@/contexts/auth-context"
import {useRouter, usePathname} from "next/navigation"
import {ShareButtonWithPopover} from "@/components/ShareButtonWithPopover"
import {useSaveTool, useUnsaveTool} from "@/hooks/use-tools"
import {robotSvg} from "@/lib/reusable_assets"
import {SignInModal} from "@/components/home/sign-in-modal"
import {useEffect, useState} from "react"
import {showLoginModal} from "@/lib/auth-events"
import {useQueryClient} from "@tanstack/react-query" // Assuming React Query is used
import apiClient from "@/lib/api-client"
import {LogoAvatar} from "@/components/LogoAvatar";

interface ToolCardProps {
    tool: Tool
    hideFavoriteButton?: boolean;
    // You might add props for handling save/share clicks if needed
    // onSaveToggle?: (toolId: string, savedByUser: boolean) => void;
    // onShare?: (tool: Tool) => void;
    // isSaving?: boolean; // Add if you want to show a saving state
}

// Helper function to get badge class based on pricing or other labels
// Reusing logic from FeaturedTools.tsx
const getBadgeClass = (label: string) => {
    if (!label) return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"

    switch (
        label.toLowerCase() // Use toLowerCase for consistent matching
        ) {
        case "premium":
        case "subscription":
        case "one-time":
        case "usage-based":
            return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-500" // Added dark mode
        case "free":
        case "freemium":
            return "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-500" // Added dark mode
        case "featured": // If you want a featured badge on the card
            return "bg-purple-600 text-white dark:bg-purple-700" // Added dark mode
        default:
            return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300" // Added dark mode
    }
}

export default function ToolCard({tool: initialTool, hideFavoriteButton}: ToolCardProps,) {

    const {isAuthenticated} = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const saveTool = useSaveTool()
    const unsaveTool = useUnsaveTool()
    const queryClient = useQueryClient()
    const [tool, setTool] = useState(initialTool);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const saveToolMutation = useSaveTool() // Renamed to avoid conflict with direct saveTool
    const unsaveToolMutation = useUnsaveTool() // Renamed
// ... inside your component function
    const [logoError, setLogoError] = useState(false);

    const handleToolClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault()
            showLoginModal(pathname, () => {
                router.push('/')
            })
        }
    }

    const handleSaveToggle = async () => { // No need to pass args, use state/prop
        if (!isAuthenticated) {
            showLoginModal(pathname, () => {
                // Optional: Redirect after successful login from modal
                // router.push('/') // Example redirect, adjust as needed
            });
            return;
        }

        const toolId = tool.unique_id; // Use unique_id for the API calls as per your service
        const currentlySaved = !!tool.saved_by_user; // Get current status from component state

        // Store current state for potential rollback (both React Query cache and local component state)
        // Targeting a specific tool entry in cache might be tricky if it's part of a list query ("tools")
        // A more robust approach with react-query is to update the specific tool item in the list query cache.
        // However, given the component receives a single tool prop, let's update a potential cache entry for the single tool:
        const toolDetailCacheKey = ["tool", tool.id]; // Use tool.id for detail cache if that's the convention
        const previousToolCacheState = queryClient.getQueryData<Tool>(toolDetailCacheKey);
        const previousLocalState = tool; // Store current local state

        // --- OPTIMISTIC UPDATE ---
        // 1. Update the local component state immediately for instant UI feedback
        setTool(prevTool => ({...prevTool, saved_by_user: !currentlySaved}));

        // 2. Update the React Query cache entry for this specific tool immediately
        queryClient.setQueryData<Tool | undefined>(toolDetailCacheKey, (oldTool) => {
            if (oldTool) {
                return {...oldTool, saved_by_user: !currentlySaved};
            }
            // If the single tool isn't already in the cache, maybe add it with updated status?
            // Or, more likely, the list query cache needs updating too.
            // Updating the list query cache is more complex (finding the item in the array).
            // For now, this updates the cache entry for a hypothetical single-tool query key.
            return oldTool; // Or return the optimistically updated state if you expect it to be added
            // return { ...tool, saved_by_user: !currentlySaved }; // Use current tool state
        });

        // --- API CALL ---
        try {
            if (currentlySaved) {
                await unsaveToolMutation.mutateAsync(toolId); // Use unique_id for unsave
            } else {
                await saveToolMutation.mutateAsync(toolId); // Use unique_id for save
            }

            // If the mutation is successful, React Query might automatically refetch
            // relevant queries (depending on configuration/onSettled callbacks in hooks).
            // You might manually trigger a refetch of the tools list query here if needed:
            // queryClient.invalidateQueries(['tools']);

        } catch (error) {
            console.error("Save toggle error:", error);

            // --- ROLLBACK on ERROR ---
            // Revert the local state
            setTool(previousLocalState);

            // Revert the React Query cache
            queryClient.setQueryData(toolDetailCacheKey, previousToolCacheState);

            // Optional: Show error notification
            // toast.error("Failed to update save status. Please try again.");
        }
    };


    const handleGoToToolDetails = () => {

        if (!isAuthenticated) {
            // Use the shared showLoginModal function
            showLoginModal(pathname, () => {
                router.push('/')
            })
        } else {
            // Navigate to tool detail page if authenticated
            window.location.href = `/tools/${tool.unique_id}`
        }

    }


    // Add an effect to reset the error state if the logo URL changes
    useEffect(() => {
        setLogoError(false); // Reset error state whenever the logo_url prop changes
    }, [tool.logo_url]); // Depend on the logo_url prop

    // Determine pricing badge text
    const pricingText = tool.pricing ? tool.pricing.charAt(0).toUpperCase() + tool.pricing.slice(1) : "Unknown"

    const handleStopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };


    const handleOpenTool = (link: string): void => {
        if (link) {

            window.open(link, '_blank');
        } else {

            console.warn("Attempted to open a tool with an empty link.");


        }
    };


    return (
        <>
            <Card
                onClick={handleGoToToolDetails}
                key={tool.id}
                className="max-w-lg overflow-hidden rounded-2xl border border-gray-200 shadow-lg w-full mx-auto flex flex-col" // Added flex flex-col
            >
                <CardContent className="p-0 flex-grow flex flex-col"> {/* Added flex-grow flex flex-col */}
                    <div className="p-4 flex flex-col h-full"> {/* Added flex flex-col h-full */}
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {/* Content here */}
                            </div>
                            {tool.isFeatured && (
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("featured")}`}>
                  Featured
                </span>
                            )}
                        </div>
                        <span className="flex items-center py-3">

<div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
    {/* Check if URL exists AND no logo error has occurred */}
    <LogoAvatar logoUrl={tool.logo_url} name={tool.name} />
</div>



                            <h3 className="mb-1 text-lg font-semibold text-gray-900 pl-2">
                {tool.name.length > 30 ? `${tool.name.slice(0, 20)}...` : tool.name}
              </h3>
            </span>
                        <span
                            className="rounded-full bg-purple-100 px-2 py-0.5 w-fit text-xs font-medium text-purple-600">
              {tool.categories && tool.categories.length !== 0
                  ? (() => {
                      const categoryText = tool.categories[0].name;
                      return categoryText.length > 15 ? `${categoryText.slice(0, 15)}...` : categoryText;
                  })()
                  : null}
            </span>
                        <p className="mb-4 text-sm text-gray-600 pt-3">
                            {tool.description && tool.description.length > 50 // Adjust 120 to your desired length
                                ? `${tool.description.substring(0, 50)}...`
                                : tool.description}
                        </p>
                        <div className="mb-4 flex flex-wrap gap-2">
                            {(tool.keywords || []).slice(0, 3).map((feature, index) => {
                                return (
                                    <span
                                        key={index}
                                        className="rounded-full px-3 py-1 text-xs bg-gray-100 text-gray-600 cursor-help"
                                        title={feature} // <-- Added this line >
                                    >
                    {feature.length > 15 ? `${feature.slice(0, 10)}...` : feature
                        // feature
                    }
                  </span>
                                )
                            })}
                        </div>
                        {/* The div below will now stick to the bottom */}
                        <div className="flex items-center justify-between mt-auto"> {/* Added mt-auto */}
                            <div className="flex items-center gap-2">
                                {!hideFavoriteButton &&
                                    <button
                                        className={`rounded p-1 ${
                                            tool.saved_by_user
                                                ? "text-purple-600 hover:text-purple-700"
                                                : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                                        } transition-colors duration-200`}
                                        onClick={(e) => {
                                            handleStopPropagation(e);
                                            handleSaveToggle();
                                        }}
                                        aria-label={tool.saved_by_user ? "Unsave tool" : "Save tool"}
                                        // disabled={isSaving} // Optional: Disable button while saving/unsaving
                                    >
                                        <Bookmark
                                            className="h-4 w-4"
                                            fill={tool.saved_by_user ? "currentColor" : "none"}
                                            stroke={tool.saved_by_user ? "currentColor" : "#9CA3AF"} // Gray-400
                                        />
                                    </button>}
                                <div onClick={handleStopPropagation}>
                                    <ShareButtonWithPopover itemLink={`/tools/${tool.id}`}/>
                                </div>
                            </div>
                            <Button
                                className="bg-purple-600 text-white hover:bg-purple-700"
                                onClick={(e) => {
                                    handleStopPropagation(e);
                                    handleOpenTool(tool.link);
                                    // handleGoToToolDetails();
                                }}
                            >
                                Try Tool <ExternalLink className="h-4 w-4 ml-1"/>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
// Direct API functions (keep these the same)
export const saveTool = async (toolId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const headers: Record<string, string> = token ? {Authorization: `Bearer ${token}`} : {};
    const body = {"tool_unique_id": toolId};
    const response = await apiClient.post<{ message: string }>('/favorites', body, {headers});
    return response.data;
};

export const unsaveTool = async (toolId: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    const headers: Record<string, string> = token ? {Authorization: `Bearer ${token}`} : {};
    const response = await apiClient.delete<{ message: string }>(`/favorites/${toolId}`, {headers});
    return response.data;
};