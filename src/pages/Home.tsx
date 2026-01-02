import { useState } from 'react';
import { useStore } from '../store/useStore';
import StoriesBar from '../components/StoriesBar';
import ChatList from '../components/ChatList';
import ChatView from '../components/ChatView';
import StoryModal from '../components/StoryModal';
import CreateModal from '../components/CreateModal';

export default function Home() {
  const { chats, activeChat } = useStore();
  const [viewingStory, setViewingStory] = useState<string | null>(null);
  const [creatingStory, setCreatingStory] = useState(false);

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div
        className={`${
          activeChat ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-96 flex-col border-r border-zinc-900`}
      >
        <StoriesBar
          onCreateStory={() => setCreatingStory(true)}
          onViewStory={setViewingStory}
        />
        <ChatList chats={chats} />
      </div>

      <div className={`${activeChat ? 'flex' : 'hidden lg:flex'} flex-1`}>
        <ChatView />
      </div>

      {viewingStory && (
        <StoryModal storyId={viewingStory} onClose={() => setViewingStory(null)} />
      )}

      {creatingStory && (
        <CreateModal type="story" onClose={() => setCreatingStory(false)} />
      )}
    </div>
  );
}
