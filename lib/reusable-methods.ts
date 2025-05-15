import { useAuth } from "@/contexts/auth-context"
import {useEffect, useRef, useState} from "react"
export const handleOpenTool = (link: string): void => {
    if (link) {
        window.open(link, '_blank');
    } else {
        console.warn("Attempted to open a tool with an empty link.");
    }
};



export function useCustomDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const handler = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (handler.current) {
            clearTimeout(handler.current);
        }

        handler.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            if (handler.current) {
                clearTimeout(handler.current);
            }
        };
    }, [value, delay]);

    return debouncedValue;
}