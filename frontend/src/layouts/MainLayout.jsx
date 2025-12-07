// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Shared/Navbar';
import Footer from '../components/Shared/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-grow w-full">
        <div className="w-full max-w-[2000px] mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}