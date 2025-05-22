import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {useEffect, useState} from "react";

export const robotSvg = <svg width="35" height="36" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="0.5" width="35" height="35" rx="17.5" fill="url(#paint0_linear_535_10088)" fillOpacity="0.2"/>
    <path d="M18 12.5V8.5H14" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path
        d="M24 12.5H12C10.8954 12.5 10 13.3954 10 14.5V22.5C10 23.6046 10.8954 24.5 12 24.5H24C25.1046 24.5 26 23.6046 26 22.5V14.5C26 13.3954 25.1046 12.5 24 12.5Z"
        stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 18.5H10" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 18.5H28" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 17.5V19.5" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 17.5V19.5" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
        <linearGradient id="paint0_linear_535_10088" x1="17.5" y1="0.5" x2="24.5" y2="32.5"
                        gradientUnits="userSpaceOnUse">
            <stop stopColor="#9333EA"/>
            <stop offset="1" stopColor="#C084FC"/>
        </linearGradient>
    </defs>
</svg>;


export const logoSvg = <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M8.25525 15.75H7.20375C4.515 15.75 3.171 15.75 2.3355 14.8988C1.5 14.0475 1.5 12.6773 1.5 9.9375C1.5 7.19775 1.5 5.8275 2.3355 4.97625C3.171 4.125 4.515 4.125 7.20375 4.125H10.056C12.7448 4.125 14.0895 4.125 14.925 4.97625C15.5677 5.631 15.7155 6.59325 15.75 8.25"
        stroke="#7E22CE" stroke-linecap="round" stroke-linejoin="round"/>
    <path
        d="M15.0128 15.0173L16.5 16.5M12 4.125L11.925 3.8925C11.5537 2.7375 11.3685 2.16 10.9268 1.83C10.4843 1.5 9.89775 1.5 8.7225 1.5H8.52525C7.3515 1.5 6.76425 1.5 6.3225 1.83C5.88 2.16 5.69475 2.7375 5.3235 3.8925L5.25 4.125M15.7897 13.1445C15.7957 12.7934 15.7316 12.4447 15.6014 12.1186C15.4711 11.7925 15.2772 11.4957 15.031 11.2453C14.7848 10.9949 14.4913 10.7961 14.1674 10.6604C13.8436 10.5246 13.496 10.4547 13.1449 10.4547C12.7937 10.4547 12.4461 10.5246 12.1223 10.6604C11.7985 10.7961 11.5049 10.9949 11.2587 11.2453C11.0125 11.4957 10.8187 11.7925 10.6884 12.1186C10.5581 12.4447 10.4941 12.7934 10.5 13.1445C10.5117 13.8383 10.7955 14.4996 11.2902 14.9861C11.785 15.4726 12.451 15.7452 13.1449 15.7452C13.8387 15.7452 14.5048 15.4726 14.9995 14.9861C15.4943 14.4996 15.7781 13.8383 15.7897 13.1445Z"
        stroke="#7E22CE" stroke-linecap="round" stroke-linejoin="round"/>
</svg>;


export const setDisplayCategories = (
    categories?: any,
    limit: number = 15,
) => {
    const categoryName = categories && categories.length > 0
        ? (categories[0]?.name === "AI Tools" ? categories[1]?.name : categories[0]?.name)
        : "AI Tools";

    return categoryName ? (categoryName.length > limit ? categoryName.slice(0, limit) + '...' : categoryName) : "AI Tools";
};


// utils/display.ts
export const setDisplayCarrier = (
    carriers: string[] | null | undefined,
    limit: number = 20
): string => {
    // Handle empty/undefined cases
    if (!carriers || carriers.length === 0) {
        return "";
        // return "No carrier";
    }

    // Get the first carrier name
    const firstCarrier = carriers[0];

    // Apply length limit
    return firstCarrier.length > limit
        ? `${firstCarrier.substring(0, limit)}...`
        : firstCarrier;
};


//for multiple display
export const setDisplayCarriersMultiple = (
    carriers: string[] | null | undefined,
    limit: number = 20
): string[] => { // <-- Function now returns an array of strings
    // If no carriers are provided, return an array with "AI Tools"
    if (!carriers || carriers.length === 0) {
        return ["AI Tools"];
    }

    // Get the first 5 carriers
    const displayedCarriers = carriers.slice(0, 5);

    // Format each carrier name, applying the length limit
    const formattedCarriers = displayedCarriers.map(carrier =>
        carrier.length > limit
            ? `${carrier.substring(0, limit)}...`
            : carrier
    );

    return formattedCarriers;
};


// lib/reusable_assets.ts or wherever you keep utility functions

export const formatDescription = (
    generatedDescription?: string | null | undefined,
    description?: string | null | undefined,
    sliceLength: number, // The maximum number of characters to display
    ellipsisLength: number, // The original length threshold to add "..."
): string => {
    // Prioritize generatedDescription if it exists, otherwise use description
    const sourceDescription = generatedDescription || description;

    // If no description source is available, return an empty string
    if (!sourceDescription) {
        return '';
    }

    // Apply slicing
    const slicedDescription = sourceDescription.substring(0, sliceLength);

    // Determine if ellipsis is needed based on the original source length
    const needsEllipsis = sourceDescription.length > ellipsisLength;

    // Return the sliced description with ellipsis if necessary
    return slicedDescription + (needsEllipsis ? '...' : '');
};

// You can then use this function in your components like setDisplayCategories


export const useResponsiveLimit = () => {
    const [limit, setLimit] = useState(window.innerWidth > 768 ? 20 : 10);

    useEffect(() => {
        const handleResize = () => {
            setLimit(window.innerWidth > 768 ? 20 : 10);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return limit;
};