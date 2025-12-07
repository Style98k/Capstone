export default function Footer() {
  return (
    <footer className="bg-white/95 dark:bg-gray-900/90 border-t border-sky-100 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">QuickGig</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Connecting students and local clients for flexible, short-term work.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <nav className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-sky-600 transition-colors">About</a>
              <a href="#" className="hover:text-sky-600 transition-colors">Browse gigs</a>
              <a href="#" className="hover:text-sky-600 transition-colors">Support</a>
              <a href="#" className="hover:text-sky-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-sky-600 transition-colors">Privacy</a>
            </nav>
            <span className="hidden md:inline-block h-4 w-px bg-gray-200 dark:bg-slate-700" />
            <p className="text-xs sm:text-sm">
              © {new Date().getFullYear()} QuickGig. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

