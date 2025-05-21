'use client'
import {useEffect, useState} from "react";
import {Tool} from "@/types/tool";
import ToolCard from "@/components/cards/tool-card";


interface SearchResultsDirectProps {
    initialQuery?: string;
    category?: string;
    source?: string; // To indicate if results are from chat
}

export default function SearchResultDirect({initialQuery, category, source}: SearchResultsDirectProps) {
    const [tools, setTools] = useState<Tool[]>([]);

    useEffect(() => {
        const storedTools = sessionStorage.getItem("searchTools");
        if (storedTools) {
            try {
                const parsedTools = JSON.parse(storedTools);
                setTools(parsedTools);
            } catch (error) {
                console.error("Failed to parse tools from session storage:", error);
            }
        }
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">

            {tools.length === 0 ? (
                <div className="text-center text-gray-500">No tools found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool}

                                  breadcrumbItems={[{name: 'Home', path: '/'},]}
                        />
                    ))}


                </div>
            )}
        </div>
    );
}
