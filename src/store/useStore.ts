import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Chat, Story, Message } from '../types';

// Добавляем email в типы (если ещё не добавил)
export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isOnline?: boolean;        // опционально для новых пользователей
  email: string;             // ← ОБЯЗАТЕЛЬНО ДОБАВИТЬ!
}

interface AppState {
  currentUser: User | null;
  users: User[];
  chats: Chat[];
  stories: Story[];
  activeChat: string | null;
  isMobileMenuOpen: boolean;

  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;                    // ← НОВАЯ ФУНКЦИЯ!
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
  // ... твои мок-юзеры (можно оставить как есть)
  { id: '1', username: 'john_doe', fullName: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=12', isOnline: true, email: 'john@example.com' },
  { id: '2', username: 'jane_smith', fullName: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=45', isOnline: true, email: 'jane@example.com' },
  // ... остальные тоже добавь email, если хочешь
];

const MOCK_CHATS: Chat[] = [ /* ... как у тебя было */ ];
const MOCK_STORIES: Story[] = [ /* ... как у тебя было */ ];

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

      // ← ВОТ ЭТА ФУНКЦИЯ РЕШАЕТ ВСЮ ПРОБЛЕМУ!
      addUser: (newUser) =>
        set((state) => ({
          users: [...state.users, newUser],
        })),

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
                  unreadCount: chat.unreadCount + 1,
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