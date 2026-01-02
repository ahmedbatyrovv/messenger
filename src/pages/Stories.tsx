import { useState } from 'react';
import { useStore } from '../store/useStore';
import StoryModal from '../components/StoryModal';
import CreateModal from '../components/CreateModal';
import { Plus, Clock } from 'lucide-react';
import { formatDistanceToNow } from '../utils/time';

export default function Stories() {
  const { stories, users, currentUser } = useStore();
  const [viewingStory, setViewingStory] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const activeStories = stories.filter((s) => s.expiresAt > Date.now());
  const myStories = activeStories.filter((s) => s.userId === currentUser?.id);
  const othersStories = activeStories.filter((s) => s.userId !== currentUser?.id);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-zinc-900">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Stories</h1>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Create Story</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {myStories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Your Stories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {myStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => setViewingStory(story.id)}
                  className="relative aspect-[9/16] rounded-lg overflow-hidden group"
                >
                  <img
                    src={story.imageUrl}
                    alt="Your story"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentUser?.avatar}
                        alt="You"
                        className="w-8 h-8 rounded-full border-2 border-white"
                      />
                      <span className="text-white text-sm font-semibold">Your Story</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/75">
                    <div className="flex items-center gap-2 text-white text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(story.timestamp)} ago</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {othersStories.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Stories from Others
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {othersStories.map((story) => {
                const user = users.find((u) => u.id === story.userId);
                const hasViewed = story.views.includes(currentUser?.id || '');

                return (
                  <button
                    key={story.id}
                    onClick={() => setViewingStory(story.id)}
                    className="relative aspect-[9/16] rounded-lg overflow-hidden group"
                  >
                    <img
                      src={story.imageUrl}
                      alt={user?.username}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent p-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`rounded-full p-0.5 ${
                            hasViewed
                              ? 'bg-zinc-700'
                              : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
                          }`}
                        >
                          <img
                            src={user?.avatar}
                            alt={user?.username}
                            className="w-8 h-8 rounded-full border-2 border-black"
                          />
                        </div>
                        <span className="text-white text-sm font-semibold">
                          {user?.username}
                        </span>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/75">
                      <div className="flex items-center gap-2 text-white text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(story.timestamp)} ago</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeStories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-500">No active stories</p>
          </div>
        )}
      </div>

      {viewingStory && (
        <StoryModal storyId={viewingStory} onClose={() => setViewingStory(null)} />
      )}

      {isCreating && (
        <CreateModal type="story" onClose={() => setIsCreating(false)} />
      )}
    </div>
  );
}
