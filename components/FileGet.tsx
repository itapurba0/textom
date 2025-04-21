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
        <main className="container mx-auto mt-10">

            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg">
                <div className="bg-white rounded-lg p-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="code"
                    >
                        Enter Code
                    </label>
                    <input
                        type="text"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter your code"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleDownload}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Download
                    </button>
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