'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface LargeBreadcrumbProps {
    isFromCategoryPage?: boolean;
    isFromHomePage?: boolean;
}

export default function LargeBreadcrumb({
                                            isFromCategoryPage,
                                            isFromHomePage,
                                        }: LargeBreadcrumbProps) {
    const fromCategory = !!isFromCategoryPage;
    const fromHome = !!isFromHomePage;

    let label = 'Home';
    let path = '/';

    if (fromCategory && !fromHome) {
        label = 'Categories';
        path = '/categories';
    }

    console.log({
        isFromCategoryPage,
        isFromHomePage,
        fromCategory,
        fromHome,
        label,
        path,
    });

    return (
        <div className="mb-6">
            <Link
                href={path}
                className="inline-flex items-center text-[#a855f7] dark:text-purple-400 hover:text-[#9333ea] dark:hover:text-purple-300"
            >
                <ArrowLeft className="mr-2 h-5 w-5" />
                {`Back to ${label}`}
            </Link>
        </div>
    );
}
