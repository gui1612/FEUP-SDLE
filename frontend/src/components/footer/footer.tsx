import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-900">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2023{" "}
                    <Link to="/" className="hover:underline">
                        SuperBasket™
                    </Link>
                    . All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <Link to="/about" className="hover:underline me-4 md:me-6">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="https://github.com/gui1612/FEUP-SDLE/blob/main/LICENSE" className="hover:underline me-4 md:me-6">
                            MIT License
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:underline">
                            Contact
                        </Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
};
