// src/components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useStore } from "../store/useStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser } = useStore();

  // Если пользователь не авторизован — перенаправляем на страницу логина
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Если авторизован — рендерим то, что передано в children (в твоём случае — Layout с вложенными страницами)
  return <>{children}</>;
}
