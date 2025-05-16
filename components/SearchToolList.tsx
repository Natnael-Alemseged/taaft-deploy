// components/ToolListItem.tsx
"use client";

import { ExternalLink } from "lucide-react";

import { Tool } from "@/types/tool";
import {LogoAvatar} from "@/components/LogoAvatar";
import {setDisplayCarriers, setDisplayCategories} from "@/lib/reusable_assets";

interface SearchToolListItemProps {
    tool: Tool;
    onClick: () => void;
}

export const SearchToolListItem = ({ tool, onClick }: SearchToolListItemProps) => {
    const sourceDescription = tool.generated_description || tool.description;
    const displayDescription = sourceDescription
        ? `${sourceDescription.slice(0, 50)}${sourceDescription.length > 70 ? '...' : ''}`
        : '';

    return (
        <div
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-50 text-purple-600">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                            <LogoAvatar logoUrl={tool.logo_url} name={tool.name} />
                        </div>
                    </div>

                    <div className="flex flex-col items-start flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                            {tool.name.length > 35 ? `${tool.name.substring(0, 35)}...` : tool.name}
                        </h4>
                        <div className="text-xs text-gray-500 text-left">
                            {displayDescription}
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">
            {setDisplayCarriers(tool.carriers, 10)}
          </span>
                    <ExternalLink className="text-gray-400 hover:text-gray-600 w-4 h-4 cursor-pointer shrink-0" />
                </div>
            </div>
        </div>
    );
};