import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 flex-shrink-0" />
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
      <RightSidebar />
    </div>
  );
}