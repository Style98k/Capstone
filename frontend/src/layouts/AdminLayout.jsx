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
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar navigation={navigation} />
      <div className="flex-1 overflow-auto focus:outline-none">
        <Outlet />
      </div>
    </div>
  );
}