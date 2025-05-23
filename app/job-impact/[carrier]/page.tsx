
'use client';

import Head from 'next/head';
import Link from 'next/link';
// import Image from 'next/image'; // Removed as it's not used

import InfoCard from '@/components/job-impact-components/tool-info-card';
import AiImpactAnalysisCard from '@/components/job-impact-components/ai-impact-analysis-card';
import TasksBeingAutomatedCard from '@/components/job-impact-components/tasks-being-automated-card';
import AdaptationStrategiesCard from '@/components/job-impact-components/adoption-strategies-card';
import FeaturedJobImpact from '@/components/job-impact-components/featured-job-impact';

import type { Tool } from '@/types/tool';
import {ChevronLeft} from "lucide-react";

import {useCarriers, useFeaturedTools} from '@/hooks/use-tools';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import {automatedPotentialSvg, jobImpactAiToolsSvg, robotSvg, taskAffectedSvg} from "@/lib/reusable_assets"; // Add useParams




const staticInfoCardData = {
    automationPotential: {
        icon: automatedPotentialSvg,
        value: '60%',
        headerText: 'Automation Potential',
        bodyText: 'Percentage of job tasks that can be automated by AI',
    },
    tasksAffected: {
        icon: taskAffectedSvg,
        value: '12',
        headerText: 'Tasks Affected',
        bodyText: 'Number of key job tasks impacted by AI',
    },
    aiTools: {
        icon: jobImpactAiToolsSvg,
        value: '18',
        headerText: 'AI Tools',
        bodyText: 'AI solutions currently impacting this role',
    },
};

const staticAiImpactAnalysisData = {
    aiImpactLevelPercentage: 60,
    aiImpactSummary: 'This role is experiencing significant transformation due to AI technologies.',
    aiDetailedImpact: 'AI coding assistants are automating routine code generation and testing. Junior positions focused solely on implementation are most at risk, while architects and those managing complex systems remain valuable.',
};



// This simulates the structure of a single task object
// that the TasksBeingAutomatedCard component expects.
interface StaticAutomatedTask {
    id: string;
    title: string;
    impactPercentage: number;
    impactDescription: string;
    aiTools: Tool[];
}

// This is the static data array that directly matches what
// TasksBeingAutomatedCard is designed to receive.




