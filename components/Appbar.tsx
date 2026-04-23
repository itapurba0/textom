"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Share2, FileUp } from "lucide-react";

export const Appbar = () => {
  const navItems = [
    { href: "/sharetext", icon: Share2, label: "Share Text" },
    { href: "/sharefile", icon: FileUp, label: "Share File" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg"
    >
      <nav className="container mx-auto flex justify-between items-center px-6 py-4">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <Link href="/" className="text-2xl font-bold tracking-wide hover:text-gray-100 transition">
            TEXTOM
          </Link>
        </motion.div>

        <ul className="flex items-center space-x-8 text-sm md:text-base font-medium">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href={item.href} className="flex items-center space-x-2 hover:text-gray-100 transition duration-300">
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              </motion.li>
            );
          })}
        </ul>
      </nav>
    </motion.header>
  );
};