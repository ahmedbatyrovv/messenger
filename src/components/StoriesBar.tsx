import { Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';

interface StoriesBarProps {
  onCreateStory: () => void;
  onViewStory: (storyId: string) => void;
}

export default function StoriesBar({ onCreateStory, onViewStory }: StoriesBarProps) {
  const { stories, users, currentUser } = useStore();

  const activeStories = stories.filter((s) => s.expiresAt > Date.now());

  const userStories = activeStories.filter((s) => s.userId === currentUser?.id);
  const othersStories = activeStories.filter((s) => s.userId !== currentUser?.id);

  return (
    <div className="border-b border-zinc-900 bg-black">
      <div className="flex items-center gap-4 p-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={onCreateStory}
          className="flex-shrink-0 flex flex-col items-center gap-2 group"
        >
          <div className="relative">
            <img
              src={currentUser?.avatar}
              alt="Your story"
              className="w-16 h-16 rounded-full border-2 border-zinc-800"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-black">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">
            Your story
          </span>
        </button>

        {othersStories.map((story) => {
          const user = users.find((u) => u.id === story.userId);
          const hasViewed = story.views.includes(currentUser?.id || '');

          return (
            <button
              key={story.id}
              onClick={() => onViewStory(story.id)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div
                className={`relative rounded-full p-0.5 ${
                  hasViewed
                    ? 'bg-zinc-700'
                    : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
                }`}
              >
                <img
                  src={user?.avatar}
                  alt={user?.username}
                  className="w-16 h-16 rounded-full border-2 border-black"
                />
              </div>
              <span className="text-xs text-zinc-400 group-hover:text-white transition-colors truncate max-w-[70px]">
                {user?.username}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
