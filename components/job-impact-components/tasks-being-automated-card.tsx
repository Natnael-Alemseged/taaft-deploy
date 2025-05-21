// import React, { useState } from 'react';
// import type { Tool } from "@/types/tool";
// import { useRouter } from 'next/navigation';
// import {useAuth} from "@/contexts/auth-context";
// import {showLoginModal} from "@/lib/auth-events";
// // Assuming you have a hook or context for auth status and login modal
//
//
// interface AutomatedTask {
//     id: string;
//     title: string;
//     impactPercentage: number;
//     impactDescription: string;
//     aiTools: Tool[];
// }
//
// interface TasksBeingAutomatedCardProps {
//     tasks: AutomatedTask[];
// }
//
// interface ToolWithUniqueId extends Tool {
//     unique_id: string;
//     url?: string;
// }
//
// export default function TasksBeingAutomatedCard({ tasks }: TasksBeingAutomatedCardProps) {
//     const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
//     const router = useRouter();
//     const { isAuthenticated } = useAuth();
//
//     const { pathname } = router;
//
//     const toggleExpand = (taskId: string) => {
//         setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
//     };
//
//     const handleGoToToolDetails = (tool: ToolWithUniqueId) => {
//         if (!tool.unique_id) {
//             console.error('Tool is missing unique_id:', tool);
//             return;
//         }
//         if (!isAuthenticated) {
//             showLoginModal(pathname, () => {
//                 router.push(`/tools/${encodeURIComponent(tool.unique_id)}`);
//             });
//         } else {
//             router.push(`/tools/${encodeURIComponent(tool.unique_id)}`);
//         }
//     };
//
//     return (
//         // Added max-w-2xl here
//         <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6">Tasks Being Automated</h2>
//             <div>
//                 {tasks.map((task) => (
//                     <div key={task.id} className="border-b border-gray-200 last:border-b-0 py-4">
//                         <button
//                             className="flex justify-between items-center w-full text-left"
//                             onClick={() => toggleExpand(task.id)}
//                             aria-expanded={expandedTaskId === task.id}
//                             aria-controls={`task-content-${task.id}`}
//                         >
//                             <div className="flex-grow pr-4">
//                                 <h3 className="text-lg font-semibold text-gray-700">{task.title}</h3>
//                                 <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
//                   {task.impactPercentage}% Impact
//                 </span>
//                                 <p className="text-gray-600 text-sm mt-1">{task.impactDescription}</p>
//                             </div>
//                             <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
//                         </button>
//                         {expandedTaskId === task.id && (
//                             <div id={`task-content-${task.id}`} className="mt-4 animate-fade-in">
//                                 <h4 className="text-md font-semibold text-gray-700 mb-3">AI Tools Automating This Task:</h4>
//                                 <div className="space-y-3">
//                                     {task.aiTools.map((tool) => (
//                                         (tool as ToolWithUniqueId).unique_id && (
//                                             <div key={tool.id} className="bg-gray-50 p-3 rounded-md border border-gray-100 flex justify-between items-center">
//                                                 <div>
//                                                     <h5 className="text-sm font-medium text-gray-800">{tool.name}</h5>
//                                                     <p className="text-gray-600 text-xs mt-0.5">{tool.description}</p>
//                                                 </div>
//                                                 <button
//                                                     onClick={() => handleGoToToolDetails(tool as ToolWithUniqueId)}
//                                                     className="ml-4 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1.5 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                                                 >
//                                                     View Tool
//                                                 </button>
//                                             </div>
//                                         )
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


'use client';

import React, { useState } from 'react';
import type { Tool } from "@/types/tool"; // Make sure this path is correct
import { useRouter } from 'next/navigation';
import {useAuth} from "@/contexts/auth-context"; // Make sure this path is correct
import {showLoginModal} from "@/lib/auth-events"; // Make sure this path is correct

// Define the interface for an Automated Task based on your API response
// and how it's used in this component.
// Note: 'id', 'title', 'impactPercentage', 'impactDescription' are derived
// or added during mapping in JobImpactDetailsPage.
interface AutomatedTask {
    name: string; // Corresponds to task.name from your JSON
    ai_impact_score: string; // Corresponds to task.ai_impact_score from your JSON
    tools?: TaskApiTool[]; // Matches the 'tools' array structure from your JSON
    // Additional properties expected by the card, derived in the parent:
    id: string; // Derived, e.g., from task.name for React key and expansion
    title: string; // Derived, same as name
    impactPercentage: number; // Derived, parsed from ai_impact_score
    impactDescription: string; // Derived/generic
}

