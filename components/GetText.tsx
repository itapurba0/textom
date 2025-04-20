"use client";
import React from "react";

interface GetTextProps {
    content: string;
}

export const GetText: React.FC<GetTextProps> = ({ content }) => {
    const handleCopy = () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(content).then(() => {
                alert("Content copied to clipboard!");
            }).catch((err) => {
                console.error("Failed to copy content:", err);
                alert("Failed to copy content. Please try again.");
            });
        } else {
            alert("Clipboard API is not supported in this browser.");
        }
    };

    return (
        <div className="container mx-auto mt-10">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                Retrieved Content:
            </h2>
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg">
                <div className="bg-white rounded-lg p-6">
                    <textarea
                        readOnly
                        value={content}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                        rows={10}
                        style={{ fontFamily: "'Open Sans', sans-serif" }}
                    />
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <button
                    onClick={handleCopy}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
                >
                    Copy to Clipboard
                </button>
            </div>
        </div>
    );
};
