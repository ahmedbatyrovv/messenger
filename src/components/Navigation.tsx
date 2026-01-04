// src/components/Navigation.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Home,
  Search as SearchIcon,
  MessageCircle,
  Users,
  Radio,
  Plus,
  User,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    logout,
    activeChat,
    setActiveChat,
  } = useStore();

  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Загружаем сохранённое состояние коллапса из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  // Сохраняем состояние при изменении
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Мобильные табы (Bottom Tab Bar)
  const bottomTabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: MessageCircle, label: 'Chats', path: '/chats' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: Radio, label: 'Channels', path: '/channels' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  // Пункты десктопного сайдбара
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
    // Закрываем открытый чат при переходе в разделы чатов
    if (activeChat && (path === '/chats' || path === '/groups' || path === '/channels')) {
      setActiveChat(null);
    }
    setIsActionMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <>
      {/* ==================== MOBILE: Bottom Tab Bar ==================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-zinc-900 lg:hidden">
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

          {/* Кнопка More (+) */}
          <button
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            className="flex flex-col items-center justify-center w-full h-full gap-1"
          >
            <Plus className={`w-6 h-6 ${isActionMenuOpen ? 'text-blue-500' : 'text-zinc-400'}`} />
            <span className={`text-xs ${isActionMenuOpen ? 'text-blue-500' : 'text-zinc-400'}`}>
              More
            </span>
          </button>
        </div>
      </div>

      {/* ==================== MOBILE: Action Menu (Search & Create) ==================== */}
      {isActionMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-45 lg:hidden"
            onClick={() => setIsActionMenuOpen(false)}
          />
          <div className="fixed bottom-16 left-4 right-4 z-50 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl lg:hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Actions</h3>
                <button
                  onClick={() => setIsActionMenuOpen(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('/search')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-left"
                >
                  <SearchIcon className="w-6 h-6 text-zinc-400" />
                  <span className="text-white">Search</span>
                </button>
                <button
                  onClick={() => handleNavClick('/create')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors text-left"
                >
                  <Plus className="w-6 h-6 text-zinc-400" />
                  <span className="text-white">Create</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================== DESKTOP: Collapsible Left Sidebar (без скролла) ==================== */}
      <aside
        className={`
          hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:bg-black lg:border-r lg:border-zinc-900
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Профиль + кнопка коллапса */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={currentUser?.avatar || 'https://via.placeholder.com/60'}
                  alt={currentUser?.username}
                  className="w-12 h-12 rounded-full ring-4 ring-zinc-800"
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
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Навигация — без скролла */}
          <nav className="flex-1 py-4 overflow-hidden">
            <div className={`${isSidebarCollapsed ? 'px-3' : 'px-3 space-y-1'}`}>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`
                      group relative w-full flex items-center rounded-lg text-left transition-all
                      ${isSidebarCollapsed ? 'justify-center py-3' : 'gap-4 px-4 py-3'}
                      ${active ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}
                    `}
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" />
                    {!isSidebarCollapsed && <span className="text-base">{item.label}</span>}

                    {/* Tooltip в свёрнутом состоянии */}
                    {isSidebarCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 bg-zinc-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="border-t border-zinc-900 p-4">
            <button
              onClick={handleLogout}
              className={`
                group relative w-full flex items-center rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-red-400 transition-all
                ${isSidebarCollapsed ? 'justify-center py-3' : 'gap-4 px-4 py-3'}
              `}
            >
              <LogOut className="w-6 h-6" />
              {!isSidebarCollapsed && <span className="font-medium">Log Out</span>}

              {isSidebarCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-zinc-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
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