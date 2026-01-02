import { useStore } from '../store/useStore';
import { Chat } from '../types';
import { formatDistanceToNow } from '../utils/time';

interface ChatListProps {
  chats: Chat[];
}

export default function ChatList({ chats }: ChatListProps) {
  const { setActiveChat, activeChat, users } = useStore();

  const getSenderName = (senderId: string) => {
    if (senderId === 'current') return 'You';
    const user = users.find((u) => u.id === senderId);
    return user?.fullName.split(' ')[0] || 'Unknown';
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-zinc-500">No chats found</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-900">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-zinc-900 transition-colors ${
                activeChat === chat.id ? 'bg-zinc-900' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-14 h-14 rounded-full"
                />
                {chat.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {chat.unreadCount}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white truncate">
                    {chat.name}
                  </h3>
                  {chat.lastMessage && (
                    <span className="text-xs text-zinc-500 flex-shrink-0 ml-2">
                      {formatDistanceToNow(chat.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p
                    className={`text-sm truncate ${
                      chat.unreadCount > 0
                        ? 'text-white font-medium'
                        : 'text-zinc-500'
                    }`}
                  >
                    {chat.lastMessage.senderId !== 'current' &&
                      chat.type !== 'personal' &&
                      `${getSenderName(chat.lastMessage.senderId)}: `}
                    {chat.lastMessage.content}
                  </p>
                )}
                {chat.type === 'channel' && (
                  <span className="inline-block mt-1 text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">
                    Channel
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
