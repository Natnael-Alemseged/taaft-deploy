// components/ToolListItem.tsx
"use client";

import {ExternalLink} from "lucide-react";

import {Tool} from "@/types/tool";
import {LogoAvatar} from "@/components/LogoAvatar";
import {setDisplayCarrier, setDisplayCategories, useResponsiveLimit} from "@/lib/reusable_assets";

interface JobListItemProps {
    carrier: string;
    onClick: () => void;
}

export const JobListItem = ({carrier, onClick}: JobListItemProps) => {




    return (
        <div
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center" // removed justify-center
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            <div className="flex items-center space-x-4">
                {/*<div className="text-gray-500 text-xs flex items-center">1000</div>*/}

                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-50 text-purple-600">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                        <LogoAvatar logoUrl={carrier} name={carrier} isLogo={true} />
                    </div>
                </div>

                <div className="flex flex-col items-start min-w-0 text-left">
                    <h4 className="text-sm font-medium truncate">{carrier}</h4>
                    {/* <div className="text-xs text-gray-500">{displayDescription}</div> */}
                </div>
            </div>
        </div>

    );
};

