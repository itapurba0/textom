import { useState, useRef, useEffect } from "react";

const EXPIRY_MS = 15 * 60 * 1000;

export const useShareText = () => {
    const [text, setText] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [codeCreatedAt, setCodeCreatedAt] = useState<number | null>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const isExpired = () => codeCreatedAt && Date.now() - codeCreatedAt > EXPIRY_MS;

    const handleShare = async (newText: string) => {
        if (!newText.trim()) {
            setCode("");
            setCodeCreatedAt(null);
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            if (code && !isExpired()) {
                const res = await fetch(`/api/share/${code}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: newText }),
                });
                if (!res.ok) setError("Failed to update");
            } else {
                const res = await fetch("/api/share", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ content: newText }),
                });
                if (res.ok) {
                    const { code: newCode } = await res.json();
                    setCode(newCode);
                    setCodeCreatedAt(Date.now());
                } else {
                    setError("Failed to generate code");
                }
            }
        } catch (_err) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        setError("");

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            handleShare(newText);
        }, 1000);
    };

    const handleReset = () => {
        setText("");
        setCode("");
        setCodeCreatedAt(null);
        setError("");
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, []);

    return { text, setText, code, setCode, handleTextChange, isLoading, error, setError, handleReset, codeCreatedAt, setCodeCreatedAt };
};