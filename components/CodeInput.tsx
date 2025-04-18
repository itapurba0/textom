"use client";
import React from "react";
import { useRetrieveContent } from "@/hooks/index";

export const CodeInput = () => {
  const { code, setCode, content, error } = useRetrieveContent();

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Retrieve Your Shared Text</h1>
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
            onChange={(e) => setCode(e.target.value)} // Update the code state
            placeholder="Enter your code"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {content && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-bold">Retrieved Content:</h2>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};