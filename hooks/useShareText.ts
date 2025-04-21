import { useState } from "react";

export const useShareText = () => {
    const [text, setText] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const handleShare = async (newText: string) => {
        if (!code) {
            const response = await fetch("/api/share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "text", content: newText }),
            });
            const data = await response.json();
            setCode(data.code);
        } else {

            await fetch(`/api/share/${code}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newText }),
            });
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        handleShare(newText); 
    };

    return { text, setText, code, handleTextChange };
};