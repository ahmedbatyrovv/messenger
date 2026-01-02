import { useStore } from '../store/useStore';
import { Mail, AtSign, Calendar } from 'lucide-react';

export default function Profile() {
  const { currentUser, chats, stories } = useStore();

  const myChats = chats.filter((c) => c.type === 'personal');
  const myGroups = chats.filter((c) => c.type === 'group');
  const myChannels = chats.filter((c) => c.type === 'channel');
  const myStories = stories.filter((s) => s.userId === currentUser?.id && s.expiresAt > Date.now());

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-zinc-900">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-zinc-900 rounded-xl p-8 mb-6">
            <div className="flex items-center gap-6 mb-8">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.username}
                className="w-24 h-24 rounded-full border-4 border-zinc-800"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {currentUser?.fullName}
                </h2>
                <p className="text-zinc-400">@{currentUser?.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-zinc-400">Active now</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail className="w-5 h-5" />
                <span>{currentUser?.username}@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <AtSign className="w-5 h-5" />
                <span>@{currentUser?.username}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <Calendar className="w-5 h-5" />
                <span>Joined December 2024</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-900 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-white mb-2">{myChats.length}</p>
              <p className="text-sm text-zinc-400">Chats</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-white mb-2">{myGroups.length}</p>
              <p className="text-sm text-zinc-400">Groups</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-white mb-2">{myChannels.length}</p>
              <p className="text-sm text-zinc-400">Channels</p>
            </div>
            <div className="bg-zinc-900 rounded-xl p-6 text-center">
              <p className="text-3xl font-bold text-white mb-2">{myStories.length}</p>
              <p className="text-sm text-zinc-400">Stories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
