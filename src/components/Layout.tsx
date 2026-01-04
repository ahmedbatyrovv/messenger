import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useStore } from '../store/useStore';

export default function Layout() {
  const { isSidebarCollapsed } = useStore();

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Navigation />

      <div
        className={`
          flex-1 flex flex-col overflow-hidden
          pb-20 lg:pb-0
          transition-all duration-300
          ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
        `}
      >
     <main className="flex-1 pb-20 lg:pb-0 lg:ml-20">
  {/* lg:ml-20 вместо lg:ml-72 */}
  <Outlet />
</main>
      </div>
    </div>
  );
}