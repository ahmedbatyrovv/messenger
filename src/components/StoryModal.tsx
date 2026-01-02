import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatDistanceToNow } from '../utils/time';

interface StoryModalProps {
  storyId: string;
  onClose: () => void;
}

export default function StoryModal({ storyId, onClose }: StoryModalProps) {
  const { stories, users, markStoryAsViewed, currentUser } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const activeStories = stories.filter((s) => s.expiresAt > Date.now());
  const initialIndex = activeStories.findIndex((s) => s.id === storyId);

  useEffect(() => {
    setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
  }, [initialIndex]);

  const currentStory = activeStories[currentIndex];
  const storyUser = users.find((u) => u.id === currentStory?.userId);

  useEffect(() => {
    if (currentStory && currentUser) {
      markStoryAsViewed(currentStory.id, currentUser.id);
    }
  }, [currentStory?.id, currentUser?.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < activeStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  if (!currentStory || !storyUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="absolute left-4 z-10 p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {currentIndex < activeStories.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 z-10 p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      <div className="relative w-full max-w-md h-[90vh] bg-zinc-900 rounded-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="flex gap-1 mb-4">
            {activeStories.map((_, idx) => (
              <div key={idx} className="flex-1 h-0.5 bg-zinc-700 rounded-full overflow-hidden">
                {idx === currentIndex && (
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {idx < currentIndex && (
                  <div className="h-full bg-white w-full" />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <img
              src={storyUser.avatar}
              alt={storyUser.username}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div className="flex-1">
              <p className="text-white font-semibold">{storyUser.username}</p>
              <p className="text-zinc-400 text-sm">
                {formatDistanceToNow(currentStory.timestamp)}
              </p>
            </div>
          </div>
        </div>

        <img
          src={currentStory.imageUrl}
          alt="Story"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
