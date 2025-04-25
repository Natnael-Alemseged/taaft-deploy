import {Button} from "react-day-picker";
import {useRouter} from "next/navigation";

interface ChatResponsePopupProps {
    message: string;
    formattedData?: {
        hits?: Array<{
            objectID: string;
            name: string;
            description: string;
            link: string;
            logo_url: string;
            category_id: string;
            unique_id: string;
            price: string;
            rating: string;
        }>;
    };
    onClose: () => void;
}

function ChatResponsePopup({ message, formattedData, onClose }: ChatResponsePopupProps) {
    const router = useRouter();

    const handleGoToTools = () => {
        // Store the formatted data in sessionStorage for the search page to access
        if (formattedData && formattedData.hits) {
            sessionStorage.setItem("chatResponseTools", JSON.stringify(formattedData.hits));
        }
        router.push("/search?source=chat");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">AI Assistant</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-gray-800 mb-4">{message}</p>
                <div className="flex justify-end mt-4 space-x-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleGoToTools}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        Go to Tools
                    </Button>
                </div>
            </div>
        </div>
    );
}