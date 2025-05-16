import SearchResults from "@/components/SearchResults"
import SearchResultDirect from "@/components/search-results-direct";
import {BackLink} from "@/components/ui/BackLink";


export default async function SearchPage({
                                             searchParams,
                                         }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const query = typeof (searchParams.q) === "string" ? searchParams.q : "" // Make sure no 'await' here
    const category = typeof (searchParams.category) === "string" ? searchParams.category : "" // Make sure no 'await' here
    const source = typeof (searchParams.source) === "string" ? searchParams.source : "" // Make sure no 'await' here


    const ResultsComponent = source === "direct"
        ? <SearchResultDirect initialQuery={query} />
        : <SearchResults initialQuery={query} category={category} source={source} />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Search Results</h1>
            <BackLink href="/" label="Back to Home" />
            {ResultsComponent}
        </div>
    );


}
