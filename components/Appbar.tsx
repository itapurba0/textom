import Link from "next/link";
import Image from "next/image";
import { Share2, FileUp } from "lucide-react";

export const Appbar = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <nav className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <Link href="/" className="text-2xl font-bold tracking-wide hover:text-gray-100 transition">
            TEXTOM
          </Link>
        </div>

        <ul className="flex items-center space-x-8 text-sm md:text-base font-medium">
          <li>
            <Link href="/sharetext" className="flex items-center space-x-2 hover:text-gray-100 transition duration-300">
              <Share2 size={18} />
              <span>Share Text</span>
            </Link>
          </li>
          <li>
            <Link href="/sharefile" className="flex items-center space-x-2 hover:text-gray-100 transition duration-300">
              <FileUp size={18} />
              <span>Share File</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};