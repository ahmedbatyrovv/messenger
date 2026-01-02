import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
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
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" replace /> : <Login />}
        />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
