//
// interface SearchResultsProps {
//   query: string
//   category: string
// }
//
// export default function SearchResults({ query, category }: SearchResultsProps) {
//   const [viewMode, setViewMode] = useState<"grid" | "list">("list")
//   const [selectedCategories, setSelectedCategories] = useState<string[]>(category ? [category] : [])
//   const [selectedPricing, setSelectedPricing] = useState<string[]>([])
//   const [page, setPage] = useState(1)
//   const limit = 12
//   const { isAuthenticated } = useAuth()
//   const searchParams = useSearchParams()
//
//   // State variables
//   const [displayedTools, setDisplayedTools] = useState<Tool[]>([]);
//   const [totalResults, setTotalResults] = useState(0);
//   const [availableCategories, setAvailableCategories] = useState<string[]>([]);
//   const [availablePricing, setAvailablePricing] = useState<string[]>([]);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [isLoadingState, setIsLoadingState] = useState(true);
//   const [isErrorState, setIsErrorState] = useState(false);
//
//   const isChatSource = typeof window !== "undefined" && searchParams.get("source") === "chat";
//
//   // Effect to handle data loading
//   useEffect(() => {
//     console.log("SearchResults useEffect running");
//     setIsInitialLoad(true);
//     setIsLoadingState(true);
//     setIsErrorState(false);
//
//     if (isChatSource) {
//       console.log("Source is chat, checking sessionStorage...");
//       try {
//         const chatToolsJson = sessionStorage.getItem("chatResponseTools");
//         console.log("Chat tools from sessionStorage:", chatToolsJson ? "Found" : "Not found");
//
//         if (chatToolsJson) {
//           const chatTools = JSON.parse(chatToolsJson);
//           console.log("Parsed chat tools data:", chatTools);
//
//           let transformedTools: Tool[] = [];
//
//           if (Array.isArray(chatTools)) {
//             transformedTools = chatTools.map((tool: any) => ({
//               id: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
//               name: tool.name || "Unknown Tool",
//               slug: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
//               category: tool.category_id || "AI Tool",
//               description: tool.description || "No description available",
//               pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
//               isFeatured: Number(tool.rating || "0") > 4.5, // Example of using rating for featured
//               savedByUser: false, // Default to false, update later if needed
//               features: [], // Assuming features are not in chat data
//               website: tool.link || "#",
//               createdAt: new Date().toISOString(), // Placeholder
//               updatedAt: new Date().toISOString(), // Placeholder
//               status: "approved" as const, // Default status
//               hasFreeVersion: tool.price?.toLowerCase().includes("free"),
//               contactName: "", // Placeholder
//               contactEmail: "", // Placeholder
//               // Add other fields from your Tool type if available in chatTools
//               // Example: imageUrl: tool.image_url || undefined,
//             }));
//           } else if (chatTools && Array.isArray(chatTools.hits)) { // Handle Algolia-like hits structure
//             transformedTools = chatTools.hits.map((tool: any) => ({
//               id: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
//               name: tool.name || "Unknown Tool",
//               slug: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
//               category: tool.category_id || "AI Tool",
//               description: tool.description || "No description available",
//               pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
//               isFeatured: Number(tool.rating || "0") > 4.5, // Example of using rating for featured
//               savedByUser: false, // Default to false, update later if needed
//               features: [], // Assuming features are not in chat data
//               website: tool.link || "#",
//               createdAt: new Date().toISOString(), // Placeholder
//               updatedAt: new Date().toISOString(), // Placeholder
//               status: "approved" as const, // Default status
//               hasFreeVersion: tool.price?.toLowerCase().includes("free"),
//               contactName: "", // Placeholder
//               contactEmail: "", // Placeholder
//               // Add other fields from your Tool type if available in chatTools.hits
//               // Example: imageUrl: tool.image_url || undefined,
//             }));
//           }
//
//           if (transformedTools.length > 0) {
//             console.log("Setting displayed tools from chat data:", transformedTools.length);
//             setDisplayedTools(transformedTools);
//             setTotalResults(transformedTools.length);
//             // FIX: Added missing closing parenthesis here
//             setAvailableCategories(Array.from(new Set(transformedTools.map(t => t.category))));
//             // FIX: Added missing closing parenthesis here
//             setAvailablePricing(Array.from(new Set(transformedTools.map(t => t.pricing))));
//             setIsLoadingState(false);
//             setIsInitialLoad(false);
//           } else {
//             console.log("No chat tools found or empty array, proceeding to API search if query exists.");
//             // If chat source has no tools, still need to set states to false to finish loading
//             setIsLoadingState(false);
//             setIsInitialLoad(false);
//           }
//         } else {
//           console.log("No chat tools found in sessionStorage, proceeding to API search if query exists.");
//           // If no chat tools in session, still need to set states to false to finish loading
//           setIsLoadingState(false);
//           setIsInitialLoad(false);
//         }
//       } catch (error) {
//         console.error("Error processing chat tools data from sessionStorage:", error);
//         setIsErrorState(true);
//         setIsLoadingState(false);
//         setIsInitialLoad(false);
//       }
//     } else {
//       console.log("Source is not chat, will use API search.");
//       setIsInitialLoad(false); // Allow API search effect to run
//       setIsLoadingState(true); // Keep loading state true until API resolves
//     }
//     // Cleanup function if needed
//     return () => {
//       // Any cleanup related to sessionStorage or event listeners
//     };
//   }, [searchParams, isChatSource]); // Depend on searchParams and isChatSource
//
//   // Use the search API hook
//   const {
//     data: apiData,
//     isLoading: isApiLoading,
//     isError: isApiError,
//     refetch: refetchApiSearch // Added refetch if you need a retry mechanism for API
//   } = useSearchTools({
//     query,
//     category: selectedCategories.length > 0 ? selectedCategories[0] : undefined, // Assuming only one category can be selected based on state structure
//     pricing: selectedPricing.length > 0 ? selectedPricing[0] : undefined, // Assuming only one pricing can be selected
//     page,
//     limit,
//   }, {
//     // API search is enabled only if not chat source and initial load check is complete
//     enabled: !isChatSource && !isInitialLoad,
//     // You might want to refetch when filters change if not handled by the hook internally
//     // refetchOnWindowFocus: false, // Example
//   });
//
//   // Effect to update state when API data loads
//   useEffect(() => {
//     // This effect should only run when the API search is enabled and not during initial chat source check
//     if (!isChatSource && !isInitialLoad) {
//       setIsLoadingState(isApiLoading);
//       setIsErrorState(isApiError);
//
//       if (!isApiLoading && !isApiError && apiData) {
//         console.log("Setting displayed tools from API data:", apiData.tools.length);
//         setDisplayedTools(apiData.tools);
//         setTotalResults(apiData.total);
//         // Assuming API returns these arrays directly
//         setAvailableCategories(apiData.categories || []);
//         setAvailablePricing(apiData.pricingOptions || []);
//       } else if (!isApiLoading && !apiData && !isApiError) {
//         // Handle case where API returns no data and no error
//         setDisplayedTools([]);
//         setTotalResults(0);
//         setAvailableCategories([]);
//         setAvailablePricing([]);
//       }
//     }
//     // Cleanup function if needed
//     return () => {
//       // Any cleanup related to the API effect
//     };
//   }, [apiData, isApiLoading, isApiError, isChatSource, isInitialLoad]); // Depend on API data, loading/error states, and source checks
//
//   const saveTool = useSaveTool()
//   const unsaveTool = useUnsaveTool()
//
//   const toggleCategory = (cat: string) => {
//     // If chat source, filters are disabled, so this shouldn't do anything
//     if (isChatSource) return;
//     setSelectedCategories((prev) =>
//         prev.includes(cat) ? prev.filter((c) => c !== cat) : [cat], // Assuming single selection for category filter based on API hook structure
//     )
//     setPage(1) // Reset page when filters change
//   }
//
//   const togglePricing = (price: string) => {
//     // If chat source, filters are disabled, so this shouldn't do anything
//     if (isChatSource) return;
//     setSelectedPricing((prev) => (prev.includes(price) ? prev.filter((p) => p !== price) : [price])) // Assuming single selection for pricing filter
//     setPage(1) // Reset page when filters change
//   }
//
//   const handleSaveToggle = (tool: Tool) => {
//     if (!isAuthenticated) {
//       console.log("Authentication required to save tools.");
//       // Optionally show a login prompt
//       return
//     }
//
//     // Prevent saving/unsaving chat source tools if they don't have proper IDs or API support
//     if (isChatSource) {
//       console.warn("Saving/unsaving disabled for chat source tools.");
//       return;
//     }
//
//
//     if (tool.savedByUser) {
//       // Optimistically update UI before mutation
//       setDisplayedTools(prev => prev.map(t => t.id === tool.id ? {...t, savedByUser: false} : t));
//       unsaveTool.mutate(tool.id, {
//         onError: () => {
//           // Revert UI on error
//           setDisplayedTools(prev => prev.map(t => t.id === tool.id ? {...t, savedByUser: true} : t));
//           console.error("Failed to unsave tool.");
//           // Optionally show error to user
//         }
//       });
//     } else {
//       // Optimistically update UI before mutation
//       setDisplayedTools(prev => prev.map(t => t.id === tool.id ? {...t, savedByUser: true} : t));
//       saveTool.mutate(tool.id, {
//         onError: () => {
//           // Revert UI on error
//           setDisplayedTools(prev => prev.map(t => t.id === tool.id ? {...t, savedByUser: false} : t));
//           console.error("Failed to save tool.");
//           // Optionally show error to user
//         }
//       });
//     }
//   }
//
//   const title = query
//       ? `Search results for "${query}"`
//       : category
//           ? `Recommended AI Tools for ${category}`
//           : "Recommended AI Tools"
//
//   const getBadgeClass = (label: string | undefined | null) => {
//     if (!label) return "bg-gray-100 text-gray-600";
//     const lowerLabel = label.toLowerCase();
//     switch (lowerLabel) {
//       case "premium":
//       case "subscription":
//       case "one-time":
//       case "usage-based":
//         return "bg-yellow-100 text-yellow-600"
//       case "free":
//       case "freemium":
//         return "bg-green-100 text-green-600"
//       case "featured":
//         return "bg-purple-600 text-white"
//       default:
//         return "bg-gray-100 text-gray-600"
//     }
//   }
//
//   // Provide default filter options if API/chat data doesn't
//   const categories = availableCategories.length > 0 ? availableCategories : [
//     "Image Generation",
//     "Text Generation",
//     "Development",
//     "Voice Synthesis",
//     "Data Visualization",
//     "Video Creation",
//     "Chatbots",
//     "Other" // Add 'Other' as a fallback
//   ];
//
//   const pricing = availablePricing.length > 0 ? availablePricing : ["free", "freemium", "subscription", "one-time", "usage-based", "unknown"]; // Add 'unknown'
//
//   const formatPricingLabel = (pricing: string | undefined | null): string => {
//     if (!pricing) return "Unknown";
//     return pricing?.charAt(0).toUpperCase() + pricing?.slice(1).replace("-", " ") || "Unknown";
//   }
//
//   const truncateDescription = (description: string | undefined | null, limit: number = 150) => { // Adjusted limit slightly
//     if (!description) return "No description available.";
//     if (description.length <= limit) return description;
//     return `${description.substring(0, limit)}...`;
//   };
//
//   // Add this at the beginning of the component function, after the state declarations
//   useEffect(() => {
//     // Check if we have data from chat in sessionStorage
//     const chatData = sessionStorage.getItem("chatResponseTools")
//     const source = searchParams.get("source")
//     if (chatData && source === "chat") {
//       try {
//         const parsedData = JSON.parse(chatData)
//         if (parsedData && parsedData.hits && Array.isArray(parsedData.hits)) {
//           // Transform the hits into the format expected by the component
//           const transformedTools = parsedData.hits.map((hit: any) => ({
//             id: hit.id || hit._id || `tool-${Math.random().toString(36).substr(2, 9)}`,
//             name: hit.name || hit.title || "Unknown Tool",
//             description: hit.description || hit.summary || "",
//             category: hit.category || hit.type || "AI Tool",
//             pricing: hit.pricing || "unknown",
//             features: hit.features || [],
//             keywords: hit.keywords || hit.tags || [],
//             isFeatured: hit.isFeatured || false,
//             savedByUser: hit.savedByUser || false,
//             website: hit.link || "#",
//             createdAt: new Date().toISOString(), // Placeholder
//             updatedAt: new Date().toISOString(), // Placeholder
//             status: "approved" as const, // Default status
//             hasFreeVersion: false,
//             contactName: "", // Placeholder
//             contactEmail: "", // Placeholder
//             // Add any other fields needed by your ToolCard component
//           }))
//
//           //setSearchResults({
//           //  tools: transformedTools,
//           //  total: transformedTools.length,
//           //  page: 1,
//           //  limit: transformedTools.length,
//           //  hasMore: false
//           //})
//           setDisplayedTools(transformedTools);
//           setTotalResults(transformedTools.length);
//           setAvailableCategories(Array.from(new Set(transformedTools.map(t => t.category))));
//           setAvailablePricing(Array.from(new Set(transformedTools.map(t => t.pricing))));
//           setIsLoadingState(false);
//           setIsInitialLoad(false);
//         }
//       } catch (error) {
//         console.error("Error parsing chat data:", error)
//       }
//     }
//   }, [searchParams])
//
//   const [searchResults, setSearchResults] = useState<any>(null)
//   const [isLoadingMore, setIsLoadingMore] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//
//   const loadMoreResults = () => {
//     // Implement your load more logic here
//   }
//
//   return (<>
//           {/* Breadcrumb */}
//           <div className="mb-6">
//             <Link href="/" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Tools
//             </Link>
//             <div className="mt-2 flex items-center text-sm text-gray-500">
//               <Link href="/" className="hover:text-gray-900">
//                 Home
//               </Link>
//               <span className="mx-2">&gt;</span>
//               <span>Search</span>
//               {query && <span className="mx-2">&gt;</span>}
//               {query && <span className="truncate max-w-xs">{query}</span>}
//               {category && !query && <span className="mx-2">&gt;</span>}
//               {category && !query && <span className="truncate max-w-xs">{category}</span>}
//             </div>
//           </div>
//
//           {/* AI Assistant message */}
//           <div className="mb-8 rounded-lg border border-purple-100 bg-purple-50 p-4">
//             <div className="flex items-start">
//               <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
//                 <span className="text-sm font-medium text-purple-600">AI</span>
//               </div>
//               <div>
//                 <div className="font-medium">AI Assistant</div>
//                 <p className="text-sm text-gray-700">
//                   {isChatSource
//                       ? "Here are the AI tools recommended by the assistant based on your chat."
//                       : query
//                           ? `Here are the search results for "${query}". You can refine your search using the filters on the left.`
//                           : category
//                               ? `Here are the recommended tools for the "${category}" category. Feel free to explore or refine using the filters.`
//                               : "Here are some AI tools you might find useful. Use the filters on the left to refine your selection."}
//                 </p>
//               </div>
//             </div>
//           </div>
//
//           <div className="flex flex-col lg:flex-row">
//             {/* Sidebar filters */}
//             {/* Hide filters if source is chat, as they are disabled */}
//             <div className={clsx("w-full lg:w-64 lg:pr-8", {"lg:hidden": isChatSource && categories.length === 0 && pricing.length === 0})}>
//               <div className="mb-6 rounded-lg border border-gray-200 p-4">
//                 <h3 className="mb-4 font-medium text-gray-700">Categories</h3>
//                 <div className="space-y-2">
//                   {categories.map((cat) => (
//                       <label key={cat} className={clsx("flex items-center cursor-pointer", isChatSource && "opacity-50 cursor-not-allowed")}>
//                         <input
//                             type="checkbox"
//                             className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
//                             checked={selectedCategories.includes(cat)}
//                             onChange={() => toggleCategory(cat)}
//                             disabled={isChatSource}
//                         />
//                         <span className={clsx("ml-2 text-sm text-gray-800", isChatSource && "text-gray-500")}>{cat}</span>
//                       </label>
//                   ))}
//                   {categories.length === 0 && (
//                       <div className="text-sm text-gray-500">No categories available.</div>
//                   )}
//                 </div>
//
//                 <h3 className="mb-4 mt-6 font-medium text-gray-700">Pricing</h3>
//                 <div className="space-y-2">
//                   {pricing.map((price) => (
//                       <label key={price} className={clsx("flex items-center cursor-pointer", isChatSource && "opacity-50 cursor-not-allowed")}>
//                         <input
//                             type="checkbox"
//                             className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50"
//                             checked={selectedPricing.includes(price)}
//                             onChange={() => togglePricing(price)}
//                             disabled={isChatSource}
//                         />
//                         <span className={clsx("ml-2 text-sm text-gray-800", isChatSource && "text-gray-500")}>{formatPricingLabel(price)}</span>
//                       </label>
//                   ))}
//                   {pricing.length === 0 && (
//                       <div className="text-sm text-gray-500">No pricing info available.</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//
//             {/* Main content */}
//             <div className="flex-1">
//               <div className="mb-6 flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm text-gray-600">{totalResults} Results</span> {/* Show total results */}
//                   <button
//                       onClick={() => setViewMode("grid")}
//                       className={`rounded p-1 ${viewMode === "grid" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
//                       aria-label="Switch to grid view"
//                   >
//                     <Grid className="h-5 w-5" />
//                   </button>
//                   <button
//                       onClick={() => setViewMode("list")}
//                       className={`rounded p-1 ${viewMode === "list" ? "bg-purple-100 text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"}`}
//                       aria-label="Switch to list view"
//                   >
//                     <List className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//
//               {/* Loading state */}
//               {isLoadingState && (
//                   <div className="flex items-center justify-center py-12">
//                     <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-600"></div>
//                   </div>
//               )}
//
//               {/* Error state */}
//               {!isLoadingState && isErrorState && (
//                   <div className="rounded-lg bg-red-50 p-4 text-center border border-red-100">
//                     <p className="text-red-700 mb-3">Failed to load results.</p>
//                     <p className="text-sm text-red-600 mb-4">An error occurred while fetching the AI tools.</p>
//                     <Button
//                         onClick={() => {
//                           if(isChatSource) {
//                             // Re-process sessionStorage data
//                             setIsLoadingState(true);
//                             setIsErrorState(false);
//                             try {
//                               const chatToolsJson = typeof window !== "undefined" ? sessionStorage.getItem("chatResponseTools") : null;
//                               if (chatToolsJson) {
//                                 const chatTools = JSON.parse(chatToolsJson);
//                                 let transformedTools: Tool[] = [];
//                                 if (Array.isArray(chatTools)) {
//                                   transformedTools = chatTools.map((tool: any) => ({
//                                     id: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
//                                     name: tool.name || "Unknown Tool",
//                                     slug: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
//                                     category: tool.category_id || "AI Tool",
//                                     description: tool.description || "No description available",
//                                     pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
//                                     isFeatured: Number(tool.rating || "0") > 4.5,
//                                     savedByUser: false,
//                                     features: [],
//                                     website: tool.link || "#",
//                                     createdAt: new Date().toISOString(),
//                                     updatedAt: new Date().toISOString(),
//                                     status: "approved" as const,
//                                     hasFreeVersion: tool.price?.toLowerCase().includes("free"),
//                                     contactName: "",
//                                     contactEmail: "",
//                                   }));
//                                 } else if (chatTools && Array.isArray(chatTools.hits)) {
//                                   transformedTools = chatTools.hits.map((tool: any) => ({
//                                     id: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
//                                     name: tool.name || "Unknown Tool",
//                                     slug: tool.unique_id || tool.objectID || `chat-tool-${Math.random().toString(36).substr(2, 9)}`,
//                                     category: tool.category_id || "AI Tool",
//                                     description: tool.description || "No description available",
//                                     pricing: tool.price?.toLowerCase().includes("free") ? "free" : "premium",
//                                     isFeatured: Number(tool.rating || "0") > 4.5,
//                                     savedByUser: false,
//                                     features: [],
//                                     website: tool.link || "#",
//                                     createdAt: new Date().toISOString(),
//                                     updatedAt: new Date().toISOString(),
//                                     status: "approved" as const,
//                                     hasFreeVersion: tool.price?.toLowerCase().includes("free"),
//                                     contactName: "",
//                                     contactEmail: "",
//                                   }));
//                                 }
//
//                                 setDisplayedTools(transformedTools);
//                                 setTotalResults(transformedTools.length);
//                                 setAvailableCategories(Array.from(new Set(transformedTools.map(t => t.category))));
//                                 setAvailablePricing(Array.from(new Set(transformedTools.map(t => t.pricing))));
//                                 setIsLoadingState(false);
//                               } else {
//                                 setIsLoadingState(false);
//                                 setIsErrorState(true); // Still an error if sessionStorage is empty on retry
//                               }
//                             } catch (e) {
//                               console.error("Retry failed to process chat tools data:", e);
//                               setIsLoadingState(false);
//                               setIsErrorState(true);
//                             }
//                           } else {
//                             // For API source, just refetch
//                             refetchApiSearch(); // Use the refetch function from the hook
//                             setIsLoadingState(true); // Set loading state back to true
//                             setIsErrorState(false); // Clear previous error
//                           }
//                         }}
//                         className="mt-4 bg-red-600 text-white hover:bg-red-700"
//                     >
//                       Retry
//                     </Button>
//                   </div>
//               )}
//
//               {/* Empty state */}
//               {!isLoadingState && !isErrorState && displayedTools.length === 0 && (
//                   <div className="rounded-lg bg-gray-50 p-8 text-center border border-gray-200">
//                     <p className="mb-4 text-lg text-gray-700">No results found for your search criteria.</p>
//                     {!isChatSource && (
//                         <>
//                           <p className="mb-6 text-gray-600">Try adjusting your filters or search with different keywords.</p>
//                           <Button
//                               onClick={() => {
//                                 setSelectedCategories([])
//                                 setSelectedPricing([])
//                                 setPage(1); // Reset page on clear filters
//                               }}
//                               className="bg-purple-600 text-white hover:bg-purple-700"
//                           >
//                             Clear Filters
//                           </Button>
//                         </>
//                     )}
//                     {isChatSource && (
//                         <p className="mb-6 text-gray-600">The AI assistant did not recommend any tools for this query.</p>
//                     )}
//                   </div>
//               )}
//
//               {/* Search Results */}
//               {!isLoadingState && displayedTools && displayedTools.length > 0 ? (
//                   <div className="mt-6">
//                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                       {displayedTools.map((tool) => (
//                           <ToolCard key={tool.id} tool={tool} />
//                       ))}
//                     </div>
//
//                     {/* Pagination */}
//                     {/*searchResults.hasMore && (
//                       <div className="mt-8 flex justify-center">
//                         <Button
//                           onClick={loadMoreResults}
//                           disabled={isLoadingMore}
//                           className="bg-purple-600 hover:bg-purple-700 text-white"
//                         >
//                           {isLoadingMore ? (
//                             <>
//                               <span className="mr-2">Loading...</span>
//                               <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                             </>
//                           ) : (
//                             "Load More"
//                           )}
//                         </Button>
//                       </div>
//                     )*/}
//                   </div>
//               ) : (
//                   !isLoadingState && (
//                       <div className="mt-10 text-center">
//                         <p className="text-gray-500">No results found. Try a different search term.</p>
//                       </div>
//                   )
//               )}
//
//               {/* Display Results (List View - Grid Layout) */}
//               {/*{!isLoadingState && !isErrorState && displayedTools.length > 0 && viewMode === "list" && (
//                   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                     {displayedTools.map((tool) => (
//                         <Card key={tool.id} className="overflow-hidden border border-gray-200 flex flex-col"> {/* Added flex-col */}
//                           <CardContent className="p-4 flex-grow"> {/* Added flex-grow */}
//                             <h3 className="mb-1 text-lg font-semibold text-gray-800">{tool.name}</h3>
//                             <div className="mb-2 flex flex-wrap gap-1">
//                                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
//                                  {tool.category || "AI Tool"} {/* Added fallback */}
//                                </span>
//                               <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(tool.pricing)}`}>
//                                  {formatPricingLabel(tool.pricing)}
//                                </span>
//                               {tool.isFeatured && (
//                                   <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("featured")}`}>
//                                     Featured
//                                   </span>
//                               )}
//                             </div>
//                             <p className="mb-3 text-sm text-gray-600">{truncateDescription(tool.description)}</p>
//
//                             <div className="mb-4 flex flex-wrap gap-1">
//                               {tool.features && Array.isArray(tool.features) && // Ensure features is an array
//                                   tool.features.slice(0, 3).map((tag, idx) => (
//                                       <span key={idx} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
//                               {tag}
//                             </span>
//                                   ))}
//                             </div>
//                           </CardContent>
//                           <div className="p-4 border-t border-gray-100 flex items-center justify-between"> {/* Moved actions here */}
//                             <div className="flex items-center space-x-1">
//                               <button
//                                   className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"} disabled:opacity-50 disabled:pointer-events-none`}
//                                   onClick={() => handleSaveToggle(tool)}
//                                   disabled={isChatSource || !isAuthenticated} // Disable if chat source or not authenticated
//                                   aria-label={tool.savedByUser ? "Unsave tool" : "Save tool"}
//                                            >
//                                 <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
//                               </button>
//                               <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500" aria-label={`Share ${tool.name}`}>
//                                 <Share2 className="h-4 w-4" />
//                               </button>
//                             </div>
//                             {tool.website && ( // Only show Try Tool if website link exists
//                                 <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5" asChild>
//                                   {/* Use target="_blank" for external links */}
//                                   <a href={tool.website} target="_blank" rel="noopener noreferrer">
//                                     Try Tool
//                                     <svg
//                                         className="ml-1 h-3 w-3" {/* Smaller icon for smaller button */}
//                                         fill="none"
//                                         stroke="currentColor"
//                                         viewBox="0 0 24 24"
//                                         xmlns="http://www.w3.org/2000/svg"
//                                     >
//                                       <path
//                                           strokeLinecap="round"
//                                           strokeLinejoin="round"
//                                           strokeWidth="2"
//                                           d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//                                       ></path>
//                                     </svg>
//                                   </a>
//                                 </Button>
//                             )}
//                           </div>
//                         </Card>
//                     ))}
//                   </div>
//               )}
//
//               {/* Display Results (Grid View - Vertical List) */}
//               {!isLoadingState && !isErrorState && displayedTools.length > 0 && viewMode === "grid" && (
//                   <div className="space-y-4"> {/* Use space-y for vertical list spacing */}
//                     {displayedTools.map((tool) => (
//                         <Card key={tool.id} className="overflow-hidden border border-gray-200">
//                           <CardContent className="p-4">
//                             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                               <div className="flex-grow mr-4"> {/* Added flex-grow and margin */}
//                                 <h3 className="mb-1 text-lg font-semibold text-gray-800">{tool.name}</h3>
//                                 <div className="mb-2 flex flex-wrap gap-1">
//                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
//                                      {tool.category || "AI Tool"} {/* Added fallback */}
//                                    </span>
//                                   <span
//                                       className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass(tool.pricing)}`}
//                                   >
//                               {formatPricingLabel(tool.pricing)}
//                             </span>
//                                   {tool.isFeatured && (
//                                       <span
//                                           className={`rounded-full px-2 py-0.5 text-xs font-medium ${getBadgeClass("featured")}`}
//                                       >
//                                 Featured
//                               </span>
//                                   )}
//                                 </div>
//                                 <p className="mb-2 text-sm text-gray-600">{truncateDescription(tool.description)}</p>
//                                 <div className="flex flex-wrap gap-1">
//                                   {tool.features && Array.isArray(tool.features) && // Ensure features is an array
//                                       tool.features.slice(0, 3).map((tag, idx) => (
//                                           <span key={idx} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
//                                   {tag}
//                                 </span>
//                                       ))}
//                                 </div>
//                               </div>
//                               <div className="mt-4 flex items-center md:mt-0 md:flex-col md:items-end"> {/* Stack buttons vertically on medium+ */}
//                                 <div className="flex items-center space-x-2 mb-2 md:mb-0 md:space-x-0 md:flex-col md:items-end md:space-y-2"> {/* Space between stacked buttons */}
//                                   <button
//                                       className={`rounded p-1 ${tool.savedByUser ? "text-purple-600" : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"} disabled:opacity-50 disabled:pointer-events-none`}
//                                       onClick={() => handleSaveToggle(tool)}
//                                       disabled={isChatSource || !isAuthenticated} // Disable if chat source or not authenticated
//                                       aria-label={tool.savedByUser ? "Unsave tool" : "Save tool"}
//                                   >
//                                     <Bookmark className="h-4 w-4" fill={tool.savedByUser ? "currentColor" : "none"} />
//                                   </button>
//                                   <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500" aria-label={`Share ${tool.name}`}>
//                                     <Share2 className="h-4 w-4" />
//                                   </button>
//                                 </div>
//                                 {tool.website && ( // Only show Try Tool if website link exists
//                                     <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 mt-2 md:mt-0" asChild> {/* Added top margin for small screens */}
//                                       {/* Use target="_blank" for external links */}
//                                       <a href={tool.website} target="_blank" rel="noopener noreferrer">
//                                         Try Tool
//                                         <svg
//                                             className="ml-1 h-3 w-3" {/* Smaller icon for smaller button */}
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                         >
//                                           <path
//                                               strokeLinecap="round"
//                                               strokeLinejoin="round"
//                                               strokeWidth="2"
//                                               d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//                                           ></path>
//                                         </svg>
//                                       </a>
//                                     </Button>
//                                 )}
//                               </div>
//                             </div>
//                           </CardContent>
//                         </Card>
//                     ))}
//                   </div>
//               )}
//
//               {/* Pagination */}
//               {!isLoadingState && !isErrorState && displayedTools.length > 0 && totalResults > limit && (
//                   <div className="flex justify-center mt-8 space-x-4 items-center">
//                     <Button
//                         onClick={() => setPage(p => Math.max(1, p - 1))}
//                         disabled={page === 1 || isLoadingState}
//                         className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
//                     >
//                       Previous
//                     </Button>
//                     <span className="text-gray-700 text-sm">Page {page} of {Math.ceil(totalResults / limit)}</span>
//                     <Button
//                         onClick={() => setPage(p => p + 1)}
//                         disabled={page * limit >= totalResults || isLoadingState}
//                         className="bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none"
//                     >
//                       Next
//                     </Button>
//                   </div>
//               )}
//
//
//             </div>
//           </div>
// </>) // closes return()
// } // closes export default function SearchResults({...})
