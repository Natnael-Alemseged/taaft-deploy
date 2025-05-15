import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
export const handleOpenTool = (link: string): void => {
    if (link) {
        window.open(link, '_blank');
    } else {
        console.warn("Attempted to open a tool with an empty link.");
    }
};