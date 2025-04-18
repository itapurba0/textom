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

                // Create a temporary anchor element to trigger the download
                const a = document.createElement("a");
                a.href = url;

                // Extract the filename from the Content-Disposition header
                const contentDisposition = response.headers.get("Content-Disposition");
                const filename = contentDisposition
                    ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
                    : "downloaded-file";

                a.download = filename || "downloaded-file";
                document.body.appendChild(a);
                a.click();
                a.remove();

                setError(""); // Clear any previous error
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
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Download Your File</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="code"
                    >
                        Code
                    </label>
                    <input
                        type="text"
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter your code"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-6">
                    <button
                        onClick={handleDownload}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Download
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};