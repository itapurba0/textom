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
        setCode(data.code); 
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
    <main className="container mx-auto mt-10">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Share Your File
        </h1>
        <p className="text-gray-600">
          Upload your file and get a unique code to share it with others.
        </p>
      </div>


      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg">
        <form
          className="bg-white rounded-lg p-6"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="file"
            >
              Select File
            </label>
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            Share
          </button>
        </form>
      </div>


      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg shadow">
          <p className="text-center font-medium">{error}</p>
        </div>
      )}

      {code && (
        <div className="mt-6 p-6 bg-green-100 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-green-800 mb-2">
            File Shared Successfully!
          </h2>
          <p className="text-gray-700">
            Your unique code:{" "}
            <span className="font-bold text-blue-600">{code}</span>
          </p>
        </div>
      )}
    </main>
  );
};