// app/browse/page.tsx
// NO "use client" HERE - This is a Server Component

import React from 'react';
import { Metadata } from 'next';
// Import the client component that will handle the UI and client-side logic
import BrowseToolsClientContent from "@/components/BrowseToolsClientContent";

// Define metadata for better SEO
export const metadata: Metadata = {
  title: 'Browse AI Tools | TAAFT',
  description: 'Discover and compare the best AI tools for your needs.',
};

// This is your Server Component Page
export default async function BrowseToolsPage() {
  // Server components can fetch data here if needed for initial render,
  // but in this case, your data fetching is entirely client-side using hooks.
  // So, we just render the client component.

  return (
      <>
        {/* You can place any server-rendered layout elements here if needed */}
        {/* Headers/footers are often in root layout (app/layout.tsx) */}

        {/* Render the Client Component */}
        {/* All state, effects, and client-side rendering logic live here */}
        <BrowseToolsClientContent />

        {/* Any other static server-rendered elements */}
      </>
  );
}