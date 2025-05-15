"use client" // Keep this as it's a Client Component
import {FaStar} from "react-icons/fa"
import React, {type SetStateAction, useEffect, useState} from "react"
import Link from "next/link"
import {Bookmark, Share2, ExternalLink, Check, ChevronRight, ChevronUp} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useTool} from "@/hooks/use-tools" // Assuming this hook exists and works
import {useSaveTool, useUnsaveTool} from "@/hooks/use-tools" // Assuming these hooks exist and works
import {useAuth} from "@/contexts/auth-context" // Assuming useAuth hook is available
import Header from "@/components/header" // Assuming Header component path
import {useRouter} from "next/navigation" // Correct import for App Router
/// if api fails use fallback
import {withFallbackTool} from "@/lib/utils" // Assuming this utility exists
import {useParams} from "next/navigation" // Correct import for App Router
import LoadingToolDetailSkeleton from "@/components/skeletons/loading-tool-detail-skeleton" // Assuming skeleton component exists
// Add the import for the new tool detail service at the top

import {useQueryClient} from "@tanstack/react-query" // Assuming React Query is used
import Script from "next/script" // Add this import for schema markup
import {showLoginModal} from "@/lib/auth-events"
import {ShareButtonWithPopover} from "@/components/ShareButtonWithPopover"
import {getToolById, getToolByUniqueId, getTools} from "@/services/tool-service"
import {Category, Tool} from "@/types/tool"
import {robotSvg} from "@/lib/reusable_assets";
import {LogoAvatar} from "@/components/LogoAvatar";


// Keep Schema interface as is, not used in the render logic directly, but good for reference


