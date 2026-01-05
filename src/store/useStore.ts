// src/store/useStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  email: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  isRead?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  type: 'personal' | 'group' | 'channel';
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  isAdmin?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  image: string;
  timestamp: number;
  views: string[];
}

interface AppState {
  currentUser: User | null;
  users: User[];
  chats: Chat[];
  stories: Story[];
  activeChat: string | null;
  isMobileMenuOpen: boolean;
  isSidebarCollapsed: boolean;

  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  setActiveChat: (chatId: string | null) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id'>) => void;
  receiveMessage: (chatId: string, message: Omit<Message, 'id'>) => void;
  createChat: (chat: Omit<Chat, 'id' | 'messages' | 'unreadCount'>) => void;
  createStory: (story: Omit<Story, 'id' | 'views'>) => void;
  markStoryAsViewed: (storyId: string, userId: string) => void;
  markChatAsRead: (chatId: string) => void;
  toggleMobileMenu: () => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
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
      isSidebarCollapsed: false,

      setCurrentUser: (user) => set({ currentUser: user }),

      addUser: (newUser) =>
        set((state) => {
          const usernameLower = newUser.username.toLowerCase();
          const emailLower = newUser.email.toLowerCase();
          const exists = state.users.some(
            (u) =>
              u.username.toLowerCase() === usernameLower ||
              u.email.toLowerCase() === emailLower
          );
          return exists ? state : { users: [...state.users, newUser] };
        }),

      setActiveChat: (chatId) =>
        set({ activeChat: chatId, isMobileMenuOpen: false }),

      addMessage: (chatId, message) =>
        set((state) => {
          const isOwn = message.senderId === state.currentUser?.id;
          const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          return {
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: [...chat.messages, { ...message, id: msgId }],
                    lastMessage: { ...message, id: msgId },
                    unreadCount: isOwn ? chat.unreadCount : chat.unreadCount + 1,
                  }
                : chat
            ),
          };
        }),

      receiveMessage: (chatId, message) =>
        set((state) => {
          const isOwn = message.senderId === state.currentUser?.id;
          const isActive = state.activeChat === chatId;
          const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          return {
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: [...chat.messages, { ...message, id: msgId }],
                    lastMessage: { ...message, id: msgId },
                    unreadCount: !isOwn && !isActive ? chat.unreadCount + 1 : chat.unreadCount,
                  }
                : chat
            ),
          };
        }),

      createChat: (chat) =>
        set((state) => ({
          chats: [
            {
              ...chat,
              id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
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
              id: `s-${Date.now()}`,
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

      toggleSidebarCollapsed: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),

      logout: () =>
        set({
          currentUser: null,
          activeChat: null,
          isMobileMenuOpen: false,
        }),
    }),
    {
      name: 'messenger-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isSidebarCollapsed: state.isSidebarCollapsed,
        // chats: state.chats, // uncomment if you want offline persistence
      }),
    }
  )
);