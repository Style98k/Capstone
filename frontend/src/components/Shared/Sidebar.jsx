// src/components/shared/Sidebar.jsx
import { Fragment, useState } from 'react';

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function Sidebar({ navigation = [] }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

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
    <div
      className="hidden md:block fixed inset-y-0 left-0 z-30"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="absolute inset-y-0 left-0 w-2 cursor-pointer" />
      <div
        className={classNames(
          'flex flex-col h-full w-64 border-r border-gray-200 bg-white shadow-lg transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700">
              QuickGig
            </Link>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const current = location.pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    current
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <Icon
                    className={classNames(
                      current
                        ? 'text-indigo-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center w-full">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium flex-shrink-0">
              {userInitial}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.name || 'User'}
              </p>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}