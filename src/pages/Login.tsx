import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Instagram } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser, users } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    const user = users.find((u) => u.username === username);

    if (!user) {
      setError('User not found');
      return;
    }

    setCurrentUser({
      ...user,
      id: 'current',
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <div className="flex justify-center mb-8">
            <Instagram className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-2xl font-semibold text-white text-center mb-8">
            Messenger
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-800">
            <p className="text-zinc-400 text-sm text-center mb-4">
              Demo users to try:
            </p>
            <div className="space-y-2">
              {users.slice(0, 3).map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setUsername(user.username);
                    setPassword('demo');
                  }}
                  className="w-full text-left px-4 py-2 bg-zinc-800 hover:bg-zinc-750 rounded-lg text-zinc-300 text-sm transition-colors"
                >
                  {user.username}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
