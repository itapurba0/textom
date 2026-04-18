"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

export const GetText = ({ content }: { content: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (_e) { console.error("Failed to copy:", _e);
        }
    };



    return (
        <div className="space-y-4">
            <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Content</p>
                <textarea
                    readOnly
                    value={content}
                    className="w-full h-40 p-4 border border-gray-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <motion.button
                onClick={handleCopy}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${copied
                        ? "bg-green-100 text-green-700"
                        : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
                    }`}
            >
                <motion.div animate={{ scale: copied ? 1.1 : 1 }} transition={{ duration: 0.2 }}>
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                </motion.div>
                {copied ? "Copied!" : "Copy"}
            </motion.button>
        </div>
    );
};
