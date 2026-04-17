"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface GetTextProps {
    content: string;
}

export const GetText: React.FC<GetTextProps> = ({ content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(content).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch((err) => {
                console.error("Failed to copy content:", err);
            });
        }
    };



    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
                    Retrieved Content
                </h3>
                <textarea
                    readOnly
                    value={content}
                    className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 text-sm font-medium resize-none"
                />
            </div>
            <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    copied
                        ? "bg-green-100 text-green-700"
                        : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                }`}
            >
                <motion.div
                    animate={{ scale: copied ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </motion.div>
                <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
            </motion.button>
        </div>
    );
};
