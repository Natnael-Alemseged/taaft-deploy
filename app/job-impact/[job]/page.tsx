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

const staticInfoCardData = {
    automationPotential: {
        icon: '/icons/automation-icon.svg',
        value: '60%',
        headerText: 'Automation Potential',
        bodyText: 'Percentage of job tasks that can be automated by AI',
    },
    tasksAffected: {
        icon: '/icons/tasks-affected-icon.svg',
        value: '12',
        headerText: 'Tasks Affected',
        bodyText: 'Number of key job tasks impacted by AI',
    },
    aiTools: {
        icon: '/icons/ai-tools-icon.svg',
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

const staticTasksBeingAutomatedData = [
    {
        id: 'task-frontend', title: 'Frontend Component Development', impactPercentage: 85,
        impactDescription: 'AI tools can generate entire UI components from descriptions or design references.',
        aiTools: [
            { id: 'durable-t', unique_id: 'durable-unique', name: 'Durable', description: 'AI website builder that generates complete webpages', link: 'https://durable.co/' } as Tool,
            { id: 'galileo-t', unique_id: 'galileo-unique', name: 'Galileo AI', description: 'Creates UI designs from text descriptions', link: 'https://www.usegalileo.ai/' } as Tool,
            { id: 'v0-t', unique_id: 'v0-unique', name: 'V0', description: 'AI design tool that converts sketches to components', link: 'https://v0.dev/' } as Tool,
        ],
    },
    {
        id: 'task-api', title: 'API Integration', impactPercentage: 65,
        impactDescription: 'Automated code generation for API calls and data handling.', aiTools: [] as Tool[],
    },
    {
        id: 'task-refactoring', title: 'Code Refactoring', impactPercentage: 70,
        impactDescription: 'AI can suggest code improvements and perform refactoring automatically.', aiTools: [] as Tool[],
    },
    {
        id: 'task-debugging', title: 'Debugging', impactPercentage: 60,
        impactDescription: 'AI tools can analyze issues and suggest fixes.', aiTools: [] as Tool[],
    },
];

const staticAdaptationStrategiesData: string[] = [
    'Focus on systems architecture and design thinking',
    'Develop expertise in AI/ML integration',
    'Build strong communication and stakeholder management skills',
];

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
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb Navigation */}
            <div className="mb-6 text-sm text-gray-600">
                <Link href="#" className="hover:text-gray-800">← Back to Search</Link>
                <span className="mx-2">/</span>
                <Link href="#" className="hover:text-gray-800">Job Impact Analysis</Link>
                <span className="mx-2">/</span>
                <span className="font-medium">Frontend Developer</span>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content Column (2/3 width) */}
                <div className="md:col-span-2 space-y-6 pl-4 md:pl-8 lg:pl-20"> {/* Reduced space-y-8 to space-y-6 */}
                    {/* Job Header */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-gray-800">Frontend Developer</h1>
                            <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                Medium Risk
              </span>
                        </div>
                        <div className="text-gray-600 text-sm">Software Development</div>
                    </div>


                    {/* Info Cards Grid - Equal Widths */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {Object.values(staticInfoCardData).map((cardData, index) => (
                            <div key={index} className="flex justify-center">
                                <InfoCard {...cardData}  />
                            </div>
                        ))}
                    </div>


                    {/* Content Sections - Now tighter with Featured */}
                    <AiImpactAnalysisCard impact={staticAiImpactAnalysisData} />
                    <TasksBeingAutomatedCard tasks={staticTasksBeingAutomatedData} />
                    <AdaptationStrategiesCard strategies={staticAdaptationStrategiesData} />
                </div>

                {/* Sidebar Column (1/3 width) - Now aligns better with content sections */}
                <div className="md:col-span-1 space-y-6"> {/* Added matching space-y-6 */}
                    <FeaturedJobImpact tools={staticFeaturedToolsData} />
                </div>
            </div>
        </div>
    );
}