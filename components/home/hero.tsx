

"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Search, MessageSquare, X, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatInterface from "./chat-interface";
import { useAuth } from "@/contexts/auth-context";

import { useClickOutside } from "@/hooks/use-click-outside";

import { keywordSearch } from "@/services/chat-service";
import { useRouter } from "next/navigation";
import { robotSvg, setDisplayCategories } from "@/lib/reusable_assets";
import { SignInModal } from "./sign-in-modal";
import { getTools } from "@/services/tool-service";
import { LogoAvatar } from "@/components/LogoAvatar";

import {useCustomDebounce} from "@/lib/reusable-methods";
import {SearchToolListItem} from "@/components/SearchToolList";
import {Tool} from "@/types/tool";
import {JobListItem} from "@/components/job-list-items";

// Types for API integration
// interface Tool {
//     unique_id: string;
//     id: number | string;
//     name: string;
//     description: string;
//     generated_description: string;
//     categories: Category[] | null;
//     icon?: string;
//     image?: string;
//     logo_url?: string;
//     carriers?: string[];
// }

interface Category {
    id: string;
    name: string;
}

interface SearchResponse {
    tools: Tool[];
    total: number;
}

export default function Hero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [tools, setTools] = useState<Tool[]>([]);
    const [carrierTools, setCarriersTools] = useState<Tool[]>([]);
    const [moreTools, setMoreTools] = useState<Tool[]>([]);
    const [carriers,setCarriers] = useState<string[]>([]);

    // Refs for the different input elements
    const inputRef = useRef<HTMLInputElement>(null); // Ref for the initial input
    const intermediateInputRef = useRef<HTMLInputElement>(null); // Ref for the input in the intermediate UI
    const chatInputRef = useRef<HTMLInputElement>(null);

    const searchContainerRef = useRef<HTMLDivElement>(null);
    const searchCommandRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();
    const [showChatTooltip, setShowChatTooltip] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const onCloseCallbackRef = useRef<(() => void) | null>(null);
    const currentModalIdRef = useRef<string | null>(null);
    const openSignUpModal = () => {
        setIsSignInModalOpen(false);
        setIsSignUpModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    const [formattedData, setFormattedData] = useState<any[]>([]);

    const [previousRoute, setPreviousRoute] = useState<string | undefined>();

    function goToToolDetails(id: string | number): void {
        console.log("Calling goToToolDetails for ID:", id);
        router.push(`/tools/${encodeURIComponent(id)}`);
        // router.push(`/tools/${id}`);
    }
    function goToJobImpact(id: string | number): void {
        console.log("Calling goToToolDetails for ID:", id);
        router.push(`/job-impact/${encodeURIComponent(id)}`);
        // router.push(`/tools/${id}`);
    }

    // Close search when clicking outside
    useClickOutside(searchCommandRef as React.RefObject<HTMLElement>, () => {
        if (isSearchOpen && !isChatOpen) {
            setIsSearchOpen(false);
        }
    });

    const closeAllModals = () => {
        setIsSignInModalOpen(false);
        setIsSignUpModalOpen(false);
        setPreviousRoute(undefined);
        if (onCloseCallbackRef.current) {
            onCloseCallbackRef.current();
            onCloseCallbackRef.current = null;
        }
        currentModalIdRef.current = null;
    };

    const exampleTags = [
        "Image generation tools",
        "Content Creation",
        "Video creation",
        "Business Tools",
        "SEO Tools",
    ];

    const fetchTools = async (
        query: string,
        setLimit: boolean = true,
        limitWhenTrue: number = 5,
        limitWhenFalse: number = 20
    ) => {

        console.log(`set limit is: ${setLimit}`);

        if (setLimit) {
            setIsLoading(true);
            setTools([]);
        } else {
            setMoreTools([]);
            setIsButtonLoading(true);
        }
        let limit = setLimit ? limitWhenTrue : limitWhenFalse;
        console.log(`limit is: ${limit}`);

        try {
            console.log(`Attempting keyword search for: "${query}"`);

            // Attempt keyword search first
            const keywordData = await keywordSearch([query], 0, limit);

            if (keywordData && keywordData.tools && keywordData.tools.length > 0) {
                console.log(
                    `Keyword search successful, found ${keywordData.tools.length} tools. and carriers are ${keywordData.carriers.length}`
                );

                // Type-safe filtering
                // const { carrierTools, regularTools } = keywordData.tools.reduce(
                //     (result, tool) => {
                //         const hasCarriers = tool.carriers && tool.carriers.length > 0;
                //         hasCarriers ? result.carrierTools.push(tool) : result.regularTools.push(tool);
                //         return result;
                //     },
                //     { carrierTools: [] as Tool[], regularTools: [] as Tool[] }
                // );


                if (setLimit) {

                    //
                    // setCarriersTools(keywordData.tools);
                    setCarriers(keywordData.carriers);
                    setTools(keywordData.tools);

                    // setCarriersTools(carrierTools);
                    // setTools(regularTools);
                } else {
                    setMoreTools(keywordData.tools);

                }
            } else {
                console.log(
                    `Keyword search found no tools. Falling back to general search for: "${query}"`
                );
                // Fallback to general search if keyword search returned no tools or was empty
                try {
                    const generalData = await getTools({
                        search: query,
                        limit: limit,
                    });
                    console.log(
                        `General search successful, found ${generalData.tools.length} tools.`
                    );
                    if (setLimit) {
                        setTools(generalData.tools);
                    } else {
                        setMoreTools(generalData.tools);
                    }
                } catch (generalError) {
                    console.error("General search fallback failed:", generalError);
                    setTools([]); // Clear tools on fallback error
                    setMoreTools([]);
                    // Optionally show a toast error here if both methods failed
                }
            }
        } catch (keywordError) {
            console.error("Keyword search failed unexpectedly:", keywordError);
            console.log(
                `Keyword search failed. Falling back to general search for: "${query}"`
            );
            // Fallback to general search if keyword search threw an error
            try {
                const generalData = await getTools({
                    search: query,
                    limit: limit,
                });
                console.log(
                    `General search successful, found ${generalData.tools.length} tools.`
                );
                if (setLimit) {
                    setTools(generalData.tools);
                } else {
                    setMoreTools(generalData.tools);
                }
            } catch (generalError) {
                console.error(
                    "General search fallback after keyword failure also failed:",
                    generalError
                );
                setTools([]); // Clear tools if both fail
                setMoreTools([]);
                // Optionally show a toast error here if both methods failed
            }
        } finally {
            setIsLoading(false);
            //simulate random delay befor changing button state
            // await new Promise(resolve => setTimeout(resolve,  Math.max(1000 - elapsedTime, 0)));
            setIsButtonLoading(false);

        }
    };

    const debouncedSearchQuery = useCustomDebounce(searchQuery, 500);



    useEffect(() => {
        // This effect will only run AFTER debouncedSearchQuery updates,
        // which happens after the debounce delay within useCustomDebounce.
        if (debouncedSearchQuery) {
            console.log("Fetching tools for:", debouncedSearchQuery); // Example: See when it runs

            // --- Add this line to clear previous results immediately ---
            setTools([]);
            // --------------------------------------------------------

            // Now, fetch the new tools
            fetchTools(debouncedSearchQuery);
        } else {
            // Clear tools when the search query is empty
            setTools([]);
        }

    }, [debouncedSearchQuery]); // <--- Dependency is the debounced value!

    // Effect to focus the intermediate input when search is open
    useEffect(() => {
        if (isSearchOpen && !isChatOpen && intermediateInputRef.current) {
            // Use a small delay to ensure the element is visible and interactive
            const focusTimer = setTimeout(() => {
                intermediateInputRef.current?.focus();
            }, 50); // 50ms delay

            return () => clearTimeout(focusTimer); // Cleanup the timer
        }
    }, [isSearchOpen, isChatOpen]); // Depend on isSearchOpen and isChatOpen

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isSearchOpen && !isChatOpen) {
            setShowChatTooltip(true); // Show immediately

            timer = setTimeout(() => {
                setShowChatTooltip(false); // Hide after 2 seconds
            }, 2000);
        } else {
            setShowChatTooltip(false); // Hide if conditions don't match
        }

        return () => clearTimeout(timer); // Clean up
    }, [isSearchOpen, isChatOpen]);

    const handleSearchFocus = () => {
        if (!isAuthenticated) {
            openSignInModal();
            return; // Stop if not authenticated
        }
        // Only set isSearchOpen to true if chat is not open
        if (!isChatOpen) {
            setIsSearchOpen(true);
            // If there's a search query, fetch tools immediately
            if (searchQuery) {
                fetchTools(searchQuery);
            }
        }
    };

    const openSignInModal = () => {
        setIsSignUpModalOpen(false);
        setIsSignInModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    const handleChatOpen = () => {
        // Add this authentication check
        if (!isAuthenticated) {
            openSignInModal(); // Show the login modal
            return; // Stop execution if not authenticated
        }

        // Only proceed with opening chat if authenticated
        setIsSearchOpen(false); // Close search when opening chat
        setIsChatOpen(true);
        // You might want to add other chat initialization logic here
    };

    const handleClose = () => {
        setIsSearchOpen(false);
        setSearchQuery("");
        setTools([]); // Clear tools when closing the intermediate search
    };

    const handleSearch = () => {
        if (searchQuery) {
            // This function seems redundant now that handleSearchNavigation exists and is used on the button
            handleSearchNavigation();
        }
    };

    const smallPlaceholder = "Search AI Tools";
    const largePlaceholder = "What AI tool are you looking for? E.g., 'Image generator for mark..'";
    const [placeholderText, setPlaceholderText] = useState(smallPlaceholder); // Initialize with the small one
    // Effect to check screen size and update placeholder
    useEffect(() => {
        const updatePlaceholder = () => {
            // Define your breakpoint (e.g., 640px for Tailwind's 'sm')
            if (window.innerWidth >= 640) {
                setPlaceholderText(largePlaceholder);
            } else {
                setPlaceholderText(smallPlaceholder);
            }
        };

        // Set placeholder text initially when the component mounts
        updatePlaceholder();

        // Add event listener for window resize
        window.addEventListener("resize", updatePlaceholder);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener("resize", updatePlaceholder);
        };
    }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

    const handleSearchNavigation = async () => {
        console.log(`more tools length is: ${moreTools.length}`);
        if (!searchQuery) {
            console.log(`navigating with empty query`);
             // sessionStorage.r("searchTools");
            sessionStorage.removeItem("searchTools");
            router.push(`/search?q=${encodeURIComponent(searchQuery)}&source=direct`);
        }
        // if (!searchQuery) return;

        // Fetch the full list of tools for the search results page
        await fetchTools(searchQuery, false);
        // The router push happens in the useEffect that watches moreTools

        // You might want to close the intermediate search UI here
        // handleClose(); // Decide if you want to close it immediately
    };

    // Handler for the initial input field's change event
    const handleInitialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        console.log(`search query length is ${value.length}`);

        // If the input has value, open the search UI if it's not already open or if chat is open
        if (value.trim().length > 0) {
            if (!isSearchOpen || isChatOpen) { // Only set if changing state
                setIsChatOpen(false); // Ensure chat is closed if typing in search
                setIsSearchOpen(true);
            }
            // Fetch tools for the intermediate UI
            // fetchTools(value);
        } else {
            // If input is empty, close the search UI
            console.log("Input is empty. Closing search.");
            handleClose(); // handleClose sets isSearchOpen to false and clears tools
        }
    };

    // Handler for the intermediate input field's change event
    const handleIntermediateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        console.log(`intermediate input search query length is ${value.length}`);

        // Fetch tools for the intermediate UI
        if (value.trim().length > 0) {
            // fetchTools(value);
        } else {
            setTools([]); // Clear results if intermediate input becomes empty
            // Decide if you want to completely close the intermediate UI here
            // setIsSearchOpen(false); // Uncomment if typing back to empty should close
        }
    };


    // Effect to navigate to search results page when moreTools is populated
    useEffect(() => {
        console.log(`more tools length after update is: ${moreTools.length}`);

        //fix me removed check as per request to go to search result page
        if (moreTools.length > 0) {
            // Store in session storage for the search results page to access
            sessionStorage.setItem("searchTools", JSON.stringify(moreTools));

            // Navigate to the search page
            router.push(`/search?q=${encodeURIComponent(searchQuery)}&source=direct`);
            setIsButtonLoading(false);
            // Clear moreTools after navigation is initiated, assuming the target page will fetch its own data or use session storage
            setMoreTools([]);
        }
    }, [moreTools, searchQuery]); // Added router and searchQuery to dependencies


    return (
        <>
            <SignInModal
                isOpen={isSignInModalOpen}
                onClose={closeAllModals}
                onSwitchToSignUp={openSignUpModal}
                previousRoute={previousRoute}
            />
            <section className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50 to-purple-100 py-24 text-center">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl">
                        {/* Top badge */}
                        <div className="mb-3 flex items-center justify-center">
                            <div className="rounded-full bg-purple-100 px-4 py-1 text-xs font-medium text-purple-600">
                                ✨ Find the perfect AI tool for any task
                            </div>
                        </div>

                        {/* Headings */}
                        <h1 className="text-4xl font-bold text-purple-500 md:text-5xl">AI Tools Discovery</h1>
                        <h2 className="mb-6 text-5xl font-extrabold text-gray-900 md:text-6xl flex justify-center items-center">
                            Platform
                            <div className="relative inline-block w-10 h-10 ml-2 md:w-12 md:h-12 md:ml-3">
                                <div
                                    className="absolute top-0 left-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-500 opacity-75"
                                    style={{ transform: "translate(15%, 15%)" }}
                                ></div>
                                <div
                                    className="absolute top-0 left-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-400"
                                    style={{ transform: "translate(-15%, -15%)" }}
                                ></div>
                            </div>
                        </h2>

                        {/* Subheading */}
                        <p className="mb-10 text-lg text-gray-600">
                            Your one-stop directory to find, compare, and use the best AI tools for any task.
                        </p>

                        {/* Search bar / Chat Interface container */}
                        <div ref={searchContainerRef} className="relative mx-auto mb-8 max-w-2xl">
                            {/* Initial Search Input - shown when neither chat nor intermediate search is open */}
                            {!isChatOpen && !isSearchOpen ? (
                                <div className="relative">
                                    {/* Added flex centering wrapper */}
                                    <div className="flex justify-center">
                                        <Input
                                            ref={inputRef}
                                            type="text"
                                            placeholder={placeholderText} // Uses responsive placeholder state
                                            className="h-14 rounded-full border-gray-200 pl-12 pr-32 shadow-md text-s w-full max-w-screen-md" // Added responsive width for centering
                                            value={searchQuery}
                                            // Use the specific handler for the initial input
                                            onChange={handleInitialInputChange}
                                            onFocus={handleSearchFocus} // Added onFocus to open intermediate search
                                        />
                                    </div>
                                    <div className="absolute left-4 top-4 flex items-center gap-2">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div className="absolute right-2 top-2 flex items-center gap-1">
                                        {/*fix me chat hidden*/}
                                        {/*<div*/}
                                        {/*    className="relative group rounded-full bg-purple-100 p-2.5 h-10 w-10 flex items-center justify-center cursor-pointer"*/}
                                        {/*    onClick={handleChatOpen}*/}
                                        {/*    aria-label="Try chat mode"*/}
                                        {/*>*/}
                                        {/*    <MessageSquare*/}
                                        {/*        className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors"*/}
                                        {/*        // onClick is moved to the parent div*/}
                                        {/*    />*/}
                                        {/*    /!* Tooltip *!/*/}
                                        {/*    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">*/}
                                        {/*        Try chat mode for interactive conversation*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}

                                        <Button
                                            className="h-10 rounded-full bg-purple-600 px-6 text-sm hover:bg-purple-700"
                                            onClick={() => handleSearchFocus()} // Call handleSearchFocus on button click too
                                        >
                                            Search <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ) : null}

                            {/* Intermediate Search UI - shown when search is open and chat is not */}
                            {isSearchOpen && !isChatOpen && (
                                <div ref={searchCommandRef} className="w-full max-w-2xl mx-auto rounded-lg border border-gray-200 shadow-sm bg-white overflow-hidden">
                                    {/* Search header with input and buttons */}
                                    <div className="flex items-center border-b px-4 py-3 gap-2">
                                        <Search className="h-5 w-5 text-gray-400" />
                                        <input
                                            ref={intermediateInputRef} // Attach the ref to the intermediate input
                                            type="text"
                                            placeholder="Search AI tools..." // You could make this responsive too if needed
                                            value={searchQuery}
                                            onChange={handleIntermediateInputChange} // Use specific handler for this input
                                            className="flex-1 outline-none text-sm placeholder-gray-400"
                                        />
                                        <div className="flex gap-2">
                                            {/* Chat button (gray, smaller) */}
                                            {/*fix me chat hidden*/}
                                            {/*<div className="relative">*/}
                                            {/*    <button*/}
                                            {/*        onClick={handleChatOpen}*/}
                                            {/*        onMouseEnter={() => setIsHovered(true)}*/}
                                            {/*        onMouseLeave={() => setIsHovered(false)}*/}
                                            {/*        className="relative group rounded-full bg-purple-100 p-2.5 h-10 w-10 flex items-center justify-center cursor-pointer"*/}
                                            {/*    >*/}
                                            {/*        <MessageSquare className="h-5 w-5 text-gray-400 group-hover:text-purple-500 transition-colors" />*/}
                                            {/*    </button>*/}

                                            {/*    {showChatTooltip && (*/}
                                            {/*        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-10">*/}
                                            {/*            /!* Arrow *!/*/}
                                            {/*            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-black"></div>*/}
                                            {/*            /!* Tooltip *!/*/}
                                            {/*            <div className="px-2 py-1 text-xs text-white bg-black rounded shadow">*/}
                                            {/*                Try chat mode for interactive conversation*/}
                                            {/*            </div>*/}
                                            {/*        </div>*/}
                                            {/*    )}*/}
                                            {/*</div>*/}

                                            {/* Search button (purple) */}
                                            {isButtonLoading ? (
                                                <button
                                                    onClick={handleSearchNavigation}
                                                    className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center gap-1.5"
                                                    disabled={isButtonLoading} // Good practice to disable button while loading
                                                >
                                                    {/* You can replace "Loading..." with a spinner component */}
                                                    <span>Loading...</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSearchNavigation}
                                                    className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors flex items-center gap-1.5"
                                                >
                                                    <Search className="h-4 w-4" />
                                                    <span>Search</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Area (Loading, No Results, Results List) */}
                                    <div className="divide-y max-h-96 overflow-y-auto"> {/* Added max-height and overflow for scrollable results */}
                                        {isLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                                            </div>
                                        ) : searchQuery.length === 0 ? (
                                            <div className="py-6 text-center text-sm text-gray-500">
                                                Start Typing to search
                                            </div>
                                        ) : tools.length === 0 ? (
                                            <div className="py-6 text-center text-sm text-gray-500">
                                                No results found.
                                            </div>
                                        ) : (
                                            // <>
                                            //     <div className="px-4 py-2 bg-gray-50">
                                            //         <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            //             AI Tools
                                            //         </h3>
                                            //     </div>
                                            //     {tools.map((tool) => {
                                            //         // Logic to determine and format the description
                                            //         const sourceDescription = tool.generated_description || tool.description;
                                            //
                                            //         // Prepare the description for display (slice and add ellipsis)
                                            //         let displayDescription = '';
                                            //         if (sourceDescription) {
                                            //             const sliced = sourceDescription.slice(0, 50);
                                            //             // Check if the original source description was long enough to need ellipsis
                                            //             const needsEllipsis = sourceDescription.length > 70;
                                            //             displayDescription = sliced + (needsEllipsis ? '...' : '');
                                            //         }
                                            //         // If sourceDescription is null/undefined, displayDescription remains an empty string
                                            //
                                            //         return (
                                            //             <div
                                            //                 key={tool.id}
                                            //                 className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                            //                 onClick={(e) => {
                                            //                     e.stopPropagation(); // Prevent click from bubbling up
                                            //                     goToToolDetails(tool.unique_id);
                                            //                 }}
                                            //             >
                                            //                 <div className="flex items-center justify-between">
                                            //                     <div className="flex items-start space-x-3">
                                            //                         <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-50 text-purple-600">
                                            //                             <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                                            //                                 <LogoAvatar logoUrl={tool.logo_url} name={tool.name} />
                                            //                             </div>
                                            //                         </div>
                                            //
                                            //                         <div className="flex flex-col items-start flex-1 min-w-0"> {/* Added flex-1 min-w-0 */}
                                            //                             <h4 className="text-sm font-medium truncate">{tool.name}</h4> {/* Added truncate */}
                                            //                             {/* Display the prepared description */}
                                            //                             <div className="text-xs text-gray-500 text-left">
                                            //                                 {displayDescription}
                                            //                             </div>
                                            //                         </div>
                                            //                     </div>
                                            //
                                            //                     {/* Categories and External Link */}
                                            //                     {/* Ensure this section wraps or handles overflow gracefully */}
                                            //                     <div className="flex items-center space-x-2 shrink-0"> {/* Added shrink-0 */}
                                            //                         <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full whitespace-nowrap"> {/* Added whitespace-nowrap */}
                                            //                             {setDisplayCategories(tool.categories, 10)}
                                            //                         </span>
                                            //                         <ExternalLink className="text-gray-400 hover:text-gray-600 w-4 h-4 cursor-pointer shrink-0" /> {/* Added shrink-0 */}
                                            //                     </div>
                                            //                 </div>
                                            //             </div>
                                            //         );
                                            //     })}
                                            // </>

                                            <>
                                                {/* Carrier Tools Section (only shown if carrierTools exist) */}
                                                {carriers.length > 0 && (
                                                    <div className="border-t border-gray-200">
                                                        <div className="px-4 py-2 bg-gray-50">
                                                            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                Jobs
                                                            </h3>
                                                        </div>
                                                        {carriers.map((carrier:string) => (
                                                            <JobListItem

                                                                carrier={carrier}
                                                                onClick={() => goToJobImpact(carrier)}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Regular AI Tools Section */}
                                                <div className="px-4 py-2 bg-gray-50">
                                                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        AI Tools
                                                    </h3>
                                                </div>
                                                {tools.map((tool:Tool) => (
                                                    <SearchToolListItem
                                                        key={tool.id}
                                                        tool={tool}
                                                        onClick={() => goToToolDetails(tool.unique_id)}
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </div>

                                    {/* Footer buttons */}
                                    <div className="border-t p-3 bg-gray-50 flex justify-end">
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Chat Interface - only show if authenticated */}
                            {isAuthenticated && (
                                <div className="relative mx-auto mb-8 max-w-2xl">
                                    <ChatInterface
                                        isOpen={isChatOpen}
                                        onClose={() => {
                                            setIsChatOpen(false);
                                            setIsSearchOpen(false); // Close search when closing chat
                                        }}
                                        inputRef={chatInputRef as React.RefObject<HTMLInputElement>}
                                        isRelativeToParent={false}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Example buttons */}
                        <div className="mb-2 text-sm text-gray-500">💡 Try these examples:</div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {exampleTags.slice(0, 3).map((example) => (
                                <Button
                                    key={example}
                                    variant="outline"
                                    className="rounded-full border-gray-200 bg-white bg-gradient-to-br from-white via-purple-50 to-purple-100 text-xs text-gray-600 shadow-lg hover:bg-gray-50"
                                    onClick={() => {
                                        setSearchQuery(example);
                                        // Set focus and open search when clicking an example tag
                                        setIsChatOpen(false); // Close chat
                                        setIsSearchOpen(true); // Open intermediate search
                                        // The useEffect will handle focusing the intermediate input
                                        // Also trigger the search fetch
                                        fetchTools(example);
                                    }}
                                >
                                    <span className="pr-2 text-purple-300">" </span>
                                    {example}
                                    <span className="pl-2 text-purple-300">" </span>
                                </Button>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            {exampleTags.slice(3).map((example) => (
                                <Button
                                    key={example}
                                    variant="outline"
                                    className="rounded-full border-gray-200 bg-white bg-gradient-to-br from-white via-purple-50 to-purple-100 text-xs text-gray-600 shadow-lg hover:bg-gray-50"
                                    onClick={() => {
                                        setSearchQuery(example);
                                        // Set focus and open search when clicking an example tag
                                        setIsChatOpen(false); // Close chat
                                        setIsSearchOpen(true); // Open intermediate search
                                        // The useEffect will handle focusing the intermediate input
                                        // Also trigger the search fetch
                                        fetchTools(example);
                                    }}
                                >
                                    <span className="pr-2 text-purple-300">" </span>
                                    {example}
                                    <span className="pl-2 text-purple-300">" </span>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
