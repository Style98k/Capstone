export default function Footer() {
  return (
    <footer className="bg-white/95 dark:bg-gray-900/90 border-t border-sky-100 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">QuickGig</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} QuickGig. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

