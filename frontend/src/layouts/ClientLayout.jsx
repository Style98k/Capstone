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