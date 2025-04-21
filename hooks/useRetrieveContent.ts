import { useState, useEffect } from "react";

export const useRetrieveContent = () => {
    const [code, setCode] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleRetrieve = async (currentCode: string) => {
        if (!currentCode.trim()) {
            setContent(""); 
            setError(""); 
            return;
        }

        try {
            const response = await fetch(`/api/retrieve`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: currentCode }),
            });

            if (response.ok) {
                const data = await response.json();
                setContent(data.content);
                setError(""); 
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Something went wrong");
                setContent(""); 
            }
        } catch (err) {
            console.error("Error retrieving content:", err);
            setError("Failed to retrieve content. Please try again.");
            setContent(""); 
        }
    };

    useEffect(() => {
        if (code) {
            handleRetrieve(code);
        }
    }, [code]);

    return { code, setCode, content, error };
};