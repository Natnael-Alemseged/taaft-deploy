import React from 'react';

interface AdaptationStrategiesCardProps {
    strategies: string[];
}

export default function AdaptationStrategiesCard({ strategies }: AdaptationStrategiesCardProps) {
    return (
        // Added max-w-2xl here
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Adaptation Strategies</h2>
            <ul className="list-none p-0 m-0 space-y-4">
                {strategies.map((strategy, index) => (
                    <li key={index} className="flex items-start">
                        <div className="flex items-center justify-center w-6 h-6 bg-purple-500 rounded-full text-white text-xs font-bold flex-shrink-0 mt-1 mr-3">
                            {index + 1}
                        </div>
                        <p className="text-gray-700 text-base flex-grow">{strategy}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}