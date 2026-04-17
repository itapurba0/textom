"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, FileUp, Copy, Check, Loader, X } from "lucide-react";

export const ShareFilePage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to share");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/sharefile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCode(data.code);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to upload file");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleReset = () => {
    setFile(null);
    setCode("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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
              Share Your Files
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-md mx-auto leading-relaxed">
              Upload a file to get a unique code for instant sharing. Fast, secure, and temporary.
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
                <AnimatePresence mode="wait">
                  {!code ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Drag and Drop Zone or File Selected State */}
                      {!file ? (
                        <motion.div
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          whileHover={{ scale: 1.02 }}
                          className={`relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer ${
                            isDragActive
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-300 bg-gray-50 hover:border-purple-400"
                          }`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileInputChange}
                            className="hidden"
                            aria-label="File input"
                          />

                          <div className="flex flex-col items-center gap-4">
                            <motion.div
                              animate={isDragActive ? { scale: 1.2, rotate: 20 } : { scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 200 }}
                            >
                              <FileUp
                                size={48}
                                className={`transition-colors ${
                                  isDragActive ? "text-purple-600" : "text-gray-400"
                                }`}
                              />
                            </motion.div>
                            <div className="text-center">
                              <p className="text-lg font-semibold text-gray-700">
                                {isDragActive ? "Drop your file here" : "Drag and drop your file"}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="border-2 border-green-200 bg-green-50 rounded-xl p-6"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-grow">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200 }}
                              >
                                <FileUp size={32} className="text-green-600 flex-shrink-0" />
                              </motion.div>
                              <div className="flex-grow">
                                <p className="font-semibold text-gray-800 break-words">
                                  {file.name}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <motion.button
                              onClick={handleClearFile}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
                              aria-label="Remove file"
                            >
                              <X size={24} />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* Expiration Warning */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg"
                      >
                        <Clock size={18} className="text-orange-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold text-gray-800">Auto-expires:</span> Files are compressed and automatically deleted after <span className="font-semibold text-orange-600">5 minutes</span>. No manual action needed.
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

                      {/* Submit Button */}
                      <motion.button
                        onClick={handleUpload}
                        disabled={isLoading || !file}
                        whileHover={{ scale: file && !isLoading ? 1.05 : 1 }}
                        whileTap={{ scale: file && !isLoading ? 0.95 : 1 }}
                        className={`w-full py-4 px-6 font-bold text-lg rounded-lg transition-all flex items-center justify-center gap-2 ${
                          file && !isLoading
                            ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <Loader size={20} />
                            </motion.div>
                            <span>Uploading File...</span>
                          </>
                        ) : (
                          <>
                            <span>Upload & Generate Code</span>
                            <motion.div
                              animate={{ x: file ? 5 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              →
                            </motion.div>
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                      className="text-center space-y-8 py-4"
                    >
                      {/* Success Message */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-lg font-semibold text-gray-600 mb-2">
                          ✨ Success! Your file is ready to share
                        </p>
                      </motion.div>

                      {/* Large Code Display */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
                        className="space-y-2"
                      >
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          Share This Code
                        </p>
                        <div className="text-7xl md:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-mono tracking-wider">
                          {code}
                        </div>
                      </motion.div>

                      {/* Copy Button */}
                      <motion.button
                        onClick={handleCopy}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-lg transition-all ${
                          copied
                            ? "bg-green-100 text-green-700"
                            : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg"
                        }`}
                      >
                        <motion.div
                          animate={{ scale: copied ? 1.2 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {copied ? <Check size={20} /> : <Copy size={20} />}
                        </motion.div>
                        <span>{copied ? "Copied!" : "Copy Code"}</span>
                      </motion.button>

                      {/* File Info */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="pt-4 border-t border-gray-200 space-y-3"
                      >
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-semibold">File:</span> {file?.name}
                          </p>
                          <p>
                            <span className="font-semibold">Size:</span> {formatFileSize(file?.size || 0)}
                          </p>
                          <p className="pt-2">
                            Share this code with anyone to let them download your file
                          </p>
                        </div>
                        <motion.button
                          onClick={handleReset}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
                        >
                          Share Another File
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
