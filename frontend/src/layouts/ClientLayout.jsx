// src/layouts/ClientLayout.jsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Shared/Sidebar';
import { HomeIcon, BriefcaseIcon, UserGroupIcon, CurrencyDollarIcon, UserIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/client/dashboard', icon: HomeIcon },
  { name: 'Post a Gig', href: '/client/post-gig', icon: BriefcaseIcon },
  { name: 'Manage Gigs', href: '/client/gigs', icon: BriefcaseIcon },
  { name: 'Applicants', href: '/client/applicants', icon: UserGroupIcon },
  { name: 'Payments', href: '/client/payments', icon: CurrencyDollarIcon },
  { name: 'Profile', href: '/client/profile', icon: UserIcon },
];

export default function ClientLayout() {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar navigation={navigation} />
      <div className="flex-1 overflow-auto focus:outline-none">
        <Outlet />
      </div>
    </div>
  );
}