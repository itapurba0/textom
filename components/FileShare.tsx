"use client";
import React, { useState } from "react";

export const FileShare = () => {
    const [file, setFile] = useState<File | null>(null);
    const [code, setCode] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a file to share.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/share-file", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setCode(data.code); // Display the generated code
                setError("");
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Something went wrong.");
            }
        } catch (err) {
            console.error("Error uploading file:", err);
            setError("Failed to upload the file. Please try again.");
        }
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Share Your File</h1>
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={handleSubmit}
            >
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="file"
                    >
                        File
                    </label>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        onChange={handleFileChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Share
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    <p>{error}</p>
                </div>
            )}

            {code && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
                    <p>
                        File shared successfully! Your code:{" "}
                        <span className="font-bold text-blue-600">{code}</span>
                    </p>
                </div>
            )}
        </div>
    );
};