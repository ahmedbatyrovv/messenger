import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Instagram,
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
  const { currentUser, isMobileMenuOpen, toggleMobileMenu, logout } = useStore();

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
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg border border-zinc-800"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-black border-r border-zinc-900
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-3 mb-8 px-2">
            <Instagram className="w-8 h-8 text-white" />
            <span className="text-xl font-semibold text-white">Messenger</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobileMenuOpen) toggleMobileMenu();
                  }}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-lg
                    transition-colors
                    ${
                      isActive
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-zinc-900 pt-4 mt-4">
            <div className="flex items-center gap-3 px-4 mb-4">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser?.fullName}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  @{currentUser?.username}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              <LogOut className="w-6 h-6" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
}
