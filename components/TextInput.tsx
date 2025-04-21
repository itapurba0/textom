"use client";
import React from "react";
import { useShareText } from "@/hooks/index";

export const TextInput = () => {
  const { text, code, handleTextChange } = useShareText();

  return (
    <main className="container mx-auto mt-10">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Share Your Text
        </h1>
        <p className="text-gray-600">
          Enter your text below to generate a unique code for sharing.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-lg shadow-lg">
        <div className="bg-white rounded-lg p-6">
          {code ? (
            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-blue-600">
                Your Code is:
              </p>
              <p className="text-4xl font-extrabold text-purple-700">
                {code}
              </p>
            </div>
          ) : (
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="text"
            >
              Enter Text
            </label>
          )}
          <textarea
            id="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={5}
            value={text}
            onChange={handleTextChange}
            placeholder="Enter text to share"
          />
        </div>
      </div>

    </main>
  );
};