const staticFeaturedToolsData: Tool[] = [
    { id: 'ft-tool1', unique_id: 'ft-tool1-unique', name: 'AI Image Creator', description: 'Generate stunning images from text descriptions using advanced AI models.', link: '#',
        keywords: ['Image Generation', 'Premium', 'Marketing', 'Design', 'Content'],
        logo_url: '', slug: '', generated_description: '', carriers: [], categories: [], feature_list: [], pricing: 'Premium', hasFreeVersion: false, contactName: '', contactEmail: '', createdAt: '', updated_at: '', status: 'approved',
    },
    { id: 'ft-tool2', unique_id: 'ft-tool2-unique', name: 'AI Image Creator', description: 'Generate stunning images from text descriptions using advanced AI models.', link: '#',
        keywords: ['Image Generation', 'Premium', 'Marketing', 'Design', 'Content'],
        logo_url: '', slug: '', generated_description: '', carriers: [], categories: [], feature_list: [], pricing: 'Premium', hasFreeVersion: false, contactName: '', contactEmail: '', createdAt: '', updated_at: '', status: 'approved',
    },
    { id: 'ft-tool3', unique_id: 'ft-tool3-unique', name: 'AI Image Creator', description: 'Generate stunning images from text descriptions using advanced AI models.', link: '#',
        keywords: ['Image Generation', 'Premium', 'Marketing', 'Design', 'Content'],
        logo_url: '', slug: '', generated_description: '', carriers: [], categories: [], feature_list: [], pricing: 'Premium', hasFreeVersion: false, contactName: '', contactEmail: '', createdAt: '', updated_at: '', status: 'approved',
    },
];
export default function JobImpactDetailsPage() {
    const router = useRouter();
    const params = useParams(); // Use useParams for dynamic route segments
    const carrier = params.carrier as string | undefined; // Cast to string | undefined for type safety

    // Use the useCarriers hook
    const { data: carrierDetail, isLoading, isError, error } = useCarriers(carrier || undefined); // Pass undefined if carrier is null
    const { data:featuredData
        // , isFeaturedLoading, isFeaturedError
    } = useFeaturedTools(3)
    // const jobTitle = 'Software Engineer';
    // const jobCategory = "Software Development";
    // const jobRisk = "Medium Risk";




    // ---
    // Loading, Error, and Data Handling
    // ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
                <p className="text-[#6b7280]">Loading job impact analysis...</p>
            </div>
        );
    }

    // if (isError) {
    //     return (
    //         <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
    //             <p className="text-red-500">Error loading job details: {error?.message || 'Unknown error'}</p>
    //         </div>
    //     );
    // }
    //
    // // If carrierDetail is null or undefined (e.g., if no data was found for the carrier)
    // if (!carrierDetail) {
    //     return (
    //         <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
    //             <p className="text-[#6b7280]">No job impact analysis found for this carrier.</p>
    //         </div>
    //     );
    // }



    const jobTitle = carrierDetail?.job_title ?? 'Software Engineer';
    const jobCategory = carrierDetail?.job_category??'Software Development';


    function getRiskCategory(aiImpactScore: string): string {
        const score = parseFloat(aiImpactScore.replace('%', ''));

        if (score <= 40) {
            return "Low Risk";
        } else if (score <= 75) {
            return "Medium Risk";
        } else {
            return "High Risk";
        }
    }


    function countUniqueTools(data: any): number {
        if (!data || !Array.isArray(data.tasks)) {
            return 10;
        }

        const toolsSet = new Set<string>();

        data.tasks.forEach(task => {
            if (Array.isArray(task.tools)) {
                task.tools.forEach(tool => {
                    if (tool?.name) {
                        toolsSet.add(tool.name);
                    }
                });
            }
        });

        return toolsSet.size;
    }
    const tasksBeingAutomatedData = (carrierDetail?.tasks || []).map(task => {
        const taskName = task?.name || 'unnamed-task';
        const impactScore = task?.ai_impact_score?.replace('%', '') || '0';

        return {
            id: taskName.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, ''),
            title: taskName,
            impactPercentage: parseFloat(impactScore),
            impactDescription: `AI can significantly impact ${taskName.toLowerCase()} tasks.`,

            aiTools: (task?.tools || []).map(apiTool => {
                const toolName = apiTool?.name || 'unnamed-tool';
                const slugified = toolName.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');

                return {
                    id: slugified,
                    unique_id: slugified,
                    slug: slugified,

                    name: toolName,
                    logo_url: apiTool?.logo_url || '',

                    description: `A tool for ${toolName.toLowerCase()}.`,
                    link: '#',

                    keywords: [],
                    generated_description: '',
                    carriers: [],
                    categories: [],
                    feature_list: [],
                    pricing: 'Unknown',
                    hasFreeVersion: false,
                    contactName: '',
                    contactEmail: '',
                    createdAt: '',
                    updated_at: '',
                    status: 'approved',
                };
            })
        };
    });


    const uniqueToolCount = countUniqueTools(carrierDetail);

    return (
        <div className="min-h-screen bg-[#f9fafb]">
            <main className="container mx-auto px-4 py-6">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                    <div className="flex items-center text-sm text-[#6b7280] mb-4">
                        <Link href="/" className="flex items-center hover:text-[#4b5563]">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Search
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href="/" className="hover:text-[#4b5563]">
                            Job Impact Analysis
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-[#374151]">{jobTitle}</span>
                    </div>
                </div>

                {/* Main Content Grid - Larger Content (2/3) and Featured (1/3) */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Larger Content Column (2/3 width) */}
                    <div className="lg:w-2/3">
                        {/* Wrapper for the entire left column's content (the "MainCard" look) */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            {/* Job Header (This section remains left-aligned as it's a header) */}
                            <div className="flex items-start mb-4">
                                <div className="bg-[#f3e8ff] p-3 rounded-lg mr-4">
                                    <div className="text-[#7e22ce] text-2xl">💼</div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-[#111827]">{jobTitle}</h1>
                                    <p className="text-[#6b7280]">{jobCategory}</p>
                                </div>
                                <div className="ml-auto bg-[#fffbeb] text-[#d97706] px-3 py-1 rounded-full text-sm font-medium">
                                    {carrierDetail&& getRiskCategory(carrierDetail.ai_impact_score)}
                                </div>
                            </div>


                            {/* We maintain the grid, but remove the max-width to let it expand */}
                            <div className="mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
                                    <InfoCard
                                        icon={staticInfoCardData.automationPotential.icon}
                                        headerText={staticInfoCardData.automationPotential.headerText}
                                        value={carrierDetail?.ai_impact_score ?? staticInfoCardData.automationPotential.value}
                                        bodyText={staticInfoCardData.automationPotential.bodyText}
                                        className="w-full"  // Add this to each InfoCard if needed
                                    />
                                    <InfoCard
                                        icon={staticInfoCardData.tasksAffected.icon}
                                        headerText={staticInfoCardData.tasksAffected.headerText}
                                        value={carrierDetail?.tasks.length ?? staticInfoCardData.tasksAffected.value}
                                        bodyText={staticInfoCardData.tasksAffected.bodyText}
                                        className="w-full"  // Add this to each InfoCard if needed
                                    />
                                    <InfoCard
                                        icon={staticInfoCardData.aiTools.icon}
                                        headerText={staticInfoCardData.aiTools.headerText}
                                        value={String(uniqueToolCount)} // inject the computed value
                                        bodyText={staticInfoCardData.aiTools.bodyText}
                                        className="w-full"  // Add this to each InfoCard if needed
                                    />
                                </div>
                            </div>

                            {/* AI Impact Analysis - Now takes full width of its container */}
                            {/* Removed flex justify-end from this wrapper and added w-full */}
                            <div className="mb-8 w-full">
                                <AiImpactAnalysisCard
                                    impact={{
                                        aiImpactLevelPercentage: carrierDetail?.ai_impact_score ?? staticAiImpactAnalysisData.aiImpactLevelPercentage,
                                        aiImpactSummary: carrierDetail?.ai_impact_summary ??staticAiImpactAnalysisData.aiImpactSummary,
                                        aiDetailedImpact:carrierDetail?.detailed_analysis ?? staticAiImpactAnalysisData.aiDetailedImpact
                                    }}
                                />
                            </div>

                            {/* Tasks Being Automated - Now takes full width of its container */}
                            {/* Removed flex justify-end from this wrapper and added w-full */}
                            <div className="mb-8 w-full">
                                <TasksBeingAutomatedCard tasks={ carrierDetail?.tasks
                                    ??tasksBeingAutomatedData
                                }
                                />
                            </div>


                        </div>
                    </div>

                    {/* Featured Column (1/3 width) - Content remains as is */}
                    <div className="lg:w-1/3">
                        {/* Wrapper for the featured column's content (the "MainCard" look) */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-[#111827] mb-4">Featured Tools</h2>
                            <FeaturedJobImpact tools={
                                // featuredData&&
                                Array.isArray(featuredData?.tools) ? featuredData?.tools : staticFeaturedToolsData} jobName={carrier}/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}