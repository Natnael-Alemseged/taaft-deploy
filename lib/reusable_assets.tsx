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


    export const automatedPotentialSvg=<svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="0.659912" width="44" height="44" rx="22" fill="#F3E8FF"/>
        <path d="M30.3337 22.66H28.267C27.9028 22.6592 27.5484 22.7777 27.2579 22.9975C26.9675 23.2172 26.757 23.526 26.6587 23.8767L24.7003 30.8433C24.6877 30.8866 24.6614 30.9246 24.6253 30.9517C24.5893 30.9787 24.5454 30.9933 24.5003 30.9933C24.4552 30.9933 24.4114 30.9787 24.3753 30.9517C24.3393 30.9246 24.3129 30.8866 24.3003 30.8433L19.7003 14.4767C19.6877 14.4334 19.6614 14.3954 19.6253 14.3683C19.5893 14.3413 19.5454 14.3267 19.5003 14.3267C19.4552 14.3267 19.4114 14.3413 19.3753 14.3683C19.3393 14.3954 19.3129 14.4334 19.3003 14.4767L17.342 21.4433C17.244 21.7926 17.0348 22.1004 16.746 22.32C16.4573 22.5396 16.1048 22.659 15.742 22.66H13.667" stroke="#9333EA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>;

    export const taskAffectedSvg=<svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="0.659912" width="44" height="44" rx="22" fill="#F3E8FF"/>
        <path d="M24.4997 14.3267H16.9997C16.5576 14.3267 16.1337 14.5023 15.8212 14.8148C15.5086 15.1274 15.333 15.5513 15.333 15.9933V29.3267C15.333 29.7687 15.5086 30.1926 15.8212 30.5052C16.1337 30.8177 16.5576 30.9933 16.9997 30.9933H26.9997C27.4417 30.9933 27.8656 30.8177 28.1782 30.5052C28.4907 30.1926 28.6663 29.7687 28.6663 29.3267V18.4933L24.4997 14.3267Z" stroke="#9333EA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.667 14.3267V17.66C23.667 18.102 23.8426 18.5259 24.1551 18.8385C24.4677 19.1511 24.8916 19.3267 25.3337 19.3267H28.667" stroke="#9333EA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20.3337 20.1599H18.667" stroke="#9333EA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M25.3337 23.4932H18.667" stroke="#9333EA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M25.3337 26.8267H18.667" stroke="#9333EA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>;

    export const jobImpactAiToolsSvg=<svg width="44" height="45" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="0.659912" width="44" height="44" rx="22" fill="#F3E8FF"/>
        <path d="M22 19.3267C26.1421 19.3267 29.5 18.2074 29.5 16.8267C29.5 15.4459 26.1421 14.3267 22 14.3267C17.8579 14.3267 14.5 15.4459 14.5 16.8267C14.5 18.2074 17.8579 19.3267 22 19.3267Z" stroke="#9333EA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.5 16.8267V28.4933C14.5 29.1564 15.2902 29.7923 16.6967 30.2611C18.1032 30.7299 20.0109 30.9933 22 30.9933C23.9891 30.9933 25.8968 30.7299 27.3033 30.2611C28.7098 29.7923 29.5 29.1564 29.5 28.4933V16.8267" stroke="#9333EA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.5 22.6599C14.5 23.323 15.2902 23.9588 16.6967 24.4277C18.1032 24.8965 20.0109 25.1599 22 25.1599C23.9891 25.1599 25.8968 24.8965 27.3033 24.4277C28.7098 23.9588 29.5 23.323 29.5 22.6599" stroke="#9333EA" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
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