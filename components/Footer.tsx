export const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 w-full py-8">
            <div className="container mx-auto text-center">

                <p className="text-sm font-medium text-gray-700">
                    &copy; {new Date().getFullYear()} TEXTOM. All rights reserved.
                </p>

                <div className="mt-4 flex justify-center space-x-6">
                    <a
                        href="/about"
                        className="text-gray-600 hover:text-blue-500 transition duration-300 font-medium"
                    >
                        About
                    </a>
                    <a
                        href="/privacy"
                        className="text-gray-600 hover:text-blue-500 transition duration-300 font-medium"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="/contact"
                        className="text-gray-600 hover:text-blue-500 transition duration-300 font-medium"
                    >
                        Contact
                    </a>
                </div>


                <div className="mt-4 flex justify-center space-x-4">
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.384 4.482A13.94 13.94 0 011.671 3.149a4.916 4.916 0 001.523 6.573 4.897 4.897 0 01-2.229-.616v.061a4.916 4.916 0 003.946 4.827 4.902 4.902 0 01-2.224.084 4.917 4.917 0 004.588 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.057 0 14.01-7.514 14.01-14.01 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z" />
                        </svg>
                    </a>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.593 1.324-1.324V1.325C24 .593 23.407 0 22.675 0z" />
                        </svg>
                    </a>
                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            className="w-5 h-5"
                        >
                            <path d="M22.23 0H1.77C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.77 24h20.46c.978 0 1.77-.774 1.77-1.729V1.729C24 .774 23.208 0 22.23 0zM7.12 20.452H3.56V9h3.56v11.452zM5.34 7.672c-1.14 0-2.06-.93-2.06-2.072 0-1.143.92-2.072 2.06-2.072 1.14 0 2.06.93 2.06 2.072 0 1.143-.92 2.072-2.06 2.072zM20.452 20.452h-3.56v-5.604c0-1.337-.027-3.06-1.865-3.06-1.865 0-2.15 1.457-2.15 2.963v5.701h-3.56V9h3.42v1.561h.05c.477-.9 1.637-1.85 3.37-1.85 3.605 0 4.27 2.372 4.27 5.457v6.284z" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
};