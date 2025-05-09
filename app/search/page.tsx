import SearchResults from "@/components/SearchResults"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof ( searchParams.q) === "string" ?  searchParams.q : "" // Make sure no 'await' here
const category = typeof ( searchParams.category) === "string" ?  searchParams.category : "" // Make sure no 'await' here
const source = typeof ( searchParams.source) === "string" ? searchParams.source : "" // Make sure no 'await' here

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      <SearchResults initialQuery={query} category={category} source={source} />
    </div>
  )
}
