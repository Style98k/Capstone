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
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar navigation={navigation} />
      <div className="flex-1 overflow-auto focus:outline-none">
        <Outlet />
      </div>
    </div>
  );
}