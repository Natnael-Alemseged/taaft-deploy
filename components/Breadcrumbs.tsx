"use client";

import Link from "next/link";

interface Breadcrumb {
    name: string;
    path?: string; // path is optional to support current/last item
}

interface BreadcrumbsProps {
    items: Breadcrumb[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center text-sm mb-6 text-[#6b7280]">
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {item.path ? (
                        <Link href={item.path} className="hover:underline">
                            {item.name}
                        </Link>
                    ) : (
                        <span>{item.name}</span>
                    )}
                    {index < items.length - 1 && (
                        <span className="mx-2">{">"}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
