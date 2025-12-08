// src/layouts/StudentLayout.jsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Shared/Sidebar';
import { HomeIcon, BriefcaseIcon, UserIcon, StarIcon, BellIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
  { name: 'Browse Gigs', href: '/student/gigs', icon: BriefcaseIcon },
  { name: 'My Applications', href: '/student/applications', icon: BriefcaseIcon },
  { name: 'My Earnings', href: '/student/earnings', icon: CurrencyDollarIcon },
  { name: 'Ratings', href: '/student/ratings', icon: StarIcon },
  { name: 'Notifications', href: '/student/notifications', icon: BellIcon },
  { name: 'Profile', href: '/student/profile', icon: UserIcon },
];

export default function StudentLayout() {
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