import React from 'react';
import Image from "next/image";
import {Banknote} from "lucide-react";

interface ToolInfoCardProps {
    icon: string;
    value?: string | number;
    headerText: string;
    bodyText: string;
}

const InfoCard: React.FC<ToolInfoCardProps> = ({ icon, value, headerText, bodyText }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-3 text-center max-w-sm mx-auto border border-gray-200">
            <div className="flex justify-center mb-4">
                <div className="bg-purple-100 rounded-full p-3 inline-block">
                    {/*<img src={icon} alt="Info Icon" className="w-8 h-8" />*/}
                    {/*<img src={icon} alt="Info Icon" className="w-8 h-8" />*/}

                    {/*{icon ? (*/}
                    {/*    <Image*/}
                    {/*        src={icon}*/}
                    {/*        alt={`${'category'} Category Icon`}*/}
                    {/*        width={40}*/}
                    {/*        height={40}*/}
                    {/*        className="object-contain"*/}
                    {/*    />*/}
                    {/*) : (*/}
                        <Banknote className="text-purple-600 w-6 h-6" />
                    {/*)}*/}
                </div>
            </div>

            {value && (
                <div className="text-xl font-bold text-gray-800 mb-2">
                    {value}
                </div>
            )}

            <div className="text-md font-semibold text-gray-700 mb-2">
                {headerText}
            </div>

            <div className="text-gray-500 text-xs">
                {bodyText}
            </div>
        </div>
    );
};

export default InfoCard;