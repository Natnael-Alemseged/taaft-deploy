import React from 'react';
import { Banknote } from "lucide-react";

interface ToolInfoCardProps {
    icon: React.ReactNode;
    value?: string | number;
    headerText: string;
    bodyText: string;
}

const InfoCard: React.FC<ToolInfoCardProps> = ({ icon, value, headerText, bodyText }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 text-center w-full h-full border border-gray-200 flex flex-col">
            {/* Icon Section */}
            <div className="flex justify-center mb-3">
                <div className="bg-purple-100 rounded-full p-3 flex items-center justify-center">
                    {icon || <Banknote className="text-purple-600 w-6 h-6" />}
                </div>
            </div>

            {/* Value Section */}
            {value && (
                <div className="text-xl font-bold text-gray-800 mb-2">
                    {value}
                </div>
            )}

            {/* Header Text Section */}
            <div className="text-md font-semibold text-gray-700 mb-2">
                {headerText}
            </div>

            {/* Body Text Section - Removed mt-auto and added consistent spacing */}
            <div className="text-gray-500 text-xs px-2">
                {bodyText}
            </div>
        </div>
    );
};

export default InfoCard;