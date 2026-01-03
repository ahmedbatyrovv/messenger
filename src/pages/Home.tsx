import { useStore } from '../store/useStore';
import StoriesBar from '../components/StoriesBar';
import ChatList from '../components/ChatList';
import ChatView from '../components/ChatView';

export default function Home() {
  const { chats, activeChat } = useStore();

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div
        className={`${
          activeChat ? 'hidden lg:flex' : 'flex'
        } w-full lg:w-96 flex-col border-r border-zinc-900`}
      >
        <StoriesBar
          onCreateStory={() => console.log('Создать историю')}
          onViewStory={(storyId) => console.log('Просмотр истории:', storyId)}
        />
        <ChatList chats={chats} />
      </div>
      <div className={`${activeChat ? 'flex' : 'hidden lg:flex'} flex-1`}>
        <ChatView />
      </div>
    </div>
  );
}