"use client";
import React, { useState } from "react";

export const FileGet = () => {
    const [code, setCode] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleDownload = async () => {
        if (!code.trim()) {
            setError("Please enter a valid code.");
            return;
        }

        try {
            const response = await fetch(`/api/retrieve-file/${code}`, {
                method: "GET",
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;

                const contentDisposition = response.headers.get("Content-Disposition");
                const filename = contentDisposition
                    ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
                    : "downloaded-file";

                a.download = filename || "downloaded-file";
                document.body.appendChild(a);
                a.click();
                a.remove();

                setError("");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Failed to download the file.");
            }
        } catch (err) {
            console.error("Error downloading file:", err);
            setError("Failed to download the file. Please try again.");
        }
    };

    return (
        <main className="w-full max-w-2xl">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg">
                <div className="bg-white rounded-lg p-8">
                    <label
                        className="block text-gray-700 text-base font-semibold mb-4"
                        htmlFor="code"
                    >
                        Enter Code
                    </label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleDownload()}
                            placeholder="Enter your code (e.g., 1234)"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button
                            onClick={handleDownload}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition duration-300 whitespace-nowrap"
                        >
                            Download
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg shadow">
                    <p className="text-center font-medium">{error}</p>
                </div>
            )}
        </main>
    );
};