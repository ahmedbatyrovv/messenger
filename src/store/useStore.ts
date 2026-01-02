import { create } from 'zustand';
import { User, Chat, Story, Message } from '../types';
import { persist } from 'zustand/middleware';

interface AppState {
  currentUser: User | null;
  users: User[];
  chats: Chat[];
  stories: Story[];
  activeChat: string | null;
  isMobileMenuOpen: boolean;

  setCurrentUser: (user: User | null) => void;
  setActiveChat: (chatId: string | null) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id'>) => void;
  createChat: (chat: Omit<Chat, 'id' | 'messages' | 'unreadCount'>) => void;
  createStory: (story: Omit<Story, 'id' | 'views'>) => void;
  markStoryAsViewed: (storyId: string, userId: string) => void;
  markChatAsRead: (chatId: string) => void;
  toggleMobileMenu: () => void;
  logout: () => void;
}

const MOCK_USERS: User[] = [
  { id: '1', username: 'john_doe', fullName: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=12', isOnline: true },
  { id: '2', username: 'jane_smith', fullName: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=45', isOnline: true },
  { id: '3', username: 'alex_johnson', fullName: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=33', isOnline: false },
  { id: '4', username: 'emma_wilson', fullName: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?img=47', isOnline: true },
  { id: '5', username: 'michael_brown', fullName: 'Michael Brown', avatar: 'https://i.pravatar.cc/150?img=59', isOnline: false },
  { id: '6', username: 'sarah_davis', fullName: 'Sarah Davis', avatar: 'https://i.pravatar.cc/150?img=32', isOnline: true },
  { id: '7', username: 'david_miller', fullName: 'David Miller', avatar: 'https://i.pravatar.cc/150?img=68', isOnline: true },
  { id: '8', username: 'lisa_moore', fullName: 'Lisa Moore', avatar: 'https://i.pravatar.cc/150?img=36', isOnline: false },
];

const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    type: 'personal',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=45',
    participants: ['current', '2'],
    messages: [
      { id: 'm1', senderId: '2', content: 'Hey! How are you?', timestamp: Date.now() - 3600000, isRead: true },
      { id: 'm2', senderId: 'current', content: 'Im good! What about you?', timestamp: Date.now() - 3000000, isRead: true },
      { id: 'm3', senderId: '2', content: 'Great! Want to catch up later?', timestamp: Date.now() - 1800000, isRead: false },
    ],
    lastMessage: { id: 'm3', senderId: '2', content: 'Great! Want to catch up later?', timestamp: Date.now() - 1800000, isRead: false },
    unreadCount: 1,
  },
  {
    id: 'chat2',
    type: 'group',
    name: 'Weekend Plans',
    avatar: 'https://i.pravatar.cc/150?img=50',
    participants: ['current', '2', '3', '4'],
    messages: [
      { id: 'm4', senderId: '3', content: 'Anyone up for hiking this weekend?', timestamp: Date.now() - 7200000, isRead: true },
      { id: 'm5', senderId: '4', content: 'Count me in!', timestamp: Date.now() - 3600000, isRead: true },
      { id: 'm6', senderId: '2', content: 'Sounds good to me', timestamp: Date.now() - 1200000, isRead: false },
    ],
    lastMessage: { id: 'm6', senderId: '2', content: 'Sounds good to me', timestamp: Date.now() - 1200000, isRead: false },
    unreadCount: 2,
    isAdmin: true,
  },
  {
    id: 'chat3',
    type: 'channel',
    name: 'Tech News Daily',
    avatar: 'https://i.pravatar.cc/150?img=70',
    participants: ['current', 'admin'],
    messages: [
      { id: 'm7', senderId: 'admin', content: 'New AI breakthrough announced today!', timestamp: Date.now() - 86400000, isRead: true },
      { id: 'm8', senderId: 'admin', content: 'Major tech conference starting next week', timestamp: Date.now() - 43200000, isRead: false },
    ],
    lastMessage: { id: 'm8', senderId: 'admin', content: 'Major tech conference starting next week', timestamp: Date.now() - 43200000, isRead: false },
    unreadCount: 1,
    isAdmin: false,
  },
  {
    id: 'chat4',
    type: 'personal',
    name: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=33',
    participants: ['current', '3'],
    messages: [
      { id: 'm9', senderId: 'current', content: 'Did you finish the project?', timestamp: Date.now() - 172800000, isRead: true },
      { id: 'm10', senderId: '3', content: 'Yes, just submitted it!', timestamp: Date.now() - 86400000, isRead: true },
    ],
    lastMessage: { id: 'm10', senderId: '3', content: 'Yes, just submitted it!', timestamp: Date.now() - 86400000, isRead: true },
    unreadCount: 0,
  },
  {
    id: 'chat5',
    type: 'group',
    name: 'Design Team',
    avatar: 'https://i.pravatar.cc/150?img=55',
    participants: ['current', '5', '6', '7'],
    messages: [
      { id: 'm11', senderId: '5', content: 'New mockups are ready for review', timestamp: Date.now() - 14400000, isRead: true },
      { id: 'm12', senderId: '6', content: 'Looking good!', timestamp: Date.now() - 7200000, isRead: true },
    ],
    lastMessage: { id: 'm12', senderId: '6', content: 'Looking good!', timestamp: Date.now() - 7200000, isRead: true },
    unreadCount: 0,
    isAdmin: false,
  },
];

const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    userId: '2',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    timestamp: Date.now() - 3600000,
    expiresAt: Date.now() + 82800000,
    views: [],
  },
  {
    id: 's2',
    userId: '4',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    timestamp: Date.now() - 7200000,
    expiresAt: Date.now() + 79200000,
    views: [],
  },
  {
    id: 's3',
    userId: '6',
    imageUrl: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=400',
    timestamp: Date.now() - 10800000,
    expiresAt: Date.now() + 75600000,
    views: [],
  },
  {
    id: 's4',
    userId: '7',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
    timestamp: Date.now() - 14400000,
    expiresAt: Date.now() + 72000000,
    views: [],
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      users: MOCK_USERS,
      chats: MOCK_CHATS,
      stories: MOCK_STORIES,
      activeChat: null,
      isMobileMenuOpen: false,

      setCurrentUser: (user) => set({ currentUser: user }),

      setActiveChat: (chatId) => set({ activeChat: chatId, isMobileMenuOpen: false }),

      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { ...message, id: `m${Date.now()}` },
                  ],
                  lastMessage: { ...message, id: `m${Date.now()}` },
                }
              : chat
          ),
        })),

      createChat: (chat) =>
        set((state) => ({
          chats: [
            {
              ...chat,
              id: `chat${Date.now()}`,
              messages: [],
              unreadCount: 0,
            },
            ...state.chats,
          ],
        })),

      createStory: (story) =>
        set((state) => ({
          stories: [
            {
              ...story,
              id: `s${Date.now()}`,
              views: [],
            },
            ...state.stories,
          ],
        })),

      markStoryAsViewed: (storyId, userId) =>
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId && !story.views.includes(userId)
              ? { ...story, views: [...story.views, userId] }
              : story
          ),
        })),

      markChatAsRead: (chatId) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, unreadCount: 0 }
              : chat
          ),
        })),

      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

      logout: () =>
        set({
          currentUser: null,
          activeChat: null,
          isMobileMenuOpen: false,
        }),
    }),
    {
      name: 'instagram-messenger-storage',
    }
  )
);
