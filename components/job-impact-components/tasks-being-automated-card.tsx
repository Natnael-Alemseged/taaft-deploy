

'use client';

import React, { useState } from 'react';
import type { Tool } from "@/types/tool"; // Make sure this path is correct
import { useRouter } from 'next/navigation';
import {useAuth} from "@/contexts/auth-context"; // Make sure this path is correct
import {showLoginModal} from "@/lib/auth-events";
import {useTaskTools} from "@/hooks/use-tools"; // Make sure this path is correct

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

    const [selectedTaskName, setSelectedTaskName] = useState<string | null>(null);
    const { data: toolsData, isError, isLoading } = useTaskTools(selectedTaskName ?? undefined);

    const toggleExpand = (taskId: string, taskName: string) => {
        const isSame = expandedTaskId === taskId;
        setExpandedTaskId(isSame ? null : taskId);
        setSelectedTaskName(isSame ? null : taskName); // trigger refetch
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

                {tasks.map((task, index) => {
                    const taskId = `${task.name}-${index}`;
                    const isExpanded = expandedTaskId === taskId;
                    const showTools = isExpanded && selectedTaskName === task.name;

                    return (
                        <div key={taskId} className="border-b border-gray-200 last:border-b-0 py-4">
                            <button
                                className="flex justify-between items-center w-full text-left"
                                onClick={() => toggleExpand(taskId, task.name)}
                                aria-expanded={isExpanded}
                                aria-controls={`task-content-${taskId}`}
                            >
                                <div className="flex-grow pr-4">
                                    <h3 className="text-lg font-semibold text-gray-700">{task.name}</h3>
                                    <span className="inline-block bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                        {task.ai_impact_score} Impact
                                    </span>
                                    {task.impactDescription && (
                                        <p className="text-gray-600 text-sm mt-1">{task.impactDescription}</p>
                                    )}
                                </div>
                                <svg
                                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                                        isExpanded ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {isExpanded && (
                                <div id={`task-content-${taskId}`} className="mt-4 animate-fade-in">
                                    {isLoading && <p className="text-sm text-gray-500">Loading tools...</p>}
                                    {isError && <p className="text-sm text-red-500">Failed to load tools.</p>}
                                    {!isLoading && !isError && toolsData && toolsData.length > 0 ? (
                                        <>
                                            <h4 className="text-md font-semibold text-gray-700 mb-3">
                                                AI Tools Automating This Task:
                                            </h4>
                                            <div className="space-y-3">
                                                {toolsData.map((tool) => (
                                                    <div
                                                        key={tool.name}
                                                        className="bg-gray-50 p-3 rounded-md border border-gray-100 flex justify-between items-center"
                                                    >
                                                        <div>
                                                            <h5 className="text-sm font-medium text-gray-800">{tool.name}</h5>
                                                            {(tool as Tool).description && (
                                                                <p className="text-gray-600 text-xs mt-0.5">
                                                                    {(tool as Tool).description.length > 50
                                                                        ? `${(tool as Tool).description.substring(0, 60)}...`
                                                                        : (tool as Tool).description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                handleGoToToolDetails(tool as ToolForNavigation)
                                                            }
                                                            className="ml-4 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1.5 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                        >
                                                            View Tool
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        !isLoading &&
                                        !isError && (
                                            <p className="text-gray-600 text-sm mt-3">
                                                No specific AI tools identified for this task yet.
                                            </p>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}