// Define the interface for a tool within the tasks array from your API
interface TaskApiTool {
    name: string;
    logo_url: string;
    // Add other fields here if your API provides them and they are relevant
    // for the Tool type or for navigation, e.g., 'unique_id', 'slug', 'description'
}

// Extend the base Tool type for navigation, ensuring it has necessary fields
// This is used for `handleGoToToolDetails` to provide robust navigation.
interface ToolForNavigation extends Tool {
    unique_id?: string; // Optional, ideally provided by API for direct navigation
    slug?: string; // Optional, alternative identifier for navigation
    // The base 'Tool' type should ideally have 'link' and 'description'
}


interface TasksBeingAutomatedCardProps {
    tasks: AutomatedTask[];
}

export default function TasksBeingAutomatedCard({ tasks }: TasksBeingAutomatedCardProps) {
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const { pathname } = router;

    const toggleExpand = (taskId: string) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const handleGoToToolDetails = (tool: ToolForNavigation) => {
        // We prioritize unique_id or slug for robust routing.
        // If not available, fall back to name, but log a warning.
        const toolIdentifier = tool.unique_id || tool.slug || tool.name;

        if (!toolIdentifier) {
            console.error('Tool is missing a suitable identifier for navigation (unique_id, slug, or name):', tool);
            // Optionally, show a toast or message to the user
            return;
        }

        const toolPath = `/tools/${encodeURIComponent(toolIdentifier)}`;

        if (!isAuthenticated) {
            showLoginModal(pathname, () => {
                router.push(toolPath);
            });
        } else {
            router.push(toolPath);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tasks Being Automated</h2>
            <div>
                {tasks.length === 0 && (
                    <p className="text-gray-600">No specific tasks identified for automation for this job role yet.</p>
                )}

                {tasks.map((task) => (
                    // Using task.id which is generated in the parent component's mapping
                    <div key={task.id} className="border-b border-gray-200 last:border-b-0 py-4">
                        <button
                            className="flex justify-between items-center w-full text-left"
                            onClick={() => toggleExpand(task.id)}
                            aria-expanded={expandedTaskId === task.id}
                            aria-controls={`task-content-${task.id}`}
                        >
                            <div className="flex-grow pr-4">
                                <h3 className="text-lg font-semibold text-gray-700">{task.title}</h3>
                                <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                    {task.impactPercentage}% Impact
                                </span>
                                {/* Display impactDescription if available. This is derived in the parent. */}
                                {task.impactDescription && <p className="text-gray-600 text-sm mt-1">{task.impactDescription}</p>}
                            </div>
                            <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {expandedTaskId === task.id && (
                            <div id={`task-content-${task.id}`} className="mt-4 animate-fade-in">
                                {task.tools && task.tools.length > 0 ? (
                                    <>
                                        <h4 className="text-md font-semibold text-gray-700 mb-3">AI Tools Automating This Task:</h4>
                                        <div className="space-y-3">
                                            {task.tools.map((tool) => (
                                                // Ensure we have a unique key for the tool.
                                                // If your TaskApiTool from the API doesn't have an 'id',
                                                // consider using a combination like tool.name and index for the key
                                                // if names are not guaranteed unique within a task.
                                                // However, for navigation, we need unique_id/slug.
                                                <div key={tool.name} className="bg-gray-50 p-3 rounded-md border border-gray-100 flex justify-between items-center">
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-800">{tool.name}</h5>
                                                        {/* The original API JSON for nested tools does not have a 'description'.
                                                            This will only show if your Tool type and mapping provide it. */}
                                                        {(tool as Tool).description && <p className="text-gray-600 text-xs mt-0.5">{(tool as Tool).description}</p>}
                                                    </div>
                                                    <button
                                                        // Cast to ToolForNavigation to ensure type safety for handleGoToToolDetails
                                                        onClick={() => handleGoToToolDetails(tool as ToolForNavigation)}
                                                        className="ml-4 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1.5 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                    >
                                                        View Tool
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-gray-600 text-sm mt-3">No specific AI tools identified for this task yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}