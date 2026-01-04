import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Send, ArrowLeft, Phone, Video, Info } from 'lucide-react';
import { formatTime } from '../utils/time';

export default function ChatView() {
  const { activeChat, chats, users, addMessage, setActiveChat, markChatAsRead } = useStore();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chat = chats.find((c) => c.id === activeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  useEffect(() => {
    if (chat && chat.unreadCount > 0) {
      markChatAsRead(chat.id);
    }
  }, [chat?.id]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center px-6">
          <p className="text-xl text-zinc-400 mb-2">Select a chat to start messaging</p>
          <p className="text-sm text-zinc-600">
            Choose from your existing conversations or start a new one
          </p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!message.trim()) return;
    if (chat.type === 'channel' && !chat.isAdmin) return;

    addMessage(chat.id, {
      senderId: 'current',
      content: message.trim(),
      timestamp: Date.now(),
      isRead: false,
    });
    setMessage('');
  };

  const getSenderInfo = (senderId: string) => {
    if (senderId === 'current') {
      return { name: 'You', avatar: useStore.getState().currentUser?.avatar };
    }
    const user = users.find((u) => u.id === senderId);
    return { name: user?.fullName || 'Unknown', avatar: user?.avatar };
  };

  const isChannel = chat.type === 'channel';
  const canSendMessage = !isChannel || chat.isAdmin;

  return (
    <div className="flex-1 flex flex-col bg-black">
      {/* Хедер чата — компактный, без лишних отступов сверху */}
      <div className="border-b border-zinc-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveChat(null)}
            className="lg:hidden text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="font-semibold text-white truncate">{chat.name}</h2>
            <p className="text-xs text-zinc-500">
              {chat.type === 'personal' ? 'Active now' : `${chat.participants.length} members`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {chat.type === 'personal' && (
            <>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Video className="w-5 h-5" />
              </button>
            </>
          )}
          <button className="text-zinc-400 hover:text-white transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Область сообщений — начинается ближе к хедеру */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-4">
        {chat.messages.map((msg) => {
          const sender = getSenderInfo(msg.senderId);
          const isOwn = msg.senderId === 'current';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
            >
              {!isOwn && (
                <img
                  src={sender.avatar}
                  alt={sender.name}
                  className="w-8 h-8 rounded-full flex-shrink-0 mt-1"
                />
              )}
              <div className={`flex flex-col ${isOwn ? 'items-end' : ''}`}>
                {!isOwn && chat.type !== 'personal' && (
                  <span className="text-xs text-zinc-500 mb-1 px-1">
                    {sender.name}
                  </span>
                )}
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl ${
                    isOwn ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-100'
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                </div>
                <span className="text-xs text-zinc-600 mt-1 px-1">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Нижняя панель ввода */}
      <div className="border-t border-zinc-900 p-4">
        {canSendMessage ? (
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <div className="text-center py-3 text-zinc-500 text-sm">
            Only admins can send messages in this channel
          </div>
        )}
      </div>
    </div>
  );
}