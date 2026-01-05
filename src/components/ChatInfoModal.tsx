import {
  X,
  Bell,
  BellOff,
  Search,
  Phone,
  Video,
  Link2,
  Users,
  Edit3,
  UserPlus,
  LogOut,
  Ban,
  Trash2,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Chat, User } from '../types';

interface ChatInfoModalProps {
  chat: Chat;
  onClose: () => void;
}

export default function ChatInfoModal({ chat, onClose }: ChatInfoModalProps) {
  const { users, currentUser, subscribeToChannel, unsubscribeFromChannel } = useStore();

  const currentUserId = currentUser?.id || 'current';
  const isAdmin = chat.adminId === currentUserId;
  const isSubscribed = chat.participants.includes(currentUserId);

  // Собеседник в личном чате
  const opponent = chat.type === 'personal'
    ? users.find((u) => u.id !== currentUserId && chat.participants.includes(u.id))
    : null;

  // Админ канала/группы
  const adminUser = chat.adminId ? users.find((u) => u.id === chat.adminId) : null;

  // Участники (кроме себя)
  const memberUsers = chat.participants
    .filter((id) => id !== currentUserId)
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean) as User[];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex flex-col">
      {/* Overlay + модалка */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20"> {/* pb-20 — безопасная зона на мобилке */}
        <div className="bg-zinc-900 rounded-t-3xl overflow-hidden shadow-2xl mx-auto w-full max-w-md">
          {/* Заголовок */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
            <h2 className="text-xl font-semibold text-white">
              {chat.type === 'personal'
                ? 'Contact Info'
                : chat.type === 'group'
                ? 'Group Info'
                : 'Channel Info'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-zinc-400" />
            </button>
          </div>

          <div className="p-6 space-y-6 pb-8">
            {/* Аватар и основная информация */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-zinc-800">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mt-4">{chat.name}</h3>

              {chat.type === 'personal' && opponent && (
                <>
                  <p className="text-zinc-400 text-lg">@{opponent.username}</p>
                  <p className="text-green-500 text-sm mt-1 font-medium">Online</p>
                </>
              )}

              {chat.type !== 'personal' && (
                <p className="text-zinc-400 text-lg mt-2">
                  {chat.participants.length}{' '}
                  {chat.type === 'channel' ? 'subscribers' : 'members'}
                </p>
              )}
            </div>

            {/* Описание (группа/канал) */}
            {chat.description && (
              <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                <p className="text-zinc-300 text-sm leading-relaxed">{chat.description}</p>
              </div>
            )}

            {/* Личный чат */}
            {chat.type === 'personal' && (
              <div className="space-y-1">
                <button className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800 rounded-xl transition-colors">
                  <Phone className="w-6 h-6 text-zinc-400" />
                  <span className="text-white text-lg">Call</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800 rounded-xl transition-colors">
                  <Video className="w-6 h-6 text-zinc-400" />
                  <span className="text-white text-lg">Video Call</span>
                </button>
                <button className="w-full flex items-center gap-4 p-4 hover:bg-zinc-800 rounded-xl transition-colors">
                  <Search className="w-6 h-6 text-zinc-400" />
                  <span className="text-white text-lg">Search Messages</span>
                </button>

                <div className="pt-4 space-y-1">
                  <button className="w-full flex items-center gap-4 p-4 hover:bg-red-900/30 rounded-xl transition-colors text-red-500">
                    <Ban className="w-6 h-6" />
                    <span className="text-lg">Block User</span>
                  </button>
                  <button className="w-full flex items-center gap-4 p-4 hover:bg-red-900/30 rounded-xl transition-colors text-red-500">
                    <Trash2 className="w-6 h-6" />
                    <span className="text-lg">Delete Chat</span>
                  </button>
                </div>
              </div>
            )}

            {/* Группа */}
            {chat.type === 'group' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium text-lg">
                    {chat.participants.length} members
                  </p>
                  {isAdmin && (
                    <button className="flex items-center gap-2 text-blue-500">
                      <UserPlus className="w-6 h-6" />
                      <span className="text-base">Add Members</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {adminUser && (
                    <div className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-xl">
                      <img src={adminUser.avatar} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="text-white font-medium">{adminUser.fullName}</p>
                        <p className="text-xs text-zinc-400">creator</p>
                      </div>
                    </div>
                  )}
                  {memberUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-4 p-3 hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                      <img src={user.avatar} className="w-12 h-12 rounded-full" />
                      <p className="text-white font-medium">{user.fullName}</p>
                    </div>
                  ))}
                </div>

                {isAdmin && (
                  <button className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                    <Edit3 className="w-6 h-6" />
                    <span className="text-white text-lg">Edit Group</span>
                  </button>
                )}

                <button className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 hover:bg-red-700 rounded-xl transition-colors text-white font-semibold text-lg">
                  <LogOut className="w-6 h-6" />
                  <span>Leave Group</span>
                </button>
              </div>
            )}

            {/* Канал */}
            {chat.type === 'channel' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-zinc-400 bg-zinc-800/50 rounded-xl p-4">
                  <Link2 className="w-6 h-6 flex-shrink-0" />
                  <span className="text-sm break-all">
                    t.me/{chat.name.toLowerCase().replace(/\s+/g, '_')}
                  </span>
                </div>

                <button className="w-full flex items-center justify-between p-5 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <Bell className="w-6 h-6" />
                    <span className="text-white text-lg">Notifications</span>
                  </div>
                  <BellOff className="w-6 h-6 text-zinc-500" />
                </button>

                {!isSubscribed ? (
                  <button
                    onClick={() => {
                      subscribeToChannel(chat.id);
                      onClose();
                    }}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-2xl transition-colors shadow-lg"
                  >
                    JOIN CHANNEL
                  </button>
                ) : (
                  <div className="space-y-4">
                    {!isAdmin && (
                      <button
                        onClick={() => {
                          unsubscribeFromChannel(chat.id);
                          onClose();
                        }}
                        className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white text-lg rounded-xl transition-colors"
                      >
                        Leave Channel
                      </button>
                    )}

                    {isAdmin && (
                      <div className="space-y-3">
                        <button className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                          <Edit3 className="w-6 h-6" />
                          <span className="text-white text-lg">Edit Channel</span>
                        </button>
                        <button className="w-full flex items-center justify-center gap-3 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors">
                          <Users className="w-6 h-6" />
                          <span className="text-white text-lg sconfitta">Statistics</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}