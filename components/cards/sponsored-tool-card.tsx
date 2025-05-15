import {useAuth} from "@/contexts/auth-context";
import {usePathname, useRouter} from "next/navigation";
import {useSaveTool, useUnsaveTool} from "@/hooks/use-tools";
import {useQueryClient} from "@tanstack/react-query";
import {useRef, useState} from "react";
import {showLoginModal} from "@/lib/auth-events";
import type {Tool} from "@/types/tool";
import {Card, CardContent} from "@/components/ui/card";
import {formatDescription, robotSvg, setDisplayCategories} from "@/lib/reusable_assets";
import {Bookmark, ExternalLink} from "lucide-react";
import {ShareButtonWithPopover} from "@/components/ShareButtonWithPopover";
import {Button} from "@/components/ui/button";
import {Avatar} from "@/components/ui/avatar";
import {LogoAvatar} from "@/components/LogoAvatar";
import {handleOpenTool} from "@/lib/reusable-methods";

interface SponsoredToolCardProps {
    tool: Tool
    // You might add props for handling save/share clicks if needed
    // onSaveToggle?: (toolId: string, savedByUser: boolean) => void;
    // onShare?: (tool: Tool) => void;
    // isSaving?: boolean; // Add if you want to show a saving state
}

export default function SponsoredToolCard({tool: initialTool}: SponsoredToolCardProps) {
    const {isAuthenticated} = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    const queryClient = useQueryClient()
    const [tool, setTool] = useState(initialTool);

    const saveToolMutation = useSaveTool() // Renamed to avoid conflict with direct saveTool
    const unsaveToolMutation = useUnsaveTool() // Renamed
    const scrollRef = useRef<HTMLDivElement>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
    const [previousRoute, setPreviousRoute] = useState<string | undefined>()


    const openSignInModal = () => {
        setIsSignInModalOpen(true)
    }

    const closeAllModals = () => {
        setIsSignInModalOpen(false)
        setPreviousRoute(undefined)
    }


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

    const handleStopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
    };



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
    return (<>
        <Card
            key={tool.id}
            className="min-w-full md:min-w-[calc(50%-12px)] flex-shrink-0 border border-gray-200 shadow-lg scroll-snap-align-start"
            aria-roledescription="slide"
            aria-label={tool.name}
            onClick={handleGoToToolDetails}
        >
            <CardContent className="p-4">
                {tool.categories != null &&
                    <div className="mb-2 flex items-center gap-4">
                        {tool.categories.length > 0 && (
                            <span
                                className="text-xs font-bold text-purple-500 border border-purple-300 rounded-full px-2 py-1">
                      {setDisplayCategories(tool.categories)}
                      </span>
                        )}
                    </div>
                }
                <span className="flex items-center gap-2 pb-3">
<LogoAvatar logoUrl={tool.logo_url} name={tool.name}/>
                    <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                  </span>
                <span
                    className="rounded-full bg-purple-100 px-2 py-0.5 w-fit text-xs font-medium text-purple-600">
         {setDisplayCategories(tool.categories)}


            </span>
                <p className="mb-4 text-sm text-gray-600 pt-3">
                    {formatDescription(tool.generated_description, tool.description, 80, 80)} {/* Adjust lengths as needed for cards */}

                </p>
                <div className="mb-4 flex flex-wrap gap-1">
                    {tool.keywords?.slice(0, 5).map((tag: string) => (
                        <span key={tag} className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <button
                          className={`rounded p-1 ${tool.saved_by_user ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
                          // Pass unique_id and current saved status
                          onClick={(e) => {
                              handleStopPropagation(e);
                              handleSaveToggle();
                          }}>
                        <Bookmark className="h-4 w-4" fill={tool.saved_by_user ? "currentColor" : "none"}/>
                      </button>
                       <div onClick={handleStopPropagation}>
                                 <ShareButtonWithPopover itemLink={`/tools/${tool.unique_id}`}/>
                                </div>
                    </span>
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
            </CardContent>
        </Card>
    </>);
}