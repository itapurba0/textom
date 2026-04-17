"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRetrieveContent } from "@/hooks/index";
import { GetText } from "./index";
import { ArrowRight, Download } from "lucide-react";

export const HomePage = () => {
  const { code, setCode, content, error, handleRetrieve } = useRetrieveContent();
  const [view, setView] = useState<"text" | "file">("text");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleFileDownload = async () => {
    if (!code.trim()) return;
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/retrieve-file/${code}`, {
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        const contentDisposition = response.headers.get("Content-Disposition");
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
          : "downloaded-file";

        a.download = filename || "downloaded-file";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Error downloading file:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase and limit to alphanumeric
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setCode(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      if (view === "text") {
        handleRetrieve(code);
      } else {
        handleFileDownload();
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
          className="w-full max-w-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Welcome to TEXTOM
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
              Temporary text and file sharing made simple. Share instantly, securely, and automatically delete after expiration.
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
              {/* Card Content */}
              <div className="p-8">
                {/* Animated Tabs */}
                <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
                  {["text", "file"].map((tab) => (
                    <motion.button
                      key={tab}
                      onClick={() => setView(tab as "text" | "file")}
                      className={`flex-1 py-3 px-4 font-semibold rounded-md transition-colors relative ${
                        view === tab ? "text-white" : "text-gray-600"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {view === tab && (
                        <motion.div
                          layoutId="tab-background"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-md"
                          transition={{ type: "spring", stiffness: 380, damping: 40 }}
                        />
                      )}
                      <motion.span className="relative z-10">
                        {tab === "text" ? "Get Text" : "Get File"}
                      </motion.span>
                    </motion.button>
                  ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                  {!content ? (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Input Section */}
                      <div className="text-center space-y-4">
                        <label htmlFor="code" className="block text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Enter Code
                        </label>
                        <motion.input
                          whileFocus={{ scale: 1.02 }}
                          type="text"
                          id="code"
                          value={code}
                          onChange={handleCodeChange}
                          placeholder="e.g., 1A2B"
                          maxLength={4}
                          className="w-full text-4xl font-mono text-center tracking-[0.5em] py-6 px-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition"
                        />
                        <p className="text-xs text-gray-500 tracking-wider">
                          {code.length}/4 Characters • Alphanumeric only
                        </p>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={code.length === 0 || isDownloading}
                        whileHover={{ scale: code.length > 0 && !isDownloading ? 1.05 : 1 }}
                        whileTap={{ scale: code.length > 0 && !isDownloading ? 0.95 : 1 }}
                        className={`w-full py-4 px-6 font-bold text-lg rounded-lg transition-all flex items-center justify-center gap-2 ${
                          code.length > 0 && !isDownloading
                            ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <span>{isDownloading ? "Downloading..." : (view === "text" ? "Retrieve" : "Download")}</span>
                        <motion.div
                          animate={{ x: code.length > 0 && !isDownloading ? 5 : 0, rotate: isDownloading ? 360 : 0 }}
                          transition={{ duration: isDownloading ? 1 : 0.3, repeat: isDownloading ? Infinity : 0 }}
                        >
                          {view === "file" ? <Download size={20} /> : <ArrowRight size={20} />}
                        </motion.div>
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {view === "text" ? (
                        <GetText content={content} />
                      ) : (
                        <p className="text-center text-gray-600">File retrieved successfully</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Footer Message */}
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-500 text-sm"
          >
            Your shared content is automatically deleted after expiration.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
