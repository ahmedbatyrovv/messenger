export interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  isRead: boolean;
}

export interface Chat {
  id: string;
  type: 'personal' | 'group' | 'channel';
  name: string;
  avatar: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  isAdmin?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: number;
  expiresAt: number;
  views: string[];
}
