// src/components/shared/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white/95 border-t border-sky-100">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav
          className="-mx-5 -my-2 flex flex-wrap justify-center"
          aria-label="Footer"
        >
          <div className="px-5 py-2">
            <Link
              to="/about"
              className="text-base text-gray-500 hover:text-sky-700"
            >
              About
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link
              to="/blog"
              className="text-base text-gray-500 hover:text-sky-700"
            >
              Blog
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link
              to="/privacy"
              className="text-base text-gray-500 hover:text-sky-700"
            >
              Privacy
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link
              to="/terms"
              className="text-base text-gray-500 hover:text-sky-700"
            >
              Terms
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link
              to="/contact"
              className="text-base text-gray-500 hover:text-sky-700"
            >
              Contact
            </Link>
          </div>

          <div className="px-5 py-2">
            <Link
              to="/admin"
              className="text-base text-sky-600 hover:text-sky-500"
            >
              Admin
            </Link>
          </div>
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} QuickGig. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
