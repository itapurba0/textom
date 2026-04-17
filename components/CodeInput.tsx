"use client";
import React, { useState, useEffect } from "react";
import { useRetrieveContent } from "@/hooks/index";
import { FileGet, GetText } from "./index";

export const CodeInput = () => {
  const { code, setCode, content, error, handleRetrieve } = useRetrieveContent();
  const [view, setView] = useState<"code" | "file">("code");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setView("code");
    }
  }, []);

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
            Retrieve Your Shared Content
          </h1>
          <p className="text-lg text-gray-600">
            Choose to retrieve content by entering a code or downloading a file.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          <button
            className={`px-6 py-2 font-semibold rounded-lg transition duration-300 ${view === "code"
                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            onClick={() => setView("code")}
          >
            Get Text
          </button>
          <button
            className={`px-6 py-2 font-semibold rounded-lg transition duration-300 ${view === "file"
                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            onClick={() => setView("file")}
          >
            Get File
          </button>
        </div>

        {view === "code" ? (
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg">
            <div className="bg-white rounded-lg p-8">
              {!content ? (
                <>
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
                      onKeyPress={(e) => e.key === "Enter" && handleRetrieve(code)}
                      placeholder="Enter your code (e.g., 1234)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button
                      onClick={() => handleRetrieve(code)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition duration-300"
                    >
                      Retrieve
                    </button>
                  </div>
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
      </div>
    </main>
  );
};