"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

// Shared responsive logic
function usePaginationLogic(sponsoredToolsLength: number, totalPages: number) {
    const [isMobile, setIsMobile] = useState(false);
    const [maxPage, setMaxPage] = useState(totalPages);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    useEffect(() => {
        // In mobile view, we show one item per page, so maxPages equals the number of items
        // In desktop view, we use the calculated totalPages (which accounts for itemsPerPage)
        setMaxPage(isMobile ? sponsoredToolsLength : totalPages);
    }, [isMobile, sponsoredToolsLength, totalPages]);

    return { maxPage };
}

// Arrow Navigation Component
export function PaginationArrows({
                                     sponsoredToolsLength,
                                     totalPages,
                                     currentPage,
                                     scroll
                                 }: {
    sponsoredToolsLength: number
    totalPages: number
    currentPage: number
    scroll: (direction: 'left' | 'right') => void
}) {
    const { maxPage } = usePaginationLogic(sponsoredToolsLength, totalPages);

    if (maxPage <= 1) return null;




    return (
        <div className="flex space-x-2">
            <button
                onClick={() => scroll('left')}
                className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 0}
                aria-label="Previous sponsored tool"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            <button
                onClick={() => {
                    scroll('right');
                }}
                className="rounded-full bg-white shadow-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage >= maxPage - 1}
                aria-label="Next sponsored tool"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
}

// Pagination Indicators Component
export function PaginationIndicators({
                                         sponsoredToolsLength,
                                         totalPages,
                                         currentPage,
                                         scrollRef
                                     }: {
    sponsoredToolsLength: number
    totalPages: number
    currentPage: number
    scrollRef: React.RefObject<HTMLDivElement>
}) {
    const { maxPage } = usePaginationLogic(sponsoredToolsLength, totalPages)

    if (maxPage <= 1) return null

    return (
        <div
            className="mt-2 flex justify-center space-x-2"
            role="tablist"
            aria-label="Sponsored Tools Pagination"
        >
            {Array.from({ length: maxPage }).map((_, i) => (
                <button
                    key={i}
                    className={clsx(
                        "h-1.5 transition-all duration-300",
                        currentPage === i ? "w-6 bg-purple-600" : "w-1.5 rounded-full bg-gray-300 opacity-50"
                    )}
                    onClick={() => {
                        if (scrollRef.current) {
                            scrollRef.current.scrollTo({
                                left: i * scrollRef.current.clientWidth,
                                behavior: "smooth"
                            })
                        }
                    }}
                    aria-label={`Go to page ${i + 1}`}
                />
            ))}
        </div>
    )
}