export default function ToolDetail() {
    const params = useParams()
    const slug = params?.slug as string
    const router = useRouter()
    const queryClient = useQueryClient()
    const [isToolLoading, setIsToolLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [tool, setTool] = useState<Tool | null>(null)

// Get auth state and loading state from useAuth
    const {isAuthenticated, isLoading: isAuthLoading} = useAuth()


    const saveTool = useSaveTool()
    const unsaveTool = useUnsaveTool()
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    // Function to toggle showing all features
    const handleShowMoreFeatures = () => {
        setShowAllFeatures(true);
    };   const handleShowLessFeatures = () => {
        setShowAllFeatures(false);
    };
    const [selectedPlan, setSelectedPlan] = useState<SetStateAction<null> | null>(null) // State to manage the selected plan

// Handle Plan Click (toggle selection)
    const handlePlanClick = (planName: SetStateAction<null>) => {
        setSelectedPlan(selectedPlan === planName ? null : planName) // Deselect if it's already selected
    }

    useEffect(() => {
        const fetchTool = async () => {
            setIsToolLoading(true);
            setIsError(false);
            console.log("Fetching tool with slug:", slug);

            try {
                // First attempt with unique_id
                let response = await getToolByUniqueId(slug);

                if (response.status === 200 && response.data) {
                    console.log('sucessful unique id');
                    console.log(response.data);

                    setTool(response.data);
                    return;
                }



            } catch (error) {
                console.error('Error fetching tool:', error);
                setIsError(true);
            } finally {
                setIsToolLoading(false);
            }
        };

        if (slug) fetchTool();
    }, [slug]);



    useEffect(() => {

        if (!isAuthenticated && !isAuthLoading) {
            console.log("Showing login modal because not authenticated and auth check finished");
            console.log("isAuthenticated:", isAuthenticated);
            showLoginModal(router.asPath, () => {
                // This callback will be executed when the modal is closed
                router.push('/') // Redirect to home
            });
        } else if (isAuthenticated && !isAuthLoading) {
            console.log("User is authenticated and auth check finished.");
        } else if (isAuthLoading) {
            console.log("Authentication state is still loading...");
        }
    }, [isAuthenticated, isAuthLoading]); // Add isAuthLoading as a dependency


// --- Handle Loading State ---
// Show loading skeleton if either tool data OR auth state is loading
    if (isToolLoading || isAuthLoading) {
        console.log(`Loading state: Tool loading: ${isToolLoading}, Auth loading: ${isAuthLoading}`);
        return <LoadingToolDetailSkeleton/>;
    }


// Apply fallback data if the fetched tool is incomplete (use `tool` directly here)
//     const safeTool = withFallbackTool(tool ?? {}); // Using 'tool' state directly
    const safeTool = tool; // Using 'tool' state directly


// Handle save toggle
    const handleSaveToggle = () => {
        if (!isAuthenticated) {
            showLoginModal(router.asPath, () => {
                router.push('/')
            })
            return
        }

        // Optimistic update
        queryClient.setQueryData(["tool", slug], (oldTool: Tool | undefined) => {
            if (oldTool) {
                return {...oldTool, saved_by_user: !oldTool.saved_by_user}
            }
            return oldTool
        })

        if (safeTool?.saved_by_user) {
            unsaveTool.mutate(safeTool.id) // Use safeTool.id instead of toolId
        } else {
            saveTool.mutate(safeTool.id) // Use safeTool.id instead of toolId
        }
    }

    if (!safeTool) {
        return (
            <div
                className="flex flex-col items-center justify-center p-8  rounded-lg shadow-lg max-w-md mx-auto mt-16 text-center">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">Tool Not Found</h2>
                <p className="text-gray-600 mb-6">
                    The tool you are looking for does not exist or was removed.
                    Please check the address or navigate from the main tools page.
                </p>
                <a
                    href="/browse"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Go to Tools
                </a>
            </div>
        );
    }


    return (
        <div>


            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm mb-6">
                    <Link href="/" className="text-[#6b7280]">
                        Home
                    </Link>
                    <span className="mx-2 text-[#6b7280]">{">"}</span>
                    <Link href="/browse" className="text-[#6b7280]">
                        Tools
                    </Link>
                    <span className="mx-2 text-[#6b7280]">{">"}</span>
                    <span className="text-[#6b7280]">{safeTool.name ?? ''}</span>
                </div>

                {/* Tool Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <div className="flex items-center gap-3 pb-5">
                            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gray-100 overflow-hidden">
                                <LogoAvatar logoUrl={tool.logo_url} name={tool.name} />
                            </div>
                            <h1 className="text-3xl font-bold text-[#111827]">
                                {safeTool?.name || "Unknown name"}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex flex-wrap gap-2">
                                {safeTool?.keywords?.map((keyword, index) => (
                                    <span key={index}
                                          className="text-sm bg-[#f5f0ff] text-[#a855f7] px-3 py-1 rounded-full">
                    {keyword}
                  </span>
                                ))}
                            </div>


                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                        {/* Try Tool Button - Moved to sidebar */}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Description and Features */}
                    <div className="md:col-span-2">

                        <p className="text-[#4b5563] mb-8">{safeTool?.description}</p>
                        <p className="text-[#4b5563] mb-8">{safeTool.generated_description}</p>


                        {/* Key Features Section */}
                        {safeTool?.feature_list && safeTool.feature_list.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-xl font-bold text-[#111827] mb-6">Key Features</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Conditionally slice the feature list */}
                                    {safeTool.feature_list
                                        .slice(0, showAllFeatures ? safeTool.feature_list.length : 6) // Slice based on showAllFeatures state
                                        .map((feature, index) => (
                                            <div key={index} className="border border-[#e5e7eb] rounded-lg p-4">
                                                <div className="flex items-start mb-2">
                                                    <div
                                                        className="w-5 h-5 rounded-full bg-[#f5f0ff] flex items-center justify-center mr-2 mt-1">
                                                        <Check className="w-3 h-3 text-[#a855f7]"/>
                                                    </div>
                                                    {/* You can add the character truncation logic here if needed,
                                            but the request was specifically for the feature list display */}
                                                    <h3 className="font-semibold text-[#111827]">{feature}</h3>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Show "Show More" button only if there are more than 6 features
                        and showAllFeatures is false */}
                                {safeTool.feature_list.length > 6 && !showAllFeatures && (
                                    <div className="mt-6 text-center">
                                        <Button variant="link" onClick={handleShowMoreFeatures} className="text-[#a855f7]">
                                            Show More Features ({safeTool.feature_list.length - 6} more)
                                            <ChevronRight className="ml-1 w-4 h-4"/>
                                        </Button>
                                    </div>
                                )}

                                {/* Optionally show a "Show Less" button if needed */}
                                {safeTool.feature_list.length > 6 && showAllFeatures && (
                                    <div className="mt-6 text-center">
                                        <Button variant="link" onClick={handleShowLessFeatures} className="text-[#a855f7]"> {/* Changed color to match Show More */}
                                            Show Less Features
                                            <ChevronUp className="ml-1 w-4 h-4"/>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Screenshot Section */}
                        {safeTool.image_url && (
                            <div className="mb-12">
                                <h2 className="text-xl font-bold text-[#111827] mb-6">Screenshots</h2>
                                <div
                                    className="border border-[#e5e7eb] rounded-lg overflow-hidden"
                                    style={{
                                        width: "100%",
                                        maxWidth: "952px",
                                        height: "fit-content",
                                        aspectRatio: "952/643.5",
                                    }}
                                >
                                    <img
                                        src={safeTool.image_url || "/placeholder.svg"}
                                        alt={`${safeTool?.name ?? ""} screenshot`}
                                        className="w-full h-auto object-cover"
                                        style={{
                                            maxHeight: "643.5px",
                                            width: "100%",
                                        }}
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                            (e.target as HTMLImageElement).className = "w-full h-auto object-contain";
                                        }}
                                    />
                                </div>
                            </div>
                        )}


                        {/* User Reviews */}
                        {safeTool?.user_reviews && Object.keys(safeTool.user_reviews).length > 0 ? (
                            <div className="mb-12">
                                <h2 className="text-xl font-bold text-[#111827] mb-6 dark:text-white">User Reviews</h2>
                                {Object.entries(safeTool.user_reviews).map(([reviewId, review]) => (
                                    <div key={reviewId}
                                         className="border border-[#e5e7eb] rounded-lg p-4 mb-4 dark:border-gray-700 dark:bg-gray-800">

                                        {/* Flex container for the top part: Image + (Name & Rating) */}
                                        {/* Only show this flex if EITHER image OR name OR rating exists */}
                                        {(review.user_profile_image_url?.trim() || review.user_name?.trim() || (typeof review.rating === 'number' && review.rating >= 0)) && (
                                            <div
                                                className="flex items-start mb-2"> {/* Use items-start to align items at the top */}
                                                {/* Optional: User Image */}
                                                {review.user_profile_image_url?.trim() && (
                                                    <img
                                                        src={review.user_profile_image_url}
                                                        alt={`${review.user_name || 'User'} profile picture`}
                                                        className="w-10 h-10 rounded-full mr-4 flex-shrink-0" // Add flex-shrink-0 to prevent image from shrinking
                                                    />
                                                )}

                                                {/* Optional: User Name and Rating (grouped) */}
                                                {/* This block should render if name OR rating exists, regardless of image */}
                                                {(review.user_name?.trim() || (typeof review.rating === 'number' && review.rating >= 0)) && (
                                                    <div
                                                        className="flex flex-col flex-grow"> {/* Use flex-col for Name above Rating, flex-grow to take space */}
                                                        {/* Optional: User Name */}
                                                        {review.user_name?.trim() && (
                                                            <h4 className=" pt-2 font-semibold text-[#111827] dark:text-white">{review.user_name}</h4>
                                                        )}

                                                        {/* Optional: Rating Stars */}
                                                        {typeof review.rating === 'number' && review.rating >= 0 && (
                                                            <div
                                                                className="flex items-center mt-1"> {/* Added margin-top to put rating under name */}
                                                                {Array.from({length: 5}, (_, index) => (
                                                                    <FaStar
                                                                        key={index}
                                                                        className={`w-4 h-4 mr-1 ${index < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}


                                        {/* Optional: Comment */}
                                        {review.comment?.trim() && (
                                            <p className="text-[#4b5563] dark:text-gray-300 mb-2">{review.comment}</p>
                                        )}

                                        {/* Optional: Date - Using created_at from your latest code */}
                                        {review.created_at && new Date(review.created_at).toString() !== 'Invalid Date' && (
                                            <p className="text-sm text-[#6b7280] dark:text-gray-400 mt-2">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </p>
                                        )}

                                        {/* Divider - Condition updated to use created_at */}
                                        {(review.user_profile_image_url?.trim() || review.user_name?.trim() || (typeof review.rating === 'number' && review.rating >= 0) || review.comment?.trim() || review.created_at) && (
                                            <hr className="mt-4 border-gray-200 dark:border-gray-700"/>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // This is the correct else block for 'No reviews'
                            <div className="mb-12">
                                <h2 className="text-xl font-bold text-[#111827] mb-6 dark:text-white">User Reviews</h2>
                                <p className="text-[#6b7280] dark:text-gray-400">No reviews available.</p>
                            </div>
                        )}


                        {/* Related Tools */}
                        {safeTool?.relatedTools && safeTool.relatedTools.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-[#111827] mb-6">Similar Tools</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {safeTool.relatedTools.map((similarTool) => (
                                        <div key={similarTool.id} className="border border-[#e5e7eb] rounded-lg p-4">
                                            <h3 className="font-semibold text-[#111827] mb-2">{similarTool.name}</h3>
                                            <div className="flex gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-[#f5f0ff] text-[#a855f7] rounded-full">
                          {similarTool.category}
                        </span>
                                            </div>
                                            Tool Description
                                            <p className="text-xs text-[#6b7280] mb-4">{similarTool.description}</p>
                                            generated_description
                                            <p className="text-xs text-[#6b7280] mb-4">{similarTool.generated_description}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex space-x-2">
                                                    <button className="p-1 border border-[#e5e7eb] rounded">
                                                        <Bookmark className="w-3 h-3 text-[#6b7280]"/>
                                                    </button>
                                                    {/* <ShareButtonWithPopover itemLink={`/tools/${similarTool.id}`} /> */}
                                                </div>
                                                {/* <Button
                          className="bg-[#a855f7] hover:bg-[#9333ea] text-white text-xs h-7 rounded-md flex items-center"
                          asChild
                        >
                          <Link href={`/tools/${similarTool.id}`}>
                            Try Tool <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        </Button> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="md:col-span-1">
                        <div className="border border-[#e5e7eb] rounded-lg p-6 sticky top-8">
                            <div className="mb-6">
                                {/* Try This Tool Button */}
                                {safeTool?.link && (
                                    <Button
                                        className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white py-3 rounded-md flex items-center justify-center"
                                        asChild>
                                        <a href={safeTool.link} target="_blank" rel="noopener noreferrer"
                                           className="flex items-center">
                                            Try This Tool <ExternalLink className="w-4 h-4 ml-2"/>
                                        </a>
                                    </Button>
                                )}
                            </div>

                            {safeTool?.logoUrl && (
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src={safeTool.logoUrl || "/placeholder.svg"}
                                        alt={`${safeTool?.name ?? ''} logo`}
                                        className="h-16 w-16 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                            (e.target as HTMLImageElement).className = "w-16 h-16 object-contain";
                                        }}
                                    />
                                </div>
                            )}

                            <h3 className="font-semibold text-[#111827] mb-2">Use Cases</h3>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {safeTool?.feature_list?.slice(0, 4).map((feature, index) => (
                                    <span key={index}
                                          className="text-sm bg-[#f3f4f6] text-[#6b7280] px-3 py-1 rounded-full">
                   {feature.length > 15 ? `${feature.substring(0, 15)}...` : feature}
                  </span>
                                ))}
                            </div>

                            <div className="border-t border-[#e5e7eb] pt-4 mb-6">
                                <h3 className="font-semibold text-[#111827] mb-2">Website</h3>
                                {safeTool?.link ? (
                                    <div
                                        className="text-sm text-[#a855f7] hover:underline break-words max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                        title={safeTool.link}
                                    >
                                        <a href={safeTool.link} target="_blank" rel="noopener noreferrer"
                                           className="block">
                                            {safeTool.link}
                                        </a>
                                    </div>
                                ) : (
                                    <p className="text-sm text-[#6b7280]">N/A</p>
                                )}
                            </div>

                            <div className="border-t border-[#e5e7eb] pt-4">
                                <h3 className="font-semibold text-[#111827] mb-2">Last Updated</h3>
                                <p className="text-sm text-[#6b7280]">
                                    {safeTool?.updated_at ? new Date(safeTool.updated_at).toLocaleDateString() : "N/A"}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-8">
                                {/* <button
                  className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
                  onClick={() => handleSaveToggle(tool.unique_id, !!tool.savedByUser)}
                >
                  <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
                </button> */}
                                {/* <ShareButtonWithPopover itemLink={`/tools/${tool.id}`} /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}