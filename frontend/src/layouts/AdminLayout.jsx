// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Shared/Sidebar';
import { HomeIcon, UsersIcon, DocumentTextIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Content', href: '/admin/content', icon: DocumentTextIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Sidebar navigation={navigation} />
      <div className="md:pl-72 flex flex-col flex-1">
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}