import React from 'react';
// Assuming your ToolCard component is here
import ToolCard from "@/components/cards/tool-card";
// Assuming your Tool type is here
import { Tool } from "@/types/tool";

// Define the props for the FeaturedJobImpact component
// It expects a single prop 'tools' which is an array of Tool objects
interface FeaturedJobImpactProps {
    tools: Tool[];
}

// Corrected function signature using the props interface
export default function FeaturedJobImpact({ tools }: FeaturedJobImpactProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-xl mx-auto">
            {/* Card Title - Keeping "Featured Tools" based on the image */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Featured Tools</h2>

            {/* Container for the list of Tool Cards */}
            <div className="space-y-6">
                {/* Map over the tools array and render a ToolCard for each */}
                {tools.map(tool => (
                    // Pass the entire tool object as the 'tool' prop, and use tool.id for the key
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
        </div>
    );
}