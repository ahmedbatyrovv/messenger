import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

interface CreateModalProps {
  type: 'chat' | 'group' | 'channel' | 'story';
  onClose: () => void;
}

export default function CreateModal({ type, onClose }: CreateModalProps) {
  const { users, createChat, createStory, currentUser } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');

  const availableUsers = users.filter((u) => u.id !== 'current');

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    if (type === 'story') {
      if (!imageUrl) return;

      createStory({
        userId: currentUser?.id || 'current',
        imageUrl,
        timestamp: Date.now(),
        expiresAt: Date.now() + 86400000,
      });

      onClose();
      navigate('/stories');
      return;
    }

    if (!name || (type !== 'chat' && selectedUsers.length === 0)) return;

    if (type === 'chat' && selectedUsers.length === 1) {
      const user = users.find((u) => u.id === selectedUsers[0]);
      if (user) {
        createChat({
          type: 'personal',
          name: user.fullName,
          avatar: user.avatar,
          participants: ['current', user.id],
        });
      }
    } else if (type === 'group') {
      createChat({
        type: 'group',
        name,
        avatar: 'https://i.pravatar.cc/150?img=55',
        participants: ['current', ...selectedUsers],
        isAdmin: true,
      });
    } else if (type === 'channel') {
      createChat({
        type: 'channel',
        name,
        avatar: 'https://i.pravatar.cc/150?img=70',
        participants: ['current', 'admin'],
        isAdmin: true,
      });
    }

    onClose();
    navigate('/chats');
  };

  const getTitle = () => {
    switch (type) {
      case 'chat':
        return 'New Chat';
      case 'group':
        return 'New Group';
      case 'channel':
        return 'New Channel';
      case 'story':
        return 'Create Story';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-xl font-semibold text-white">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {type === 'story' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>

              {imageUrl && (
                <div className="aspect-[9/16] rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 bg-zinc-800 rounded-lg">
                <p className="text-sm text-zinc-400">
                  Try these sample images:
                </p>
                <div className="mt-2 space-y-1">
                  {[
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
                    'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400',
                  ].map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageUrl(url)}
                      className="text-xs text-blue-400 hover:text-blue-300 block truncate w-full text-left"
                    >
                      Sample {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {type !== 'chat' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    {type === 'channel' ? 'Channel Name' : 'Group Name'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`Enter ${type} name`}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                </div>
              )}

              {type !== 'channel' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Select {type === 'chat' ? 'User' : 'Members'}
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => toggleUser(user.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          selectedUsers.includes(user.id)
                            ? 'bg-blue-600'
                            : 'bg-zinc-800 hover:bg-zinc-750'
                        }`}
                      >
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 text-left">
                          <p className="text-white font-medium">{user.fullName}</p>
                          <p className="text-sm text-zinc-400">@{user.username}</p>
                        </div>
                        {selectedUsers.includes(user.id) && (
                          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleCreate}
            disabled={
              type === 'story'
                ? !imageUrl
                : type === 'chat'
                ? selectedUsers.length !== 1
                : !name || (type !== 'channel' && selectedUsers.length === 0)
            }
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {type === 'story' ? 'Share Story' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
