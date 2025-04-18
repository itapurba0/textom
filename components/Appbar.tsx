import Link from "next/link";

export const Appbar  = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
          <nav className="container w-full  mx-auto ">
            <ul className="flex space-x-4 justify-between">
              <li>
                <Link href="/" className="hover:text-gray-400">Home</Link>
              </li>
              <li>
                <Link href="/sharetext" className="hover:text-gray-400">Share-Text</Link>
              </li>
              <li>
                <Link href="/sharefile" className="hover:text-gray-400">Share-File</Link>
              </li>
            </ul>
      </nav>
    </header>
  );
}