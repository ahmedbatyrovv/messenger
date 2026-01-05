import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Home,
  MessageCircle,
  Users,
  Radio,
  User,
  Plus,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    logout,
    activeChat,
    setActiveChat,
    isSidebarCollapsed,
    toggleSidebarCollapsed,
  } = useStore();

  const bottomTabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageCircle, label: 'Chats', path: '/chats' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: Radio, label: 'Channels', path: '/channels' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const sidebarItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: SearchIcon, label: 'Search', path: '/search' },
    { icon: MessageCircle, label: 'Chats', path: '/chats' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: Radio, label: 'Channels', path: '/channels' },
    { icon: Plus, label: 'Create', path: '/create' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (activeChat) {
      setActiveChat(null);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  // Если чат открыт — ничего не рендерим на мобильных
  if (activeChat) {
    return null;
  }

  return (
    <>
      {/* MOBILE: Top Bar — скрывается при открытом чате */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-zinc-900 lg:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          <button
            onClick={() => handleNavClick('/create')}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-6 h-6 text-zinc-400 hover:text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Messenger</h1>
          <button
            onClick={() => handleNavClick('/search')}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <SearchIcon className="w-6 h-6 text-zinc-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* MOBILE: Bottom Tab Bar — скрывается при открытом чате */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-zinc-900 lg:hidden">
        <div className="flex justify-around items-center h-16">
          {bottomTabs.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className="flex flex-col items-center justify-center w-full h-full gap-1"
              >
                <Icon className={`w-6 h-6 ${active ? 'text-blue-500' : 'text-zinc-400'}`} />
                <span className={`text-xs ${active ? 'text-blue-500' : 'text-zinc-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESKTOP: Sidebar — остаётся всегда */}
      <aside
        className={`
          hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:bg-black lg:border-r lg:border-zinc-900
          transition-all duration-300 ease-in-out overflow-hidden
          ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <img
                  src={currentUser?.avatar || 'https://via.placeholder.com/60'}
                  alt={currentUser?.username}
                  className="w-12 h-12 rounded-full ring-4 ring-zinc-800 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-base font-semibold text-white truncate">
                    {currentUser?.fullName || 'Guest'}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    @{currentUser?.username || 'unknown'}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={toggleSidebarCollapsed}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white flex-shrink-0"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex-1 py-6 overflow-hidden">
            <div className={isSidebarCollapsed ? 'px-3 space-y-2' : 'px-3 space-y-1'}>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`
                      group relative w-full flex items-center rounded-lg transition-all duration-200
                      ${isSidebarCollapsed ? 'justify-center py-4 hover:bg-zinc-800' : 'gap-4 px-4 py-3'}
                      ${active ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}
                    `}
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" />
                    {!isSidebarCollapsed && <span className="text-base">{item.label}</span>}
                    {isSidebarCollapsed && (
                      <div className="absolute left-full ml-4 px-4 py-2 bg-zinc-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-zinc-900 p-4 pb-6">
            <button
              onClick={logout}
              className={`
                group relative w-full flex items-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-red-400 transition-all duration-200
                ${isSidebarCollapsed ? 'justify-center py-4 hover:bg-zinc-800' : 'gap-4 px-4 py-3'}
              `}
            >
              <LogOut className="w-6 h-6 flex-shrink-0" />
              {!isSidebarCollapsed && <span className="font-medium">Log Out</span>}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-4 px-4 py-2 bg-zinc-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg">
                  Log Out
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}