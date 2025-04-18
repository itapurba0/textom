"use client";
import React from "react";
import { useShareText } from "@/hooks/index";

export const TextInput = () => {
  const { text, code, handleTextChange } = useShareText();

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Share Your Text</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={5}
        value={text}
        onChange={handleTextChange} // Trigger sharing or updating on text change
        placeholder="Enter text to share"
      />
      {code && (
        <p className="mt-4 text-green-600 font-bold">
          Your code: <span className="text-blue-600">{code}</span>
        </p>
      )}
    </div>
  );
};