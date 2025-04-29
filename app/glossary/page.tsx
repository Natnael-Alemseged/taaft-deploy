// Glossary.tsx
"use client"
import { useState, useEffect, useMemo } from "react" // Added useMemo
import Link from "next/link"
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button" // Assuming Button component path
import Header from "@/components/header" // Assuming Header component path

import { useGlossaryGrouped } from "@/hooks/use-glossary" // Import the hook
import type { GlossaryTerm } from "@/services/glossary-service" // Import types

// Helper function to convert a term title into a URL-friendly slug
function slugify(text: string): string {
  if (!text) return "" // Handle empty or null text
  return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars except -
      .replace(/-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
}

export default function Glossary() {
  // Fetch grouped glossary data using the hook
  const { data: groupedGlossaryData, isLoading, isError } = useGlossaryGrouped()

  // Derive the list of letters with content from the fetched data
  // Use useMemo to prevent recalculation on every render if data doesn't change
  const lettersWithContent = useMemo(() => {
    if (!groupedGlossaryData) return []
    // Get the keys (letters) from the data object and sort them alphabetically
    return Object.keys(groupedGlossaryData).sort()
  }, [groupedGlossaryData]) // Recalculate only when groupedGlossaryData changes

  const allLetters = useMemo(
      () => [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      [],
  ) // This list is static

  // State for the currently selected letter in navigation
  // Initialize with the first letter that has content once data is loaded
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  // State for mobile alphabetical navigation dropdown
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);


  useEffect(() => {
    // Set initial selected letter once lettersWithContent is determined
    if (lettersWithContent.length > 0 && selectedLetter === null) {
      setSelectedLetter(lettersWithContent[0])
    }
  }, [lettersWithContent, selectedLetter]) // Re-run when lettersWithContent becomes available

  // --- Scroll Logic ---
  useEffect(() => {
    // Only attach scroll listener on the client side
    if (typeof window === "undefined" || !lettersWithContent || lettersWithContent.length === 0) {
      return // Don't attach listener if no content or not on client
    }

    const handleScroll = () => {
      let currentLetter: string | null = null
      const viewportCenter = window.innerHeight / 2

      // Get all section elements that correspond to letters with content
      const sections = lettersWithContent
          .map((letter) => document.getElementById(letter))
          .filter((section): section is HTMLElement => section !== null) // Filter out nulls

      for (const section of sections) {
        const rect = section.getBoundingClientRect()
        // Check if the section is currently in the middle of the viewport
        if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
          currentLetter = section.id
          break // Found the current letter
        }
      }

      // If no section is in the direct center, find the first one below the center
      if (currentLetter === null && sections.length > 0) {
        for (const section of sections) {
          const rect = section.getBoundingClientRect()
          // Check if the section starts below the center but is still visible
          if (rect.top > viewportCenter && rect.top < window.innerHeight) {
            currentLetter = section.id
            break
          }
        }
      }

      // Fallback: If still null, maybe the last section is partially visible at the bottom
      if (currentLetter === null && sections.length > 0) {
        const lastSection = sections[sections.length - 1]
        const rect = lastSection.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          currentLetter = lastSection.id
        }
      }

      // Update selected letter state if it has changed and is one of the content letters
      if (currentLetter && lettersWithContent.includes(currentLetter) && currentLetter !== selectedLetter) {
        // Use the functional update to avoid stale state issues inside the scroll handler
        setSelectedLetter((prevSelectedLetter) => {
          if (currentLetter !== prevSelectedLetter) {
            // Optional: Update URL hash if needed, but might cause history spam
            // window.history.replaceState(null, '', `#${currentLetter}`);
            return currentLetter
          }
          return prevSelectedLetter
        })
      }
    }

    // Add the scroll listener
    window.addEventListener("scroll", handleScroll)
    // Run once on mount to set the initial selected letter based on scroll position
    handleScroll()

    // Cleanup function to remove the scroll listener
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll)
      }
    }
  }, [selectedLetter, lettersWithContent]) // Depend on selectedLetter and lettersWithContent

  // --- Click Handler ---
  const handleLetterClick = (letter: string) => {
    // Only scroll if the clicked letter actually has content
    if (lettersWithContent.includes(letter)) {
      if (typeof window !== "undefined") {
        const sectionElement = document.getElementById(letter)
        if (sectionElement) {
          // Scroll the element into view
          sectionElement.scrollIntoView({ behavior: "smooth", block: "center" })
          // Update the URL hash
          window.history.pushState(null, "", `#${letter}`)
          // Update the selected state immediately
          setSelectedLetter(letter)
          setIsMobileNavOpen(false); // Close mobile nav on click
        }
      }
    }
    // Note: If a letter without content is clicked, disabled button prevents the click.
  }

  // --- Initial Hash Handling ---
  useEffect(() => {
    // Only run on the client side after initial render
    if (typeof window !== "undefined" && lettersWithContent.length > 0) {
      const hash = window.location.hash.replace("#", "").toUpperCase()
      // Check if the hash corresponds to a letter that actually has content
      if (hash && lettersWithContent.includes(hash)) {
        const sectionElement = document.getElementById(hash)
        if (sectionElement) {
          // Use a small timeout to ensure the element exists and layout is stable
          setTimeout(() => {
            sectionElement.scrollIntoView({ behavior: "smooth", block: "center" })
            // Update the selected state after scrolling
            setSelectedLetter(hash)
          }, 100) // Adjust timeout if necessary
        }
      } else if (selectedLetter === null && lettersWithContent.length > 0) {
        // If no valid hash and no letter selected yet, default to the first letter with content
        setSelectedLetter(lettersWithContent[0])
      }
    }
  }, [lettersWithContent]) // Depend on lettersWithContent so it runs once data is available

  // Function to render a single glossary term card
  const renderTermCard = (term: GlossaryTerm) => (
      // Assuming term.id is unique and stable for keys
      <div key={term.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow transition-shadow bg-white dark:bg-gray-800"> {/* Added dark modes */}
        {/* Link to the individual term page */}
        <Link href={`/terms/${slugify(term.id)}`} className="block"> {/* Assuming individual term pages exist */}
          {/* Top header section */}
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-start justify-between"> {/* Added dark modes */}
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{term.name}</h3> {/* Added dark modes */}
            <ChevronRight className="w-4 h-4 text-purple-500 dark:text-purple-400 mt-1" /> {/* Added dark modes */}
          </div>

          {/* Definition text */}
          <div className="px-4 py-4">
            {/* Using term.definition as per your data structure */}
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line mb-4">{term.definition}</p> {/* Added dark modes */}
            <span className="text-sm text-purple-500 dark:text-purple-400 font-medium inline-flex items-center gap-1"> {/* Added dark modes */}
              Read more <ChevronRight className="w-4 h-4" />
          </span>
          </div>
        </Link>
      </div>
  )

  // Render nothing if there's an error fetching data
  if (isError) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center text-red-600 dark:text-red-400"> {/* Added dark modes */}
          <p className="mb-4">Failed to load glossary terms.</p>
          {/* You might want a retry button here */}
          <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-700 dark:hover:bg-red-800"> {/* Added dark modes */}
            Retry Loading
          </Button>
        </div>
    )
  }

  // Render loading state
  if (isLoading || !groupedGlossaryData) {
    // Also show loading if data is null initially
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center"> {/* Added dark mode */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 dark:border-purple-400"></div> {/* Added dark modes */}
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading glossary...</p> {/* Added dark mode */}
        </div>
    )
  }

  // If loaded and no error, and data is an empty object
  if (lettersWithContent.length === 0) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center text-gray-600 dark:text-gray-400"> {/* Added dark modes */}
          <p>No glossary terms found.</p>
        </div>
    )
  }

  // --- Generate JSON-LD Schema Markup for Defined Terms ---
  const generateSchema = () => {
    if (!groupedGlossaryData) return null;

    // Collect all terms from the grouped data into a single array
    const allTerms: GlossaryTerm[] = Object.values(groupedGlossaryData).flat();

    if (allTerms.length === 0) {
      return null;
    }

    // Schema can be an array of DefinedTerm objects for multiple terms on one page
    const schema = allTerms.map(term => {
      const termSchema: any = {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        "name": term.name,
        // Use term.definition as the description
        "description": term.definition,
        // Construct the full URL for the term's page using slugify and term.id
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/terms/${slugify(term.id)}`, // Replace with your actual base URL and terms path
      };

      // Add relatedTerm property if related terms exist in the term data
      // Assuming relatedTerms is an array of objects with id, name, slug
      if (term.relatedTerms && Array.isArray(term.relatedTerms) && term.relatedTerms.length > 0) {
        termSchema.relatedTerm = term.relatedTerms.map(related => ({
          "@type": "DefinedTerm", // Related terms are also DefinedTerms
          "name": related.name,
          // Link to the related term's specific page using slugify and related.id
          "url": `${process.env.NEXT_PUBLIC_BASE_URL}/terms/${slugify(related.id)}`, // Link to related term's page
        }));
      }

      return termSchema;
    });

    return JSON.stringify(schema);
  };

  const schemaMarkup = generateSchema();


  // Render the main content when data is loaded successfully
  return (
      <>
        <Header /> {/* Assuming Header component */}
        <div className="min-h-screen bg-white dark:bg-gray-950">
          {/* Add JSON-LD Schema Markup */}
          {schemaMarkup && (
              <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: schemaMarkup }}
              />
          )}

          <main className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-white mb-3">AI Tools Glossary</h1>{" "}
              {/* Adjusted text color */}
              <p className="text-sm md:text-base text-[#6b7280] dark:text-gray-400 max-w-2xl mx-auto">
                {" "}
                {/* Adjusted text color */}
                Explore our comprehensive glossary of AI and machine learning terms to better understand the tools in our
                directory.
              </p>
              {/* Assuming Sign-in demo button remains static */}
              <Link href="/sign-in-demo" passHref>
                <Button className="bg-[#a855f7] hover:bg-[#9333ea] text-white mt-5 text-sm px-4 py-2">
                  Sign in Demo
                </Button>
              </Link>
            </div>

            {/* Mobile Alphabetical Navigation Dropdown */}
            <div className="md:hidden mb-8 relative">
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
                                          : "text-[#6b7280] hover:bg-gray-100 font-semibold"
                                      : "text-gray-400 cursor-not-allowed font-normal"
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
                  {" "}
                  {/* Adjusted top value if needed */}
                  <h2 className="font-semibold text-[#111827] dark:text-white mb-4">Contents</h2>{" "}
                  {/* Adjusted text color */}
                  <div className="space-y-1">
                    {allLetters.map((letter) => {
                      // Determine if the letter has content based on the dynamic list
                      const hasContent = lettersWithContent.includes(letter)
                      const isSelected = selectedLetter === letter

                      return (
                          <button
                              key={letter}
                              onClick={() => handleLetterClick(letter)}
                              disabled={!hasContent} // Disable button if no content for this letter
                              className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                                  hasContent
                                      ? isSelected
                                          ? "bg-[#a855f7] text-white font-semibold"
                                          : "text-[#6b7280] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold" // Adjusted colors
                                      : "text-gray-400 dark:text-gray-600 cursor-not-allowed font-normal" // Adjusted colors
                              }`}
                          >
                            {letter}
                          </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Main Content - Dynamically Rendered Sections */}
              <div className="md:col-span-3">
                {/* Iterate over letters that have content */}
                {lettersWithContent.map((letter) => (
                    // Render a section for each letter with content
                    // Use the letter as the ID for scrolling/linking
                    <section key={letter} id={letter} className="mb-10"> {/* Changed div to section and added id */}
                      <h2 className="text-2xl font-bold text-[#a855f7] mb-4">{letter}</h2>
                      {/* Grid for terms within this letter section */}
                      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
                        {/* Iterate over terms for this specific letter */}
                        {/* Added check for groupedGlossaryData[letter] existence */}
                        {groupedGlossaryData?.[letter]?.map((term) =>
                            // Render a card for each term
                            renderTermCard(term),
                        )}
                      </div>
                    </section> // Close section tag
                ))}

                {/* Note: Sections for letters without content are not rendered by this loop */}
              </div>
            </div>
          </main>
        </div>
      </>
  )
}
