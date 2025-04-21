import Link from "next/link";
import Image from "next/image";

export const Appbar = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <div className="text-2xl flex items-center space-x-2 font-bold tracking-wide">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <Link href="/" className="hover:text-gray-200">
            TEXTOM
          </Link>
        </div>

        <ul className="flex space-x-6 text-lg">
          <li>
            <Link href="/sharetext" className="hover:text-gray-200 transition duration-300">
              Share Text
            </Link>
          </li>
          <li>
            <Link href="/sharefile" className="hover:text-gray-200 transition duration-300">
              Share File
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};