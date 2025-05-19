// components/ToolListItem.tsx
"use client";

import {ExternalLink} from "lucide-react";

import {Tool} from "@/types/tool";
import {LogoAvatar} from "@/components/LogoAvatar";
import {setDisplayCarriers, setDisplayCategories, useResponsiveLimit} from "@/lib/reusable_assets";

interface JobListItemProps {
    carrier: string;
    onClick: () => void;
}

export const JobListItem = ({carrier, onClick}: JobListItemProps) => {




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
                    <div className="text-gray-500 text-xs flex items-center pt-5 pr-5"> 1000 </div>


                    <div className="flex items-center justify-center h-10 w-10 rounded-md bg-purple-50 text-purple-600">
                          <div
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                            <LogoAvatar logoUrl={carrier} name={carrier}/>
                        </div>
                    </div>

                    <div className="flex flex-col items-start flex-1 min-w-0">
                        <h4 className="text-sm font-medium truncate">
                            {carrier}
                        </h4>
                        {/*<div className="text-xs text-gray-500 text-left">*/}
                        {/*    {displayDescription}*/}
                        {/*</div>*/}
                    </div>
                </div>

{/*                <div className="flex items-center space-x-2 shrink-0">*/}
{/*<span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">*/}
{/*{tool.carriers &&*/}


{/*tool.carriers.length > 0*/}
{/*    ? setDisplayCarriers(tool.carriers, limit)*/}
{/*    : setDisplayCategories(tool.categories, limit)*/}
{/*}*/}
{/*</span>*/}
{/*                    <ExternalLink className="text-gray-400 hover:text-gray-600 w-4 h-4 cursor-pointer shrink-0"/>*/}
{/*                </div>*/}
            </div>
        </div>
    );
};

