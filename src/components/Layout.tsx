// src/layouts/Layout.tsx
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import { useStore } from '../store/useStore';

export default function Layout() {
  const { isSidebarCollapsed } = useStore();

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Navigation />

      <div
        className={`
          flex-1 flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out
          pt-14 pb-16 lg:pt-0 lg:pb-0  /* отступы под мобильные бары */
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
        `}
      >
        <Outlet />
      </div>
    </div>
  );
}