import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const { chats, users } = useStore();
  const [query, setQuery] = useState('');

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(query.toLowerCase()) ||
      chat.messages.some((msg) =>
        msg.content.toLowerCase().includes(query.toLowerCase())
      )
  );

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-zinc-900">
        <h1 className="text-2xl font-bold text-white mb-4">Search</h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats and users..."
            className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {query ? (
          <>
            {filteredChats.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Chats</h2>
                <div className="space-y-2">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-white">{chat.name}</p>
                        <p className="text-sm text-zinc-500 truncate">
                          {chat.lastMessage?.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredUsers.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Users</h2>
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-12 h-12 rounded-full"
                        />
                        {user.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{user.fullName}</p>
                        <p className="text-sm text-zinc-500">@{user.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredChats.length === 0 && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-500">No results found for "{query}"</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500">Search for chats and users</p>
          </div>
        )}
      </div>
    </div>
  );
}
