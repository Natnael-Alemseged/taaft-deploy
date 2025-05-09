import SearchResults from "@/components/SearchResults"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof (await searchParams.q) === "string" ? await searchParams.q : ""
  const category = typeof (await searchParams.category) === "string" ? await searchParams.category : ""
  const source = typeof (await searchParams.source) === "string" ? await searchParams.source : ""

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results</h1>
      <SearchResults initialQuery={query} category={category} source={source} />
    </div>
  )
}
