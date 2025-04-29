import SearchResults from "@/components/SearchResults"

export default function SearchPage({
  searchParams,
}: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : ""
  const source = typeof searchParams.source === "string" ? searchParams.source : ""

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      <SearchResults initialQuery={query} category={category} source={source} />
    </div>
  )
}
