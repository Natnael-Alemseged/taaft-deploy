// components/GlossaryClientContent.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
// Assuming Header is part of your layout and not needed *inside* this component
// import Header from "@/components/header"; // Removed if Header is in layout
import Script from "next/script"; // Keep Script if you need client-side scripts for *other* things, but not for the primary schema

import { useAuth } from "@/contexts/auth-context";
import { SignInModal } from "@/components/home/sign-in-modal";

// Import types from your services
import type { GlossaryTerm } from "@/services/glossary-service";
// Import the slugify utility
import { slugify } from "@/lib/utils"; // Adjust import path as necessary

// Define the type for the grouped data
interface GroupedGlossaryData {
  [key: string]: GlossaryTerm[];
}

interface GlossaryClientContentProps {
  groupedGlossaryData: GroupedGlossaryData | null;
  // Add initial loading/error status if passed from the server component
  // isLoadingInitial?: boolean;
  // isErrorInitial?: boolean;
}

export default function GlossaryClientContent({
  groupedGlossaryData,
  // isLoadingInitial, // Example if passing initial status
  // isErrorInitial,
}: GlossaryClientContentProps) {
  // Fetch authentication state using the hook (Client-side only)
  const { isAuthenticated } = useAuth();

  // --- State ---
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // --- Derived State / Memos ---
  const lettersWithContent = useMemo(() => {
    if (!groupedGlossaryData) return [];
    // Get the keys (letters) from the data object and sort them alphabetically
    return Object.keys(groupedGlossaryData).sort();
  }, [groupedGlossaryData]); // Recalculate only when groupedGlossaryData changes

  const allLetters = useMemo(
    () => [
      "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
      "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    ],
    [] // This list is static
  );

  // --- Effects ---

  // Effect to set initial selected letter based on available content
  useEffect(() => {
    if (lettersWithContent.length > 0 && selectedLetter === null) {
      setSelectedLetter(lettersWithContent[0]);
    }
  }, [lettersWithContent, selectedLetter]);

  // Effect for Scroll Logic (Client-side only)
  useEffect(() => {
    // Only attach scroll listener on the client side
    if (typeof window === "undefined" || !lettersWithContent || lettersWithContent.length === 0) {
      return;
    }

    const handleScroll = () => {
      let currentLetter: string | null = null;
      const viewportCenter = window.innerHeight / 2;

      const sections = lettersWithContent
        .map((letter) => document.getElementById(letter))
        .filter((section): section is HTMLElement => section !== null);

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          currentLetter = section.id;
          break;
        }
      }

      // Fallback logic (existing from your code)
      if (currentLetter === null && sections.length > 0) {
         for (const section of sections) {
           const rect = section.getBoundingClientRect();
           if (rect.top > viewportCenter && rect.top < window.innerHeight) {
             currentLetter = section.id;
             break;
           }
         }
      }
      if (currentLetter === null && sections.length > 0) {
         const lastSection = sections[sections.length - 1];
         const rect = lastSection.getBoundingClientRect();
         if (rect.bottom > 0 && rect.top < window.innerHeight) {
           currentLetter = lastSection.id;
         }
      }


      if (currentLetter && lettersWithContent.includes(currentLetter) && currentLetter !== selectedLetter) {
        setSelectedLetter(currentLetter); // Update selected letter
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once on mount

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selectedLetter, lettersWithContent]);


  // Effect for Initial Hash Handling (Client-side only)
  useEffect(() => {
    if (typeof window !== "undefined" && lettersWithContent.length > 0) {
      const hash = window.location.hash.replace("#", "").toUpperCase();
      if (hash && lettersWithContent.includes(hash)) {
        const sectionElement = document.getElementById(hash);
        if (sectionElement) {
          setTimeout(() => {
            sectionElement.scrollIntoView({ behavior: "smooth", block: "center" });
            setSelectedLetter(hash);
          }, 100);
        }
      } else if (selectedLetter === null && lettersWithContent.length > 0) {
         setSelectedLetter(lettersWithContent[0]);
      }
    }
  }, [lettersWithContent, selectedLetter]); // Depend on lettersWithContent and selectedLetter


  // --- Event Handlers ---

  // Function to open the sign-in modal
  const openSignInModal = () => {
    console.log("Opening Sign In Modal");
    setShowLoginPopup(true);
  };

  // Function to close the sign-in modal
  const closeSignInModal = () => {
    console.log("Closing Sign In Modal");
    setShowLoginPopup(false);
  };

  // Click Handler for Letter Navigation (Client-side only)
  const handleLetterClick = (letter: string) => {
    if (lettersWithContent.includes(letter)) {
      if (typeof window !== "undefined") {
        const sectionElement = document.getElementById(letter);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: "smooth", block: "center" });
          window.history.pushState(null, "", `#${letter}`);
          setSelectedLetter(letter); // Update state immediately
          setIsMobileNavOpen(false); // Close mobile nav
        }
      }
    }
  };


  // --- Render Functions ---

  // Function to render a single glossary term card
  const renderTermCard = (term: GlossaryTerm) => (
    <div key={term.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow transition-shadow bg-white dark:bg-gray-800">
      {/* Link to the individual term page */}
      <Link href={`/terms/${slugify(term.id)}`} className="block">
        {/* Top header section */}
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-start justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{term.name}</h3>
          <ChevronRight className="w-4 h-4 text-purple-500 dark:text-purple-400 mt-1" />
        </div>

        {/* Definition text */}
        <div className="px-4 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line mb-4">{term.definition}</p>
          <span className="text-sm text-purple-500 dark:text-purple-400 font-medium inline-flex items-center gap-1">
            Read more <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </div>
  );

  // --- Conditional Rendering (based on data availability) ---
  // Loading/Error states might be handled by the parent Server Component
  // or you can add them here if the initial data prop can be null/undefined

   if (!groupedGlossaryData || lettersWithContent.length === 0) {
       // Handle case where data is not available or empty after passed from server
       // This might show briefly if the server fetched no data, or if there was a server error
       // that resulted in null data being passed.
       return (
         <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center text-gray-600 dark:text-gray-400">
            <p>No glossary terms found or failed to load.</p>
         </div>
       );
   }


  // --- Main Render ---
  return (
    <>
      {/* Header is likely in layout */}
      {/* <Header /> */}

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Schema is handled by the Server Component page.tsx */}
        {/* <Script ... /> */}

        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-white mb-3">AI Tools Glossary</h1>
            <p className="text-sm md:text-base text-[#6b7280] dark:text-gray-400 max-w-2xl mx-auto">
              Explore our comprehensive glossary of AI and machine learning terms to better understand the tools in our
              directory.
            </p>
            {/* Conditionally render the Sign-in Demo button */}
            {!isAuthenticated && (
              <Button
                onClick={openSignInModal}
                className="bg-[#a855f7] hover:bg-[#9333ea] text-white mt-5 text-sm px-4 py-2"
              >
                Sign in Demo
              </Button>
            )}
          </div>

          {/* Mobile Alphabetical Navigation Dropdown */}
          <div className="md:hidden mb-8 relative z-20"> {/* Increased z-index */}
            <Button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              variant="outline"
              className="w-full flex items-center justify-between"
            >
              <span>{selectedLetter ? `Jump to: ${selectedLetter}` : 'Select a letter'}</span>
              {isMobileNavOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
            </Button>
            {isMobileNavOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto grid grid-cols-5 gap-1 p-2">
                {allLetters.map((letter) => {
                  const hasContent = lettersWithContent.includes(letter);
                  const isSelected = selectedLetter === letter;
                  return (
                    <button
                      key={letter}
                      onClick={() => handleLetterClick(letter)}
                      disabled={!hasContent}
                      className={`text-center text-sm px-2 py-1 rounded-md transition-colors ${
                        hasContent
                          ? isSelected
                            ? "bg-[#a855f7] text-white font-semibold"
                            : "text-[#6b7280] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                          : "text-gray-400 dark:text-gray-600 cursor-not-allowed font-normal"
                      }`}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            )}
          </div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Desktop Sidebar - Alphabetical Navigation */}
            <div className="hidden md:block md:col-span-1">
              <div className="sticky top-8">
                <h2 className="font-semibold text-[#111827] dark:text-white mb-4">Contents</h2>
                <div className="space-y-1">
                  {allLetters.map((letter) => {
                    const hasContent = lettersWithContent.includes(letter);
                    const isSelected = selectedLetter === letter;
                    return (
                      <button
                        key={letter}
                        onClick={() => handleLetterClick(letter)}
                        disabled={!hasContent}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          hasContent
                            ? isSelected
                              ? "bg-[#a855f7] text-white font-semibold"
                              : "text-[#6b7280] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                            : "text-gray-400 dark:text-gray-600 cursor-not-allowed font-normal"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content - Dynamically Rendered Sections */}
            <div className="md:col-span-3">
              {lettersWithContent.map((letter) => (
                <section key={letter} id={letter} className="mb-10">
                  <h2 className="text-2xl font-bold text-[#a855f7] mb-4">{letter}</h2>
                  <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                    {groupedGlossaryData?.[letter]?.map((term) =>
                      renderTermCard(term) // Render a card for each term
                    )}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Render your actual Sign-in Modal component */}
      <SignInModal
        isOpen={showLoginPopup}
        onClose={closeSignInModal}
        onSwitchToSignUp={() => { /* Add logic to switch to sign up view, if needed */ }}
      />
    </>
  );
}