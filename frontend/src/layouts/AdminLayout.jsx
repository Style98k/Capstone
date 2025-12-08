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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 relative">
      {/* Subtle grid pattern overlay for depth */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/30 via-purple-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-100/30 via-cyan-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <Sidebar navigation={navigation} />
      <div className="md:pl-72 flex flex-col flex-1 relative">
        <main className="flex-1 py-8 px-6 sm:px-8 lg:px-10 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}