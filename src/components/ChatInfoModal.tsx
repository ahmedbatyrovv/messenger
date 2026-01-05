import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Chat } from '../types/index';

interface ChatInfoModalProps {
  chat: Chat;
  onClose: () => void;
}

export default function ChatInfoModal({ chat, onClose }: ChatInfoModalProps) {
  const { users, currentUser, subscribeToChannel, unsubscribeFromChannel } = useStore();

  const admin = chat.adminId ? users.find((u) => u.id === chat.adminId) : null;
  const isChannel = chat.type === 'channel';
  const isAdmin = chat.adminId === currentUser?.id;
  const isSubscribed = chat.participants.includes(currentUser?.id || 'current');

  const handleSubscribe = () => {
    subscribeToChannel(chat.id);
    onClose();
  };

  const handleUnsubscribe = () => {
    if (isSubscribed && !isAdmin) {
      unsubscribeFromChannel(chat.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {isChannel ? 'Channel Info' : 'Chat Info'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <img src={chat.avatar} alt={chat.name} className="w-16 h-16 rounded-full" />
          <div>
            <h3 className="text-lg font-medium text-white">{chat.name}</h3>
            <p className="text-sm text-zinc-400">
              {chat.type.charAt(0).toUpperCase() + chat.type.slice(1)}
            </p>
          </div>
        </div>

        {admin && (
          <p className="text-sm text-zinc-300">
            Admin: <span className="text-white">{admin.fullName}</span>
          </p>
        )}

        <p className="text-sm text-zinc-300">
          Members: <span className="text-white">{chat.participants.length}</span>
        </p>

        {isChannel && !isSubscribed && (
          <button
            onClick={handleSubscribe}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Subscribe
          </button>
        )}

        {isChannel && isSubscribed && !isAdmin && (
          <button
            onClick={handleUnsubscribe}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Unsubscribe
          </button>
        )}
      </div>
    </div>
  );
}