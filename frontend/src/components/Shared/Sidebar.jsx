// src/components/shared/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

// Modern color palette for hover effects - each menu item gets a unique color
const hoverColors = [
  { bg: 'hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10', text: 'hover:text-blue-600', icon: 'group-hover:text-blue-500', border: 'hover:border-l-blue-500', active: 'bg-gradient-to-r from-blue-500/15 to-cyan-500/15 text-blue-600 border-l-blue-500' },
  { bg: 'hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-purple-500/10', text: 'hover:text-violet-600', icon: 'group-hover:text-violet-500', border: 'hover:border-l-violet-500', active: 'bg-gradient-to-r from-violet-500/15 to-purple-500/15 text-violet-600 border-l-violet-500' },
  { bg: 'hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10', text: 'hover:text-emerald-600', icon: 'group-hover:text-emerald-500', border: 'hover:border-l-emerald-500', active: 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-600 border-l-emerald-500' },
  { bg: 'hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10', text: 'hover:text-amber-600', icon: 'group-hover:text-amber-500', border: 'hover:border-l-amber-500', active: 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 border-l-amber-500' },
  { bg: 'hover:bg-gradient-to-r hover:from-rose-500/10 hover:to-pink-500/10', text: 'hover:text-rose-600', icon: 'group-hover:text-rose-500', border: 'hover:border-l-rose-500', active: 'bg-gradient-to-r from-rose-500/15 to-pink-500/15 text-rose-600 border-l-rose-500' },
  { bg: 'hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-blue-500/10', text: 'hover:text-indigo-600', icon: 'group-hover:text-indigo-500', border: 'hover:border-l-indigo-500', active: 'bg-gradient-to-r from-indigo-500/15 to-blue-500/15 text-indigo-600 border-l-indigo-500' },
  { bg: 'hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-sky-500/10', text: 'hover:text-cyan-600', icon: 'group-hover:text-cyan-500', border: 'hover:border-l-cyan-500', active: 'bg-gradient-to-r from-cyan-500/15 to-sky-500/15 text-cyan-600 border-l-cyan-500' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Sidebar({ navigation = [] }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  // Handle logout with error handling
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  // Get the first letter of the user's name or a default "U" if not available
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
      {/* Sidebar container with glassmorphism effect */}
      <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl overflow-y-auto">

        {/* Logo Section */}
        <div className="flex items-center h-20 px-6 border-b border-gray-100">
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              QuickGig
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Navigation
          </p>

          {navigation.map((item, index) => {
            const current = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            const colorScheme = hoverColors[index % hoverColors.length];
            const isHovered = hoveredItem === item.name;

            return (
              <Link
                key={item.name}
                to={item.href}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className={classNames(
                  'group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl border-l-4 border-transparent transition-all duration-300 ease-out',
                  current
                    ? colorScheme.active
                    : `text-gray-600 ${colorScheme.bg} ${colorScheme.text} ${colorScheme.border}`
                )}
              >
                {/* Icon with animation */}
                <span className={classNames(
                  'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300',
                  current
                    ? 'bg-white shadow-sm'
                    : 'bg-gray-100/80 group-hover:bg-white group-hover:shadow-md'
                )}>
                  <Icon
                    className={classNames(
                      'w-5 h-5 transition-all duration-300',
                      current
                        ? colorScheme.active.includes('text-') ? colorScheme.active.split(' ').find(c => c.startsWith('text-')) : 'text-indigo-500'
                        : `text-gray-400 ${colorScheme.icon}`,
                      isHovered && !current ? 'scale-110 rotate-3' : ''
                    )}
                    aria-hidden="true"
                  />
                </span>

                {/* Text with slide animation */}
                <span className={classNames(
                  'transition-all duration-300',
                  isHovered && !current ? 'translate-x-1' : ''
                )}>
                  {item.name}
                </span>

                {/* Active indicator dot */}
                {current && (
                  <span className="absolute right-4 w-2 h-2 rounded-full bg-current animate-pulse" />
                )}

                {/* Hover shine effect */}
                <div className={classNames(
                  'absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none',
                  isHovered ? 'animate-shine' : ''
                )} />
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 hover:from-gray-100 hover:to-gray-50 transition-all duration-300 group cursor-pointer">
            {/* Avatar with gradient ring */}
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-sm font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {userInitial}
                  </span>
                </div>
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors duration-300">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'user@quickgig.com'}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 rounded-xl border border-gray-200 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-rose-500/10 hover:text-red-600 hover:border-red-200 transition-all duration-300 group"
          >
            <ArrowLeftStartOnRectangleIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}