import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register'; // ← ЭТОГО НЕ БЫЛО! Добавляем импорт
import Home from './pages/Home';
import Search from './pages/Search';
import Chats from './pages/Chats';
import Groups from './pages/Groups';
import Channels from './pages/Channels';
import Stories from './pages/Stories';
import Create from './pages/Create';
import Profile from './pages/Profile';

function App() {
  const { currentUser } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Страница логина */}
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Страница регистрации — ТЕПЕРЬ ЕСТЬ! */}
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Защищённые роуты (требуют авторизации) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="chats" element={<Chats />} />
          <Route path="groups" element={<Groups />} />
          <Route path="channels" element={<Channels />} />
          <Route path="stories" element={<Stories />} />
          <Route path="create" element={<Create />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Любой неизвестный путь → на главную (или можно на 404) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;