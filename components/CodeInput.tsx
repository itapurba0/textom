"use client";
import React, { useState, useEffect } from "react";
import { useRetrieveContent } from "@/hooks/index";
import { FileGet, GetText } from "./index";

export const CodeInput = () => {
  const { code, setCode, content, error } = useRetrieveContent();
  const [view, setView] = useState<"code" | "file">("code");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setView("code"); 
    }
  }, []);

  return (
    <main className="container mx-auto mt-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Retrieve Your Shared Content
        </h1>
        <p className="text-gray-600">
          Choose to retrieve content by entering a code or downloading a file.
        </p>
      </div>


      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-l-lg ${view === "code" ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setView("code")}
        >
          Get Text
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${view === "file" ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => setView("file")}
        >
          Get File
        </button>
      </div>


      {view === "code" ? (
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg">
          <div className="bg-white rounded-lg p-6">
            {!content ? (
              <>
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
              </>
            ) : (
              <GetText content={content} />
            )}
          </div>
        </div>
      ) : (
        <FileGet />
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg shadow">
          <p className="text-center font-medium">{error}</p>
        </div>
      )}
    </main>
  );
};