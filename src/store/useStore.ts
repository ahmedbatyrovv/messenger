import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Chat, Story, Message } from '../types';

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  email: string;
  isOnline?: boolean;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  chats: Chat[];
  stories: Story[];
  activeChat: string | null;
  isMobileMenuOpen: boolean;

  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
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
  {
    id: '1',
    username: 'john_doe',
    fullName: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=12',
    email: 'john@example.com',
    isOnline: true,
  },
  {
    id: '2',
    username: 'jane_smith',
    fullName: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=45',
    email: 'jane@example.com',
    isOnline: true,
  },
];

const MOCK_CHATS: Chat[] = [];
const MOCK_STORIES: Story[] = [];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: MOCK_USERS,
      currentUser: null,
      chats: MOCK_CHATS,
      stories: MOCK_STORIES,
      activeChat: null,
      isMobileMenuOpen: false,

      setCurrentUser: (user) => set({ currentUser: user }),

      addUser: (newUser) =>
        set((state) => {
          const exists = state.users.some(
            (u) =>
              u.username && u.username.toLowerCase() === newUser.username.toLowerCase() ||
              u.email && u.email.toLowerCase() === newUser.email.toLowerCase()
          );

          if (exists) {
            return state;
          }

          return {
            users: [...state.users, newUser],
          };
        }),

      setActiveChat: (chatId) =>
        set({ activeChat: chatId, isMobileMenuOpen: false }),

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
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
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
      partialize: (state) => ({
        users: state.users,
        currentUser: state.currentUser,
        chats: state.chats,
        stories: state.stories,
      }),
    }
  )
); 