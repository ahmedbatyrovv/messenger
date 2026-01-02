import { useStore } from '../store/useStore';
import { UserPlus, Bell } from 'lucide-react';

export default function RightSidebar() {
  const { users, stories } = useStore();

  const suggestions = users.slice(0, 5);

  const notifications = [
    { id: 1, type: 'message', text: 'Jane Smith sent you a message', time: '5m ago' },
    { id: 2, type: 'story', text: 'Emma Wilson added a new story', time: '15m ago' },
    { id: 3, type: 'group', text: 'You were added to Design Team', time: '1h ago' },
    { id: 4, type: 'channel', text: 'Tech News Daily posted an update', time: '2h ago' },
  ];

  const recentStoryUsers = stories.slice(0, 3).map((story) => {
    const user = users.find((u) => u.id === story.userId);
    return user;
  }).filter(Boolean);

  return (
    <aside className="hidden xl:block w-80 bg-black border-l border-zinc-900 p-6 overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <p className="text-sm text-zinc-300">{notif.text}</p>
              <p className="text-xs text-zinc-500 mt-1">{notif.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus className="w-5 h-5 text-zinc-400" />
          <h2 className="text-lg font-semibold text-white">Suggested for you</h2>
        </div>
        <div className="space-y-3">
          {suggestions.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.fullName}
                </p>
                <p className="text-xs text-zinc-500 truncate">@{user.username}</p>
              </div>
              <button className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Active Stories</h2>
        <div className="space-y-3">
          {recentStoryUsers.map((user) => (
            <div
              key={user?.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="w-full h-full rounded-full border-2 border-black"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-zinc-500">2h ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
