import { useState } from 'react';
import { useStore } from '../store/useStore';
import ChatList from '../components/ChatList';
import ChatView from '../components/ChatView';
import CreateModal from '../components/CreateModal';
import { Plus } from 'lucide-react';

export default function Channels() {
  const { chats, activeChat } = useStore();
  const [isCreating, setIsCreating] = useState(false);

  const channels = chats.filter((chat) => chat.type === 'channel');

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div
        className={`${
          activeChat ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-96 flex-col border-r border-zinc-900`}
      >
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Channels</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
        <ChatList chats={channels} />
      </div>

      <div className={`${activeChat ? 'flex' : 'hidden lg:flex'} flex-1`}>
        <ChatView />
      </div>

      {isCreating && (
        <CreateModal type="channel" onClose={() => setIsCreating(false)} />
      )}
    </div>
  );
}
