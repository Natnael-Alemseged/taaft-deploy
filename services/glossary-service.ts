// services/glossary-service.ts
import apiClient from "@/lib/api-client"; // Assuming apiClient is configured for your backend API

// Define the structure of a single glossary term based on your API response
export type GlossaryTerm = {
    id: string;
    name: string;
    definition: string;
    related_terms: string[];
    tool_references: string[]; // Assuming this is an array of strings (tool IDs or names)
    categories: string[];
    created_at: string;
    updated_at: string;
    first_letter: string;
}

// Define the structure of the grouped glossary response
export type GroupedGlossaryResponse = {
    [key: string]: GlossaryTerm[]; // Keys are letters (A, B, C...), values are arrays of terms
};

/**
 * Fetches glossary terms grouped by their first letter.
 * @returns A promise that resolves to an object with letters as keys and arrays of terms as values.
 */
export const getGlossaryGrouped = async (): Promise<GroupedGlossaryResponse> => {
    try {
        const response = await apiClient.get<GroupedGlossaryResponse>("/api/glossary/grouped");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch grouped glossary data:", error);
        throw new Error("Could not fetch glossary data."); // Re-throw or handle error as needed
    }
};

// You can add other glossary-related service functions here if needed (e.g., fetching a single term)