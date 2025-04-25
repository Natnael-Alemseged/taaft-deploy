import SearchResults from "@/components/search-results"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.q === "string" ? searchParams.q : ""
  const category = typeof searchParams.category === "string" ? searchParams.category : ""

  // return <SearchResults query={query} category={category} />
  return <div></div>
}
