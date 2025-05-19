import React, { useState } from 'react';
import type { Tool } from "@/types/tool";
import { useRouter } from 'next/navigation';
import {useAuth} from "@/contexts/auth-context";
import {showLoginModal} from "@/lib/auth-events";
// Assuming you have a hook or context for auth status and login modal


interface AutomatedTask {
    id: string;
    title: string;
    impactPercentage: number;
    impactDescription: string;
    aiTools: Tool[];
}

interface TasksBeingAutomatedCardProps {
    tasks: AutomatedTask[];
}

interface ToolWithUniqueId extends Tool {
    unique_id: string;
    url?: string;
}

export default function TasksBeingAutomatedCard({ tasks }: TasksBeingAutomatedCardProps) {
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const { pathname } = router;

    const toggleExpand = (taskId: string) => {
        setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    };

    const handleGoToToolDetails = (tool: ToolWithUniqueId) => {
        if (!tool.unique_id) {
            console.error('Tool is missing unique_id:', tool);
            return;
        }
        if (!isAuthenticated) {
            showLoginModal(pathname, () => {
                router.push(`/tools/${encodeURIComponent(tool.unique_id)}`);
            });
        } else {
            router.push(`/tools/${encodeURIComponent(tool.unique_id)}`);
        }
    };

    return (
        // Added max-w-2xl here
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tasks Being Automated</h2>
            <div>
                {tasks.map((task) => (
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
                                <p className="text-gray-600 text-sm mt-1">{task.impactDescription}</p>
                            </div>
                            <svg className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {expandedTaskId === task.id && (
                            <div id={`task-content-${task.id}`} className="mt-4 animate-fade-in">
                                <h4 className="text-md font-semibold text-gray-700 mb-3">AI Tools Automating This Task:</h4>
                                <div className="space-y-3">
                                    {task.aiTools.map((tool) => (
                                        (tool as ToolWithUniqueId).unique_id && (
                                            <div key={tool.id} className="bg-gray-50 p-3 rounded-md border border-gray-100 flex justify-between items-center">
                                                <div>
                                                    <h5 className="text-sm font-medium text-gray-800">{tool.name}</h5>
                                                    <p className="text-gray-600 text-xs mt-0.5">{tool.description}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleGoToToolDetails(tool as ToolWithUniqueId)}
                                                    className="ml-4 flex-shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1.5 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                                >
                                                    View Tool
                                                </button>
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}