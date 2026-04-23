"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Copy, Check, Loader } from "lucide-react";
import { useShareText } from "@/hooks/index";

export const ShareTextPage = () => {
  const { text, code, handleTextChange, isLoading, error, handleReset } = useShareText();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
      // clipboard failed
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Share Your Text
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
              Paste your text below and get a unique code to share with others. Your content is automatically deleted after 15 minutes.
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            variants={itemVariants}
            className="relative mb-8"
          >
            {/* Animated Gradient Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 blur-lg animate-pulse"></div>

            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-8">
                <div className="space-y-6">
                  {/* Label */}
                  <div>
                    <label
                      htmlFor="text"
                      className="block text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3"
                    >
                      Enter Your Text
                    </label>

                    {/* Textarea */}
                    <motion.textarea
                      whileFocus={{ scale: 1.02 }}
                      id="text"
                      value={text}
                      onChange={handleTextChange}
                      placeholder="Paste your text here... Start typing to auto-generate code!"
                      rows={10}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition resize-none text-gray-700 placeholder-gray-400"
                    />

                    {/* Character Count and Loading Indicator */}
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {text.length} characters
                      </p>
                      {isLoading && (
                        <motion.div
                          className="flex items-center gap-2 text-xs text-purple-600"
                          animate={{ opacity: [0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <Loader size={14} />
                          </motion.div>
                          <span>Updating code...</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Expiration Warning */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg"
                  >
                    <Clock size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold text-gray-800">Auto-expires:</span> Text snippets are automatically encrypted and permanently deleted after <span className="font-semibold">15 minutes</span>. No manual action needed.
                    </p>
                  </motion.div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center text-sm"
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Code Display Section - Always visible when code exists */}
                  <AnimatePresence>
                    {code && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="pt-6 border-t border-gray-200"
                      >
                        {/* Success Message */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                          className="text-center mb-6"
                        >
                          <p className="text-sm font-semibold text-gray-600">
                            ✨ Your sharing code
                          </p>
                        </motion.div>

                        {/* Large Code Display */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
                          className="text-center space-y-4"
                        >
                          <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-mono tracking-wider">
                            {code}
                          </div>

                          {/* Copy Button */}
                          <motion.button
                            onClick={handleCopy}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`inline-flex items-center gap-2 px-6 py-2 font-semibold rounded-lg transition-all text-sm ${copied
                              ? "bg-green-100 text-green-700"
                              : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg"
                              }`}
                          >
                            <motion.div
                              animate={{ scale: copied ? 1.2 : 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {copied ? <Check size={16} /> : <Copy size={16} />}
                            </motion.div>
                            <span>{copied ? "Copied!" : "Copy Code"}</span>
                          </motion.button>

                          {/* Clear Button */}
                          <div className="mt-4">
                            <motion.button
                              onClick={handleReset}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition"
                            >
                              Clear All
                            </motion.button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Info */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-500 text-sm"
          >
            Your text is encrypted and automatically deleted after expiration.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
