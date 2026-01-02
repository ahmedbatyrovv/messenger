import { useState } from 'react';
import CreateModal from '../components/CreateModal';
import { MessageCircle, Users, Radio, PlayCircle } from 'lucide-react';

export default function Create() {
  const [modalType, setModalType] = useState<'chat' | 'group' | 'channel' | 'story' | null>(null);

  const options = [
    {
      type: 'chat' as const,
      icon: MessageCircle,
      title: 'New Chat',
      description: 'Start a conversation with someone',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      type: 'group' as const,
      icon: Users,
      title: 'New Group',
      description: 'Create a group with multiple people',
      color: 'from-green-500 to-emerald-500',
    },
    {
      type: 'channel' as const,
      icon: Radio,
      title: 'New Channel',
      description: 'Create a public broadcast channel',
      color: 'from-purple-500 to-pink-500',
    },
    {
      type: 'story' as const,
      icon: PlayCircle,
      title: 'New Story',
      description: 'Share a moment that lasts 24 hours',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-zinc-900">
        <h1 className="text-2xl font-bold text-white">Create</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                onClick={() => setModalType(option.type)}
                className="group relative overflow-hidden p-6 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <div className="relative">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${option.color} mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {option.title}
                  </h2>
                  <p className="text-zinc-400">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {modalType && (
        <CreateModal type={modalType} onClose={() => setModalType(null)} />
      )}
    </div>
  );
}
