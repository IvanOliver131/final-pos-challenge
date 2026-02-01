import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth";

interface RouteGuardProps {
  children: React.ReactNode;
  isPrivate?: boolean;
}

export function RouteGuard({ children, isPrivate = false }: RouteGuardProps) {
  const { isAuthenticated } = useAuthStore();

  if (isPrivate && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isPrivate && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
