import type { Tool } from "@/types/tool";

interface ToolForAiImpactCard {
    aiImpactLevelPercentage: number;
    aiImpactSummary: string;
    aiDetailedImpact: string;
}

interface AiImpactAnalysisCardProps {
    impact: ToolForAiImpactCard;
}

export default function AiImpactAnalysisCard({ impact }: AiImpactAnalysisCardProps) {
    const { aiImpactLevelPercentage, aiImpactSummary, aiDetailedImpact } = impact;
    const progressBarWidth = `${aiImpactLevelPercentage}%`;
    const progressColor = aiImpactLevelPercentage > 50 ? 'bg-yellow-500' : 'bg-purple-500';

    return (
        // Added max-w-2xl here
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                    <h2 className="text-xl font-semibold text-gray-800">AI Impact Analysis</h2>
                </div>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h6m0 0l3-3m0 3l-3-3m-9 12l9 0m0 0l3 3m0-3l-3 3m-6-4a9 9 0 11-12 0"></path></svg>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">AI Impact Level</span>
                    <span className="text-sm font-bold text-gray-800">{aiImpactLevelPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${progressColor}`} style={{ width: progressBarWidth }}></div>
                </div>
            </div>

            <p className="text-gray-700 text-sm mb-4">{aiImpactSummary}</p>

            <div className="mb-2">
                <h3 className="text-base font-semibold text-gray-800">Detailed Impact</h3>
            </div>
            <p className="text-gray-700 text-sm">{aiDetailedImpact}</p>
        </div>
    );
}