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
  type: 'personal' | 'group' | 'channel';
  name: string;
  avatar: string;
  participants: string[];        // ID пользователей
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  adminId?: string;              // ID админа (для group и channel)
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: number;
  expiresAt: number;
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

  // Действия
  setCurrentUser: (user: User | null) => void;
  setActiveChat: (chatId: string | null) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id'>) => void;
  receiveMessage: (chatId: string, message: Omit<Message, 'id'>) => void;
  createChat: (chat: Omit<Chat, 'id' | 'messages' | 'unreadCount'> & { adminId?: string }) => void;
  createStory: (story: Omit<Story, 'id' | 'views'>) => void;
  markStoryAsViewed: (storyId: string, userId: string) => void;
  markChatAsRead: (chatId: string) => void;
  subscribeToChannel: (chatId: string) => void;
  unsubscribeFromChannel: (chatId: string) => void;
  toggleMobileMenu: () => void;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  logout: () => void;
}

// Мок-данные пользователей
const MOCK_USERS: User[] = [
  {
    id: 'current',
    username: 'you',
    fullName: 'You',
    avatar: 'https://i.pravatar.cc/150?img=32',
    email: 'you@example.com',
    isOnline: true,
  },
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
  {
    id: '3',
    username: 'alex_wilson',
    fullName: 'Alex Wilson',
    avatar: 'https://i.pravatar.cc/150?img=21',
    email: 'alex@example.com',
    isOnline: false,
  },
  {
    id: '4',
    username: 'maria_garcia',
    fullName: 'Maria Garcia',
    avatar: 'https://i.pravatar.cc/150?img=56',
    email: 'maria@example.com',
    isOnline: true,
  },
];

const MOCK_CHATS: Chat[] = [];
const MOCK_STORIES: Story[] = [];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      users: MOCK_USERS,
      currentUser: MOCK_USERS[0], // Ты — первый пользователь
      chats: MOCK_CHATS,
      stories: MOCK_STORIES,
      activeChat: null,
      isMobileMenuOpen: false,
      isSidebarCollapsed: false,

      setCurrentUser: (user) => set({ currentUser: user }),

      setActiveChat: (chatId) =>
        set({ activeChat: chatId, isMobileMenuOpen: false }),

      // Отправка сообщения от текущего пользователя
      addMessage: (chatId, message) =>
        set((state) => {
          const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newMessage = { ...message, id: msgId };

          return {
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: newMessage,
                    // Свои сообщения не увеличивают unreadCount
                    unreadCount: chat.unreadCount,
                  }
                : chat
            ),
          };
        }),

      // Входящее сообщение (от других)
      receiveMessage: (chatId, message) =>
        set((state) => {
          const isActive = state.activeChat === chatId;
          const isOwn = message.senderId === state.currentUser?.id;
          const msgId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const newMessage = { ...message, id: msgId };

          return {
            chats: state.chats.map((chat) =>
              chat.id === chatId
                ? {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: newMessage,
                    unreadCount: !isOwn && !isActive ? chat.unreadCount + 1 : chat.unreadCount,
                  }
                : chat
            ),
          };
        }),

      // Создание чата/группы/канала
      createChat: (chat) =>
        set((state) => {
          const adminId = chat.type === 'personal' ? undefined : state.currentUser?.id || 'current';

          const newChat: Chat = {
            ...chat,
            id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            messages: [],
            unreadCount: 0,
            adminId,
            participants: chat.type === 'channel' 
              ? [adminId]  // в канале изначально только админ
              : chat.participants.includes(adminId)
              ? chat.participants
              : [adminId, ...chat.participants],
          };

          return { chats: [newChat, ...state.chats] }; // новый наверх
        }),

      // Создание сторис
      createStory: (story) =>
        set((state) => ({
          stories: [
            {
              ...story,
              id: `story-${Date.now()}`,
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

      // Подписка на канал
      subscribeToChannel: (chatId) =>
        set((state) => {
          const userId = state.currentUser?.id || 'current';
          return {
            chats: state.chats.map((chat) =>
              chat.id === chatId && chat.type === 'channel' && !chat.participants.includes(userId)
                ? { ...chat, participants: [...chat.participants, userId] }
                : chat
            ),
          };
        }),

      // Отписка от канала
      unsubscribeFromChannel: (chatId) =>
        set((state) => {
          const userId = state.currentUser?.id || 'current';
          return {
            chats: state.chats.map((chat) =>
              chat.id === chatId && chat.type === 'channel' && chat.participants.includes(userId)
                ? { ...chat, participants: chat.participants.filter((id) => id !== userId) }
                : chat
            ),
          };
        }),

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
        // chats: state.chats, // раскомментируй, если хочешь сохранять чаты между сессиями
      }),
    }
  )
);