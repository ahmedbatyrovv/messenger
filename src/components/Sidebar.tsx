import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Home,
  Search,
  MessageCircle,
  Users,
  Radio,
  PlayCircle,
  PlusSquare,
  User,
  Menu,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isMobileMenuOpen, toggleMobileMenu, logout, activeChat } = useStore();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: MessageCircle, label: 'Chats', path: '/chats' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: Radio, label: 'Channels', path: '/channels' },
    { icon: PlayCircle, label: 'Stories', path: '/stories' },
    { icon: PlusSquare, label: 'Create', path: '/create' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    toggleMobileMenu();
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    toggleMobileMenu();
  };

  return (
    <>
      {/* Бургер + Messenger — видны ТОЛЬКО когда нет активного чата */}
      {/* На мобильных скрывается в чате, на десктопе — всегда видно */}
      {!isMobileMenuOpen && !activeChat && (
        <div className="fixed top-4 left-4 z-50 flex items-center gap-3 lg:flex">
          <button
            onClick={toggleMobileMenu}
            className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
          <span className="text-xl font-bold text-white hidden sm:block">
            Messenger
          </span>
        </div>
      )}

      {/* Боковая панель */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-black border-r border-zinc-900
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-zinc-900">
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatar || 'https://via.placeholder.com/60'}
                alt={currentUser?.username}
                className="w-16 h-16 rounded-full ring-4 ring-zinc-800"
              />
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-white truncate">
                  {currentUser?.fullName || 'Guest'}
                </p>
                <p className="text-sm text-zinc-400 truncate">
                  @{currentUser?.username || 'unknown'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left
                      transition-all duration-200
                      ${
                        isActive
                          ? 'bg-zinc-800 text-white font-medium'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                      }
                    `}
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" />
                    <span className="text-base">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-zinc-900 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-red-400 transition-all"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay — только на мобильных */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-30"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
}